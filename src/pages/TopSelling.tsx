import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { MOCK_PRODUCTS, Product } from "@/data/shopData";
import { FigmaProductCard } from "@/components/Home/LandingPage/NewArrivalsSection";
import NewsletterVIP from "@/components/Home/LandingPage/NewsletterVIP";
import ProductQuickViewModal from "@/components/Shop/ProductQuickViewModal";
import reelModelImg from "@/assets/banners/top-selling-reel-card.png";
import bannerSkincare from "@/assets/banners/banner-skincare.jpg";
import bannerAugust from "@/assets/banners/banner-august-deals.jpg";
import bannerMakeup from "@/assets/banners/banner-makeup.jpg";
import heroSpray from "@/assets/banners/hero-spray-banner.jpg";
import { toast } from "sonner";

// 16 Reel items to populate the 4x4 Grid specified in Figma
interface ReelItem {
  id: string;
  reelImage: string;
  name: string;
  price: string;
  thumbImage: string;
  productSlug?: string;
}

export const TopSelling: React.FC = () => {
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [visibleReelCount, setVisibleReelCount] = useState(16);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const banners = [bannerSkincare, bannerAugust, bannerMakeup, heroSpray];

  // Map products into 16 Reel items using the user's uploaded Aurelia Glow / Reel assets
  const reelItems: ReelItem[] = Array.from({ length: 16 }).map((_, idx) => {
    const prod = MOCK_PRODUCTS[idx % MOCK_PRODUCTS.length];
    return {
      id: `reel-${idx + 1}`,
      reelImage: reelModelImg,
      name: prod?.name || "Aurelia Glow Renew Day Cream",
      price: `$${(prod?.price ? (prod.price / 100).toFixed(2) : "12.00")}`,
      thumbImage: prod?.image || reelModelImg,
      productSlug: prod?.slug || "vivvira-collagen-firming-cream",
    };
  });

  // 10 New Arrival products for the 5x2 grid
  const newArrivals = MOCK_PRODUCTS.slice(0, 10);

  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const updated = !prev[product.id];
      if (updated) {
        toast.success(`Added ${product.name} to your wishlist!`);
      } else {
        toast.info(`Removed ${product.name} from wishlist.`);
      }
      return { ...prev, [product.id]: updated };
    });
  };

  return (
    <div className="w-full bg-white dark:bg-[#090D14] text-gray-900 dark:text-gray-100 transition-colors duration-200 select-none overflow-hidden pb-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        {/* ========================================================================= */}
        {/* 1. HERO CAROUSEL BANNER (Figma: w-[1360px] h-80 rounded-3xl with 4 dots)  */}
        {/* ========================================================================= */}
        <div className="relative w-full h-64 sm:h-76 md:h-80 rounded-3xl overflow-hidden shadow-sm my-6 sm:my-10 bg-[#1E0F14]">
          <img
            src={banners[activeBannerIndex]}
            alt="Top Selling Special"
            className="w-full h-full object-cover transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end items-center p-5">
            {/* 4 Pagination Dots (Exact Figma) */}
            <div className="inline-flex items-center gap-1.5">
              {banners.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setActiveBannerIndex(dotIdx)}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  className={`size-3 rounded-full transition-all duration-300 cursor-pointer ${
                    activeBannerIndex === dotIdx
                      ? "bg-white scale-110 shadow-xs"
                      : "bg-zinc-800/60 hover:bg-zinc-700/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. REEL TOP SELLING 4x4 GRID (16 Cards matching Figma + uploaded image)    */}
        {/* ========================================================================= */}
        <section className="w-full my-10 sm:my-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 justify-items-center">
            {reelItems.slice(0, visibleReelCount).map((reel) => (
              <div
                key={reel.id}
                className="w-full max-w-[320px] sm:max-w-none h-[460px] sm:h-[480px] p-3 rounded-3xl shadow-[0px_8px_90px_0px_rgba(0,0,0,0.16)] hover:shadow-[0px_16px_90px_0px_rgba(0,0,0,0.26)] flex flex-col justify-end items-center relative overflow-hidden transition-all duration-300 group cursor-pointer border border-gray-100 dark:border-gray-800"
                onClick={() => {
                  const found = MOCK_PRODUCTS.find((p) => p.slug === reel.productSlug) || MOCK_PRODUCTS[0];
                  setQuickViewProduct(found);
                }}
              >
                {/* Background Reel Video/Photo */}
                <img
                  src={reel.reelImage}
                  alt={reel.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                  loading="lazy"
                />

                {/* Subtle vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Center Glassmorphism Play Button */}
                <div className="size-16 p-1 bg-pink-100/20 rounded-full backdrop-blur-[3px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex justify-center items-center shadow-lg group-hover:scale-115 transition-transform duration-300">
                  <div className="size-7 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5 drop-shadow-sm" />
                  </div>
                </div>

                {/* Bottom Card Product Info Overlay */}
                <div className="self-stretch p-2 bg-white/95 dark:bg-[#121622]/95 backdrop-blur-xs rounded-xl inline-flex justify-start items-center gap-2.5 z-10 shadow-sm border border-white/60 dark:border-gray-700 transition-colors">
                  <img
                    src={reel.thumbImage}
                    alt={reel.name}
                    className="size-14 sm:size-16 rounded-lg object-cover bg-gray-50 dark:bg-gray-800 shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-1 overflow-hidden">
                    <div className="self-stretch text-black dark:text-white text-base sm:text-lg font-semibold font-faustina font-['Faustina'] leading-tight line-clamp-1">
                      {reel.name}
                    </div>
                    <div className="self-stretch text-gray-500 dark:text-gray-300 text-sm sm:text-base font-semibold font-faustina font-['Faustina'] leading-tight">
                      {reel.price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* See more Button */}
          <div className="w-full flex justify-center mt-10">
            <button
              type="button"
              onClick={() => {
                if (visibleReelCount < reelItems.length) {
                  setVisibleReelCount(reelItems.length);
                } else {
                  toast.info("Showing all top-selling products.");
                }
              }}
              className="h-10 px-6 py-2 bg-[#E9EBEE] dark:bg-gray-800 hover:bg-[#A20E4C] hover:text-white rounded-lg inline-flex justify-center items-center gap-1.5 text-slate-600 dark:text-gray-200 text-base font-semibold font-['Inter'] leading-5 transition-colors cursor-pointer"
            >
              See more
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. NEW ARRIVAL 5-COL x 2-ROW GRID (10 Cards matching Figma)               */}
        {/* ========================================================================= */}
        <section className="w-full my-12 sm:my-16 pt-8 border-t border-gray-100 dark:border-gray-800">
          <div className="text-center justify-center text-black dark:text-white text-4xl sm:text-5xl font-bold font-faustina font-['Faustina'] leading-[50.40px] mb-8 sm:mb-12">
            New Arrival
          </div>

          {/* 5-Column x 2-Row Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-10">
            {newArrivals.map((prod) => (
              <FigmaProductCard
                key={prod.id}
                product={prod}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>

          {/* See all Button */}
          <div className="w-full flex justify-center">
            <Link
              to="/shop?sort=newest"
              className="h-10 px-6 py-2 bg-[#E9EBEE] dark:bg-gray-800 hover:bg-[#A20E4C] hover:text-white rounded-lg inline-flex justify-center items-center gap-1.5 text-slate-600 dark:text-gray-200 text-base font-semibold font-['Inter'] leading-5 transition-colors"
            >
              See all
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. NEWSLETTER VIP CONTAINER                                               */}
        {/* ========================================================================= */}
        <div className="w-full my-8">
          <NewsletterVIP />
        </div>
      </div>

      {/* Interactive Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={quickViewProduct ? !!wishlist[quickViewProduct.id] : false}
        onToggleWishlist={handleToggleWishlist}
      />
    </div>
  );
};

export default TopSelling;
