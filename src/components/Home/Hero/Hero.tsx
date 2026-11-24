import React, { useState } from "react";
import { Link } from "react-router-dom";
import sprayBannerImg from "@/assets/banners/hero-spray-banner.jpg";
import blackFridayImg from "@/assets/banners/hero-black-friday.jpg";
import wirelessChargerImg from "@/assets/banners/hero-wireless-charger.jpg";
import activeCImg from "@/assets/banners/hero-active-c.jpg";
import ekosImg from "@/assets/banners/hero-ekos-maracuja.jpg";

export const Hero: React.FC = () => {
  const [activeDot, setActiveDot] = useState(0);

  return (
    <section className="w-full bg-[#FFF9FB] dark:bg-[#090D14] pt-4 sm:pt-6 pb-2 select-none transition-colors duration-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        {/* TOP ROW: 2 Cards (Large Featured Spray Carousel + Black Friday Banner) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
          {/* 1. Large Spray Collection Card (~65% width) */}
          <div className="lg:col-span-8 group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-[380px] sm:h-[440px] lg:h-[480px] bg-[#1E0F14]">
            {/* Background Image */}
            <img
              src={sprayBannerImg}
              alt="All Over Spray Collection"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            />

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex flex-col justify-between p-7 sm:p-10 lg:p-12 z-10">
              <div className="max-w-md pt-2 sm:pt-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-[1.08] font-sans drop-shadow-sm">
                  ALL OVER
                  <br />
                  SPRAY
                  <br />
                  COLLECTION
                </h1>
                <p className="text-white/90 text-xs sm:text-sm font-normal mt-3.5 leading-relaxed max-w-xs sm:max-w-sm drop-shadow-sm">
                  Our All Over Spray blends long-lasting fragrance with skin-loving hydration. Perfect for all day, every day.
                </p>
                <div className="mt-5">
                  <Link
                    to="/shop?category=fragrance"
                    className="inline-flex items-center px-6 py-2.5 rounded-full bg-white text-gray-950 font-bold text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors shadow-md"
                  >
                    Explore Spray Collection
                  </Link>
                </div>
              </div>

              {/* 4 Pagination Dots at Bottom Center */}
              <div className="flex items-center justify-center gap-2 pb-1">
                {[0, 1, 2, 3].map((idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveDot(idx)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      activeDot === idx
                        ? "w-7 h-2 bg-white shadow-xs"
                        : "w-2 h-2 bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 2. Black Friday Cyber Monday Card (~35% width) */}
          <div className="lg:col-span-4 group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-[380px] sm:h-[440px] lg:h-[480px] bg-gradient-to-b from-[#13072B] via-[#1E093D] to-[#2E0B5B] flex flex-col justify-between p-6 sm:p-7 text-white">
            {/* Top Text Content */}
            <div className="relative z-10 text-center flex flex-col items-center">
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/90">
                Black Friday Cyber Monday
              </span>

              {/* Date Pill Tag */}
              <div className="inline-block mt-2 px-3.5 py-0.5 rounded-full text-[11px] font-bold bg-[#381368] text-[#E0C6FF] border border-[#6B2BB8] shadow-sm">
                20 Nov - 1 Dec
              </div>

              {/* Big Discount Headline */}
              <div className="mt-3 leading-none flex flex-col items-center">
                <span className="text-[11px] font-bold tracking-widest text-white/80 uppercase">
                  UP TO
                </span>
                <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight my-0.5">
                  40% OFF*
                </span>
                <span className="text-sm font-medium text-white/90 tracking-wider">
                  storewide
                </span>
              </div>
            </div>

            {/* Bottom Visual Shot */}
            <div className="relative z-10 w-full h-[220px] rounded-2xl overflow-hidden mt-2">
              <img
                src={blackFridayImg}
                alt="Black Friday Deals"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {/* Bottom Card 1: UGREEN MagFlow Wireless Charger */}
          <div className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-[210px] sm:h-[235px] bg-[#DCE6EF]">
            <img
              src={wirelessChargerImg}
              alt="UGREEN MagFlow Wireless Charger"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
            {/* Top text overlay */}
            <div className="absolute top-0 inset-x-0 p-4 text-center z-10 bg-gradient-to-b from-[#DCE6EF]/90 via-[#DCE6EF]/60 to-transparent">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight">
                UGREEN MagFlow Wireless Charger
              </h3>
              <p className="text-[11px] text-gray-600 font-medium">
                Designed for iPhone 12-15 series
              </p>
              <div className="mt-1.5">
                <Link
                  to="/shop"
                  className="inline-block px-3 py-0.5 rounded-full bg-white/90 hover:bg-white text-gray-900 text-[10px] font-semibold border border-gray-200/60 shadow-2xs"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Card 2: Active-C Keep Glowing */}
          <div className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-[210px] sm:h-[235px] bg-[#EBA75E]">
            <img
              src={activeCImg}
              alt="Keep Glowing Now You C It"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
            {/* Left text overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent p-5 sm:p-6 flex flex-col justify-center z-10">
              <div className="max-w-[200px]">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs border border-white/20">
                  NEW GLOW ACTIVE-C
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight leading-tight mt-1.5 font-sans">
                  KEEP GLOWING
                  <br />
                  NOW YOU C IT
                </h3>
                <Link
                  to="/shop?category=skin-care"
                  className="inline-block mt-3 text-xs font-black text-white uppercase tracking-wider underline underline-offset-4 hover:text-amber-200 transition-colors"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Card 3: EKOS Maracujá */}
          <div className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-[210px] sm:h-[235px] bg-[#F5E59B]">
            <img
              src={ekosImg}
              alt="Ekos Maracujá"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
            {/* Left text overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent p-5 sm:p-6 flex flex-col justify-center z-10 text-white">
              <div className="max-w-[170px]">
                <span className="text-[8px] sm:text-[8.5px] font-extrabold uppercase tracking-wider text-white/95 leading-tight block">
                  EXPERIMENTE UMA PELE MAIS MACIA, PERFUMADA COM
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-white mt-1 leading-none">
                  EKOS
                  <br />
                  MARACUJÁ
                </h3>
                <Link
                  to="/shop?category=body-care"
                  className="inline-block mt-3 text-xs font-bold text-white uppercase tracking-wider underline underline-offset-4 hover:text-yellow-200 transition-colors"
                >
                  Discover
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
