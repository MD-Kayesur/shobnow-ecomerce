import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ImagePlus, LoaderCircle, Package, Save } from "lucide-react";
import {
  CreateAdminProduct, useCreateAdminProductAttributeMutation,
  useCreateAdminProductMetadataMutation, useCreateAdminProductMutation,
  useCreateAdminProductVariantMutation, useGetAdminBrandsQuery,
  useGetAdminCategoriesQuery, useGetAdminProductAttributesQuery,
  useGetAdminCosmeticDetailsQuery, useGetAdminJewelryDetailsQuery,
  useGetAdminProductMediaQuery, useGetAdminProductMetadataQuery,
  useGetAdminProductQuery, useGetAdminProductVariantsQuery,
  useSaveAdminCosmeticDetailsMutation, useSaveAdminJewelryDetailsMutation,
  useUpdateAdminProductMetadataMutation, useUpdateAdminProductMutation,
  useUploadAdminProductMediaMutation,
} from "@/redux/features/admin/productsApi";
import { useGetTaxonomySubcategoriesQuery } from "@/redux/features/admin/taxonomyApi";

type StepKey = "product" | "media" | "variants" | "attributes" | "metadata" | "categoryDetails";
const steps: Array<{ key: StepKey; title: string; description: string }> = [
  { key: "product", title: "Product details", description: "Save the core catalog record first." },
  { key: "media", title: "Images", description: "Upload at least one product image." },
  { key: "variants", title: "Variants", description: "Add size, color, volume, SKU and stock where applicable." },
  { key: "attributes", title: "Specifications", description: "Add product detail rows such as material or skin type." },
  { key: "metadata", title: "SEO metadata", description: "Add search title, description and keywords." },
  { key: "categoryDetails", title: "Product-specific data", description: "Save cosmetic ingredients or jewelry materials and measurements." },
];

function errorMessage(error: unknown) {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: { message?: string | string[]; errors?: Array<{ field?: string; message?: string }> } }).data;
    if (Array.isArray(data?.message)) return data.message.join(" ");
    if (data?.errors?.length) return data.errors.map((item) => `${item.field ? `${item.field}: ` : ""}${item.message ?? "Invalid value"}`).join(" · ");
    if (data?.message) return data.message;
  }
  return "Could not save this step. Check the fields and try again.";
}

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";
const labelClass = "mb-1.5 block text-xs font-semibold text-gray-600";

