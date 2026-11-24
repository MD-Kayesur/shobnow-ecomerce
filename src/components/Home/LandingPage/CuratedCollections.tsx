import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import {
  MOCK_PRODUCTS,
  Product,
  CURATED_COLLECTION_TABS,
  CuratedTabType,
} from "@/data/shopData";
import ProductCard from "@/components/Reuseable/ProductCard";

interface CuratedCollectionsProps {
  onQuickView?: (product: Product) => void;
  wishlist?: Record<string, boolean>;
  onToggleWishlist?: (product: Product) => void;
}

export const CuratedCollections: React.FC<CuratedCollectionsProps> = ({
  onQuickView,
  wishlist = {},
  onToggleWishlist,
}) => {
  const [activeTab, setActiveTab] = useState<CuratedTabType>("all");

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    if (activeTab === "all") return true;
    if (activeTab === "skincare") {
      return (
        product.category.toLowerCase().includes("skin") ||
        product.category.toLowerCase().includes("face")
      );
    }
    if (activeTab === "makeup") {
      return (
        product.category.toLowerCase().includes("makeup") ||
        product.category.toLowerCase().includes("lip")
      );
    }
    if (activeTab === "haircare") {
      return product.category.toLowerCase().includes("hair");
    }
    if (activeTab === "new") {
      return product.isNewArrival || product.id.endsWith("1") || product.id.endsWith("3");
    }
    return true;
  }).slice(0, 8);

  return (
    <section className="w-full py-10 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-primary-light text-primary flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Hand-Picked Collections
              </span>
              <span className="text-xs font-semibold text-gray-500">
                100% Guaranteed Authentic
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              Curated For Your Skin & Style
            </h2>
            <p className="text-gray-500 text-sm mt-1 max-w-xl">
              Explore best-selling Korean skincare, vibrant makeup, and hair essentials loved by thousands of beauty enthusiasts across Bangladesh.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 hover:border-primary text-gray-700 hover:text-primary font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:shadow-sm shrink-0 self-start md:self-auto"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Tab Filters */}
        <div
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none no-scrollbar [&::-webkit-scrollbar]:hidden"
        >
          {CURATED_COLLECTION_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]"
                    : "bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] uppercase font-black ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode="grid"
              onQuickView={onQuickView}
              isWishlisted={!!wishlist[product.id]}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>

        {/* Bottom Banner CTA */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary-light via-[#F4F3FF] to-amber-50 border border-primary-border/60 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
              Looking for something tailored to your skin concern?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Filter by Acne, Hyperpigmentation, Dryness, Sensitive Skin, and more with our intelligent beauty finder.
            </p>
          </div>
          <Link
            to="/shop?category=skin-care"
            className="px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors shrink-0 shadow-md hover:shadow-primary/30"
          >
            Find My Routine
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CuratedCollections;
