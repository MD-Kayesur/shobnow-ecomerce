import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Building2,
  Check,
  CreditCard,
  Lock,
  ChevronRight,
  Map,
  Phone,
  RotateCcw,
  ShoppingBag,
  ShoppingCart,
  Truck,
  User,
  MapPin,
  FileText,
  Tag,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import {
  selectCartItems,
  selectCartDiscount,
  selectCartAppliedCode,
  clearCart,
  applyDiscountAmount,
  removeDiscount,
} from "@/redux/features/cart/cartSlice";
import type { CartItem } from "@/redux/features/cart/cartSlice";
import { toast } from "sonner";
import { SavedAddress, useCreateOrderMutation, useGetDeliveryConfigQuery, useGetSavedAddressesQuery, useSaveSavedAddressMutation, useValidateCouponMutation } from "@/redux/features/storefront/storefrontApi";
import checkoutBeautyCluster from "@/assets/banners/checkout-beauty-cluster.png";
import orderConfirmationIllustration from "@/assets/orders/order-confirmation-illustration.png";

const apiOrigin = (import.meta.env.VITE_API_ENDPOINT || "http://localhost:4101/api/v1").replace(/\/api\/v\d+\/?$/, "");
const imageSource = (source: string) => !source ? "" : /^(https?:|data:|blob:)/i.test(source) ? source : source.startsWith("/uploads/") ? `${apiOrigin}${source}` : source;
const formatTaka = (value: number | string) => `\u09F3 ${Number(value || 0).toLocaleString("en-BD", { maximumFractionDigits: 2 })}`;

