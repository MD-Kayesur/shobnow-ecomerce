import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Star, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import blueStockup from "@/assets/banners/promo-blue-stockup.jpg";
import redHotdeal from "@/assets/banners/promo-red-hotdeal.jpg";

import { CUSTOMER_REVIEWS_DATA } from "@/data/shopData";
import CarouselScrollBarTrack from "@/components/Reuseable/CarouselScrollBarTrack";

export const CustomerReviewsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -345 : 345;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Drag to scroll handlers for cards row
  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    startXRef.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeftStartRef.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleMouseLeave = () => {
    isMouseDownRef.current = false;
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current.offsetLeft || 0);
    const walk = (x - startXRef.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftStartRef.current - walk;
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
              className="w-9 h-9 rounded-full bg-[#1B1E23] dark:bg-gray-800 text-white dark:text-gray-200 flex items-center justify-center hover:bg-[#A20E4C] dark:hover:bg-[#A20E4C] transition-colors shadow-xs cursor-pointer active:scale-90"
              title="Previous Reviews"
              aria-label="Previous Reviews"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full bg-[#1B1E23] dark:bg-gray-800 text-white dark:text-gray-200 flex items-center justify-center hover:bg-[#A20E4C] dark:hover:bg-[#A20E4C] transition-colors shadow-xs cursor-pointer active:scale-90"
              title="Next Reviews"
              aria-label="Next Reviews"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Track of 325x389 Cards (Exact Figma Dimension) */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="flex items-center gap-4 sm:gap-5 overflow-x-auto pb-2 scrollbar-none no-scrollbar [&::-webkit-scrollbar]:hidden snap-x snap-mandatory cursor-grab active:cursor-grabbing -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
        >
          {CUSTOMER_REVIEWS_DATA.map((item) => (
            <div
              key={item.id}
              style={{ backgroundColor: item.bgColor }}
              className="w-[280px] xs:w-[300px] sm:w-[325px] h-[389px] shrink-0 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 snap-start border border-black/5 dark:border-white/10 relative overflow-hidden group select-none"
            >
              {/* Decorative background glow */}
              <div
                style={{ backgroundColor: item.accentColor }}
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-15 blur-2xl pointer-events-none"
              />

              {/* Card Top: Tag Badge & Quote Icon */}
              <div className="flex items-center justify-between relative z-10">
                <span
                  style={{ color: item.accentColor }}
                  className="px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 text-[10px] sm:text-[11px] font-inter font-bold tracking-wider uppercase shadow-2xs"
                >
                  {item.tag}
                </span>
                <span
                  style={{ color: item.accentColor }}
                  className="text-2xl font-serif font-black opacity-35 leading-none select-none tracking-tight"
                >
                  ””
                </span>
              </div>

              {/* Card Center: Floating White Review Bubble */}
              <div className="bg-white dark:bg-[#121622] rounded-2xl p-5 shadow-xs border border-black/[0.04] dark:border-gray-800 relative z-10 my-auto">
                {/* Star Rating & Timestamp */}
                <div className="flex items-center gap-1.5 text-amber-400 mb-2.5">
                  <div className="flex items-center gap-0.5">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400 dark:text-gray-400 font-inter font-medium ml-1">
                    {item.date}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-[13px] font-inter text-gray-700 dark:text-gray-200 leading-relaxed line-clamp-4">
                  "{item.comment}"
                </p>
              </div>

              {/* Card Bottom: Author Info & Product Name */}
              <div className="flex items-center gap-3 pt-2 relative z-10">
                <img
                  src={item.avatar}
                  alt={item.author}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-700 shadow-2xs shrink-0"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-inter font-bold text-gray-900 dark:text-white truncate">
                      {item.author}
                    </span>
                    <CheckCircle size={15} className="text-emerald-500 fill-emerald-50 shrink-0" />
                  </div>
                  <span className="text-xs font-inter text-gray-500 dark:text-gray-400 truncate block mt-0.5">
                    {item.productName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Interactive ScrollBar Slider matching Figma screenshot */}
        <div className="mt-6 mb-2">
          <CarouselScrollBarTrack scrollRef={scrollRef} stepAmount={345} />
        </div>

        {/* Dual Bottom Banners (Exact Figma: left: 280, top: 669, 670x234, borderRadius: 24) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-14 sm:mt-16">
          <Link
            to="/shop?filter=stockup"
            className="group block relative w-full h-[180px] sm:h-[234px] rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500"
          >
            <img
              src={blueStockup}
              alt="Stock Up On Your Favourites"
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
              loading="lazy"
            />
          </Link>
          <Link
            to="/shop?discount=40"
            className="group block relative w-full h-[180px] sm:h-[234px] rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500"
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

export default CustomerReviewsSection;
