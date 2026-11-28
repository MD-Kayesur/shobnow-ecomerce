import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Download, Heart, ImageOff, LoaderCircle, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDeleteAiLookMutation, useGetAiLooksQuery, useSetAiLookFavoriteMutation } from "@/redux/features/storefront/storefrontApi";
import { useAppSelector } from "@/redux/hooks/redux-hook";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import { addToCart } from "@/redux/features/cart/cartSlice";

const apiBase = import.meta.env.VITE_API_ENDPOINT || "http://localhost:4001/api/v1";
const origin = apiBase.replace(/\/api\/v\d+\/?$/, "");
type Look = { id: string; title?: string; createdAt: string; isFavorite?: boolean; products: Array<{ id: string; name: string; slug: string; productCategory?: string; price?: number | string; salePrice?: number | string; stock?: number; isActive?: boolean; media?: Array<{ imageUrl: string }>; variants?: Array<{ id: string; variantName: string; sellingPrice: number | string; stockQuantity: number }>; variantId?: string | null }>; imageUrl: string | null };

export default function UserAiLooksPage() {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const { data, isLoading, isError } = useGetAiLooksQuery();
  const [deleteLook] = useDeleteAiLookMutation();
  const [setFavorite] = useSetAiLookFavoriteMutation();
  const [images, setImages] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"All" | "Jewelry" | "Makeup" | "Favorites">("All");
  const looks = useMemo(() => (data?.data || []) as Look[], [data?.data]);
  const filteredLooks = useMemo(() => looks.filter((look) => {
    if (filter === "All") return true;
    if (filter === "Favorites") return !!look.isFavorite;
    return filter === "Jewelry" ? look.products[0]?.productCategory === "JEWELRY" : look.products[0]?.productCategory === "COSMETICS";
  }), [filter, looks]);

  useEffect(() => {
    let live = true;
    const created: string[] = [];
    void Promise.all(looks.filter((look) => look.imageUrl).map(async (look) => {
      const response = await fetch(`${origin}${look.imageUrl}`, { headers: { Authorization: `Bearer ${token}` }, credentials: "include" });
      if (!response.ok) throw new Error("A saved preview could not be loaded.");
      const url = URL.createObjectURL(await response.blob()); created.push(url); return [look.id, url] as const;
    })).then((rows) => { if (live) setImages(Object.fromEntries(rows)); }).catch(() => { if (live) toast.error("Some saved previews could not be loaded."); });
    return () => { live = false; created.forEach((url) => URL.revokeObjectURL(url)); };
  }, [looks, token]);

  const download = (look: Look) => { const url = images[look.id]; if (!url) return; const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${look.title || "shobnow-ai-look"}.jpg`; anchor.click(); };

  return <section className="sn-ai-looks-page">
    <header className="sn-ai-looks-heading"><div><span><Heart size={15}/> YOUR PERSONAL STYLE</span><h1>My AI Looks</h1><p>Your saved try-on previews, ready whenever you need them.</p></div><Link to="/shop">Discover products</Link></header>
    {isLoading && <div className="sn-ai-looks-state"><LoaderCircle className="sn-ai-spin"/>Loading your saved looks…</div>}
    {isError && <div className="sn-ai-looks-state">We couldn’t load your saved looks. Please refresh and try again.</div>}
    {!isLoading && !isError && looks.length === 0 && <div className="sn-ai-looks-empty"><span><ImageOff size={30}/></span><h2>Your lookbook is ready</h2><p>Save a jewelry try-on preview and it will be kept here in your account.</p><Link to="/shop">Explore jewelry</Link></div>}
    {looks.length > 0 && <><nav className="sn-ai-look-filters" aria-label="Filter saved looks">{(["All", "Jewelry", "Makeup", "Favorites"] as const).map((item) => <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</nav>{filteredLooks.length ? <div className="sn-ai-looks-grid">{filteredLooks.map((look) => { const product = look.products[0]; const variant = product?.variants?.find((item) => item.id === product.variantId); const available = !!product?.isActive && (variant ? variant.stockQuantity > 0 : (product?.stock || 0) > 0); const currentPrice = variant?.sellingPrice ?? product?.salePrice ?? product?.price; const studioLink = product ? `/ai-try-on?productSlug=${encodeURIComponent(product.slug)}&productId=${encodeURIComponent(product.id)}${variant?.id ? `&variantId=${encodeURIComponent(variant.id)}` : ""}` : "/ai-try-on"; const addLookToCart = () => { if (!product || !available) return; dispatch(addToCart({ id: product.id, slug: product.slug, name: product.name, price: Number(currentPrice || 0), ...(Number(product.price || 0) > Number(currentPrice || 0) ? { originalPrice: Number(product.price) } : {}), image: product.media?.[0]?.imageUrl || "", selectedSize: variant?.variantName, variantId: variant?.id || undefined, quantity: 1, openDrawer: true })); toast.success("Product added to your cart."); }; return <article key={look.id} className="sn-ai-look-card"><div className="sn-ai-look-image">{images[look.id] ? <img src={images[look.id]} alt={`AI try-on look for ${product?.name || "a product"}`}/> : <div className="sn-ai-look-placeholder"><LoaderCircle size={20}/></div>}<span>AI PREVIEW</span><button aria-label={look.isFavorite ? "Remove from favorites" : "Add to favorites"} title={look.isFavorite ? "Remove favorite" : "Favorite look"} onClick={() => void setFavorite({ id: look.id, isFavorite: !look.isFavorite }).unwrap().then(() => toast.success(look.isFavorite ? "Removed from favorites." : "Added to favorites.")).catch(() => toast.error("Could not update favorite."))} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-[#e90068] shadow"><Heart size={17} fill={look.isFavorite ? "currentColor" : "none"}/></button></div><div className="sn-ai-look-copy"><h2>{product?.name || look.title || "Saved look"}</h2><p><CalendarDays size={13}/>{new Date(look.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}</p>{product && <div className="sn-ai-look-product"><span>{variant?.variantName || (product.productCategory === "JEWELRY" ? "Jewelry" : "Makeup")}{currentPrice != null ? ` · ৳${Number(currentPrice).toLocaleString("en-BD")}` : ""}</span><b className={available ? "" : "sn-ai-look-unavailable"}>{available ? "Available" : "Unavailable"}</b></div>}<div className="sn-ai-look-actions">{product && <Link to={`/product/${product.slug}`}>View product</Link>}<Link to={studioLink}>Open in Studio</Link>{product && <button aria-label="Add associated product to cart" title="Add to cart" onClick={addLookToCart} disabled={!available}><ShoppingCart size={15}/></button>}<button aria-label="Download saved look" onClick={() => download(look)} disabled={!images[look.id]}><Download size={15}/></button><button aria-label="Delete saved look" onClick={() => void deleteLook(look.id).unwrap().then(() => toast.success("Saved look deleted.")).catch(() => toast.error("Could not delete this look."))}><Trash2 size={15}/></button></div></div></article>; })}</div> : <p className="sn-ai-filter-empty">No saved {filter.toLowerCase()} looks yet.</p>}</>}
    <p className="sn-ai-looks-disclaimer">AI-generated previews are for visualization. Actual color, size, appearance, and fit may vary.</p>
  </section>;
}
