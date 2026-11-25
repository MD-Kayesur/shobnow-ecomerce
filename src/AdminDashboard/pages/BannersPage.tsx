import { useMemo, useState } from "react";
import { ImagePlus, LoaderCircle, Pencil, Plus, Search, X } from "lucide-react";
import {
  AdminBanner,
  BannerInput,
  BannerStatus,
  BannerType,
  useCreateAdminBannerMutation,
  useGetAdminBannersQuery,
  useUpdateAdminBannerMutation,
} from "@/redux/features/admin/bannersApi";

const PAGE_SIZE = 12;
const API_BASE = import.meta.env.VITE_API_ENDPOINT || "http://localhost:4001/api/v1";
const SERVER_ORIGIN = API_BASE.replace(/\/api\/v\d+\/?$/, "");
const TYPE_LABELS: Record<BannerType, string> = {
  PRIMARY: "Primary carousel",
  SECONDARY: "Secondary",
  MIDDLE: "Middle",
  LAST_MIDDLE: "Last middle",
  FOOTER: "Footer",
};
const ALL_TYPES = Object.keys(TYPE_LABELS) as BannerType[];

function imageUrl(path: string) {
  return path.startsWith("http") ? path : `${SERVER_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
}

function errorMessage(error: unknown) {
  const data = (error as { data?: { message?: string | string[] } })?.data;
  const message = data?.message;
  return Array.isArray(message) ? message.join(" ") : message || "Could not save the banner. Check the fields and try again.";
}

function localDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function bannerDefaults(banner?: AdminBanner): BannerInput {
  return {
    type: banner?.type ?? "PRIMARY",
    title: banner?.title ?? "",
    subtitle: banner?.subtitle ?? "",
    targetUrl: banner?.targetUrl ?? "",
    status: banner?.status ?? "DRAFT",
    position: banner?.position ?? 1,
    sortOrder: banner?.sortOrder ?? 1,
    startsAt: localDate(banner?.startsAt ?? null),
    endsAt: localDate(banner?.endsAt ?? null),
  };
}

const BannersPage = () => {
  const [type, setType] = useState<BannerType | "ALL">("ALL");
  const [status, setStatus] = useState<BannerStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminBanner | null>(null);
  const [editing, setEditing] = useState<AdminBanner | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<BannerInput>(bannerDefaults());
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const query = {
    page,
    limit: PAGE_SIZE,
    ...(type !== "ALL" ? { type } : {}),
    ...(status !== "ALL" ? { status } : {}),
  };
  const { data, isLoading, isFetching, isError, refetch } = useGetAdminBannersQuery(query);
  const [createBanner, createState] = useCreateAdminBannerMutation();
  const [updateBanner, updateState] = useUpdateAdminBannerMutation();
  const banners = data?.data ?? [];
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return banners;
    return banners.filter((banner) => [banner.title, banner.subtitle, banner.type, banner.targetUrl, banner.position]
      .some((value) => String(value ?? "").toLowerCase().includes(needle)));
  }, [banners, search]);

  const openCreate = () => {
    setSelected(null);
    setEditing(null);
    setForm(bannerDefaults());
    setFormError("");
    setCreating(true);
  };

  const openEdit = (banner: AdminBanner) => {
    setSelected(null);
    setEditing(banner);
    setForm(bannerDefaults(banner));
    setFormError("");
    setCreating(false);
  };

  const closeDialog = () => {
    setCreating(false);
    setEditing(null);
    setSelected(null);
    setFormError("");
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setNotice("");
    const imageInput = event.currentTarget.elements.namedItem("banner-image") as HTMLInputElement | null;
    const image = imageInput?.files?.[0];
    if (creating && !image) {
      setFormError("Choose an image file for the new banner.");
      return;
    }
    if ((form.type === "PRIMARY" || form.type === "SECONDARY") && (!form.position || !form.sortOrder || form.sortOrder < 1)) {
      setFormError("Select a position from 1–4 and a display order of at least 1.");
      return;
    }
    if ((form.type === "FOOTER" || form.type === "LAST_MIDDLE") && ![1, 2].includes(Number(form.position))) {
      setFormError("Select position 1 or 2.");
      return;
    }
    if (form.type === "PRIMARY" && form.startsAt && form.endsAt && new Date(form.startsAt) >= new Date(form.endsAt)) {
      setFormError("The end time must be later than the start time.");
      return;
    }
    const payload = { ...form, image };
    try {
      if (editing) await updateBanner({ id: editing.id, changes: payload }).unwrap();
      else await createBanner(payload).unwrap();
      setNotice(editing ? "Banner updated." : "Banner created.");
      closeDialog();
    } catch (error) {
      setFormError(errorMessage(error));
    }
  };

  const setField = <K extends keyof BannerInput>(key: K, value: BannerInput[K]) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Homepage management</p>
          <h1 className="mt-1 text-3xl font-extrabold text-[#171b4b]">Banners</h1>
          <p className="mt-1 text-sm text-slate-500">Create, preview, and update every homepage banner placement.</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary-hover">
          <Plus className="h-4 w-4" /> Add banner
        </button>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label="Loaded banners" value={data?.meta.total} />
        <Stat label="Active" value={banners.filter((banner) => banner.status === "ACTIVE").length} tone="green" />
        <Stat label="Drafts" value={banners.filter((banner) => banner.status === "DRAFT").length} tone="amber" />
        {ALL_TYPES.slice(0, 2).map((kind) => <Stat key={kind} label={TYPE_LABELS[kind]} value={banners.filter((banner) => banner.type === kind).length} />)}
      </section>

      <section className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, placement or target URL" className="w-full rounded-xl border border-pink-100 bg-pink-50/40 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary" />
          </label>
          <select value={type} onChange={(event) => { setType(event.target.value as BannerType | "ALL"); setPage(1); }} className="rounded-xl border border-pink-100 bg-white px-3 py-2.5 text-sm text-slate-700">
            <option value="ALL">All placements</option>{ALL_TYPES.map((kind) => <option key={kind} value={kind}>{TYPE_LABELS[kind]}</option>)}
          </select>
          <select value={status} onChange={(event) => { setStatus(event.target.value as BannerStatus | "ALL"); setPage(1); }} className="rounded-xl border border-pink-100 bg-white px-3 py-2.5 text-sm text-slate-700">
            <option value="ALL">All statuses</option><option value="ACTIVE">Active</option><option value="DRAFT">Draft</option>
          </select>
          <span className="text-xs text-slate-500">{data?.meta.total ?? 0} total</span>
        </div>
      </section>

      {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}
      {isError && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">Could not load banners. Check admin access and backend connection. <button onClick={() => void refetch()} className="ml-1 font-bold underline">Retry</button></div>}

      <section className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-pink-50 px-5 py-4">
          <h2 className="font-bold text-[#171b4b]">Banner library</h2>
          {isFetching && <span className="inline-flex items-center gap-2 text-xs text-slate-500"><LoaderCircle className="h-3.5 w-3.5 animate-spin" />Updating</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-pink-50/50 text-[11px] uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Banner</th><th className="px-4 py-3">Placement</th><th className="px-4 py-3">Position / order</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Updated</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-500"><LoaderCircle className="mx-auto mb-2 h-5 w-5 animate-spin" />Loading banners…</td></tr> : filtered.length === 0 ? <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-500">No banners match these filters.</td></tr> : filtered.map((banner) => (
                <tr key={banner.id} className="hover:bg-pink-50/30">
                  <td className="px-5 py-3"><div className="flex items-center gap-3"><img src={imageUrl(banner.image)} alt={banner.title || TYPE_LABELS[banner.type]} className="h-14 w-24 rounded-lg border border-slate-100 bg-slate-50 object-cover" /><div className="min-w-0"><p className="max-w-[260px] truncate font-semibold text-slate-800">{banner.title || "Untitled banner"}</p><p className="max-w-[260px] truncate text-xs text-slate-500">{banner.subtitle || banner.targetUrl || banner.id}</p></div></div></td>
                  <td className="px-4 py-3 text-slate-700">{TYPE_LABELS[banner.type]}</td>
                  <td className="px-4 py-3 text-slate-600">{banner.position ? `#${banner.position}` : "—"}{banner.sortOrder ? ` · order ${banner.sortOrder}` : ""}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${banner.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{banner.status}</span></td>
                  <td className="px-4 py-3 text-xs text-slate-500">{new Date(banner.updatedAt).toLocaleString()}</td>
                  <td className="px-5 py-3"><div className="flex justify-end gap-2"><button onClick={() => setSelected(banner)} className="rounded-lg border border-pink-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-pink-50">View</button><button onClick={() => openEdit(banner)} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"><Pencil className="h-3 w-3" /> Edit</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500"><span>Page {data?.meta.page ?? page} of {Math.max(data?.meta.totalPages ?? 1, 1)}</span><div className="flex gap-2"><button disabled={page <= 1 || isFetching} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40">Previous</button><button disabled={page >= (data?.meta.totalPages ?? 1) || isFetching} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40">Next</button></div></div>
      </section>

      {(creating || editing) && <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
        <form onSubmit={(event) => void save(event)} className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-pink-100 bg-white shadow-2xl" aria-label={editing ? "Edit banner" : "Create banner"}>
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-pink-100 bg-white px-5 py-4"><div><h2 className="text-lg font-bold text-[#171b4b]">{editing ? "Edit banner" : "Add banner"}</h2><p className="text-xs text-slate-500">{editing ? `ID: ${editing.id}` : "Choose its homepage placement and upload artwork."}</p></div><button type="button" onClick={closeDialog} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close"><X className="h-4 w-4" /></button></div>
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Placement"><select disabled={Boolean(editing)} value={form.type} onChange={(event) => setField("type", event.target.value as BannerType)} className="banner-input"><option value="PRIMARY">Primary carousel</option><option value="SECONDARY">Secondary</option><option value="MIDDLE">Middle</option><option value="LAST_MIDDLE">Last middle</option><option value="FOOTER">Footer</option></select></Field>
            <Field label="Status"><select value={form.status} onChange={(event) => setField("status", event.target.value as BannerStatus)} className="banner-input"><option value="ACTIVE">Active</option><option value="DRAFT">Draft</option></select></Field>
            <Field label="Title"><input value={form.title} onChange={(event) => setField("title", event.target.value)} maxLength={150} className="banner-input" /></Field>
            <Field label="Subtitle"><input value={form.subtitle} onChange={(event) => setField("subtitle", event.target.value)} maxLength={300} className="banner-input" /></Field>
            <Field label="Target URL"><input value={form.targetUrl} onChange={(event) => setField("targetUrl", event.target.value)} maxLength={1000} placeholder="/collections/sale" className="banner-input" /></Field>
            {(form.type === "PRIMARY" || form.type === "SECONDARY" || form.type === "FOOTER" || form.type === "LAST_MIDDLE") && <Field label="Position"><select value={form.position} onChange={(event) => setField("position", Number(event.target.value))} className="banner-input">{(form.type === "FOOTER" || form.type === "LAST_MIDDLE" ? [1, 2] : [1, 2, 3, 4]).map((position) => <option key={position} value={position}>{position}</option>)}</select></Field>}
            {(form.type === "PRIMARY" || form.type === "SECONDARY") && <Field label="Display order"><input type="number" min={1} value={form.sortOrder} onChange={(event) => setField("sortOrder", Number(event.target.value))} className="banner-input" /></Field>}
            {form.type === "PRIMARY" && <><Field label="Starts at"><input type="datetime-local" value={form.startsAt} onChange={(event) => setField("startsAt", event.target.value)} className="banner-input" /></Field><Field label="Ends at"><input type="datetime-local" value={form.endsAt} onChange={(event) => setField("endsAt", event.target.value)} className="banner-input" /></Field></>}
            <Field label={editing ? "Replace image (optional)" : "Banner image"}><label className="flex cursor-pointer items-center gap-2 rounded-xl border border-pink-100 bg-pink-50/30 px-3 py-2.5 text-sm text-slate-600"><ImagePlus className="h-4 w-4 text-primary" /><span className="truncate">Choose image</span><input id="banner-image" name="banner-image" type="file" accept="image/jpeg,image/png,image/webp" required={!editing} className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) setField("image", file); }} />{form.image instanceof File && <span className="truncate text-xs">{form.image.name}</span>}</label>{editing && <img src={imageUrl(editing.image)} alt="Current banner" className="mt-2 h-20 w-36 rounded-lg object-cover" />}</Field>
          </div>
          {formError && <p role="alert" className="mx-5 mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</p>}
          <div className="flex justify-end gap-2 border-t border-pink-100 px-5 py-4"><button type="button" onClick={closeDialog} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Cancel</button><button type="submit" disabled={createState.isLoading || updateState.isLoading} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-60">{(createState.isLoading || updateState.isLoading) && <LoaderCircle className="h-4 w-4 animate-spin" />}{editing ? "Save changes" : "Create banner"}</button></div>
        </form>
      </div>}

      {selected && <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}><section role="dialog" aria-modal="true" className="w-full max-w-2xl overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-2xl"><div className="flex items-center justify-between px-5 py-4"><div><h2 className="font-bold text-[#171b4b]">Banner details</h2><p className="text-xs text-slate-500">{selected.id}</p></div><button onClick={closeDialog} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close"><X className="h-4 w-4" /></button></div><img src={imageUrl(selected.image)} alt={selected.title || "Homepage banner"} className="max-h-[55vh] w-full bg-slate-50 object-contain" /><div className="grid gap-3 p-5 text-sm sm:grid-cols-2"><Detail label="Title" value={selected.title || "Untitled"} /><Detail label="Placement" value={TYPE_LABELS[selected.type]} /><Detail label="Status" value={selected.status} /><Detail label="Position / order" value={`${selected.position ?? "—"} / ${selected.sortOrder ?? "—"}`} /><Detail label="Target URL" value={selected.targetUrl || "—"} /><Detail label="Schedule" value={selected.startsAt ? `${new Date(selected.startsAt).toLocaleString()} – ${selected.endsAt ? new Date(selected.endsAt).toLocaleString() : "No end"}` : "Not scheduled"} /></div><div className="flex justify-end border-t border-pink-100 px-5 py-4"><button onClick={() => openEdit(selected)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white"><Pencil className="h-4 w-4" /> Edit banner</button></div></section></div>}
    </div>
  );
};

function Stat({ label, value, tone = "pink" }: { label: string; value?: number; tone?: "pink" | "green" | "amber" }) {
  const toneClass = tone === "green" ? "text-emerald-600" : tone === "amber" ? "text-amber-600" : "text-primary";
  return <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p className={`mt-2 text-2xl font-extrabold ${toneClass}`}>{value ?? "—"}</p></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-slate-600">{label}<div className="mt-1.5">{children}</div></label>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-xl border border-pink-100 bg-pink-50/30 p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 break-words text-slate-800">{value}</p></div>;
}

export default BannersPage;
