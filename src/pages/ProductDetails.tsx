import { FormEvent, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight, BadgeCheck, Check, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, Clock3, Gift, Heart, Leaf, Minus, Plus, RotateCcw, ShieldCheck,
  ShoppingBag, ShoppingCart, Star, Truck,
} from "lucide-react";
import { toast } from "sonner";
import { addToCart } from "@/redux/features/cart/cartSlice";
import {
  StoreProduct, StoreReview, useAddWishlistItemMutation, useCreateProductReviewMutation,
  useGetProductReviewsQuery, useGetStoreProductQuery, useGetStoreProductsQuery,
  useGetWishlistQuery, useRemoveWishlistItemMutation,
} from "@/redux/features/storefront/storefrontApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";

const apiOrigin = (import.meta.env.VITE_API_ENDPOINT || "http://localhost:4001/api/v1").replace(/\/api\/v\d+\/?$/, "");
const imageUrl = (url?: string | null) => !url ? "" : /^https?:\/\//i.test(url) ? url : `${apiOrigin}${url.startsWith("/") ? "" : "/"}${url}`;
const money = (amount: number | string) => `৳${Number(amount || 0).toLocaleString("en-BD", { maximumFractionDigits: 2 })}`;
const recordText = (value: unknown): string => {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.map(recordText).filter(Boolean).join(", ");
  return "";
};
const errorMessage = (error: unknown) => {
  const data = (error as { data?: { message?: string | string[] } })?.data;
  return Array.isArray(data?.message) ? data.message.join(" ") : data?.message || "Please try again in a moment.";
};

