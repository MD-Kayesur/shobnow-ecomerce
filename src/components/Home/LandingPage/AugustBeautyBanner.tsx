import React from "react";
import { Link } from "react-router-dom";
import augustBannerImg from "@/assets/banners/banner-august-deals.jpg";

export const AugustBeautyBanner: React.FC = () => {
  return (
    <section className="w-full bg-[#FFF9FB] dark:bg-[#090D14] pt-10 sm:pt-16 pb-6 transition-colors duration-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/shop?category=skin-care"
          className="group block relative w-full aspect-[1376/768] min-h-[280px] sm:min-h-[440px] md:min-h-[580px] lg:min-h-[700px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-[#E8DDD5] dark:bg-gray-800"
        >
          {/* Full-Height Responsive Banner Graphic (Aspect ratio 1376:768 ensures 'AUGUST' and products are 100% visible) */}
          <img
            src={augustBannerImg}
            alt="August Beauty Deals - Discover the Glow"
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 block"
            loading="lazy"
          />
        </Link>
      </div>
    </section>
  );
};

export default AugustBeautyBanner;
