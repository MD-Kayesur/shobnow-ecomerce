import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Eye, Pencil,
  LoaderCircle, Package, Search, Trash2, X, XCircle,
} from "lucide-react";
import {
  AdminProduct, useDeleteAdminProductMutation, useGetAdminBrandsQuery,
  useGetAdminCategoriesQuery, useGetAdminProductMediaQuery,
  useGetAdminProductsQuery, useGetInventorySummaryQuery, useGetAdminProductSetupProgressQuery,
  useGetAdminProductQuery, useGetAdminProductVariantsQuery,
  useGetAdminProductAttributesQuery, useGetAdminProductMetadataQuery,
  useGetAdminCosmeticDetailsQuery, useGetAdminJewelryDetailsQuery,
  useUpdateAdminProductMutation,
} from "@/redux/features/admin/productsApi";

type StockFilter = "all" | "inStock" | "lowStock" | "outOfStock";
const PAGE_SIZE = 20;
const apiBase = import.meta.env.VITE_API_ENDPOINT || "http://localhost:4001/api/v1";
const serverOrigin = apiBase.replace(/\/api\/v\d+\/?$/, "");

function stockQueryValue(filter: StockFilter) {
  if (filter === "inStock") return "IN_STOCK" as const;
  if (filter === "lowStock") return "LOW_STOCK" as const;
  if (filter === "outOfStock") return "OUT_OF_STOCK" as const;
  return undefined;
}

function ProductThumbnail({ productId, name }: { productId: string; name: string }) {
  const { data } = useGetAdminProductMediaQuery(productId);
  const image = data?.data?.slice().sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder)[0]?.imageUrl;
  const src = image?.startsWith("http") ? image : image ? `${serverOrigin}${image.startsWith("/") ? "" : "/"}${image}` : undefined;
  return src ? (
    <img src={src} alt={name} className="w-11 h-11 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-100" />
  ) : (
    <div className="w-11 h-11 rounded-xl bg-pink-50 text-primary shrink-0 border border-pink-100 grid place-items-center" aria-label="No product image">
      <Package className="w-5 h-5" />
    </div>
  );
}

function formatMoney(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return `৳${amount.toLocaleString("en-BD", { maximumFractionDigits: 2 })}`;
}

function mediaUrl(path: string) {
  return path.startsWith("http") ? path : `${serverOrigin}${path.startsWith("/") ? "" : "/"}${path}`;
}

function PreviewField({ label, value }: { label: string; value: unknown }) {
  if (value == null || value === "" || (Array.isArray(value) && value.length === 0)) return null;
  const display = Array.isArray(value) ? value.join(", ") : typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
  return <div className="min-w-0 rounded-xl border border-pink-100 bg-white p-3"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 break-words text-sm text-slate-800">{display}</p></div>;
}