const ProductDetails = () => {
  const { slug = "" } = useParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { data: response, isLoading, isError, refetch } = useGetStoreProductQuery(slug, { skip: !slug });
  const product = response?.data;
  const images = useMemo(() => {
    if (!product) return [];
    return [...(product.media || [])].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder)
      .map((media) => ({ src: imageUrl(media.imageUrl), thumb: imageUrl(media.thumbnailUrl || media.imageUrl), alt: media.altText || product.name, id: media.id }))
      .filter((media) => media.src);
  }, [product]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("Overview");
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<string[]>([]);

  const { data: wishlistResponse } = useGetWishlistQuery(undefined, { skip: !user });
  const [addWishlist, { isLoading: addingWishlist }] = useAddWishlistItemMutation();
  const [removeWishlist, { isLoading: removingWishlist }] = useRemoveWishlistItemMutation();
  const isWishlisted = !!product && (wishlistResponse?.data || []).some((entry) => entry.product?.id === product.id);
  const [createReview, { isLoading: submittingReview }] = useCreateProductReviewMutation();
  const { data: reviewsResponse, isFetching: reviewsLoading } = useGetProductReviewsQuery(
    { productId: product?.id || "", page: reviewPage, limit: 5 }, { skip: !product || tab !== "Reviews" },
  );
  const relatedQuery = useGetStoreProductsQuery({
    page: 1, limit: 5, ...(product?.category?.slug ? { category: product.category.slug } : {}), sort: "popularity",
  }, { skip: !product });
  const related = (relatedQuery.data?.data || []).filter((item) => item.id !== product?.id);

  const [selectedVariantId, setSelectedVariantId] = useState("");
  const variant = product?.variants.find((item) => item.id === selectedVariantId)
    || product?.variants.find((item) => item.isDefault) || product?.variants[0];
  const productPrice = Number(variant?.sellingPrice ?? product?.salePrice ?? product?.price ?? 0);
  const originalPrice = Number(product?.price || 0);
  const inStock = variant ? variant.stockQuantity > 0 : Number(product?.stock || 0) > 0;
  const stockCount = variant?.stockQuantity ?? product?.stock ?? 0;
  const discount = originalPrice > productPrice ? Math.round((1 - productPrice / originalPrice) * 100) : 0;
  const image = images[activeImage]?.src || "";
  const details = product?.cosmeticDetails || {};
  const ingredients = product?.productIngredients || [];
  const compatibility = product?.skinCompatibility || [];
  const concerns = product?.concernCompatibility || [];
  const benefits = Array.isArray(details.benefits) ? details.benefits.map(recordText).filter(Boolean) : [];
  const usage = recordText(details.howToUse || details.usageInstructions || details.directions);

  if (isLoading) return <main className="min-h-[70vh] bg-[#fff9fc] px-5 py-10"><div className="mx-auto max-w-6xl animate-pulse"><div className="h-5 w-1/3 rounded bg-pink-100"/><div className="mt-8 grid gap-8 lg:grid-cols-2"><div className="aspect-square rounded-3xl bg-pink-100"/><div className="space-y-5"><div className="h-10 rounded bg-pink-100"/><div className="h-24 rounded bg-pink-100"/><div className="h-14 rounded bg-pink-100"/></div></div></div></main>;
  if (isError || !product) return <main className="grid min-h-[65vh] place-items-center bg-[#fff9fc] px-5"><div className="max-w-lg rounded-3xl border border-rose-200 bg-white p-9 text-center shadow-sm"><CircleHelp className="mx-auto text-[#e72c7e]" size={38}/><h1 className="mt-4 text-2xl font-bold text-[#172443]">We couldn’t load this product</h1><p className="mt-2 text-slate-600">Check that the product is published and the storefront API is available.</p><button onClick={() => void refetch()} className="mt-5 rounded-xl bg-[#e72c7e] px-6 py-3 font-semibold text-white">Retry</button><Link to="/shop" className="ml-4 text-sm font-semibold text-[#a20e4c]">Back to shop</Link></div></main>;

  const wishlistAction = async () => {
    if (!user) { toast.info("Sign in to save this product to your wishlist."); return; }
    try {
      if (isWishlisted) await removeWishlist(product.id).unwrap();
      else await addWishlist({ productId: product.id }).unwrap();
      toast.success(isWishlisted ? "Removed from your wishlist." : "Saved to your wishlist.");
    } catch (error) { toast.error(errorMessage(error)); }
  };

  const addProductToCart = (item: StoreProduct, count = 1, openDrawer = true) => {
    const itemVariant = item.id === product.id ? variant : item.variants.find((v) => v.isDefault) || item.variants[0];
    const price = Number(itemVariant?.sellingPrice ?? item.salePrice ?? item.price);
    const itemImages = item.media || [];
    const itemImage = imageUrl(itemImages.find((m) => m.isPrimary)?.imageUrl || itemImages[0]?.imageUrl);
    dispatch(addToCart({
      id: item.id, slug: item.slug, name: item.name, price,
      ...(Number(item.price) > price ? { originalPrice: Number(item.price) } : {}),
      image: itemImage, brand: item.brand?.name || undefined, category: item.category?.slug,
      selectedSize: itemVariant?.variantName || undefined, quantity: count, openDrawer,
    }));
  };
  const addBundle = () => {
    addProductToCart(product, 1, false);
    related.filter((item) => selectedBundle.includes(item.id)).forEach((item) => addProductToCart(item, 1, false));
    toast.success("Selected products added to your cart.");
  };
  const submitReview = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) { toast.info("Please sign in to review this product."); return; }
    if (reviewText.trim().length < 5) { toast.error("Please write a little more about your experience."); return; }
    try {
      await createReview({ productId: product.id, rating: reviewRating, title: reviewTitle.trim() || undefined, comment: reviewText.trim() }).unwrap();
      toast.success("Your review was submitted."); setReviewText(""); setReviewTitle(""); setShowReviewForm(false);
    } catch (error) { toast.error(errorMessage(error)); }
  };

  const tabs = ["Overview", "How to Use", "Ingredients", `Reviews (${product.reviewSummary?.reviewCount || 0})`, "FAQ"];
  const attributes = [...(product.attributes || [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const featureChips = [
    ...(compatibility.slice(0, 1).map((item) => recordText(item.skinType || item.skinTypeName || item.name)).filter(Boolean)),
    ...(concerns.slice(0, 1).map((item) => recordText(item.concern || item.concernName || item.name)).filter(Boolean)),
    ...(product.authenticityVerified ? ["Verified product"] : []),
  ].slice(0, 3);
  const reviewSummary = product.reviewSummary || { averageRating: 0, reviewCount: 0, distribution: {} };

  return <main className="min-h-screen bg-[#fffafd] pb-16 text-[#171d36]">
    <div className="mx-auto max-w-[1440px] px-4 pb-8 pt-4 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm">
        <Link to="/" className="rounded-sm transition-colors hover:text-[#e72c7e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e72c7e]/40">Home</Link><ChevronRight size={14}/>
        <Link to="/shop" className="rounded-sm transition-colors hover:text-[#e72c7e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e72c7e]/40">Shop</Link>
        <ChevronRight size={14}/><span className="max-w-64 truncate text-slate-700">{product.name}</span>
      </nav>

      <section className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.25fr)] xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1.3fr)] xl:gap-7">
        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-3">
          <div className="order-2 flex min-w-0 flex-row gap-2.5 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:overflow-visible sm:pb-0">
            {images.map((media, index) => <button key={media.id} onClick={() => setActiveImage(index)} aria-label={`Show product image ${index + 1}`} className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e72c7e]/40 sm:aspect-square sm:h-auto sm:w-full ${activeImage === index ? "border-[#e72c7e] ring-2 ring-pink-100" : "border-pink-100 hover:-translate-y-0.5 hover:border-[#e72c7e] hover:shadow-md"}`}><img src={media.thumb} alt={media.alt} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" loading={index > 2 ? "lazy" : "eager"}/></button>)}
            {images.length > 4 && <button onClick={() => setActiveImage((activeImage + 1) % images.length)} aria-label="Show more product images" className="grid aspect-square place-items-center rounded-xl bg-white text-[#7b3157] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#fff0f7] hover:text-[#e72c7e] hover:shadow-md"><ChevronDown size={20}/></button>}
          </div>
          <div className="group relative order-1 aspect-square min-w-0 overflow-hidden rounded-[22px] border border-pink-100 bg-[#fff0f7] shadow-sm sm:order-2 sm:aspect-square sm:max-h-[560px]">
            {image ? <img src={image} alt={images[activeImage]?.alt || product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" fetchPriority="high"/> : <div className="grid h-full place-items-center text-center text-sm text-slate-500"><ShoppingBag size={42} className="mx-auto mb-3 text-pink-300"/>Product image unavailable</div>}
            {discount > 0 && <span className="absolute left-4 top-4 rounded-full bg-[#e72c7e] px-3 py-1.5 text-xs font-bold text-white">-{discount}% OFF</span>}
            <button onClick={() => void wishlistAction()} disabled={addingWishlist || removingWishlist} aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-[#ad165b] shadow-sm transition-all duration-200 hover:scale-110 hover:bg-white hover:text-[#e90068] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e72c7e]/50 disabled:opacity-60"><Heart size={20} fill={isWishlisted ? "currentColor" : "none"}/></button>
            {images.length > 1 && <><button onClick={() => setActiveImage((activeImage - 1 + images.length) % images.length)} aria-label="Previous image" className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#26324b] opacity-0 shadow transition-all duration-200 hover:bg-[#e90068] hover:text-white group-hover:opacity-100 focus-visible:opacity-100"><ChevronLeft size={20}/></button><button onClick={() => setActiveImage((activeImage + 1) % images.length)} aria-label="Next image" className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#26324b] opacity-0 shadow transition-all duration-200 hover:bg-[#e90068] hover:text-white group-hover:opacity-100 focus-visible:opacity-100"><ChevronRight size={20}/></button></>}
          </div>
        </div>

        <div className="min-w-0">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_116px] xl:grid-cols-[minmax(0,1fr)_128px]">
            <div>
              <Link to={product.brand ? `/shop?brand=${encodeURIComponent(product.brand.slug)}` : "/shop"} className="text-sm font-bold text-[#e72c7e]">{product.brand?.name || product.manufacturer || "Shop Now"}</Link>
              <h1 className="mt-1 text-2xl font-extrabold leading-tight tracking-tight text-[#101a3d] sm:text-[27px]">{product.name}</h1>
              <button type="button" onClick={() => setTab("Reviews")} className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <span className="flex text-amber-400">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={18} className={index < Math.round(reviewSummary.averageRating) ? "fill-current" : "text-slate-300"}/>)}</span>
                <strong>{Number(reviewSummary.averageRating || 0).toFixed(1)}</strong><span className="text-slate-500">({reviewSummary.reviewCount.toLocaleString()} reviews)</span>
              </a>
              <p className="mt-3 max-w-2xl leading-relaxed text-slate-700">{product.shortDescription || product.description || "Explore product details and specifications below."}</p>
            </div>
            <aside className="relative hidden min-h-[116px] self-start overflow-hidden rounded-2xl bg-gradient-to-br from-[#fff0f8] via-[#ffe9f4] to-[#ffd5e9] p-3 text-center sm:block xl:min-h-[132px] xl:p-3.5">
              <div aria-hidden="true" className="pointer-events-none absolute -right-4 -top-5 h-16 w-16 rounded-full bg-white/50 blur-xl"/>
              <Gift className="relative mx-auto text-[#e72c7e]" size={24}/>
              <p className="relative mt-2 text-xs font-extrabold leading-tight text-[#171d36]">Delivery<br/>information</p>
              <div className="relative mt-2 flex items-center justify-center gap-1.5 text-[#d20c64]"><Truck size={17}/><span className="text-[10px] font-semibold text-slate-700">At checkout</span></div>
              <p className="relative mt-1 text-[10px] leading-snug text-slate-600">Options and cost shown before payment.</p>
            </aside>
          </div>

          {featureChips.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{featureChips.map((chip, index) => <span key={`${chip}-${index}`} className="inline-flex items-center gap-2 rounded-full bg-[#fff0f7] px-3 py-2 text-xs font-semibold text-[#4b2441]"><ShieldCheck size={16} className="text-[#e72c7e]"/>{chip}</span>)}</div>}

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1"><strong className="text-3xl font-extrabold text-[#c00759] sm:text-4xl">{money(productPrice)}</strong>{discount > 0 && <><span className="text-base text-slate-400 line-through">{money(originalPrice)}</span><span className="rounded-full bg-[#ffe0ef] px-3 py-1 text-sm font-bold text-[#c00759]">{discount}% OFF</span></>}</div>
          <p className={`mt-2 flex items-center gap-2 text-sm font-semibold ${inStock ? "text-emerald-700" : "text-rose-600"}`}><span className={`h-2.5 w-2.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-rose-500"}`}/>{inStock ? `In stock${stockCount <= 5 ? ` Â· Only ${stockCount} left` : ""}` : "Currently out of stock"}</p>

          {product.variants.length > 0 && <label className="mt-4 block max-w-sm text-sm font-semibold">Choose option<select value={variant?.id || ""} onChange={(event) => { setSelectedVariantId(event.target.value); setQuantity(1); }} className="mt-2 h-11 w-full rounded-xl border border-pink-200 bg-white px-3 text-sm font-normal outline-none focus:border-[#e72c7e]">{product.variants.map((item) => <option key={item.id} value={item.id}>{item.variantName}{item.size ? ` Â· ${item.size}` : ""}{item.color ? ` Â· ${item.color}` : ""} â€” {money(item.sellingPrice)}{item.stockQuantity <= 0 ? " Â· Out of stock" : ""}</option>)}</select></label>}
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex h-11 items-center rounded-full border border-pink-100 bg-white shadow-sm"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1} aria-label="Decrease quantity" className="grid h-10 w-10 place-items-center rounded-full text-slate-700 transition-colors hover:bg-[#fff0f7] hover:text-[#e90068] disabled:opacity-40"><Minus size={15}/></button><span className="min-w-7 text-center text-sm font-bold">{quantity}</span><button onClick={() => setQuantity(Math.min(stockCount || 1, quantity + 1))} disabled={!inStock || quantity >= stockCount} aria-label="Increase quantity" className="grid h-10 w-10 place-items-center rounded-full text-slate-700 transition-colors hover:bg-[#fff0f7] hover:text-[#e90068] disabled:opacity-40"><Plus size={16}/></button></div>
            <button onClick={() => { addProductToCart(product, quantity, true); toast.success("Added to your cart."); }} disabled={!inStock} className="inline-flex min-w-[175px] flex-1 items-center justify-center gap-2 rounded-full bg-[#e90068] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#c9005b] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e90068]/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:translate-y-0 disabled:hover:shadow-none sm:flex-none"><ShoppingCart size={19}/>Add to Cart</button>
            <button onClick={() => { if (!inStock) return; addProductToCart(product, quantity, true); toast.success("Product added. Continue to checkout from your cart."); }} disabled={!inStock} className="inline-flex min-w-[145px] flex-1 items-center justify-center gap-2 rounded-full border border-[#e90068] bg-white px-5 py-3 text-sm font-bold text-[#c00759] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#fff0f7] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e90068]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 sm:flex-none"><ShoppingBag size={18}/>Buy Now</button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-pink-100 bg-white p-4 text-xs sm:grid-cols-4"><div className="flex items-center gap-2"><ShieldCheck className="shrink-0 text-[#e72c7e]" size={20}/><span>Secure checkout</span></div><div className="flex items-center gap-2"><Truck className="shrink-0 text-[#e72c7e]" size={20}/><span>Delivery at checkout</span></div><div className="flex items-center gap-2"><RotateCcw className="shrink-0 text-[#e72c7e]" size={20}/><span>See return policy</span></div><div className="flex items-center gap-2"><BadgeCheck className="shrink-0 text-[#e72c7e]" size={20}/><span>{product.authenticityVerified ? "Authenticity verified" : "Product details provided"}</span></div></div>
        </div>
      </section>

      <nav className="sticky top-0 z-20 mt-7 flex overflow-x-auto rounded-2xl border border-pink-100 bg-white/95 px-2 shadow-sm backdrop-blur" aria-label="Product information" role="tablist">
        {tabs.map((item) => { const tabKey = item.startsWith("Reviews") ? "Reviews" : item; return <button key={item} type="button" role="tab" aria-selected={tab === tabKey} aria-controls="product-tabpanel" onClick={() => setTab(tabKey)} className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#e72c7e]/40 sm:px-6 ${tab === tabKey ? "border-[#e72c7e] text-[#d20c64]" : "border-transparent text-slate-600 hover:border-pink-200 hover:bg-[#fff8fb] hover:text-[#d20c64]"}`}>{item}</button>; })}
      </nav>

      <div id="product-tabpanel" role="tabpanel" aria-live="polite" className="mt-3">
        {tab === "Overview" && <>      <section id="product-info" className="mt-3 grid scroll-mt-20 gap-4 lg:grid-cols-[1.6fr_0.9fr]">
        <article className="grid overflow-hidden rounded-3xl border border-pink-100 bg-gradient-to-r from-[#fff0f7] to-[#fff7fb] sm:grid-cols-[0.8fr_1.2fr]">
          <div className="min-h-48 bg-pink-100/50">{images[0] && <img src={images[0].src} alt={images[0].alt} className="h-full max-h-72 w-full object-cover" loading="lazy"/>}</div>
          <div className="p-5 sm:p-7"><h2 className="text-xl font-bold">About this product</h2><p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{product.description || product.shortDescription || "No additional product description has been added yet."}</p>{benefits.length > 0 && <ul className="mt-4 space-y-2">{benefits.slice(0, 5).map((benefit, index) => <li key={`${benefit}-${index}`} className="flex gap-2 text-sm"><Check size={17} className="mt-0.5 shrink-0 text-[#e72c7e]"/>{benefit}</li>)}</ul>}</div>
        </article>
        <article className="rounded-3xl border border-pink-100 bg-[#fff2f8] p-5 sm:p-7"><h2 className="text-xl font-bold">Product highlights</h2><div className="mt-4 grid grid-cols-2 gap-3">{(featureChips.length ? featureChips : [product.category?.name, product.subCategory?.name, product.productCategory, product.condition].filter(Boolean) as string[]).slice(0, 4).map((item, index) => <div key={`${item}-${index}`} className="rounded-2xl bg-white p-3 text-center"><Leaf className="mx-auto mb-2 text-[#e72c7e]" size={22}/><span className="text-xs font-semibold">{item}</span></div>)}</div></article>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-gradient-to-r from-[#fff0f7] via-white to-[#fff0f7] p-4 sm:grid-cols-4 sm:gap-4 sm:p-5">{[[ShieldCheck,"Product information",product.authenticityVerified ? "Verified details" : "See specifications"],[RotateCcw,"Returns","Review policy at checkout"],[ShoppingBag,"Payment","Options at checkout"],[Clock3,"Support","Shop Now support"]].map(([Icon,title,caption], index) => { const IconComponent = Icon as typeof ShieldCheck; return <div key={String(title)} className={`flex items-center gap-2 sm:justify-center ${index ? "sm:border-l sm:border-pink-100" : ""}`}><IconComponent className="shrink-0 text-[#e72c7e]" size={23}/><div><p className="text-xs font-bold">{String(title)}</p><p className="text-[11px] text-slate-600">{String(caption)}</p></div></div>; })}</section>

      {related.length > 0 && <section className="mt-5 rounded-3xl border border-pink-100 bg-gradient-to-r from-[#fff0f7] to-[#fff8fc] p-4 sm:p-6"><div className="grid gap-5 lg:grid-cols-[220px_1fr_180px] lg:items-center"><div><span className="text-xs font-bold uppercase tracking-wider text-[#d20c64]">Complete your routine</span><h2 className="mt-1 text-2xl font-extrabold">Frequently bought together</h2><p className="mt-2 text-sm text-slate-600">Choose related products to add them with this item.</p></div><div className="flex gap-3 overflow-x-auto pb-2">{[product, ...related.slice(0, 3)].map((item, index) => { const itemPrice = Number(item.variants.find((v) => v.isDefault)?.sellingPrice ?? item.salePrice ?? item.price); const checked = item.id === product.id || selectedBundle.includes(item.id); return <button key={item.id} onClick={() => item.id !== product.id && setSelectedBundle((old) => checked ? old.filter((id) => id !== item.id) : [...old, item.id])} className={`relative w-32 shrink-0 rounded-2xl border bg-white p-2 text-left ${checked ? "border-[#e72c7e]" : "border-pink-100"}`}><span className={`absolute right-2 top-2 grid h-5 w-5 place-items-center rounded border ${checked ? "border-[#e72c7e] bg-[#e72c7e] text-white" : "border-slate-300"}`}>{checked && <Check size={13}/>}</span><div className="aspect-square overflow-hidden rounded-xl bg-pink-50">{(item.media || [])[0] && <img src={imageUrl(item.media.find((m) => m.isPrimary)?.imageUrl || item.media[0].imageUrl)} alt={item.name} className="h-full w-full object-cover" loading="lazy"/>}</div><p className="mt-2 line-clamp-2 text-xs font-semibold">{index === 0 ? "This product · " : ""}{item.name}</p><p className="mt-1 text-sm font-bold text-[#c00759]">{money(itemPrice)}</p></button>; })}</div><div className="text-center lg:text-right"><p className="text-xs text-slate-600">Selected total</p><strong className="text-2xl text-[#c00759]">{money(productPrice + related.filter((item) => selectedBundle.includes(item.id)).reduce((total, item) => total + Number(item.variants.find((v) => v.isDefault)?.sellingPrice ?? item.salePrice ?? item.price), 0))}</strong><button onClick={addBundle} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#e90068] px-4 py-3 text-sm font-bold text-white hover:bg-[#c9005b]"><ShoppingCart size={17}/>Add selected</button></div></div></section>}

      <section className="mt-6">
        <article className="rounded-3xl border border-pink-100 bg-white p-5 sm:p-7">
          <h2 className="text-2xl font-extrabold">Product information</h2>
          <div className="mt-4 divide-y divide-pink-100">{([
            ["Brand", product.brand?.name], ["Category", product.category?.name], ["Subcategory", product.subCategory?.name], ["Manufacturer", product.manufacturer], ["Country of origin", product.countryOfOrigin], ["Condition", product.condition], ["Authenticity", product.authenticityType], ["SKU", variant?.sku],
            ...attributes.map((attribute) => [attribute.name, attribute.value]),
          ] as Array<[string, string | null | undefined]>).filter(([, value]) => value).map(([label, value], index) => <div key={`${label}-${index}`} className="flex justify-between gap-4 py-3 text-sm"><span className="text-slate-500">{label}</span><span className="text-right font-medium">{value}</span></div>)}</div>
        </article>
      </section>
      {related.length > 0 && <section className="mt-10"><div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-extrabold">You may also like</h2><Link to={`/shop${product.category?.slug ? `?category=${encodeURIComponent(product.category.slug)}` : ""}`} className="text-sm font-bold text-[#e72c7e]">View all <ArrowRight className="ml-1 inline" size={16}/></Link></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{related.slice(0,4).map((item) => { const itemMedia = item.media?.find((m) => m.isPrimary) || item.media?.[0]; const itemPrice = Number(item.variants.find((v) => v.isDefault)?.sellingPrice ?? item.salePrice ?? item.price); return <Link to={`/product/${item.slug}`} key={item.id} className="overflow-hidden rounded-2xl border border-pink-100 bg-white transition hover:-translate-y-0.5 hover:shadow-md"><div className="aspect-square bg-[#fff0f7]">{itemMedia && <img src={imageUrl(itemMedia.imageUrl)} alt={itemMedia.altText || item.name} className="h-full w-full object-cover" loading="lazy"/>}</div><div className="p-3"><h3 className="line-clamp-2 text-sm font-bold">{item.name}</h3><div className="mt-2 flex items-center justify-between gap-2"><strong className="text-[#a20e4c]">{money(itemPrice)}</strong><span className="flex items-center gap-1 text-xs text-slate-500"><Star size={13} className="fill-amber-400 text-amber-400"/>{Number(item.reviewSummary?.averageRating || 0).toFixed(1)}</span></div></div></Link>; })}</div></section>}
        </>}
        {tab === "How to Use" && (
      <section id="how-to-use" className="mt-4 scroll-mt-24 rounded-3xl border border-pink-100 bg-white p-5 sm:p-7"><h2 className="text-2xl font-extrabold">How to use</h2><p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{usage || "Usage instructions have not been added for this product. Follow the packaging directions."}</p></section>
        )}
        {tab === "Ingredients" && (
      <section id="ingredients" className="scroll-mt-24 rounded-3xl border border-pink-100 bg-white p-5 sm:p-7"><h2 className="text-2xl font-extrabold">Ingredients &amp; compatibility</h2>{ingredients.length > 0 ? <div className="mt-4 space-y-3">{ingredients.map((raw, index) => { const item = raw as Record<string, unknown>; const description = [item.inciName, item.functions, item.description].map(recordText).filter(Boolean).join(" · "); return <div key={String(item.id || index)} className="rounded-2xl bg-[#fff7fb] p-4"><p className="font-bold">{recordText(item.name || item.ingredientName || item.inciName) || "Ingredient"}</p>{description && <p className="mt-1 text-sm text-slate-600">{description}</p>}</div>; })}</div> : <p className="mt-3 text-sm text-slate-600">Ingredient details have not been added for this product.</p>}
          {(compatibility.length > 0 || concerns.length > 0) && <div className="mt-5 flex flex-wrap gap-2">{[...compatibility, ...concerns].map((raw, index) => { const item = raw as Record<string, unknown>; const label = recordText(item.skinType || item.concern || item.name || item.value); return label ? <span key={`${label}-${index}`} className="rounded-full bg-[#fff0f7] px-3 py-1.5 text-xs font-medium text-[#70284f]">{label}</span> : null; })}</div>}
          {product.contraindications?.length ? <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4"><strong className="text-sm">Please note</strong><p className="mt-1 text-sm">{product.contraindications.map(recordText).filter(Boolean).join(" · ")}</p></div> : null}
      </section>
        )}
        {tab === "Reviews" && (
      <section id="reviews" className="mt-8 scroll-mt-24 border-t border-pink-100 pt-7">
        <h2 className="text-3xl font-extrabold">Customer reviews</h2>
        <div className="mt-5 grid gap-6 lg:grid-cols-[0.7fr_1.35fr_0.8fr] lg:items-center">
          <div><div className="flex items-end gap-2"><strong className="text-6xl font-extrabold text-[#a20e4c]">{Number(reviewSummary.averageRating || 0).toFixed(1)}</strong><span className="pb-2 text-slate-400">/5</span></div><div className="mt-1 flex text-amber-400">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={21} className={index < Math.round(reviewSummary.averageRating) ? "fill-current" : "text-slate-300"}/>)}</div><p className="mt-2 text-sm text-slate-600">Based on {reviewSummary.reviewCount.toLocaleString()} reviews</p></div>
          <div className="space-y-2">{[5,4,3,2,1].map((rating) => { const count = Number(reviewSummary.distribution?.[String(rating)] || 0); const percent = reviewSummary.reviewCount ? Math.round(count / reviewSummary.reviewCount * 100) : 0; return <div key={rating} className="flex items-center gap-3 text-xs"><span className="w-8 text-slate-600">{rating} <Star size={12} className="inline fill-amber-400 text-amber-400"/></span><div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-400" style={{ width: `${percent}%` }}/></div><span className="w-8 text-right text-slate-500">{count}</span></div>; })}</div>
          <div className="rounded-3xl border border-pink-100 p-5 text-center"><h3 className="text-lg font-bold">Review this product</h3><p className="mt-1 text-sm text-slate-600">Share your experience with other shoppers.</p><button onClick={() => setShowReviewForm((show) => !show)} className="mt-4 w-full rounded-xl bg-[#ffe5f2] px-4 py-3 font-bold text-[#a20e4c] hover:bg-[#ffd3e8]">{showReviewForm ? "Close review form" : "Write a Review"}</button></div>
        </div>
        {showReviewForm && <form onSubmit={submitReview} className="mt-5 rounded-2xl border border-pink-100 bg-white p-5"><label className="block text-sm font-semibold">Your rating<div className="mt-2 flex gap-1">{[1,2,3,4,5].map((rating) => <button type="button" key={rating} aria-label={`${rating} stars`} onClick={() => setReviewRating(rating)}><Star size={25} className={rating <= reviewRating ? "fill-amber-400 text-amber-400" : "text-slate-300"}/></button>)}</div></label><input value={reviewTitle} onChange={(event) => setReviewTitle(event.target.value)} placeholder="Review title (optional)" className="mt-4 h-11 w-full rounded-xl border border-pink-100 px-3 outline-none focus:border-pink-400"/><textarea value={reviewText} onChange={(event) => setReviewText(event.target.value)} placeholder="Tell shoppers about your experience" rows={4} className="mt-3 w-full rounded-xl border border-pink-100 p-3 outline-none focus:border-pink-400"/><button disabled={submittingReview} className="mt-3 rounded-xl bg-[#e72c7e] px-5 py-3 font-bold text-white disabled:opacity-60">{submittingReview ? "Submitting…" : "Submit review"}</button></form>}
        <div className="mt-6 space-y-3">{reviewsLoading ? <div className="animate-pulse rounded-2xl bg-pink-50 p-8"/> : (reviewsResponse?.data || []).map((review: StoreReview) => <article key={review.id} className="rounded-2xl border border-pink-100 bg-white p-4 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-2"><div><strong>{review.user?.name || "Shopper"}</strong>{review.isVerifiedPurchase && <span className="ml-2 inline-flex items-center gap-1 text-xs text-emerald-700"><BadgeCheck size={14}/>Verified purchase</span>}</div><span className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</span></div><div className="mt-1 flex text-amber-400">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={15} className={index < review.rating ? "fill-current" : "text-slate-300"}/>)}</div>{review.title && <h3 className="mt-2 font-semibold">{review.title}</h3>}<p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-700">{review.comment}</p></article>)}</div>
        {(reviewsResponse?.meta?.totalPages || 0) > 1 && <div className="mt-4 flex justify-center gap-2"><button disabled={reviewPage <= 1} onClick={() => setReviewPage((page) => page - 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Previous</button><span className="px-3 py-2 text-sm">Page {reviewPage} of {reviewsResponse?.meta?.totalPages}</span><button disabled={reviewPage >= (reviewsResponse?.meta?.totalPages || 1)} onClick={() => setReviewPage((page) => page + 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Next</button></div>}
        {!reviewsLoading && !reviewsResponse?.data?.length && <p className="mt-5 rounded-2xl bg-white p-6 text-center text-sm text-slate-500">No reviews yet. Be the first to share your experience after a purchase.</p>}
      </section>
        )}
        {tab === "FAQ" && (
      <section id="faq" className="mt-8 scroll-mt-24 rounded-3xl bg-gradient-to-r from-[#ffebf5] via-[#fff4f9] to-[#ffe5f1] p-5 sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><span className="text-xs font-bold uppercase tracking-widest text-[#c00759]">Need a hand?</span><h2 className="mt-1 text-2xl font-extrabold">Frequently asked questions</h2><p className="mt-1 text-sm text-slate-600">Availability: {inStock ? "In stock" : "Currently unavailable"}. Product stock is updated by Shop Now.</p><p className="mt-1 text-sm text-slate-600">Price: {money(productPrice)}{discount > 0 ? ` (${discount}% off)` : ""}. Delivery and return options are confirmed at checkout.</p></div><Link to={`/shop?search=${encodeURIComponent(product.name)}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e90068] px-5 py-3 text-sm font-bold text-white">Explore products <ArrowRight size={17}/></Link></div></section>
        )}
      </div>
    </div>
  </main>;
};

export default ProductDetails;
