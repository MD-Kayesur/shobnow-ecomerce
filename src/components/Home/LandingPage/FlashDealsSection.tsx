import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Flame, Clock, ArrowRight, Zap, ShoppingCart, Star, Eye } from "lucide-react";
import { MOCK_PRODUCTS, Product } from "@/data/shopData";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import { addToCart } from "@/redux/features/cart/cartSlice";
import { toast } from "sonner";

interface FlashDealsProps {
  onQuickView?: (product: Product) => void;
}

export const FlashDealsSection: React.FC<FlashDealsProps> = ({ onQuickView }) => {
  const dispatch = useAppDispatch();

  // 12-hour live countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Pick top discounted products from MOCK_PRODUCTS
  const flashProducts = MOCK_PRODUCTS.filter(
    (p) => p.discountPercent && p.discountPercent >= 15
  ).slice(0, 4);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;

    dispatch(
      addToCart({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        brand: product.brand,
        category: product.category,
        selectedSize: product.volume || (product.sizes && product.sizes[0]),
        quantity: 1,
        openDrawer: true,
      })
    );

    toast.success(`Added ${product.name} to cart!`);
  };

  return (
    <section className="w-full py-8 sm:py-12 bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F2] to-white border-y border-amber-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar with Countdown */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-200/60 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#EF4444] to-[#F59E0B] flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-red-100 text-red-600 rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3 text-red-500" />
                  Limited Stock
                </span>
                <span className="text-xs text-amber-700 font-semibold hidden sm:inline-block">
                  Special Clearance Sale
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
                ⚡ Flash Deals of the Day
              </h2>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-semibold text-gray-600 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              Ends In:
            </span>
            <div className="flex items-center gap-1.5 font-mono">
              <div className="bg-gray-900 text-white font-bold px-2.5 py-1.5 rounded-lg text-sm sm:text-base shadow-sm">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <span className="font-bold text-gray-800 text-lg">:</span>
              <div className="bg-gray-900 text-white font-bold px-2.5 py-1.5 rounded-lg text-sm sm:text-base shadow-sm">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <span className="font-bold text-gray-800 text-lg">:</span>
              <div className="bg-red-600 text-white font-bold px-2.5 py-1.5 rounded-lg text-sm sm:text-base shadow-sm animate-pulse">
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
            </div>

            <Link
              to="/offers"
              className="hidden lg:flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-hover hover:underline ml-4"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {flashProducts.map((product) => {
            const soldPercent = Math.min(88, Math.max(55, Math.floor(product.rating * 17)));

            return (
              <div
                key={product.id}
                className="group relative bg-white rounded-3xl p-4 border border-amber-200/50 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 text-xs font-black uppercase tracking-wider bg-red-600 text-white rounded-xl shadow-md">
                    -{product.discountPercent}% OFF
                  </span>
                </div>

                {/* Quick View Button */}
                {onQuickView && (
                  <button
                    type="button"
                    onClick={() => onQuickView(product)}
                    className="absolute top-3 right-3 z-10 w-9 h-9 rounded-xl bg-white/90 hover:bg-white text-gray-600 hover:text-primary shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="Quick View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}

                {/* Image */}
                <Link
                  to={`/product/${product.slug}`}
                  className="block relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Content */}
                <div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {product.brand}
                  </div>
                  <Link
                    to={`/product/${product.slug}`}
                    className="block text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem] mb-2"
                  >
                    {product.name}
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2.5">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating) ? "fill-amber-400" : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      ({product.reviewsCount})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-black text-gray-900">
                      ৳{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ৳{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Progress Claimed */}
                  <div className="mb-3">
                    <div className="flex justify-between text-[11px] font-semibold text-gray-500 mb-1">
                      <span>Claimed: {soldPercent}%</span>
                      <span className="text-red-500 font-bold">Almost Sold Out</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full"
                        style={{ width: `${soldPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Add to Cart CTA */}
                <button
                  type="button"
                  onClick={(e) => handleAddToCart(e, product)}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-gray-900 hover:bg-primary text-white transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-primary/30"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add To Cart</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-6 text-center lg:hidden">
          <Link
            to="/offers"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm bg-primary text-white shadow-md"
          >
            <span>Explore All Flash Deals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FlashDealsSection;
