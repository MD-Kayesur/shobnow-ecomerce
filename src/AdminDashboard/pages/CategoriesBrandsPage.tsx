// src/pages/Admin/CategoriesBrandsPage.tsx
import { useState } from "react";
import { Layers, Award, Plus, CheckCircle2 } from "lucide-react";
import { SHOP_CATEGORIES, TOP_BRANDS_GRID } from "@/data/data";

const CategoriesBrandsPage = () => {
  const [activeTab, setActiveTab] = useState<"categories" | "brands">("categories");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-primary" />
            Categories & Brand Partners
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Organize catalog taxonomies, subcategories, and authentic brand partnerships.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === "categories"
                ? "bg-primary text-white shadow-xs"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories ({SHOP_CATEGORIES.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("brands")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === "brands"
                ? "bg-primary text-white shadow-xs"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Brands ({TOP_BRANDS_GRID.length})</span>
          </button>
        </div>
      </div>

      {/* Categories View */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              All 12 Store Categories
            </h2>
            <button
              onClick={() => alert("Add Category dialog")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SHOP_CATEGORIES.map((category) => (
              <div
                key={category.id}
                className="p-5 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold text-sm border border-primary/20 shrink-0">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-base">
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-400">Slug: /{category.slug}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-primary-light text-primary">
                    {category.count} items
                  </span>
                </div>

                {/* Subcategories list */}
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800/80">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Subcategories ({category.subcategories.length}):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {category.subcategories.map((sub) => (
                        <span
                          key={sub.id}
                          className="px-2 py-0.5 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                          {sub.name} ({sub.count})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brands View */}
      {activeTab === "brands" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Official & Authentic Brand Partners
            </h2>
            <button
              onClick={() => alert("Add Brand partnership")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Brand</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {TOP_BRANDS_GRID.map((brand) => (
              <div
                key={brand.id}
                className="p-4 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col items-center text-center space-y-2 group"
              >
                <div className="w-16 h-16 rounded-xl bg-gray-50 dark:bg-gray-800/60 p-2 flex items-center justify-center border border-gray-100 dark:border-gray-700 transition-transform group-hover:scale-105">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="w-full">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {brand.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Authentic Partner • South Korea
                  </p>
                </div>

                <div className="w-full pt-2 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                  <span className="text-gray-400">100% Genuine</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesBrandsPage;

