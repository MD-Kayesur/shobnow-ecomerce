import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X, Star, ShoppingCart, Check, Heart, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { Product } from "@/data/shopData";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import { addToCart } from "@/redux/features/cart/cartSlice";

export interface ProductQuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  if (!isOpen || !product) return null;

  const currentImage = selectedImage || product.image;

  const handleAddToCart = () => {
    if (!product.inStock) return;
    setAdded(true);
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
        quantity,
        openDrawer: true,
      })
    );
    if (onAddToCart) {
      onAddToCart(product, quantity);
    }
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#111622] rounded-2xl shadow-2xl z-10 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 border border-transparent dark:border-gray-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          {/* Left: Product Images */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square w-full rounded-2xl bg-gray-50 dark:bg-gray-900/60 overflow-hidden shadow-sm">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {product.discountPercent && (
                <span className="absolute top-3 left-3 bg-pink-800 text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs">
                  -{product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail switcher if hoverImage exists */}
            {product.hoverImage && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedImage(product.image)}
                  className={`w-16 h-16 rounded-xl overflow-hidden cursor-pointer transition-all ${
                    currentImage === product.image
                      ? "ring-2 ring-pink-800 scale-102"
                      : "opacity-70 hover:opacity-100 shadow-2xs"
                  }`}
                >
                  <img
                    src={product.image}
                    alt="Thumbnail 1"
                    className="w-full h-full object-cover"
                  />
                </button>
                <button
                  onClick={() => setSelectedImage(product.hoverImage!)}
                  className={`w-16 h-16 rounded-xl overflow-hidden cursor-pointer transition-all ${
                    currentImage === product.hoverImage
                      ? "ring-2 ring-pink-800 scale-102"
                      : "opacity-70 hover:opacity-100 shadow-2xs"
                  }`}
                >
                  <img
                    src={product.hoverImage}
                    alt="Thumbnail 2"
                    className="w-full h-full object-cover"
                  />
                </button>
              </div>
            )}

            {/* Quick Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-3 text-center text-[11px] text-gray-500 dark:text-gray-400">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={18} className="text-pink-800 dark:text-[#FF4D82]" />
                <span>100% Authentic</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck size={18} className="text-pink-800 dark:text-[#FF4D82]" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw size={18} className="text-pink-800 dark:text-[#FF4D82]" />
                <span>Easy Return</span>
              </div>
            </div>
          </div>

          {/* Right: Product Info & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-800 dark:text-[#FF4D82]">
                  {product.brand}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 ${
                    product.inStock
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                      : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      product.inStock ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                  {product.inStock ? "In stock" : "Out of stock"}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-snug">
                {product.name}
              </h2>

              {/* Rating & Volume */}
              <div className="flex items-center gap-3 mt-2 pb-2">
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star size={15} className="fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-gray-400 font-normal">
                    ({product.reviewsCount} customer reviews)
                  </span>
                </div>
                {product.volume && (
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 pl-2">
                    Volume: {product.volume}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 my-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-gray-400 line-through">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Tags & Concerns */}
              {product.skinConcern && product.skinConcern.length > 0 && (
                <div className="mb-4">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
                    Target Concerns:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.skinConcern.map((c) => (
                      <span
                        key={c}
                        className="text-[11px] font-medium bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-[#FF4D82] px-2.5 py-0.5 rounded-md"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions: Quantity + Add to Cart + Wishlist */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!product.inStock || quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 cursor-pointer font-bold text-base"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-gray-800 dark:text-gray-100">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!product.inStock}
                    className="w-10 h-10 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 cursor-pointer font-bold text-base"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-200 cursor-pointer ${
                    !product.inStock
                      ? "bg-gray-150 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                      : added
                      ? "bg-emerald-600 text-white shadow-md scale-102"
                      : "bg-pink-800 text-white hover:bg-pink-900 hover:shadow-md active:scale-98"
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={18} />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      <span>{product.inStock ? "Add to Cart" : "Out of Stock"}</span>
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                {onToggleWishlist && (
                  <button
                    onClick={() => onToggleWishlist(product)}
                    aria-label="Wishlist"
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-xs transition-all cursor-pointer ${
                      isWishlisted
                        ? "bg-pink-800 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-pink-800 dark:hover:text-[#FF4D82]"
                    }`}
                  >
                    <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                )}
              </div>

              {/* View Full Details Link */}
              <div className="text-center">
                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="text-xs font-semibold text-pink-800 dark:text-[#FF4D82] hover:underline"
                >
                  View full product specifications →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickViewModal;
