import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useGetStoreProductsQuery } from "@/redux/features/storefront/storefrontApi";
import { getImageUrl } from "@/utils/imageUrl";

export const FeaturedProductsCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data, isLoading } = useGetStoreProductsQuery({ limit: 8, onSale: true });

  const liveItems =
    data?.data?.map((sp) => ({
      id: sp.id,
      title: sp.name,
      price: `৳${Number(sp.salePrice || sp.price).toLocaleString()}`,
      image: getImageUrl(sp.media?.[0]?.imageUrl),
      thumb: getImageUrl(sp.media?.[0]?.thumbnailUrl || sp.media?.[0]?.imageUrl),
      link: `/product/${sp.slug}`,
    })) || [];

  const total = liveItems.length;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  };

  // Cyclic offset distance between any item and current active index
  const getCyclicOffset = (index: number, active: number, len: number) => {
    let diff = (index - active) % len;
    if (diff > len / 2) diff -= len;
    if (diff < -len / 2) diff += len;
    return diff;
  };

  if (!isLoading && liveItems.length === 0) {
    return (
      <section className="w-full bg-[#F6E7ED] dark:bg-[#0E131F] py-16 sm:py-20 overflow-hidden select-none transition-colors duration-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 text-center">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-[42px] font-faustina font-bold text-black dark:text-white tracking-tight leading-tight">
              Featured Products
            </h2>
          </div>
          <div className="py-16 border border-dashed border-pink-300 dark:border-gray-800 rounded-2xl max-w-xl mx-auto bg-pink-50/50 dark:bg-gray-900/30">
            <p className="text-gray-500 dark:text-gray-400 font-inter text-base font-medium">
              No featured products available
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#F6E7ED] dark:bg-[#0E131F] py-16 sm:py-20 overflow-hidden select-none transition-colors duration-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        {/* Section Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-[42px] font-faustina font-bold text-black dark:text-white tracking-tight leading-tight">
            Featured Products
          </h2>
        </div>

        {/* 3D Perspective Card Stack Container */}
        <div className="relative flex items-center justify-center min-h-[480px] sm:min-h-[560px]">
          {/* Left Navigation Arrow */}
          {total > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-1 sm:left-4 md:left-8 z-40 w-11 h-11 rounded-full bg-[#C9005B] text-white flex items-center justify-center shadow-lg hover:bg-[#A8004C] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
              aria-label="Previous Featured Product"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Cards Deck Container */}
          <div className="relative w-full max-w-[1200px] h-[450px] sm:h-[530px] flex items-center justify-center">
            {liveItems.map((item, index) => {
              const diff = getCyclicOffset(index, activeIndex, total);

              // 5-Card visible perspective fan states
              let stateClasses = "scale-50 opacity-0 pointer-events-none z-0";
              let cardDimensions = "w-[260px] sm:w-[325px] h-[420px] sm:h-[520px]";

              if (diff === 0) {
                // Center Card: Front, prominent, full scale and shadow
                stateClasses =
                  "translate-x-0 scale-100 z-30 opacity-100 shadow-[0px_20px_60px_rgba(0,0,0,0.38)] cursor-default";
                cardDimensions = "w-[270px] xs:w-[290px] sm:w-[335px] h-[430px] sm:h-[530px]";
              } else if (diff === -1) {
                // Immediate Left: peek left, slightly scaled down, high opacity
                stateClasses =
                  "-translate-x-[55%] sm:-translate-x-[72%] md:-translate-x-[82%] scale-[0.88] sm:scale-[0.94] z-20 opacity-85 sm:opacity-95 shadow-xl hover:opacity-100 cursor-pointer";
                cardDimensions = "w-[245px] sm:w-[305px] h-[395px] sm:h-[490px]";
              } else if (diff === 1) {
                // Immediate Right: peek right, slightly scaled down, high opacity
                stateClasses =
                  "translate-x-[55%] sm:translate-x-[72%] md:translate-x-[82%] scale-[0.88] sm:scale-[0.94] z-20 opacity-85 sm:opacity-95 shadow-xl hover:opacity-100 cursor-pointer";
                cardDimensions = "w-[245px] sm:w-[305px] h-[395px] sm:h-[490px]";
              } else if (diff === -2) {
                // Far Left 2: fan further out on left
                stateClasses =
                  "-translate-x-[105%] sm:-translate-x-[140%] md:-translate-x-[160%] scale-[0.78] sm:scale-[0.86] z-10 opacity-55 sm:opacity-75 shadow-md hover:opacity-95 cursor-pointer hidden xs:flex";
                cardDimensions = "w-[225px] sm:w-[280px] h-[365px] sm:h-[450px]";
              } else if (diff === 2) {
                // Far Right 2: fan further out on right
                stateClasses =
                  "translate-x-[105%] sm:translate-x-[140%] md:translate-x-[160%] scale-[0.78] sm:scale-[0.86] z-10 opacity-55 sm:opacity-75 shadow-md hover:opacity-95 cursor-pointer hidden xs:flex";
                cardDimensions = "w-[225px] sm:w-[280px] h-[365px] sm:h-[450px]";
              }

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveIndex(index)}
                  className={`absolute ${cardDimensions} ${stateClasses} rounded-[24px] overflow-hidden p-3 sm:p-4 flex flex-col justify-between transition-all duration-500 ease-out bg-[#1E0F14]`}
                >
                  {/* Card Background Image */}
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                      loading="lazy"
                    />
                  )}

                  {/* Dark subtle overlay for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

                  {/* Center Floating Glass Circle Bag Button */}
                  <div className="relative z-10 self-center mt-auto mb-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/30 transition-transform duration-300 hover:scale-110">
                    <ShoppingBag size={22} className="text-white drop-shadow-sm" />
                  </div>

                  {/* Bottom Product Info Glass Pill */}
                  <div className="relative z-10 w-full bg-[#FFFDFD]/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-[14px] p-2.5 flex items-center gap-2.5 shadow-md border border-white/40 dark:border-gray-800">
                    {item.thumb && (
                      <img
                        src={item.thumb}
                        alt={item.title}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-[10px] object-cover shrink-0 shadow-xs"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm sm:text-base font-faustina font-semibold text-black dark:text-white truncate leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm font-faustina font-bold text-[#A20E4C] dark:text-[#FF4D82] mt-0.5">
                        {item.price}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Navigation Arrow */}
          {total > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-1 sm:left-auto sm:right-4 md:right-8 z-40 w-11 h-11 rounded-full bg-[#C9005B] text-white flex items-center justify-center shadow-lg hover:bg-[#A8004C] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
              aria-label="Next Featured Product"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>

        {/* See all Outline Button */}
        <div className="text-center mt-12 sm:mt-16">
          <Link
            to="/shop?filter=featured"
            className="inline-flex items-center justify-center h-10 px-6 py-2.5 rounded-[8px] border-[1.5px] border-[#A20E4C] dark:border-[#FF4D82] text-[#A20E4C] dark:text-[#FF4D82] hover:bg-[#A20E4C] dark:hover:bg-[#FF4D82] hover:text-white font-inter font-semibold text-base transition-all duration-200 shadow-2xs hover:shadow-md"
          >
            See all
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsCarousel;