export default function AddProductWizardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const [activeStep, setActiveStep] = useState<StepKey>(productId ? (searchParams.get("step") as StepKey) || "media" : "product");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [productForm, setProductForm] = useState<CreateAdminProduct>({
    name: "", price: 0, productType: "SIMPLE", productCategory: "COSMETICS", condition: "NEW",
    authenticityType: "ORIGINAL", status: "DRAFT", displayType: "NORMAL", stock: 0,
    isActive: true, isFeatured: false, shippingRequired: true, taxable: true,
  });
  const [attributeName, setAttributeName] = useState("");
  const [attributeValue, setAttributeValue] = useState("");
  const [metadataForm, setMetadataForm] = useState({ metaTitle: "", metaDescription: "", metaKeywords: "" });
  const [categoryDetailsJson, setCategoryDetailsJson] = useState("{}");
  const [variantForm, setVariantForm] = useState({ variantName: "", sku: "", color: "", size: "", volume: "", unit: "", sellingPrice: "", stockQuantity: "0" });

  const { data: productResult, isFetching: productLoading } = useGetAdminProductQuery(productId ?? "", { skip: !productId });
  const product = productResult?.data;
  const { data: mediaResult, refetch: reloadMedia } = useGetAdminProductMediaQuery(productId ?? "", { skip: !productId });
  const { data: variantsResult, refetch: reloadVariants } = useGetAdminProductVariantsQuery(productId ?? "", { skip: !productId });
  const { data: attributesResult, refetch: reloadAttributes } = useGetAdminProductAttributesQuery(productId ?? "", { skip: !productId });
  const { data: metadataResult, refetch: reloadMetadata } = useGetAdminProductMetadataQuery(productId ?? "", { skip: !productId });
  const productCategory = String(product?.productCategory ?? productForm.productCategory ?? "");
  const { data: cosmeticResult, refetch: reloadCosmetic } = useGetAdminCosmeticDetailsQuery(productId ?? "", { skip: !productId || productCategory !== "COSMETICS" });
  const { data: jewelryResult, refetch: reloadJewelry } = useGetAdminJewelryDetailsQuery(productId ?? "", { skip: !productId || productCategory !== "JEWELRY" });
  const { data: categoryResult } = useGetAdminCategoriesQuery();
  const { data: brandResult } = useGetAdminBrandsQuery();
  const { data: subcategoryResult } = useGetTaxonomySubcategoriesQuery({ page: 1, limit: 100 });
  const [createProduct, createState] = useCreateAdminProductMutation();
  const [updateProduct, updateState] = useUpdateAdminProductMutation();
  const [uploadMedia, uploadState] = useUploadAdminProductMediaMutation();
  const [createVariant, variantState] = useCreateAdminProductVariantMutation();
  const [createAttribute, attributeState] = useCreateAdminProductAttributeMutation();
  const [createMetadata, metadataState] = useCreateAdminProductMetadataMutation();
  const [updateMetadata, updateMetadataState] = useUpdateAdminProductMetadataMutation();
  const [saveCosmetic, cosmeticState] = useSaveAdminCosmeticDetailsMutation();
  const [saveJewelry, jewelryState] = useSaveAdminJewelryDetailsMutation();

  useEffect(() => {
    if (!product) return;
    setProductForm((current) => ({ ...current, ...product, price: Number(product.price), salePrice: product.salePrice == null ? undefined : Number(product.salePrice) }));
  }, [product]);

  useEffect(() => {
    const metadata = metadataResult?.data;
    if (metadata) setMetadataForm({ metaTitle: metadata.metaTitle ?? "", metaDescription: metadata.metaDescription ?? "", metaKeywords: (metadata.metaKeywords ?? []).join(", ") });
  }, [metadataResult]);

  useEffect(() => {
    const savedProduct = productCategory === "COSMETICS" ? cosmeticResult?.data : productCategory === "JEWELRY" ? jewelryResult?.data : undefined;
    if (!savedProduct) return;
    const value = savedProduct as Record<string, any>;
    const details = productCategory === "COSMETICS" ? value.cosmeticDetails ?? {} : value.jewelryDetails ?? {};
    const normalized = productCategory === "COSMETICS" ? {
      texture: details.texture,
      skinTypes: details.skinTypes ?? [],
      concerns: details.concerns ?? [],
      benefits: details.benefits ?? [],
      usageInstructions: details.usageInstructions,
      warnings: details.warnings,
      ingredientsLabel: details.ingredientsLabel,
      fragranceFree: details.fragranceFree,
      alcoholFree: details.alcoholFree,
      vegan: details.vegan,
      crueltyFree: details.crueltyFree,
      volume: details.volume == null ? undefined : Number(details.volume),
      volumeUnit: details.volumeUnit,
      shelfLifeMonths: details.shelfLifeMonths,
      ingredients: (value.productIngredients ?? []).map((row: any) => ({ name: row.ingredient?.name, inciName: row.ingredient?.inciName, ingredientRole: row.ingredientRole, isKeyIngredient: row.isKeyIngredient, concentration: row.concentration == null ? undefined : Number(row.concentration), evidenceStatus: row.evidenceStatus })).filter((row: any) => row.name),
      skinCompatibility: (value.skinCompatibility ?? []).map((row: any) => ({ name: row.skinType?.name, level: row.compatibility, evidenceStatus: row.evidenceStatus })).filter((row: any) => row.name),
      concernCompatibility: (value.concernCompatibility ?? []).map((row: any) => ({ name: row.concern?.name, level: row.compatibility, evidenceStatus: row.evidenceStatus })).filter((row: any) => row.name),
      contraindications: value.contraindications ?? [],
    } : {
      category: details.category,
      metalType: details.metalType,
      metalPurity: details.metalPurity,
      plating: details.plating,
      finish: details.finish,
      style: details.style,
      gender: details.gender,
      occasion: details.occasion ?? [],
      careInstructions: details.careInstructions,
      authenticityNotes: details.authenticityNotes,
      measurements: (value.jewelryMeasurements ?? []).map((row: any) => ({ measurementType: row.measurementType, value: Number(row.value), unit: row.unit, notes: row.notes, variantId: row.variantId })),
      sizes: (value.jewelrySizeOptions ?? []).map((row: any) => ({ label: row.label, value: row.value, region: row.region, isAvailable: row.isAvailable, variantId: row.variantId })),
      materials: (value.jewelryMaterials ?? []).map((row: any) => ({ name: row.material?.name, type: row.material?.type, percentage: row.percentage == null ? undefined : Number(row.percentage), isMainMaterial: row.isMainMaterial })).filter((row: any) => row.name),
      gemstones: (value.gemstones ?? []).map((row: any) => ({ name: row.gemstone?.name, cut: row.cut, carat: row.carat == null ? undefined : Number(row.carat), color: row.color, clarity: row.clarity, isLabGrown: row.isLabGrown })).filter((row: any) => row.name),
    };
    setCategoryDetailsJson(JSON.stringify(normalized, null, 2));
  }, [cosmeticResult, jewelryResult, productCategory]);

  useEffect(() => {
    if (!productId) setActiveStep("product");
    else {
      const requested = searchParams.get("step") as StepKey | null;
      setActiveStep(requested && steps.some((step) => step.key === requested) ? requested : "media");
    }
  }, [productId, searchParams]);

  const media = mediaResult?.data ?? [];
  const variants = variantsResult?.data ?? [];
  const attributes = attributesResult?.data ?? [];
  const metadata = metadataResult?.data ?? null;
  const productType = String(product?.productType ?? productForm.productType ?? "SIMPLE");
  const completion = useMemo(() => {
    const completed = [Boolean(productId), media.length > 0, productType !== "VARIABLE" || variants.length > 0, attributes.length > 0, Boolean(metadata), productCategory === "COSMETICS" ? Boolean(cosmeticResult?.data?.cosmeticDetails) : productCategory === "JEWELRY" ? Boolean(jewelryResult?.data?.jewelryDetails) : true];
    const total = completed.length;
    return { completed, total, percentage: Math.round((completed.filter(Boolean).length / total) * 100) };
  }, [productId, media.length, productType, variants.length, attributes.length, metadata, productCategory, cosmeticResult, jewelryResult]);

  const setStep = (key: StepKey) => {
    setActiveStep(key);
    if (productId) setSearchParams({ productId, step: key });
    setNotice(""); setError("");
  };

  const saveProduct = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setNotice("");
    const body = { ...productForm, status: "DRAFT" } as CreateAdminProduct;
    try {
      const result = productId
        ? await updateProduct({ id: productId, body }).unwrap()
        : await createProduct(body).unwrap();
      const id = result.data.id;
      setSearchParams({ productId: id, step: "media" });
      setActiveStep("media"); setNotice("Product saved as Draft. Continue setup now or come back later from Products.");
    } catch (reason) { setError(errorMessage(reason)); }
  };

  const saveImages = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!productId) return;
    const files = (event.currentTarget.elements.namedItem("images") as HTMLInputElement)?.files;
    if (!files?.length) { setError("Choose one or more image files to upload."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      for (let index = 0; index < files.length; index++) {
        const form = new FormData();
        form.append("image", files[index]); form.append("isPrimary", String(media.length === 0 && index === 0));
        form.append("sortOrder", String(media.length + index));
        await uploadMedia({ id: productId, body: form }).unwrap();
      }
      await reloadMedia(); setNotice("Product images saved.");
    } catch (reason) { setError(errorMessage(reason)); }
    finally { setBusy(false); }
  };

  const saveVariant = async (event: FormEvent) => {
    event.preventDefault(); if (!productId) return;
    setError(""); setNotice("");
    try {
      await createVariant({ productId, body: {
        variantName: variantForm.variantName, sku: variantForm.sku,
        ...(variantForm.color ? { color: variantForm.color } : {}), ...(variantForm.size ? { size: variantForm.size } : {}),
        ...(variantForm.volume ? { volume: Number(variantForm.volume) } : {}), ...(variantForm.unit ? { unit: variantForm.unit } : {}),
        sellingPrice: Number(variantForm.sellingPrice), stockQuantity: Number(variantForm.stockQuantity), isDefault: variants.length === 0,
      } }).unwrap();
      await reloadVariants(); setVariantForm({ variantName: "", sku: "", color: "", size: "", volume: "", unit: "", sellingPrice: "", stockQuantity: "0" });
      setNotice("Variant saved.");
    } catch (reason) { setError(errorMessage(reason)); }
  };

  const saveAttribute = async (event: FormEvent) => {
    event.preventDefault(); if (!productId) return;
    setError(""); setNotice("");
    try {
      await createAttribute({ productId, body: { name: attributeName, value: attributeValue, sortOrder: attributes.length } }).unwrap();
      await reloadAttributes(); setAttributeName(""); setAttributeValue(""); setNotice("Specification saved.");
    } catch (reason) { setError(errorMessage(reason)); }
  };

  const saveMetadata = async (event: FormEvent) => {
    event.preventDefault(); if (!productId) return;
    setError(""); setNotice("");
    const body = { metaTitle: metadataForm.metaTitle, metaDescription: metadataForm.metaDescription, metaKeywords: metadataForm.metaKeywords.split(",").map((word) => word.trim()).filter(Boolean) };
    try {
      if (metadata?.id) await updateMetadata({ id: metadata.id, body }).unwrap();
      else await createMetadata({ productId, body }).unwrap();
      await reloadMetadata(); setNotice("SEO metadata saved.");
    } catch (reason) { setError(errorMessage(reason)); }
  };

  const saveCategoryDetails = async (event: FormEvent) => {
    event.preventDefault(); if (!productId) return;
    setError(""); setNotice("");
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(categoryDetailsJson) as Record<string, unknown>;
      if (!body || Array.isArray(body) || typeof body !== "object") throw new Error();
    } catch { setError("Enter valid JSON object data for this product category."); return; }
    try {
      if (productCategory === "COSMETICS") { await saveCosmetic({ id: productId, body }).unwrap(); await reloadCosmetic(); }
      else if (productCategory === "JEWELRY") { await saveJewelry({ id: productId, body }).unwrap(); await reloadJewelry(); }
      else { setError("Choose Cosmetics or Jewelry in Product details first."); return; }
      setNotice("Category-specific product data saved.");
    } catch (reason) { setError(errorMessage(reason)); }
  };

  const continueStep = (current: StepKey) => {
    const index = steps.findIndex((step) => step.key === current);
    if (index < steps.length - 1) setStep(steps[index + 1].key);
    else setNotice("Setup is complete. The product remains Draft until you publish it from product management.");
  };

  const finishSetup = () => {
    setError("");
    setNotice("Setup is complete. This product remains Draft until you publish it.");
  };

  const saving = busy || createState.isLoading || updateState.isLoading || uploadState.isLoading || variantState.isLoading || attributeState.isLoading || metadataState.isLoading || updateMetadataState.isLoading || cosmeticState.isLoading || jewelryState.isLoading;
  const categories = categoryResult?.data ?? [];
  const brands = brandResult?.data ?? [];
  const subcategories = (subcategoryResult?.data ?? []).filter((row) => row.categoryId === productForm.categoryId);
  const input = (name: keyof CreateAdminProduct, label: string, type = "text", required = false) => (
    <label className="block"><span className={labelClass}>{label}</span><input className={inputClass} type={type} required={required} value={String(productForm[name] ?? "")} onChange={(event) => setProductForm((form) => ({ ...form, [name]: type === "number" ? Number(event.target.value) : event.target.value }))} /></label>
  );

  return <div className="mx-auto max-w-5xl space-y-5 pb-10">
    <div className="flex items-center justify-between gap-3">
      <div><Link to="/admin-dashboard/products" className="mb-3 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary"><ArrowLeft className="h-4 w-4" /> Products</Link><h1 className="text-2xl font-bold text-gray-900">{productId ? "Continue product setup" : "Add a product"}</h1><p className="mt-1 text-sm text-gray-500">Each step saves separately. You can leave and continue later; unfinished products stay Draft.</p></div>
      {productId && <div className="flex items-center gap-3"><div className="min-w-36 rounded-xl border border-gray-200 bg-white px-4 py-3 text-right"><div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Setup progress</div><div className="mt-1 text-xl font-bold text-primary">{completion.percentage}%</div><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${completion.percentage}%` }} /></div></div><Link to="/admin-dashboard/products" className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary">Save and exit</Link></div>}
    </div>

    {productId && <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">{steps.map((step, index) => {
      const done = completion.completed[index]; const active = activeStep === step.key;
      return <button key={step.key} onClick={() => setStep(step.key)} className={`rounded-xl border p-3 text-left transition ${active ? "border-primary bg-pink-50" : "border-gray-200 bg-white hover:border-pink-200"}`}><span className={`mb-2 grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${done ? "bg-emerald-100 text-emerald-700" : active ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>{done ? <Check className="h-3.5 w-3.5" /> : index + 1}</span><span className="block text-xs font-semibold text-gray-800">{step.title}</span><span className={`mt-1 block text-[11px] ${done ? "text-emerald-600" : "text-gray-400"}`}>{done ? "Saved" : "Incomplete"}</span></button>;
    })}</div>}

    {productLoading && <div className="rounded-xl border bg-white p-6 text-sm text-gray-500"><LoaderCircle className="mr-2 inline h-4 w-4 animate-spin" />Loading saved product…</div>}
    {!productLoading && activeStep === "product" && <form onSubmit={saveProduct} className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
      <div><h2 className="text-lg font-bold text-gray-900">1. Product details</h2><p className="mt-1 text-sm text-gray-500">This creates only the product row. Related information is saved in its own table in later steps.</p></div>
      <div className="grid gap-4 sm:grid-cols-2">
        {input("name", "Product name", "text", true)} {input("sku", "Product SKU")}
        {input("price", "Base price", "number", true)} {input("salePrice", "Sale price", "number")}
        {input("stock", "Base stock", "number", true)} {input("sellerName", "Seller name")}
        <label className="block"><span className={labelClass}>Product type</span><select className={inputClass} value={String(productForm.productType)} onChange={(event) => setProductForm((form) => ({ ...form, productType: event.target.value }))}><option value="SIMPLE">Simple</option><option value="VARIABLE">Variable</option></select></label>
        <label className="block"><span className={labelClass}>Product category</span><select className={inputClass} value={String(productForm.productCategory ?? "")} onChange={(event) => setProductForm((form) => ({ ...form, productCategory: event.target.value || undefined }))}><option value="">Select product category</option><option value="COSMETICS">Cosmetics</option><option value="JEWELRY">Jewelry</option></select></label>
        <label className="block"><span className={labelClass}>Store category</span><select className={inputClass} value={String(productForm.categoryId ?? "")} onChange={(event) => setProductForm((form) => ({ ...form, categoryId: event.target.value || undefined, subCategoryId: undefined }))}><option value="">Select category</option>{categories.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>
        <label className="block"><span className={labelClass}>Subcategory</span><select className={inputClass} value={String(productForm.subCategoryId ?? "")} disabled={!productForm.categoryId} onChange={(event) => setProductForm((form) => ({ ...form, subCategoryId: event.target.value || undefined }))}><option value="">Select subcategory</option>{subcategories.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>
        <label className="block"><span className={labelClass}>Brand</span><select className={inputClass} value={String(productForm.brandId ?? "")} onChange={(event) => setProductForm((form) => ({ ...form, brandId: event.target.value || undefined }))}><option value="">Select brand</option>{brands.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>
        {input("manufacturer", "Manufacturer")}{input("countryOfOrigin", "Country of origin")}
        <label className="block"><span className={labelClass}>Condition</span><select className={inputClass} value={String(productForm.condition ?? "NEW")} onChange={(event) => setProductForm((form) => ({ ...form, condition: event.target.value }))}><option value="NEW">New</option><option value="USED">Used</option></select></label>
        <label className="block"><span className={labelClass}>Authenticity</span><select className={inputClass} value={String(productForm.authenticityType ?? "ORIGINAL")} onChange={(event) => setProductForm((form) => ({ ...form, authenticityType: event.target.value }))}><option value="ORIGINAL">Original</option><option value="INSPIRED">Inspired</option><option value="MASTER_COPY">Master copy</option><option value="REPLICA">Replica</option><option value="UNBRANDED">Unbranded</option></select></label>
        <label className="block"><span className={labelClass}>Product status</span><div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm font-semibold text-amber-800">Draft until published</div></label>
        <label className="block sm:col-span-2"><span className={labelClass}>Short description</span><textarea className={inputClass} rows={2} value={String(productForm.shortDescription ?? "")} onChange={(event) => setProductForm((form) => ({ ...form, shortDescription: event.target.value }))} /></label>
        <label className="block sm:col-span-2"><span className={labelClass}>Full description</span><textarea className={inputClass} rows={4} value={String(productForm.description ?? "")} onChange={(event) => setProductForm((form) => ({ ...form, description: event.target.value }))} /></label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4"><span className="text-xs text-amber-700">New products are always saved as Draft. Publishing is a separate action.</span><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"><Save className="h-4 w-4" />{saving ? "Saving…" : productId ? "Save product" : "Save product & continue"}</button></div>
    </form>}

    {productId && activeStep === "media" && <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7"><div><h2 className="text-lg font-bold text-gray-900">2. Product images</h2><p className="mt-1 text-sm text-gray-500">Upload files directly. The first image becomes the primary product image. You may skip this and return later.</p></div><form onSubmit={saveImages} className="flex flex-col gap-4 sm:flex-row sm:items-end"><label className="block flex-1"><span className={labelClass}>Images (JPEG, PNG, WebP or SVG; max 2 MB each)</span><input name="images" type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" multiple className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-pink-50 file:px-3 file:py-2`} /></label><button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"><ImagePlus className="h-4 w-4" />Upload selected</button></form><div className="grid gap-3 sm:grid-cols-2">{media.map((row) => <div key={row.id} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"><img src={row.imageUrl.startsWith("http") ? row.imageUrl : `${(import.meta.env.VITE_API_ENDPOINT || "http://localhost:4001/api/v1").replace(/\/api\/v\d+\/?$/, "")}${row.imageUrl}`} alt={row.altText || "Product"} className="h-14 w-14 rounded-lg object-cover"/><div className="min-w-0"><div className="truncate text-sm font-semibold">{row.altText || row.imageRole || "Product image"}</div><div className="text-xs text-gray-500">{row.isPrimary ? "Primary image" : `Gallery position ${row.sortOrder + 1}`}</div></div></div>)}</div><div className="flex justify-end gap-2"><button onClick={() => continueStep("media")} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600">Skip for now</button><button disabled={!media.length} onClick={() => continueStep("media")} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Continue <ArrowRight className="h-4 w-4"/></button></div></section>}

    {productId && activeStep === "variants" && <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7"><div><h2 className="text-lg font-bold text-gray-900">3. Variants</h2><p className="mt-1 text-sm text-gray-500">Examples: 30ml/50ml serum or ring sizes. Simple products may skip this step.</p></div><form onSubmit={saveVariant} className="grid gap-3 sm:grid-cols-2">{(["variantName","sku","color","size","volume","unit","sellingPrice","stockQuantity"] as const).map((key) => <label key={key} className="block"><span className={labelClass}>{({variantName:"Variant name",sku:"Variant SKU",color:"Color",size:"Size",volume:"Volume / weight",unit:"Unit",sellingPrice:"Selling price",stockQuantity:"Stock quantity"})[key]}</span><input required={key === "variantName" || key === "sku" || key === "sellingPrice"} type={key === "volume" || key === "sellingPrice" || key === "stockQuantity" ? "number" : "text"} min={key === "volume" || key === "sellingPrice" || key === "stockQuantity" ? 0 : undefined} className={inputClass} value={variantForm[key]} onChange={(event) => setVariantForm((form) => ({ ...form, [key]: event.target.value }))}/></label>)}<div className="sm:col-span-2"><button disabled={saving} className="rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary disabled:opacity-50">{saving ? "Saving…" : "Add variant"}</button></div></form><div className="space-y-2">{variants.map((row) => <div key={row.id} className="flex justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm"><span className="font-medium">{row.variantName} <span className="text-gray-400">· {row.sku}</span></span><span>{row.stockQuantity} in stock</span></div>)}</div><div className="flex justify-end gap-2"><button onClick={() => continueStep("variants")} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600">Skip for now</button><button disabled={productType === "VARIABLE" && !variants.length} onClick={() => continueStep("variants")} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Continue <ArrowRight className="h-4 w-4"/></button></div></section>}

    {productId && activeStep === "attributes" && <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7"><div><h2 className="text-lg font-bold text-gray-900">4. Specifications</h2><p className="mt-1 text-sm text-gray-500">Add display-only facts such as material, skin type, finish or care instructions.</p></div><form onSubmit={saveAttribute} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto] sm:items-end"><label><span className={labelClass}>Name</span><input required className={inputClass} value={attributeName} onChange={(event) => setAttributeName(event.target.value)} placeholder="e.g. Material"/></label><label><span className={labelClass}>Value</span><input required className={inputClass} value={attributeValue} onChange={(event) => setAttributeValue(event.target.value)} placeholder="e.g. 18K gold plated"/></label><button disabled={saving} className="rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary disabled:opacity-50">Add specification</button></form><div className="divide-y rounded-xl border border-gray-100">{attributes.map((row) => <div key={row.id} className="flex justify-between px-4 py-3 text-sm"><strong>{row.name}</strong><span className="text-gray-600">{row.value}</span></div>)}{!attributes.length && <div className="p-4 text-sm text-gray-400">No specifications saved yet.</div>}</div><div className="flex justify-end gap-2"><button onClick={() => continueStep("attributes")} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600">Skip for now</button><button disabled={!attributes.length} onClick={() => continueStep("attributes")} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Continue <ArrowRight className="h-4 w-4"/></button></div></section>}

    {productId && activeStep === "metadata" && <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7"><div><h2 className="text-lg font-bold text-gray-900">5. Search metadata</h2><p className="mt-1 text-sm text-gray-500">This SEO row is saved separately from the Product row.</p></div><form onSubmit={saveMetadata} className="space-y-4"><label className="block"><span className={labelClass}>Meta title</span><input className={inputClass} maxLength={200} value={metadataForm.metaTitle} onChange={(event) => setMetadataForm((form) => ({ ...form, metaTitle: event.target.value }))}/></label><label className="block"><span className={labelClass}>Meta description</span><textarea className={inputClass} rows={3} maxLength={500} value={metadataForm.metaDescription} onChange={(event) => setMetadataForm((form) => ({ ...form, metaDescription: event.target.value }))}/></label><label className="block"><span className={labelClass}>Keywords (comma separated)</span><input className={inputClass} value={metadataForm.metaKeywords} onChange={(event) => setMetadataForm((form) => ({ ...form, metaKeywords: event.target.value }))} placeholder="serum, skincare, niacinamide"/></label><div className="flex flex-wrap justify-end gap-2"><button type="button" onClick={() => continueStep("metadata")} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600">Skip for now</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Save className="h-4 w-4"/>{saving ? "Saving…" : metadata ? "Update metadata" : "Save metadata"}</button></div></form>{metadata && <div className="flex justify-end"><button onClick={() => setStep("categoryDetails")} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white">Continue to product-specific data</button></div>}</section>}

    {productId && activeStep === "categoryDetails" && <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7"><div><h2 className="text-lg font-bold text-gray-900">6. {productCategory === "JEWELRY" ? "Jewelry details" : "Cosmetic details"}</h2><p className="mt-1 text-sm text-gray-500">Save category-specific tables: cosmetic ingredients and skin compatibility, or jewelry materials, gemstones, sizes and measurements.</p></div>{productCategory === "COSMETICS" || productCategory === "JEWELRY" ? <form onSubmit={saveCategoryDetails} className="space-y-3"><label className="block"><span className={labelClass}>Validated JSON fields for {productCategory === "JEWELRY" ? "jewelry" : "cosmetics"}</span><textarea className={`${inputClass} font-mono text-xs`} rows={15} value={categoryDetailsJson} onChange={(event) => setCategoryDetailsJson(event.target.value)} spellCheck={false}/></label><p className="text-xs text-gray-500">The backend validates these fields against its category-specific schema. You can skip and return later.</p><div className="flex flex-wrap justify-end gap-2"><button type="button" onClick={() => continueStep("categoryDetails")} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600">Skip for now</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Save className="h-4 w-4"/>{saving ? "Saving…" : "Save category details"}</button></div></form> : <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Select Cosmetics or Jewelry in Product details to use this step. <button onClick={() => setStep("product")} className="ml-1 font-semibold underline">Edit product category</button></div>}{(Boolean(productCategory === "COSMETICS" && cosmeticResult?.data?.cosmeticDetails) || Boolean(productCategory === "JEWELRY" && jewelryResult?.data?.jewelryDetails)) && <div className="flex justify-end"><button onClick={finishSetup} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white">Finish setup</button></div>}</section>}

    {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}
    {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
    {productId && product && <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs text-gray-500"><span><Package className="mr-1 inline h-4 w-4"/>Draft product · {product.name}</span><span>{completion.percentage}% complete · {completion.completed.filter(Boolean).length}/{completion.total} steps</span></div>}
  </div>;
}
