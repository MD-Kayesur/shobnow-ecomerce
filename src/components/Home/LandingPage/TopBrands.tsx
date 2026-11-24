import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { TOP_BRANDS_GRID, TopBrandItem } from "@/data/data";

export interface TopBrandsProps {
  brands?: TopBrandItem[];
  title?: string;
  allBrandsLink?: string;
  allBrandsText?: string;
  className?: string;
}

export const TopBrands: React.FC<TopBrandsProps> = ({
  brands = TOP_BRANDS_GRID,
  title = "Top Brands",
  allBrandsLink = "/shop",
  allBrandsText = "All Brands",
  className = "",
}) => {
  return (
    <section className={`w-full bg-[#fdfbf9] py-8 sm:py-12 lg:py-14 ${className}`}>
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6 lg:mb-7">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-gray-900 tracking-tight">
            {title}
          </h2>

          <Link
            to={allBrandsLink}
            className="inline-flex items-center gap-1 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#e8f1fd] hover:bg-[#d8e6fd] text-[#2b72ee] hover:text-[#1c5fdb] text-xs sm:text-sm font-semibold transition-all duration-200 group shadow-2xs shrink-0"
          >
            <span>{allBrandsText}</span>
            <ChevronRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>

        {/* 20 Brand Responsive Grid: 2 columns on mobile (10 rows), 4 columns on tablet & desktop (5 rows) */}
        <div className="border border-gray-200/90 rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 bg-gray-200/80 gap-[1px]">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                to={brand.link}
                title={`Shop ${brand.name} products`}
                className="group bg-white h-16 sm:h-20 md:h-24 lg:h-28 flex items-center justify-center p-2 sm:p-3 md:p-5 hover:bg-gray-50/90 transition-colors duration-200"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-6 sm:max-h-8 md:max-h-10 lg:max-h-11 max-w-[70%] sm:max-w-[75%] object-contain select-none transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBrands;
