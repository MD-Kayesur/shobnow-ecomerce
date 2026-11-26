import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  MOCK_PRODUCTS,
  PRICE_LIMITS,
  Product,
  ShopFilterState,
  SHOP_BANNERS,
} from "@/data/shopData";
import FigmaShopSidebar from "@/components/Shop/FigmaShopSidebar";
import FigmaShopProductCard from "@/components/Shop/FigmaShopProductCard";
import ProductQuickViewModal from "@/components/Shop/ProductQuickViewModal";
import NewsletterVIP from "@/components/Home/LandingPage/NewsletterVIP";
import { ChevronLeft, ChevronRight, PackageSearch, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

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

  const [itemsPerPage] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Quick View & Wishlist state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

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

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // 1. Keyword search
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesTags = product.tags?.some((t) =>
          t.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesBrand && !matchesTags) return false;
      }

      // 2. Category & Subcategory
      if (filters.category) {
        if (filters.category === "jewellery") {
          // Jewellery filter
          const isJewellery =
            product.category === "accessories" ||
            product.category === "bags" ||
            product.name.toLowerCase().includes("ring") ||
            product.name.toLowerCase().includes("earring") ||
            product.name.toLowerCase().includes("necklace") ||
            product.name.toLowerCase().includes("bracelet");
          if (!isJewellery) return false;
        } else if (filters.category === "beauty") {
          // Beauty filter
          const isBeauty =
            product.category === "skin-care" ||
            product.category === "makeup" ||
            product.category === "fragrance" ||
            product.category === "hair-care" ||
            product.category === "body-care";
          if (!isBeauty) return false;
        } else {
          const matchesCategory = product.category === filters.category;
          if (!matchesCategory) return false;
        }
      }

      // 3. Brands
      if (
        filters.selectedBrands.length > 0 &&
        !filters.selectedBrands.some(
          (b) => b.trim().toLowerCase() === product.brand.trim().toLowerCase()
        )
      ) {
        return false;
      }

      // 4. Price Range
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      ) {
        return false;
      }

      // 5. In Stock Only
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      // 6. On Sale Only
      if (filters.onSaleOnly && (!product.discountPercent || product.discountPercent <= 0)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "popularity":
        default:
          return b.reviewsCount - a.reviewsCount;
      }
    });
  }, [filters]);

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          {/* Desktop Left Sidebar (Exact Figma: width 325, padding 16, background #FFFCFE, borderRadius 16, outline 1px #F6E7ED) */}
          <div className="hidden lg:block w-[325px] shrink-0 sticky top-24">
            <FigmaShopSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Right Section: 4-Column Product Grid (Exact Figma: width 1015, left 625, top 498) */}
          <div className="flex-1 w-full min-w-0 flex flex-col justify-between">
            {/* Product Grid: 4 columns on large screens, 3 on md, 2 on sm */}
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {paginatedProducts.map((product) => (
                  <FigmaShopProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                    isWishlisted={!!wishlist[product.id]}
                    onToggleWishlist={handleToggleWishlist}
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
