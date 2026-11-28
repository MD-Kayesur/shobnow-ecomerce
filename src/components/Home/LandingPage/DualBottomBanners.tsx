import React from "react";
import { Link } from "react-router-dom";
import { useGetFooterBannersQuery } from "@/redux/features/banner/bannerApi";
import { getImageUrl } from "@/utils/imageUrl";

export const DualBottomBanners: React.FC = () => {
  const { data: footerRes, isLoading } = useGetFooterBannersQuery();
  const footerBanners = footerRes?.data || [];

  if (!isLoading && footerBanners.length === 0) {
    return (
      <section className="w-full bg-[#FAF8F7] dark:bg-[#090D14] py-8 text-center transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30">
            <p className="text-gray-400 dark:text-gray-500 font-inter text-sm font-medium">
              No promotional footer banners available
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#FAF8F7] dark:bg-[#090D14] py-6 sm:py-8 md:py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-7">
          {footerBanners.map((banner) => (
            <Link
              key={banner.id}
              to={banner.targetUrl || "/shop"}
              className="group block relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-500 aspect-[16/9]"
            >
              {banner.image ? (
                <img
                  src={getImageUrl(banner.image)}
                  alt={banner.title || "Footer Banner"}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full border border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 text-sm">
                  No image available
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DualBottomBanners;
