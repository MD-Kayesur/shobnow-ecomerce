import React from "react";
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useGetStoreFilterOptionsQuery } from "@/redux/features/storefront/storefrontApi";
import { getImageUrl } from "@/utils/imageUrl";

export const BrandMarquee: React.FC = () => {
  const { data, isLoading } = useGetStoreFilterOptionsQuery();
  const apiBrands = data?.data?.brands || [];

  if (!isLoading && apiBrands.length === 0) {
    return (
      <section className="relative w-full bg-[#FFF9FB] dark:bg-[#090D14] py-8 text-center select-none border-y border-[#F8E8EF] dark:border-gray-800/80">
        <p className="text-gray-400 dark:text-gray-500 font-inter text-sm font-medium">
          No brands available
        </p>
      </section>
    );
  }

  return (
    <section className="relative w-full bg-[#FFF9FB] dark:bg-[#090D14] py-6 sm:py-8 md:py-9 overflow-hidden select-none transition-colors duration-200 border-y border-[#F8E8EF] dark:border-gray-800/80">
      {/* Subtle Soft Edge Left Fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 md:w-28 z-20 bg-gradient-to-r from-[#FFF9FB] via-[#FFF9FB]/70 to-transparent dark:from-[#090D14] dark:via-[#090D14]/70 dark:to-transparent" />

      {/* Subtle Soft Edge Right Fade */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 md:w-28 z-20 bg-gradient-to-l from-[#FFF9FB] via-[#FFF9FB]/70 to-transparent dark:from-[#090D14] dark:via-[#090D14]/70 dark:to-transparent" />

      {/* 100% Full Width Edge-to-Edge Container with Larger Brand Cards */}
      <div className="w-full relative py-1">
        <Marquee speed={36} pauseOnHover={true} gradient={false} autoFill={apiBrands.length >= 4}>
          {apiBrands.map((brand) => (
            <Link
              key={brand.id}
              to={`/brands?brand=${brand.slug}`}
              title={`View ${brand.name} Collection`}
              onClick={() => {
                toast.info(`Exploring ${brand.name}`, {
                  description: `Browsing official authentic products from ${brand.name}.`,
                });
              }}
              className="w-[145px] sm:w-[175px] md:w-[200px] lg:w-[220px] h-[66px] sm:h-[76px] md:h-[84px] px-4 sm:px-6 py-2.5 sm:py-3.5 mx-2.5 sm:mx-3.5 md:mx-4 bg-white dark:bg-[#111726] rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-xs hover:shadow-xl hover:border-[#A20E4C] dark:hover:border-[#E91E63] hover:-translate-y-1 active:scale-95 border border-gray-200/90 dark:border-gray-800 transition-all duration-300 cursor-pointer group"
            >
              {brand.logo ? (
                <img
                  src={getImageUrl(brand.logo)}
                  alt={brand.name}
                  className="max-h-full max-w-[85%] object-contain opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 filter drop-shadow-2xs"
                  loading="lazy"
                />
              ) : (
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {brand.name}
                </span>
              )}
            </Link>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default BrandMarquee;
