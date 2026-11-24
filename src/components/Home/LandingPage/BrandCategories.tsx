import React from "react";
import { Link } from "react-router-dom";
import {
  FIGMA_CATEGORIES_ROW_1,
  FIGMA_CATEGORIES_ROW_2,
  ALL_FIGMA_CATEGORIES,
  FigmaCategoryItem as CategoryItem,
} from "@/data/shopData";

export { FIGMA_CATEGORIES_ROW_1, FIGMA_CATEGORIES_ROW_2, ALL_FIGMA_CATEGORIES };
export type { CategoryItem };

// Backwards compatibility types & exports
export interface CategoryCardProps {
  id?: number | string;
  title: string;
  image: string;
  bgColor?: string;
  link?: string;
  subtitle?: string;
  itemCount?: string | number;
  badge?: string;
  className?: string;
  onClick?: () => void;
}
export type BrandCategoryCardProps = CategoryCardProps;

export interface CategorySectionHeaderProps {
  badgeText?: string;
  title?: string;
  description?: string;
  viewAllLink?: string;
  viewAllText?: string;
}

export interface BrandCategoriesProps {
  categories?: CategoryItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export const brandCategoriesData = ALL_FIGMA_CATEGORIES;

export const CategorySectionHeader: React.FC<CategorySectionHeaderProps> = ({
  title = "Jewellery & Accessories",
}) => {
  const displayTitle = title.replace(/&amp;/g, "&");
  return (
    <div className="text-center mb-8 sm:mb-12">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-faustina font-bold text-black dark:text-white tracking-tight leading-tight sm:leading-[50.40px]">
        {displayTitle}
      </h2>
    </div>
  );
};

// Exact Figma Capsule Card (w-52 h-80 rounded-[300px]) with direct product cutout over colored capsule pill
export interface FigmaCategoryCapsuleProps extends Partial<CategoryCardProps> {
  item?: CategoryItem;
}

export const FigmaCategoryCapsule: React.FC<FigmaCategoryCapsuleProps> = ({
  item,
  title,
  image,
  bgColor,
  link,
  className = "",
  onClick,
}) => {
  const finalTitle = item?.title ?? title ?? "";
  const finalImage = item?.image ?? image ?? "";
  const finalBgColor = item?.bgColor ?? bgColor ?? "#DCFCE7";
  const finalLink = item?.link ?? link ?? "#";

  return (
    <Link
      to={finalLink}
      onClick={onClick}
      className={`w-full max-w-[208px] flex flex-col justify-start items-center gap-2 group cursor-pointer select-none transition-transform duration-300 hover:-translate-y-1.5 ${className}`}
    >
      {/* Stadium Capsule Pill background (Figma ratio: 208px width x 320px height = 13:20) */}
      <div
        style={{ backgroundColor: finalBgColor }}
        className="w-full aspect-[13/20] max-h-[320px] rounded-full relative flex items-center justify-center transition-all duration-300 group-hover:shadow-md border border-black/5 dark:border-white/10 overflow-hidden"
      >
        {/* Transparent Category Image directly over pill - fluidly proportional */}
        <img
          src={finalImage}
          alt={finalTitle}
          className="w-[84%] h-[72%] object-contain transition-transform duration-500 group-hover:scale-108 pointer-events-none select-none drop-shadow-xs"
          loading="lazy"
        />
      </div>

      {/* Category Name below pill */}
      <div className="w-full text-center text-black dark:text-gray-100 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold font-faustina font-['Faustina'] leading-tight sm:leading-6 group-hover:text-[#A20E4C] dark:group-hover:text-[#FF4D82] transition-colors line-clamp-1 mt-1 px-1">
        {finalTitle}
      </div>
    </Link>
  );
};

export const CategoryCard = FigmaCategoryCapsule;
export const BrandCategoryCard = FigmaCategoryCapsule;

export default function BrandCategories({
  title = "Jewellery & Accessories",
  className = "",
}: BrandCategoriesProps) {
  const displayTitle = title.replace(/&amp;/g, "&");

  return (
    <section className={`w-full bg-[#FDFDFD] dark:bg-[#090D14] py-10 sm:py-14 md:py-18 transition-colors duration-200 ${className}`}>
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-faustina font-['Faustina'] font-bold text-black dark:text-white tracking-tight leading-tight sm:leading-[50.40px]">
            {displayTitle}
          </h2>
        </div>

        {/* Row 1: 6 Columns on Laptops (lg:grid-cols-6), 3 on tablets (sm:grid-cols-3), 2 on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 mb-6 sm:mb-8 justify-items-center">
          {FIGMA_CATEGORIES_ROW_1.map((item) => (
            <FigmaCategoryCapsule key={item.id} item={item} />
          ))}
        </div>

        {/* Row 2: 6 Columns on Laptops (lg:grid-cols-6), 3 on tablets (sm:grid-cols-3), 2 on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 justify-items-center">
          {FIGMA_CATEGORIES_ROW_2.map((item) => (
            <FigmaCategoryCapsule key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
