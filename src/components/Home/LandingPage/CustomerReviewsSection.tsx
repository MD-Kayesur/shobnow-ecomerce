import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetFooterBannersQuery } from "@/redux/features/banner/bannerApi";
import { getImageUrl } from "@/utils/imageUrl";

export const CustomerReviewsSection: React.FC = () => {
  const { data: footerRes, isLoading: isFooterLoading } = useGetFooterBannersQuery();
  const footerBanners = footerRes?.data || [];

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -345 : 345;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-white dark:bg-[#090D14] py-14 sm:py-20 overflow-hidden transition-colors duration-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        {/* Section Header with Left/Right Controls */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div className="w-12 sm:w-20" /> {/* Spacer to balance header */}
          <h2 className="text-3xl sm:text-[42px] font-faustina font-bold text-black dark:text-white tracking-tight leading-tight text-center">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-full bg-[#C9005B] hover:bg-[#A8004C] text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer active:scale-90"
              title="Previous Reviews"
              aria-label="Previous Reviews"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full bg-[#C9005B] hover:bg-[#A8004C] text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer active:scale-90"
              title="Next Reviews"
              aria-label="Next Reviews"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Customer Reviews Container */}
        <div className="py-16 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30">
          <p className="text-gray-400 dark:text-gray-500 font-inter text-sm font-medium">
            No customer reviews available yet
          </p>
        </div>

        {/* Dual Bottom Banners (from Backend Footer Banner API) */}
        {footerBanners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-14 sm:mt-16">
            {footerBanners.map((banner) => (
              <Link
                key={banner.id}
                to={banner.targetUrl || "/shop"}
                className="group block relative w-full h-[180px] sm:h-[234px] rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500"
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
                    No banner available
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : !isFooterLoading ? (
          <div className="mt-14 py-12 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-900/30">
            <p className="text-gray-400 dark:text-gray-500 font-inter text-sm font-medium">
              No promotional footer banners available
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default CustomerReviewsSection;
