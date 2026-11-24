import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, ExternalLink,
  LoaderCircle, Package, Search, Trash2, XCircle,
} from "lucide-react";
import {
  AdminProduct, useDeleteAdminProductMutation, useGetAdminBrandsQuery,
  useGetAdminCategoriesQuery, useGetAdminProductMediaQuery,
  useGetAdminProductsQuery, useGetInventorySummaryQuery, useGetAdminProductSetupProgressQuery,
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

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState("");

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
                  const statusClass = product.status === "ACTIVE" && product.isActive ? "bg-emerald-100/70 text-emerald-700" : product.status === "DRAFT" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600";
                  return <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4"><div className="flex items-center gap-3"><ProductThumbnail productId={product.id} name={product.name} /><div className="min-w-0 max-w-xs"><p className="font-semibold text-gray-900 truncate" title={product.name}>{product.name}</p><p className="text-xs text-gray-400 truncate">{product.productCategory ?? "Product"} · SKU: {product.sku || "—"}</p></div></div></td>
                    <td className="py-3 px-4 font-medium text-gray-700">{product.brandId ? brandNames.get(product.brandId) ?? "—" : "—"}</td>
                    <td className="py-3 px-4 text-xs"><span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-medium">{product.categoryId ? categoryNames.get(product.categoryId) ?? "—" : "—"}</span></td>
                    <td className="py-3 px-4"><div className="flex flex-col"><span className="font-bold text-gray-900">{formatMoney(displayPrice)}</span>{product.salePrice != null && Number(product.salePrice) < Number(product.price) && <span className="text-[11px] text-gray-400 line-through">{formatMoney(product.price)}</span>}</div></td>
                    <td className="py-3 px-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${isOut ? "bg-rose-50 text-rose-600" : isLow ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>{stock} units</span></td>
                    <td className="py-3 px-4"><span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusClass}`}>{product.status === "ACTIVE" && product.isActive ? "Active" : product.status[0] + product.status.slice(1).toLowerCase()}</span></td>
                    <td className="py-3 px-4 text-right"><div className="flex items-center justify-end gap-1.5">{product.status === "DRAFT" && <Link to={`/admin-dashboard/add-product?productId=${product.id}&step=${setupProgress.get(product.id)?.steps.find((step) => !step.complete)?.key ?? "product"}`} className="whitespace-nowrap rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100" title="Continue the saved product setup">Continue setup · {setupProgress.get(product.id)?.percentage ?? 0}%</Link>}<Link to={`/product/${product.slug}`} target="_blank" className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary-light transition-colors" title="View on storefront"><ExternalLink className="w-4 h-4" /></Link><button disabled={isDeleting} onClick={() => void onDelete(product)} className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-40" title="Remove product"><Trash2 className="w-4 h-4" /></button></div></td>
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
    </div>
  );
};

export default ProductsPage;
