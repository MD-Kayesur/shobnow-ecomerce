import React, { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight, CheckCircle2, LoaderCircle, Minus, Plus, RotateCcw, ShieldCheck,
  ShoppingBag, Sparkles, TicketPercent, Trash2, Truck, X,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import {
  applyDiscountAmount, closeCartDrawer, removeDiscount, removeFromCart,
  selectCartAppliedCode, selectCartDiscount, selectCartItems, selectCartTotalCount,
  selectIsCartOpen, updateQuantity,
} from "@/redux/features/cart/cartSlice";
import {
  useGetDeliveryConfigQuery, useGetStoreProductsQuery,
  useValidateCouponMutation,
} from "@/redux/features/storefront/storefrontApi";
import emptyCartImg from "@/assets/empty-cart.jpg";

const apiOrigin = (import.meta.env.VITE_API_ENDPOINT || "http://localhost:4101/api/v1").replace(/\/api\/v\d+\/?$/, "");
const formatMoney = (amount: number) => `৳${Math.round(amount).toLocaleString("en-BD")}`;

function safeImageUrl(value?: string | null) {
  if (!value?.trim()) return "";
  const source = value.trim();
  if (/^https?:\/\//i.test(source)) return source;
  if (source.startsWith("/")) return `${apiOrigin}${source}`;
  return `${apiOrigin}/${source}`;
}

function CartItemImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return (
    <div className="grid h-[84px] w-[84px] shrink-0 place-items-center overflow-hidden rounded-[18px] bg-[#fff2f7]">
      {src && !failed ? <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" onError={() => setFailed(true)}/> : <div className="grid h-full w-full place-items-center text-[#e60070]"><ShoppingBag size={25}/></div>}
    </div>
  );
}

export const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isOpen = useAppSelector(selectIsCartOpen);
  const items = useAppSelector(selectCartItems);
  const totalCount = useAppSelector(selectCartTotalCount);
  const couponDiscount = useAppSelector(selectCartDiscount);
  const appliedCode = useAppSelector(selectCartAppliedCode);
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [validateCoupon, { isLoading: isValidatingCoupon }] = useValidateCouponMutation();

  const productIds = useMemo(() => [...new Set(items.map((item) => String(item.id)))].filter((id) => /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id)), [items]);
  const { data: catalogResponse, isLoading: isCatalogLoading, isError: isCatalogError } = useGetStoreProductsQuery(
    { page: 1, limit: 50, productIds: productIds.join(",") },
    { skip: !isOpen || productIds.length === 0 },
  );
  const { data: deliveryResponse } = useGetDeliveryConfigQuery();
  const deliveryConfig = deliveryResponse?.data;
  const productsById = useMemo(() => new Map((catalogResponse?.data ?? []).map((product) => [String(product.id), product])), [catalogResponse]);

  const pricedItems = useMemo(() => items.map((item) => {
    const product = productsById.get(String(item.id));
    const variant = product?.variants.find((choice) => choice.id === item.variantId)
      ?? product?.variants.find((choice) => choice.variantName === item.selectedSize);
    const livePrice = variant ? Number(variant.sellingPrice) : product
      ? Number(product.salePrice != null && Number(product.salePrice) < Number(product.price) ? product.salePrice : product.price)
      : item.price;
    const image = product?.media.find((media) => media.isPrimary)?.imageUrl || product?.media[0]?.imageUrl || item.image;
    const stock = product ? variant ? Number(variant.stockQuantity) : Number(product.stock) : undefined;
    const originalPrice = item.originalPrice ?? (product ? Number(product.price) : undefined);
    return { item, product, variant, unitPrice: livePrice, imageUrl: safeImageUrl(image), stock, brand: item.brand || product?.brand?.name || "", originalPrice };
  }), [items, productsById]);

  const subtotal = pricedItems.reduce((sum, row) => sum + row.unitPrice * row.item.quantity, 0);
  const appliedDiscount = Math.min(Math.max(0, couponDiscount), subtotal);
  const productSavings = pricedItems.reduce((sum, row) => sum + Math.max(0, (row.originalPrice ?? row.unitPrice) - row.unitPrice) * row.item.quantity, 0);
  const totalSavings = productSavings + appliedDiscount;
  const estimatedTotal = Math.max(0, subtotal - appliedDiscount);
  const threshold = deliveryConfig?.freeDeliveryThreshold;
  const isFreeDelivery = threshold !== undefined && subtotal >= threshold;
  const remainingForFreeDelivery = threshold === undefined ? 0 : Math.max(0, threshold - subtotal);
  const deliveryProgress = threshold ? Math.min(100, (subtotal / threshold) * 100) : 0;
  const hasInvalidStock = pricedItems.some((row) =>
    (row.stock !== undefined && row.item.quantity > row.stock)
    || (productIds.includes(String(row.item.id)) && !row.product && !isCatalogLoading && !isCatalogError),
  );
  const cartCatalogIdsReady = productIds.length === 0 || (!isCatalogLoading && !isCatalogError);

  useEffect(() => {
    if (!appliedCode || items.length === 0) return;
    let current = true;
    void validateCoupon({ code: appliedCode, subtotal }).unwrap().then((result) => {
      if (current) dispatch(applyDiscountAmount({ code: result.data.code, amount: result.data.discountAmount }));
    }).catch(() => {
      if (current) {
        dispatch(removeDiscount());
        setCouponError("This coupon is no longer valid for your cart.");
        setCouponMessage("");
      }
    });
    return () => { current = false; };
  }, [appliedCode, subtotal, items.length, validateCoupon, dispatch]);

  useEffect(() => {
    if (appliedCode) setCouponOpen(true);
  }, [appliedCode]);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dispatch(closeCartDrawer());
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen, dispatch]);

  const close = () => dispatch(closeCartDrawer());
  const navigateToCart = () => { close(); navigate("/cart"); };
  const navigateToCheckout = () => { close(); navigate("/payment"); };
  const handleApplyCoupon = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponError(""); setCouponMessage("");
    try {
      const result = await validateCoupon({ code, subtotal }).unwrap();
      dispatch(applyDiscountAmount({ code: result.data.code, amount: result.data.discountAmount }));
      setCouponMessage(`${formatMoney(result.data.discountAmount)} discount applied.`);
      setCouponInput(""); setCouponOpen(true);
      toast.success("Promo code applied.");
    } catch (error) {
      const message = (error as { data?: { message?: string | string[] } })?.data?.message;
      setCouponError(Array.isArray(message) ? message.join(" ") : message || "This promo code could not be applied.");
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeDiscount()); setCouponError(""); setCouponMessage(""); setCouponInput("");
  };

  const updateItemQuantity = (row: (typeof pricedItems)[number], quantity: number) => {
    dispatch(updateQuantity({ id: row.item.id, selectedSize: row.item.selectedSize, variantId: row.item.variantId, quantity }));
  };

  return (
    <>
      <button type="button" aria-label="Close shopping bag" tabIndex={isOpen ? 0 : -1} onClick={close} className={`fixed inset-0 z-[60] bg-[#14101a]/45 backdrop-blur-[3px] transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}/>
      <aside
        ref={drawerRef}
        role="dialog"
        aria-label="Shopping bag"
        aria-modal="true"
        aria-hidden={!isOpen}
        inert={!isOpen}
        tabIndex={-1}
        className={`fixed inset-y-0 right-0 z-[61] flex h-dvh w-full flex-col overflow-hidden border-l border-[#f3e5ed] bg-white text-[#192638] shadow-[-18px_0_60px_rgba(28,17,37,0.2)] transition-transform duration-300 ease-out sm:w-[min(500px,100vw)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="relative shrink-0 overflow-hidden border-b border-[#f2e8ee] bg-[radial-gradient(ellipse_at_top_right,_rgba(255,224,240,0.86),_transparent_55%),linear-gradient(110deg,#fff_25%,#fff8fc_100%)] px-5 pb-4 pt-5 sm:px-8 sm:pb-5 sm:pt-6">
          <div className="pointer-events-none absolute -right-8 -top-14 h-32 w-48 rotate-[-24deg] rounded-full border border-white/80"/>
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3.5">
              <ShoppingBag size={34} strokeWidth={1.7} className="shrink-0 text-[#ec0078]"/>
              <div className="min-w-0">
                <h2 className="font-serif text-[18px] font-medium leading-tight tracking-[-0.025em] text-[#111827] sm:text-[20px]">Shopping Bag ({totalCount})</h2>
                <p className="mt-1 text-xs text-[#526078] sm:text-[13px]">Review your items before checkout</p>
              </div>
            </div>
            <button ref={closeButtonRef} type="button" onClick={close} aria-label="Close shopping bag" className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/80 text-[#526078] shadow-sm ring-1 ring-[#f3e8ee] transition hover:bg-white hover:text-[#ec0078] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ec0078]"><X size={21}/></button>
          </div>
          {items.length > 0 && threshold !== undefined && <div className="mt-5 rounded-[18px] border border-[#f9e1ed] bg-[#fff2f8]/90 px-4 py-3.5 sm:px-5">
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                {isFreeDelivery ? <CheckCircle2 size={19} className="shrink-0 text-[#059669]"/> : <Sparkles size={19} className="shrink-0 text-[#ec0078]"/>}
                <p className={`text-xs font-medium leading-snug sm:text-[13px] ${isFreeDelivery ? "text-[#078451]" : "text-[#273348]"}`}>
                  {isFreeDelivery ? "Congratulations! You have FREE delivery!" : <>You’re only <span className="text-[#c90061]">{formatMoney(remainingForFreeDelivery)}</span> away from FREE delivery!</>}
                </p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-[#536078]">{Math.round(deliveryProgress)}%</span>
            </div>
            <div className="h-3.5 overflow-hidden rounded-full bg-[#f4dfe9] p-[2px]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#f12e91] to-[#e60070] transition-[width] duration-500" style={{ width: `${deliveryProgress}%` }}/>
            </div>
          </div>}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-8 sm:py-5" aria-label="Shopping bag items">
          {items.length === 0 ? <div className="flex min-h-full flex-col items-center justify-center px-4 py-10 text-center">
            <div className="mb-5 grid h-44 w-44 place-items-center overflow-hidden rounded-[28px] bg-[#fff2f8] p-3"><img src={emptyCartImg} alt="" className="h-full w-full object-contain"/></div>
            <h3 className="font-serif text-[19px] font-medium text-[#192638]">Your shopping bag is empty.</h3>
            <p className="mt-2 max-w-xs text-[13px] text-[#64748b]">Discover something you’ll love.</p>
            <Link to="/shop" onClick={close} className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#ec0078] px-6 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(236,0,120,0.2)] transition hover:bg-[#c90061]">Continue Shopping <ArrowRight size={16}/></Link>
          </div> : <div className="space-y-3.5">
            {pricedItems.map((row) => {
              const unavailable = row.stock !== undefined && row.stock <= 0;
              const overStock = row.stock !== undefined && row.item.quantity > row.stock;
              const atMax = row.stock !== undefined && row.item.quantity >= row.stock;
              return <article key={`${row.item.id}-${row.item.variantId || row.item.selectedSize || "default"}`} className="grid grid-cols-[84px_minmax(0,1fr)] gap-3.5 rounded-[20px] border border-[#e9e8ee] bg-white p-3.5 shadow-[0_3px_12px_rgba(28,31,48,0.07)] sm:gap-4 sm:p-4">
                <Link to={`/product/${row.item.slug}`} onClick={close} aria-label={`View ${row.item.name}`} className="h-[84px] w-[84px] overflow-hidden rounded-[18px] ring-1 ring-[#f1e9ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ec0078]"><CartItemImage src={row.imageUrl} alt={row.item.name}/></Link>
                <div className="flex min-w-0 flex-col justify-between gap-2">
                  <div className="min-w-0">
                    {row.brand && <p className="truncate text-[10px] font-medium uppercase tracking-[0.08em] text-[#7d879a]">{row.brand}</p>}
                    <Link to={`/product/${row.item.slug}`} onClick={close} className="mt-0.5 block line-clamp-2 text-xs font-medium leading-snug text-[#111827] hover:text-[#c90061] sm:text-[13px]">{row.item.name}</Link>
                    {row.item.selectedSize && <p className="mt-0.5 truncate text-[11px] text-[#64748b]">{row.item.selectedSize}</p>}
                    {row.stock !== undefined && <span className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${unavailable || overStock ? "bg-[#fff0f0] text-[#c2414b]" : "bg-[#e5f7f1] text-[#078451]"}`}>
                      <CheckCircle2 size={12}/>{unavailable ? "Out of stock" : overStock ? `Only ${row.stock} left` : "In stock"}
                    </span>}
                    {isCatalogLoading && !row.product && <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-[#8190a7]"><LoaderCircle size={12} className="animate-spin"/>Checking stock</span>}
                  </div>
                  <div className="flex min-w-0 items-end justify-between gap-2">
                    <div className="inline-flex h-[34px] items-center overflow-hidden rounded-xl border border-[#d9dce5] bg-white">
                      <button type="button" onClick={() => updateItemQuantity(row, row.item.quantity - 1)} disabled={row.item.quantity <= 1} aria-label={`Decrease ${row.item.name} quantity`} className="grid h-full w-10 place-items-center text-[#718096] transition hover:bg-[#fff2f8] hover:text-[#ec0078] disabled:cursor-not-allowed disabled:opacity-40"><Minus size={16}/></button>
                      <span aria-live="polite" className="grid h-full min-w-9 place-items-center bg-[#f8f8fa] text-[13px] font-medium text-[#192638]">{row.item.quantity}</span>
                      <button type="button" onClick={() => updateItemQuantity(row, row.item.quantity + 1)} disabled={atMax || unavailable} aria-label={`Increase ${row.item.name} quantity`} className="grid h-full w-10 place-items-center text-[#526078] transition hover:bg-[#fff2f8] hover:text-[#ec0078] disabled:cursor-not-allowed disabled:opacity-40"><Plus size={16}/></button>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                      <span className="text-[13px] font-medium tabular-nums text-[#111827] sm:text-sm">{formatMoney(row.unitPrice * row.item.quantity)}</span>
                      <button type="button" onClick={() => { dispatch(removeFromCart({ id: row.item.id, selectedSize: row.item.selectedSize })); toast.success("Item removed from your bag."); }} aria-label={`Remove ${row.item.name}`} title="Remove item" className="grid h-8 w-8 place-items-center rounded-lg text-[#8a93a5] transition hover:bg-[#fff0f0] hover:text-[#be4051]"><Trash2 size={18}/></button>
                    </div>
                  </div>
                </div>
              </article>;
            })}
          </div>}
        </div>

        {items.length > 0 && <footer className="shrink-0 border-t border-[#eee8ee] bg-white px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-3.5 shadow-[0_-6px_24px_rgba(34,22,37,0.04)] sm:px-8 sm:pt-4">
          <div className="space-y-3">
            <section className="overflow-hidden rounded-[17px] border border-[#fae0ed] bg-gradient-to-r from-[#fff1f7] to-[#fff7fb]">
              <button type="button" aria-expanded={couponOpen} onClick={() => setCouponOpen((open) => !open)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
                <span className="flex min-w-0 items-center gap-3"><TicketPercent size={22} className="shrink-0 text-[#e60070]"/><span className="min-w-0"><strong className="block text-xs font-medium text-[#192638]">{appliedCode ? `Promo code ${appliedCode} applied` : "Have a promo code?"}</strong><span className="mt-0.5 block truncate text-[10px] text-[#64748b]">{appliedCode ? couponMessage || "Your discount is included below." : "Apply your code and get an extra discount"}</span></span></span>
                <span className="inline-flex h-8 shrink-0 items-center gap-1 rounded-xl border border-[#f69ac8] bg-white/80 px-2.5 text-xs font-medium text-[#bf075d]">{appliedCode ? "Applied" : couponOpen ? "Close" : "Apply Code"}<ArrowRight size={14} className={couponOpen ? "rotate-90" : ""}/></span>
              </button>
              {couponOpen && <div className="border-t border-[#f8dbe9] px-4 pb-3.5 pt-3">
                {appliedCode ? <div className="flex items-center justify-between gap-3 text-sm"><span className="inline-flex items-center gap-1.5 font-semibold text-[#078451]"><CheckCircle2 size={16}/>{appliedCode} applied</span><button type="button" onClick={handleRemoveCoupon} className="text-xs font-bold text-[#c90061] underline underline-offset-2">Remove</button></div> : <form onSubmit={(event) => void handleApplyCoupon(event)} className="flex gap-2"><input aria-label="Promo code" value={couponInput} onChange={(event) => setCouponInput(event.target.value)} placeholder="Enter promo code" className="min-w-0 flex-1 rounded-xl border border-[#e8dce4] bg-white px-3 py-2.5 text-sm uppercase text-[#192638] outline-none placeholder:normal-case placeholder:text-[#9aa3b2] focus:border-[#ec0078] focus:ring-2 focus:ring-[#ec0078]/10"/><button type="submit" disabled={isValidatingCoupon || !couponInput.trim()} className="inline-flex min-w-[78px] items-center justify-center rounded-xl bg-[#ec0078] px-3.5 text-sm font-bold text-white transition hover:bg-[#c90061] disabled:cursor-not-allowed disabled:opacity-55">{isValidatingCoupon ? <LoaderCircle size={16} className="animate-spin"/> : "Apply"}</button></form>}
                {couponError && <p role="alert" className="mt-2 text-xs font-medium text-[#be4051]">{couponError}</p>}
                {couponMessage && !appliedCode && <p role="status" className="mt-2 text-xs font-medium text-[#078451]">{couponMessage}</p>}
              </div>}
            </section>

            <div className="space-y-1.5 px-1 text-xs">
              <div className="flex items-center justify-between"><span className="text-[#526078]">Subtotal</span><strong className="font-medium tabular-nums text-[#192638]">{formatMoney(subtotal)}</strong></div>
              {productSavings > 0 && <div className="flex items-center justify-between text-[#078451]"><span>Product discount</span><strong className="tabular-nums">−{formatMoney(productSavings)}</strong></div>}
              {appliedDiscount > 0 && <div className="flex items-center justify-between text-[#078451]"><span>Promo discount{appliedCode ? ` (${appliedCode})` : ""}</span><strong className="tabular-nums">−{formatMoney(appliedDiscount)}</strong></div>}
              <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-[#526078]"><Truck size={15}/>Delivery</span>{isFreeDelivery ? <span className="rounded-full bg-[#e5f7f1] px-2.5 py-1 text-xs font-bold text-[#078451]">FREE</span> : <span className="text-xs font-medium text-[#7c8799]">Calculated at checkout</span>}</div>
              {totalSavings > 0 && <div className="flex items-center justify-between font-semibold text-[#e60070]"><span className="inline-flex items-center gap-1.5">Savings <Sparkles size={13}/></span><strong className="tabular-nums">−{formatMoney(totalSavings)}</strong></div>}
              <div className="mt-2 flex items-center justify-between border-t border-[#eee8ee] pt-2.5"><span className="font-serif text-[18px] font-medium text-[#111827]">{isFreeDelivery ? "Grand Total" : "Estimated Total"}</span><strong className="text-[20px] font-semibold leading-none tabular-nums text-[#ec0078]">{formatMoney(estimatedTotal)}</strong></div>
              {!isFreeDelivery && <p className="text-right text-[10px] text-[#8992a2]">Delivery charge is confirmed at checkout.</p>}
            </div>
          </div>

          {hasInvalidStock && <p role="alert" className="mt-2 rounded-lg bg-[#fff0f0] px-3 py-2 text-xs font-semibold text-[#be4051]">Some items exceed current stock. Update quantities before checkout.</p>}
          {isCatalogError && <p className="mt-2 text-[10px] text-[#8992a2]">We’ll recheck stock and pricing at checkout.</p>}
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <button type="button" onClick={navigateToCart} className="h-[44px] rounded-xl border border-[#b8a6bd] bg-white px-2 text-xs font-normal text-[#192638] transition hover:bg-[#fff7fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ec0078]">View My Cart</button>
            <button type="button" onClick={navigateToCheckout} disabled={!items.length || !cartCatalogIdsReady || hasInvalidStock} className="inline-flex h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f22d91] to-[#e60070] px-2 text-xs font-medium text-white shadow-[0_8px_18px_rgba(236,0,120,0.2)] transition hover:from-[#df187d] hover:to-[#c90061] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ec0078] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">Checkout <ArrowRight size={15}/></button>
          </div>
          <div className="mt-3 flex items-center justify-between divide-x divide-[#e9e3e9] text-[10px] font-medium leading-tight text-[#526078] sm:text-[11px]">
            <span className="flex flex-1 items-center justify-center gap-1.5 px-1"><ShieldCheck size={17} className="shrink-0 text-[#ec0078]"/>Secure checkout</span>
            <span className="flex flex-1 items-center justify-center gap-1.5 px-1"><RotateCcw size={16} className="shrink-0 text-[#ec0078]"/>Easy returns</span>
            <span className="flex flex-1 items-center justify-center gap-1.5 px-1"><CheckCircle2 size={16} className="shrink-0 text-[#ec0078]"/>Product details provided</span>
          </div>
        </footer>}
      </aside>
    </>
  );
};

export default CartDrawer;
