import React from "react";
import { Link } from "react-router-dom";
import pinkBanner from "@/assets/banners/promo-pink-skincare.jpg";
import yellowBanner from "@/assets/banners/promo-yellow-prime.jpg";

export const DualPromoBanners: React.FC = () => {
  return (
    <section className="w-full bg-[#FFF9FB] dark:bg-[#090D14] pt-4 pb-14 sm:pb-20 transition-colors duration-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Banner 1: Pink Skincare (Exact aspect ratio matching 1376x768) */}
          <Link
            to="/shop?category=skin-care"
            className="group block relative w-full aspect-[1376/768] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 bg-pink-100 dark:bg-gray-800"
          >
            <img
              src={pinkBanner}
              alt="Global Korean Skincare Sale 50% Off"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 block"
              loading="lazy"
            />
          </Link>

          {/* Banner 2: Yellow Prime Time (Exact aspect ratio matching 1376x768) */}
          <Link
            to="/shop?category=skin-care"
            className="group block relative w-full aspect-[1376/768] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 bg-amber-100 dark:bg-gray-800"
          >
            <img
              src={yellowBanner}
              alt="Summer Radiance Prime Time 30% Off"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 block"
              loading="lazy"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DualPromoBanners;
