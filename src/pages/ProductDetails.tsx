import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Plus,
  Minus,
  Star,
  ExternalLink,
  ChevronLeft,
  X,
  ZoomIn,
  Heart,
  Share2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import {
  MOCK_PRODUCTS,
  Product,
  SPEECH_BUBBLE_REVIEWS,
  RELATED_PRODUCTS_MOCK,
  VIVVIRA_GALLERY_IMAGES,
} from "@/data/shopData";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import { addToCart } from "@/redux/features/cart/cartSlice";
import { NewsletterVIP } from "@/components/Home/LandingPage/NewsletterVIP";
import CarouselScrollBarTrack from "@/components/Reuseable/CarouselScrollBarTrack";
import { toast } from "sonner";

export const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Find product by slug or fallback to first product
  const product: Product =
    MOCK_PRODUCTS.find(
      (p) =>
        p.slug === slug ||
        p.id === slug ||
        p.slug.toLowerCase() === (slug || "").toLowerCase()
    ) || MOCK_PRODUCTS[0];

  // Gallery matching the Figma screenshot: Vivvira Main Jar + 3 thumbnails
  const gallery = VIVVIRA_GALLERY_IMAGES;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Carousel refs
  const reviewsScrollRef = useRef<HTMLDivElement>(null);
  const relatedScrollRef = useRef<HTMLDivElement>(null);

  // Drag-to-scroll handlers for customer reviews
  const isReviewsDraggingRef = useRef(false);
  const reviewsStartXRef = useRef(0);
  const reviewsScrollLeftStartRef = useRef(0);

  const handleReviewsMouseDown = (e: React.MouseEvent) => {
    isReviewsDraggingRef.current = true;
    reviewsStartXRef.current = e.pageX - (reviewsScrollRef.current?.offsetLeft || 0);
    reviewsScrollLeftStartRef.current = reviewsScrollRef.current?.scrollLeft || 0;
  };
  const handleReviewsMouseLeave = () => { isReviewsDraggingRef.current = false; };
  const handleReviewsMouseUp = () => { isReviewsDraggingRef.current = false; };
  const handleReviewsMouseMove = (e: React.MouseEvent) => {
    if (!isReviewsDraggingRef.current || !reviewsScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (reviewsScrollRef.current.offsetLeft || 0);
    const walk = (x - reviewsStartXRef.current) * 1.5;
    reviewsScrollRef.current.scrollLeft = reviewsScrollLeftStartRef.current - walk;
  };

  // Drag-to-scroll handlers for related products
  const isRelatedDraggingRef = useRef(false);
  const relatedStartXRef = useRef(0);
  const relatedScrollLeftStartRef = useRef(0);

  const handleRelatedMouseDown = (e: React.MouseEvent) => {
    isRelatedDraggingRef.current = true;
    relatedStartXRef.current = e.pageX - (relatedScrollRef.current?.offsetLeft || 0);
    relatedScrollLeftStartRef.current = relatedScrollRef.current?.scrollLeft || 0;
  };
  const handleRelatedMouseLeave = () => { isRelatedDraggingRef.current = false; };
  const handleRelatedMouseUp = () => { isRelatedDraggingRef.current = false; };
  const handleRelatedMouseMove = (e: React.MouseEvent) => {
    if (!isRelatedDraggingRef.current || !relatedScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (relatedScrollRef.current.offsetLeft || 0);
    const walk = (x - relatedStartXRef.current) * 1.5;
    relatedScrollRef.current.scrollLeft = relatedScrollLeftStartRef.current - walk;
  };

  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const handleScroll = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id || "vivvira-product",
        slug: product.slug || "vivvira-cream",
        name: "Name of the product",
        price: 123,
        originalPrice: 145,
        image: gallery[0],
        brand: "Arona",
        category: "Skin Care",
        selectedSize: "50ml",
        quantity,
        openDrawer: true,
      })
    );
    toast.success("Added to Cart!", {
      description: `${quantity}x Name of the product added to your shopping bag.`,
    });
  };

  const handleBuyNow = () => {
    dispatch(
      addToCart({
        id: product.id || "vivvira-product",
        slug: product.slug || "vivvira-cream",
        name: "Name of the product",
        price: 123,
        originalPrice: 145,
        image: gallery[0],
        brand: "Arona",
        category: "Skin Care",
        selectedSize: "50ml",
        quantity,
        openDrawer: false,
      })
    );
    navigate("/payment");
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      toast.error("Please fill in your name and review.");
      return;
    }
    toast.success("Thank you for your review!", {
      description: "Your review has been submitted for moderation.",
    });
    setReviewName("");
    setReviewComment("");
    setIsReviewModalOpen(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFBF9] dark:bg-[#090D14] text-[#1B1E23] dark:text-gray-100 overflow-x-hidden font-['Inter'] transition-colors duration-200">
      {/* =========================================================================
          SECTION 1: MAIN PRODUCT SHOWCASE (Figma top: 158px, height: 880px)
         ========================================================================= */}
      <section className="w-full pt-6 pb-16 lg:pt-10 lg:pb-20">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button (Exact Figma: size- p-2 bg-gray-200 rounded-lg) */}
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center text-slate-900 dark:text-gray-200 active:scale-95 shadow-2xs"
              title="Go back"
            >
              <div className="size-6 relative flex items-center justify-center">
                <div className="w-3.5 h-0 absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-slate-900 dark:outline-gray-200" />
                <div className="w-1.5 h-3 left-[5px] top-[6px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-slate-900 dark:outline-gray-200" />
              </div>
            </button>

            {/* Quick Actions (Wishlist & Share) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
                }}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  isWishlisted
                    ? "bg-pink-50 dark:bg-pink-950/40 border-pink-800 dark:border-pink-500 text-pink-800 dark:text-pink-400"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-slate-500 dark:text-gray-300 hover:text-pink-800 dark:hover:text-pink-400"
                }`}
                title="Wishlist"
              >
                <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                }}
                className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-slate-500 dark:text-gray-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Share product"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Main 2-Column Showcase (Left Gallery 600px, Right Details 670px, gap 96px in Figma) */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-10 xl:gap-20">
            {/* ----------------- LEFT: IMAGE GALLERY (Responsive up to 600px) ----------------- */}
            <div className="w-full lg:flex-1 lg:max-w-[600px] xl:w-[600px] shrink-0 flex flex-col gap-4 sm:gap-5">
              {/* Main Featured Image: Responsive height rounded-2xl */}
              <div className="w-full h-[280px] xs:h-[340px] sm:h-[440px] lg:h-[480px] xl:h-[500px] relative rounded-2xl overflow-hidden bg-black/5 dark:bg-gray-800/40 shadow-2xs group flex items-center justify-center">
                <img
                  src={gallery[activeImageIndex]}
                  alt="Name of the product"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                  onClick={() => setIsLightboxOpen(true)}
                />

                {/* Zoom Trigger */}
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 p-2 sm:p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full text-gray-700 dark:text-gray-200 hover:text-pink-800 dark:hover:text-pink-400 shadow-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Enlarge image"
                >
                  <ZoomIn size={18} />
                </button>
              </div>

              {/* 3 Thumbnails Row (Figma: size-48 rounded-xl, gap-5) */}
              <div className="w-full grid grid-cols-3 gap-2.5 sm:gap-4">
                {[1, 2, 3].map((num, idx) => {
                  const thumbImg = gallery[idx] || gallery[0];
                  const isActive = activeImageIndex === idx;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-white dark:bg-gray-800 group ${
                        isActive
                          ? "border-[#500624] dark:border-[#FFE2FF] ring-2 ring-[#FFE2FF] shadow-xs"
                          : "border-gray-200 dark:border-gray-700 hover:border-slate-500"
                      }`}
                    >
                      <img
                        src={thumbImg}
                        alt={`Thumbnail ${num}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ----------------- RIGHT: PRODUCT DETAILS (Responsive up to 670px) ----------------- */}
            <div className="w-full lg:flex-1 lg:max-w-[670px] xl:w-[670px] flex flex-col gap-5">
              <div className="flex flex-col gap-5 sm:gap-6">
                {/* Header: Breadcrumbs + Title + Full specification pill */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      {/* Breadcrumbs: Category > Category */}
                      <div className="inline-flex items-center gap-2">
                        <span className="text-slate-500 dark:text-gray-400 text-xs font-semibold font-['Inter'] leading-4">
                          Category
                        </span>
                        <div className="size-4 relative flex items-center justify-center">
                          <div className="w-1 h-2 left-[6.75px] top-[4.50px] absolute outline outline-[1.20px] outline-offset-[-0.60px] outline-slate-500 dark:outline-gray-400" />
                        </div>
                        <span className="text-slate-500 dark:text-gray-400 text-xs font-semibold font-['Inter'] leading-4">
                          Category
                        </span>
                      </div>

                      {/* Title: Name of the product */}
                      <h1 className="text-zinc-900 dark:text-white text-2xl sm:text-3xl lg:text-4xl font-semibold font-['Faustina'] leading-tight sm:leading-10">
                        Name of the product
                      </h1>
                    </div>

                    {/* "Full specification" Pill Button */}
                    <button
                      type="button"
                      onClick={() => setIsSpecModalOpen(true)}
                      className="self-start sm:self-auto pl-4 pr-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-[100px] shadow-[0px_0px_12px_0px_rgba(0,0,0,0.06)] outline outline-1 outline-offset-[-1px] outline-gray-200 dark:outline-gray-700 flex justify-start items-center gap-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer shrink-0"
                    >
                      <span className="text-gray-700 dark:text-gray-200 text-sm font-normal font-['Inter'] leading-5">
                        Full specification
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-700 dark:text-gray-200" />
                    </button>
                  </div>

                  {/* 2 Category Pills */}
                  <div className="inline-flex items-center gap-2 sm:gap-3">
                    <div className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-[20px] flex justify-center items-center">
                      <span className="text-slate-500 dark:text-gray-300 text-xs font-semibold font-['Inter'] leading-4">
                        Category
                      </span>
                    </div>
                    <div className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-[20px] flex justify-center items-center">
                      <span className="text-slate-500 dark:text-gray-300 text-xs font-semibold font-['Inter'] leading-4">
                        Category
                      </span>
                    </div>
                  </div>

                  {/* 5 Stars Rating Row (4 amber + 1 outline) */}
                  <div className="inline-flex items-center gap-1">
                    {[1, 2, 3, 4].map((s) => (
                      <div key={s} className="size-6 relative flex items-center justify-center">
                        <Star className="size-5 fill-amber-300 text-amber-300" />
                      </div>
                    ))}
                    <div className="size-6 relative flex items-center justify-center">
                      <Star className="size-5 text-gray-300 dark:text-gray-600 fill-transparent" />
                    </div>
                  </div>
                </div>

                {/* Brand Badge */}
                <div className="w-20 h-11 relative bg-gray-200 dark:bg-gray-800 rounded-sm overflow-hidden flex items-center justify-center">
                  <span className="text-xs font-bold text-zinc-700 dark:text-gray-200 font-['Inter'] tracking-widest uppercase">
                    ARONA
                  </span>
                </div>

                {/* Description */}
                <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base font-normal font-['Inter'] leading-relaxed">
                  Alpha Male by Arona is a Aromatic Fougere frayance for men_ It was launched in 201S_ The nose behind this fragrance is F rancois Demachy. Alpha Male by Arona is a Aromatic Fougere frayance for men_ It was launched in 201S_ The nose behind this fragrance is F rancois Demachy.
                </div>

                {/* Stepper & Price Row */}
                <div className="flex items-center justify-between gap-4 pt-2">
                  {/* Stepper: [-] [1] [+] */}
                  <div className="rounded-lg flex justify-start items-center overflow-hidden border border-gray-700/20 dark:border-gray-700 shadow-2xs">
                    {/* Minus Button */}
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="size-10 bg-gray-700 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-60 text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Minus size={15} />
                    </button>

                    {/* Middle Number Display */}
                    <div className="w-11 h-10 bg-gradient-to-b from-zinc-100 via-white to-zinc-100 dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 flex items-center justify-center text-gray-700 dark:text-gray-200 text-sm font-semibold font-['Inter'] leading-5 select-none border-x border-gray-200 dark:border-gray-700">
                      {quantity}
                    </div>

                    {/* Plus Button */}
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="size-10 bg-gray-700 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-pink-800 dark:text-[#FF4D82] text-3xl sm:text-4xl font-semibold font-['Faustina'] leading-10">
                    ${(123 * quantity).toFixed(2)}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full sm:flex-1 h-12 px-5 py-3 bg-white dark:bg-gray-800 hover:bg-[#FFE2FF]/30 border-2 border-[#FFE2FF] rounded-lg flex justify-center items-center gap-1.5 text-[#500624] dark:text-[#FFE2FF] font-bold text-base sm:text-lg font-['Inter'] leading-6 transition-all duration-200 cursor-pointer shadow-2xs active:scale-[0.98]"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full sm:flex-1 h-12 px-5 py-3 bg-[#FFE2FF] hover:bg-[#ffd1ff] rounded-lg flex justify-center items-center gap-1.5 text-[#500624] font-bold text-base sm:text-lg font-['Inter'] leading-6 transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Trust Badges Card */}
              <div className="w-full p-5 sm:p-7 bg-neutral-50 dark:bg-[#111622] rounded-xl outline outline-1 outline-offset-[-1px] outline-pink-100 dark:outline-gray-800 flex flex-col gap-5 mt-2 shadow-2xs">
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Discount */}
                  <div className="flex justify-start items-start gap-3">
                    <div className="size-6 relative shrink-0 mt-0.5">
                      <div className="size-2 left-[8px] top-[8px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-gray-700 dark:outline-gray-300" />
                      <div className="size-5 left-[2px] top-[2px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-gray-700 dark:outline-gray-300" />
                    </div>
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <div className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-normal font-['Inter'] leading-snug">
                        Discount
                      </div>
                      <div className="text-zinc-900 dark:text-white text-base sm:text-lg font-semibold font-['Faustina'] leading-snug">
                        Discount 15%
                      </div>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="flex justify-start items-start gap-3">
                    <div className="size-6 relative shrink-0 mt-0.5">
                      <div className="w-3.5 h-1 left-[3px] top-[3px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-gray-700 dark:outline-gray-300" />
                      <div className="size-4 left-[3px] top-[5px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-gray-700 dark:outline-gray-300" />
                      <div className="size-1 left-[17px] top-[12px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-gray-700 dark:outline-gray-300" />
                    </div>
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <div className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-normal font-['Inter'] leading-snug">
                        Payment
                      </div>
                      <div className="text-zinc-900 dark:text-white text-base sm:text-lg font-semibold font-['Faustina'] leading-snug">
                        Cash on delivery
                      </div>
                    </div>
                  </div>

                  {/* Delivery time */}
                  <div className="flex justify-start items-start gap-3">
                    <div className="size-6 relative shrink-0 mt-0.5">
                      <div className="size-[5px] left-[14.50px] top-[15px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-gray-700 dark:outline-gray-300" />
                      <div className="size-[5px] left-[4.50px] top-[15px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-gray-700 dark:outline-gray-300" />
                      <div className="w-5 h-3.5 left-[2px] top-[4px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-gray-700 dark:outline-gray-300" />
                      <div className="w-1.5 h-[3px] left-[2px] top-[7px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-gray-700 dark:outline-gray-300" />
                    </div>
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <div className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-normal font-['Inter'] leading-snug">
                        Delivery time
                      </div>
                      <div className="text-zinc-900 dark:text-white text-base sm:text-lg font-semibold font-['Faustina'] leading-snug">
                        3-4 Working days
                      </div>
                    </div>
                  </div>

                  {/* Return and refunding */}
                  <div className="flex justify-start items-start gap-3">
                    <div className="size-6 relative shrink-0 mt-0.5">
                      <div className="w-4 h-3.5 left-[3px] top-[7px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-gray-700 dark:outline-gray-300" />
                      <div className="size-2 left-[7px] top-[2px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-gray-700 dark:outline-gray-300" />
                      <div className="size-1.5 left-[15px] top-[15px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-gray-700 dark:outline-gray-300" />
                    </div>
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <div className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-normal font-['Inter'] leading-snug">
                        Return and refunding
                      </div>
                      <div className="text-zinc-900 dark:text-white text-base sm:text-lg font-semibold font-['Faustina'] leading-snug">
                        7 Days easy return
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: RATING & REVIEWS (Figma top: 1038px, height: 984px)
         ========================================================================= */}
      <section className="w-full py-12 sm:py-16 lg:py-20 border-t border-pink-100/60 dark:border-gray-800 bg-white dark:bg-[#090D14] transition-colors duration-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <h2 className="text-black dark:text-white text-3xl sm:text-4xl lg:text-5xl font-bold font-['Faustina'] leading-tight mb-8">
            Rating &amp; Reviews
          </h2>

          {/* Rating Summary Row (Left score, Middle breakdown bars, Right review box) */}
          <div className="flex flex-col xl:flex-row items-center xl:items-end justify-between gap-8 xl:gap-10 pb-10 sm:pb-12">
            {/* Left Big Score: 4.5 / 5 */}
            <div className="flex items-baseline gap-2 shrink-0">
              <span className="text-gray-700 dark:text-gray-100 text-[72px] xs:text-[96px] sm:text-[140px] md:text-[180px] xl:text-[220px] font-light font-['Faustina'] leading-none select-none tracking-tight">
                4.5
              </span>
              <span className="text-gray-400 dark:text-gray-500 text-3xl sm:text-4xl lg:text-5xl font-semibold font-['Faustina'] leading-tight select-none">
                / 5
              </span>
            </div>

            {/* Middle 5-Bar Rating Breakdown (Responsive width up to 480px) */}
            <div className="w-full xl:w-[480px] max-w-full flex flex-col gap-2.5">
              {[
                { star: 5, fillPercent: "92%" },
                { star: 4, fillPercent: "74%" },
                { star: 3, fillPercent: "56%" },
                { star: 2, fillPercent: "38%" },
                { star: 1, fillPercent: "11%" },
              ].map((item) => (
                <div key={item.star} className="flex items-center gap-3 sm:gap-4">
                  <div className="size-7 sm:size-8 relative flex items-center justify-center shrink-0">
                    <Star className="size-5 sm:size-6 fill-amber-300 text-amber-300" />
                  </div>
                  <span className="w-3 text-center text-gray-700 dark:text-gray-300 text-base sm:text-lg font-semibold font-['Faustina'] leading-5 shrink-0">
                    {item.star}
                  </span>
                  <div className="flex-1 h-3.5 sm:h-4 bg-gray-200 dark:bg-gray-800 rounded-[20px] overflow-hidden relative">
                    <div
                      className="h-full bg-gray-700 dark:bg-pink-600 rounded-[20px] transition-all duration-700"
                      style={{ width: item.fillPercent }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Right Card: "Review this product" (Responsive width up to 384px) */}
            <div className="w-full xl:w-96 min-h-[192px] p-5 sm:p-7 bg-white dark:bg-[#111622] rounded-3xl outline outline-1 outline-offset-[-1px] outline-gray-200 dark:outline-gray-800 flex flex-col justify-between items-center text-center shadow-xs">
              <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                <h3 className="text-zinc-900 dark:text-white text-xl sm:text-2xl font-semibold font-['Faustina'] leading-7">
                  Review this product
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-normal font-['Inter'] leading-5">
                  Share your thoughts with others customer
                </p>
              </div>

              {/* Button: Write a Review trigger */}
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                className="w-full h-11 sm:h-12 px-5 py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-800 hover:bg-pink-800 hover:text-white rounded-lg flex justify-center items-center text-slate-500 dark:text-gray-200 font-semibold text-base sm:text-lg font-['Inter'] leading-6 transition-colors cursor-pointer mt-3 active:scale-95 shadow-2xs"
              >
                Write a Review
              </button>
            </div>
          </div>

          {/* Carousel Header with Navigation Arrows on Right */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-['Faustina'] font-semibold text-xl sm:text-2xl text-zinc-900 dark:text-white">
              Customer Reviews ({SPEECH_BUBBLE_REVIEWS.length})
            </h3>

            {/* Prev / Next circle buttons (Exact Figma: bg-gray-400 and bg-gray-700) */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                type="button"
                onClick={() => handleScroll(reviewsScrollRef, "left")}
                className="size-8 p-1 bg-gray-400 dark:bg-gray-700 hover:bg-gray-500 text-white rounded-2xl flex justify-center items-center transition-colors cursor-pointer active:scale-90 shadow-2xs"
                title="Previous reviews"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleScroll(reviewsScrollRef, "right")}
                className="size-8 p-1 bg-gray-700 dark:bg-gray-600 hover:bg-gray-800 text-white rounded-2xl flex justify-center items-center transition-colors cursor-pointer active:scale-90 shadow-2xs"
                title="Next reviews"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* 4 Colored Review Cards (Responsive Width: 280px-325px) */}
          <div
            ref={reviewsScrollRef}
            onMouseDown={handleReviewsMouseDown}
            onMouseLeave={handleReviewsMouseLeave}
            onMouseUp={handleReviewsMouseUp}
            onMouseMove={handleReviewsMouseMove}
            style={{
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="flex items-center gap-4 sm:gap-5 overflow-x-auto pb-2 scrollbar-none no-scrollbar [&::-webkit-scrollbar]:hidden scroll-smooth cursor-grab active:cursor-grabbing -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {SPEECH_BUBBLE_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="w-[280px] xs:w-[300px] sm:w-[325px] h-[389px] shrink-0 rounded-2xl overflow-hidden relative p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 group select-none"
                style={{ backgroundColor: review.bgColor, scrollSnapAlign: "start" }}
              >
                {/* Decorative botanical leaf silhouette in top left */}
                <svg
                  className="absolute top-2 left-2 w-16 h-16 opacity-25 pointer-events-none"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 50C12 30 30 14 54 10C50 30 34 48 10 50Z"
                    fill={review.accentColor}
                  />
                  <path
                    d="M10 50C24 46 36 34 42 20"
                    stroke={review.accentColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Top header: #CustomerReview watermark */}
                <div className="relative z-10 flex items-center justify-center">
                  <span
                    className="text-xs font-semibold uppercase tracking-wider opacity-80"
                    style={{ color: review.accentColor }}
                  >
                    #CustomerReview
                  </span>
                </div>

                {/* Ghost decorative watermark in background: REVIEW */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10">
                  <span
                    className="font-bold text-7xl font-['Faustina'] tracking-widest transform -rotate-12"
                    style={{ color: review.accentColor }}
                  >
                    REVIEW
                  </span>
                </div>

                {/* Central Floating White Speech Bubble Card */}
                <div
                  className="relative z-10 bg-white dark:bg-[#161C2A] rounded-2xl p-5 shadow-md flex flex-col gap-3"
                  style={{ border: `1px solid ${review.bubbleBorderColor}` }}
                >
                  {/* Quote text */}
                  <p className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-normal leading-relaxed line-clamp-4">
                    "{review.comment}"
                  </p>

                  {/* 5 Yellow Stars inside speech bubble */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="size-4 fill-amber-300 text-amber-300" />
                    ))}
                  </div>

                  {/* User Avatar + Name inside bubble */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="size-7 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                    />
                    <span className="text-xs font-semibold text-zinc-900 dark:text-white font-['Inter']">
                      {review.author}
                    </span>
                  </div>
                </div>

                {/* Bottom row: KC Bazar Brand seal icon */}
                <div className="relative z-10 flex items-center justify-end">
                  <div
                    className="text-[11px] font-['Faustina'] italic font-bold tracking-tight opacity-75"
                    style={{ color: review.accentColor }}
                  >
                    SHOB Now Verified
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Interactive ScrollBar Slider matching Figma design */}
          <div className="mt-6">
            <CarouselScrollBarTrack scrollRef={reviewsScrollRef} stepAmount={345} />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: YOU MIGHT ALSO LIKE (Figma top: 2022px, height: 694px)
         ========================================================================= */}
      <section className="w-full py-12 sm:py-16 lg:py-20 bg-white dark:bg-[#090D14] border-t border-pink-100/60 dark:border-gray-800 transition-colors duration-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          {/* Title: You Might Also Like (Faustina 48px font-bold text-center) */}
          <h2 className="text-black dark:text-white text-3xl sm:text-4xl lg:text-5xl font-bold font-['Faustina'] leading-tight text-center mb-8 sm:mb-10">
            You Might Also Like
          </h2>

          {/* 4 Cards Row (Responsive cards with drag-to-scroll) */}
          <div
            ref={relatedScrollRef}
            onMouseDown={handleRelatedMouseDown}
            onMouseLeave={handleRelatedMouseLeave}
            onMouseUp={handleRelatedMouseUp}
            onMouseMove={handleRelatedMouseMove}
            style={{
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="w-full flex items-center justify-start gap-3.5 sm:gap-4 overflow-x-auto pb-2 scrollbar-none no-scrollbar [&::-webkit-scrollbar]:hidden scroll-smooth cursor-grab active:cursor-grabbing -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {RELATED_PRODUCTS_MOCK.map((item) => (
              <div
                key={item.id}
                className="w-[230px] sm:w-64 shrink-0 bg-white dark:bg-[#111622] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-start items-end gap-[5px] select-none"
                style={{ scrollSnapAlign: "start" }}
              >
                {/* Product Image: Responsive height */}
                <Link
                  to={`/product/${item.slug}`}
                  className="w-full h-52 sm:h-64 relative overflow-hidden block bg-neutral-50 dark:bg-gray-800/40"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                {/* Card Content: p-2 flex flex-col gap-3 */}
                <div className="self-stretch p-3 flex flex-col justify-start items-start gap-3">
                  {/* Name of the product */}
                  <Link
                    to={`/product/${item.slug}`}
                    className="self-stretch justify-center text-black dark:text-white text-base sm:text-lg font-semibold font-['Faustina'] leading-snug hover:text-pink-800 dark:hover:text-[#FF4D82] transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>

                  {/* Price: $123.00 */}
                  <div className="self-stretch justify-center text-black dark:text-white text-sm sm:text-base font-semibold font-['Faustina'] leading-5">
                    {item.priceStr}
                  </div>

                  {/* Status: In-Stock • 12 Sold */}
                  <div className="self-stretch inline-flex justify-start items-center gap-2">
                    <div className="text-slate-500 dark:text-gray-400 text-xs font-normal font-['Inter'] leading-5">
                      {item.stockStatus}
                    </div>
                    <div className="size-[5px] bg-zinc-300 dark:bg-gray-600 rounded-full" />
                    <div className="text-slate-500 dark:text-gray-400 text-xs font-normal font-['Inter'] leading-5">
                      {item.soldCount} Sold
                    </div>
                  </div>

                  {/* Shop Now Button */}
                  <Link
                    to={`/product/${item.slug}`}
                    className="self-stretch px-3.5 py-2 bg-gray-200 dark:bg-gray-800 group-hover:bg-pink-800 group-hover:text-white rounded-lg inline-flex justify-center items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="flex-1 text-center justify-center text-slate-500 dark:text-gray-300 group-hover:text-white text-xs sm:text-sm font-semibold font-['Inter'] leading-5 transition-colors">
                      Shop Now
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Interactive ScrollBar Slider matching Figma design */}
          <div className="w-full mt-4 mb-2">
            <CarouselScrollBarTrack scrollRef={relatedScrollRef} stepAmount={280} />
          </div>

          {/* Navigation Arrows Centered Below */}
          <div className="flex items-center justify-center gap-4 mt-3">
            <button
              type="button"
              onClick={() => handleScroll(relatedScrollRef, "left")}
              className="size-8 p-1 bg-gray-400 dark:bg-gray-700 hover:bg-gray-500 text-white rounded-2xl flex justify-center items-center transition-colors cursor-pointer active:scale-90 shadow-xs"
              title="Previous products"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => handleScroll(relatedScrollRef, "right")}
              className="size-8 p-1 bg-gray-700 dark:bg-gray-600 hover:bg-gray-800 text-white rounded-2xl flex justify-center items-center transition-colors cursor-pointer active:scale-90 shadow-xs"
              title="Next products"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: NEWSLETTER VIP (Figma top: 2856px)
         ========================================================================= */}
      <NewsletterVIP />

      {/* =========================================================================
          MODAL 1: FULL SPECIFICATION MODAL
         ========================================================================= */}
      {isSpecModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-[#111622] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 max-h-[90vh] flex flex-col">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-neutral-50 dark:bg-[#0D121D]">
              <div>
                <span className="text-xs font-semibold text-pink-800 dark:text-pink-400 uppercase tracking-wider font-['Inter']">
                  Specifications &amp; Authenticity
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-['Faustina'] text-zinc-900 dark:text-white mt-0.5">
                  Full Specification
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSpecModalOpen(false)}
                className="p-2 text-slate-500 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 text-sm font-['Inter']">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700">
                <div>
                  <span className="text-slate-500 dark:text-gray-400 text-xs block">Brand</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">Arona Paris</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-gray-400 text-xs block">Category</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">Aromatic Fougere Skincare</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-gray-400 text-xs block">Formulation</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">Hydrating Cream Balm</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-gray-400 text-xs block">Volume</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">50 ml / 1.7 fl oz</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg font-['Faustina'] text-zinc-900 dark:text-white mb-2">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Deeply nourishing botanical formula with long-lasting moisture barrier lock.</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Rich in natural ceramides and squalane for supple, luminous texture.</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>Dermatologically tested and non-comedogenic for sensitive skin.</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck size={28} className="text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold block text-sm">100% Genuine Guaranteed</span>
                  Every batch certified authentic with SHOB Now guarantee seal and direct brand traceability.
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex justify-end bg-gray-50 dark:bg-[#0D121D]">
              <button
                type="button"
                onClick={() => setIsSpecModalOpen(false)}
                className="px-6 py-2.5 bg-gray-700 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: WRITE A REVIEW MODAL
         ========================================================================= */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-[#111622] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-neutral-50 dark:bg-[#0D121D]">
              <div>
                <span className="text-xs font-semibold text-pink-800 dark:text-pink-400 uppercase tracking-wider font-['Inter']">
                  Community Feedback
                </span>
                <h3 className="text-2xl font-bold font-['Faustina'] text-zinc-900 dark:text-white mt-0.5">
                  Review this product
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="p-2 text-slate-500 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Overall Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setUserRating(s)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`size-7 ${
                          s <= userRating
                            ? "fill-amber-300 text-amber-300"
                            : "text-gray-300 dark:text-gray-600 fill-transparent"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {userRating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="Paula Oxford"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 text-zinc-900 dark:text-white text-sm rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-pink-800 dark:focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Your Experience
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your thoughts with other customers..."
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 text-zinc-900 dark:text-white text-sm rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-pink-800 dark:focus:border-pink-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2.5 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold text-sm rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-pink-800 hover:bg-pink-900 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: FULLSCREEN IMAGE LIGHTBOX
         ========================================================================= */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
          <img
            src={gallery[activeImageIndex]}
            alt="Product view"
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
