import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/data/shopData";
import FigmaShopProductCard from "@/components/Shop/FigmaShopProductCard";
import {
  useGetStoreProductsQuery,
  mapStoreProductToUi,
} from "@/redux/features/storefront/storefrontApi";

export interface TopSellingSectionProps {
  onQuickView?: (product: Product) => void;
  wishlist?: Record<string, boolean>;
  onToggleWishlist?: (product: Product) => void;
}

export const TopSellingSection: React.FC<TopSellingSectionProps> = ({
  onQuickView,
  wishlist = {},
  onToggleWishlist,
}) => {
  const { data, isLoading } = useGetStoreProductsQuery({
    page: 1,
    limit: 10,
    sort: "popular",
  });

  const liveProducts = data?.data?.map(mapStoreProductToUi) || [];
  const topSelling = liveProducts.slice(0, 10);

  if (!isLoading && topSelling.length === 0) {
    return (
      <section className="w-full bg-[#FFF9FB] dark:bg-[#090D14] py-12 sm:py-16 transition-colors duration-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 text-center">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-[42px] font-faustina font-bold text-black dark:text-white tracking-tight leading-tight">
              Top Selling
            </h2>
          </div>
          <div className="py-16 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30">
            <p className="text-gray-400 dark:text-gray-500 font-inter text-sm font-medium">
              No top selling products available
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#FFF9FB] dark:bg-[#090D14] py-12 sm:py-16 transition-colors duration-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        {/* Section Heading */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-[42px] font-faustina font-bold text-black dark:text-white tracking-tight leading-tight">
            Top Selling
          </h2>
        </div>

        {/* 5-Column x 2-Row Grid using the verified Shop card theme */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-10 sm:mb-12">
          {topSelling.map((product) => (
            <FigmaShopProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              isWishlisted={!!wishlist[product.id]}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>

        {/* See all Button */}
        <div className="text-center">
          <Link
            to="/shop?sort=popular"
            className="inline-flex items-center justify-center h-10 px-6 sm:px-8 rounded-[8px] bg-[#FFE2FF] hover:bg-[#ffd1ff] text-[#500624] font-inter font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer shadow-2xs"
          >
            See all
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopSellingSection;
