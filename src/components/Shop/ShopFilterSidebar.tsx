import React, { useState } from "react";
import {
  Search,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  Star,
  Check,
  X,
  SlidersHorizontal,
} from "lucide-react";
import {
  CategoryItem,
  BrandItem,
  ShopFilterState,
  PRICE_LIMITS,
  SKIN_CONCERNS,
} from "@/data/shopData";

export interface ShopFilterSidebarProps {
  categories: CategoryItem[];
  brands: BrandItem[];
  filters: ShopFilterState;
  onFilterChange: (newFilters: Partial<ShopFilterState>) => void;
  onResetFilters: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const ShopFilterSidebar: React.FC<ShopFilterSidebarProps> = ({
  categories,
  brands,
  filters,
  onFilterChange,
  onResetFilters,
  isMobile = false,
  onCloseMobile,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "skin-care": true,
    makeup: true,
  });
  const [brandSearch, setBrandSearch] = useState("");
  const [localMinPrice, setLocalMinPrice] = useState(filters.priceRange[0]);
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.priceRange[1]);

  const toggleCategoryExpand = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleCategorySelect = (slug: string) => {
    if (filters.category === slug) {
      onFilterChange({ category: "", subcategory: "" });
    } else {
      onFilterChange({ category: slug, subcategory: "" });
    }
  };

  const handleSubcategorySelect = (subSlug: string, catSlug: string) => {
    if (filters.subcategory === subSlug) {
      onFilterChange({ subcategory: "" });
    } else {
      onFilterChange({ category: catSlug, subcategory: subSlug });
    }
  };

  const handleBrandToggle = (brandName: string) => {
    const exists = filters.selectedBrands.includes(brandName);
    const updated = exists
      ? filters.selectedBrands.filter((b) => b !== brandName)
      : [...filters.selectedBrands, brandName];
    onFilterChange({ selectedBrands: updated });
  };

  const handlePriceApply = () => {
    const min = Math.max(PRICE_LIMITS.min, Math.min(localMinPrice, localMaxPrice));
    const max = Math.min(PRICE_LIMITS.max, Math.max(localMinPrice, localMaxPrice));
    onFilterChange({ priceRange: [min, max] });
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const hasActiveFilters =
    filters.category !== "" ||
    filters.subcategory !== "" ||
    filters.selectedBrands.length > 0 ||
    filters.search !== "" ||
    filters.inStockOnly ||
    filters.onSaleOnly ||
    filters.rating !== null ||
    (filters.skinConcern !== "" && filters.skinConcern !== "All Concerns") ||
    filters.priceRange[0] !== PRICE_LIMITS.min ||
    filters.priceRange[1] !== PRICE_LIMITS.max;

  return (
    <div className={`flex flex-col gap-6 ${isMobile ? "p-5" : ""}`}>
      {/* Sidebar Header with Reset */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-primary" />
          <h3 className="font-bold text-gray-900 text-base">Filter Products</h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset All</span>
          </button>
        )}

        {isMobile && onCloseMobile && (
          <button
            onClick={onCloseMobile}
            aria-label="Close filters"
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer ml-2"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* 1. Live Keyword Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search within shop..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-gray-100 rounded-xl outline-none focus:bg-white transition-all placeholder:text-gray-400"
        />
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        {filters.search && (
          <button
            onClick={() => onFilterChange({ search: "" })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* 2. Filter By Price */}
      <div className="space-y-3 pb-4">
        <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
          Filter By Price
        </h4>

        {/* Dual Input fields */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-0.5">
              Min (৳)
            </label>
            <input
              type="number"
              min={PRICE_LIMITS.min}
              max={PRICE_LIMITS.max}
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs font-semibold bg-gray-100 rounded-lg outline-none"
            />
          </div>
          <span className="text-gray-300 mt-4">-</span>
          <div className="flex-1">
            <label className="text-[10px] text-gray-400 uppercase font-semibold block mb-0.5">
              Max (৳)
            </label>
            <input
              type="number"
              min={PRICE_LIMITS.min}
              max={PRICE_LIMITS.max}
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 text-xs font-semibold bg-gray-100 rounded-lg outline-none"
            />
          </div>
        </div>

        {/* Range Slider Track */}
        <div className="pt-2">
          <input
            type="range"
            min={PRICE_LIMITS.min}
            max={PRICE_LIMITS.max}
            step={PRICE_LIMITS.step}
            value={localMaxPrice}
            onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-gray-400 mt-1">
            <span>৳{PRICE_LIMITS.min}</span>
            <span className="font-semibold text-gray-700">৳{localMaxPrice}</span>
            <span>৳{PRICE_LIMITS.max}</span>
          </div>
        </div>

        <button
          onClick={handlePriceApply}
          className="w-full py-1.5 bg-gray-100 hover:bg-primary hover:text-white text-gray-700 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer shadow-xs"
        >
          Apply Price Filter
        </button>
      </div>

      {/* 3. Filter By Categories (Accordion) */}
      <div className="space-y-3 pb-4">
        <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
          Categories
        </h4>

        <div className="space-y-1">
          {categories.map((cat) => {
            const isSelected = filters.category === cat.slug;
            const isExpanded = !!expandedCategories[cat.id];

            return (
              <div key={cat.id} className="text-xs">
                <div
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`flex items-center justify-between py-1.5 px-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-primary-light text-primary font-bold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="flex-1 truncate">{cat.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-400 font-medium">
                      ({cat.count})
                    </span>
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <button
                        onClick={(e) => toggleCategoryExpand(cat.id, e)}
                        className="p-1 text-gray-400 hover:text-primary transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronRight size={14} />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Subcategories */}
                {isExpanded && cat.subcategories && (
                  <div className="pl-3 pr-1 py-1 space-y-1 bg-primary-light/40 rounded-xl ml-2 mt-0.5">
                    {cat.subcategories.map((sub) => {
                      const isSubSelected = filters.subcategory === sub.slug;
                      return (
                        <div
                          key={sub.id}
                          onClick={() => handleSubcategorySelect(sub.slug, cat.slug)}
                          className={`flex items-center justify-between py-1 px-2 rounded-md cursor-pointer text-[11px] transition-colors ${
                            isSubSelected
                              ? "bg-primary text-white font-bold"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`}
                        >
                          <span className="truncate">{sub.name}</span>
                          <span
                            className={
                              isSubSelected ? "text-indigo-100" : "text-gray-400"
                            }
                          >
                            {sub.count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Filter By Brand (Searchable Checkboxes) */}
      <div className="space-y-3 pb-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
            Brands
          </h4>
          {filters.selectedBrands.length > 0 && (
            <button
              onClick={() => onFilterChange({ selectedBrands: [] })}
              className="text-[11px] text-primary hover:underline cursor-pointer"
            >
              Clear ({filters.selectedBrands.length})
            </button>
          )}
        </div>

        {/* Brand search filter */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search brands..."
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-gray-100 rounded-lg outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Brand list */}
        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs">
          {filteredBrands.map((brand) => {
            const isChecked = filters.selectedBrands.includes(brand.name);
            return (
              <label
                key={brand.id}
                className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-gray-50 cursor-pointer select-none group"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                      isChecked
                        ? "bg-primary text-white"
                        : "bg-gray-200 group-hover:bg-gray-300"
                    }`}
                  >
                    {isChecked && <Check size={11} strokeWidth={3} />}
                  </div>
                  <span
                    className={`text-xs ${
                      isChecked
                        ? "font-bold text-gray-900"
                        : "text-gray-700 group-hover:text-gray-900"
                    }`}
                  >
                    {brand.name}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 font-medium">
                  ({brand.count})
                </span>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={isChecked}
                  onChange={() => handleBrandToggle(brand.name)}
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Availability & Offers */}
      <div className="space-y-2 pb-4 text-xs">
        <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">
          Availability
        </h4>

        <label className="flex items-center gap-2 py-1 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
            className="w-4 h-4 accent-primary rounded"
          />
          <span className="text-gray-700 font-medium">In Stock Only</span>
        </label>

        <label className="flex items-center gap-2 py-1 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.onSaleOnly}
            onChange={(e) => onFilterChange({ onSaleOnly: e.target.checked })}
            className="w-4 h-4 accent-primary rounded"
          />
          <span className="text-gray-700 font-medium">On Sale / Discounted</span>
        </label>
      </div>

      {/* 6. Skin Concerns */}
      <div className="space-y-2 pb-4">
        <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">
          Skin Concern
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {SKIN_CONCERNS.map((concern) => {
            const isSelected =
              filters.skinConcern === concern ||
              (concern === "All Concerns" && filters.skinConcern === "");

            return (
              <button
                key={concern}
                onClick={() =>
                  onFilterChange({
                    skinConcern: concern === "All Concerns" ? "" : concern,
                  })
                }
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white shadow-xs font-semibold"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {concern}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Rating Filter */}
      <div className="space-y-2 text-xs">
        <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">
          Rating
        </h4>
        {[5, 4.5, 4].map((starVal) => {
          const isSelected = filters.rating === starVal;
          return (
            <div
              key={starVal}
              onClick={() =>
                onFilterChange({ rating: isSelected ? null : starVal })
              }
              className={`flex items-center justify-between py-1 px-2 rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? "bg-primary-light text-primary font-bold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-400">
                  <Star size={13} className="fill-amber-400" />
                </div>
                <span>{starVal.toFixed(1)} & above</span>
              </div>
              {isSelected && <Check size={14} className="text-primary" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopFilterSidebar;
