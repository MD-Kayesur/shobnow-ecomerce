import React from "react";
import { Link } from "react-router-dom";
import { MOCK_PRODUCTS, Product } from "@/data/shopData";
import { FigmaProductCard } from "./NewArrivalsSection";

export const TopSellingSection: React.FC<{
  onQuickView?: (product: Product) => void;
}> = ({ onQuickView }) => {
  const topSelling = MOCK_PRODUCTS.slice(5, 15);

  return (
    <section className="w-full bg-[#FFF9FB] dark:bg-[#090D14] py-12 sm:py-16 transition-colors duration-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        {/* Section Heading */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-[42px] font-faustina font-bold text-black dark:text-white tracking-tight leading-tight">
            Top Selling
          </h2>
        </div>

        {/* 5-Column x 2-Row Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-10 sm:mb-12">
          {topSelling.map((product) => (
            <FigmaProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* See all Button */}
        <div className="text-center">
          <Link
            to="/top-selling"
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
