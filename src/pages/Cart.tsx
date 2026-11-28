import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronRight, Clock3,
  CreditCard, Home, MapPin, Minus, Pencil, Plus, RotateCcw,
  ShieldCheck, ShoppingBag, Sparkles, Tag, Trash2, Truck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import {
  selectCartItems, selectCartTotalCount, selectCartSubtotal, selectCartDiscount,
  selectCartAppliedCode, selectCartGrandTotal, removeFromCart, updateQuantity,
  clearCart, applyDiscountAmount, removeDiscount,
} from "@/redux/features/cart/cartSlice";
import FigmaShopProductCard from "@/components/Shop/FigmaShopProductCard";
import emptyCartImg from "@/assets/empty-cart.jpg";
import {
  useGetDeliveryConfigQuery, useGetSavedAddressesQuery, useGetStoreProductsQuery,
  useValidateCouponMutation,
} from "@/redux/features/storefront/storefrontApi";
import { toShopCardProduct } from "@/components/Shop/shopProductCardMapper";

const money = (value: number) => `৳${value.toLocaleString("en-BD")}`;
type DeliveryArea = "inside" | "outside";

export const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const items = useAppSelector(selectCartItems);
  const totalCount = useAppSelector(selectCartTotalCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const discount = useAppSelector(selectCartDiscount);
  const appliedCode = useAppSelector(selectCartAppliedCode);
  const cartTotal = useAppSelector(selectCartGrandTotal);
  const { data: deliveryResponse } = useGetDeliveryConfigQuery();
  const { data: productResponse } = useGetStoreProductsQuery({ page: 1, limit: 8, sort: "popularity" });
  const { data: addressesResponse, isLoading: isLoadingAddresses } = useGetSavedAddressesQuery(undefined, { skip: !user });
  const [validateCoupon, { isLoading: isValidatingCoupon }] = useValidateCouponMutation();
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [shippingOption, setShippingOption] = useState<DeliveryArea>(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("shopnow_delivery_area") : null;
    return stored === "outside" ? "outside" : "inside";
  });

  const addresses = addressesResponse?.data ?? [];
  const savedAddress = useMemo(() => addresses.find((address) => address.isDefault) ?? addresses[0], [addresses]);
  const deliveryConfig = deliveryResponse?.data;
  const freeDeliveryThreshold = deliveryConfig?.freeDeliveryThreshold ?? 1000;
  const deliveryFee = deliveryConfig?.deliveryFees[shippingOption] ?? (shippingOption === "inside" ? 60 : 120);
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const finalTotal = Math.max(0, cartTotal + (isFreeDelivery ? 0 : deliveryFee));
  const deliveryPercent = freeDeliveryThreshold ? Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100)) : 100;
  const cartProductIds = new Set(items.map((item) => item.id));
  const recommendedProducts = useMemo(
    () => (productResponse?.data ?? []).map(toShopCardProduct).filter((product) => !cartProductIds.has(product.id)).slice(0, 4),
    [productResponse, items],
  );

  useEffect(() => {
    if (savedAddress?.deliveryArea === "inside" || savedAddress?.deliveryArea === "outside") {
      setShippingOption(savedAddress.deliveryArea);
      localStorage.setItem("shopnow_delivery_area", savedAddress.deliveryArea);
    }
  }, [savedAddress?.id]);

  const selectDeliveryArea = (area: DeliveryArea) => {
    setShippingOption(area);
    localStorage.setItem("shopnow_delivery_area", area);
  };

  const goToCheckout = () => navigate("/payment", { state: { deliveryArea: shippingOption } });

  const handleApplyCoupon = async (event: React.FormEvent) => {
    event.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    try {
      const result = await validateCoupon({ code, subtotal }).unwrap();
      dispatch(applyDiscountAmount({ code: result.data.code, amount: result.data.discountAmount }));
      setCouponSuccess(`Coupon ${result.data.code} applied. You save ${money(result.data.discountAmount)}.`);
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

  return (
    <main className="min-h-screen bg-[#fffafc] py-5 text-[#172238] transition-colors duration-200 dark:bg-[#090d14] dark:text-gray-100 sm:py-8">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-[#68758a]">
          <Link to="/" className="transition hover:text-[#ec0078]">Home</Link><ChevronRight size={13}/>
          <Link to="/shop" className="transition hover:text-[#ec0078]">Shop</Link><ChevronRight size={13}/>
          <span className="font-medium text-[#172238] dark:text-white">Shopping Cart</span>
        </nav>

        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-[30px] font-semibold leading-tight tracking-[-0.03em] text-[#101b33] dark:text-white sm:text-[36px]">Shopping Cart</h1>
            <p className="mt-1 text-[13px] text-[#69768b] sm:text-sm">{items.length ? `You have ${totalCount} item${totalCount === 1 ? "" : "s"} in your bag` : "Your bag is currently empty"}</p>
          </div>
          {items.length > 0 && <button type="button" onClick={() => dispatch(clearCart())} className="mb-1 inline-flex items-center gap-1.5 text-xs font-medium text-[#ec0078] transition hover:text-[#bd005f]"><Trash2 size={14}/>Clear Entire Cart</button>}
        </div>

        {items.length === 0 ? <section className="mb-12 rounded-[24px] border border-[#f6e5ed] bg-white px-6 py-12 text-center shadow-[0_5px_24px_rgba(33,24,39,0.04)] dark:border-gray-800 dark:bg-[#111622]">
          <img src={emptyCartImg} alt="" className="mx-auto mb-5 h-40 w-40 object-contain"/>
          <h2 className="font-serif text-2xl font-medium text-[#172238] dark:text-white">Your shopping cart is empty</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-[#68758a]">Find something special for your everyday routine.</p>
          <Link to="/shop" className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#f22d91] to-[#e60070] px-5 text-sm font-medium text-white shadow-[0_8px_18px_rgba(236,0,120,0.18)]"><ShoppingBag size={16}/>Explore products<ArrowRight size={15}/></Link>
        </section> : <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_420px] xl:gap-8">
          <div className="min-w-0 space-y-4">
            <section aria-label="Delivery progress" className="rounded-[18px] border border-[#f1e8ec] bg-white px-4 py-4 shadow-[0_3px_12px_rgba(32,26,40,0.04)] dark:border-gray-800 dark:bg-[#111622] sm:px-5">
              <div className="mb-2 flex items-center justify-between gap-3 text-[13px]">
                <p className={`flex items-center gap-2 font-medium ${isFreeDelivery ? "text-[#008b63]" : "text-[#344054] dark:text-gray-200"}`}>
                  {isFreeDelivery ? <CheckCircle2 size={17} className="text-[#00ae78]"/> : <Sparkles size={17} className="text-[#ec0078]"/>}
                  {isFreeDelivery ? "You’ve unlocked FREE Delivery across Bangladesh!" : <>Add <strong className="font-semibold text-[#c90061]">{money(freeDeliveryThreshold - subtotal)}</strong> more to unlock free delivery.</>}
                </p>
                <span className="shrink-0 text-xs font-medium tabular-nums text-[#8792a5]">{deliveryPercent}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#f5e1eb] p-[1.5px]"><div className="h-full rounded-full bg-gradient-to-r from-[#f22d91] to-[#e60070] transition-[width] duration-500" style={{ width: `${deliveryPercent}%` }}/></div>
            </section>

            <section aria-label="Items in your bag" className="overflow-hidden rounded-[19px] border border-[#eee9ed] bg-white shadow-[0_3px_14px_rgba(32,26,40,0.045)] dark:border-gray-800 dark:bg-[#111622]">
              <div className="hidden grid-cols-[minmax(0,1fr)_90px_112px_100px] gap-4 border-b border-[#f0ebef] bg-[#fcfbfc] px-5 py-3 text-[10px] font-medium uppercase tracking-[0.08em] text-[#718096] dark:border-gray-800 dark:bg-gray-800/40 sm:grid sm:px-6">
                <span>Product</span><span className="text-center">Price</span><span className="text-center">Quantity</span><span className="text-right">Total</span>
              </div>
              <div className="divide-y divide-[#f0ebef] dark:divide-gray-800">
                {items.map((item) => <article key={`${item.id}-${item.variantId || item.selectedSize || "default"}`} className="grid grid-cols-1 items-center gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_90px_112px_100px] sm:gap-4 sm:px-5 sm:py-4 lg:px-6">
                  <div className="flex min-w-0 items-center gap-3.5">
                    <Link to={`/product/${item.slug}`} aria-label={`View ${item.name}`} className="grid h-[76px] w-[76px] shrink-0 place-items-center overflow-hidden rounded-[15px] border border-[#f1e9ee] bg-[#fff8fb] p-1.5 sm:h-[82px] sm:w-[82px]"><img src={item.image || emptyCartImg} alt={item.name} className="h-full w-full object-contain" onError={(event) => { event.currentTarget.src = emptyCartImg; }}/></Link>
                    <div className="min-w-0">
                      {item.brand && <span className="mb-0.5 block truncate text-[9px] font-medium uppercase tracking-[0.08em] text-[#8791a3]">{item.brand}</span>}
                      <Link to={`/product/${item.slug}`} className="line-clamp-2 text-[13px] font-medium leading-snug text-[#172238] transition hover:text-[#c90061] dark:text-white">{item.name}</Link>
                      {item.selectedSize && <span className="mt-1 block text-[10px] text-[#748196]">Variant: {item.selectedSize}</span>}
                      <button type="button" onClick={() => dispatch(removeFromCart({ id: item.id, selectedSize: item.selectedSize }))} className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-[#8993a4] hover:text-[#d80068] sm:hidden"><Trash2 size={12}/>Remove</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[12px] text-[#657187] sm:justify-center sm:text-[#172238] dark:sm:text-white"><span className="sm:hidden">Price</span>{money(item.price)}</div>
                  <div className="flex items-center justify-between sm:justify-center"><span className="text-[11px] text-[#657187] sm:hidden">Quantity</span><div className="inline-flex h-[34px] items-center overflow-hidden rounded-[11px] border border-[#e4e4eb] bg-white dark:border-gray-700 dark:bg-gray-900">
                    <button type="button" onClick={() => dispatch(updateQuantity({ id: item.id, selectedSize: item.selectedSize, variantId: item.variantId, quantity: item.quantity - 1 }))} disabled={item.quantity <= 1} aria-label={`Decrease ${item.name} quantity`} className="grid h-full w-8 place-items-center text-[#7d8799] hover:bg-[#fff2f8] hover:text-[#ec0078] disabled:opacity-40"><Minus size={13}/></button>
                    <span className="min-w-8 text-center text-xs font-medium tabular-nums">{item.quantity}</span>
                    <button type="button" onClick={() => dispatch(updateQuantity({ id: item.id, selectedSize: item.selectedSize, variantId: item.variantId, quantity: item.quantity + 1 }))} aria-label={`Increase ${item.name} quantity`} className="grid h-full w-8 place-items-center text-[#657187] hover:bg-[#fff2f8] hover:text-[#ec0078]"><Plus size={13}/></button>
                  </div></div>
                  <div className="flex items-center justify-between text-[13px] font-medium tabular-nums text-[#172238] dark:text-white sm:justify-end sm:gap-2"><span className="sm:hidden text-[11px] font-normal text-[#657187]">Item total</span><span>{money(item.price * item.quantity)}</span><button type="button" onClick={() => dispatch(removeFromCart({ id: item.id, selectedSize: item.selectedSize }))} aria-label={`Remove ${item.name}`} className="hidden rounded-md p-1 text-[#a2aaba] transition hover:bg-[#fff1f6] hover:text-[#d80068] sm:inline-flex"><Trash2 size={15}/></button></div>
                </article>)}
              </div>
              <div className="flex items-center justify-between border-t border-[#f0ebef] bg-[#fdfcfd] px-4 py-3 text-[11px] dark:border-gray-800 dark:bg-gray-800/30 sm:px-6">
                <Link to="/shop" className="inline-flex items-center gap-1.5 text-[#c90061] hover:text-[#ec0078]"><ArrowLeft size={13}/>Continue shopping</Link><span className="text-[#8993a4]">{totalCount} item{totalCount === 1 ? "" : "s"} selected</span>
              </div>
            </section>

          </div>

          <aside className="space-y-4">
            <section className="rounded-[20px] border border-[#eee8ed] bg-white p-5 shadow-[0_5px_22px_rgba(32,26,40,0.055)] dark:border-gray-800 dark:bg-[#111622] sm:p-6">
              <h2 className="border-b border-[#eee9ed] pb-3 font-serif text-[19px] font-medium text-[#172238] dark:border-gray-800 dark:text-white">Order Summary</h2>
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between text-[13px]"><span className="text-[#657187]">Subtotal</span><span className="font-medium tabular-nums text-[#172238] dark:text-white">{money(subtotal)}</span></div>
                {discount > 0 && <div className="flex items-center justify-between text-[12px] text-[#008b63]"><span className="inline-flex items-center gap-1.5"><Tag size={13}/>Discount{appliedCode ? ` (${appliedCode})` : ""}</span><span className="tabular-nums">−{money(discount)}</span></div>}

                <div className="border-y border-[#eee9ed] py-4 dark:border-gray-800">
                  <div className="mb-2.5 flex items-center justify-between"><h3 className="inline-flex items-center gap-2 text-[13px] font-medium text-[#172238] dark:text-white"><MapPin size={16} className="text-[#ec0078]"/>Delivery Location</h3>{isFreeDelivery && <span className="text-xs font-semibold text-[#008b63]">FREE</span>}</div>
                  {savedAddress ? <div className="rounded-[13px] border border-[#00a878] bg-[#f5fcf9] p-3 dark:bg-emerald-950/15">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px] bg-[#fff0f7] text-[#ec0078]"><Home size={18}/></span>
                      <div className="min-w-0 flex-1"><span className="mb-0.5 inline-flex rounded-md bg-[#ffe5f1] px-2 py-0.5 text-[9px] font-medium text-[#c90061]">{savedAddress.label}</span><p className="line-clamp-2 text-[11px] font-medium leading-snug text-[#172238] dark:text-white">{savedAddress.addressLine}, {savedAddress.city}</p><p className="mt-1 inline-flex items-center gap-1 text-[9px] font-medium text-[#008b63]"><CheckCircle2 size={11}/>Saved to your profile</p></div>
                      <button type="button" onClick={goToCheckout} className="inline-flex shrink-0 items-center gap-1 border-l border-[#dcebe4] pl-2.5 text-[10px] font-medium text-[#c90061] hover:text-[#ec0078]"><Pencil size={12}/>Change</button>
                    </div>
                  </div> : <div className="flex items-center gap-3 rounded-[13px] border border-dashed border-[#f1bfd6] bg-[#fff8fb] p-3 dark:bg-gray-900"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px] bg-white text-[#ec0078] shadow-sm"><MapPin size={18}/></span><div className="min-w-0 flex-1"><p className="text-[11px] font-medium text-[#172238] dark:text-white">{user ? (isLoadingAddresses ? "Loading saved address…" : "No saved address yet") : "Add a delivery address"}</p><p className="mt-0.5 text-[10px] text-[#758196]">{user ? "Add it once at checkout and reuse it next time." : "Sign in at checkout to save this address to your profile."}</p></div><button type="button" onClick={goToCheckout} className="shrink-0 text-[10px] font-medium text-[#c90061]">Add</button></div>}

                  <div className="mt-4 flex items-center justify-between"><h3 className="inline-flex items-center gap-2 text-[13px] font-medium text-[#172238] dark:text-white"><Truck size={16} className="text-[#ec0078]"/>Delivery Area</h3></div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(["inside", "outside"] as const).map((area) => {
                      const selected = shippingOption === area;
                      const fee = deliveryConfig?.deliveryFees[area] ?? (area === "inside" ? 60 : 120);
                      return <button key={area} type="button" aria-pressed={selected} onClick={() => selectDeliveryArea(area)} className={`rounded-[12px] border px-2.5 py-2.5 text-left transition ${selected ? "border-[#ec0078] bg-[#fff0f7]" : "border-[#e4e5eb] bg-white hover:border-[#f0a8ca] dark:border-gray-700 dark:bg-gray-900"}`}>
                        <span className="flex items-center gap-2 text-[11px] font-medium text-[#172238] dark:text-white"><span className={`grid h-4 w-4 place-items-center rounded-full border ${selected ? "border-[#ec0078] bg-[#ec0078] text-white" : "border-[#c8cdd7]"}`}>{selected && <Check size={10}/>}</span>{area === "inside" ? "Inside Dhaka" : "Outside Dhaka"}</span>
                        <span className={`mt-1 block pl-6 text-[10px] font-medium ${isFreeDelivery ? "text-[#008b63]" : selected ? "text-[#c90061]" : "text-[#667085]"}`}>{isFreeDelivery ? "FREE" : money(fee)}</span>
                        <span className="mt-1 flex items-center gap-1 pl-6 text-[9px] text-[#758196]"><Clock3 size={10}/>{area === "inside" ? "1–2 days" : "2–4 days"} delivery</span>
                      </button>;
                    })}
                  </div>
                </div>

                <div className="space-y-2.5 text-[12px]">
                  <div className="flex items-center justify-between"><span className="text-[#657187]">Delivery</span><span className={isFreeDelivery ? "font-medium text-[#008b63]" : "text-[#657187]"}>{isFreeDelivery ? "FREE" : money(deliveryFee)}</span></div>
                  <div className="flex items-center justify-between rounded-[11px] bg-[#fff1f7] px-3 py-2.5"><span className="font-medium text-[#172238] dark:text-white">Grand Total</span><span className="text-[21px] font-semibold leading-none tabular-nums text-[#d60068]">{money(finalTotal)}</span></div>
                </div>

                <div>
                  {appliedCode ? <div className="flex items-center justify-between rounded-[12px] border border-[#bfe9d9] bg-[#f3fcf8] p-3 text-[11px] text-[#087750]"><span className="inline-flex items-center gap-1.5 font-medium"><CheckCircle2 size={14}/>Code {appliedCode} applied</span><button type="button" onClick={handleRemoveCoupon} className="underline underline-offset-2">Remove</button></div> : <form onSubmit={(event) => void handleApplyCoupon(event)} className="flex gap-2"><label className="flex min-w-0 flex-1 items-center gap-2 rounded-[11px] border border-[#e1dce2] bg-white px-3 dark:border-gray-700 dark:bg-gray-900"><Tag size={15} className="shrink-0 text-[#ec0078]"/><input aria-label="Coupon code" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Enter coupon code" className="min-w-0 flex-1 bg-transparent py-2.5 text-[11px] uppercase text-[#172238] outline-none placeholder:normal-case placeholder:text-[#8993a4] dark:text-white"/></label><button type="submit" disabled={isValidatingCoupon || !couponCode.trim()} className="rounded-[11px] border border-[#f2c7dc] bg-[#fff0f7] px-4 text-[11px] font-medium text-[#b9005c] transition hover:bg-[#ffe3ef] disabled:opacity-50">{isValidatingCoupon ? "Checking…" : "Apply"}</button></form>}
                  {couponError && <p role="alert" className="mt-2 text-[10px] text-[#c2414b]">{couponError}</p>}{couponSuccess && <p role="status" className="mt-2 text-[10px] text-[#008b63]">{couponSuccess}</p>}
                </div>

                <button type="button" onClick={goToCheckout} className="flex h-[48px] w-full items-center justify-center gap-2 rounded-[13px] bg-gradient-to-r from-[#f22d91] to-[#e60070] text-[13px] font-medium text-white shadow-[0_8px_18px_rgba(236,0,120,0.2)] transition hover:brightness-95"><CreditCard size={17}/>Proceed to Checkout<ArrowRight size={16}/></button>

                <div className="space-y-2 border-t border-[#eee9ed] pt-3 text-[10px] text-[#647187] dark:border-gray-800">
                  <p className="flex items-center gap-2"><ShieldCheck size={14} className="shrink-0 text-[#00a878]"/>100% Authentic Korean Products Guarantee</p>
                  <p className="flex items-center gap-2"><Truck size={14} className="shrink-0 text-[#ec0078]"/>Fast delivery across Bangladesh</p>
                  <p className="flex items-center gap-2"><RotateCcw size={14} className="shrink-0 text-[#e98a27]"/>Easy 7-day hassle-free exchange</p>
                </div>
              </div>
            </section>
          </aside>
          <section className="border-t border-[#eee8ed] pt-5 lg:col-span-2">
            <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#e60070]">Curated for you</p><h2 className="mt-0.5 font-serif text-xl font-medium text-[#172238] dark:text-white">You May Also Like</h2></div><Link to="/shop" className="shrink-0 text-xs font-medium text-[#c90061] hover:text-[#ec0078]">View All Products <ArrowRight size={13} className="inline"/></Link></div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4">{recommendedProducts.map((product) => <FigmaShopProductCard key={product.id} product={product}/>)}</div>
          </section>
        </div>}
      </div>
    </main>
  );
};

export default Cart;
