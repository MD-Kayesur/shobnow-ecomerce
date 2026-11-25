import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  PRICE_LIMITS,
  Product,
  ShopFilterState,
  SHOP_BANNERS,
} from "@/data/shopData";
import FigmaShopSidebar from "@/components/Shop/FigmaShopSidebar";
import FigmaShopProductCard from "@/components/Shop/FigmaShopProductCard";
import ProductQuickViewModal from "@/components/Shop/ProductQuickViewModal";
import NewsletterVIP from "@/components/Home/LandingPage/NewsletterVIP";
import { ChevronLeft, ChevronRight, PackageSearch, SlidersHorizontal, Grid2X2, List, Star, Truck, Leaf, Gem, Gift } from "lucide-react";
import { toast } from "sonner";
import { useGetStoreFilterOptionsQuery, useGetStoreProductsQuery, type StoreProduct } from "@/redux/features/storefront/storefrontApi";

const mediaUrl = (value?: string | null) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  const apiOrigin = (import.meta.env.VITE_API_ENDPOINT || "http://localhost:4001/api/v1").replace(/\/api\/v\d+\/?$/, "");
  return `${apiOrigin}${value.startsWith("/") ? "" : "/"}${value}`;
};

const toCardProduct = (item: StoreProduct): Product => {
  const regular = Number(item.price);
  const effectivePrice = Number(item.salePrice ?? item.price);
  const gallery = item.media || [];
  const mainMedia = gallery.find((media) => media.isPrimary) || gallery[0];
  const image = mediaUrl(mainMedia?.imageUrl);
  const stockQuantity = Math.max(item.stock || 0, ...item.variants.map((variant) => variant.stockQuantity || 0));
  return {
    id: item.id, name: item.name, slug: item.slug, brand: item.brand?.name || "Shop Now",
    category: item.category?.slug || "", subcategory: item.subCategory?.slug || "", price: effectivePrice,
    ...(effectivePrice < regular ? { originalPrice: regular, discountPercent: Math.round((1 - effectivePrice / regular) * 100) } : {}),
    rating: item.reviewSummary?.averageRating || 0, reviewsCount: item.reviewSummary?.reviewCount || 0,
    inStock: stockQuantity > 0, stockQuantity, image, hoverImage: mediaUrl(gallery.find((media) => media.id !== mainMedia?.id)?.imageUrl),
    description: item.shortDescription || item.description || "", volume: item.variants.find((variant) => variant.isDefault)?.variantName || "",
    isFeatured: item.displayType === "FEATURED", isNewArrival: item.displayType === "NEW_ARRIVAL", sku: item.variants[0]?.sku || undefined,
    productType: item.productType, galleryImages: gallery.map((media) => mediaUrl(media.imageUrl)).filter(Boolean),
  };
};

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Banner Carousel State
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % SHOP_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Filter State
  const initialCategory = searchParams.get("category") || "";
  const initialSubcategory = searchParams.get("subcategory") || "";
  const initialBrand = searchParams.get("brand") || "";
  const initialSearch = searchParams.get("search") || "";
  const initialSort = searchParams.get("sort") || "popularity";

  const [filters, setFilters] = useState<ShopFilterState>({
    search: initialSearch,
    category: initialCategory,
    subcategory: initialSubcategory,
    selectedBrands: initialBrand ? [initialBrand] : [],
    priceRange: [PRICE_LIMITS.min, PRICE_LIMITS.max],
    inStockOnly: false,
    onSaleOnly: false,
    rating: null,
    skinConcern: "",
    sortBy: initialSort,
  });

  const { data: filterResponse } = useGetStoreFilterOptionsQuery();
  const filterOptions = filterResponse?.data;
  const minPrice = filterOptions?.priceRange.min ?? PRICE_LIMITS.min;
  const maxPrice = filterOptions?.priceRange.max ?? PRICE_LIMITS.max;

  // Keep desktop's five-column product grid visually balanced (three full rows).
  const [itemsPerPage] = useState<number>(15);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Quick View & Wishlist state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const listQuery = {
    page: currentPage,
    limit: itemsPerPage,
    ...(filters.search.trim() ? { search: filters.search.trim() } : {}),
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.subcategory ? { subcategory: filters.subcategory } : {}),
    ...(filters.selectedBrands[0] ? { brand: filters.selectedBrands[0] } : {}),
    ...(filters.priceRange[0] > minPrice ? { minPrice: filters.priceRange[0] } : {}),
    ...(filters.priceRange[1] < maxPrice ? { maxPrice: filters.priceRange[1] } : {}),
    ...(filters.inStockOnly ? { inStock: true } : {}),
    ...(filters.onSaleOnly ? { onSale: true } : {}),
    ...(filters.rating ? { minRating: filters.rating } : {}),
    sort: filters.sortBy,
  };
  const { data: productResponse, isLoading, isFetching, isError, refetch } = useGetStoreProductsQuery(listQuery);
  const paginatedProducts = (productResponse?.data || []).map(toCardProduct);
  const totalItems = productResponse?.meta?.total ?? 0;
  const totalPages = Math.max(1, productResponse?.meta?.totalPages ?? 1);
  const categoryShortcut = (preferred: RegExp, fallback?: RegExp) => {
    const options = filterOptions?.categories || [];
    return options.find((category) => preferred.test(`${category.name} ${category.slug}`))
      || options.find((category) => fallback?.test(`${category.name} ${category.slug}`));
  };
  const skincareCategory = categoryShortcut(/skin.?care|cosmetic|beauty/i);
  const jewelryCategory = categoryShortcut(/jewel/i, /accessor/i);
  const comboCategory = categoryShortcut(/combo|bundle|gift.?set/i);

  const isQuickFilterActive = (key: "deals" | "popular" | "stock" | "skincare" | "jewelry" | "combo") => {
    if (key === "deals") return filters.onSaleOnly;
    if (key === "popular") return filters.sortBy === "popularity";
    if (key === "stock") return filters.inStockOnly;
    if (key === "skincare") return !!skincareCategory && filters.category === skincareCategory.slug;
    if (key === "combo") return !!comboCategory && filters.category === comboCategory.slug;
    return !!jewelryCategory && filters.category === jewelryCategory.slug;
  };

  useEffect(() => {
    const cat = searchParams.get("category") || "";
    const sub = searchParams.get("subcategory") || "";
    const brand = searchParams.get("brand") || "";
    const q = searchParams.get("search") || "";

    setFilters((prev) => ({
      ...prev,
      category: cat,
      subcategory: sub,
      selectedBrands: brand ? [brand] : prev.selectedBrands,
      search: q,
    }));
    setCurrentPage(1);
  }, [searchParams]);

  const handleFilterChange = (newFilters: Partial<ShopFilterState>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      const params = new URLSearchParams();
      if (updated.category) params.set("category", updated.category);
      if (updated.subcategory) params.set("subcategory", updated.subcategory);
      if (updated.search) params.set("search", updated.search);
      if (updated.selectedBrands.length === 1) {
        params.set("brand", updated.selectedBrands[0]);
      }
      if (updated.sortBy !== "popularity") params.set("sort", updated.sortBy);
      setSearchParams(params, { replace: true });
      return updated;
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      category: "",
      subcategory: "",
      selectedBrands: [],
      priceRange: [PRICE_LIMITS.min, PRICE_LIMITS.max],
      inStockOnly: false,
      onSaleOnly: false,
      rating: null,
      skinConcern: "",
      sortBy: "popularity",
    });
    setSearchParams(new URLSearchParams(), { replace: true });
    setCurrentPage(1);
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const updated = !prev[product.id];
      if (updated) {
        toast.success(`Added ${product.name} to wishlist!`);
      } else {
        toast.info(`Removed ${product.name} from wishlist.`);
      }
      return { ...prev, [product.id]: updated };
    });
  };

  useEffect(() => {
    if (!filterOptions) return;
    setFilters((previous) => ({
      ...previous,
      priceRange: previous.priceRange[0] === PRICE_LIMITS.min && previous.priceRange[1] === PRICE_LIMITS.max
        ? [filterOptions.priceRange.min, filterOptions.priceRange.max]
        : previous.priceRange,
    }));
  }, [filterOptions]);

  return (
    <div className="w-full bg-[#FDFBF9] dark:bg-[#090D14] text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200">
      {/* 1. TOP CAROUSEL BANNER (Exact Figma: width 1360, height 234, borderRadius: 24, 4 dots) */}
      <section className="w-full pt-6 sm:pt-8 pb-4">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          <div className="relative w-full h-[180px] sm:h-[234px] rounded-[24px] overflow-hidden bg-[#E9EBEE] dark:bg-gray-800 shadow-xs select-none">
            {/* Banner Image */}
            <img
              src={SHOP_BANNERS[activeBannerIndex].image}
              alt={SHOP_BANNERS[activeBannerIndex].alt}
              className="w-full h-full object-cover object-center transition-all duration-700"
            />

            {/* 4 Pagination Dots at Bottom Center (Exact Figma: left: 647, top: 202, gap: 6) */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 z-20">
              {SHOP_BANNERS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveBannerIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer shadow-xs ${
                    activeBannerIndex === idx
                      ? "bg-[#FDFDFD] scale-110"
                      : "bg-[#272A31]/60 hover:bg-[#272A31]/90"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Toggle Button */}
      <div className="lg:hidden max-w-[1360px] mx-auto px-4 py-2">
        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen(true)}
          className="w-full py-2.5 px-4 bg-[#FFFCFE] dark:bg-[#111622] border border-[#F6E7ED] dark:border-gray-800 rounded-xl flex items-center justify-center gap-2 text-sm font-inter font-semibold text-[#A20E4C] dark:text-[#FF4D82] shadow-2xs cursor-pointer"
        >
          <SlidersHorizontal size={16} />
          <span>Filter Products &amp; Brands</span>
        </button>
      </div>

      {/* 2. MAIN BODY 2-COLUMN LAYOUT: Sidebar (325px) + Product Grid (1015px) */}
      <section className="w-full py-6 sm:py-10">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 flex flex-col lg:flex-row items-start gap-5 lg:gap-6">
          {/* Desktop Left Sidebar (Exact Figma: width 325, padding 16, background #FFFCFE, borderRadius 16, outline 1px #F6E7ED) */}
          <div className="hidden lg:block w-[250px] shrink-0 sticky top-24">
            <FigmaShopSidebar
              filters={filters}
              categories={filterOptions?.categories || []}
              brands={filterOptions?.brands || []}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Storefront catalog */}
          <div className="flex-1 w-full min-w-0 flex flex-col justify-between">
            <div className="mb-5 space-y-4">
              <div className="flex flex-col gap-4 rounded-2xl border border-[#F6E7ED] bg-white p-4 shadow-[0_2px_8px_rgba(80,6,36,0.04)] dark:border-gray-800 dark:bg-[#111622] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#17213B] dark:text-white sm:text-2xl">Shop Beauty &amp; Lifestyle</h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{isLoading ? "Finding products…" : `${totalItems.toLocaleString()} ${totalItems === 1 ? "product" : "products"} found`}</p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <label className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="hidden sm:inline">Sort by</span>
                    <select aria-label="Sort products" value={filters.sortBy} onChange={(event) => handleFilterChange({ sortBy: event.target.value })} className="h-10 rounded-xl border border-[#F6E7ED] bg-white px-3 text-sm font-medium text-[#17213B] outline-none focus:border-pink-400 dark:border-gray-700 dark:bg-[#161C2C] dark:text-white">
                      <option value="popularity">Popular</option><option value="newest">Newest</option><option value="rating">Top rated</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option>
                    </select>
                  </label>
                  <div className="flex h-10 rounded-xl border border-[#F6E7ED] p-1 dark:border-gray-700" aria-label="Product view">
                    <button type="button" aria-label="Grid view" aria-pressed={viewMode === "grid"} onClick={() => setViewMode("grid")} className={`grid h-8 w-9 place-items-center rounded-lg transition ${viewMode === "grid" ? "bg-[#E72C7E] text-white" : "text-slate-500 hover:bg-pink-50 dark:hover:bg-gray-800"}`}><Grid2X2 size={16} /></button>
                    <button type="button" aria-label="List view" aria-pressed={viewMode === "list"} onClick={() => setViewMode("list")} className={`grid h-8 w-9 place-items-center rounded-lg transition ${viewMode === "list" ? "bg-[#E72C7E] text-white" : "text-slate-500 hover:bg-pink-50 dark:hover:bg-gray-800"}`}><List size={17} /></button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto px-0.5 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Quick product filters">
                <button type="button" onClick={() => handleFilterChange({ onSaleOnly: !filters.onSaleOnly })} aria-pressed={filters.onSaleOnly} className={`inline-flex h-9 min-w-[144px] shrink-0 items-center justify-center gap-2 rounded-full border px-4 text-xs font-semibold shadow-[0_2px_8px_rgba(32,24,41,0.07)] transition hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(32,24,41,0.11)] ${filters.onSaleOnly ? "border-pink-200 bg-gradient-to-r from-[#FFE5F1] to-[#FFF2F8] text-[#B11057]" : "border-[#F8E3EC] bg-gradient-to-r from-[#FFF0F7] to-white text-[#A90E50]"}`}><span aria-hidden="true" className="text-[15px] leading-none">🔥</span>Top Deals</button>
                <button type="button" onClick={() => handleFilterChange({ sortBy: filters.sortBy === "popularity" ? "rating" : "popularity" })} aria-pressed={filters.sortBy === "rating"} className={`inline-flex h-9 min-w-[154px] shrink-0 items-center justify-center gap-2 rounded-full border px-4 text-xs font-semibold shadow-[0_2px_8px_rgba(32,24,41,0.07)] transition hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(32,24,41,0.11)] ${filters.sortBy === "rating" ? "border-pink-200 bg-[#FFF2F8] text-[#E72C7E]" : "border-[#F8E3EC] bg-white text-[#17213B]"}`}><Star size={16} className="text-[#EC177B]" />Best Seller</button>
                <Link to="/delivery-policy" aria-label="View free delivery information" className="inline-flex h-9 min-w-[180px] shrink-0 items-center justify-center gap-2 rounded-full border border-[#F8E3EC] bg-white px-4 text-xs font-semibold text-[#17213B] shadow-[0_2px_8px_rgba(32,24,41,0.07)] transition hover:-translate-y-px hover:border-pink-200 hover:shadow-[0_4px_12px_rgba(32,24,41,0.11)]"><Truck size={16} className="text-[#EC177B]" />Free Delivery</Link>
                <button type="button" onClick={() => comboCategory && handleFilterChange({ category: filters.category === comboCategory.slug ? "" : comboCategory.slug, subcategory: "" })} aria-pressed={isQuickFilterActive("combo")} className={`inline-flex h-9 min-w-[158px] shrink-0 items-center justify-center gap-2 rounded-full border px-4 text-xs font-semibold shadow-[0_2px_8px_rgba(32,24,41,0.07)] transition hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(32,24,41,0.11)] ${isQuickFilterActive("combo") ? "border-pink-200 bg-[#FFF2F8] text-[#E72C7E]" : "border-[#F8E3EC] bg-white text-[#17213B]"}`}><Gift size={16} className="text-[#EC177B]" />Combo Offers</button>
                <button type="button" onClick={() => skincareCategory && handleFilterChange({ category: filters.category === skincareCategory.slug ? "" : skincareCategory.slug, subcategory: "" })} aria-pressed={isQuickFilterActive("skincare")} className={`inline-flex h-9 min-w-[146px] shrink-0 items-center justify-center gap-2 rounded-full border px-4 text-xs font-semibold shadow-[0_2px_8px_rgba(32,24,41,0.07)] transition hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(32,24,41,0.11)] ${isQuickFilterActive("skincare") ? "border-pink-200 bg-[#FFF2F8] text-[#E72C7E]" : "border-[#F8E3EC] bg-white text-[#17213B]"}`}><Leaf size={16} className="text-[#EC177B]" />Skin Care</button>
                <button type="button" onClick={() => jewelryCategory && handleFilterChange({ category: filters.category === jewelryCategory.slug ? "" : jewelryCategory.slug, subcategory: "" })} aria-pressed={isQuickFilterActive("jewelry")} className={`inline-flex h-9 min-w-[140px] shrink-0 items-center justify-center gap-2 rounded-full border px-4 text-xs font-semibold shadow-[0_2px_8px_rgba(32,24,41,0.07)] transition hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(32,24,41,0.11)] ${isQuickFilterActive("jewelry") ? "border-pink-200 bg-[#FFF2F8] text-[#E72C7E]" : "border-[#F8E3EC] bg-white text-[#17213B]"}`}><Gem size={16} className="text-[#EC177B]" />Jewelry</button>
              </div>
            </div>

            {/* Compact, responsive product catalog */}
            {isLoading ? (
              <div className={`grid ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-5" : "grid-cols-1"} gap-3 sm:gap-4`} aria-label="Loading products">
                {Array.from({ length: 8 }, (_, index) => <div key={index} className="h-[300px] animate-pulse rounded-2xl border border-pink-100 bg-white"><div className="h-[190px] rounded-t-2xl bg-slate-100" /><div className="space-y-3 p-3"><div className="h-4 w-3/4 rounded bg-slate-100"/><div className="h-4 w-1/2 rounded bg-slate-100"/><div className="h-9 rounded bg-pink-50"/></div></div>)}
              </div>
            ) : isError ? (
              <div role="alert" className="my-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
                <p className="font-semibold">We couldn’t load the product catalog.</p>
                <p className="mt-1 text-sm">Check your connection and try again.</p>
                <button type="button" onClick={() => void refetch()} className="mt-4 rounded-lg bg-[#A20E4C] px-5 py-2 text-sm font-semibold text-white">Retry</button>
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div className={`grid ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-5" : "grid-cols-1"} gap-3 sm:gap-4`}>
                {paginatedProducts.map((product) => (
                  <FigmaShopProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                    isWishlisted={!!wishlist[product.id]}
                    onToggleWishlist={handleToggleWishlist}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-[#FFFCFE] dark:bg-[#111622] rounded-2xl p-12 text-center flex flex-col items-center justify-center my-8 border border-[#F6E7ED] dark:border-gray-800">
                <div className="w-16 h-16 rounded-full bg-pink-50 dark:bg-pink-950/40 text-[#A20E4C] dark:text-[#FF4D82] flex items-center justify-center mb-4">
                  <PackageSearch size={32} />
                </div>
                <h3 className="text-xl font-bold font-faustina text-gray-900 dark:text-white mb-2">
                  No matching products found
                </h3>
                <p className="text-sm font-inter text-gray-500 dark:text-gray-400 max-w-md mb-6">
                  We couldn't find any products matching your filter criteria. Try resetting or selecting another brand or price range.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#A20E4C] hover:bg-[#8e0c42] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {!isLoading && !isError && <p className="mt-5 text-sm text-slate-500">Showing {paginatedProducts.length ? (currentPage - 1) * itemsPerPage + 1 : 0}–{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} products{isFetching ? " · Updating…" : ""}</p>}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-between border-t border-[#F6E7ED] dark:border-gray-800 pt-6 px-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-inter font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-[#F6E7ED] dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1 sm:gap-1.5">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-lg text-sm font-inter font-semibold transition-all cursor-pointer ${
                          currentPage === pageNum
                            ? "bg-[#FFE2FF] text-[#500624] font-bold shadow-xs border border-[#500624]/20"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-[#F6E7ED] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-inter font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-[#F6E7ED] dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. VIP NEWSLETTER: Get Notified When We Launch (Exact Figma: top: 2281, #FEEAF1) */}
      <NewsletterVIP />

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white dark:bg-[#111622] h-full overflow-y-auto p-4 z-10 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
              <h2 className="text-lg font-bold font-faustina text-gray-900 dark:text-white">Filters</h2>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white font-semibold text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
            <FigmaShopSidebar
              filters={filters}
              categories={filterOptions?.categories || []}
              brands={filterOptions?.brands || []}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onFilterChange={(newF) => {
                handleFilterChange(newF);
                setIsMobileFiltersOpen(false);
              }}
              onResetFilters={() => {
                handleResetFilters();
                setIsMobileFiltersOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Interactive Product Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={quickViewProduct ? !!wishlist[quickViewProduct.id] : false}
        onToggleWishlist={handleToggleWishlist}
      />
    </div>
  );
};

export default Shop;
