import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, BadgeCheck, Camera, Check, ChevronDown, CircleHelp, Download, Gem,
  Expand, Heart, ImagePlus, LoaderCircle, LockKeyhole, Minus, Plus, RefreshCw,
  Search, ShieldCheck, ShoppingCart, Sparkles, Star, Trash2, Truck, X,
} from "lucide-react";
import { toast } from "sonner";
import { addToCart, type CartItem } from "@/redux/features/cart/cartSlice";
import {
  type StoreProduct, useDeleteJewelryTryOnMutation, useGetAiLooksQuery,
  useGetJewelryTryOnQuery, useGetStoreProductQuery, useGetStoreProductsQuery,
  useGetWishlistQuery, useSaveAiLookMutation, useStartJewelryTryOnMutation,
} from "@/redux/features/storefront/storefrontApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";

const API = import.meta.env.VITE_API_ENDPOINT || "http://localhost:4001/api/v1";
const ORIGIN = API.replace(/\/api\/v\d+\/?$/, "");
const ALLOWED = ["EARRING", "RING", "NECKLACE", "PENDANT", "BRACELET", "WATCH"];
const money = (value: number | string) => `৳${Number(value || 0).toLocaleString("en-BD", { maximumFractionDigits: 2 })}`;
const imageUrl = (url?: string | null) => !url ? "" : /^https?:\/\//i.test(url) ? url : `${ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
const productImage = (item: StoreProduct) => imageUrl(item.media?.find((media) => media.isPrimary)?.imageUrl || item.media?.[0]?.imageUrl);
const categoryOf = (item?: StoreProduct | null) => String(item?.jewelryDetails?.category || "").toUpperCase();
const isEligible = (item: StoreProduct) => item.productCategory === "JEWELRY" && ALLOWED.includes(categoryOf(item)) && !!item.tryOnAssets?.length;
const assetCoversVariant = (item: StoreProduct, variantId?: string) => !!item.tryOnAssets?.some((asset) => !asset.variantId || asset.variantId === variantId);
const messageFor = (error: unknown) => {
  const data = error as { data?: { message?: string | string[] } };
  return Array.isArray(data?.data?.message) ? data.data.message.join(" ") : data?.data?.message || "Please try again.";
};

type LookResult = {
  id: string;
  generatedImageId: string;
  sessionId: string;
  product: StoreProduct;
  variantId?: string;
  originalUrl: string;
  previewUrl: string;
  createdAt: string;
  sourceFile: File;
};
type PreviewMode = "compare" | "side-by-side" | "result";

