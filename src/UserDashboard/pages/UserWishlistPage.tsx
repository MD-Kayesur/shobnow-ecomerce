// src/pages/Client/UserWishlistPage.tsx
import { useState } from "react";
import { Heart, ShoppingBag, Trash2, Share2, Star, Check, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export interface WishlistItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  inStock: boolean;
  stockNote?: string;
  image: string;
  slug: string;
}

const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: "wish-01",
    name: "Advanced Snail 96 Mucin Power Essence",
    brand: "COSRX",
    category: "Skin Care",
    price: 1650,
    originalPrice: 2200,
    discountPercent: 25,
    rating: 4.9,
    inStock: true,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80",
    slug: "cosrx-advanced-snail-96-mucin-essence",
  },
  {
    id: "wish-02",
    name: "Relief Sun: Rice + Probiotics SPF50+ PA++++",
    brand: "Beauty of Joseon",
    category: "Skin Care",
    price: 1450,
    originalPrice: 1950,
    discountPercent: 26,
    rating: 4.8,
    inStock: true,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80",
    slug: "beauty-of-joseon-relief-sun-rice-probiotics",
  },
  {
    id: "wish-03",
    name: "Heartleaf 77% Soothing Toner",
    brand: "Anua",
    category: "Skin Care",
    price: 1850,
    originalPrice: 2300,
    discountPercent: 20,
    rating: 4.9,
    inStock: true,
    stockNote: "Only 3 left in stock",
    image: "https://images.unsplash.com/photo-1608248597359-598466e3b5e4?auto=format&fit=crop&w=400&q=80",
    slug: "anua-heartleaf-77-soothing-toner",
  },
  {
    id: "wish-04",
    name: "Madagascar Centella Ampoule 100ml",
    brand: "SKIN1004",
    category: "Skin Care",
    price: 1750,
    originalPrice: 2100,
    discountPercent: 17,
    rating: 4.7,
    inStock: true,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80",
    slug: "skin1004-madagascar-centella-ampoule",
  },
  {
    id: "wish-05",
    name: "Zero Pore Pad 2.0 (70 Sheets)",
    brand: "Medicube",
    category: "Personal Care",
    price: 2100,
    originalPrice: 2600,
    discountPercent: 19,
    rating: 4.8,
    inStock: true,
    image: "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?auto=format&fit=crop&w=400&q=80",
    slug: "medicube-zero-pore-pad-2-0",
  },
  {
    id: "wish-06",
    name: "Water Sleeping Mask EX Lavender Edition",
    brand: "Laneige",
    category: "Skin Care",
    price: 2400,
    originalPrice: 2900,
    discountPercent: 17,
    rating: 4.9,
    inStock: false,
    stockNote: "Restocking soon",
    image: "https://images.unsplash.com/photo-1567928815104-b7980ee070b6?auto=format&fit=crop&w=400&q=80",
    slug: "laneige-water-sleeping-mask-ex",
  },
];

const UserWishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(INITIAL_WISHLIST);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const handleRemove = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddToCart = (_id: string, name: string) => {
    setAddedItem(name);
    setTimeout(() => setAddedItem(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            My Saved Wishlist
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Curated products you love. Get alerted on price drops and flash sales.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Wishlist shareable link copied to clipboard!")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-primary transition-all cursor-pointer shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share List</span>
          </button>
          {wishlist.length > 0 && (
            <button
              onClick={() => {
                setAddedItem("All in-stock items added to cart!");
                setTimeout(() => setAddedItem(null), 3000);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-dark transition-all cursor-pointer shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add All to Cart</span>
            </button>
          )}
        </div>
      </div>

      {/* Cart Toast Notification */}
      {addedItem && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Added to shopping bag: {addedItem}</span>
          </div>
          <Link to="/cart" className="underline font-extrabold text-emerald-900 dark:text-emerald-200">
            View Bag →
          </Link>
        </div>
      )}

      {/* Wishlist Grid */}
      {wishlist.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
          <Heart className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your wishlist is empty</h3>
          <p className="text-xs text-gray-500">Explore authentic Korean & global skincare to save items here.</p>
          <Link
            to="/shop"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="group bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                {/* Product Image + Badges */}
                <div className="relative aspect-square w-full bg-gray-50 dark:bg-gray-800/40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.discountPercent > 0 && (
                    <span className="absolute top-3 left-3 bg-[#f05580] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-xs">
                      {item.discountPercent}% OFF
                    </span>
                  )}
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/90 text-gray-400 hover:text-rose-600 hover:scale-110 flex items-center justify-center shadow-xs transition-all cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="font-semibold text-primary">{item.brand}</span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {item.rating}
                    </span>
                  </div>

                  <Link to={`/product/${item.slug}`}>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-primary transition-colors leading-snug">
                      {item.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-extrabold text-gray-900 dark:text-white">
                      ৳{item.price.toLocaleString()}
                    </span>
                    {item.originalPrice > item.price && (
                      <span className="text-xs text-gray-400 line-through">
                        ৳{item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {item.stockNote && (
                    <p className={`text-[11px] font-semibold flex items-center gap-1 ${item.inStock ? "text-amber-600" : "text-rose-500"}`}>
                      <AlertCircle className="w-3 h-3" /> {item.stockNote}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <button
                  disabled={!item.inStock}
                  onClick={() => handleAddToCart(item.id, item.name)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    item.inStock
                      ? "bg-primary text-white hover:bg-primary-dark shadow-xs"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{item.inStock ? "Add to Cart" : "Out of Stock"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserWishlistPage;
