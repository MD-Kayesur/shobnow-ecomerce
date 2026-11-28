import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetHomepageBannersQuery } from "@/redux/features/banner/bannerApi";
import { getImageUrl } from "@/utils/imageUrl";

export const Hero: React.FC = () => {
  const [activeDot, setActiveDot] = useState(0);
  const { data: bannerRes, isLoading } = useGetHomepageBannersQuery();
  const banners = bannerRes?.data || [];

  const primaryBanners = banners.filter((b) => b.type === "PRIMARY");
  const secondaryBanners = banners.filter((b) => b.type === "SECONDARY");

  const currentPrimary = primaryBanners[activeDot] || primaryBanners[0];
  const secBanner1 = secondaryBanners.find((b) => b.position === 1) || secondaryBanners[0];
  const secBanner2 = secondaryBanners.find((b) => b.position === 2) || secondaryBanners[1];
  const secBanner3 = secondaryBanners.find((b) => b.position === 3) || secondaryBanners[2];
  const secBanner4 = secondaryBanners.find((b) => b.position === 4) || secondaryBanners[3];

  const totalPrimaryDots = primaryBanners.length;

  if (!isLoading && banners.length === 0) {
    return (
      <section className="w-full bg-[#FFF9FB] dark:bg-[#090D14] py-14 select-none transition-colors duration-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
          <div className="py-20 border border-dashed border-pink-200 dark:border-gray-800 rounded-3xl bg-pink-50/30 dark:bg-gray-900/30 text-center">
            <p className="text-gray-500 dark:text-gray-400 font-inter text-base font-medium">
              No homepage banners available
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#FFF9FB] dark:bg-[#090D14] pt-4 sm:pt-6 pb-2 select-none transition-colors duration-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        {/* TOP ROW: 2 Cards (Large Featured Primary Carousel + First Secondary Banner) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
          {/* 1. Large Primary Banner (~65% width) */}
          <div className="lg:col-span-8 group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-[380px] sm:h-[440px] lg:h-[480px] bg-[#1E0F14]">
            {currentPrimary?.image ? (
              <img
                src={getImageUrl(currentPrimary.image)}
                alt={currentPrimary.title || "Banner"}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
                No image available
              </div>
            )}

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex flex-col justify-between p-7 sm:p-10 lg:p-12 z-10">
              <div className="max-w-md pt-2 sm:pt-6">
                {currentPrimary?.title && (
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-[1.08] font-sans drop-shadow-sm whitespace-pre-line">
                    {currentPrimary.title}
                  </h1>
                )}
                {currentPrimary?.subtitle && (
                  <p className="text-white/90 text-xs sm:text-sm font-normal mt-3.5 leading-relaxed max-w-xs sm:max-w-sm drop-shadow-sm">
                    {currentPrimary.subtitle}
                  </p>
                )}
                {currentPrimary?.targetUrl && (
                  <div className="mt-5">
                    <Link
                      to={currentPrimary.targetUrl}
                      className="inline-flex items-center px-6 py-2.5 rounded-full bg-white text-gray-950 font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors shadow-md"
                    >
                      Shop Now
                    </Link>
                  </div>
                )}
              </div>

              {/* Slide Navigation Arrows and Pagination Dots */}
              {totalPrimaryDots > 1 && (
                <div className="flex items-center justify-between pb-1 pt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveDot((prev) => (prev > 0 ? prev - 1 : totalPrimaryDots - 1));
                    }}
                    className="w-8 h-8 rounded-full bg-[#C9005B] hover:bg-[#A8004C] text-white flex items-center justify-center shadow-md transition-all cursor-pointer active:scale-90"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPrimaryDots }).map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveDot(idx)}
                        className={`transition-all duration-300 rounded-full cursor-pointer ${
                          activeDot === idx
                            ? "w-7 h-2 bg-[#C9005B] shadow-xs"
                            : "w-2 h-2 bg-white/50 hover:bg-white/80"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveDot((prev) => (prev < totalPrimaryDots - 1 ? prev + 1 : 0));
                    }}
                    className="w-8 h-8 rounded-full bg-[#C9005B] hover:bg-[#A8004C] text-white flex items-center justify-center shadow-md transition-all cursor-pointer active:scale-90"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 2. First Secondary Banner (~35% width) */}
          <div className="lg:col-span-4 group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-[380px] sm:h-[440px] lg:h-[480px] bg-gradient-to-b from-[#13072B] via-[#1E093D] to-[#2E0B5B] flex flex-col justify-between p-6 sm:p-7 text-white">
            {secBanner1 ? (
              <Link to={secBanner1.targetUrl || "/shop"} className="block w-full h-full flex flex-col justify-between">
                {/* Top Text Content */}
                <div className="relative z-10 text-center flex flex-col items-center">
                  {secBanner1.title && (
                    <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/90">
                      {secBanner1.title}
                    </span>
                  )}
                  {secBanner1.subtitle && (
                    <div className="inline-block mt-2 px-3.5 py-0.5 rounded-full text-[11px] font-bold bg-[#381368] text-[#E0C6FF] border border-[#6B2BB8] shadow-sm">
                      {secBanner1.subtitle}
                    </div>
                  )}
                </div>

                {/* Bottom Visual Shot */}
                {secBanner1.image && (
                  <div className="relative z-10 w-full flex-1 min-h-[220px] rounded-2xl overflow-hidden mt-3">
                    <img
                      src={getImageUrl(secBanner1.image)}
                      alt={secBanner1.title || "Banner"}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
              </Link>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/40 text-sm">
                No secondary banner
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM ROW: 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {/* Bottom Card 1 */}
          <div className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-[210px] sm:h-[235px] bg-[#DCE6EF] dark:bg-gray-800">
            {secBanner2 ? (
              <Link to={secBanner2.targetUrl || "/shop"} className="block w-full h-full relative">
                {secBanner2.image && (
                  <img
                    src={getImageUrl(secBanner2.image)}
                    alt={secBanner2.title || "Banner"}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                )}
                <div className="absolute top-0 inset-x-0 p-4 text-center z-10 bg-gradient-to-b from-[#DCE6EF]/90 via-[#DCE6EF]/60 to-transparent dark:from-gray-900/90 dark:via-gray-900/60">
                  {secBanner2.title && (
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white tracking-tight">
                      {secBanner2.title}
                    </h3>
                  )}
                  {secBanner2.subtitle && (
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 font-medium">
                      {secBanner2.subtitle}
                    </p>
                  )}
                  {secBanner2.targetUrl && (
                    <div className="mt-1.5">
                      <span className="inline-block px-3 py-0.5 rounded-full bg-white/90 hover:bg-white text-gray-900 text-[10px] font-semibold border border-gray-200/60 shadow-2xs">
                        Learn More
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No banner available
              </div>
            )}
          </div>

          {/* Bottom Card 2 */}
          <div className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-[210px] sm:h-[235px] bg-[#EBA75E] dark:bg-gray-800">
            {secBanner3 ? (
              <Link to={secBanner3.targetUrl || "/shop"} className="block w-full h-full relative">
                {secBanner3.image && (
                  <img
                    src={getImageUrl(secBanner3.image)}
                    alt={secBanner3.title || "Banner"}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent p-5 sm:p-6 flex flex-col justify-center z-10">
                  <div className="max-w-[200px]">
                    {secBanner3.title && (
                      <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight leading-tight mt-1.5 font-sans whitespace-pre-line">
                        {secBanner3.title}
                      </h3>
                    )}
                    {secBanner3.targetUrl && (
                      <span className="inline-block mt-3 text-xs font-black text-white uppercase tracking-wider underline underline-offset-4 hover:text-amber-200 transition-colors">
                        SHOP NOW
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No banner available
              </div>
            )}
          </div>

          {/* Bottom Card 3 */}
          <div className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-[210px] sm:h-[235px] bg-[#F5E59B] dark:bg-gray-800">
            {secBanner4 ? (
              <Link to={secBanner4.targetUrl || "/shop"} className="block w-full h-full relative">
                {secBanner4.image && (
                  <img
                    src={getImageUrl(secBanner4.image)}
                    alt={secBanner4.title || "Banner"}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent p-5 sm:p-6 flex flex-col justify-center z-10 text-white">
                  <div className="max-w-[170px]">
                    {secBanner4.subtitle && (
                      <span className="text-[8px] sm:text-[8.5px] font-extrabold uppercase tracking-wider text-white/95 leading-tight block">
                        {secBanner4.subtitle}
                      </span>
                    )}
                    {secBanner4.title && (
                      <h3 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-white mt-1 leading-none whitespace-pre-line">
                        {secBanner4.title}
                      </h3>
                    )}
                    {secBanner4.targetUrl && (
                      <span className="inline-block mt-3 text-xs font-bold text-white uppercase tracking-wider underline underline-offset-4 hover:text-yellow-200 transition-colors">
                        DISCOVER
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No banner available
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
