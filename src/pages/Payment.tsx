import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ChevronRight,
  Phone,
  User,
  MapPin,
  FileText,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartDiscount,
  selectCartAppliedCode,
  clearCart,
} from "@/redux/features/cart/cartSlice";
import { toast } from "sonner";

export const Payment: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const discount = useAppSelector(selectCartDiscount);
  const appliedCode = useAppSelector(selectCartAppliedCode);

  // Delivery details form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "Dhaka",
    address: "",
    orderNote: "",
  });

  const [deliveryArea, setDeliveryArea] = useState<"inside" | "outside">("inside");
  const [paymentMethod, setPaymentMethod] = useState<
    "cod" | "bkash" | "nagad" | "card" | "internet_banking"
  >("cod");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");

  const freeShippingThreshold = 2000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : deliveryArea === "inside" ? 60 : 120;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast.error("Please fill in your name, phone number, and delivery address.");
      return;
    }

    if (!agreeTerms) {
      toast.error("Please agree to our terms and conditions to proceed.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setIsSubmitting(true);
    const mockId = `KCB-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedOrderId(mockId);

    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSuccess(true);
      dispatch(clearCart());
      toast.success("Order Placed Successfully!", {
        description: `Order #${mockId} has been confirmed. SMS update sent to ${formData.phone}`,
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#090D14] py-8 sm:py-12 transition-colors duration-200 font-['Inter']">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/" className="hover:text-pink-800 dark:hover:text-[#FFE2FF] transition-colors">
            Home
          </Link>
          <ChevronRight size={13} />
          <Link to="/cart" className="hover:text-pink-800 dark:hover:text-[#FFE2FF] transition-colors">
            Cart
          </Link>
          <ChevronRight size={13} />
          <span className="text-gray-900 dark:text-white font-semibold">Checkout &amp; Payment</span>
        </nav>

        {/* Checkout Step Progress Bar */}
        <div className="mb-10 max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-xs font-semibold">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                ✓
              </span>
              <span className="text-gray-700 dark:text-gray-300 font-medium hidden sm:inline">1. Cart</span>
            </div>
            <div className="flex-1 h-0.5 mx-3 bg-[#FFE2FF] dark:bg-[#FFE2FF]/30" />

            {/* Step 2 (Active with #FFE2FF) */}
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#FFE2FF] text-[#500624] font-black flex items-center justify-center text-xs shadow-sm ring-4 ring-[#FFE2FF]/40">
                2
              </span>
              <span className="text-[#500624] dark:text-[#FFE2FF] font-bold">2. Payment</span>
            </div>
            <div className="flex-1 h-0.5 mx-3 bg-gray-200 dark:bg-gray-800" />

            {/* Step 3 */}
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center font-bold text-xs">
                3
              </span>
              <span className="text-gray-400 font-medium hidden sm:inline">3. Confirmation</span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Shipping Details & Payment Methods (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
              {/* SECTION A: Shipping Details */}
              <div className="bg-white dark:bg-[#111622] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-xs">
                <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-9 h-9 rounded-xl bg-[#FFE2FF] text-[#500624] flex items-center justify-center">
                    <Truck size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white">
                      Delivery Address
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Where should we deliver your authentic beauty package?
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5 flex items-center gap-1.5">
                      <User size={13} className="text-[#500624] dark:text-[#FFE2FF]" />
                      Full Recipient Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Farhana Akter"
                      className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#FFE2FF] focus:border-[#500624] outline-none transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5 flex items-center gap-1.5">
                      <Phone size={13} className="text-[#500624] dark:text-[#FFE2FF]" />
                      Phone Number (For Courier SMS) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="017XX-XXXXXX"
                      className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#FFE2FF] focus:border-[#500624] outline-none transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="farhana@example.com"
                      className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#FFE2FF] focus:border-[#500624] outline-none transition-colors"
                    />
                  </div>

                  {/* Delivery Zone / City */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">
                      Delivery Region <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryArea("inside");
                          setFormData((prev) => ({ ...prev, city: "Dhaka" }));
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          deliveryArea === "inside"
                            ? "bg-[#FFE2FF] border-[#500624] text-[#500624] shadow-xs"
                            : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300"
                        }`}
                      >
                        Inside Dhaka (৳60)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryArea("outside");
                          setFormData((prev) => ({ ...prev, city: "Outside Dhaka" }));
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          deliveryArea === "outside"
                            ? "bg-[#FFE2FF] border-[#500624] text-[#500624] shadow-xs"
                            : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300"
                        }`}
                      >
                        Outside Dhaka (৳120)
                      </button>
                    </div>
                  </div>

                  {/* City/District input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5">
                      City / District
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Dhanmondi, Dhaka"
                      className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#FFE2FF] focus:border-[#500624] outline-none transition-colors"
                    />
                  </div>

                  {/* Full Detailed Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5 flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#500624] dark:text-[#FFE2FF]" />
                      Full Street Address <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      required
                      rows={2}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="House / Flat No., Road No., Area details"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#FFE2FF] focus:border-[#500624] outline-none transition-colors"
                    />
                  </div>

                  {/* Order Note */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5 flex items-center gap-1.5">
                      <FileText size={13} className="text-gray-400" />
                      Order Note / Special Delivery Instructions
                    </label>
                    <input
                      type="text"
                      name="orderNote"
                      value={formData.orderNote}
                      onChange={handleInputChange}
                      placeholder="e.g. Call before delivery, deliver after 2 PM"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#FFE2FF] focus:border-[#500624] outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: Payment Method Selection */}
              <div className="bg-white dark:bg-[#111622] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-xs">
                <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-9 h-9 rounded-xl bg-[#FFE2FF] text-[#500624] flex items-center justify-center">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white">
                      Payment Method
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      All transactions are 256-bit encrypted and verified via SSLCOMMERZ
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Option 1: Cash On Delivery */}
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                      paymentMethod === "cod"
                        ? "border-[#500624] bg-[#FFE2FF]/30 dark:bg-[#FFE2FF]/10 shadow-xs"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                        paymentMethod === "cod"
                          ? "border-[#500624] bg-[#FFE2FF]"
                          : "border-gray-400"
                      }`}
                    >
                      {paymentMethod === "cod" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#500624]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          Cash On Delivery (COD)
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFE2FF] text-[#500624]">
                          Most Popular
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                        Pay cash directly to the courier rider upon delivery at your door.
                      </p>
                    </div>
                  </div>

                  {/* Option 2: bKash */}
                  <div
                    onClick={() => setPaymentMethod("bkash")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                      paymentMethod === "bkash"
                        ? "border-[#500624] bg-[#FFE2FF]/30 dark:bg-[#FFE2FF]/10 shadow-xs"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                        paymentMethod === "bkash"
                          ? "border-[#500624] bg-[#FFE2FF]"
                          : "border-gray-400"
                      }`}
                    >
                      {paymentMethod === "bkash" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#500624]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          bKash Instant Payment
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E2136E] text-white">
                          bKash
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                        Instant merchant payment via official bKash Payment Gateway.
                      </p>
                    </div>
                  </div>

                  {/* Option 3: Credit / Debit Cards */}
                  <div
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                      paymentMethod === "card"
                        ? "border-[#500624] bg-[#FFE2FF]/30 dark:bg-[#FFE2FF]/10 shadow-xs"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                        paymentMethod === "card"
                          ? "border-[#500624] bg-[#FFE2FF]"
                          : "border-gray-400"
                      }`}
                    >
                      {paymentMethod === "card" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#500624]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          Credit &amp; Debit Cards
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40">
                          Visa / MC / Amex
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                        Visa, Mastercard, UnionPay, American Express via SSLCOMMERZ.
                      </p>
                    </div>
                  </div>

                  {/* Option 4: Nagad / Rocket */}
                  <div
                    onClick={() => setPaymentMethod("nagad")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                      paymentMethod === "nagad"
                        ? "border-[#500624] bg-[#FFE2FF]/30 dark:bg-[#FFE2FF]/10 shadow-xs"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                        paymentMethod === "nagad"
                          ? "border-[#500624] bg-[#FFE2FF]"
                          : "border-gray-400"
                      }`}
                    >
                      {paymentMethod === "nagad" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#500624]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          Nagad / Rocket / Upay
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
                          Nagad
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                        Pay conveniently via your Nagad, Rocket, or Upay mobile wallet.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="flex items-start gap-2.5 pt-6 mt-4 border-t border-gray-100 dark:border-gray-800">
                  <input
                    type="checkbox"
                    id="checkout-agree"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-gray-300 text-[#500624] focus:ring-[#FFE2FF] cursor-pointer"
                  />
                  <label
                    htmlFor="checkout-agree"
                    className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none"
                  >
                    I have read and agree to SHOB Now's{" "}
                    <Link to="/terms" className="text-pink-800 dark:text-[#FFE2FF] underline font-semibold">
                      Terms &amp; Conditions
                    </Link>
                    ,{" "}
                    <Link to="/refund-policy" className="text-pink-800 dark:text-[#FFE2FF] underline font-semibold">
                      Refund Policy
                    </Link>
                    , and{" "}
                    <Link to="/privacy-policy" className="text-pink-800 dark:text-[#FFE2FF] underline font-semibold">
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-[#111622] rounded-3xl p-6 sm:p-7 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <h3 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white">
                  Order Summary
                </h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FFE2FF] text-[#500624]">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Items List Snapshot */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-gray-100 dark:divide-gray-800/60 no-scrollbar">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize}`}
                    className="pt-2 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-contain bg-gray-50 dark:bg-gray-800 shrink-0 border border-gray-100 dark:border-gray-700"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 dark:text-gray-200 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Qty: {item.quantity} {item.selectedSize ? `• ${item.selectedSize}` : ""}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white shrink-0">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2.5 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Discount ({appliedCode ? String(appliedCode) : "COUPON"})</span>
                    <span>-৳{discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Delivery ({deliveryArea === "inside" ? "Dhaka" : "Outside Dhaka"})</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {isFreeShipping ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span>
                    ) : (
                      `৳${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-800 text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  <span>Grand Total</span>
                  <span className="text-xl sm:text-2xl font-black text-[#500624] dark:text-[#FFE2FF]">
                    ৳{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Confirm & Place Order Button styled with #FFE2FF */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full py-4 px-6 rounded-2xl bg-[#FFE2FF] hover:bg-[#ffd1ff] text-[#500624] font-bold text-base shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98 border border-pink-200/50"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Confirm &amp; Place Order (৳{grandTotal.toLocaleString()})</span>
                  </>
                )}
              </button>

              {/* Security badges */}
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-emerald-500 shrink-0" />
                  <span>100% Certified Genuine Korean Beauty Products</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock size={15} className="text-[#500624] dark:text-[#FFE2FF] shrink-0" />
                  <span>PCI-DSS SSLCOMMERZ 256-bit Encrypted Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111622] rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-pink-100/80 dark:border-gray-800 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-[#FFE2FF] text-[#500624] flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle2 size={36} />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-[#500624] dark:text-[#FFE2FF] bg-[#FFE2FF]/50 dark:bg-[#FFE2FF]/20 px-3 py-1 rounded-full">
              Order Verified &amp; Confirmed
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold font-['Faustina'] text-gray-900 dark:text-white mt-3">
              Thank You for Your Order!
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
              We have received your order <strong>#{generatedOrderId}</strong>. A confirmation SMS with real-time parcel tracking has been sent to <strong>{formData.phone}</strong>.
            </p>

            <div className="my-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Invoice Number:</span>
                <span className="font-bold text-gray-900 dark:text-white">{generatedOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Option:</span>
                <span className="font-bold text-gray-900 dark:text-white uppercase">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Amount:</span>
                <span className="font-bold text-[#500624] dark:text-[#FFE2FF]">৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-[#FFE2FF] hover:bg-[#ffd1ff] text-[#500624] font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer border border-pink-200/50"
              >
                Return to Home
              </button>
              <button
                type="button"
                onClick={() => navigate("/shop")}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
