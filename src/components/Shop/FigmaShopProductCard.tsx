import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { Product } from "@/data/shopData";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import { addToCart } from "@/redux/features/cart/cartSlice";
import { toast } from "sonner";

export interface FigmaShopProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
  viewMode?: "grid" | "list";
}

export const FigmaShopProductCard: React.FC<FigmaShopProductCardProps> = ({
  product,
  onQuickView,
  isWishlisted = false,
  onToggleWishlist,
  viewMode = "grid",
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [imageFailed, setImageFailed] = useState(false);
  const productUrl = `/product/${product.slug}`;

  const handleCardClick = (event: React.MouseEvent<HTMLElement>) => {
    // Let the wishlist, quick-view, cart and explicit product links keep their own actions.
    if ((event.target as HTMLElement).closest("a, button")) return;
    navigate(productUrl);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigate(productUrl);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) {
      toast.error("This item is currently out of stock");
      return;
    }
    dispatch(addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      brand: product.brand,
      category: product.category,
      selectedSize: product.volume || (product.sizes && product.sizes[0]),
    }));
    toast.success(`Added ${product.name} to cart!`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist?.(product);
  };

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`View ${product.name}`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className={`group relative w-full cursor-pointer overflow-hidden rounded-2xl border border-[#F3E5EC] bg-white transition-[transform,border-color,box-shadow] duration-200 hover:z-20 hover:scale-[1.02] hover:border-[#E72C7E] hover:shadow-[0_10px_26px_rgba(231,44,126,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E72C7E]/50 dark:border-gray-800 dark:bg-[#111622] dark:hover:border-[#E72C7E] ${viewMode === "list" ? "flex flex-row items-stretch" : "flex flex-col"}`}
    >
      <div className={`relative overflow-hidden bg-[#FFF5F8] dark:bg-gray-800/50 ${viewMode === "list" ? "aspect-square w-32 shrink-0 sm:w-48" : "aspect-[1.62/1] w-full"}`}>
        <Link to={`/product/${product.slug}`} className="block h-full w-full">
          {product.image && !imageFailed ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover object-center" loading="lazy" onError={() => setImageFailed(true)} />
          ) : <div className="grid h-full place-items-center text-sm text-slate-400">No product image</div>}
        </Link>

        <div className="pointer-events-none absolute inset-x-2.5 top-2.5 z-10 flex items-center justify-between">
          {product.discountPercent ? <span className="rounded-full bg-[#9F7CF0] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">-{product.discountPercent}%</span> : <span />}
          <button type="button" onClick={handleWishlistClick} aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"} className={`pointer-events-auto grid h-7 w-7 place-items-center rounded-full backdrop-blur-sm transition ${isWishlisted ? "bg-[#E72C7E] text-white" : "bg-white/90 text-slate-600 hover:text-[#E72C7E]"}`}>
            <Heart size={14} className={isWishlisted ? "fill-current" : ""} />
          </button>
        </div>

        {onQuickView && <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); onQuickView(product); }} className="absolute bottom-2.5 right-2.5 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-gray-700 opacity-0 shadow-sm transition group-hover:opacity-100" title="Quick view"><Eye size={15} /></button>}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
        <div>
          <Link to={`/product/${product.slug}`}>
            <h3 className="line-clamp-2 min-h-10 text-[13px] font-semibold leading-5 text-[#17213B] transition-colors group-hover:text-[#B11057] dark:text-white dark:group-hover:text-pink-300 sm:text-sm">{product.name}</h3>
          </Link>

          <div className="mt-1 flex flex-wrap items-center gap-1 text-[10px] leading-4 text-slate-500">
            <span className="inline-flex items-center gap-px text-amber-400" aria-label={`${product.rating.toFixed(1)} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, i) => <Star key={i} size={10} className={i < Math.round(product.rating) ? "fill-current" : "fill-none text-slate-300"} />)}
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{product.rating.toFixed(1)}</span>
            <span>({product.reviewsCount.toLocaleString()} reviews)</span>
          </div>

          <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-sm font-bold leading-5 text-[#B11057] dark:text-pink-300 sm:text-base">৳{product.price.toLocaleString()}</span>
            {product.originalPrice && <span className="text-[10px] text-slate-400 line-through">৳{product.originalPrice.toLocaleString()}</span>}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-medium leading-4">
            <span className={product.inStock ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}>{product.inStock ? "In stock" : "Out of stock"}</span>
            {product.inStock && product.stockQuantity > 0 && product.stockQuantity <= 5 && <span className="text-amber-600">· Only {product.stockQuantity} left</span>}
          </div>
        </div>

        <button type="button" onClick={handleAddToCart} disabled={!product.inStock} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[9px] border border-[#E72C7E] bg-[#E72C7E] px-2 py-2 text-xs font-bold leading-4 text-white shadow-sm transition-colors hover:border-[#C91664] hover:bg-[#C91664] disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:text-white disabled:opacity-80 dark:border-[#E72C7E] dark:bg-[#E72C7E] dark:text-white dark:hover:border-[#C91664] dark:hover:bg-[#C91664]">
          <ShoppingCart size={13} /><span>{product.inStock ? "Add to Cart" : "Out of Stock"}</span>
        </button>
      </div>
    </article>
  );
};

export default FigmaShopProductCard;
