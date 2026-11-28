import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetPromoCarouselBannersQuery } from "@/redux/features/promoCarousel/promoCarouselApi";
import { getImageUrl } from "@/utils/imageUrl";

export default function PromoCarouselBanner() {
  const { data, isLoading } = useGetPromoCarouselBannersQuery();
  const banners = data?.data || [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= banners.length) setActiveIndex(0);
  }, [activeIndex, banners.length]);

  useEffect(() => {
    if (banners.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [banners.length]);

  if (isLoading || banners.length === 0) return null;
  const banner = banners[activeIndex];

  return (
    <section aria-label="Promotional banners" className="w-full bg-[#FFFCFE] dark:bg-[#090D14] py-6 sm:py-8">
      <div className="mx-auto max-w-[1296px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-pink-50 shadow-sm">
          <Link
            to={banner.targetUrl || "/shop"}
            aria-label={banner.title || "Shop this promotion"}
            className="group block aspect-[5.55/1] min-h-[130px] sm:min-h-[180px] lg:min-h-[234px]"
          >
            <img
              key={banner.id}
              src={getImageUrl(banner.image)}
              alt={banner.title || "Promotional banner"}
              className="h-full w-full object-cover object-center transition-opacity duration-300"
              loading="lazy"
            />
            <div className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center ${banner.position === 1 ? "text-white" : "text-[#171b4b]"}`}>
              <span className={`text-[10px] font-bold uppercase tracking-[.18em] sm:text-xs ${banner.position === 1 ? "text-pink-100" : "text-primary"}`}>Shop Now Studio</span>
              {banner.title && <span className="mt-1 text-base font-extrabold leading-tight drop-shadow-sm sm:text-2xl lg:text-3xl">{banner.title}</span>}
              {banner.subtitle && <span className="mt-1 max-w-[90%] text-[11px] font-medium leading-snug drop-shadow-sm sm:text-sm lg:text-base">{banner.subtitle}</span>}
            </div>
          </Link>
          {banners.length > 1 && (
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2" role="tablist" aria-label="Choose promotion">
              {banners.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={`Show promotion ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${index === activeIndex ? "w-7 bg-white shadow" : "w-2.5 bg-white/65 hover:bg-white"}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
