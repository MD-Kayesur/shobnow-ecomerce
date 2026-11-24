import React from "react";
import { Link } from "react-router-dom";
import blueStockup from "@/assets/banners/promo-blue-stockup.jpg";
import redHotdeal from "@/assets/banners/promo-red-hotdeal.jpg";

export const DualBottomBanners: React.FC = () => {
  return (
    <section className="w-full bg-[#FAF8F7] py-6 sm:py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-7">
          {/* Banner 1: Blue Stock Up */}
          <Link
            to="/shop"
            className="group block relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-500 aspect-[16/9]"
          >
            <img
              src={blueStockup}
              alt="Stock Up On Your Favourites"
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
              loading="lazy"
            />
          </Link>

          {/* Banner 2: Red Hot Deal */}
          <Link
            to="/shop?discount=40"
            className="group block relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-500 aspect-[16/9]"
          >
            <img
              src={redHotdeal}
              alt="Mega Deal Big Savings 40% Off"
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
              loading="lazy"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DualBottomBanners;
