import React, { useMemo, useState } from "react";
import { Search, ChevronDown, ChevronRight, Check } from "lucide-react";
import { ShopFilterState } from "@/data/shopData";
import type { StoreBrand, StoreCategory } from "@/redux/features/storefront/storefrontApi";

const imageUrl = (value?: string | null) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  const apiOrigin = (import.meta.env.VITE_API_ENDPOINT || "http://localhost:4001/api/v1").replace(/\/api\/v\d+\/?$/, "");
  return `${apiOrigin}${value.startsWith("/") ? "" : "/"}${value}`;
};

export interface FigmaShopSidebarProps {
  filters: ShopFilterState;
  categories: StoreCategory[];
  brands: StoreBrand[];
  minPrice: number;
  maxPrice: number;
  onFilterChange: (newFilters: Partial<ShopFilterState>) => void;
  onResetFilters: () => void;
  className?: string;
}

export const FigmaShopSidebar: React.FC<FigmaShopSidebarProps> = ({ filters, categories, brands, minPrice, maxPrice, onFilterChange, onResetFilters, className = "" }) => {
  const [openCategory, setOpenCategory] = useState(filters.category || "");
  const [brandSearch, setBrandSearch] = useState("");
  const filteredBrands = useMemo(() => brands.filter((brand) => brand.name.toLowerCase().includes(brandSearch.trim().toLowerCase())), [brands, brandSearch]);
  const safeMax = Math.max(minPrice + 1, maxPrice);
  const lowPercent = ((filters.priceRange[0] - minPrice) / (safeMax - minPrice)) * 100;
  const highPercent = ((filters.priceRange[1] - minPrice) / (safeMax - minPrice)) * 100;
  const selectedBrand = filters.selectedBrands[0] || "";

  return <aside className={`w-full shrink-0 p-4 bg-white dark:bg-[#111622] rounded-[16px] border border-[#F6E7ED] dark:border-gray-800 flex flex-col gap-5 ${className}`}>
    <section>
      <h3 className="mb-4 text-base font-semibold text-[#A20E4C] dark:text-[#FF4D82]">Filter by price</h3>
      <div className="flex justify-between text-xs text-gray-600"><span>৳{filters.priceRange[0].toLocaleString()}</span><span>৳{filters.priceRange[1].toLocaleString()}</span></div>
      <div className="relative my-3 h-5 touch-none" role="group" aria-label="Price range">
        <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-pink-100" />
        <div className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-pink-500" style={{ left: `${Math.max(0, Math.min(100, lowPercent))}%`, width: `${Math.max(0, Math.min(100, highPercent) - Math.max(0, lowPercent))}%` }} />
        <span aria-hidden="true" className="pointer-events-none absolute top-1/2 z-20 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-pink-500 bg-white shadow-sm" style={{ left: `${Math.max(0, Math.min(100, lowPercent))}%` }} />
        <span aria-hidden="true" className="pointer-events-none absolute top-1/2 z-20 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-pink-500 bg-white shadow-sm" style={{ left: `${Math.max(0, Math.min(100, highPercent))}%` }} />
        <input aria-label="Minimum price" type="range" min={minPrice} max={safeMax} step={Math.max(1, Math.round((safeMax - minPrice) / 100))} value={filters.priceRange[0]} onChange={(event) => onFilterChange({ priceRange: [Math.min(Number(event.target.value), filters.priceRange[1]), filters.priceRange[1]] })} className="absolute inset-0 z-30 h-full w-full cursor-pointer opacity-0" />
        <input aria-label="Maximum price" type="range" min={minPrice} max={safeMax} step={Math.max(1, Math.round((safeMax - minPrice) / 100))} value={filters.priceRange[1]} onChange={(event) => onFilterChange({ priceRange: [filters.priceRange[0], Math.max(Number(event.target.value), filters.priceRange[0])] })} className="absolute inset-0 z-30 h-full w-full cursor-pointer opacity-0" />
      </div>
    </section>
    <div className="h-px bg-pink-100" />
    <section>
      <h3 className="mb-3 text-base font-semibold text-[#A20E4C] dark:text-[#FF4D82]">Categories</h3>
      {categories.length ? <div className="space-y-1">{categories.map((category) => {
        const expanded = openCategory === category.slug;
        return <div key={category.id} className="overflow-hidden rounded-lg">
          <div className="flex items-center">
            <button type="button" onClick={() => onFilterChange({ category: category.slug, subcategory: "" })} aria-pressed={filters.category === category.slug} className={`flex flex-1 items-center gap-2 rounded-lg px-2 py-2.5 text-left text-sm hover:bg-pink-50 dark:hover:bg-gray-800 ${filters.category === category.slug ? "font-semibold text-pink-600" : "text-slate-800 dark:text-slate-100"}`}>
              <span className={`grid h-4 w-4 shrink-0 place-items-center rounded border ${filters.category === category.slug ? "border-[#E72C7E] bg-[#E72C7E] text-white" : "border-slate-300 bg-white dark:border-slate-600 dark:bg-gray-900"}`}>{filters.category === category.slug && <Check size={12} strokeWidth={3} />}</span>
              <span className="min-w-0 flex-1 truncate">{category.name}</span><span className="text-xs text-slate-400">({category._count.products})</span>
            </button>
            {category.subCategories.length > 0 && <button aria-label={`${expanded ? "Collapse" : "Expand"} ${category.name}`} type="button" onClick={() => setOpenCategory(expanded ? "" : category.slug)} className="rounded-lg p-2 text-slate-500 hover:bg-pink-50">{expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</button>}
          </div>
          {expanded && category.subCategories.length > 0 && <div className="ml-4 border-l border-pink-100 py-1 pl-2">{category.subCategories.map((sub) => <button key={sub.id} type="button" onClick={() => onFilterChange({ category: category.slug, subcategory: sub.slug })} className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm hover:bg-pink-50 ${filters.subcategory === sub.slug ? "font-semibold text-pink-600" : "text-slate-600 dark:text-slate-300"}`}>
            <span>{sub.name}</span><span className="text-xs text-slate-400">{sub._count.products}</span>
          </button>)}</div>}
        </div>;
      })}</div> : <p className="text-sm text-slate-500">No categories in published products.</p>}
    </section>
    <div className="h-px bg-pink-100" />
    <section>
      <h3 className="mb-3 text-base font-semibold text-[#A20E4C] dark:text-[#FF4D82]">By brand</h3>
      <label className="mb-3 flex items-center gap-2 rounded-lg border border-pink-100 px-3 py-2"><Search size={16} className="text-slate-400" /><input value={brandSearch} onChange={(event) => setBrandSearch(event.target.value)} placeholder="Search brands" className="w-full bg-transparent text-sm outline-none" /></label>
      <div className="max-h-64 space-y-1 overflow-y-auto">{filteredBrands.map((brand) => <button key={brand.id} type="button" onClick={() => onFilterChange({ selectedBrands: selectedBrand === brand.slug ? [] : [brand.slug] })} className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-pink-50">
        <span className="flex items-center gap-2"><span className={`grid h-5 w-5 place-items-center rounded-full border ${selectedBrand === brand.slug ? "border-4 border-pink-600" : "border-slate-300"}`} />{brand.logo && <img src={imageUrl(brand.logo)} alt="" className="h-6 w-10 rounded border border-slate-100 bg-white object-contain" />}<span className="text-sm">{brand.name}</span></span><span className="text-xs text-slate-400">{brand._count.products}</span>
      </button>)}</div>
    </section>
    <div className="h-px bg-pink-100" />
    <section className="space-y-2">
      <h3 className="mb-3 text-base font-semibold text-[#A20E4C] dark:text-[#FF4D82]">Availability & offers</h3>
      <label className="flex items-center gap-3 px-2 py-1 text-sm"><input type="checkbox" checked={filters.inStockOnly} onChange={(event) => onFilterChange({ inStockOnly: event.target.checked })} />In stock</label>
      <label className="flex items-center gap-3 px-2 py-1 text-sm"><input type="checkbox" checked={filters.onSaleOnly} onChange={(event) => onFilterChange({ onSaleOnly: event.target.checked })} />On sale</label>
      <label className="flex items-center gap-3 px-2 py-1 text-sm"><span>Minimum rating</span><select value={filters.rating || ""} onChange={(event) => onFilterChange({ rating: event.target.value ? Number(event.target.value) : null })} className="ml-auto rounded border border-pink-100 bg-white px-2 py-1"><option value="">Any</option>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating}+</option>)}</select></label>
    </section>
    <div className="h-px bg-pink-100" />
    <section>
      <h3 className="mb-3 text-base font-semibold text-[#A20E4C] dark:text-[#FF4D82]">Sort by</h3>
      <select value={filters.sortBy} onChange={(event) => onFilterChange({ sortBy: event.target.value })} className="w-full rounded-lg border border-pink-100 bg-white px-3 py-2 text-sm">
        <option value="popularity">Newest products</option><option value="rating">Highest rated</option><option value="newest">New arrivals</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option>
      </select>
      <button type="button" onClick={onResetFilters} className="mt-4 w-full rounded-lg border border-pink-200 px-3 py-2 text-sm font-semibold text-pink-700 hover:bg-pink-50">Clear filters</button>
    </section>
  </aside>;
};

export default FigmaShopSidebar;