export default function AiTryOnStudio() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const productSlug = params.get("productSlug") || "";
  const routeProductId = params.get("productId") || "";
  const [selectedProductId, setSelectedProductId] = useState(routeProductId);
  const [selectedVariantId, setSelectedVariantId] = useState(params.get("variantId") || "");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeTab, setActiveTab] = useState("Similar Products");
  const [sortBy, setSortBy] = useState("popularity");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [page, setPage] = useState(1);
  const [photo, setPhoto] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [error, setError] = useState("");
  const [split, setSplit] = useState(50);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("compare");
  const [activeResultId, setActiveResultId] = useState("");
  const [results, setResults] = useState<LookResult[]>([]);
  const [compareResultIds, setCompareResultIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [photoTipsOpen, setPhotoTipsOpen] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [loadingStage, setLoadingStage] = useState(0);
  const uploadRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const previewUrlsRef = useRef<string[]>([]);
  const seenGeneratedIds = useRef(new Set<string>());
  const pendingGenerationRef = useRef<{ product: StoreProduct; variantId?: string; originalUrl: string; sourceFile: File } | null>(null);

  const productQuery = useGetStoreProductQuery(productSlug, { skip: !productSlug });
  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !user });
  const wishedProductIds = useMemo(() => new Set((wishlistData?.data || []).map((row) => row.product?.id)), [wishlistData]);
  const categoryOptionsQuery = useGetStoreProductsQuery({ page: 1, limit: 50, productCategory: "JEWELRY", tryOnEligible: true, inStock: true, sort: "best-selling" });
  const selectedFromList = useGetStoreProductsQuery({
    page,
    limit: 24,
    search: debouncedSearch || undefined,
    productCategory: "JEWELRY",
    tryOnEligible: true,
    jewelryCategory: activeCategory || (activeTab === "Similar Products" ? categoryOf(productQuery.data?.data) : undefined),
    brand: brand || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    inStock: true,
    onSale: activeTab === "Offers" ? true : undefined,
    productIds: activeTab === "Wishlist" && wishlistData ? [...wishedProductIds].join(",") : undefined,
    sort: activeTab === "New Arrivals" ? "newest" : activeTab === "Best Sellers" ? "best-selling" : sortBy,
  }, { skip: activeTab === "Wishlist" && (!user || !wishlistData) });
  const [catalogProducts, setCatalogProducts] = useState<StoreProduct[]>([]);
  const productList = catalogProducts;
  const linkedProduct = productQuery.data?.data;
  const selectedProduct = productList.find((item) => item.id === selectedProductId) || (linkedProduct?.id === selectedProductId ? linkedProduct : null) || linkedProduct || null;
  const variants = useMemo(() => {
    if (!selectedProduct) return [];
    const eligibleVariants = selectedProduct.variants.filter((variant) => assetCoversVariant(selectedProduct, variant.id));
    return eligibleVariants.length ? eligibleVariants : selectedProduct.tryOnAssets?.some((asset) => !asset.variantId) ? selectedProduct.variants : [];
  }, [selectedProduct]);
  const selectedVariant = variants.find((item) => item.id === selectedVariantId) || variants.find((item) => item.isDefault) || variants[0];
  const selectedPrice = selectedVariant?.sellingPrice ?? selectedProduct?.salePrice ?? selectedProduct?.price ?? 0;
  const [startTryOn, startState] = useStartJewelryTryOnMutation();
  const [deleteTryOn] = useDeleteJewelryTryOnMutation();
  const [saveLook, saveState] = useSaveAiLookMutation();
  const { data: sessionResponse } = useGetJewelryTryOnQuery(sessionId, {
    skip: !sessionId,
    pollingInterval: sessionId ? 2200 : 0,
    refetchOnMountOrArgChange: true,
  });
  const session = sessionResponse?.data;
  const currentPreview = results.find((item) => item.id === activeResultId) || results[results.length - 1];
  const processing = startState.isLoading || (!!sessionId && ["CREATED", "PROCESSING"].includes(session?.status || ""));
  const localPhotoUrl = useMemo(() => photo ? URL.createObjectURL(photo) : "", [photo]);
  useGetAiLooksQuery(undefined, { skip: !user });

  useEffect(() => {
    const timer = window.setTimeout(() => { setDebouncedSearch(search.trim()); setPage(1); }, 250);
    return () => window.clearTimeout(timer);
  }, [search]);
  useEffect(() => { setPage(1); setCatalogProducts([]); }, [activeTab, activeCategory, brand, debouncedSearch, maxPrice, minPrice, sortBy, wishlistData]);
  useEffect(() => {
    const incoming = selectedFromList.currentData?.data;
    if (!incoming) return;
    setCatalogProducts((current) => {
      const rows = page === 1 ? [] : current;
      const known = new Set(rows.map((item) => item.id));
      return [...rows, ...incoming.filter((item) => !known.has(item.id))];
    });
  }, [page, selectedFromList.currentData]);
  useEffect(() => { if (selectedProductId && !activeCategory && categoryOf(selectedProduct)) setActiveCategory(categoryOf(selectedProduct)); }, [activeCategory, selectedProduct, selectedProductId]);
  useEffect(() => {
    if (!selectedProduct) return;
    const fromRoute = params.get("variantId");
    const preferred = variants.find((variant) => variant.id === (fromRoute || selectedVariantId)) || variants.find((variant) => variant.isDefault) || variants[0];
    if (preferred && preferred.id !== selectedVariantId) setSelectedVariantId(preferred.id);
  }, [params, selectedProduct, selectedVariantId, variants]);
  useEffect(() => {
    if (!processing) { setLoadingStage(0); return; }
    const timer = window.setInterval(() => setLoadingStage((stage) => Math.min(stage + 1, 3)), 2400);
    return () => window.clearInterval(timer);
  }, [processing]);
  useEffect(() => () => { if (localPhotoUrl) URL.revokeObjectURL(localPhotoUrl); }, [localPhotoUrl]);
  useEffect(() => () => { previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url)); }, []);

  const displayedProducts = useMemo(() => {
    let items = productList.filter(isEligible).filter((item) => {
      const category = categoryOf(item);
      const price = Number(item.salePrice ?? item.price);
      const inStock = item.variants.length ? item.variants.some((variant) => variant.stockQuantity > 0) : item.stock > 0;
      if (activeCategory && category !== activeCategory) return false;
      if (minPrice && price < Number(minPrice)) return false;
      if (maxPrice && price > Number(maxPrice)) return false;
      if (brand && item.brand?.name !== brand) return false;
      if (activeTab === "Offers" && !(Number(item.price) > price)) return false;
      if (activeTab === "Wishlist" && !wishedProductIds.has(item.id)) return false;
      return inStock;
    });
    if (activeTab === "Similar Products" && selectedProduct) {
      items = items.filter((item) => item.id !== selectedProduct.id).sort((a, b) => Number(categoryOf(b) === categoryOf(selectedProduct)) - Number(categoryOf(a) === categoryOf(selectedProduct)));
    }
    return items;
  }, [activeCategory, activeTab, brand, maxPrice, minPrice, productList, selectedProduct, wishedProductIds]);
  const brandOptions = useMemo(() => [...new Set(productList.filter(isEligible).map((item) => item.brand?.name).filter((name): name is string => !!name))].sort(), [productList]);
  const availableCategories = useMemo(() => [...new Set((categoryOptionsQuery.currentData?.data || []).filter(isEligible).map(categoryOf))], [categoryOptionsQuery.currentData]);
  const titleForCategory = (category: string) => ({ EARRING: "Earrings", RING: "Ring", NECKLACE: "Necklace", PENDANT: "Pendant", BRACELET: "Bracelet", WATCH: "Watch" }[category] || category.toLowerCase());

  const choosePhoto = (file?: File) => {
    setError("");
    if (!file) return;
    if (!(file.type === "image/jpeg" || file.type === "image/png")) { setError("Choose a JPEG or PNG photo."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("Choose a photo up to 10 MB."); return; }
    setPhoto(file);
    setConsent(false);
  };

  const generateLook = async (sourcePhoto = photo, productForLook = selectedProduct, variantForLook = selectedVariant) => {
    if (!sourcePhoto || !consent || !productForLook || !token || processing || (productForLook.variants.length > 0 && !variantForLook) || !assetCoversVariant(productForLook, variantForLook?.id)) return;
    setError("");
    const originalUrl = URL.createObjectURL(sourcePhoto);
    previewUrlsRef.current.push(originalUrl);
    pendingGenerationRef.current = { product: productForLook, variantId: variantForLook?.id, originalUrl, sourceFile: sourcePhoto };
    const body = new FormData();
    body.append("photo", sourcePhoto);
    body.append("productId", productForLook.id);
    body.append("consent", "true");
    if (variantForLook?.id) body.append("variantId", variantForLook.id);
    try {
      const response = await startTryOn(body).unwrap();
      setSessionId(response.data.sessionId);
    } catch (cause) {
      pendingGenerationRef.current = null;
      URL.revokeObjectURL(originalUrl);
      previewUrlsRef.current = previewUrlsRef.current.filter((url) => url !== originalUrl);
      setError(messageFor(cause));
    }
  };

  useEffect(() => {
    const generated = session?.images?.find((image) => !seenGeneratedIds.current.has(image.id));
    const pending = pendingGenerationRef.current;
    if (session?.status !== "COMPLETED" || !generated || !token || !pending) return;
    let live = true;
    seenGeneratedIds.current.add(generated.id);
    void fetch(`${ORIGIN}${generated.url}`, { headers: { Authorization: `Bearer ${token}` }, credentials: "include" })
      .then(async (response) => { if (!response.ok) throw new Error("The private preview could not be loaded."); return response.blob(); })
      .then((blob) => {
        const previewUrl = URL.createObjectURL(blob);
        previewUrlsRef.current.push(previewUrl);
        if (!live) { URL.revokeObjectURL(previewUrl); return; }
        const result: LookResult = {
          id: generated.id,
          generatedImageId: generated.id,
          sessionId: session.id,
          product: pending.product,
          variantId: pending.variantId,
          originalUrl: pending.originalUrl,
          previewUrl,
          createdAt: new Date().toISOString(),
          sourceFile: pending.sourceFile,
        };
        setResults((rows) => [...rows, result]);
        setActiveResultId(generated.id);
        pendingGenerationRef.current = null;
        setError("");
        toast.success("Your AI preview is ready.");
      })
      .catch((cause: unknown) => { if (live) setError(cause instanceof Error ? cause.message : "Could not open the private preview."); });
    return () => { live = false; };
  }, [session, token]);

  useEffect(() => {
    if (session?.status === "FAILED") setError(session.errorMessage || "The preview could not be generated. Your photo and previous looks are still available.");
  }, [session?.errorMessage, session?.status]);

  const makeCartItem = (item: StoreProduct, variantId?: string): CartItem => {
    const variant = item.variants.find((choice) => choice.id === variantId) || item.variants.find((choice) => choice.isDefault) || item.variants[0];
    const price = Number(variant?.sellingPrice ?? item.salePrice ?? item.price);
    return {
      id: item.id, slug: item.slug, name: item.name, price,
      ...(Number(item.price) > price ? { originalPrice: Number(item.price) } : {}),
      image: productImage(item), brand: item.brand?.name, category: item.category?.slug,
      selectedSize: variant?.variantName, quantity: 1, variantId: variant?.id,
    };
  };
  const addItem = (item: StoreProduct, variantId?: string) => {
    dispatch(addToCart({ ...makeCartItem(item, variantId), openDrawer: true }));
    toast.success("Added to your cart.");
  };
  const addSelectedLookToCart = () => {
    if (!currentPreview) return;
    addItem(currentPreview.product, currentPreview.variantId);
  };
  const downloadResult = (item: LookResult) => {
    const anchor = document.createElement("a"); anchor.href = item.previewUrl; anchor.download = `${item.product.slug}-ai-preview.jpg`; anchor.click();
  };
  const saveResult = async () => {
    if (!currentPreview) return;
    try { await saveLook({ generatedImageId: currentPreview.generatedImageId, title: currentPreview.product.name }).unwrap(); toast.success("Saved to My AI Looks."); }
    catch (cause) { toast.error(messageFor(cause)); }
  };
  const toggleCompareResult = (id: string) => setCompareResultIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length >= 4 ? current : [...current, id]);
  const removeResult = async (item: LookResult) => {
    try {
      await deleteTryOn(item.sessionId).unwrap();
      setResults((rows) => rows.filter((row) => row.sessionId !== item.sessionId));
      setActiveResultId("");
      toast.success("Preview deleted.");
    } catch (cause) { toast.error(messageFor(cause)); }
  };
  const openAssistant = () => navigate("/assistant", { state: { initialPrompt: `I am trying ${selectedProduct?.name || "jewelry"}${selectedVariant?.variantName ? ` (${selectedVariant.variantName})` : ""}. Suggest matching jewelry from the available catalog and identify yourself as an AI stylist.`, productName: selectedProduct?.name } });
  const selectProductForTryOn = (item: StoreProduct) => {
    const variant = item.variants.find((choice) => choice.isDefault && assetCoversVariant(item, choice.id)) || item.variants.find((choice) => assetCoversVariant(item, choice.id)) || item.variants[0];
    setSelectedProductId(item.id);
    setSelectedVariantId(variant?.id || "");
    setActiveCategory(categoryOf(item));
    window.setTimeout(() => document.getElementById("try-on-controls")?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
  };

  const categoryGuide = categoryOf(selectedProduct) === "EARRING" ? "Use a clear, front-facing photo with your ears visible." : categoryOf(selectedProduct) === "RING" ? "Use a clear photo of your hand and the finger you want to preview." : categoryOf(selectedProduct) === "BRACELET" || categoryOf(selectedProduct) === "WATCH" ? "Use a clear photo showing your wrist." : "Use a clear photo with your neck and upper chest visible.";
  const sessionStatus = session?.status || "";
  const stageLabels = ["Preparing your photo", "Checking product reference", "Generating your preview", "Finalizing your image"];

  return <main className="min-h-[calc(100vh-100px)] bg-[#fffafd] text-[#192638]">
    <div className="border-b border-[#f2dfe9] bg-white/90">
      <div className="mx-auto flex min-h-[66px] max-w-[1680px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6 xl:px-8">
        <Link to={productSlug ? `/product/${productSlug}` : "/shop"} className="inline-flex items-center gap-2 text-sm font-bold text-[#263247] hover:text-[#e90068]"><ArrowLeft size={18}/>Back to Product</Link>
        <span className="hidden h-7 w-px bg-[#eadde5] sm:block"/>
        <h1 className="inline-flex items-center gap-2 text-lg font-extrabold tracking-tight sm:text-2xl"><Sparkles className="text-[#e90068]"/>AI Try-On Studio</h1>
        <span className="rounded-full bg-[#ffedf5] px-3 py-1.5 text-xs font-bold text-[#c90061]">{selectedProduct?.productCategory === "COSMETICS" ? "Cosmetics Try-On" : titleForCategory(categoryOf(selectedProduct)) || "Jewelry Virtual Try-On"}</span>
        <div className="ml-auto flex items-center gap-4 text-xs font-semibold text-slate-600"><span className="hidden items-center gap-1.5 sm:inline-flex"><BadgeCheck size={17} className="text-[#e90068]"/>AI Preview</span><span className="hidden items-center gap-1.5 md:inline-flex"><LockKeyhole size={16} className="text-[#e90068]"/>Private Photo Processing</span><button type="button" onClick={() => setHowItWorksOpen(true)} className="rounded-full border border-[#e90068] px-3.5 py-2 font-bold text-[#c90061] hover:bg-[#fff0f6]">How It Works?</button></div>
      </div>
    </div>

    <div className="mx-auto grid max-w-[1680px] gap-4 p-3 sm:p-5 xl:grid-cols-[minmax(250px,0.82fr)_minmax(460px,2.25fr)_minmax(320px,0.94fr)] xl:gap-5 xl:p-6">
      <aside className="self-start rounded-[22px] border border-[#f1dfe8] bg-white p-4 shadow-[0_5px_18px_rgba(34,19,34,.045)] xl:sticky xl:top-[92px]">
        <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold">Your Photo</h2>{photo && <button type="button" onClick={() => { setPhoto(null); setConsent(false); }} className="rounded-full p-2 text-slate-500 hover:bg-pink-50 hover:text-[#c90061]" aria-label="Remove photo"><X size={17}/></button>}</div>
        <input ref={uploadRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={(event) => choosePhoto(event.target.files?.[0])}/>
        <input ref={cameraRef} type="file" accept="image/jpeg,image/png" capture="user" className="hidden" onChange={(event) => choosePhoto(event.target.files?.[0])}/>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="relative flex aspect-[.86] items-center justify-center overflow-hidden rounded-2xl border border-[#e90068] bg-[#fff4f9]">
            {localPhotoUrl ? <img src={localPhotoUrl} alt="Your selected photo" className="h-full w-full object-cover"/> : <div className="px-3 text-center text-slate-500"><ImagePlus size={26} className="mx-auto text-[#e90068]"/><p className="mt-2 text-xs">Your photo preview</p></div>}
            {photo && <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-gradient-to-r from-[#f74c9b] to-[#e90068] text-white"><Check size={16}/></span>}
          </div>
          <button type="button" onClick={() => uploadRef.current?.click()} className="flex aspect-[.86] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#f0c9dc] bg-white text-center text-sm font-bold hover:border-[#e90068] hover:bg-[#fff6fa]"><span className="grid h-10 w-10 place-items-center rounded-full border border-[#f3d5e3] text-[#e90068]"><Plus size={22}/></span>Upload New</button>
        </div>
        <button type="button" onClick={() => cameraRef.current?.click()} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f74c9b] to-[#e90068] px-4 text-sm font-extrabold text-white shadow-[0_7px_16px_rgba(233,0,104,.16)]"><Camera size={18}/>Take a Photo</button>
        <section className="mt-4 rounded-2xl bg-[#fff2f8] p-3.5">
          <button type="button" aria-expanded={photoTipsOpen} onClick={() => setPhotoTipsOpen((open) => !open)} className="flex w-full items-center justify-between text-left text-sm font-extrabold"><span className="inline-flex items-center gap-2"><Sparkles size={16} className="text-[#e90068]"/>Photo Tips</span><ChevronDown size={16} className={`transition-transform ${photoTipsOpen ? "rotate-180" : ""}`}/></button>
          {photoTipsOpen && <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-700">{[categoryGuide, "Use clear natural or bright lighting.", "Keep the target area uncovered; avoid heavy filters."].map((tip) => <li key={tip} className="flex gap-2"><Check size={15} className="mt-0.5 shrink-0 text-emerald-600"/>{tip}</li>)}</ul>}
        </section>
        <section className="mt-4"><h3 className="mb-2.5 text-sm font-extrabold">Try Another Category</h3><div className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-3">{availableCategories.map((category) => <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)} className={`flex min-h-[66px] flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-[11px] font-semibold transition ${activeCategory === category ? "border-[#e90068] bg-[#fff0f6] text-[#c90061] shadow-sm" : "border-[#f2e6ec] bg-white text-slate-700 hover:border-pink-300"}`}><Gem size={19}/>{titleForCategory(category)}</button>)}</div></section>
        <p className="mt-4 flex items-start gap-2 text-[10px] leading-4 text-slate-500"><LockKeyhole size={13} className="mt-0.5 shrink-0"/>Your photo is processed privately for this preview. It is not used for ads or model training.</p>
      </aside>

      <section className="min-w-0 space-y-3">
        <div className="relative overflow-hidden rounded-[22px] border border-[#f1dfe8] bg-white p-2.5 shadow-[0_5px_18px_rgba(34,19,34,.045)] sm:p-3.5">
          {currentPreview ? <>
            <div className={`relative overflow-hidden rounded-[17px] bg-[#f8e8ef] ${previewMode === "side-by-side" ? "grid grid-cols-2 gap-1" : "aspect-[.95] min-h-[400px] sm:aspect-[1.25] sm:min-h-[460px] xl:aspect-[1.24]"}`} style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}>
              {previewMode === "side-by-side" ? <><figure className="relative m-0 min-h-[400px]"><img src={currentPreview.originalUrl} alt="Before try-on" className="h-full w-full object-contain"/><figcaption className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold">Before</figcaption></figure><figure className="relative m-0 min-h-[400px]"><img src={currentPreview.previewUrl} alt="AI-generated try-on preview" className="h-full w-full object-contain"/><figcaption className="absolute right-3 top-3 rounded-full bg-[#e90068] px-3 py-1.5 text-xs font-bold text-white">After · AI Preview</figcaption></figure></> : previewMode === "result" ? <><img src={currentPreview.previewUrl} alt="AI-generated try-on preview" className="absolute inset-0 h-full w-full object-contain"/><span className="absolute right-3 top-3 rounded-full bg-[#e90068] px-3 py-1.5 text-xs font-bold text-white">AI-generated preview</span></> : <>
                <img src={currentPreview.originalUrl} alt="Before try-on" className="absolute inset-0 h-full w-full object-contain"/>
                <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${split}%)` }}><img src={currentPreview.previewUrl} alt="After AI try-on" className="absolute inset-0 h-full w-full object-contain"/></div>
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold">Before</span><span className="absolute right-3 top-3 rounded-full bg-[#e90068] px-3 py-1.5 text-xs font-bold text-white">After · AI Preview</span>
                <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${split}%` }}><span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#e90068] shadow-md">↔</span></div>
                <input type="range" min="0" max="100" value={split} onChange={(event) => setSplit(Number(event.target.value))} aria-label="Drag to compare before and after" className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"/>
              </>}
              <div className="absolute bottom-3 right-3 z-10 flex gap-1.5 rounded-full border border-white/80 bg-white/90 p-1 shadow-sm"><button type="button" onClick={() => setZoom((value) => Math.max(1, +(value - .1).toFixed(1)))} aria-label="Zoom out" className="grid h-8 w-8 place-items-center rounded-full hover:bg-pink-50"><Minus size={15}/></button><span className="flex min-w-10 items-center justify-center text-[11px] font-bold">{Math.round(zoom * 100)}%</span><button type="button" onClick={() => setZoom((value) => Math.min(1.5, +(value + .1).toFixed(1)))} aria-label="Zoom in" className="grid h-8 w-8 place-items-center rounded-full hover:bg-pink-50"><Plus size={15}/></button><button type="button" onClick={() => setFullscreen(true)} aria-label="Open fullscreen preview" className="grid h-8 w-8 place-items-center rounded-full hover:bg-pink-50"><Expand size={15}/></button></div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 rounded-full bg-[#f7f3f6] p-1">{([['compare','Slider'],['side-by-side','Side by side'],['result','After']] as const).map(([mode,label]) => <button type="button" key={mode} aria-pressed={previewMode === mode} onClick={() => setPreviewMode(mode)} className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${previewMode === mode ? "bg-white text-[#c90061] shadow-sm" : "text-slate-600"}`}>{label}</button>)}</div>
              <p className="text-[10px] text-slate-500">AI preview only. Product size, color and fit may vary.</p>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#f3e7ed] pt-3">
              <div className="flex max-w-full gap-2 overflow-x-auto">{results.map((result) => <div key={result.id} className="flex shrink-0 flex-col items-center gap-1"><button type="button" onClick={() => setActiveResultId(result.id)} aria-label={`Show ${result.product.name} result`} className={`h-[62px] w-[62px] overflow-hidden rounded-xl border-2 ${currentPreview.id === result.id ? "border-[#e90068]" : "border-transparent"}`}><img src={result.previewUrl} alt="" className="h-full w-full object-cover"/></button><label className="flex cursor-pointer items-center gap-1 text-[9px] text-slate-500"><input type="checkbox" checked={compareResultIds.includes(result.id)} onChange={() => toggleCompareResult(result.id)} disabled={!compareResultIds.includes(result.id) && compareResultIds.length >= 4} className="h-3 w-3 accent-[#e90068]"/>Compare</label></div>)}</div>
              <div className="ml-auto flex flex-wrap gap-2">{compareResultIds.length >= 2 && <button type="button" onClick={() => setCompareOpen(true)} className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#e90068] bg-white px-3 text-xs font-bold text-[#c90061]">Compare {compareResultIds.length}</button>}{currentPreview && <><button type="button" onClick={() => void generateLook(currentPreview.sourceFile, currentPreview.product, currentPreview.product.variants.find((item) => item.id === currentPreview.variantId))} disabled={processing} className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#f0cddd] bg-white px-3 text-xs font-bold text-slate-700 hover:bg-[#fff5f9] disabled:opacity-50"><RefreshCw size={14}/>Try Again</button><button type="button" onClick={() => void removeResult(currentPreview)} className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#f0cddd] bg-white px-3 text-xs font-bold text-slate-700 hover:bg-[#fff5f9]"><Trash2 size={14}/>Delete</button><button type="button" onClick={() => void saveResult()} disabled={saveState.isLoading} className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#e90068] bg-white px-3 text-xs font-bold text-[#c90061] hover:bg-[#fff3f8]"><Heart size={14}/>Save My Look</button><button type="button" onClick={() => downloadResult(currentPreview)} className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#e90068] bg-white px-3 text-xs font-bold text-[#c90061] hover:bg-[#fff3f8]"><Download size={14}/>Download</button><button type="button" onClick={addSelectedLookToCart} className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#f74c9b] to-[#e90068] px-4 text-xs font-extrabold text-white shadow-sm"><ShoppingCart size={15}/>Add to Cart</button></>}</div>
            </div>
          </> : <div className="grid min-h-[420px] place-items-center rounded-[17px] bg-gradient-to-br from-[#fff6fa] via-white to-[#fff0f6] px-5 text-center sm:min-h-[520px]">
            <div className="max-w-md"><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#ffe7f2] text-[#e90068]"><Sparkles size={28}/></span><h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">Discover your next look</h2><p className="mt-2 text-sm leading-6 text-slate-600">Upload your photo and choose an eligible jewelry product to preview how it may look on you.</p><button type="button" onClick={() => uploadRef.current?.click()} className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#f74c9b] to-[#e90068] px-5 text-sm font-extrabold text-white"><ImagePlus size={18}/>Upload Your Photo</button><div className="mt-5 flex flex-wrap justify-center gap-4 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><ShieldCheck size={15} className="text-[#e90068]"/>Private processing</span><span className="inline-flex items-center gap-1"><Truck size={15} className="text-[#e90068]"/>Real catalog products</span></div></div>
          </div>}
          {processing && <div className="absolute inset-3 z-20 grid place-items-center rounded-[18px] bg-white/90 p-5 backdrop-blur-sm"><div className="w-full max-w-sm rounded-2xl border border-pink-100 bg-white p-5 text-center shadow-lg"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#fff0f6] text-[#e90068]"><LoaderCircle size={25} className="animate-spin"/></span><h2 className="mt-3 text-lg font-extrabold">ShobNow AI is working</h2><p className="mt-1 text-sm text-slate-600">{stageLabels[loadingStage]}</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#f7dce9]"><div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-[#f74c9b] to-[#e90068]"/></div><p className="mt-3 text-[11px] text-slate-500">Usually takes a little while. Keep this page open.</p></div></div>}
        </div>
        {error && <div role="alert" className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"><CircleHelp size={17} className="mt-0.5 shrink-0"/><span>{error}</span><button type="button" onClick={() => setError("")} className="ml-auto"><X size={16}/></button></div>}
        {sessionStatus === "FAILED" && <button type="button" onClick={() => { setSessionId(""); void generateLook(); }} className="inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm font-bold text-[#c90061]"><RefreshCw size={16}/>Try Again</button>}
        <section id="try-on-controls" className="rounded-[20px] border border-[#f1dfe8] bg-white p-4 shadow-[0_4px_16px_rgba(34,19,34,.035)] sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-extrabold">{selectedProduct?.name || "Select a product to try on"}</h2><p className="mt-1 text-xs text-slate-500">Select an approved product and an available variation before generating.</p></div><div className="text-right"><strong className="text-xl font-extrabold text-[#c90061]">{money(selectedPrice)}</strong><p className="text-xs text-emerald-700">● In stock</p></div></div>
          {selectedProduct?.productCategory === "COSMETICS" && <p role="status" className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">This cosmetics product is selected. Cosmetics virtual try-on is not enabled yet; AI preview generation currently supports approved jewelry products.</p>}
          {selectedProduct?.productCategory === "JEWELRY" && selectedProduct.variants.length > 0 && <label className="mt-3 block max-w-sm text-xs font-bold text-slate-600">Variation<select value={selectedVariant?.id || ""} onChange={(event) => setSelectedVariantId(event.target.value)} className="mt-1.5 h-10 w-full rounded-xl border border-[#eadde5] bg-white px-3 text-sm font-medium outline-none focus:border-[#e90068]">{variants.map((variant) => <option key={variant.id} value={variant.id}>{variant.variantName}{variant.color ? ` · ${variant.color}` : ""} · {money(variant.sellingPrice)}</option>)}</select></label>}
          <label className="mt-3 flex cursor-pointer items-start gap-2 text-[11px] leading-5 text-slate-600"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 accent-[#e90068]"/>I agree to send this photo to our AI provider for a private try-on preview.</label>
          {!user && <p className="mt-3 rounded-xl bg-[#fff4f8] p-3 text-xs text-slate-600">Sign in is required to securely generate and save a private preview. <Link to="/login" state={{ from: `/ai-try-on?${params.toString()}` }} className="font-extrabold text-[#c90061] underline">Sign in</Link></p>}
          <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center"><button type="button" disabled={!photo || !consent || !selectedProduct || (variants.length > 0 && !selectedVariant) || !user || processing || !assetCoversVariant(selectedProduct, selectedVariant?.id)} onClick={() => void generateLook()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f74c9b] to-[#e90068] px-5 text-sm font-extrabold text-white shadow-[0_7px_18px_rgba(233,0,104,.18)] disabled:cursor-not-allowed disabled:opacity-45"><Sparkles size={18}/>{processing ? stageLabels[loadingStage] : "Generate My Look"}</button><button type="button" onClick={openAssistant} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#f0cddd] bg-white px-4 text-sm font-bold text-[#c90061] hover:bg-[#fff4f8]"><Sparkles size={16}/>Ask AI Stylist</button></div>
        </section>
      </section>

      <aside className="min-w-0 self-start rounded-[22px] border border-[#f1dfe8] bg-white p-4 shadow-[0_5px_18px_rgba(34,19,34,.045)] xl:sticky xl:top-[92px] xl:max-h-[calc(100vh-112px)] xl:overflow-y-auto">
        <div className="flex items-start justify-between gap-2"><div><h2 className="text-lg font-extrabold">Find Your Perfect Look</h2><p className="mt-1 text-xs text-slate-500">Products from the live ShobNow catalog</p></div><Link to="/user-dashboard/ai-looks" className="shrink-0 rounded-full bg-[#fff0f6] px-2.5 py-1.5 text-[10px] font-bold text-[#c90061]">My AI Looks</Link></div>
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">{["Similar Products", "Best Sellers", "New Arrivals", "Offers", "Wishlist"].map((tab) => <button key={tab} type="button" aria-pressed={activeTab === tab} onClick={() => setActiveTab(tab)} className={`shrink-0 rounded-full px-3 py-2 text-[10px] font-bold ${activeTab === tab ? "bg-gradient-to-r from-[#f74c9b] to-[#e90068] text-white" : "bg-[#f6f3f5] text-slate-700 hover:bg-pink-50"}`}>{tab}</button>)}</div>
        <label className="mt-3 flex h-10 items-center gap-2 rounded-full border border-[#f0e2e9] bg-white px-3 focus-within:border-[#e90068]"><Search size={15} className="text-slate-500"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search jewelry..." className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-slate-400"/></label>
        <details className="group mt-2"><summary className="flex cursor-pointer list-none items-center justify-between py-2 text-xs font-bold text-slate-600">Filters &amp; Sort <ChevronDown size={15} className="transition group-open:rotate-180"/></summary><div className="grid grid-cols-2 gap-2 pb-2"><input aria-label="Minimum price" inputMode="numeric" value={minPrice} onChange={(event) => setMinPrice(event.target.value.replace(/\D/g, ""))} placeholder="Min ৳" className="h-9 rounded-lg border border-[#f0e2e9] px-2 text-xs outline-none focus:border-[#e90068]"/><input aria-label="Maximum price" inputMode="numeric" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value.replace(/\D/g, ""))} placeholder="Max ৳" className="h-9 rounded-lg border border-[#f0e2e9] px-2 text-xs outline-none focus:border-[#e90068]"/><select aria-label="Filter by brand" value={brand} onChange={(event) => setBrand(event.target.value)} className="h-9 rounded-lg border border-[#f0e2e9] bg-white px-2 text-xs"><option value="">All brands</option>{brandOptions.map((item) => <option key={item}>{item}</option>)}</select><select aria-label="Sort products" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="h-9 rounded-lg border border-[#f0e2e9] bg-white px-2 text-xs"><option value="popularity">Popularity</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select></div></details>
        <div className="mt-2 space-y-2.5">{displayedProducts.map((item) => {
          const itemVariant = item.variants.find((choice) => choice.isDefault) || item.variants[0];
          const price = Number(itemVariant?.sellingPrice ?? item.salePrice ?? item.price);
          const selected = item.id === selectedProduct?.id;
          const rating = Number(item.reviewSummary?.averageRating || 0);
          const reviews = Number(item.reviewSummary?.reviewCount || 0);
          return <article key={item.id} className={`rounded-2xl border p-2 transition ${selected ? "border-[#e90068] bg-[#fff7fb] shadow-[0_2px_10px_rgba(233,0,104,.08)]" : "border-[#f0e6ec] hover:border-pink-300"}`}>
            <button type="button" onClick={() => selectProductForTryOn(item)} className="flex w-full gap-2.5 text-left">
              <span className="relative h-[86px] w-[86px] shrink-0 overflow-hidden rounded-xl bg-[#fff0f6]">{productImage(item) && <img src={productImage(item)} alt={item.name} loading="lazy" className="h-full w-full object-cover"/>}{selected && <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-gradient-to-r from-[#f74c9b] to-[#e90068] text-white"><Check size={13}/></span>}</span>
              <span className="min-w-0 flex-1 self-center"><b className="line-clamp-2 text-xs leading-4">{item.name}</b>{reviews > 0 && <span className="mt-1 flex items-center gap-1 text-[10px] text-slate-500"><Star size={12} className="fill-amber-400 text-amber-400"/>{rating.toFixed(1)} ({reviews})</span>}<span className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5"><strong className="text-sm text-[#c90061]">{money(price)}</strong>{Number(item.price) > price && <><del className="text-[10px] text-slate-400">{money(item.price)}</del><em className="rounded-full bg-[#ffe2ef] px-1.5 py-0.5 text-[9px] font-bold not-italic text-[#c90061]">{Math.round((1-price/Number(item.price))*100)}% OFF</em></>}</span><span className="mt-1 block text-[10px] text-emerald-700">In stock</span></span>
            </button>
            <button type="button" onClick={() => selectProductForTryOn(item)} className="mt-2 inline-flex min-h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#f74c9b] to-[#e90068] px-2 text-[10px] font-extrabold text-white"><Sparkles size={13}/>{selected ? "Selected for Try-On" : "Try On This Item"}</button>
          </article>;
        })}</div>
        {selectedFromList.isFetching && <div className="grid min-h-24 place-items-center text-sm text-slate-500"><LoaderCircle size={19} className="animate-spin text-[#e90068]"/></div>}
        {!selectedFromList.isFetching && displayedProducts.length === 0 && <div className="rounded-xl bg-[#fff6fa] p-5 text-center"><Search size={21} className="mx-auto text-[#c90061]"/><p className="mt-2 text-xs font-bold">No eligible products found</p><p className="mt-1 text-[10px] leading-4 text-slate-500">Only active jewelry products with an approved try-on reference are shown.</p></div>}
        {(selectedFromList.currentData?.meta?.totalPages || 1) > page && <button type="button" onClick={() => setPage((value) => value + 1)} className="mt-3 w-full rounded-xl border border-[#e90068] py-2.5 text-xs font-bold text-[#c90061]">Load more products</button>}
      </aside>
    </div>

    <section className="mx-auto mb-8 grid max-w-[1680px] gap-3 px-3 sm:px-5 xl:grid-cols-[300px_repeat(3,minmax(0,1fr))] xl:px-6">
      <div className="flex items-center gap-3 rounded-2xl border border-[#f2dbe7] bg-gradient-to-r from-[#fff0f6] to-white p-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-[#e90068] shadow-sm"><Heart size={23}/></span><div><h2 className="font-extrabold text-[#c90061]">Love This Look?</h2><p className="text-xs text-slate-600">Complete your style with matching picks.</p></div></div>
      {displayedProducts.filter((item) => item.id !== selectedProduct?.id && item.id !== currentPreview?.product.id).slice(0, 3).map((item) => <article key={`match-${item.id}`} className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#f2e1ea] bg-white p-2.5"><img src={productImage(item)} alt={item.name} className="h-[72px] w-[72px] shrink-0 rounded-xl bg-[#fff0f6] object-cover"/><div className="min-w-0 flex-1"><h3 className="line-clamp-2 text-xs font-bold">{item.name}</h3><p className="mt-1 text-sm font-extrabold text-[#c90061]">{money(item.salePrice ?? item.price)}</p></div><button type="button" onClick={() => addItem(item)} className="rounded-lg bg-gradient-to-r from-[#f74c9b] to-[#e90068] px-3 py-2 text-xs font-bold text-white">Add</button></article>)}
    </section>

    <div className="sticky bottom-0 z-20 border-t border-pink-100 bg-white/95 p-3 shadow-[0_-6px_18px_rgba(40,20,35,.06)] backdrop-blur sm:hidden"><div className="mx-auto flex max-w-xl gap-2"><button type="button" onClick={() => uploadRef.current?.click()} className="flex-1 rounded-xl border border-[#e90068] px-3 py-3 text-xs font-extrabold text-[#c90061]">{photo ? "Change Photo" : "Upload Photo"}</button><button type="button" onClick={() => void generateLook()} disabled={!photo || !consent || !user || processing || !selectedProduct || (variants.length > 0 && !selectedVariant) || !assetCoversVariant(selectedProduct, selectedVariant?.id)} className="flex-[1.35] rounded-xl bg-gradient-to-r from-[#f74c9b] to-[#e90068] px-3 py-3 text-xs font-extrabold text-white disabled:opacity-45">{processing ? "Creating preview…" : "Generate My Look"}</button></div></div>

    {howItWorksOpen && <div className="fixed inset-0 z-[70] grid place-items-center bg-[#171827]/55 p-4" onMouseDown={(event) => { if (event.currentTarget === event.target) setHowItWorksOpen(false); }}><section role="dialog" aria-modal="true" aria-labelledby="tryon-help-title" className="w-full max-w-lg rounded-3xl border border-pink-100 bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0f6] text-[#e90068]"><Sparkles size={21}/></span><h2 id="tryon-help-title" className="mt-3 text-xl font-extrabold">How AI Try-On works</h2></div><button type="button" onClick={() => setHowItWorksOpen(false)} aria-label="Close" className="rounded-full p-2 hover:bg-pink-50"><X size={18}/></button></div><ol className="mt-4 space-y-3 text-sm text-slate-600"><li><b className="text-[#192638]">1. Choose a clear photo.</b> We accept JPEG or PNG up to 10 MB and retain its original resolution; camera capture is available on supported devices.</li><li><b className="text-[#192638]">2. Select an approved product and variation.</b> The product reference is reviewed by the store.</li><li><b className="text-[#192638]">3. Give consent and generate.</b> The image is sent securely to the configured AI provider and shown as an AI preview.</li></ol><p className="mt-4 rounded-xl bg-[#fff4f8] p-3 text-xs leading-5 text-slate-600">Your original photo is deleted after processing. AI previews are illustrative; actual color, size, appearance, and fit may vary.</p><button type="button" onClick={() => setHowItWorksOpen(false)} className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#f74c9b] to-[#e90068] py-3 text-sm font-extrabold text-white">Got it</button></section></div>}
    {compareOpen && <div className="fixed inset-0 z-[75] grid place-items-center bg-[#171827]/70 p-3 sm:p-6" onMouseDown={(event) => { if (event.currentTarget === event.target) setCompareOpen(false); }}><section role="dialog" aria-modal="true" aria-labelledby="compare-looks-title" className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl sm:p-6"><div className="flex items-start justify-between gap-3"><div><h2 id="compare-looks-title" className="text-xl font-extrabold">Compare your AI looks</h2><p className="mt-1 text-xs text-slate-500">Compare {compareResultIds.length} generated product previews.</p></div><button type="button" onClick={() => setCompareOpen(false)} aria-label="Close comparison" className="rounded-full p-2 hover:bg-pink-50"><X size={19}/></button></div><div className={`mt-4 grid gap-3 ${compareResultIds.length === 2 ? "md:grid-cols-2" : compareResultIds.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-4"}`}>{compareResultIds.map((id) => { const result = results.find((item) => item.id === id); if (!result) return null; return <article key={id} className="overflow-hidden rounded-2xl border border-pink-100"><div className="grid grid-cols-2"><img src={result.originalUrl} alt="Original photo" className="aspect-[.75] h-full w-full bg-pink-50 object-contain"/><img src={result.previewUrl} alt={`AI preview for ${result.product.name}`} className="aspect-[.75] h-full w-full bg-pink-50 object-contain"/></div><div className="p-3"><h3 className="line-clamp-1 text-sm font-bold">{result.product.name}</h3><p className="mt-1 text-xs text-slate-500">{result.product.variants.find((variant) => variant.id === result.variantId)?.variantName || "Selected item"}</p></div></article>; })}</div></section></div>}
    {fullscreen && currentPreview && <div className="fixed inset-0 z-[80] grid place-items-center bg-black/90 p-3 sm:p-8"><button type="button" onClick={() => setFullscreen(false)} aria-label="Close fullscreen preview" className="absolute right-4 top-4 z-10 rounded-full bg-white/15 p-3 text-white"><X size={22}/></button><img src={previewMode === "result" ? currentPreview.previewUrl : currentPreview.previewUrl} alt="AI-generated try-on preview" className="max-h-full max-w-full object-contain"/></div>}
  </main>;
}
