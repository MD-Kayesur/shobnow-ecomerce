import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import {
  selectCartItems,
  selectCartTotalCount,
  selectCartSubtotal,
  selectCartDiscount,
  selectCartAppliedCode,
  selectCartGrandTotal,
  removeFromCart,
  updateQuantity,
  clearCart,
  applyDiscountAmount,
  removeDiscount,
} from "@/redux/features/cart/cartSlice";
import { MOCK_PRODUCTS } from "@/data/shopData";
import ProductCard from "@/components/Reuseable/ProductCard";
import emptyCartImg from "@/assets/empty-cart.jpg";
import { useValidateCouponMutation } from "@/redux/features/storefront/storefrontApi";

export const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const items = useAppSelector(selectCartItems);
  const totalCount = useAppSelector(selectCartTotalCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const discount = useAppSelector(selectCartDiscount);
  const appliedCode = useAppSelector(selectCartAppliedCode);
  const grandTotal = useAppSelector(selectCartGrandTotal);
  const [validateCoupon, { isLoading: isValidatingCoupon }] = useValidateCouponMutation();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [shippingOption, setShippingOption] = useState<"inside" | "outside">("inside");

  // Free shipping over ৳2,500
  const freeShippingThreshold = 2500;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : shippingOption === "inside" ? 60 : 120;
  const finalOrderTotal = grandTotal + shippingFee;

  // Handle Coupon Apply
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    try {
      const result = await validateCoupon({ code, subtotal }).unwrap();
      dispatch(applyDiscountAmount({ code: result.data.code, amount: result.data.discountAmount }));
      setCouponSuccess(`Coupon ${result.data.code} applied. You save ৳${result.data.discountAmount.toLocaleString()}.`);
      setCouponError(null);
      setCouponCode("");
    } catch (error) {
      const message = (error as { data?: { message?: string | string[] } })?.data?.message;
      setCouponError(Array.isArray(message) ? message.join(" ") : message || "This coupon could not be applied.");
      setCouponSuccess(null);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeDiscount());
    setCouponSuccess(null);
    setCouponError(null);
  };

  // Recommended products when cart is empty or below items
  const recommendedProducts = MOCK_PRODUCTS.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#fdfbf9] dark:bg-[#090D14] text-gray-800 dark:text-gray-100 py-6 sm:py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/" className="hover:text-pink-800 dark:hover:text-[#FF4D82] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-pink-800 dark:hover:text-[#FF4D82] transition-colors">
            Shop
          </Link>
          <ChevronRight size={12} />
          <span className="font-semibold text-gray-800 dark:text-gray-200">Shopping Cart</span>
        </nav>

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {items.length > 0
                ? `You have ${totalCount} item${totalCount > 1 ? "s" : ""} in your bag`
                : "Your bag is currently empty"}
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={() => dispatch(clearCart())}
              className="text-xs sm:text-sm font-semibold text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Clear Entire Cart</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-[#111622] rounded-3xl p-8 sm:p-14 text-center shadow-xs border border-gray-100/70 dark:border-gray-800 mb-14">
            <div className="max-w-md mx-auto flex flex-col items-center">
              <div className="w-56 h-56 mb-6 overflow-hidden rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 p-2">
                <img
                  src={emptyCartImg}
                  alt="Empty Cart"
                  className="w-full h-full object-contain"
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Your Shopping Cart is Empty
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
                Looks like you haven't added any Korean skincare or beauty treats yet.
              </p>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FFE2FF] hover:bg-[#ffd1ff] text-[#500624] font-bold text-sm shadow-sm hover:shadow transition-all duration-200"
              >
                <ShoppingBag size={17} />
                <span>Explore Best Sellers</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Cart Items Table / List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Progress bar */}
              <div className="bg-white dark:bg-[#111622] rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-100/70 dark:border-gray-800">
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <span className="flex items-center gap-1.5 text-pink-800 dark:text-pink-400">
                    <Sparkles size={16} />
                    {isFreeShipping ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        🎉 You've unlocked FREE Delivery across Bangladesh!
                      </span>
                    ) : (
                      <span>
                        Add <strong>৳{(freeShippingThreshold - subtotal).toLocaleString()}</strong> more to get <strong>FREE shipping</strong>!
                      </span>
                    )}
                  </span>
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
                    {Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-800 to-[#FF4D82] rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white dark:bg-[#111622] rounded-2xl shadow-xs border border-gray-100/70 dark:border-gray-800 overflow-hidden">
                {/* Header Row (Desktop) */}
                <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 bg-gray-50/80 dark:bg-gray-800/60 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.selectedSize || "default"}`}
                      className="p-4 sm:px-6 sm:py-5 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center bg-white dark:bg-[#111622] rounded-2xl sm:rounded-none border border-gray-100 dark:border-gray-800 sm:border-0 shadow-xs sm:shadow-none mb-3 sm:mb-0"
                    >
                      {/* Product Info (6 cols) */}
                      <div className="w-full sm:col-span-6 flex items-center gap-4">
                        <Link
                          to={`/product/${item.slug}`}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-50 dark:bg-gray-800 p-1.5 shrink-0 border border-gray-100 dark:border-gray-700 flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          {item.brand && (
                            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 block mb-0.5">
                              {item.brand}
                            </span>
                          )}
                          <Link
                            to={`/product/${item.slug}`}
                            className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100 hover:text-pink-800 dark:hover:text-[#FF4D82] transition-colors line-clamp-2 leading-snug"
                          >
                            {item.name}
                          </Link>

                          {item.selectedSize && (
                            <span className="inline-block mt-1 text-[11px] text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded font-medium">
                              Variant: {item.selectedSize}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                removeFromCart({
                                  id: item.id,
                                  selectedSize: item.selectedSize,
                                })
                              )
                            }
                            className="mt-2 text-xs text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1 font-medium cursor-pointer sm:hidden"
                          >
                            <Trash2 size={13} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Price (2 cols) */}
                      <div className="w-full sm:w-auto sm:col-span-2 flex justify-between sm:justify-center items-center">
                        <span className="sm:hidden text-xs text-gray-400">Unit Price:</span>
                        <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                          ৳{item.price.toLocaleString()}
                        </span>
                      </div>

                      {/* Quantity Stepper (2 cols) */}
                      <div className="w-full sm:w-auto sm:col-span-2 flex justify-between sm:justify-center items-center">
                        <span className="sm:hidden text-xs text-gray-400">Quantity:</span>
                        <div className="flex items-center rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-2xs border border-transparent dark:border-gray-700">
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  id: item.id,
                                  selectedSize: item.selectedSize,
                                  quantity: item.quantity - 1,
                                })
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-9 text-center text-xs font-bold text-gray-800 dark:text-gray-100 select-none">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  id: item.id,
                                  selectedSize: item.selectedSize,
                                  quantity: item.quantity + 1,
                                })
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Total & Remove (2 cols) */}
                      <div className="w-full sm:w-auto sm:col-span-2 flex justify-between sm:justify-end items-center gap-3">
                        <span className="sm:hidden text-xs text-gray-400">Subtotal:</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                removeFromCart({
                                  id: item.id,
                                  selectedSize: item.selectedSize,
                                })
                              )
                            }
                            title="Remove item"
                            className="hidden sm:inline-flex p-1.5 text-gray-300 dark:text-gray-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Row Actions */}
                <div className="p-4 sm:p-5 bg-gray-50/70 dark:bg-[#0E131F] border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-pink-800 dark:text-pink-400 hover:text-pink-900 dark:hover:text-pink-300 transition-colors"
                  >
                    <span>← Continue Shopping</span>
                  </Link>

                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {totalCount} item{totalCount > 1 ? "s" : ""} selected
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Order Summary Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white dark:bg-[#111622] rounded-2xl p-5 sm:p-6 shadow-xs border border-gray-100/70 dark:border-gray-800 space-y-5">
                <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
                  Order Summary
                </h2>

                {/* Subtotal & Discount rows */}
                <div className="space-y-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      ৳{subtotal.toLocaleString()}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <Tag size={13} />
                        Discount ({appliedCode})
                      </span>
                      <span>-৳{discount.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Shipping selector */}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Delivery Area</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {isFreeShipping ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span>
                        ) : (
                          `৳${shippingFee}`
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setShippingOption("inside")}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          shippingOption === "inside"
                            ? "border-[#500624] bg-[#FFE2FF] text-[#500624] font-bold shadow-xs"
                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <div>Inside Dhaka</div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500">
                          {isFreeShipping ? "Free" : "৳60"}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShippingOption("outside")}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          shippingOption === "outside"
                            ? "border-[#500624] bg-[#FFE2FF] text-[#500624] font-bold shadow-xs"
                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <div>Outside Dhaka</div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500">
                          {isFreeShipping ? "Free" : "৳120"}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="flex items-center justify-between text-base sm:text-lg font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-100 dark:border-gray-800">
                    <span>Grand Total</span>
                    <span className="text-pink-800 dark:text-[#FF4D82] text-xl sm:text-2xl font-black">
                      ৳{finalOrderTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Coupon Form */}
                <div className="pt-2">
                  {appliedCode ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                        <span>Code {appliedCode} applied</span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs text-rose-500 hover:text-rose-700 underline font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-pink-800 dark:focus:border-pink-500 focus:ring-1 focus:ring-pink-800 outline-none uppercase"
                        />
                        <button
                          type="submit"
                          disabled={isValidatingCoupon || !couponCode.trim()}
                          className="px-4 py-2 rounded-xl bg-[#FFE2FF] hover:bg-[#ffd1ff] text-[#500624] text-xs font-bold transition-colors cursor-pointer border border-[#f3c8f3] dark:border-transparent"
                        >
                          {isValidatingCoupon ? "Checking..." : "Apply"}
                        </button>
                      </div>

                      {couponError && (
                        <p className="text-[11px] text-rose-500 font-medium">
                          {couponError}
                        </p>
                      )}
                      {couponSuccess && (
                        <p className="text-[11px] text-emerald-600 font-medium">
                          {couponSuccess}
                        </p>
                      )}
                    </form>
                  )}
                </div>

                {/* Checkout CTA */}
                <button
                  type="button"
                  onClick={() => navigate("/payment")}
                  className="w-full py-3.5 rounded-xl bg-[#FFE2FF] hover:bg-[#ffd1ff] text-[#500624] font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={18} />
                </button>

                {/* Trust Badges */}
                <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={15} className="text-emerald-500 shrink-0" />
                    <span>100% Authentic Korean Products Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck size={15} className="text-pink-800 dark:text-pink-400 shrink-0" />
                    <span>Fast Delivery (2-3 days Dhaka, 3-5 days outside)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw size={15} className="text-amber-500 shrink-0" />
                    <span>Easy 7-day hassle-free exchange policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* You May Also Like / Recommended Section */}
        <section className="mt-14 sm:mt-18 pt-10 border-t border-gray-200/80 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-pink-800 dark:text-pink-400">
                Curated For You
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white">
                You May Also Like
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs sm:text-sm font-semibold text-pink-800 dark:text-pink-400 hover:underline"
            >
              View All Products →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {recommendedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Cart;
