import React, { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { ShopFilterState, SIDEBAR_BRANDS } from "@/data/shopData";

export interface FigmaShopSidebarProps {
  filters: ShopFilterState;
  onFilterChange: (newFilters: Partial<ShopFilterState>) => void;
  onResetFilters: () => void;
  className?: string;
}

export const FigmaShopSidebar: React.FC<FigmaShopSidebarProps> = ({
  filters,
  onFilterChange,
  className = "",
}) => {
  const [openCategory, setOpenCategory] = useState<string>("jewellery");
  const [brandSearch, setBrandSearch] = useState("");

  const minPrice = 30;
  const maxPrice = 25000;
  const currentMin = filters.priceRange ? filters.priceRange[0] : minPrice;
  const currentMax = filters.priceRange ? filters.priceRange[1] : maxPrice;

  const minPercent = Math.min(
    100,
    Math.max(0, ((currentMin - minPrice) / (maxPrice - minPrice)) * 100)
  );
  const maxPercent = Math.min(
    100,
    Math.max(0, ((currentMax - minPrice) / (maxPrice - minPrice)) * 100)
  );

  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return SIDEBAR_BRANDS;
    return SIDEBAR_BRANDS.filter((b) =>
      b.name.toLowerCase().includes(brandSearch.toLowerCase())
    );
  }, [brandSearch]);

  const toggleCategory = (cat: string) => {
    setOpenCategory((prev) => (prev === cat ? "" : cat));
  };

  const handleBrandSelect = (brandName: string) => {
    const isAlreadySelected = filters.selectedBrands.includes(brandName);
    onFilterChange({
      selectedBrands: isAlreadySelected ? [] : [brandName],
    });
  };

  return (
    <aside
      className={`w-full lg:w-[325px] shrink-0 p-4 bg-[#FFFCFE] dark:bg-[#111622] rounded-[16px] border border-[#F6E7ED] dark:border-gray-800 flex flex-col gap-8 select-none transition-colors duration-200 ${className}`}
    >
      {/* 1. FILTER BY PRICE (Exact Figma Slider) */}
      <div className="w-full flex flex-col gap-10">
        <h3 className="text-base font-inter font-semibold text-[#A20E4C] dark:text-[#FF4D82] leading-6">
          Filter By Price
        </h3>

        {/* Dual Range Slider with Tooltips */}
        <div className="relative w-full px-2 py-4">
          {/* Base Background Track (Figma: background: #F6E7ED, height: 8px) */}
          <div className="relative w-full h-2 bg-[#F6E7ED] dark:bg-gray-800 rounded-full">
            {/* Active Pink Fill Track (Figma: background: #D490AD) */}
            <div
              className="absolute h-2 bg-[#D490AD] dark:bg-[#FF4D82] rounded-full"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`,
              }}
            />
          </div>

          {/* Native Hidden Dual Range Inputs */}
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={50}
            value={currentMin}
            onChange={(e) => {
              const val = Math.min(Number(e.target.value), currentMax - 100);
              onFilterChange({ priceRange: [val, currentMax] });
            }}
            className="absolute inset-x-2 top-3 w-[calc(100%-16px)] h-4 opacity-0 cursor-pointer pointer-events-auto z-30"
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={50}
            value={currentMax}
            onChange={(e) => {
              const val = Math.max(Number(e.target.value), currentMin + 100);
              onFilterChange({ priceRange: [currentMin, val] });
            }}
            className="absolute inset-x-2 top-3 w-[calc(100%-16px)] h-4 opacity-0 cursor-pointer pointer-events-auto z-30"
          />

          {/* Left Thumb Handle & Floating Tooltip */}
          <div
            className="absolute top-2 w-6 h-6 -ml-3 pointer-events-none z-20 flex items-center justify-center"
            style={{ left: `calc(${minPercent}% + 8px)` }}
          >
            {/* Circular Handle */}
            <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-900 border-2 border-[#B53E70] dark:border-[#FF4D82] shadow-xs" />
            {/* Floating Tooltip Box */}
            <div className="absolute -top-10 px-3 py-1 bg-white dark:bg-gray-800 rounded-lg border border-black/10 dark:border-gray-700 shadow-md">
              <span className="text-[12px] font-manrope font-semibold text-[#414651] dark:text-gray-200 whitespace-nowrap">
                {currentMin.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Right Thumb Handle & Floating Tooltip */}
          <div
            className="absolute top-2 w-6 h-6 -ml-3 pointer-events-none z-20 flex items-center justify-center"
            style={{ left: `calc(${maxPercent}% + 8px)` }}
          >
            {/* Circular Handle */}
            <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-900 border-2 border-[#B53E70] dark:border-[#FF4D82] shadow-xs" />
            {/* Floating Tooltip Box */}
            <div className="absolute -top-10 px-3 py-1 bg-white dark:bg-gray-800 rounded-lg border border-black/10 dark:border-gray-700 shadow-md">
              <span className="text-[12px] font-manrope font-semibold text-[#414651] dark:text-gray-200 whitespace-nowrap">
                {currentMax.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#F6E7ED] dark:bg-gray-800" />

      {/* 2. ALL CATEGORIES ACCORDION */}
      <div className="w-full flex flex-col gap-4">
        <h3 className="text-base font-inter font-semibold text-[#A20E4C] dark:text-[#FF4D82] leading-6">
          All Categories
        </h3>

        <div className="flex flex-col gap-2">
          {/* Category Item 1: Jewellery & Accessories */}
          <div className="rounded-lg overflow-hidden border border-[#F6E7ED]/60 dark:border-gray-800 bg-white dark:bg-[#161C2C]">
            <button
              type="button"
              onClick={() => toggleCategory("jewellery")}
              className="w-full h-14 px-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors"
            >
              <span className="text-base font-inter font-normal text-[#1B1E23] dark:text-gray-100">
                Jewellery &amp; Accessories
              </span>
              <div className="text-gray-700 dark:text-gray-300">
                {openCategory === "jewellery" ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </div>
            </button>

            {openCategory === "jewellery" && (
              <div className="flex flex-col border-t border-[#F6E7ED] dark:border-gray-800">
                {[
                  "Earrings",
                  "Nose Rings & Pins",
                  "Bangles & Bracelets",
                  "Rings",
                  "Necklace & Chains",
                ].map((sub, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      onFilterChange({
                        category: "jewellery",
                        subcategory: sub.toLowerCase(),
                      })
                    }
                    className="w-full h-12 px-4 flex items-center justify-between hover:bg-pink-50/30 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                  >
                    <span className="text-sm font-inter text-[#33373F] dark:text-gray-300 group-hover:text-[#A20E4C] dark:group-hover:text-[#FF4D82]">
                      {sub}
                    </span>
                    <span className="w-6 h-6 rounded-[20px] bg-[#E9EBEE] dark:bg-gray-800 border border-[#D4D7DE] dark:border-gray-700 text-[10px] font-inter font-medium text-[#3F444E] dark:text-gray-300 flex items-center justify-center">
                      50
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Item 2: Beauty & Personal Care */}
          <div className="rounded-lg overflow-hidden border border-[#F6E7ED]/60 dark:border-gray-800 bg-white dark:bg-[#161C2C]">
            <button
              type="button"
              onClick={() => toggleCategory("beauty")}
              className="w-full h-14 px-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors"
            >
              <span className="text-base font-inter font-normal text-[#1B1E23] dark:text-gray-100">
                Beauty &amp; Personal Care
              </span>
              <div className="text-gray-700 dark:text-gray-300">
                {openCategory === "beauty" ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </div>
            </button>

            {openCategory === "beauty" && (
              <div className="flex flex-col border-t border-[#F6E7ED] dark:border-gray-800">
                {[
                  "Skin Care",
                  "Personal Care",
                  "Makeup",
                  "Lip Care",
                  "Hair Care",
                  "Fragrance",
                ].map((sub, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      onFilterChange({
                        category: "beauty",
                        subcategory: sub.toLowerCase(),
                      })
                    }
                    className="w-full h-12 px-4 flex items-center justify-between hover:bg-pink-50/30 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                  >
                    <span className="text-sm font-inter text-[#33373F] dark:text-gray-300 group-hover:text-[#A20E4C] dark:group-hover:text-[#FF4D82]">
                      {sub}
                    </span>
                    <span className="w-6 h-6 rounded-[20px] bg-[#E9EBEE] dark:bg-gray-800 border border-[#D4D7DE] dark:border-gray-700 text-[10px] font-inter font-medium text-[#3F444E] dark:text-gray-300 flex items-center justify-center">
                      50
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#F6E7ED] dark:bg-gray-800" />

      {/* 3. BY BRAND (Search + Scrollable Radio List) */}
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-inter font-semibold text-[#A20E4C] dark:text-[#FF4D82] leading-6">
            By Brand
          </h3>
          {/* Brand Search Bar */}
          <div className="w-full px-3.5 py-2.5 bg-[#FDFDFD] dark:bg-gray-800/90 rounded-lg border border-[#F6E7ED] dark:border-gray-700 flex items-center gap-2">
            <Search size={18} className="text-[#80899C] dark:text-gray-400" />
            <input
              type="text"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              placeholder="Search your brand"
              className="w-full bg-transparent text-sm font-inter text-[#1B1E23] dark:text-gray-100 placeholder-[#80899C] dark:placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Scrollable Brands */}
        <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-1">
          {filteredBrands.map((brand) => {
            const isSelected = filters.selectedBrands.includes(brand.name);
            return (
              <button
                key={brand.id}
                type="button"
                onClick={() => handleBrandSelect(brand.name)}
                className="w-full py-2 px-3 flex items-center justify-between hover:bg-pink-50/20 dark:hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {/* Custom Radio Button */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all bg-[#FDFDFD] dark:bg-gray-900 ${
                      isSelected
                        ? "border-4 border-[#A20E4C] dark:border-[#FF4D82]"
                        : "border-2 border-[#F6E7ED] dark:border-gray-700"
                    }`}
                  />
                  {/* Brand Logo Thumbnail */}
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-10 h-6 object-contain rounded-xs border border-gray-100 dark:border-gray-700 bg-white"
                  />
                  <span className="text-base font-inter font-normal text-[#1B1E23] dark:text-gray-200">
                    {brand.name}
                  </span>
                </div>
                {/* Count Badge */}
                <span className="w-6 h-6 rounded-[20px] bg-[#E9EBEE] dark:bg-gray-800 border border-[#D4D7DE] dark:border-gray-700 text-[10px] font-inter font-medium text-[#3F444E] dark:text-gray-300 flex items-center justify-center">
                  {brand.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#F6E7ED] dark:bg-gray-800" />

      {/* 4. FILTER BY STATUS */}
      <div className="w-full flex flex-col gap-4">
        <h3 className="text-base font-inter font-semibold text-[#A20E4C] dark:text-[#FF4D82] leading-6">
          Filter By Status
        </h3>
        <div className="flex flex-col gap-1">
          {/* On Sale */}
          <button
            type="button"
            onClick={() => onFilterChange({ onSaleOnly: !filters.onSaleOnly })}
            className="w-full py-2 px-3 flex items-center gap-3 hover:bg-pink-50/20 dark:hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer"
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all bg-[#FDFDFD] dark:bg-gray-900 ${
                filters.onSaleOnly
                  ? "border-4 border-[#A20E4C] dark:border-[#FF4D82]"
                  : "border-2 border-[#F6E7ED] dark:border-gray-700"
              }`}
            />
            <span
              className={`text-base font-inter ${
                filters.onSaleOnly
                  ? "font-semibold text-[#A20E4C] dark:text-[#FF4D82]"
                  : "font-normal text-[#1B1E23] dark:text-gray-200"
              }`}
            >
              On sale
            </span>
          </button>

          {/* In Stock */}
          <button
            type="button"
            onClick={() => onFilterChange({ inStockOnly: !filters.inStockOnly })}
            className="w-full py-2 px-3 flex items-center gap-3 hover:bg-pink-50/20 dark:hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer"
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all bg-[#FDFDFD] dark:bg-gray-900 ${
                filters.inStockOnly
                  ? "border-4 border-[#A20E4C] dark:border-[#FF4D82]"
                  : "border-2 border-[#F6E7ED] dark:border-gray-700"
              }`}
            />
            <span
              className={`text-base font-inter ${
                filters.inStockOnly
                  ? "font-semibold text-[#A20E4C] dark:text-[#FF4D82]"
                  : "font-normal text-[#1B1E23] dark:text-gray-200"
              }`}
            >
              In-stock
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#F6E7ED] dark:bg-gray-800" />

      {/* 5. SORT BY */}
      <div className="w-full flex flex-col gap-4">
        <h3 className="text-base font-inter font-semibold text-[#A20E4C] dark:text-[#FF4D82] leading-6">
          Sort By
        </h3>
        <div className="flex flex-col gap-1">
          {[
            { id: "popularity", label: "Popularity" },
            { id: "rating", label: "Average rating" },
            { id: "newness", label: "Newness" },
            { id: "price_asc", label: "Price: low to high" },
            { id: "price_desc", label: "Price: high to low" },
          ].map((item) => {
            const isSelected = filters.sortBy === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onFilterChange({ sortBy: item.id })}
                className="w-full py-2 px-3 flex items-center gap-3 hover:bg-pink-50/20 dark:hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all bg-[#FDFDFD] dark:bg-gray-900 ${
                    isSelected
                      ? "border-4 border-[#500624] dark:border-[#FFE2FF] bg-[#FFE2FF]"
                      : "border-2 border-[#F6E7ED] dark:border-gray-700"
                  }`}
                />
                <span
                  className={`text-base font-inter ${
                    isSelected
                      ? "font-bold text-[#500624] dark:text-[#FFE2FF]"
                      : "font-normal text-[#1B1E23] dark:text-gray-200"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default FigmaShopSidebar;
