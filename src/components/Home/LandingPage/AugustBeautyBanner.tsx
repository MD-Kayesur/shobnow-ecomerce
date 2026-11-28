import React from "react";
import { Link } from "react-router-dom";
import { useGetMiddleBannerQuery } from "@/redux/features/banner/bannerApi";
import { getImageUrl } from "@/utils/imageUrl";

export const AugustBeautyBanner: React.FC = () => {
  const { data: middleRes, isLoading } = useGetMiddleBannerQuery();
  const middleBanner = middleRes?.data;

  if (!isLoading && (!middleBanner || !middleBanner.image)) {
    return (
      <section className="w-full bg-[#FFF9FB] dark:bg-[#090D14] py-8 transition-colors duration-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="py-14 border border-dashed border-pink-200 dark:border-gray-800 rounded-2xl bg-pink-50/30 dark:bg-gray-900/30">
            <p className="text-gray-400 dark:text-gray-500 font-inter text-sm font-medium">
              No middle banner available
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#FFF9FB] dark:bg-[#090D14] pt-10 sm:pt-16 pb-6 transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to={middleBanner?.targetUrl || "/shop"}
          className="group block relative w-full aspect-[1376/768] min-h-[280px] sm:min-h-[440px] md:min-h-[580px] lg:min-h-[700px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-[#E8DDD5] dark:bg-gray-800"
        >
          {middleBanner?.image && (
            <img
              src={getImageUrl(middleBanner.image)}
              alt={middleBanner.title || "Promotional Banner"}
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 block"
              loading="lazy"
            />
          )}
        </Link>
      </div>
    </section>
  );
};

export default AugustBeautyBanner;
