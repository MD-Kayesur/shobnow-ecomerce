import { useEffect, useState } from "react";
import Hero from "@/components/Home/Hero/Hero";
import BrandMarquee from "@/components/Home/LandingPage/BrandMarquee";
import BrandCategories from "@/components/Home/LandingPage/BrandCategories";
import NewArrivalsSection from "@/components/Home/LandingPage/NewArrivalsSection";
import AugustBeautyBanner from "@/components/Home/LandingPage/AugustBeautyBanner";
import TopSellingSection from "@/components/Home/LandingPage/TopSellingSection";
import DualPromoBanners from "@/components/Home/LandingPage/DualPromoBanners";
import FeaturedProductsCarousel from "@/components/Home/LandingPage/FeaturedProductsCarousel";
import CustomerReviewsSection from "@/components/Home/LandingPage/CustomerReviewsSection";
import NewsletterVIP from "@/components/Home/LandingPage/NewsletterVIP";
import ProductQuickViewModal from "@/components/Shop/ProductQuickViewModal";
import { Product } from "@/data/shopData";
import { toast } from "sonner";
import { useAddWishlistItemMutation, useGetWishlistQuery, useRemoveWishlistItemMutation } from "@/redux/features/storefront/storefrontApi";
import { useAppSelector } from "@/redux/hooks/redux-hook";

const Home = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const user = useAppSelector((state) => state.auth.user);
  const { data: wishlistResponse } = useGetWishlistQuery(undefined, { skip: !user });
  const [addWishlist] = useAddWishlistItemMutation();
  const [removeWishlist] = useRemoveWishlistItemMutation();

  useEffect(() => {
    if (user) setWishlist(Object.fromEntries((wishlistResponse?.data || []).map((entry) => [entry.product.id, true])));
    else setWishlist({});
  }, [user, wishlistResponse]);

  const handleToggleWishlist = async (product: Product) => {
    if (!user) { toast.info("Sign in to save products to your wishlist."); return; }
    try {
      if (wishlist[product.id]) { await removeWishlist(product.id).unwrap(); toast.info(`Removed ${product.name} from wishlist.`); }
      else { await addWishlist({ productId: product.id }).unwrap(); toast.success(`Added ${product.name} to wishlist!`); }
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      toast.error(message || "Could not update your wishlist. Please try again.");
    }
  };

  return (
    <div className="w-full bg-[#FFFCFE] dark:bg-[#090D14] transition-colors duration-200 overflow-hidden">
      {/* 1. Main Hero 5-Card Banner Grid (Figma: top: 158, height: 898, #FFF9FB) */}
      <Hero />

      {/* 2. Brand Capsule Marquee directly beneath Hero (Figma) */}
      <BrandMarquee />

      {/* 3. Section 1: Jewellery & Accessories Category Stadium Pills (Figma: top: 1056, height: 998, #FDFDFD) */}
      <BrandCategories title="Jewellery & Accessories" />

      {/* 4. Section 2: Beauty & Personal Care Category Stadium Pills (Figma: top: 2054, height: 998, #FDFDFD) */}
      <BrandCategories title="Beauty & Personal Care" className="border-t border-[#F6E7ED]" />

      {/* 5. Section 3: New Arrival 5-Col x 2-Row Product Grid + See All (Figma: top: 3052, height: 1171, white) */}
      <NewArrivalsSection
        onQuickView={(product) => setQuickViewProduct(product)}
      />

      {/* 6. Section 4 Part A: August Beauty Deals Wide Editorial Banner (Figma: top: 4223, 1360x234, #FFF9FB) */}
      <AugustBeautyBanner />

      {/* 7. Section 4 Part B: Top Selling 5-Col x 2-Row Product Grid + See All (Figma: top: 4223 + 364) */}
      <TopSellingSection
        onQuickView={(product) => setQuickViewProduct(product)}
      />

      {/* 8. Section 4 Part C: Dual Mid Promotional Banners: Pink Skincare & Yellow Prime Time (Figma: top: 4223 + 1425) */}
      <DualPromoBanners />

      {/* 9. Section 5: Featured Products 3D Perspective Card Carousel on Blush Background (Figma: top: 5962, height: 870, #F6E7ED) */}
      <FeaturedProductsCarousel />

      {/* 10. Section 6: Customer Reviews Horizontal Track + Dual Bottom Banners (Figma: top: 6832, height: 983, white) */}
      <CustomerReviewsSection />

      {/* 11. Section 7: VIP Newsletter: Get Notified When We Launch Pink Container (Figma: top: 7887, #FEEAF1) */}
      <NewsletterVIP />

      {/* Interactive Product Quick View Modal */}
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

export default Home;
