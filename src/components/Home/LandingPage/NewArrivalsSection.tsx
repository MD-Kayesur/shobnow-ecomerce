import React from "react";
import { Link } from "react-router-dom";
import { Eye, ShoppingBag } from "lucide-react";
import { MOCK_PRODUCTS, Product } from "@/data/shopData";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import { addToCart } from "@/redux/features/cart/cartSlice";
import { toast } from "sonner";
import { useGetStoreProductsQuery, mapStoreProductToUi } from "@/redux/features/storefront/storefrontApi";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

// Exact Figma Product Card Specification
export const FigmaProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
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

  return (
    <div className="group w-full max-w-[258px] bg-[#FDFDFD] dark:bg-[#111622] rounded-[16px] overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg transition-all duration-300 flex flex-col justify-between mx-auto">
      {/* Product Image Container (Figma: width: 258, height: 250) */}
      <div className="relative w-full h-48 sm:h-56 md:h-[250px] overflow-hidden bg-[#F7F8FA] dark:bg-gray-800/50">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 hover:text-[#A20E4C] dark:hover:text-[#FF4D82] hover:bg-white dark:hover:bg-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xs cursor-pointer"
            title="Quick view"
          >
            <Eye size={15} />
          </button>
        )}
      </div>

      {/* Product Details (Figma: padding: 8, gap: 12) */}
      <div className="p-3 flex flex-col justify-between flex-1 gap-2.5">
        <div>
          {/* Product Name */}
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-base sm:text-lg font-faustina font-semibold text-black dark:text-white group-hover:text-[#A20E4C] dark:group-hover:text-[#FF4D82] transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="text-sm sm:text-base font-faustina font-semibold text-black dark:text-gray-100 mt-1">
            ৳{product.price.toLocaleString()}
          </div>

          {/* Stock Status Badge */}
          <div className="flex items-center gap-2 mt-1.5 text-[12px] sm:text-[13px] font-inter text-[#80899C] dark:text-gray-400">
            <span>{product.inStock ? "In-Stock" : "Out of Stock"}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9D9D9] dark:bg-gray-600" />
            <span>12 Sold</span>
          </div>
        </div>

        {/* Shop Now Button */}
        <button
          onClick={handleAddToCart}
          className="w-full py-2 px-3.5 rounded-[8px] bg-[#FFE2FF] hover:bg-[#ffd1ff] text-[#500624] text-xs sm:text-sm font-inter font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <ShoppingBag size={14} />
          <span>Shop Now</span>
        </button>
      </div>
    </div>
  );
};

export const NewArrivalsSection: React.FC<{
  onQuickView?: (product: Product) => void;
}> = ({ onQuickView }) => {
  const { data } = useGetStoreProductsQuery({ page: 1, limit: 10, sort: "newest" });
  const apiProducts = data?.data?.map(mapStoreProductToUi) || [];
  const newArrivals = apiProducts.length ? apiProducts : MOCK_PRODUCTS.slice(0, 10);

  return (
    <section className="w-full bg-white dark:bg-[#090D14] py-16 sm:py-20 md:py-24 transition-colors duration-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        {/* Section Heading */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-[42px] font-faustina font-bold text-black dark:text-white tracking-tight leading-tight">
            New Arrival
          </h2>
        </div>

        {/* 5-Column x 2-Row Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-10 sm:mb-12">
          {newArrivals.map((product) => (
            <FigmaProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* See all Button */}
        <div className="text-center">
          <Link
            to="/shop?sort=newest"
            className="inline-flex items-center justify-center h-10 px-6 sm:px-8 rounded-[8px] bg-[#FFE2FF] hover:bg-[#ffd1ff] text-[#500624] font-inter font-bold text-sm sm:text-base transition-all duration-200 shadow-2xs"
          >
            See all
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;
