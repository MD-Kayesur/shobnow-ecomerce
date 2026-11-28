import { useState } from "react";
import { ImagePlus, LoaderCircle, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";
import {
  PromoCarouselBanner,
  PromoCarouselInput,
  PromoCarouselStatus,
  useCreatePromoCarouselBannerMutation,
  useDeletePromoCarouselBannerMutation,
  useGetAdminPromoCarouselBannersQuery,
  useUpdatePromoCarouselBannerMutation,
} from "@/redux/features/promoCarousel/promoCarouselApi";
import { getImageUrl } from "@/utils/imageUrl";

const PAGE_SIZE = 8;
const emptyForm: PromoCarouselInput = {
  title: "",
  subtitle: "",
  targetUrl: "",
  status: "ACTIVE",
  position: 1,
  sortOrder: 1,
  startsAt: null,
  endsAt: null,
};

function localDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function errorText(error: unknown) {
  const message = (error as { data?: { message?: string | string[] } })?.data?.message;
  return Array.isArray(message) ? message.join(" ") : message || "Could not save the promotional banner.";
}

export default function PromoCarouselBannersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PromoCarouselStatus | "ALL">("ALL");
  const [editing, setEditing] = useState<PromoCarouselBanner | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<PromoCarouselInput>(emptyForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const { data, isLoading, isFetching, isError, refetch } = useGetAdminPromoCarouselBannersQuery({
    page,
    limit: PAGE_SIZE,
    ...(statusFilter === "ALL" ? {} : { status: statusFilter }),
  });
  const { data: activeSummary } = useGetAdminPromoCarouselBannersQuery({ page: 1, limit: 100, status: "ACTIVE" });
  const [createBanner, createState] = useCreatePromoCarouselBannerMutation();
  const [updateBanner, updateState] = useUpdatePromoCarouselBannerMutation();
  const [deleteBanner] = useDeletePromoCarouselBannerMutation();
  const banners = data?.data || [];
  const activeCount = activeSummary?.meta.total ?? 0;
  const pageCount = Math.max(data?.meta.totalPages || 1, 1);

  const startCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setNotice("");
    setIsCreating(true);
  };

  const startEdit = (banner: PromoCarouselBanner) => {
    setEditing(banner);
    setForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      targetUrl: banner.targetUrl || "",
      status: banner.status,
      position: banner.position,
      sortOrder: banner.sortOrder,
      startsAt: localDate(banner.startsAt),
      endsAt: localDate(banner.endsAt),
    });
    setError("");
    setNotice("");
    setIsCreating(false);
  };

  const closeForm = () => {
    setEditing(null);
    setIsCreating(false);
    setError("");
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const input = event.currentTarget.elements.namedItem("promo-carousel-image") as HTMLInputElement | null;
    const image = input?.files?.[0];
    if (isCreating && !image) {
      setError("Choose a wide banner image to create a slide.");
      return;
    }
    if (!form.position || !form.sortOrder || form.sortOrder < 1) {
      setError("Choose a slide position and display order.");
      return;
    }
    if (form.startsAt && form.endsAt && new Date(form.startsAt) >= new Date(form.endsAt)) {
      setError("The end time must be later than the start time.");
      return;
    }
    const changes = { ...form, image };
    try {
      if (editing) await updateBanner({ id: editing.id, changes }).unwrap();
      else await createBanner(changes).unwrap();
      setNotice(editing ? "Promotional slide updated." : "Promotional slide created.");
      closeForm();
    } catch (saveError) {
      setError(errorText(saveError));
    }
  };

  const remove = async (banner: PromoCarouselBanner) => {
    if (!window.confirm(`Delete “${banner.title || "this promotional slide"}”?`)) return;
    setError("");
    try {
      await deleteBanner(banner.id).unwrap();
      setNotice("Promotional slide deleted.");
    } catch (deleteError) {
      setError(errorText(deleteError));
    }
  };

  const setField = <K extends keyof PromoCarouselInput>(key: K, value: PromoCarouselInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <main className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Independent homepage placement</p>
          <h1 className="mt-1 text-3xl font-extrabold text-[#171b4b]">Promotional Carousel</h1>
          <p className="mt-1 text-sm text-slate-500">Manage up to four scheduled wide campaign slides for this separate homepage slot.</p>
        </div>
        <button type="button" onClick={startCreate} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary-hover">
          <Plus className="h-4 w-4" /> Add slide
        </button>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <Summary label="Slides" value={data?.meta.total ?? 0} />
        <Summary label="Active on this page" value={activeCount} />
        <Summary label="Available positions" value={Math.max(0, 4 - activeCount)} />
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">This carousel has its own API, database records, uploads, and admin controls.</p>
        <div className="flex items-center gap-2">
          <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value as PromoCarouselStatus | "ALL"); setPage(1); }} className="rounded-xl border border-pink-100 bg-white px-3 py-2 text-sm text-slate-700">
            <option value="ALL">All statuses</option><option value="ACTIVE">Active</option><option value="DRAFT">Draft</option>
          </select>
          <button type="button" onClick={() => void refetch()} disabled={isFetching} className="inline-flex items-center gap-2 rounded-xl border border-pink-100 px-3 py-2 text-sm font-semibold text-slate-600 disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </section>

      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}
      {error && !isCreating && !editing && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      {isError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">Could not load promotional carousel slides. Check the backend connection and try again.</p>}

      {isLoading ? (
        <div className="rounded-2xl border border-pink-100 bg-white py-16 text-center text-sm text-slate-500"><LoaderCircle className="mx-auto mb-2 h-5 w-5 animate-spin" />Loading slides…</div>
      ) : banners.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-pink-200 bg-white py-16 text-center">
          <p className="font-semibold text-slate-700">No promotional slides yet</p>
          <p className="mt-1 text-sm text-slate-500">Add the first wide banner to make it appear in the homepage slot.</p>
        </div>
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {banners.map((banner) => (
            <article key={banner.id} className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
              <img src={getImageUrl(banner.image)} alt={banner.title || "Promotional slide"} className="aspect-[5.55/1] w-full bg-pink-50 object-cover" />
              <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-bold text-[#171b4b]">{banner.title || "Untitled promotional slide"}</p>
                  <p className="mt-1 text-xs text-slate-500">Position {banner.position} · Order {banner.sortOrder} · {banner.status}</p>
                  {(banner.startsAt || banner.endsAt) && <p className="mt-1 text-xs text-slate-500">{banner.startsAt ? new Date(banner.startsAt).toLocaleString() : "No start"} – {banner.endsAt ? new Date(banner.endsAt).toLocaleString() : "No end"}</p>}
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => startEdit(banner)} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                  <button type="button" onClick={() => void remove(banner)} className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-600"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Page {data?.meta.page ?? page} of {pageCount}</span>
        <div className="flex gap-2">
          <button type="button" disabled={page <= 1 || isFetching} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40">Previous</button>
          <button type="button" disabled={page >= pageCount || isFetching} onClick={() => setPage((current) => current + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40">Next</button>
        </div>
      </div>

      {(isCreating || editing) && (
        <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}>
          <form onSubmit={(event) => void save(event)} className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-pink-100 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-pink-100 bg-white px-5 py-4"><div><h2 className="text-lg font-bold text-[#171b4b]">{editing ? "Edit promotional slide" : "Create promotional slide"}</h2><p className="text-xs text-slate-500">This slide is managed separately from homepage banners.</p></div><button type="button" onClick={closeForm} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close"><X className="h-4 w-4" /></button></div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Field label="Title"><input value={form.title || ""} onChange={(event) => setField("title", event.target.value)} maxLength={150} className="promo-banner-input" /></Field>
              <Field label="Subtitle"><input value={form.subtitle || ""} onChange={(event) => setField("subtitle", event.target.value)} maxLength={300} className="promo-banner-input" /></Field>
              <Field label="Target URL"><input value={form.targetUrl || ""} onChange={(event) => setField("targetUrl", event.target.value)} maxLength={1000} placeholder="/shop?category=makeup" className="promo-banner-input" /></Field>
              <Field label="Status"><select value={form.status || "ACTIVE"} onChange={(event) => setField("status", event.target.value as PromoCarouselStatus)} className="promo-banner-input"><option value="ACTIVE">Active</option><option value="DRAFT">Draft</option></select></Field>
              <Field label="Position"><select value={form.position} onChange={(event) => setField("position", Number(event.target.value))} className="promo-banner-input">{[1, 2, 3, 4].map((position) => <option key={position} value={position}>{position}</option>)}</select></Field>
              <Field label="Display order"><input type="number" min={1} value={form.sortOrder} onChange={(event) => setField("sortOrder", Number(event.target.value))} className="promo-banner-input" /></Field>
              <Field label="Starts at (optional)"><input type="datetime-local" value={form.startsAt || ""} onChange={(event) => setField("startsAt", event.target.value || null)} className="promo-banner-input" /></Field>
              <Field label="Ends at (optional)"><input type="datetime-local" value={form.endsAt || ""} onChange={(event) => setField("endsAt", event.target.value || null)} className="promo-banner-input" /></Field>
              <Field label={editing ? "Replace wide banner image (optional)" : "Wide banner image (about 5.5:1)"}><label className="flex cursor-pointer items-center gap-2 rounded-xl border border-pink-100 bg-pink-50/30 px-3 py-2.5 text-sm text-slate-600"><ImagePlus className="h-4 w-4 text-primary" /><span className="truncate">Choose image</span><input id="promo-carousel-image" name="promo-carousel-image" type="file" accept="image/jpeg,image/png,image/webp" required={!editing} className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) setField("image", file); }} />{form.image instanceof File && <span className="truncate text-xs">{form.image.name}</span>}</label>{editing && <img src={getImageUrl(editing.image)} alt="Current promotional banner" className="mt-2 h-20 w-36 rounded-lg object-cover" />}</Field>
            </div>
            {error && <p role="alert" className="mx-5 mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
            <div className="flex justify-end gap-2 border-t border-pink-100 px-5 py-4"><button type="button" onClick={closeForm} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button><button type="submit" disabled={createState.isLoading || updateState.isLoading} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-60">{(createState.isLoading || updateState.isLoading) && <LoaderCircle className="h-4 w-4 animate-spin" />}{editing ? "Save changes" : "Create slide"}</button></div>
          </form>
        </div>
      )}
    </main>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 text-2xl font-extrabold text-[#171b4b]">{value}</p></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1.5 text-xs font-semibold text-slate-700"><span>{label}</span>{children}</label>;
}
