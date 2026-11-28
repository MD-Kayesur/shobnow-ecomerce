import React from "react";
import { Link } from "react-router-dom";
import { useGetLastMiddleBannersQuery } from "@/redux/features/banner/bannerApi";
import { getImageUrl } from "@/utils/imageUrl";

export const DualPromoBanners: React.FC = () => {
  const { data: res, isLoading } = useGetLastMiddleBannersQuery();
  const banners = res?.data || [];

  if (!isLoading && banners.length === 0) {
    return (
      <section className="w-full bg-[#FFF9FB] dark:bg-[#090D14] py-8 transition-colors duration-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 text-center">
          <div className="py-14 border border-dashed border-pink-200 dark:border-gray-800 rounded-2xl bg-pink-50/30 dark:bg-gray-900/30">
            <p className="text-gray-400 dark:text-gray-500 font-inter text-sm font-medium">
              No promotional banners available
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#FFF9FB] dark:bg-[#090D14] pt-4 pb-14 sm:pb-20 transition-colors duration-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {banners.map((banner) => (
            <Link
              key={banner.id}
              to={banner.targetUrl || "/shop"}
              className="group block relative w-full aspect-[1376/768] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 bg-pink-100/50 dark:bg-gray-800"
            >
              {banner.image ? (
                <img
                  src={getImageUrl(banner.image)}
                  alt={banner.title || "Promotional Banner"}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 block"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No banner available
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DualPromoBanners;
