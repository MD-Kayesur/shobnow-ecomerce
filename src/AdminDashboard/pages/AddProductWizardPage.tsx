import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ImagePlus, LoaderCircle, Package, Pencil, Save, Trash2 } from "lucide-react";
import {
  CreateAdminProduct, useCreateAdminProductAttributeMutation, useDeleteAdminProductAttributeMutation,
  useDeleteAdminProductMediaMutation, useDeleteAdminProductVariantMutation,
  useCreateAdminProductMetadataMutation, useCreateAdminProductMutation,
  useCreateAdminProductVariantMutation, useGetAdminBrandsQuery,
  useGetAdminCategoriesQuery, useGetAdminProductAttributesQuery,
  useGetAdminCosmeticDetailsQuery, useGetAdminJewelryDetailsQuery,
  useGetAdminProductMediaQuery, useGetAdminProductMetadataQuery,
  useGetAdminProductQuery, useGetAdminProductVariantsQuery,
  useSaveAdminCosmeticDetailsMutation, useSaveAdminJewelryDetailsMutation,
  useUpdateAdminProductAttributeMutation, useUpdateAdminProductMediaMutation,
  useUpdateAdminProductMetadataMutation, useUpdateAdminProductMutation,
  useUpdateAdminProductVariantMutation, useUploadAdminProductMediaMutation,
} from "@/redux/features/admin/productsApi";
import { useGetTaxonomySubcategoriesQuery } from "@/redux/features/admin/taxonomyApi";