export const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const checkoutState = location.state as { buyNowItem?: CartItem; deliveryArea?: "inside" | "outside" } | null;
  const buyNowItem = checkoutState?.buyNowItem;
  const cartItems = useAppSelector(selectCartItems);
  const checkoutItems = buyNowItem ? [buyNowItem] : cartItems;
  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartDiscount = useAppSelector(selectCartDiscount);
  const cartAppliedCode = useAppSelector(selectCartAppliedCode);
  const [buyNowDiscount, setBuyNowDiscount] = useState(0);
  const [buyNowCouponCode, setBuyNowCouponCode] = useState<string>();
  const discount = buyNowItem ? buyNowDiscount : cartDiscount;
  const appliedCode = buyNowItem ? buyNowCouponCode : cartAppliedCode;
  const user = useAppSelector((state) => state.auth.user);
  const { data: deliveryResponse } = useGetDeliveryConfigQuery();
  const [createOrder] = useCreateOrderMutation();
  const { data: savedAddressResponse, isLoading: isLoadingSavedAddresses } = useGetSavedAddressesQuery(undefined, { skip: !user });
  const [saveSavedAddress] = useSaveSavedAddressMutation();
  const [validateCoupon, { isLoading: isValidatingCoupon }] = useValidateCouponMutation();
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("new");
  const [saveAddress, setSaveAddress] = useState(true);
  const legacyMigrationDone = useRef(false);
  const [paymentChoice, setPaymentChoice] = useState<"cod" | "wallet" | "phone">("cod");
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  // Delivery details form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "Dhaka",
    address: "",
    orderNote: "",
  });

  const [deliveryArea, setDeliveryArea] = useState<"inside" | "outside">(() => {
    if (checkoutState?.deliveryArea) return checkoutState.deliveryArea;
    return localStorage.getItem("shopnow_delivery_area") === "outside" ? "outside" : "inside";
  });
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");
  const [generatedOrderTotal, setGeneratedOrderTotal] = useState(0);
  const [generatedOrderName, setGeneratedOrderName] = useState("");
  const [generatedOrderPhone, setGeneratedOrderPhone] = useState("");

  useEffect(() => {
    if (!user) return;
    setFormData((previous) => ({ ...previous, fullName: previous.fullName || user.name, phone: previous.phone || user.phone || "", email: previous.email || user.email }));
  }, [user]);

  useEffect(() => {
    setSavedAddresses([]);
    setSelectedAddress("new");
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      setSavedAddresses([]);
      setSelectedAddress("new");
      return;
    }
    if (isLoadingSavedAddresses) return;
    const addresses = savedAddressResponse?.data ?? [];
    if (addresses.length) {
      setSavedAddresses(addresses);
      const defaultIndex = Math.max(0, addresses.findIndex((address) => address.isDefault));
      const primary = addresses[defaultIndex];
      setSelectedAddress(String(defaultIndex));
      setFormData((previous) => ({ ...previous, address: primary.addressLine, city: primary.city, fullName: primary.recipientName || previous.fullName, phone: primary.recipientPhone || previous.phone }));
      if (checkoutState?.deliveryArea === undefined) setDeliveryArea(primary.deliveryArea);
      return;
    }
    setSavedAddresses([]);
    setSelectedAddress("new");
    if (legacyMigrationDone.current) return;
    legacyMigrationDone.current = true;
    try {
      const legacy = JSON.parse(localStorage.getItem(`shopnow_addresses_${user.id}`) || "[]") as Array<{ label?: string; address?: string; city?: string; area?: string }>;
      if (!legacy.length) return;
      void Promise.all(legacy.filter((entry) => entry.address && entry.city).map((entry, index) => saveSavedAddress({
        label: entry.label || "Home", addressLine: entry.address!, city: entry.city!, deliveryArea: entry.area === "outside" ? "outside" : "inside", isDefault: index === 0,
      }).unwrap())).then(() => localStorage.removeItem(`shopnow_addresses_${user.id}`)).catch(() => undefined);
    } catch { /* Ignore malformed legacy browser data. */ }
  }, [user, isLoadingSavedAddresses, savedAddressResponse, saveSavedAddress, checkoutState?.deliveryArea]);

  const freeShippingThreshold = deliveryResponse?.data.freeDeliveryThreshold ?? 1000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : deliveryResponse?.data.deliveryFees[deliveryArea] ?? (deliveryArea === "inside" ? 60 : 120);
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  useEffect(() => {
    if (!appliedCode || subtotal <= 0) return;
    void validateCoupon({ code: appliedCode, subtotal }).unwrap().then((result) => {
      if (buyNowItem) setBuyNowDiscount(result.data.discountAmount);
      else dispatch(applyDiscountAmount({ code: result.data.code, amount: result.data.discountAmount }));
    }).catch(() => {
      if (buyNowItem) setBuyNowDiscount(0);
      else dispatch(removeDiscount());
      setCouponError("This coupon is no longer valid for your order.");
    });
  }, [appliedCode, subtotal, validateCoupon, dispatch, buyNowItem]);

  const handleApplyCoupon = async (event: React.FormEvent) => {
    event.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    try {
      const result = await validateCoupon({ code, subtotal }).unwrap();
      if (buyNowItem) {
        setBuyNowCouponCode(result.data.code);
        setBuyNowDiscount(result.data.discountAmount);
      } else dispatch(applyDiscountAmount({ code: result.data.code, amount: result.data.discountAmount }));
      setCouponMessage(`৳${result.data.discountAmount.toLocaleString()} discount applied.`);
      setCouponError("");
      setCouponInput("");
    } catch (error) {
      const message = (error as { data?: { message?: string | string[] } })?.data?.message;
      setCouponError(Array.isArray(message) ? message.join(" ") : message || "This coupon could not be applied.");
      setCouponMessage("");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const chooseDeliveryArea = (area: "inside" | "outside") => {
    setDeliveryArea(area);
    localStorage.setItem("shopnow_delivery_area", area);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast.error("Please fill in your name, phone number, and delivery address.");
      return;
    }

    if (!agreeTerms) { toast.error("Please confirm the order terms to proceed."); return; }

    if (checkoutItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    const address = selectedAddress !== "new" ? savedAddresses[Number(selectedAddress)] : null;
    if (address) setFormData((previous) => ({ ...previous, address: address.addressLine, city: address.city }));
    const orderAddress = address?.addressLine || formData.address.trim();
    const orderCity = address?.city || formData.city;
    setIsSubmitting(true);
    try {
      if (user && saveAddress && selectedAddress === "new") {
        await saveSavedAddress({
          label: "Home", recipientName: formData.fullName.trim(), recipientPhone: formData.phone.trim(),
          addressLine: orderAddress, city: orderCity, deliveryArea, isDefault: savedAddresses.length === 0,
        }).unwrap();
      }
      const response = await createOrder({
        items: checkoutItems.map((item) => ({ productId: String(item.id), ...(item.variantId ? { variantId: item.variantId } : {}), quantity: item.quantity })),
        recipientName: formData.fullName.trim(), recipientPhone: formData.phone.trim(), recipientEmail: formData.email.trim() || undefined,
        addressLine: orderAddress, city: orderCity, area: deliveryArea, customerNote: formData.orderNote.trim() || undefined,
        couponCode: appliedCode || undefined,
        paymentMethod: "CALL_CONFIRMATION",
      }).unwrap();
      const orderId = response.data.orderNumber;
      setGeneratedOrderId(orderId);
      setGeneratedOrderTotal(Number(response.data.total));
      setGeneratedOrderName(response.data.recipientName || formData.fullName.trim());
      setGeneratedOrderPhone(response.data.recipientPhone || formData.phone.trim());
      setOrderSuccess(true);
      if (!buyNowItem) dispatch(clearCart());
      toast.success("Order submitted. Our team will call you to confirm.");
    } catch (error) {
      const message = (error as { data?: { message?: string | string[] } })?.data?.message;
      toast.error(Array.isArray(message) ? message.join(" ") : message || "Could not place your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#fff0f8_0%,_#fff9fc_38%,_#fffafd_78%)] py-5 text-[#171d36] dark:bg-[#090D14] sm:py-7 transition-colors duration-200 font-['Inter']">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
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

        <section className="relative mb-5 mt-2 flex min-h-[116px] items-center overflow-hidden rounded-[26px] bg-[linear-gradient(105deg,#fffafd_0%,#fff1f8_55%,#ffe3f1_100%)] px-5 py-5 sm:min-h-[132px] sm:px-8">
          <div className="pointer-events-none absolute -right-10 -top-24 h-52 w-96 rotate-[-13deg] rounded-[50%] bg-white/55" />
          <div className="pointer-events-none absolute right-10 -top-28 h-52 w-96 rotate-[-13deg] rounded-[50%] border border-white/70" />
          <div className="relative z-10 flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#ffe3f2] text-[#b80d4e] shadow-sm sm:h-14 sm:w-14"><Lock size={23}/></span>
            <div><h1 className="text-2xl font-extrabold tracking-tight text-[#131b32] sm:text-[30px]">Checkout &amp; Payment</h1><p className="mt-1 text-sm text-slate-600 sm:text-[15px]">Complete your order by providing delivery details and selecting a payment method.</p></div>
          </div>
          <img src={checkoutBeautyCluster} alt="Pink skincare products and hibiscus flower" className="pointer-events-none absolute -bottom-5 right-0 hidden h-[170px] w-[440px] object-contain object-right-bottom sm:block lg:h-[210px] lg:w-[560px]" />
        </section>

        {/* Checkout Step Progress Bar */}
        <div className="mx-auto mb-5 max-w-[850px] px-2 sm:mb-6">
          <div className="flex items-center justify-center text-xs font-semibold sm:text-sm">
            <div className="flex items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#ffe4f2] text-[#b80d4e] shadow-sm"><ShoppingCart size={20}/></span><span className="whitespace-nowrap text-gray-700">1. Cart</span></div>
            <div className="mx-3 h-px flex-1 bg-[#ed2b83] sm:mx-5"/>
            <div className="flex items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#ffe4f2] text-[#b80d4e] shadow-sm ring-4 ring-[#ffe4f2]/60"><CreditCard size={20}/></span><span className="whitespace-nowrap font-bold text-[#941141]">2. Payment</span></div>
            <div className="mx-3 h-px flex-1 bg-[#d5d7e1] sm:mx-5"/>
            <div className="flex items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#f0f1f6] text-slate-400"><Check size={21}/></span><span className="whitespace-nowrap text-slate-500">3. Confirmation</span></div>
          </div>
        </div>

        {/* Main 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12 lg:gap-6">
          {/* Left Form: Shipping Details & Payment Methods (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
              {/* SECTION A: Shipping Details */}
              <div className="bg-white dark:bg-[#111622] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-xs">
                <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-9 h-9 rounded-xl bg-[#FFE2FF] text-[#500624] flex items-center justify-center">
                    <MapPin size={20} />
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

                {savedAddresses.length > 0 && <div className="mb-5">
                  <label htmlFor="saved-address" className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">Choose a saved address</label>
                  <select id="saved-address" value={selectedAddress} onChange={(event) => {
                    setSelectedAddress(event.target.value);
                    const selected = savedAddresses[Number(event.target.value)];
                    if (selected) {
                      setFormData((previous) => ({ ...previous, address: selected.addressLine, city: selected.city, fullName: selected.recipientName || previous.fullName, phone: selected.recipientPhone || previous.phone }));
                      chooseDeliveryArea(selected.deliveryArea);
                    }
                  }} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-800">
                    {savedAddresses.map((address, index) => <option key={address.id} value={index}>{address.label}: {address.addressLine}, {address.city}</option>)}
                    <option value="new">Use a different address</option>
                  </select>
                </div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
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
                      className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#ed2b83]/15 focus:border-[#ed2b83] outline-none transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <Phone size={13} className="text-[#500624] dark:text-[#FFE2FF]" />
                      Phone Number (For Order Confirmation Call) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="017XX-XXXXXX"
                      className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#ed2b83]/15 focus:border-[#ed2b83] outline-none transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="farhana@example.com"
                      className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#ed2b83]/15 focus:border-[#ed2b83] outline-none transition-colors"
                    />
                  </div>

                  {/* Delivery Zone / City */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300">
                      <MapPin size={14} className="text-[#b80d4e]"/>Delivery Region <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          chooseDeliveryArea("inside");
                          setFormData((prev) => ({ ...prev, city: "Dhaka" }));
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          deliveryArea === "inside"
                            ? "bg-[#FFE2FF] border-[#500624] text-[#500624] shadow-xs"
                            : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300"
                        }`}
                      >
                        Inside Dhaka ({formatTaka(deliveryResponse?.data.deliveryFees.inside ?? 60)})
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          chooseDeliveryArea("outside");
                          setFormData((prev) => ({ ...prev, city: "Outside Dhaka" }));
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          deliveryArea === "outside"
                            ? "bg-[#FFE2FF] border-[#500624] text-[#500624] shadow-xs"
                            : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300"
                        }`}
                      >
                        Outside Dhaka ({formatTaka(deliveryResponse?.data.deliveryFees.outside ?? 120)})
                      </button>
                    </div>
                  </div>

                  {/* City/District input */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300">
                      <Building2 size={14} className="text-[#b80d4e]"/>City / District
                    </label>
                    <div className="relative">
                      <select name="city" value={formData.city} onChange={handleInputChange} className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 outline-none transition-colors focus:border-[#ed2b83] focus:ring-2 focus:ring-[#ed2b83]/15 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                        {["Dhaka", "Chattogram", "Sylhet", "Khulna", "Rajshahi", "Barishal", "Rangpur", "Mymensingh", "Outside Dhaka"].map((city) => <option key={city} value={city}>{city}</option>)}
                      </select><ChevronRight size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-500"/>
                    </div>
                  </div>

                  {/* Full Detailed Address */}
                  <div className={`sm:col-span-2 ${selectedAddress !== "new" ? "hidden" : ""}`}>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <Map size={14} className="text-[#b80d4e]" />
                      Full Street Address <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      required
                      rows={2}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="House / Flat No., Road No., Area details"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#ed2b83]/15 focus:border-[#ed2b83] outline-none transition-colors"
                    />
                  </div>

                  {/* Order Note */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                      <FileText size={13} className="text-gray-400" />
                      Order Note / Special Delivery Instructions
                    </label>
                    <input
                      type="text"
                      name="orderNote"
                      value={formData.orderNote}
                      onChange={handleInputChange}
                      placeholder="e.g. Call before delivery, deliver after 2 PM"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#ed2b83]/15 focus:border-[#ed2b83] outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: Payment Method Selection */}
              <section className="rounded-[24px] border border-[#f0e4eb] bg-white p-5 shadow-[0_8px_26px_rgba(46,17,35,0.045)] sm:p-7">
                <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#ffe4f2] text-[#b80d4e]"><CreditCard size={21}/></span>
                  <div><h2 className="text-xl font-extrabold text-[#151d33]">Payment Method</h2><p className="mt-0.5 text-sm text-slate-500">Choose your preferred payment method.</p></div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { id: "cod", title: "Cash on Delivery", subtitle: "Pay in cash when you receive your order.", icon: <Truck size={24}/>, tag: "Popular" },
                    { id: "wallet", title: "bKash or Nagad", subtitle: "Our team will call and confirm payment details.", icon: <CreditCard size={24}/>, tag: "bKash / Nagad" },
                    { id: "phone", title: "Confirm by Phone", subtitle: "No payment needed now. We will call to confirm your order.", icon: <Phone size={24}/>, tag: "Call first" },
                  ].map((option) => {
                    const selected = paymentChoice === option.id;
                    return <button key={option.id} type="button" onClick={() => setPaymentChoice(option.id as typeof paymentChoice)} aria-pressed={selected} className={`relative flex min-h-[112px] items-start gap-3 rounded-2xl border p-4 text-left transition-all ${selected ? "border-[#ed2b83] bg-[#fff3f9] shadow-[0_5px_18px_rgba(237,43,131,0.10)] ring-1 ring-[#ed2b83]/15" : "border-[#e9e8ee] bg-white hover:border-pink-200 hover:bg-[#fffafd]"}`}>
                      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${selected ? "border-[#ec2680]" : "border-slate-300"}`}>{selected && <span className="h-2.5 w-2.5 rounded-full bg-[#ec2680]"/>}</span>
                      <span className="min-w-0"><span className="flex items-center gap-2 text-[#d41465]"><span>{option.icon}</span><strong className="text-[13px] leading-tight text-[#161d32]">{option.title}</strong></span><span className="mt-2 block text-[11px] leading-snug text-slate-500">{option.subtitle}</span><span className="mt-2 inline-flex rounded-full bg-[#ffe5f2] px-2 py-0.5 text-[9px] font-bold text-[#a6114e]">{option.tag}</span></span>
                    </button>;
                  })}
                </div>
                <div className="mt-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                  {selectedAddress === "new" && (user ? <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-700"><input type="checkbox" checked={saveAddress} onChange={(event) => setSaveAddress(event.target.checked)} className="h-4 w-4 rounded border-slate-300 accent-[#ec2680]"/>Save this address as Home for next time</label> : <p className="text-xs text-slate-500">Sign in to save this address to your profile for next time.</p>)}
                  <p className="flex items-center gap-2 text-xs text-slate-500 sm:ml-auto"><Phone size={14} className="text-[#d41465]"/>Order confirmation call: <strong className="text-slate-800">{formData.phone || "add your phone number"}</strong></p>
                </div>
                <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed text-slate-600">
                  <input type="checkbox" id="checkout-agree" checked={agreeTerms} onChange={(event) => setAgreeTerms(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-[#ec2680]"/>
                  <span>I have read and agree to SHOB Now's <Link to="/terms" className="font-semibold text-[#d41465] underline">Terms &amp; Conditions</Link>, <Link to="/refund-policy" className="font-semibold text-[#d41465] underline">Refund Policy</Link>, and <Link to="/privacy-policy" className="font-semibold text-[#d41465] underline">Privacy Policy</Link>.</span>
                </label>
              </section>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <aside className="space-y-4 lg:col-span-4 lg:sticky lg:top-28">
            <div className="rounded-[24px] border border-[#f0e4eb] bg-white p-5 shadow-[0_8px_26px_rgba(46,17,35,0.055)] sm:p-6">
              <div className="mb-1 flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#ffe4f2] text-[#b80d4e]"><ShoppingBag size={21}/></span><h2 className="text-xl font-extrabold text-[#151d33] sm:text-[22px]">Order Summary</h2></div>
                <span className="rounded-full bg-[#ffe4f2] px-3 py-1.5 text-xs font-bold text-[#9f174c]">{checkoutItems.reduce((count, item) => count + item.quantity, 0)} {buyNowItem ? 'piece' : 'pieces'}</span>
              </div>
              {buyNowItem && <p className="mb-2 text-xs font-medium text-slate-500">Buy Now · this product only</p>}
              <div className="max-h-60 divide-y divide-slate-100 overflow-y-auto pr-1">
                {checkoutItems.map((item) => <div key={`${item.id}-${item.selectedSize}`} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 items-center gap-3"><img src={imageSource(item.image)} alt={item.name} onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} className="h-[68px] w-[68px] shrink-0 rounded-xl border border-pink-100 bg-[#fff3f8] object-contain p-1"/><div className="min-w-0"><p className="line-clamp-2 text-sm font-bold text-[#171d32]">{item.name}</p><p className="mt-1 text-xs text-slate-500">Qty: {item.quantity}{item.selectedSize ? ` ? ${item.selectedSize}` : ""}</p></div></div>
                  <span className="shrink-0 text-sm font-bold text-[#161d32]">{formatTaka(item.price * item.quantity)}</span>
                </div>)}
                {checkoutItems.length === 0 && <p className="py-5 text-sm text-slate-500">Your cart is empty.</p>}
              </div>
              <div className="border-t border-slate-100 py-4">
                {appliedCode ? (
                  <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
                    <span className="flex items-center gap-2"><Tag size={15}/><strong>{appliedCode}</strong> applied</span>
                    <button type="button" onClick={() => { if (buyNowItem) { setBuyNowCouponCode(undefined); setBuyNowDiscount(0); } else dispatch(removeDiscount()); setCouponMessage(""); setCouponError(""); }} className="text-xs font-semibold underline">Remove</button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input aria-label="Coupon code" value={couponInput} onChange={(event) => setCouponInput(event.target.value)} placeholder="Coupon code" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm uppercase outline-none focus:border-pink-400" />
                    <button type="submit" disabled={isValidatingCoupon || !couponInput.trim()} className="rounded-xl bg-[#ffe4f2] px-4 text-sm font-bold text-[#9f174c] disabled:opacity-50">{isValidatingCoupon ? "Checking..." : "Apply"}</button>
                  </form>
                )}
                {couponError && <p className="mt-2 text-xs text-rose-600">{couponError}</p>}
                {couponMessage && <p className="mt-2 text-xs text-emerald-700">{couponMessage}</p>}
              </div>
              <div className="space-y-3 border-t border-slate-100 pt-4 text-sm text-slate-700">
                <div className="flex justify-between"><span>Subtotal</span><strong className="text-[#171d32]">{formatTaka(subtotal)}</strong></div>
                <div className="flex items-center justify-between"><span>Delivery Fee ({deliveryArea === "inside" ? "Inside Dhaka" : "Outside Dhaka"})</span>{isFreeShipping ? <strong className="text-emerald-600">FREE</strong> : <strong className="text-[#171d32]">{formatTaka(shippingFee)}</strong>}</div>
                {discount > 0 && <div className="flex items-center justify-between"><span className="flex items-center gap-2">Discount / Coupon <span className="rounded-full bg-[#ffe4f2] px-2 py-1 text-[9px] font-extrabold text-[#c8175b]">{appliedCode ? String(appliedCode) : "COUPON"}</span></span><strong className="text-[#d41465]">−{formatTaka(discount)}</strong></div>}
                <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-extrabold text-[#111a31] sm:text-xl"><span>Grand Total</span><strong className="text-2xl font-black text-[#e31968] sm:text-[28px]">{formatTaka(grandTotal)}</strong></div>
              </div>
              <button type="submit" form="checkout-form" disabled={isSubmitting || checkoutItems.length === 0} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f51372] to-[#e90068] px-5 py-4 text-base font-extrabold text-white shadow-[0_9px_20px_rgba(233,0,104,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? <span>Processing Order...</span> : <><Lock size={19}/><span>Confirm &amp; Place Order</span></>}</button>
              <div className="mt-5 grid grid-cols-2 gap-y-4 border-t border-slate-100 pt-4 text-[11px]">
                <div className="flex items-center gap-2 border-r border-slate-100 pr-2"><BadgeCheck size={23} className="shrink-0 text-[#ed2b83]"/><span><strong className="block text-xs text-[#182039]">100% Authentic</strong><span className="text-slate-500">Genuine beauty products</span></span></div>
                <div className="flex items-center gap-2 pl-3"><Lock size={22} className="shrink-0 text-[#ed2b83]"/><span><strong className="block text-xs text-[#182039]">SSL Secured Checkout</strong><span className="text-slate-500">Your data is protected</span></span></div>
                <div className="flex items-center gap-2 border-r border-t border-slate-100 pr-2 pt-3"><RotateCcw size={23} className="shrink-0 text-[#ed2b83]"/><span><strong className="block text-xs text-[#182039]">Easy Return</strong><span className="text-slate-500">Hassle-free &amp; quick</span></span></div>
                <div className="flex items-center gap-2 border-t border-slate-100 pl-3 pt-3"><Truck size={25} className="shrink-0 text-[#ed2b83]"/><span><strong className="block text-xs text-[#182039]">Delivery Across Bangladesh</strong><span className="text-slate-500">All cities &amp; districts</span></span></div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl overflow-hidden rounded-[30px] border border-pink-100 bg-white p-6 text-center shadow-2xl sm:p-9">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-pink-50 to-transparent" />
            <div className="relative mx-auto mb-1 grid h-32 w-32 place-items-center">
              <div className="absolute inset-2 rounded-full bg-pink-100/80 blur-xl" />
              <img src={orderConfirmationIllustration} alt="Beauty order confirmed" className="relative h-full w-full object-contain" />
            </div>
            <span className="relative inline-flex rounded-full bg-[#f8e8ef] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#A20E4C]">Order pending confirmation</span>
            <h2 className="mt-3 font-['Faustina'] text-2xl font-bold text-slate-900 sm:text-3xl">Thank you{generatedOrderName ? `, ${generatedOrderName.trim().split(/\s+/)[0]}` : ''}!</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">Order <strong className="text-slate-800">#{generatedOrderId}</strong> is with our team. We’ll call the phone number you gave us to confirm it before processing.</p>
            {generatedOrderPhone && <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-sm font-bold text-[#A20E4C]"><Phone size={15}/>{generatedOrderPhone}</div>}
            <div className="my-6 space-y-3 rounded-2xl border border-pink-100 bg-[#fff9fc] p-4 text-left text-sm sm:p-5">
              <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Invoice number</span><span className="text-right font-bold text-slate-800">{generatedOrderId}</span></div>
              <div className="flex items-center justify-between gap-3"><span className="text-slate-500">Payment</span><span className="text-right font-bold text-slate-800">Phone confirmation</span></div>
              <div className="flex items-center justify-between gap-3 border-t border-pink-100 pt-3"><span className="font-semibold text-slate-700">Total amount</span><span className="text-lg font-extrabold text-[#A20E4C]">{formatTaka(generatedOrderTotal)}</span></div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => navigate("/")} className="w-full flex-1 rounded-xl bg-[#A20E4C] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#7E0B3B]">Return to Home</button>
              <button type="button" onClick={() => navigate("/shop")} className="w-full flex-1 rounded-xl border border-[#A20E4C]/20 bg-white px-5 py-3 text-sm font-bold text-[#A20E4C] transition hover:bg-pink-50">Continue Shopping</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
