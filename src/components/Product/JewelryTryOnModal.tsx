import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Camera, Check, Download, ImagePlus, LoaderCircle, LockKeyhole, RefreshCw, Sparkles, Trash2, Upload, X } from "lucide-react";
import "./JewelryTryOn.css";
import { useAppSelector } from "@/redux/hooks/redux-hook";
import { useDeleteJewelryTryOnMutation, useGetJewelryTryOnQuery, useSaveAiLookMutation, useStartJewelryTryOnMutation, StoreProduct } from "@/redux/features/storefront/storefrontApi";

const apiBase = import.meta.env.VITE_API_ENDPOINT || "http://localhost:4001/api/v1";
const origin = apiBase.replace(/\/api\/v\d+\/?$/, "");
const money = (amount: number | string) => `৳${Number(amount || 0).toLocaleString("en-BD")}`;

type Props = { product: StoreProduct; variantId?: string; variantName?: string; price: number; productImage: string; onClose: () => void };

export default function JewelryTryOnModal({ product, variantId, variantName, price, productImage, onClose }: Props) {
  const token = useAppSelector((state) => state.auth.token);
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [split, setSplit] = useState(50);
  const [startTryOn] = useStartJewelryTryOnMutation();
  const [saveLook, saveState] = useSaveAiLookMutation();
  const [deleteSession] = useDeleteJewelryTryOnMutation();
  const { data: sessionResponse } = useGetJewelryTryOnQuery(sessionId, { skip: !sessionId, pollingInterval: sessionId ? 2500 : 0, refetchOnMountOrArgChange: true });
  const session = sessionResponse?.data;
  const generated = session?.images?.[0];
  const processing = uploading || (!!sessionId && !["COMPLETED", "FAILED", "DELETED"].includes(session?.status || ""));
  const [generatedUrl, setGeneratedUrl] = useState("");
  const localUrl = useMemo(() => file ? URL.createObjectURL(file) : "", [file]);
  const close = useCallback(async () => { if (sessionId && !saved) { try { await deleteSession(sessionId).unwrap(); } catch { /* Expiring results are cleaned up by the backend. */ } } onClose(); }, [deleteSession, onClose, saved, sessionId]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape" && !processing) void close(); };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", onKeyDown); };
  }, [close, processing]);
  useEffect(() => { return () => { if (localUrl) URL.revokeObjectURL(localUrl); }; }, [localUrl]);
  useEffect(() => {
    let live = true;
    let objectUrl = "";
    if (!generated?.url || !token) { setGeneratedUrl(""); return; }
    void fetch(`${origin}${generated.url}`, { headers: { Authorization: `Bearer ${token}` }, credentials: "include" })
      .then(async (response) => { if (!response.ok) throw new Error("The private preview could not be loaded."); return response.blob(); })
      .then((blob) => { objectUrl = URL.createObjectURL(blob); if (live) setGeneratedUrl(objectUrl); })
      .catch((reason: unknown) => { if (live) setError(reason instanceof Error ? reason.message : "The private preview could not be loaded."); });
    return () => { live = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [generated?.url, token]);

  const chooseFile = (next?: File) => {
    setError(""); setSaved(false); setSessionId("");
    if (!next) return;
    if (!/^image\/(jpeg|png)$/.test(next.type)) { setError("Choose a JPEG or PNG photo."); return; }
    if (next.size > 5 * 1024 * 1024) { setError("Your photo must be 5 MB or smaller."); return; }
    setFile(next);
  };

  const generate = async () => {
    if (!file || !consent || !token || uploading) return;
    setUploading(true); setError(""); setSessionId(""); setSaved(false);
    const body = new FormData(); body.append("photo", file); body.append("productId", product.id); body.append("consent", "true");
    if (variantId) body.append("variantId", variantId);
    try { const response = await startTryOn(body).unwrap(); setSessionId(response.data.sessionId); }
    catch (cause) { const message = (cause as { data?: { message?: string | string[] } })?.data?.message; setError(Array.isArray(message) ? message.join(" ") : message || "The try-on could not be started. Please retry."); }
    finally { setUploading(false); }
  };

  const download = async () => {
    if (!generated?.url || !token) return;
    try { const response = await fetch(`${origin}${generated.url}`, { headers: { Authorization: `Bearer ${token}` }, credentials: "include" }); if (!response.ok) throw new Error(); const url = URL.createObjectURL(await response.blob()); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${product.slug}-ai-preview.jpg`; anchor.click(); URL.revokeObjectURL(url); }
    catch { setError("Download failed. Please try again."); }
  };

  const completed = session?.status === "COMPLETED" && !!generatedUrl;
  const failed = session?.status === "FAILED";
  const guides = String(product.jewelryDetails?.category || "").toUpperCase();
  const guideline = guides === "EARRING" ? "Use a clear, front-facing photo with at least one ear visible." : guides === "RING" ? "Use a clear photo of your hand with the selected finger visible." : guides === "BRACELET" || guides === "WATCH" ? "Use a clear photo of your wrist and hand." : "Use a clear photo showing your neck and upper chest.";

  return <div className="sn-tryon-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !processing) void close(); }}>
    <section className="sn-tryon-modal" role="dialog" aria-modal="true" aria-labelledby="sn-tryon-title" tabIndex={-1}>
      <header className="sn-tryon-header"><div className="sn-tryon-title-icon"><Sparkles size={19}/></div><div><h2 id="sn-tryon-title">AI Try On</h2><p>Preview this jewelry on your photo</p></div><button className="sn-tryon-icon-button" aria-label="Close try-on" disabled={processing} onClick={() => void close()}><X size={20}/></button></header>
      <div className="sn-tryon-product"><img src={productImage} alt=""/><div><b>{product.name}</b><small>{variantName || "Selected variation"} · {money(price)}</small></div></div>
      {!completed && <>
        <div className="sn-tryon-guidance"><b>Photo tips</b><p>{guideline} Use natural light, keep the target area unobstructed, and upload a JPEG or PNG up to 5 MB.</p></div>
        {!token && <div className="sn-tryon-notice"><LockKeyhole size={17}/> Sign in to generate a private try-on preview. <Link to="/login" state={{ from: location.pathname }}>Sign in</Link></div>}
        <div className="sn-tryon-upload" onClick={() => fileInput.current?.click()} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") fileInput.current?.click(); }}>
          {localUrl ? <img src={localUrl} alt="Selected photo preview"/> : <><span><ImagePlus size={23}/></span><b>Choose a photo</b><small>Your private original photo is deleted after processing. Unsaved generated previews follow the store’s disclosed retention period.</small></>}
        </div>
        <input ref={fileInput} type="file" accept="image/jpeg,image/png" hidden onChange={(event) => chooseFile(event.target.files?.[0])}/>
        <input ref={cameraInput} type="file" accept="image/jpeg,image/png" capture="user" hidden onChange={(event) => chooseFile(event.target.files?.[0])}/>
        <div className="sn-tryon-photo-actions"><button onClick={() => fileInput.current?.click()}><Upload size={16}/> Upload photo</button><button onClick={() => cameraInput.current?.click()}><Camera size={16}/> Take photo</button></div>
        <label className="sn-tryon-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)}/><span>I agree to process this photo for this try-on. It will not be used for advertising or model training. Unsaved photos are deleted after 24 hours.</span></label>
      </>}
      {processing && <div className="sn-tryon-progress"><LoaderCircle className="sn-spin" size={20}/><span><b>{uploading ? "Uploading and preparing your image…" : "Creating your preview…"}</b><small>This can take a little while. Please keep this window open.</small></span></div>}
      {failed && <div className="sn-tryon-error"><AlertCircle size={18}/><span>{session.errorMessage || "The preview could not be generated."}</span></div>}
      {error && <div className="sn-tryon-error"><AlertCircle size={18}/><span>{error}</span></div>}
      {completed && <>
        <div className="sn-tryon-result"><div className="sn-tryon-compare" style={{ "--split": `${split}%` } as React.CSSProperties}><img src={localUrl} alt="Original uploaded photo"/><img className="sn-tryon-after" src={generatedUrl} alt="AI-generated jewelry try-on preview"/><span className="sn-tryon-before-label">Before</span><span className="sn-tryon-after-label">AI preview</span><span className="sn-tryon-divider"/><input aria-label="Compare before and AI preview" type="range" min="0" max="100" value={split} onChange={(event) => setSplit(Number(event.target.value))}/></div><p>AI-generated preview. Actual color, size, appearance, and fit may vary.</p></div>
        <div className="sn-tryon-result-actions"><button onClick={() => { setSessionId(""); setFile(null); setConsent(false); }}><RefreshCw size={16}/> Try another photo</button><button onClick={() => void download()}><Download size={16}/> Download</button><button disabled={saveState.isLoading || saved} onClick={() => { if (generated) void saveLook({ generatedImageId: generated.id, title: product.name }).unwrap().then(() => setSaved(true)).catch(() => setError("Could not save this look. Please try again.")); }}><Check size={16}/>{saved ? "Saved to My AI Looks" : "Save my look"}</button></div>
      </>}
      {!completed && <footer className="sn-tryon-footer"><button className="sn-tryon-primary" disabled={!file || !consent || !token || processing} onClick={() => void generate()}>{failed ? <RefreshCw size={17}/> : <Sparkles size={17}/>} {failed ? "Retry generation" : "Generate my look"}</button><p><LockKeyhole size={13}/> Secure processing · The original photo is deleted after processing</p></footer>}
      {completed && <footer className="sn-tryon-footer"><button className="sn-tryon-secondary" onClick={() => void close()}><Trash2 size={15}/> Delete preview and close</button></footer>}
    </section>
  </div>;
}
