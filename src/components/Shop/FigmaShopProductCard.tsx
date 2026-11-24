import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/data/shopData";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import { addToCart } from "@/redux/features/cart/cartSlice";
import { toast } from "sonner";

export interface FigmaShopProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const FigmaShopProductCard: React.FC<FigmaShopProductCardProps> = ({
  product,
  onQuickView,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) {
      toast.error("This item is currently out of stock");
      return;
    }
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
      })
    );
    toast.success(`Added ${product.name} to cart!`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  const discountPercent = product.discountPercent || 10;

  return (
    <div className="group relative w-full bg-[#FDFDFD] dark:bg-[#111622] rounded-[16px] overflow-hidden border border-[#F6E7ED] dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md transition-all duration-300 flex flex-col justify-between select-none">
      {/* 1. Image Container (Figma: width 242, height 250) */}
      <div className="relative w-full h-[220px] sm:h-[250px] overflow-hidden bg-[#F7F8FA] dark:bg-gray-800/50">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Top Floating Badges (Figma: left: 12, top: 12, width: 218) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          {/* Discount Badge (Figma: background: #9F7CF0, borderRadius: 20, text: -10%) */}
          <span className="px-2 py-0.5 rounded-full bg-[#9F7CF0] text-white text-[11px] sm:text-[12px] font-inter font-semibold tracking-tight shadow-xs">
            -{discountPercent}%
          </span>

          {/* Wishlist Button (Figma: background: rgba(0, 0, 0, 0.20), borderRadius: 40) */}
          <button
            type="button"
            onClick={handleWishlistClick}
            className={`pointer-events-auto w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs ${
              isWishlisted
                ? "bg-[#A20E4C] text-white shadow-xs"
                : "bg-black/25 hover:bg-black/40 text-white"
            }`}
            aria-label="Add to wishlist"
          >
            <Heart
              size={14}
              className={isWishlisted ? "fill-white" : "stroke-white"}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 hover:text-[#A20E4C] dark:hover:text-[#FF4D82] hover:bg-white dark:hover:bg-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xs cursor-pointer z-10"
            title="Quick view"
          >
            <Eye size={15} />
          </button>
        )}
      </div>

      {/* 2. Product Details */}
      <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1 gap-2.5">
        <div>
          {/* Product Name */}
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-base sm:text-[18px] font-faustina font-semibold text-black dark:text-white group-hover:text-[#A20E4C] dark:group-hover:text-[#FF4D82] transition-colors leading-[21.6px] line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="text-sm sm:text-[16px] font-faustina font-semibold text-black dark:text-gray-100 mt-1 leading-[19.2px]">
            ৳{product.price.toLocaleString()}
          </div>

          {/* Stock Status Badge */}
          <div className="flex items-center gap-2 mt-1.5 text-[12px] sm:text-[13px] font-inter font-normal text-[#80899C] dark:text-gray-400 leading-[19.5px]">
            <span>{product.inStock ? "In-Stock" : "Out of Stock"}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9D9D9] dark:bg-gray-600" />
            <span>12 Sold</span>
          </div>
        </div>

        {/* Shop Now Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full py-2 px-3.5 rounded-[8px] bg-[#FFE2FF] hover:bg-[#ffd1ff] text-[#500624] text-xs sm:text-[14px] font-inter font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer leading-[18.2px] shadow-2xs"
        >
          <ShoppingBag size={14} />
          <span>Shop Now</span>
        </button>
      </div>
    </div>
  );
};

export default FigmaShopProductCard;
