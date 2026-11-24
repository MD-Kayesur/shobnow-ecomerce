import React from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, List, SlidersHorizontal, ChevronRight } from "lucide-react";
import { SORT_OPTIONS, SortOption } from "@/data/shopData";

export interface ShopHeaderProps {
  totalResults: number;
  filteredCount: number;
  activeCategoryName?: string;
  activeSubcategoryName?: string;
  sortBy: string;
  onSortChange: (newSort: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  itemsPerPage: number;
  onItemsPerPageChange: (num: number) => void;
  onOpenMobileFilters: () => void;
  activeFiltersCount: number;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  totalResults,
  filteredCount,
  activeCategoryName,
  activeSubcategoryName,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  itemsPerPage,
  onItemsPerPageChange,
  onOpenMobileFilters,
  activeFiltersCount,
}) => {
  return (
    <div className="w-full mb-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight size={13} className="text-gray-300" />
        <Link
          to="/shop"
          className={`${
            !activeCategoryName ? "text-gray-800 font-semibold" : "hover:text-primary"
          }`}
        >
          Shop
        </Link>
        {activeCategoryName && (
          <>
            <ChevronRight size={13} className="text-gray-300" />
            <span
              className={`${
                !activeSubcategoryName
                  ? "text-gray-800 font-semibold"
                  : "hover:text-primary"
              }`}
            >
              {activeCategoryName}
            </span>
          </>
        )}
        {activeSubcategoryName && (
          <>
            <ChevronRight size={13} className="text-gray-300" />
            <span className="text-gray-800 font-semibold">{activeSubcategoryName}</span>
          </>
        )}
      </nav>

      {/* Main Bar: Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
            {activeSubcategoryName || activeCategoryName || "Shop All Products"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Showing <span className="font-bold text-gray-800">{filteredCount}</span> of{" "}
            <span>{totalResults}</span> items found
          </p>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={onOpenMobileFilters}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all cursor-pointer relative"
          >
            <SlidersHorizontal size={15} className="text-primary" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-500 hidden sm:inline font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-gray-100 text-gray-800 font-semibold rounded-xl px-3 py-2 text-xs outline-none cursor-pointer shadow-2xs"
            >
              {SORT_OPTIONS.map((opt: SortOption) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Per Page Dropdown */}
          <div className="flex items-center gap-1 text-xs hidden md:flex">
            <span className="text-gray-500 font-medium">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="bg-gray-100 text-gray-800 font-semibold rounded-xl px-2.5 py-2 text-xs outline-none cursor-pointer shadow-2xs"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={36}>36</option>
            </select>
          </div>

          {/* View Mode Toggle (Grid vs List) */}
          <div className="flex items-center bg-gray-100 rounded-xl p-0.5">
            <button
              onClick={() => onViewModeChange("grid")}
              aria-label="Grid view"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-primary shadow-xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              aria-label="List view"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-primary shadow-xs"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
