import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import {
  selectCartItems,
  selectIsCartOpen,
  selectCartTotalCount,
  selectCartSubtotal,
  selectCartDiscount,
  selectCartGrandTotal,
  closeCartDrawer,
  removeFromCart,
  updateQuantity,
} from "@/redux/features/cart/cartSlice";
import emptyCartImg from "@/assets/empty-cart.jpg";

export const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isOpen = useAppSelector(selectIsCartOpen);
  const items = useAppSelector(selectCartItems);
  const totalCount = useAppSelector(selectCartTotalCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const discount = useAppSelector(selectCartDiscount);
  const grandTotal = useAppSelector(selectCartGrandTotal);

  // Free shipping threshold: ৳2,500
  const freeShippingThreshold = 2500;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        dispatch(closeCartDrawer());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, dispatch]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    dispatch(closeCartDrawer());
  };

  const handleNavigateToCart = () => {
    handleClose();
    navigate("/cart");
  };

  const handleNavigateToCheckout = () => {
    handleClose();
    navigate("/payment");
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={handleClose}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Cart Drawer Panel */}
      <aside
        role="dialog"
        aria-label="Shopping Cart Drawer"
        aria-modal="true"
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] max-w-full bg-white dark:bg-[#0E131F] text-gray-900 dark:text-gray-100 shadow-2xl flex flex-col border-l border-transparent dark:border-gray-800 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-pink-800 dark:text-[#FF4D82]" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight font-serif">
              Shopping Bag ({totalCount})
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close cart"
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-300 hover:text-pink-800 dark:hover:text-white hover:bg-pink-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Free Shipping Banner */}
        {items.length > 0 && (
          <div className="bg-pink-50/70 dark:bg-pink-950/30 px-5 py-2.5 border-b border-pink-100 dark:border-pink-900/40 shrink-0">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              <span className="flex items-center gap-1 text-pink-800 dark:text-pink-400">
                <Sparkles size={13} />
                {remainingForFreeShipping === 0 ? (
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Congratulations! You have FREE delivery!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-gray-900 dark:text-white">৳{remainingForFreeShipping.toLocaleString()}</strong> more for FREE shipping
                  </span>
                )}
              </span>
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-800 to-[#FF4D82] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items List or Empty State */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-gray-100 dark:divide-gray-800">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10 px-4">
              <div className="w-48 h-48 mb-4 overflow-hidden rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 p-2">
                <img
                  src={emptyCartImg}
                  alt="Empty Shopping Bag"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Your shopping bag is empty
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mb-6">
                Discover our curated Korean skincare, makeup, and beauty collections.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-full bg-[#FFE2FF] hover:bg-[#ffd1ff] text-[#500624] text-sm font-bold transition-all duration-200 shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Start Shopping</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize || "default"}`}
                className="py-3.5 first:pt-0 last:pb-0 p-3 sm:p-0 bg-neutral-50/70 dark:bg-[#141B2B] sm:bg-transparent sm:dark:bg-transparent rounded-2xl sm:rounded-none border border-gray-100 dark:border-gray-800 sm:border-0 mb-3 sm:mb-0 flex gap-3.5 items-start group shadow-2xs sm:shadow-none"
              >
                {/* Thumbnail */}
                <Link
                  to={`/product/${item.slug}`}
                  onClick={handleClose}
                  className="w-20 h-20 rounded-xl bg-[#faf9f8] dark:bg-gray-800 p-1 shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-700 hover:opacity-90 transition-opacity"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  {item.brand && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500">
                      {item.brand}
                    </span>
                  )}
                  <Link
                    to={`/product/${item.slug}`}
                    onClick={handleClose}
                    className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-pink-800 dark:hover:text-[#FF4D82] transition-colors line-clamp-2 leading-snug"
                  >
                    {item.name}
                  </Link>

                  {item.selectedSize && (
                    <span className="inline-block mt-0.5 text-[11px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.2 rounded font-medium">
                      {item.selectedSize}
                    </span>
                  )}

                  {/* Pricing and Stepper */}
                  <div className="flex items-center justify-between mt-2">
                    {/* Stepper */}
                    <div className="flex items-center rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-2xs border border-transparent dark:border-gray-700">
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
                        className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-gray-800 dark:text-gray-100 select-none">
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
                        className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
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
                        className="p-1 text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer (Summary & CTAs) */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 dark:border-gray-800 p-4 sm:p-5 bg-white dark:bg-[#0E131F] shrink-0 shadow-xs space-y-3">
            {/* Totals */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span className="font-semibold">-৳{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm sm:text-base font-bold text-gray-900 dark:text-white pt-1.5 border-t border-gray-100 dark:border-gray-800">
                <span>Grand Total</span>
                <span className="text-pink-800 dark:text-[#FF4D82]">
                  ৳{grandTotal.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                Taxes and shipping calculated at checkout.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleNavigateToCart}
                className="flex-1 h-11 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center"
              >
                View My Cart
              </button>
              <button
                type="button"
                onClick={handleNavigateToCheckout}
                className="flex-1 h-11 rounded-xl bg-[#FFE2FF] hover:bg-[#ffd1ff] text-[#500624] text-xs sm:text-sm font-bold shadow-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Checkout</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Authenticity Guarantee */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 pt-1">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>100% Authentic Korean Products Guarantee</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
