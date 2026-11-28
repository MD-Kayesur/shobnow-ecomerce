import { useEffect, useRef, useState } from "react";
import { BadgeCheck, BarChart3, Check, Clock3, Image, LoaderCircle, RefreshCw, Save, Search, Settings2, ShieldAlert, Sparkles, Upload, Users } from "lucide-react";
import { toast } from "sonner";
import { useGetAiStudioDashboardQuery, useGetAdminTryOnAssetsQuery, useUpdateAiStudioSettingsMutation, useUpdateAdminTryOnAssetMutation, useUploadAdminTryOnAssetMutation, type AiStudioSettings } from "@/redux/features/admin/aiStudioApi";
import { useGetAdminProductsQuery, useGetAdminProductVariantsQuery } from "@/redux/features/admin/productsApi";

const CATEGORIES = [
  ["EARRING", "Earrings"], ["RING", "Rings"], ["NECKLACE", "Necklaces"],
  ["PENDANT", "Pendants"], ["BRACELET", "Bracelets"], ["WATCH", "Watches"],
] as const;
const numberFormat = (value: number) => new Intl.NumberFormat("en-BD").format(value);

export default function AiTryOnAdminPage() {
  const { data, isLoading, isError, refetch } = useGetAiStudioDashboardQuery();
  const [updateSettings, updateState] = useUpdateAiStudioSettingsMutation();
  const [productSearch, setProductSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [assetName, setAssetName] = useState("");
  const [assetVariantId, setAssetVariantId] = useState("");
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const assetInputRef = useRef<HTMLInputElement>(null);
  const { data: productsData } = useGetAdminProductsQuery({ page: 1, limit: 100, search: productSearch || undefined });
  const jewelryProducts = (productsData?.data || []).filter((product) => product.productCategory === "JEWELRY");
  const { data: assetsData, isFetching: assetsFetching } = useGetAdminTryOnAssetsQuery(selectedProductId, { skip: !selectedProductId });
  const { data: variantsData } = useGetAdminProductVariantsQuery(selectedProductId, { skip: !selectedProductId });
  const [uploadAsset, uploadState] = useUploadAdminTryOnAssetMutation();
  const [updateAsset] = useUpdateAdminTryOnAssetMutation();
  const [form, setForm] = useState<AiStudioSettings | null>(null);
  const dashboard = data?.data;

  useEffect(() => { if (dashboard) setForm(dashboard.settings); }, [dashboard]);
  const toggleCategory = (category: string) => setForm((current) => current ? ({ ...current, supportedCategories: current.supportedCategories.includes(category) ? current.supportedCategories.filter((item) => item !== category) : [...current.supportedCategories, category] }) : current);
  const save = async () => {
    if (!form) return;
    try {
      await updateSettings({ isEnabled: form.isEnabled, supportedCategories: form.supportedCategories, dailyGenerationLimit: Number(form.dailyGenerationLimit), generatedImageRetentionDays: Number(form.generatedImageRetentionDays) }).unwrap();
      toast.success("AI Try-On settings saved.");
    } catch { toast.error("Could not save AI Try-On settings."); }
  };
  const submitAsset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProductId || !assetFile) return;
    if (!/^image\/(jpeg|png)$/.test(assetFile.type) || assetFile.size > 5 * 1024 * 1024) { toast.error("Choose a JPEG or PNG image under 5 MB."); return; }
    const body = new FormData(); body.append("image", assetFile);
    if (assetName.trim()) body.append("assetName", assetName.trim());
    if (assetVariantId) body.append("variantId", assetVariantId);
    try { await uploadAsset({ productId: selectedProductId, body }).unwrap(); setAssetName(""); setAssetVariantId(""); setAssetFile(null); if (assetInputRef.current) assetInputRef.current.value = ""; toast.success("Reference uploaded. Approve it before customers can use it."); }
    catch { toast.error("Could not upload the try-on reference."); }
  };

  if (isLoading) return <div className="grid min-h-64 place-items-center text-sm text-slate-500"><LoaderCircle className="animate-spin text-primary"/>Loading AI Studio settings…</div>;
  if (isError || !dashboard || !form) return <div className="rounded-2xl border border-rose-200 bg-white p-6 text-sm text-rose-700">Could not load AI Studio settings. <button onClick={() => void refetch()} className="ml-2 font-bold underline">Retry</button></div>;

  const metrics = [
    { label: "Total sessions", value: dashboard.analytics.totalSessions, detail: `${numberFormat(dashboard.analytics.sessionsLast30Days)} in last 30 days`, icon: Users },
    { label: "Generated previews", value: dashboard.analytics.generatedImages, detail: "Currently retained images", icon: Image },
    { label: "Saved looks", value: dashboard.analytics.savedLooks, detail: "Customer lookbooks", icon: Sparkles },
    { label: "Failed generations", value: dashboard.analytics.failedSessions, detail: `${dashboard.analytics.failureRate}% overall failure rate`, icon: ShieldAlert },
  ];

  return <div className="mx-auto max-w-7xl space-y-6 pb-10">
    <header className="flex flex-wrap items-center justify-between gap-3"><div><p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-primary"><Sparkles size={14}/> AI Commerce</p><h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">AI Try-On Studio</h1><p className="mt-1 text-sm text-slate-500">Provider readiness, category eligibility, privacy retention, and usage.</p></div><button onClick={() => void refetch()} className="inline-flex items-center gap-2 rounded-xl border border-pink-100 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-pink-50"><RefreshCw size={16}/>Refresh metrics</button></header>

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, detail, icon: Icon }) => <article key={label} className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-500">{label}</span><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#fff0f6] text-primary"><Icon size={18}/></span></div><strong className="mt-3 block text-3xl font-extrabold text-slate-900">{numberFormat(value)}</strong><p className="mt-1 text-xs text-slate-500">{detail}</p></article>)}</section>

    <section className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
      <article className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><Settings2 size={19} className="text-primary"/><h2 className="text-lg font-extrabold">Studio controls</h2></div><p className="mt-1 text-xs text-slate-500">Changes apply to new customer generation requests.</p></div><label className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold"><input type="checkbox" checked={form.isEnabled} onChange={(event) => setForm({ ...form, isEnabled: event.target.checked })} className="h-4 w-4 accent-[#e90068]"/>Enabled</label></div>
        <div className="mt-5"><h3 className="text-sm font-bold">Supported product placements</h3><div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">{CATEGORIES.map(([value,label]) => <label key={value} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium ${form.supportedCategories.includes(value) ? "border-[#e90068] bg-[#fff5f9] text-[#9e0b4d]" : "border-slate-200 text-slate-600"}`}><input type="checkbox" checked={form.supportedCategories.includes(value)} onChange={() => toggleCategory(value)} className="accent-[#e90068]"/>{label}</label>)}</div></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold">Daily generations per account<input type="number" min={1} max={100} value={form.dailyGenerationLimit} onChange={(event) => setForm({ ...form, dailyGenerationLimit: Number(event.target.value) })} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-[#e90068]"/><span className="mt-1 block text-[11px] font-normal text-slate-500">Between 1 and 100. Rate limits also apply per API.</span></label><label className="text-sm font-semibold">Unsaved preview retention<input type="number" min={1} max={90} value={form.generatedImageRetentionDays} onChange={(event) => setForm({ ...form, generatedImageRetentionDays: Number(event.target.value) })} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-[#e90068]"/><span className="mt-1 block text-[11px] font-normal text-slate-500">Between 1 and 90 days. Saved looks have their own retention.</span></label></div>
        <button onClick={() => void save()} disabled={updateState.isLoading || form.supportedCategories.length === 0 || form.dailyGenerationLimit < 1 || form.dailyGenerationLimit > 100 || form.generatedImageRetentionDays < 1 || form.generatedImageRetentionDays > 90} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#f74c9b] to-[#e90068] px-5 text-sm font-extrabold text-white disabled:opacity-50">{updateState.isLoading ? <LoaderCircle size={16} className="animate-spin"/> : <Save size={16}/>}Save settings</button>
      </article>

      <div className="space-y-5">
        <article className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><BadgeCheck size={19} className="text-primary"/><h2 className="text-lg font-extrabold">AI provider readiness</h2></div><div className="mt-4 space-y-3 text-sm"><p className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3"><span className="text-slate-500">Provider</span><b>{dashboard.provider.name} · {dashboard.provider.model}</b></p><p className="flex items-center justify-between gap-2"><span className="text-slate-500">Server API key</span><b className={dashboard.provider.apiKeyConfigured ? "text-emerald-700" : "text-rose-700"}>{dashboard.provider.apiKeyConfigured ? "Configured" : "Missing"}</b></p><p className="flex items-center justify-between gap-2"><span className="text-slate-500">Private processing terms</span><b className={dashboard.provider.privateProcessingConfirmed ? "text-emerald-700" : "text-rose-700"}>{dashboard.provider.privateProcessingConfirmed ? "Confirmed" : "Not confirmed"}</b></p></div><p className="mt-4 rounded-xl bg-[#fff6fa] p-3 text-xs leading-5 text-slate-600">Provider credentials stay on the server and are never shown here. Customer photos are not exposed on this admin page.</p></article>
        <article className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><BarChart3 size={19} className="text-primary"/><h2 className="text-lg font-extrabold">Most tried products</h2></div>{dashboard.analytics.topProducts.length ? <div className="mt-3 divide-y divide-slate-100">{dashboard.analytics.topProducts.map((product,index) => <div key={product.id} className="flex items-center justify-between gap-3 py-2.5"><span className="min-w-0 truncate text-sm"><span className="mr-2 text-xs font-bold text-slate-400">{index + 1}.</span>{product.name}</span><b className="shrink-0 rounded-full bg-[#fff0f6] px-2.5 py-1 text-xs text-[#a50d50]">{product.tryOnCount} tries</b></div>)}</div> : <p className="mt-3 rounded-xl bg-slate-50 p-5 text-center text-xs text-slate-500">No try-on sessions have been recorded yet.</p>}<p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500"><Clock3 size={13}/>Session completion: {numberFormat(dashboard.analytics.completedSessions)} · failures: {numberFormat(dashboard.analytics.failedSessions)}</p></article>
      </div>
    </section>

    <section className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">
      <div><div className="flex items-center gap-2"><Image size={19} className="text-primary"/><h2 className="text-lg font-extrabold">Product eligibility &amp; reference review</h2></div><p className="mt-1 text-xs text-slate-500">Upload a private reference image for a jewelry product, attach it to a variation if needed, then approve it for customer try-on.</p></div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(240px,.7fr)_minmax(0,1.3fr)]">
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"><label className="text-xs font-bold text-slate-700">Find a jewelry product<div className="mt-1.5 flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3"><Search size={15} className="text-slate-400"/><input value={productSearch} onChange={(event) => setProductSearch(event.target.value)} placeholder="Search by product name" className="min-w-0 flex-1 text-sm outline-none"/></div></label><select aria-label="Choose jewelry product" value={selectedProductId} onChange={(event) => { setSelectedProductId(event.target.value); setAssetVariantId(""); }} className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"><option value="">Select product</option>{jewelryProducts.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select>
          <form onSubmit={(event) => void submitAsset(event)} className="mt-4 space-y-3 border-t border-slate-200 pt-4"><h3 className="text-sm font-bold">Add a reference image</h3><input value={assetName} onChange={(event) => setAssetName(event.target.value)} placeholder="Image label (optional)" maxLength={150} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#e90068]"/><select aria-label="Attach to variation" value={assetVariantId} onChange={(event) => setAssetVariantId(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm"><option value="">Use for all variations</option>{(variantsData?.data || []).map((variant) => <option key={variant.id} value={variant.id}>{variant.variantName}{variant.color ? ` · ${variant.color}` : ""}</option>)}</select><input ref={assetInputRef} type="file" accept="image/jpeg,image/png" onChange={(event) => setAssetFile(event.target.files?.[0] || null)} className="block w-full text-xs text-slate-600 file:mr-2 file:rounded-lg file:border-0 file:bg-[#fff0f6] file:px-3 file:py-2 file:font-bold file:text-[#ad0d54]"/><p className="text-[11px] text-slate-500">JPEG or PNG up to 5 MB. The reference remains private.</p><button type="submit" disabled={!selectedProductId || !assetFile || uploadState.isLoading} className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#f74c9b] to-[#e90068] px-4 text-sm font-extrabold text-white disabled:opacity-50">{uploadState.isLoading ? <LoaderCircle size={15} className="animate-spin"/> : <Upload size={15}/>}Upload for approval</button></form>
        </div>
        <div className="min-h-48 rounded-xl border border-slate-100 p-4"><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-bold">Reference images {selectedProductId ? `· ${jewelryProducts.find((product) => product.id === selectedProductId)?.name || "Selected product"}` : ""}</h3>{selectedProductId && <span className="text-[11px] text-slate-500">Private catalog assets</span>}</div>{!selectedProductId ? <p className="mt-8 text-center text-xs text-slate-500">Select a product to review its uploaded references.</p> : assetsFetching ? <div className="grid min-h-32 place-items-center"><LoaderCircle size={19} className="animate-spin text-primary"/></div> : (assetsData?.data || []).length === 0 ? <p className="mt-8 text-center text-xs text-slate-500">No reference images yet. Upload one to enable product-specific try-on.</p> : <div className="mt-3 space-y-2">{assetsData?.data.map((asset) => <div key={asset.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-3"><div className="flex items-center gap-2.5"><span className={`grid h-8 w-8 place-items-center rounded-lg ${asset.isApproved && asset.isActive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}><Image size={15}/></span><div><p className="text-sm font-semibold">{asset.assetName || "Product reference"}</p><p className="text-[11px] text-slate-500">{asset.isApproved ? "Approved" : "Awaiting approval"} · {asset.isActive ? "Active" : "Inactive"} · {new Date(asset.createdAt).toLocaleDateString("en-BD")}</p></div></div><button type="button" onClick={() => void updateAsset({ assetId: asset.id, productId: selectedProductId, isApproved: !asset.isApproved, isActive: true }).unwrap().then(() => toast.success(asset.isApproved ? "Reference approval removed." : "Reference approved for try-on.")).catch(() => toast.error("Could not update the reference."))} className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold ${asset.isApproved && asset.isActive ? "border border-slate-200 bg-white text-slate-700" : "bg-emerald-600 text-white"}`}>{asset.isApproved && asset.isActive ? "Unapprove" : <><Check size={14}/>Approve</>}</button></div>)}</div>}
        </div>
      </div>
    </section>
  </div>;
}