type StepKey = "product" | "media" | "variants" | "attributes" | "metadata" | "categoryDetails" | "faq";
const steps: Array<{ key: StepKey; title: string; description: string }> = [
  { key: "product", title: "Product details", description: "Save the core catalog record first." },
  { key: "media", title: "Images", description: "Upload at least one product image." },
  { key: "variants", title: "Variants", description: "Add size, color, volume, SKU and stock where applicable." },
  { key: "attributes", title: "Specifications", description: "Add product detail rows such as material or skin type." },
  { key: "metadata", title: "SEO metadata", description: "Add search title, description and keywords." },
  { key: "categoryDetails", title: "Product-specific data", description: "Save cosmetic ingredients or jewelry materials and measurements." },
  { key: "faq", title: "FAQs", description: "Write product questions and answers for shoppers." },
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

type JewelryMeasurementForm = { measurementType: string; value: string; unit: string; notes: string; variantId: string };
type JewelrySizeForm = { label: string; value: string; region: string; isAvailable: boolean; variantId: string };
type JewelryMaterialForm = { name: string; type: string; percentage: string; isMainMaterial: boolean };
type JewelryGemstoneForm = { name: string; cut: string; carat: string; color: string; clarity: string; isLabGrown: boolean };
type JewelryForm = {
  category: string; metalType: string; metalPurity: string; plating: string; finish: string; style: string;
  gender: string; occasion: string; careInstructions: string; authenticityNotes: string;
  measurements: JewelryMeasurementForm[]; sizes: JewelrySizeForm[];
  materials: JewelryMaterialForm[]; gemstones: JewelryGemstoneForm[];
};

const emptyJewelryForm = (): JewelryForm => ({
  category: "", metalType: "", metalPurity: "", plating: "", finish: "", style: "", gender: "",
  occasion: "", careInstructions: "", authenticityNotes: "", measurements: [], sizes: [], materials: [], gemstones: [],
});

export default function AddProductWizardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const [activeStep, setActiveStep] = useState<StepKey>(productId ? (searchParams.get("step") as StepKey) || "media" : "product");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [productForm, setProductForm] = useState<CreateAdminProduct>({
    name: "", price: 0, productType: "SIMPLE", productCategory: "", condition: "NEW",
    authenticityType: "ORIGINAL", status: "DRAFT", displayType: "NORMAL", stock: 0,
    isActive: true, isFeatured: false, shippingRequired: true, taxable: true,
  });
  const [attributeName, setAttributeName] = useState("");
  const [attributeValue, setAttributeValue] = useState("");
  const [editingAttributeId, setEditingAttributeId] = useState<string | null>(null);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [metadataForm, setMetadataForm] = useState({ metaTitle: "", metaDescription: "", metaKeywords: "" });
  const [categoryDetailsJson, setCategoryDetailsJson] = useState("{}");
  const [faqItems, setFaqItems] = useState<Array<{ question: string; answer: string }>>([]);
  const [cosmeticUsageInstructions, setCosmeticUsageInstructions] = useState("");
  const [jewelryForm, setJewelryForm] = useState<JewelryForm>(emptyJewelryForm);
  const [variantForm, setVariantForm] = useState({ variantName: "", sku: "", color: "", size: "", weight: "", volume: "", unit: "", sellingPrice: "", stockQuantity: "0" });

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
  const [updateMedia, updateMediaState] = useUpdateAdminProductMediaMutation();
  const [deleteMedia] = useDeleteAdminProductMediaMutation();
  const [createVariant, variantState] = useCreateAdminProductVariantMutation();
  const [updateVariant] = useUpdateAdminProductVariantMutation();
  const [deleteVariant] = useDeleteAdminProductVariantMutation();
  const [createAttribute, attributeState] = useCreateAdminProductAttributeMutation();
  const [updateAttribute] = useUpdateAdminProductAttributeMutation();
  const [deleteAttribute] = useDeleteAdminProductAttributeMutation();
  const [createMetadata, metadataState] = useCreateAdminProductMetadataMutation();
  const [updateMetadata, updateMetadataState] = useUpdateAdminProductMetadataMutation();
  const [saveCosmetic, cosmeticState] = useSaveAdminCosmeticDetailsMutation();
  const [saveJewelry, jewelryState] = useSaveAdminJewelryDetailsMutation();

  useEffect(() => {
    if (!product) return;
    setProductForm((current) => ({ ...current, ...product, price: Number(product.price), salePrice: product.salePrice == null ? undefined : Number(product.salePrice) }));
    setFaqItems(Array.isArray(product.faq) ? product.faq : []);
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
    if (productCategory === "JEWELRY") {
      const jewelry = normalized as Record<string, any>;
      setJewelryForm({
        ...emptyJewelryForm(),
        category: jewelry.category ?? "", metalType: jewelry.metalType ?? "", metalPurity: jewelry.metalPurity ?? "",
        plating: jewelry.plating ?? "", finish: jewelry.finish ?? "", style: jewelry.style ?? "", gender: jewelry.gender ?? "",
        occasion: (jewelry.occasion ?? []).join(", "), careInstructions: jewelry.careInstructions ?? "", authenticityNotes: jewelry.authenticityNotes ?? "",
        measurements: (jewelry.measurements ?? []).map((row: any) => ({ ...row, value: row.value == null ? "" : String(row.value), notes: row.notes ?? "", variantId: row.variantId ?? "" })),
        sizes: (jewelry.sizes ?? []).map((row: any) => ({ ...row, region: row.region ?? "", isAvailable: row.isAvailable ?? true, variantId: row.variantId ?? "" })),
        materials: (jewelry.materials ?? []).map((row: any) => ({ ...row, type: row.type ?? "", percentage: row.percentage == null ? "" : String(row.percentage), isMainMaterial: row.isMainMaterial ?? false })),
        gemstones: (jewelry.gemstones ?? []).map((row: any) => ({ ...row, cut: row.cut ?? "", carat: row.carat == null ? "" : String(row.carat), color: row.color ?? "", clarity: row.clarity ?? "", isLabGrown: row.isLabGrown ?? false })),
      });
    } else {
      setCosmeticUsageInstructions(details.usageInstructions ?? "");
      setCategoryDetailsJson(JSON.stringify(normalized, null, 2));
    }
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
    const completed = [Boolean(productId), media.length > 0, productType !== "VARIABLE" || variants.length > 0, attributes.length > 0, Boolean(metadata), productCategory === "COSMETICS" ? Boolean(cosmeticResult?.data?.cosmeticDetails) : productCategory === "JEWELRY" ? Boolean(jewelryResult?.data?.jewelryDetails) : true, Boolean(product?.faq?.length)];
    const total = completed.length;
    return { completed, total, percentage: Math.round((completed.filter(Boolean).length / total) * 100) };
  }, [productId, media.length, productType, variants.length, attributes.length, metadata, productCategory, cosmeticResult, jewelryResult, product?.faq]);

  const setStep = (key: StepKey) => {
    setActiveStep(key);
    if (productId) setSearchParams({ productId, step: key });
    setNotice(""); setError("");
  };

  const saveProduct = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setNotice("");
    const selectedStatus = String(productForm.status ?? product?.status ?? "DRAFT");
    // Do not spread the GET response into PATCH: it contains read-only fields
    // such as id, slug, createdAt and deletedAt that the strict backend DTO rejects.
    const body: CreateAdminProduct = {
      name: productForm.name,
      price: Number(productForm.price),
      shortDescription: productForm.shortDescription ?? undefined,
      description: productForm.description ?? undefined,
      productType: productForm.productType,
      productCategory: productForm.productCategory,
      condition: productForm.condition,
      authenticityType: productForm.authenticityType,
      authenticityVerified: productForm.authenticityVerified,
      countryOfOrigin: productForm.countryOfOrigin ?? undefined,
      manufacturer: productForm.manufacturer ?? undefined,
      sellerName: productForm.sellerName ?? undefined,
      status: selectedStatus,
      displayType: productForm.displayType ?? "NORMAL",
      salePrice: productForm.salePrice == null ? undefined : Number(productForm.salePrice),
      stock: productForm.stock == null ? undefined : Number(productForm.stock),
      sku: productForm.sku ?? undefined,
      isFeatured: productForm.displayType === "FEATURED",
      // Keep the two backend visibility fields consistent with the chosen status.
      isActive: selectedStatus === "ACTIVE"
        ? true
        : selectedStatus === "INACTIVE" || selectedStatus === "ARCHIVED"
          ? false
          : product?.isActive ?? productForm.isActive ?? true,
      categoryId: productForm.categoryId ?? undefined,
      subCategoryId: productForm.subCategoryId ?? undefined,
      brandId: productForm.brandId ?? undefined,
      shippingRequired: productForm.shippingRequired,
      taxable: productForm.taxable,
    } as CreateAdminProduct;
    try {
      const result = productId
        ? await updateProduct({ id: productId, body }).unwrap()
        : await createProduct(body).unwrap();
      const id = result.data.id;
      if (productId) {
        setNotice("Product information updated. Its current status was preserved.");
      } else {
        setSearchParams({ productId: id, step: "media" });
        setActiveStep("media"); setNotice("Product saved as Draft. Continue setup now or come back later from Products.");
      }
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

  const saveMediaDetails = async (event: FormEvent<HTMLFormElement>, row: (typeof media)[number]) => {
    event.preventDefault();
    if (!productId) return;
    const form = new FormData(event.currentTarget);
    const body = new FormData();
    const file = form.get("replacementImage");
    if (file instanceof File && file.size > 0) body.append("image", file);
    for (const key of ["altText", "isPrimary", "sortOrder"]) {
      const value = form.get(key);
      if (value !== null) body.append(key, String(value));
    }
    const imageRole = form.get("imageRole");
    if (imageRole) body.append("imageRole", String(imageRole));
    setError(""); setNotice("");
    try {
      await updateMedia({ id: row.id, body }).unwrap();
      await reloadMedia();
      setEditingMediaId(null);
      setNotice("Image information updated.");
    } catch (reason) { setError(errorMessage(reason)); }
  };

  const removeMedia = async (row: (typeof media)[number]) => {
    if (!productId || !window.confirm("Delete this product image?")) return;
    setError(""); setNotice("");
    try {
      await deleteMedia({ id: row.id, productId }).unwrap();
      await reloadMedia();
      setNotice("Product image deleted.");
    } catch (reason) { setError(errorMessage(reason)); }
  };

  const saveVariant = async (event: FormEvent) => {
    event.preventDefault(); if (!productId) return;
    setError(""); setNotice("");
    try {
      const body = {
        variantName: variantForm.variantName, sku: variantForm.sku,
        ...(variantForm.color ? { color: variantForm.color } : {}), ...(variantForm.size ? { size: variantForm.size } : {}),
        ...(variantForm.weight ? { weight: Number(variantForm.weight) } : {}),
        ...(variantForm.volume ? { volume: Number(variantForm.volume) } : {}), ...(variantForm.unit ? { unit: variantForm.unit } : {}),
        sellingPrice: Number(variantForm.sellingPrice), stockQuantity: Number(variantForm.stockQuantity), isDefault: editingVariantId ? variants.find((row) => row.id === editingVariantId)?.isDefault ?? false : variants.length === 0,
      };
      if (editingVariantId) await updateVariant({ id: editingVariantId, productId, body }).unwrap();
      else await createVariant({ productId, body }).unwrap();
      await reloadVariants(); setVariantForm({ variantName: "", sku: "", color: "", size: "", weight: "", volume: "", unit: "", sellingPrice: "", stockQuantity: "0" });
      setEditingVariantId(null); setNotice("Variant saved.");
    } catch (reason) { setError(errorMessage(reason)); }
  };

  const editVariant = (row: (typeof variants)[number]) => {
    setEditingVariantId(row.id);
    setVariantForm({ variantName: row.variantName, sku: row.sku ?? "", color: row.color ?? "", size: row.size ?? "", weight: row.weight == null ? "" : String(row.weight), volume: row.volume == null ? "" : String(row.volume), unit: row.unit ?? "", sellingPrice: String(row.sellingPrice), stockQuantity: String(row.stockQuantity) });
    setError(""); setNotice("");
  };

  const removeVariant = async (row: (typeof variants)[number]) => {
    if (!productId || !window.confirm(`Delete variant “${row.variantName}”?`)) return;
    setError(""); setNotice("");
    try {
      await deleteVariant({ id: row.id, productId }).unwrap();
      await reloadVariants();
      if (editingVariantId === row.id) { setEditingVariantId(null); setVariantForm({ variantName: "", sku: "", color: "", size: "", weight: "", volume: "", unit: "", sellingPrice: "", stockQuantity: "0" }); }
      setNotice("Variant deleted.");
    } catch (reason) { setError(errorMessage(reason)); }
  };

  const saveAttribute = async (event: FormEvent) => {
    event.preventDefault(); if (!productId) return;
    setError(""); setNotice("");
    try {
      const body = { name: attributeName, value: attributeValue, sortOrder: editingAttributeId ? attributes.find((row) => row.id === editingAttributeId)?.sortOrder ?? 0 : attributes.length };
      if (editingAttributeId) await updateAttribute({ id: editingAttributeId, productId, body }).unwrap();
      else await createAttribute({ productId, body }).unwrap();
      await reloadAttributes(); setAttributeName(""); setAttributeValue(""); setEditingAttributeId(null); setNotice("Specification saved.");
    } catch (reason) { setError(errorMessage(reason)); }
  };

  const editAttribute = (row: (typeof attributes)[number]) => {
    setEditingAttributeId(row.id); setAttributeName(row.name); setAttributeValue(row.value); setError(""); setNotice("");
  };

  const removeAttribute = async (row: (typeof attributes)[number]) => {
    if (!productId || !window.confirm(`Delete specification “${row.name}”?`)) return;
    setError(""); setNotice("");
    try {
      await deleteAttribute({ id: row.id, productId }).unwrap();
      await reloadAttributes();
      if (editingAttributeId === row.id) { setEditingAttributeId(null); setAttributeName(""); setAttributeValue(""); }
      setNotice("Specification deleted.");
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
    if (productCategory === "JEWELRY") {
      body = {
        ...(jewelryForm.category ? { category: jewelryForm.category } : {}),
        ...(jewelryForm.metalType ? { metalType: jewelryForm.metalType } : {}),
        ...(jewelryForm.metalPurity ? { metalPurity: jewelryForm.metalPurity } : {}),
        ...(jewelryForm.plating ? { plating: jewelryForm.plating } : {}),
        ...(jewelryForm.finish ? { finish: jewelryForm.finish } : {}),
        ...(jewelryForm.style ? { style: jewelryForm.style } : {}),
        ...(jewelryForm.gender ? { gender: jewelryForm.gender } : {}),
        occasion: jewelryForm.occasion.split(",").map((item) => item.trim()).filter(Boolean),
        ...(jewelryForm.careInstructions ? { careInstructions: jewelryForm.careInstructions } : {}),
        ...(jewelryForm.authenticityNotes ? { authenticityNotes: jewelryForm.authenticityNotes } : {}),
        measurements: jewelryForm.measurements.filter((row) => row.measurementType && row.value !== "" && row.unit).map((row) => ({ measurementType: row.measurementType, value: Number(row.value), unit: row.unit, ...(row.notes ? { notes: row.notes } : {}), ...(row.variantId ? { variantId: row.variantId } : {}) })),
        sizes: jewelryForm.sizes.filter((row) => row.label && row.value).map((row) => ({ label: row.label, value: row.value, ...(row.region ? { region: row.region } : {}), isAvailable: row.isAvailable, ...(row.variantId ? { variantId: row.variantId } : {}) })),
        materials: jewelryForm.materials.filter((row) => row.name).map((row) => ({ name: row.name, ...(row.type ? { type: row.type } : {}), ...(row.percentage !== "" ? { percentage: Number(row.percentage) } : {}), isMainMaterial: row.isMainMaterial })),
        gemstones: jewelryForm.gemstones.filter((row) => row.name).map((row) => ({ name: row.name, ...(row.cut ? { cut: row.cut } : {}), ...(row.carat !== "" ? { carat: Number(row.carat) } : {}), ...(row.color ? { color: row.color } : {}), ...(row.clarity ? { clarity: row.clarity } : {}), isLabGrown: row.isLabGrown })),
      };
    } else {
      try {
        body = JSON.parse(categoryDetailsJson) as Record<string, unknown>;
        if (!body || Array.isArray(body) || typeof body !== "object") throw new Error();
      } catch { setError("Enter valid JSON object data for this product category."); return; }
      body.usageInstructions = cosmeticUsageInstructions.trim() || null;
    }
    try {
      if (productCategory === "COSMETICS") { await saveCosmetic({ id: productId, body }).unwrap(); await reloadCosmetic(); }
      else if (productCategory === "JEWELRY") { await saveJewelry({ id: productId, body }).unwrap(); await reloadJewelry(); }
      else { setError("Choose Cosmetics or Jewelry in Product details first."); return; }
      setNotice("Category-specific product data saved.");
    } catch (reason) { setError(errorMessage(reason)); }
  };

  const saveFaq = async (event: FormEvent) => {
    event.preventDefault(); if (!productId) return;
    setError(""); setNotice("");
    const faq = faqItems.map((item) => ({ question: item.question.trim(), answer: item.answer.trim() })).filter((item) => item.question && item.answer);
    if (faqItems.some((item) => !item.question.trim() || !item.answer.trim())) {
      setError("Complete both the question and answer, or remove the empty row."); return;
    }
    try {
      await updateProduct({ id: productId, body: { faq } }).unwrap();
      setNotice(faq.length ? "Product FAQs saved. They will appear in the storefront FAQ tab." : "Product FAQs cleared.");
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
      <div><Link to="/admin-dashboard/products" className="mb-3 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary"><ArrowLeft className="h-4 w-4" /> Products</Link><h1 className="text-2xl font-bold text-gray-900">{productId ? `Edit product${product?.name ? ` · ${product.name}` : ""}` : "Add a product"}</h1><p className="mt-1 text-sm text-gray-500">Edit any section below. Changes are saved separately, and editing keeps the product’s current status.</p></div>
      {productId && <div className="flex items-center gap-3"><div className="min-w-36 rounded-xl border border-gray-200 bg-white px-4 py-3 text-right"><div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Setup progress</div><div className="mt-1 text-xl font-bold text-primary">{completion.percentage}%</div><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${completion.percentage}%` }} /></div></div><Link to="/admin-dashboard/products" className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary">Save and exit</Link></div>}
    </div>

    {productId && <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">{steps.map((step, index) => {
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
        <label className="block"><span className={labelClass}>Variant setup</span><select className={inputClass} value={String(productForm.productType)} onChange={(event) => setProductForm((form) => ({ ...form, productType: event.target.value }))}><option value="SIMPLE">Simple — one purchasable version</option><option value="VARIABLE">Variable — multiple purchasable versions</option></select></label>
        <label className="block"><span className={labelClass}>Product data profile</span><select required className={inputClass} value={String(productForm.productCategory ?? "")} onChange={(event) => setProductForm((form) => ({ ...form, productCategory: event.target.value || undefined }))}><option value="">Select product profile</option><option value="COSMETICS">Cosmetics</option><option value="JEWELRY">Jewelry</option></select></label>
        <label className="block"><span className={labelClass}>Storefront category</span><select className={inputClass} value={String(productForm.categoryId ?? "")} onChange={(event) => setProductForm((form) => ({ ...form, categoryId: event.target.value || undefined, subCategoryId: undefined }))}><option value="">Select a store category</option>{categories.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>
        <label className="block"><span className={labelClass}>Storefront subcategory</span><select className={inputClass} value={String(productForm.subCategoryId ?? "")} disabled={!productForm.categoryId} onChange={(event) => setProductForm((form) => ({ ...form, subCategoryId: event.target.value || undefined }))}><option value="">Select a subcategory (optional)</option>{subcategories.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>
        <label className="block"><span className={labelClass}>Brand</span><select className={inputClass} value={String(productForm.brandId ?? "")} onChange={(event) => setProductForm((form) => ({ ...form, brandId: event.target.value || undefined }))}><option value="">Select brand</option>{brands.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>
        {input("manufacturer", "Manufacturer")}{input("countryOfOrigin", "Country of origin")}
        <label className="block"><span className={labelClass}>Condition</span><select className={inputClass} value={String(productForm.condition ?? "NEW")} onChange={(event) => setProductForm((form) => ({ ...form, condition: event.target.value }))}><option value="NEW">New</option><option value="USED">Used</option></select></label>
        <label className="block"><span className={labelClass}>Authenticity</span><select className={inputClass} value={String(productForm.authenticityType ?? "ORIGINAL")} onChange={(event) => setProductForm((form) => ({ ...form, authenticityType: event.target.value }))}><option value="ORIGINAL">Original</option><option value="INSPIRED">Inspired</option><option value="MASTER_COPY">Master copy</option><option value="REPLICA">Replica</option><option value="UNBRANDED">Unbranded</option></select></label>
        <label className="block"><span className={labelClass}>Publishing status</span>{productId ? <select className={inputClass} value={String(productForm.status ?? product?.status ?? "DRAFT")} onChange={(event) => setProductForm((form) => ({ ...form, status: event.target.value, isActive: event.target.value === "ACTIVE" ? true : event.target.value === "INACTIVE" || event.target.value === "ARCHIVED" ? false : form.isActive }))}><option value="DRAFT">Draft — hidden until published</option><option value="ACTIVE">Active — visible in the store</option><option value="INACTIVE">Inactive — temporarily hidden</option><option value="ARCHIVED">Archived</option></select> : <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm font-semibold text-amber-800">Draft — you can publish after creating the product</div>}</label>
        <label className="block"><span className={labelClass}>Storefront display type</span><select className={inputClass} value={String(productForm.displayType ?? "NORMAL")} onChange={(event) => setProductForm((form) => ({ ...form, displayType: event.target.value, isFeatured: event.target.value === "FEATURED" }))}><option value="NORMAL">Normal product</option><option value="FEATURED">Featured product</option><option value="NEW_ARRIVAL">New arrival</option></select></label>
        <label className="block sm:col-span-2"><span className={labelClass}>Short description</span><textarea className={inputClass} rows={2} value={String(productForm.shortDescription ?? "")} onChange={(event) => setProductForm((form) => ({ ...form, shortDescription: event.target.value }))} /></label>
        <label className="block sm:col-span-2"><span className={labelClass}>Full description</span><textarea className={inputClass} rows={4} value={String(productForm.description ?? "")} onChange={(event) => setProductForm((form) => ({ ...form, description: event.target.value }))} /></label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4"><span className="text-xs text-amber-700">{productId ? "Status controls store visibility; display type controls whether the product is normal, featured, or a new arrival." : "New products start as Draft. After saving, edit the product to publish it."}</span><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"><Save className="h-4 w-4" />{saving ? "Saving…" : productId ? "Save product changes" : "Save product & continue"}</button></div>
    </form>}

    {productId && activeStep === "media" && <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7"><div><h2 className="text-lg font-bold text-gray-900">2. Product images</h2><p className="mt-1 text-sm text-gray-500">Upload files directly. Edit each image’s description, role, primary flag and display order below.</p></div><form onSubmit={saveImages} className="flex flex-col gap-4 sm:flex-row sm:items-end"><label className="block flex-1"><span className={labelClass}>Images (JPEG, PNG, WebP or SVG; max 2 MB each)</span><input name="images" type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" multiple className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-pink-50 file:px-3 file:py-2`} /></label><button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"><ImagePlus className="h-4 w-4" />Upload selected</button></form><div className="grid gap-3 sm:grid-cols-2">{media.map((row) => <div key={row.id} className="rounded-xl border border-gray-100 p-3"><div className="flex items-center gap-3"><img src={row.imageUrl.startsWith("http") ? row.imageUrl : `${(import.meta.env.VITE_API_ENDPOINT || "http://localhost:4001/api/v1").replace(/\/api\/v\d+\/?$/, "")}${row.imageUrl}`} alt={row.altText || "Product"} className="h-14 w-14 rounded-lg object-cover"/><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{row.altText || row.imageRole || "Product image"}</div><div className="text-xs text-gray-500">{row.isPrimary ? "Primary image" : `Gallery position ${row.sortOrder + 1}`} · {row.imageRole || "No role"}</div></div><button type="button" onClick={() => setEditingMediaId(editingMediaId === row.id ? null : row.id)} className="rounded-lg p-2 text-gray-500 hover:bg-pink-50 hover:text-primary" title="Edit image details"><Pencil className="h-4 w-4"/></button><button type="button" onClick={() => void removeMedia(row)} className="rounded-lg p-2 text-gray-500 hover:bg-rose-50 hover:text-rose-600" title="Delete image"><Trash2 className="h-4 w-4"/></button></div>{editingMediaId === row.id && <form onSubmit={(event) => void saveMediaDetails(event, row)} className="mt-4 grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2"><label><span className={labelClass}>Alt text</span><input name="altText" defaultValue={row.altText ?? ""} className={inputClass}/></label><label><span className={labelClass}>Image role</span><select name="imageRole" defaultValue={row.imageRole ?? ""} className={inputClass}><option value="">Unspecified</option>{["FRONT","BACK","SIDE","DETAIL","CLOSE_UP","PACKAGING","WORN_VIEW","SCALE_REFERENCE"].map((role) => <option key={role} value={role}>{role}</option>)}</select></label><label><span className={labelClass}>Display order</span><input name="sortOrder" type="number" min="0" defaultValue={row.sortOrder} className={inputClass}/></label><label><span className={labelClass}>Replace image (optional)</span><input name="replacementImage" type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" className={inputClass}/></label><label><span className={labelClass}>Primary image</span><select name="isPrimary" defaultValue={String(row.isPrimary)} className={inputClass}><option value="true">Yes</option><option value="false">No</option></select></label><div className="flex justify-end gap-2"><button type="button" onClick={() => setEditingMediaId(null)} className="rounded-lg px-3 py-2 text-sm text-gray-600">Cancel</button><button disabled={updateMediaState.isLoading} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">{updateMediaState.isLoading ? "Saving…" : "Save image"}</button></div></form>}</div>)}</div><div className="flex justify-end gap-2"><button onClick={() => continueStep("media")} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600">Skip for now</button><button disabled={!media.length} onClick={() => continueStep("media")} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Continue <ArrowRight className="h-4 w-4"/></button></div></section>}

    {productId && activeStep === "variants" && <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7"><div><h2 className="text-lg font-bold text-gray-900">3. Variants</h2><p className="mt-1 text-sm text-gray-500">Use one variant for each version a customer can buy, such as 30 ml and 50 ml serum or ring sizes 6 and 7. A Simple product usually has one version and may skip this step.</p><p className="mt-1 text-xs text-gray-500">“Variable” is the product structure; size, weight and volume are details of each variant. Decimals are supported for weight and volume. Put dimensions such as 1 cm or 10 nm in Size / dimensions.</p></div><form onSubmit={saveVariant} className="grid gap-3 sm:grid-cols-2">{(["variantName","sku","color","size","weight","volume","unit","sellingPrice","stockQuantity"] as const).map((key) => <label key={key} className="block"><span className={labelClass}>{({variantName:"Variant name",sku:"Variant SKU",color:"Color",size:"Size / dimensions",weight:"Weight (decimal allowed)",volume:"Volume (decimal allowed)",unit:"Measurement unit (ml, g, cm, mm, nm, pcs)",sellingPrice:"Selling price",stockQuantity:"Stock quantity"})[key]}</span><input required={key === "variantName" || key === "sku" || key === "sellingPrice"} type={key === "weight" || key === "volume" || key === "sellingPrice" || key === "stockQuantity" ? "number" : "text"} step={key === "weight" || key === "volume" || key === "sellingPrice" ? "0.01" : undefined} min={key === "weight" || key === "volume" || key === "sellingPrice" || key === "stockQuantity" ? 0 : undefined} placeholder={key === "size" ? "e.g. Ring size 6, 1 cm, 10 nm" : key === "unit" ? "e.g. ml, g, cm, pcs" : undefined} className={inputClass} value={variantForm[key]} onChange={(event) => setVariantForm((form) => ({ ...form, [key]: event.target.value }))}/></label>)}<div className="sm:col-span-2 flex gap-2"><button disabled={saving} className="rounded-xl border border-primary px-4 py-2 text-sm font-semibold text-primary disabled:opacity-50">{saving ? "Saving…" : editingVariantId ? "Save variant changes" : "Add variant"}</button>{editingVariantId && <button type="button" onClick={() => { setEditingVariantId(null); setVariantForm({ variantName: "", sku: "", color: "", size: "", weight: "", volume: "", unit: "", sellingPrice: "", stockQuantity: "0" }); }} className="rounded-xl px-4 py-2 text-sm text-gray-600">Cancel edit</button>}</div></form><div className="space-y-2">{variants.map((row) => <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm"><span className="font-medium">{row.variantName} <span className="text-gray-400">· {row.sku}</span><span className="ml-2 text-gray-500">{row.color || ""} {row.size || ""} · {row.sellingPrice} · {row.stockQuantity} in stock</span></span><span className="flex gap-1"><button type="button" onClick={() => editVariant(row)} className="rounded-lg p-2 text-gray-500 hover:bg-pink-50 hover:text-primary" title="Edit variant"><Pencil className="h-4 w-4"/></button><button type="button" onClick={() => void removeVariant(row)} className="rounded-lg p-2 text-gray-500 hover:bg-rose-50 hover:text-rose-600" title="Delete variant"><Trash2 className="h-4 w-4"/></button></span></div>)}</div><div className="flex justify-end gap-2"><button onClick={() => continueStep("variants")} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600">Skip for now</button><button disabled={productType === "VARIABLE" && !variants.length} onClick={() => continueStep("variants")} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Continue <ArrowRight className="h-4 w-4"/></button></div></section>}

    {productId && activeStep === "attributes" && <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7"><div><h2 className="text-lg font-bold text-gray-900">4. Specifications</h2><p className="mt-1 text-sm text-gray-500">Add display-only facts such as material, skin type, finish or care instructions.</p></div><form onSubmit={saveAttribute} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto] sm:items-end"><label><span className={labelClass}>Name</span><input required className={inputClass} value={attributeName} onChange={(event) => setAttributeName(event.target.value)} placeholder="e.g. Material"/></label><label><span className={labelClass}>Value</span><input required className={inputClass} value={attributeValue} onChange={(event) => setAttributeValue(event.target.value)} placeholder="e.g. 18K gold plated"/></label><div className="flex gap-2"><button disabled={saving} className="rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary disabled:opacity-50">{editingAttributeId ? "Save changes" : "Add specification"}</button>{editingAttributeId && <button type="button" onClick={() => { setEditingAttributeId(null); setAttributeName(""); setAttributeValue(""); }} className="rounded-xl px-3 py-2.5 text-sm text-gray-600">Cancel</button>}</div></form><div className="divide-y rounded-xl border border-gray-100">{attributes.map((row) => <div key={row.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm"><strong>{row.name}</strong><span className="flex-1 text-gray-600">{row.value}</span><button type="button" onClick={() => editAttribute(row)} className="rounded-lg p-2 text-gray-500 hover:bg-pink-50 hover:text-primary" title="Edit specification"><Pencil className="h-4 w-4"/></button><button type="button" onClick={() => void removeAttribute(row)} className="rounded-lg p-2 text-gray-500 hover:bg-rose-50 hover:text-rose-600" title="Delete specification"><Trash2 className="h-4 w-4"/></button></div>)}{!attributes.length && <div className="p-4 text-sm text-gray-400">No specifications saved yet.</div>}</div><div className="flex justify-end gap-2"><button onClick={() => continueStep("attributes")} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600">Skip for now</button><button disabled={!attributes.length} onClick={() => continueStep("attributes")} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Continue <ArrowRight className="h-4 w-4"/></button></div></section>}

    {productId && activeStep === "metadata" && <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7"><div><h2 className="text-lg font-bold text-gray-900">5. Search metadata</h2><p className="mt-1 text-sm text-gray-500">This SEO row is saved separately from the Product row.</p></div><form onSubmit={saveMetadata} className="space-y-4"><label className="block"><span className={labelClass}>Meta title</span><input className={inputClass} maxLength={200} value={metadataForm.metaTitle} onChange={(event) => setMetadataForm((form) => ({ ...form, metaTitle: event.target.value }))}/></label><label className="block"><span className={labelClass}>Meta description</span><textarea className={inputClass} rows={3} maxLength={500} value={metadataForm.metaDescription} onChange={(event) => setMetadataForm((form) => ({ ...form, metaDescription: event.target.value }))}/></label><label className="block"><span className={labelClass}>Keywords (comma separated)</span><input className={inputClass} value={metadataForm.metaKeywords} onChange={(event) => setMetadataForm((form) => ({ ...form, metaKeywords: event.target.value }))} placeholder="serum, skincare, niacinamide"/></label><div className="flex flex-wrap justify-end gap-2"><button type="button" onClick={() => continueStep("metadata")} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600">Skip for now</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Save className="h-4 w-4"/>{saving ? "Saving…" : metadata ? "Update metadata" : "Save metadata"}</button></div></form>{metadata && <div className="flex justify-end"><button onClick={() => setStep("categoryDetails")} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white">Continue to product-specific data</button></div>}</section>}

    {productId && activeStep === "categoryDetails" && <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
      <div><h2 className="text-lg font-bold text-gray-900">6. {productCategory === "JEWELRY" ? "Jewelry details" : "Cosmetic details"}</h2><p className="mt-1 text-sm text-gray-500">Enter only details that apply. Saved information is loaded here so you can review and update it.</p></div>
      {productCategory === "JEWELRY" ? <form onSubmit={saveCategoryDetails} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label><span className={labelClass}>Jewelry type</span><select className={inputClass} value={jewelryForm.category} onChange={(event) => setJewelryForm((form) => ({ ...form, category: event.target.value }))}><option value="">Select type</option>{["RING", "NECKLACE", "EARRING", "BRACELET", "ANKLET", "PENDANT", "BROOCH", "WATCH", "OTHER"].map((value) => <option key={value} value={value}>{value.charAt(0) + value.slice(1).toLowerCase()}</option>)}</select></label>
          <label><span className={labelClass}>Metal</span><input className={inputClass} value={jewelryForm.metalType} onChange={(event) => setJewelryForm((form) => ({ ...form, metalType: event.target.value }))} placeholder="e.g. Gold, sterling silver"/></label>
          <label><span className={labelClass}>Purity</span><input className={inputClass} value={jewelryForm.metalPurity} onChange={(event) => setJewelryForm((form) => ({ ...form, metalPurity: event.target.value }))} placeholder="e.g. 18K, 925"/></label>
          <label><span className={labelClass}>Plating</span><input className={inputClass} value={jewelryForm.plating} onChange={(event) => setJewelryForm((form) => ({ ...form, plating: event.target.value }))} placeholder="Optional"/></label>
          <label><span className={labelClass}>Finish</span><input className={inputClass} value={jewelryForm.finish} onChange={(event) => setJewelryForm((form) => ({ ...form, finish: event.target.value }))} placeholder="e.g. Polished, matte"/></label>
          <label><span className={labelClass}>Style</span><input className={inputClass} value={jewelryForm.style} onChange={(event) => setJewelryForm((form) => ({ ...form, style: event.target.value }))} placeholder="e.g. Minimal, vintage"/></label>
          <label><span className={labelClass}>Intended wearer</span><input className={inputClass} value={jewelryForm.gender} onChange={(event) => setJewelryForm((form) => ({ ...form, gender: event.target.value }))} placeholder="Optional"/></label>
          <label><span className={labelClass}>Occasions (comma separated)</span><input className={inputClass} value={jewelryForm.occasion} onChange={(event) => setJewelryForm((form) => ({ ...form, occasion: event.target.value }))} placeholder="Daily wear, wedding"/></label>
          <label className="sm:col-span-2"><span className={labelClass}>Care instructions</span><textarea className={inputClass} rows={2} value={jewelryForm.careInstructions} onChange={(event) => setJewelryForm((form) => ({ ...form, careInstructions: event.target.value }))} placeholder="How to clean and store this item"/></label>
          <label className="sm:col-span-2"><span className={labelClass}>Authenticity notes</span><textarea className={inputClass} rows={2} value={jewelryForm.authenticityNotes} onChange={(event) => setJewelryForm((form) => ({ ...form, authenticityNotes: event.target.value }))} placeholder="Optional product verification details"/></label>
        </div>

        <div className="space-y-3 rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between"><div><h3 className="font-semibold text-gray-900">Measurements</h3><p className="text-xs text-gray-500">Physical dimensions, such as chain length or ring inner diameter.</p></div><button type="button" onClick={() => setJewelryForm((form) => ({ ...form, measurements: [...form.measurements, { measurementType: "", value: "", unit: "", notes: "", variantId: "" }] }))} className="rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary">Add measurement</button></div>
          {jewelryForm.measurements.map((row, index) => <div key={index} className="grid gap-3 rounded-lg bg-gray-50 p-3 sm:grid-cols-2 lg:grid-cols-4"><label><span className={labelClass}>Measurement name</span><input className={inputClass} value={row.measurementType} onChange={(event) => setJewelryForm((form) => ({ ...form, measurements: form.measurements.map((item, i) => i === index ? { ...item, measurementType: event.target.value } : item) }))} placeholder="e.g. chain_length"/></label><label><span className={labelClass}>Value</span><input type="number" min="0" step="0.01" className={inputClass} value={row.value} onChange={(event) => setJewelryForm((form) => ({ ...form, measurements: form.measurements.map((item, i) => i === index ? { ...item, value: event.target.value } : item) }))}/></label><label><span className={labelClass}>Unit</span><input className={inputClass} value={row.unit} onChange={(event) => setJewelryForm((form) => ({ ...form, measurements: form.measurements.map((item, i) => i === index ? { ...item, unit: event.target.value } : item) }))} placeholder="mm, cm, g"/></label><label><span className={labelClass}>Notes</span><input className={inputClass} value={row.notes} onChange={(event) => setJewelryForm((form) => ({ ...form, measurements: form.measurements.map((item, i) => i === index ? { ...item, notes: event.target.value } : item) }))} placeholder="Optional"/></label><div className="sm:col-span-2 lg:col-span-4 flex justify-end"><button type="button" onClick={() => setJewelryForm((form) => ({ ...form, measurements: form.measurements.filter((_, i) => i !== index) }))} className="text-xs font-semibold text-rose-600">Remove measurement</button></div></div>)}
        </div>

        <div className="space-y-3 rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between"><div><h3 className="font-semibold text-gray-900">Available sizes</h3><p className="text-xs text-gray-500">List size labels customers can choose from. Purchasable variants keep their own SKU and stock.</p></div><button type="button" onClick={() => setJewelryForm((form) => ({ ...form, sizes: [...form.sizes, { label: "", value: "", region: "", isAvailable: true, variantId: "" }] }))} className="rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary">Add size</button></div>
          {jewelryForm.sizes.map((row, index) => <div key={index} className="grid gap-3 rounded-lg bg-gray-50 p-3 sm:grid-cols-2 lg:grid-cols-4"><label><span className={labelClass}>Size label</span><input className={inputClass} value={row.label} onChange={(event) => setJewelryForm((form) => ({ ...form, sizes: form.sizes.map((item, i) => i === index ? { ...item, label: event.target.value } : item) }))} placeholder="Ring size"/></label><label><span className={labelClass}>Size</span><input className={inputClass} value={row.value} onChange={(event) => setJewelryForm((form) => ({ ...form, sizes: form.sizes.map((item, i) => i === index ? { ...item, value: event.target.value } : item) }))} placeholder="US 7"/></label><label><span className={labelClass}>Sizing region</span><input className={inputClass} value={row.region} onChange={(event) => setJewelryForm((form) => ({ ...form, sizes: form.sizes.map((item, i) => i === index ? { ...item, region: event.target.value } : item) }))} placeholder="US, UK, EU"/></label><label className="flex items-center gap-2 pt-5 text-sm"><input type="checkbox" checked={row.isAvailable} onChange={(event) => setJewelryForm((form) => ({ ...form, sizes: form.sizes.map((item, i) => i === index ? { ...item, isAvailable: event.target.checked } : item) }))}/>Available</label><div className="sm:col-span-2 lg:col-span-4 flex justify-end"><button type="button" onClick={() => setJewelryForm((form) => ({ ...form, sizes: form.sizes.filter((_, i) => i !== index) }))} className="text-xs font-semibold text-rose-600">Remove size</button></div></div>)}
        </div>

        <div className="space-y-3 rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between"><div><h3 className="font-semibold text-gray-900">Materials</h3><p className="text-xs text-gray-500">Add the metals or other materials this jewelry contains.</p></div><button type="button" onClick={() => setJewelryForm((form) => ({ ...form, materials: [...form.materials, { name: "", type: "METAL", percentage: "", isMainMaterial: form.materials.length === 0 }] }))} className="rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary">Add material</button></div>
          {jewelryForm.materials.map((row, index) => <div key={index} className="grid gap-3 rounded-lg bg-gray-50 p-3 sm:grid-cols-2 lg:grid-cols-4"><label><span className={labelClass}>Material</span><input className={inputClass} value={row.name} onChange={(event) => setJewelryForm((form) => ({ ...form, materials: form.materials.map((item, i) => i === index ? { ...item, name: event.target.value } : item) }))} placeholder="Gold, sterling silver"/></label><label><span className={labelClass}>Material type</span><select className={inputClass} value={row.type} onChange={(event) => setJewelryForm((form) => ({ ...form, materials: form.materials.map((item, i) => i === index ? { ...item, type: event.target.value } : item) }))}><option value="METAL">Metal</option><option value="GEMSTONE">Gemstone</option><option value="PEARL">Pearl</option><option value="ENAMEL">Enamel</option><option value="OTHER">Other</option></select></label><label><span className={labelClass}>Percentage (optional)</span><input type="number" min="0" max="100" step="0.01" className={inputClass} value={row.percentage} onChange={(event) => setJewelryForm((form) => ({ ...form, materials: form.materials.map((item, i) => i === index ? { ...item, percentage: event.target.value } : item) }))}/></label><label className="flex items-center gap-2 pt-5 text-sm"><input type="checkbox" checked={row.isMainMaterial} onChange={(event) => setJewelryForm((form) => ({ ...form, materials: form.materials.map((item, i) => i === index ? { ...item, isMainMaterial: event.target.checked } : item) }))}/>Main material</label><div className="sm:col-span-2 lg:col-span-4 flex justify-end"><button type="button" onClick={() => setJewelryForm((form) => ({ ...form, materials: form.materials.filter((_, i) => i !== index) }))} className="text-xs font-semibold text-rose-600">Remove material</button></div></div>)}
        </div>

        <div className="space-y-3 rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between"><div><h3 className="font-semibold text-gray-900">Gemstones</h3><p className="text-xs text-gray-500">Add gemstone information only when the product includes stones.</p></div><button type="button" onClick={() => setJewelryForm((form) => ({ ...form, gemstones: [...form.gemstones, { name: "", cut: "", carat: "", color: "", clarity: "", isLabGrown: false }] }))} className="rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary">Add gemstone</button></div>
          {jewelryForm.gemstones.map((row, index) => <div key={index} className="grid gap-3 rounded-lg bg-gray-50 p-3 sm:grid-cols-2 lg:grid-cols-3"><label><span className={labelClass}>Stone name</span><input className={inputClass} value={row.name} onChange={(event) => setJewelryForm((form) => ({ ...form, gemstones: form.gemstones.map((item, i) => i === index ? { ...item, name: event.target.value } : item) }))} placeholder="Diamond, pearl"/></label><label><span className={labelClass}>Cut</span><input className={inputClass} value={row.cut} onChange={(event) => setJewelryForm((form) => ({ ...form, gemstones: form.gemstones.map((item, i) => i === index ? { ...item, cut: event.target.value } : item) }))}/></label><label><span className={labelClass}>Carat</span><input type="number" min="0" step="0.01" className={inputClass} value={row.carat} onChange={(event) => setJewelryForm((form) => ({ ...form, gemstones: form.gemstones.map((item, i) => i === index ? { ...item, carat: event.target.value } : item) }))}/></label><label><span className={labelClass}>Color</span><input className={inputClass} value={row.color} onChange={(event) => setJewelryForm((form) => ({ ...form, gemstones: form.gemstones.map((item, i) => i === index ? { ...item, color: event.target.value } : item) }))}/></label><label><span className={labelClass}>Clarity</span><input className={inputClass} value={row.clarity} onChange={(event) => setJewelryForm((form) => ({ ...form, gemstones: form.gemstones.map((item, i) => i === index ? { ...item, clarity: event.target.value } : item) }))}/></label><label className="flex items-center gap-2 pt-5 text-sm"><input type="checkbox" checked={row.isLabGrown} onChange={(event) => setJewelryForm((form) => ({ ...form, gemstones: form.gemstones.map((item, i) => i === index ? { ...item, isLabGrown: event.target.checked } : item) }))}/>Lab-grown</label><div className="sm:col-span-2 lg:col-span-3 flex justify-end"><button type="button" onClick={() => setJewelryForm((form) => ({ ...form, gemstones: form.gemstones.filter((_, i) => i !== index) }))} className="text-xs font-semibold text-rose-600">Remove gemstone</button></div></div>)}
        </div>

        <p className="text-xs text-gray-500">You can leave sections empty if they do not apply. Previously saved details are filled in automatically and can be edited.</p>
        <div className="flex flex-wrap justify-end gap-2"><button type="button" onClick={() => continueStep("categoryDetails")} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600">Skip for now</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Save className="h-4 w-4"/>{saving ? "Saving…" : "Save jewelry details"}</button></div>
      </form> : productCategory === "COSMETICS" ? <form onSubmit={saveCategoryDetails} className="space-y-3"><label className="block"><span className={labelClass}>How to use / Directions</span><textarea className={inputClass} rows={4} maxLength={5000} value={cosmeticUsageInstructions} onChange={(event) => setCosmeticUsageInstructions(event.target.value)} placeholder="Add product-specific directions, such as when and how to apply it."/><span className="mt-1 block text-xs text-gray-500">Shown in the storefront product’s “How to Use” tab.</span></label><label className="block"><span className={labelClass}>Other cosmetic product data (JSON)</span><textarea className={`${inputClass} font-mono text-xs`} rows={15} value={categoryDetailsJson} onChange={(event) => setCategoryDetailsJson(event.target.value)} spellCheck={false}/></label><p className="text-xs text-gray-500">Cosmetic ingredient and skin compatibility details are validated by the backend. You can skip and return later.</p><div className="flex flex-wrap justify-end gap-2"><button type="button" onClick={() => continueStep("categoryDetails")} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600">Skip for now</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Save className="h-4 w-4"/>{saving ? "Saving…" : "Save category details"}</button></div></form> : <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Select Cosmetics or Jewelry in Product details to use this step. <button onClick={() => setStep("product")} className="ml-1 font-semibold underline">Edit product category</button></div>}
      {(Boolean(productCategory === "COSMETICS" && cosmeticResult?.data?.cosmeticDetails) || Boolean(productCategory === "JEWELRY" && jewelryResult?.data?.jewelryDetails)) && <div className="flex justify-end"><button onClick={finishSetup} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white">Finish setup</button></div>}
    </section>}

    {productId && activeStep === "faq" && <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
      <div><h2 className="text-lg font-bold text-gray-900">7. Product FAQs</h2><p className="mt-1 text-sm text-gray-500">Add the questions shoppers commonly ask and the answers your team wants to provide. These are shown in this product’s FAQ tab. Leave the list empty if there are no FAQs yet.</p></div>
      <form onSubmit={saveFaq} className="space-y-4">
        {faqItems.map((item, index) => <div key={index} className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <label className="block"><span className={labelClass}>Question {index + 1}</span><input required maxLength={300} className={inputClass} value={item.question} onChange={(event) => setFaqItems((items) => items.map((row, rowIndex) => rowIndex === index ? { ...row, question: event.target.value } : row))} placeholder="e.g. Is this suitable for sensitive skin?"/></label>
          <label className="block"><span className={labelClass}>Answer</span><textarea required maxLength={3000} rows={3} className={inputClass} value={item.answer} onChange={(event) => setFaqItems((items) => items.map((row, rowIndex) => rowIndex === index ? { ...row, answer: event.target.value } : row))} placeholder="Write a clear answer for shoppers."/></label>
          <div className="flex justify-end"><button type="button" onClick={() => setFaqItems((items) => items.filter((_, rowIndex) => rowIndex !== index))} className="text-xs font-semibold text-rose-600">Remove question</button></div>
        </div>)}
        <div className="flex flex-wrap justify-between gap-2"><button type="button" disabled={faqItems.length >= 20} onClick={() => setFaqItems((items) => [...items, { question: "", answer: "" }])} className="rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary disabled:opacity-50">Add a question</button><div className="flex gap-2"><button type="button" onClick={() => continueStep("faq")} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600">Finish without FAQs</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Save className="h-4 w-4"/>{saving ? "Saving…" : "Save FAQs"}</button></div></div>
      </form>
    </section>}

    {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}
    {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
    {productId && product && <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs text-gray-500"><span><Package className="mr-1 inline h-4 w-4"/>Draft product · {product.name}</span><span>{completion.percentage}% complete · {completion.completed.filter(Boolean).length}/{completion.total} steps</span></div>}
  </div>;
}
