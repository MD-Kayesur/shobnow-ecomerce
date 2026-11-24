import React from "react";
import { X } from "lucide-react";
import { ShopFilterState, PRICE_LIMITS, CategoryItem } from "@/data/shopData";

export interface ActiveFiltersProps {
  filters: ShopFilterState;
  categories: CategoryItem[];
  onRemoveCategory: () => void;
  onRemoveSubcategory: () => void;
  onRemoveBrand: (brand: string) => void;
  onRemoveSearch: () => void;
  onResetPrice: () => void;
  onToggleInStock: () => void;
  onToggleOnSale: () => void;
  onRemoveRating: () => void;
  onRemoveConcern: () => void;
  onClearAll: () => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  categories,
  onRemoveCategory,
  onRemoveSubcategory,
  onRemoveBrand,
  onRemoveSearch,
  onResetPrice,
  onToggleInStock,
  onToggleOnSale,
  onRemoveRating,
  onRemoveConcern,
  onClearAll,
}) => {
  const activeCategory = categories.find((c) => c.slug === filters.category);
  const activeSubcategory = activeCategory?.subcategories.find(
    (s) => s.slug === filters.subcategory
  );

  const isPriceFiltered =
    filters.priceRange[0] !== PRICE_LIMITS.min ||
    filters.priceRange[1] !== PRICE_LIMITS.max;

  const hasAnyFilter =
    filters.category !== "" ||
    filters.subcategory !== "" ||
    filters.selectedBrands.length > 0 ||
    filters.search !== "" ||
    filters.inStockOnly ||
    filters.onSaleOnly ||
    filters.rating !== null ||
    (filters.skinConcern !== "" && filters.skinConcern !== "All Concerns") ||
    isPriceFiltered;

  if (!hasAnyFilter) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-primary-light/50 rounded-xl border border-indigo-100">
      <span className="text-xs font-bold text-gray-700 mr-1">Active Filters:</span>

      {/* Category Pill */}
      {filters.category && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-primary border border-indigo-200 shadow-2xs">
          <span>Category: {activeCategory?.name || filters.category}</span>
          <button
            onClick={onRemoveCategory}
            aria-label="Remove category filter"
            className="hover:text-black cursor-pointer"
          >
            <X size={13} />
          </button>
        </span>
      )}

      {/* Subcategory Pill */}
      {filters.subcategory && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-primary border border-indigo-200 shadow-2xs">
          <span>Subcategory: {activeSubcategory?.name || filters.subcategory}</span>
          <button
            onClick={onRemoveSubcategory}
            aria-label="Remove subcategory filter"
            className="hover:text-black cursor-pointer"
          >
            <X size={13} />
          </button>
        </span>
      )}

      {/* Brand Pills */}
      {filters.selectedBrands.map((b) => (
        <span
          key={b}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-gray-800 border border-gray-200 shadow-2xs"
        >
          <span>Brand: {b}</span>
          <button
            onClick={() => onRemoveBrand(b)}
            aria-label={`Remove brand ${b}`}
            className="hover:text-primary cursor-pointer"
          >
            <X size={13} />
          </button>
        </span>
      ))}

      {/* Search Pill */}
      {filters.search && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-gray-800 border border-gray-200 shadow-2xs">
          <span>Keyword: "{filters.search}"</span>
          <button
            onClick={onRemoveSearch}
            aria-label="Clear keyword search"
            className="hover:text-primary cursor-pointer"
          >
            <X size={13} />
          </button>
        </span>
      )}

      {/* Price Pill */}
      {isPriceFiltered && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-gray-800 border border-gray-200 shadow-2xs">
          <span>
            Price: ৳{filters.priceRange[0]} - ৳{filters.priceRange[1]}
          </span>
          <button
            onClick={onResetPrice}
            aria-label="Reset price filter"
            className="hover:text-primary cursor-pointer"
          >
            <X size={13} />
          </button>
        </span>
      )}

      {/* In Stock Pill */}
      {filters.inStockOnly && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-emerald-700 border border-emerald-200 shadow-2xs">
          <span>In Stock Only</span>
          <button
            onClick={onToggleInStock}
            aria-label="Remove in stock filter"
            className="hover:text-black cursor-pointer"
          >
            <X size={13} />
          </button>
        </span>
      )}

      {/* On Sale Pill */}
      {filters.onSaleOnly && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-primary border border-indigo-200 shadow-2xs">
          <span>On Sale</span>
          <button
            onClick={onToggleOnSale}
            aria-label="Remove on sale filter"
            className="hover:text-black cursor-pointer"
          >
            <X size={13} />
          </button>
        </span>
      )}

      {/* Skin Concern Pill */}
      {filters.skinConcern && filters.skinConcern !== "All Concerns" && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-purple-700 border border-purple-200 shadow-2xs">
          <span>Concern: {filters.skinConcern}</span>
          <button
            onClick={onRemoveConcern}
            aria-label="Remove concern filter"
            className="hover:text-black cursor-pointer"
          >
            <X size={13} />
          </button>
        </span>
      )}

      {/* Rating Pill */}
      {filters.rating !== null && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white text-amber-700 border border-amber-200 shadow-2xs">
          <span>★ {filters.rating.toFixed(1)}+</span>
          <button
            onClick={onRemoveRating}
            aria-label="Remove rating filter"
            className="hover:text-black cursor-pointer"
          >
            <X size={13} />
          </button>
        </span>
      )}

      {/* Clear All Button */}
      <button
        onClick={onClearAll}
        className="ml-auto text-xs font-bold text-primary hover:text-primary-hover underline underline-offset-2 cursor-pointer"
      >
        Clear All
      </button>
    </div>
  );
};

export default ActiveFilters;