function ProductPreviewDialog({ product: listedProduct, brandName, categoryName, onClose }: { product: AdminProduct; brandName: string; categoryName: string; onClose: () => void }) {
  const { data: productResult, isLoading: productLoading } = useGetAdminProductQuery(listedProduct.id);
  const { data: mediaResult, isLoading: mediaLoading } = useGetAdminProductMediaQuery(listedProduct.id);
  const { data: variantResult } = useGetAdminProductVariantsQuery(listedProduct.id);
  const { data: attributeResult } = useGetAdminProductAttributesQuery(listedProduct.id);
  const { data: metadataResult } = useGetAdminProductMetadataQuery(listedProduct.id);
  const product = productResult?.data ?? listedProduct;
  const isCosmetic = product.productCategory === "COSMETICS";
  const isJewelry = product.productCategory === "JEWELRY";
  const { data: cosmeticResult } = useGetAdminCosmeticDetailsQuery(listedProduct.id, { skip: !isCosmetic });
  const { data: jewelryResult } = useGetAdminJewelryDetailsQuery(listedProduct.id, { skip: !isJewelry });
  const media = mediaResult?.data ?? [];
  const images = media.slice().sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder);
  const variants = variantResult?.data ?? [];
  const attributes = attributeResult?.data ?? [];
  const metadata = metadataResult?.data;
  const categoryData = isCosmetic ? cosmeticResult?.data : isJewelry ? jewelryResult?.data : undefined;
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => setActiveImage(0), [listedProduct.id]);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [onClose]);

  const statusClass = product.status === "ACTIVE" && product.isActive ? "bg-emerald-100 text-emerald-700" : product.status === "DRAFT" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700";
  const description = (product.description || product.shortDescription || "No product description has been added yet.").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const selectedImage = images[activeImage];

  return <div className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-slate-950/65 p-3 backdrop-blur-sm sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="product-preview-title" className="my-auto max-h-[94vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-pink-100 bg-[#fffafd] shadow-2xl">
      <header className="flex items-start justify-between gap-4 border-b border-pink-100 bg-white px-5 py-4 sm:px-7"><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Product viewer · storefront preview</p><h2 id="product-preview-title" className="mt-1 truncate text-xl font-extrabold text-slate-900">{product.name}</h2><p className="mt-1 break-all text-xs text-slate-500">Product ID: {product.id}</p></div><button onClick={onClose} aria-label="Close product viewer" className="shrink-0 rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-pink-50 hover:text-primary"><X className="h-5 w-5" /></button></header>
      <div className="max-h-[calc(94vh-76px)] overflow-y-auto p-4 sm:p-7">
        {(productLoading || mediaLoading) && <div className="mb-4 flex items-center gap-2 rounded-xl bg-white p-3 text-sm text-slate-500"><LoaderCircle className="h-4 w-4 animate-spin" />Loading the latest product information…</div>}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
          <div className="rounded-2xl border border-pink-100 bg-white p-3 sm:p-4"><div className="grid min-h-[320px] place-items-center overflow-hidden rounded-xl bg-slate-50 sm:min-h-[430px]">{selectedImage ? <img src={mediaUrl(selectedImage.imageUrl)} alt={selectedImage.altText || product.name} className="max-h-[430px] w-full object-contain" /> : <div className="flex flex-col items-center gap-2 text-slate-400"><Package className="h-12 w-12" /><span className="text-sm">No product images uploaded</span></div>}</div>
            {images.length > 1 && <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">{images.map((item, index) => <button key={item.id} onClick={() => setActiveImage(index)} aria-label={`Preview image ${index + 1}`} className={`overflow-hidden rounded-lg border-2 bg-white ${activeImage === index ? "border-primary" : "border-transparent"}`}><img src={mediaUrl(item.imageUrl)} alt={item.altText || `${product.name} image ${index + 1}`} className="aspect-square w-full object-cover" /></button>)}</div>}
            {selectedImage && <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500"><span className="rounded-full bg-pink-50 px-2.5 py-1 font-semibold text-primary">{selectedImage.imageRole || "PRODUCT IMAGE"}</span>{selectedImage.isPrimary && <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">Primary image</span>}<span>{images.length} image{images.length === 1 ? "" : "s"} total</span></div>}
          </div>
          <div className="space-y-4"><div className="rounded-2xl border border-pink-100 bg-white p-5 sm:p-6"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}>{product.status.replace(/_/g, " ")}</span><span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-primary">{product.displayType?.replace(/_/g, " ") || "NORMAL"}</span></div><p className="mt-4 text-sm leading-6 text-slate-600">{description}</p><div className="mt-5 flex flex-wrap items-baseline gap-3"><span className="text-3xl font-extrabold text-slate-900">{formatMoney(product.salePrice ?? product.price)}</span>{product.salePrice != null && Number(product.salePrice) < Number(product.price) && <span className="text-base text-slate-400 line-through">{formatMoney(product.price)}</span>}</div><div className="mt-5 grid grid-cols-2 gap-3"><PreviewField label="Brand" value={brandName} /><PreviewField label="Store category" value={categoryName} /><PreviewField label="Product category" value={product.productCategory || product.productType} /><PreviewField label="SKU" value={product.sku} /><PreviewField label="Stock" value={`${product.stock ?? 0} units`} /><PreviewField label="Condition" value={product.condition} /></div></div>
            <div className="rounded-2xl border border-pink-100 bg-white p-5"><h3 className="font-bold text-slate-900">More product details</h3><div className="mt-3 grid grid-cols-2 gap-3"><PreviewField label="Manufacturer" value={product.manufacturer} /><PreviewField label="Country of origin" value={product.countryOfOrigin} /><PreviewField label="Authenticity" value={product.authenticityType} /><PreviewField label="Authenticity verified" value={product.authenticityVerified ? "Yes" : "No"} /><PreviewField label="Seller" value={product.sellerName} /><PreviewField label="Subcategory ID" value={product.subCategoryId} /></div></div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-pink-100 bg-white p-5"><h3 className="font-bold text-slate-900">All product images</h3>{images.length ? <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{images.map((item, index) => <figure key={item.id} className="overflow-hidden rounded-xl border border-slate-100"><img src={mediaUrl(item.imageUrl)} alt={item.altText || product.name} className="aspect-square w-full bg-slate-50 object-cover" /><figcaption className="space-y-1 p-2 text-xs text-slate-600"><p className="font-semibold">{item.imageRole || `Image ${index + 1}`}{item.isPrimary ? " · Primary" : ""}</p><p className="truncate" title={item.altText || "No alt text"}>{item.altText || "No alt text"}</p></figcaption></figure>)}</div> : <p className="mt-3 text-sm text-slate-500">No images have been added.</p>}</section>
          <section className="rounded-2xl border border-pink-100 bg-white p-5"><h3 className="font-bold text-slate-900">Variants</h3>{variants.length ? <div className="mt-3 space-y-2">{variants.map((variant) => <div key={variant.id} className="rounded-xl bg-slate-50 p-3"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold text-slate-800">{variant.variantName || [variant.color, variant.size, variant.volume && `${variant.volume}${variant.unit || ""}`].filter(Boolean).join(" · ") || "Product variant"}{variant.isDefault ? " · Default" : ""}</p><span className="font-bold text-slate-900">{formatMoney(variant.sellingPrice)}</span></div><p className="mt-1 text-xs text-slate-500">SKU: {variant.sku || "—"} · Stock: {variant.stockQuantity}</p><p className="mt-1 text-xs text-slate-500">{[variant.color && `Color ${variant.color}`, variant.size && `Size ${variant.size}`, variant.weight && `Weight ${variant.weight}`, variant.volume && `Volume ${variant.volume} ${variant.unit || ""}`].filter(Boolean).join(" · ")}</p></div>)}</div> : <p className="mt-3 text-sm text-slate-500">No variants have been added.</p>}</section>
          <section className="rounded-2xl border border-pink-100 bg-white p-5"><h3 className="font-bold text-slate-900">Specifications</h3>{attributes.length ? <div className="mt-3 grid gap-2 sm:grid-cols-2">{attributes.map((attribute) => <PreviewField key={attribute.id} label={attribute.name} value={attribute.value} />)}</div> : <p className="mt-3 text-sm text-slate-500">No specifications have been added.</p>}</section>
          <section className="rounded-2xl border border-pink-100 bg-white p-5"><h3 className="font-bold text-slate-900">Search metadata</h3>{metadata ? <div className="mt-3 grid gap-2"><PreviewField label="Meta title" value={metadata.metaTitle} /><PreviewField label="Meta description" value={metadata.metaDescription} /><PreviewField label="Keywords" value={metadata.metaKeywords} /></div> : <p className="mt-3 text-sm text-slate-500">No SEO metadata has been added.</p>}</section>
          {categoryData && <section className="rounded-2xl border border-pink-100 bg-white p-5 lg:col-span-2"><h3 className="font-bold text-slate-900">{isCosmetic ? "Cosmetics details" : "Jewelry details"}</h3><div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(categoryData).filter(([key, value]) => key !== "id" && key !== "productId" && value != null && value !== "" && (!Array.isArray(value) || value.length > 0)).map(([key, value]) => <PreviewField key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())} value={value} />)}</div></section>}
        </div>
      </div>
    </section>
  </div>;
}

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [viewingProduct, setViewingProduct] = useState<AdminProduct | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => setPage(1), [debouncedSearch, selectedCategory, stockFilter]);

  const query = useMemo(() => ({
    page,
    limit: PAGE_SIZE,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(selectedCategory !== "all" ? { categoryId: selectedCategory } : {}),
    ...(stockQueryValue(stockFilter) ? { inventoryStatus: stockQueryValue(stockFilter) } : {}),
  }), [page, debouncedSearch, selectedCategory, stockFilter]);

  const { data: productResponse, isLoading, isFetching, isError, refetch } = useGetAdminProductsQuery(query);
  const { data: summaryResponse, isLoading: summaryLoading } = useGetInventorySummaryQuery();
  const { data: brandResponse } = useGetAdminBrandsQuery();
  const { data: categoryResponse } = useGetAdminCategoriesQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteAdminProductMutation();
  const [updateProduct] = useUpdateAdminProductMutation();

  const products = productResponse?.data ?? [];
  const productIds = useMemo(() => products.map((product) => product.id), [products]);
  const { data: setupProgressResponse } = useGetAdminProductSetupProgressQuery(productIds, { skip: productIds.length === 0 });
  const setupProgress = useMemo(() => new Map((setupProgressResponse?.data ?? []).map((item) => [item.productId, item])), [setupProgressResponse]);
  const meta = productResponse?.meta;
  const summary = summaryResponse?.data;
  const brandNames = useMemo(() => new Map((brandResponse?.data ?? []).map((row) => [row.id, row.name])), [brandResponse]);
  const categoryNames = useMemo(() => new Map((categoryResponse?.data ?? []).map((row) => [row.id, row.name])), [categoryResponse]);

  const onDelete = async (product: AdminProduct) => {
    if (!window.confirm(`Remove “${product.name}” from the catalog?`)) return;
    setNotice("");
    try {
      await deleteProduct(product.id).unwrap();
      setNotice("Product removed from the catalog.");
    } catch {
      setNotice("Could not remove this product. Refresh the list and try again.");
    }
  };

  const onStatusChange = async (product: AdminProduct, status: string) => {
    if (status === product.status) return;
    setUpdatingStatusId(product.id);
    setNotice("");
    try {
      await updateProduct({
        id: product.id,
        body: { status, isActive: status === "ACTIVE" },
      }).unwrap();
      setNotice(`${product.name} status changed to ${status.replace("_", " ").toLowerCase()}.`);
    } catch (error) {
      const responseMessage = (error as { data?: { message?: string | string[] } })?.data?.message;
      setNotice(Array.isArray(responseMessage) ? responseMessage.join(" ") : responseMessage || "Could not update product status. Please try again.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const statCards = [
    { label: "Total Catalog", value: summary?.total, icon: Package, color: "text-gray-900" },
    { label: "In Stock", value: summary?.inStock, icon: CheckCircle2, color: "text-emerald-600" },
    { label: "Low Stock (≤ 5)", value: summary?.lowStock, icon: AlertTriangle, color: "text-amber-600" },
    { label: "Out of Stock", value: summary?.outOfStock, icon: XCircle, color: "text-rose-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
            <Package className="w-7 h-7 text-primary" /> Products &amp; Inventory
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your store catalog, pricing, variants, and real-time inventory stock.</p>
        </div>
        <Link to="/admin-dashboard/add-product" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover font-semibold text-sm shadow-md transition-all">
          <span className="text-lg leading-none">＋</span> Add New Product
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
            <span className={`text-xs uppercase font-semibold flex items-center gap-1 ${color}`}><Icon className="w-3.5 h-3.5" />{label}</span>
            <p className={`text-2xl font-extrabold mt-1 ${color}`}>{summaryLoading ? "—" : value ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-xs flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="search" placeholder="Search by product name, brand or SKU..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} aria-label="Filter by category" className="px-3 py-2.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-gray-700 cursor-pointer">
            <option value="all">All Categories</option>
            {(categoryResponse?.data ?? []).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl text-xs font-semibold">
            {(["all", "inStock", "lowStock", "outOfStock"] as StockFilter[]).map((filter) => {
              const labels: Record<StockFilter, string> = { all: "All", inStock: "In Stock", lowStock: "Low Stock", outOfStock: "Out" };
              const activeColor: Record<StockFilter, string> = { all: "text-primary", inStock: "text-emerald-600", lowStock: "text-amber-600", outOfStock: "text-rose-600" };
              return <button key={filter} onClick={() => setStockFilter(filter)} className={`px-2.5 py-1.5 rounded-lg transition-all ${stockFilter === filter ? `bg-white ${activeColor[filter]} shadow-xs` : "text-gray-600 hover:text-gray-900"}`}>{labels[filter]}</button>;
            })}
          </div>
        </div>
      </div>

      {notice && <div role="status" className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">{notice}</div>}
      {isError && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-center justify-between gap-3">Could not load products from the backend.<button onClick={() => void refetch()} className="font-semibold underline">Retry</button></div>}

      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse text-sm">
            <thead><tr className="border-b border-gray-200/80 bg-gray-50/70 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Product</th><th className="py-3.5 px-4">Brand</th><th className="py-3.5 px-4">Category</th><th className="py-3.5 px-4">Price</th><th className="py-3.5 px-4">Stock</th><th className="py-3.5 px-4">Status</th><th className="py-3.5 px-4 text-right">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? <tr><td colSpan={7} className="py-14 text-center text-gray-500"><span className="inline-flex items-center gap-2"><LoaderCircle className="w-4 h-4 animate-spin" />Loading catalog…</span></td></tr>
                : products.length === 0 ? <tr><td colSpan={7} className="py-14 text-center text-gray-500">No products match these filters.</td></tr>
                : products.map((product) => {
                  const stock = Number(product.stock ?? 0);
                  const isLow = stock > 0 && stock <= 5;
                  const isOut = stock <= 0;
                  const displayPrice = product.salePrice != null ? product.salePrice : product.price;
                  const statusClass = product.status === "ACTIVE" && product.isActive ? "bg-emerald-100/70 text-emerald-700" : product.status === "DRAFT" ? "bg-amber-100 text-amber-700" : product.status === "INACTIVE" ? "bg-gray-100 text-gray-600" : "bg-slate-100 text-slate-600";
                  return <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4"><div className="flex items-center gap-3"><ProductThumbnail productId={product.id} name={product.name} /><div className="min-w-0 max-w-xs"><p className="font-semibold text-gray-900 truncate" title={product.name}>{product.name}</p><p className="text-xs text-gray-400 truncate">{product.productCategory ?? "Product"} · SKU: {product.sku || "—"}</p></div></div></td>
                    <td className="py-3 px-4 font-medium text-gray-700">{product.brandId ? brandNames.get(product.brandId) ?? "—" : "—"}</td>
                    <td className="py-3 px-4 text-xs"><span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-medium">{product.categoryId ? categoryNames.get(product.categoryId) ?? "—" : "—"}</span></td>
                    <td className="py-3 px-4"><div className="flex flex-col"><span className="font-bold text-gray-900">{formatMoney(displayPrice)}</span>{product.salePrice != null && Number(product.salePrice) < Number(product.price) && <span className="text-[11px] text-gray-400 line-through">{formatMoney(product.price)}</span>}</div></td>
                    <td className="py-3 px-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${isOut ? "bg-rose-50 text-rose-600" : isLow ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>{stock} units</span></td>
                    <td className="py-3 px-4">
                      <select
                        value={product.status}
                        onChange={(event) => void onStatusChange(product, event.target.value)}
                        disabled={updatingStatusId === product.id}
                        aria-label={`Change status for ${product.name}`}
                        title="Change product status"
                        className={`cursor-pointer appearance-none rounded-lg border-0 px-2.5 py-1 text-xs font-semibold outline-none ring-1 ring-transparent focus:ring-primary/30 disabled:cursor-wait disabled:opacity-60 ${statusClass}`}
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                      {updatingStatusId === product.id && <LoaderCircle className="ml-1 inline h-3 w-3 animate-spin text-gray-500" aria-label="Saving status" />}
                    </td>
                    <td className="py-3 px-4 text-right"><div className="flex items-center justify-end gap-1.5">{product.status === "DRAFT" && <Link to={`/admin-dashboard/add-product?productId=${product.id}&step=${setupProgress.get(product.id)?.steps.find((step) => !step.complete)?.key ?? "product"}`} className="whitespace-nowrap rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100" title="Continue the saved product setup">Continue setup · {setupProgress.get(product.id)?.percentage ?? 0}%</Link>}<Link to={`/admin-dashboard/add-product?productId=${product.id}&step=product`} className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary-light transition-colors" title="Edit all product information" aria-label={`Edit ${product.name}`}><Pencil className="w-4 h-4" /></Link><button onClick={() => setViewingProduct(product)} className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary-light transition-colors" title="View product preview and details" aria-label={`View ${product.name}`}><Eye className="w-4 h-4" /></button><button disabled={isDeleting} onClick={() => void onDelete(product)} className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-40" title="Remove product"><Trash2 className="w-4 h-4" /></button></div></td>
                  </tr>;
                })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-200/80 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>{isFetching && !isLoading ? "Updating… " : ""}Showing <strong className="text-gray-900">{products.length ? (page - 1) * PAGE_SIZE + 1 : 0}–{(page - 1) * PAGE_SIZE + products.length}</strong> of <strong>{meta?.total ?? 0}</strong> matching products</span>
          <div className="flex items-center gap-2"><button disabled={!meta?.hasPreviousPage || isFetching} onClick={() => setPage((value) => Math.max(1, value - 1))} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 disabled:opacity-40"><ChevronLeft className="w-4 h-4" />Previous</button><span>Page {meta?.page ?? page} of {meta?.totalPages ?? 0}</span><button disabled={!meta?.hasNextPage || isFetching} onClick={() => setPage((value) => value + 1)} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 disabled:opacity-40">Next<ChevronRight className="w-4 h-4" /></button></div>
        </div>
      </div>
      {viewingProduct && <ProductPreviewDialog product={viewingProduct} brandName={viewingProduct.brandId ? brandNames.get(viewingProduct.brandId) ?? "—" : "—"} categoryName={viewingProduct.categoryId ? categoryNames.get(viewingProduct.categoryId) ?? "—" : "—"} onClose={() => setViewingProduct(null)} />}
    </div>
  );
};

export default ProductsPage;
