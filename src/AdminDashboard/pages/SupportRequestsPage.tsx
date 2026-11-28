import { useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Clock3, LifeBuoy, LoaderCircle, Mail, Phone, Search } from "lucide-react";
import { toast } from "sonner";
import { useGetSupportRequestsQuery, useUpdateSupportRequestStatusMutation, type SupportRequestStatus } from "@/redux/features/admin/supportApi";

const statusLabel: Record<SupportRequestStatus, string> = { NEW: "New", IN_PROGRESS: "In progress", RESOLVED: "Resolved" };
const statusTone: Record<SupportRequestStatus, string> = {
  NEW: "bg-pink-100 text-pink-800",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  RESOLVED: "bg-emerald-100 text-emerald-800",
};
const dateLabel = (value: string) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export default function SupportRequestsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SupportRequestStatus | "">("");
  const [page, setPage] = useState(1);
  const query = useMemo(() => ({ page, limit: 20, search: search.trim() || undefined, status: status || undefined }), [page, search, status]);
  const { data, isLoading, isFetching, isError, refetch } = useGetSupportRequestsQuery(query);
  const [updateStatus, updateState] = useUpdateSupportRequestStatusMutation();
  const requests = data?.data.requests || [];
  const summary = data?.data.summary;
  const meta = data?.meta;

  const changeStatus = async (id: string, nextStatus: SupportRequestStatus) => {
    try {
      await updateStatus({ id, status: nextStatus }).unwrap();
      toast.success(`Request marked ${statusLabel[nextStatus].toLowerCase()}.`);
    } catch (error) {
      const message = (error as { data?: { message?: string | string[] } })?.data?.message;
      toast.error(Array.isArray(message) ? message.join(" ") : message || "Could not update this request.");
    }
  };

  return <section className="space-y-5 pb-8">
    <header>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Customer care</p>
      <h1 className="mt-1 flex items-center gap-2 text-2xl font-extrabold text-slate-900 sm:text-3xl"><LifeBuoy className="h-7 w-7 text-primary"/>Support inbox</h1>
      <p className="mt-1 text-sm text-slate-500">Review customer messages, follow up by email or phone, and update each request's status.</p>
    </header>

    <div className="grid gap-3 sm:grid-cols-3">
      {[
        { title: "New", count: summary?.new ?? "—", icon: LifeBuoy, tone: "bg-pink-50 text-primary" },
        { title: "In progress", count: summary?.inProgress ?? "—", icon: Clock3, tone: "bg-amber-50 text-amber-700" },
        { title: "Resolved", count: summary?.resolved ?? "—", icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
      ].map((item) => { const Icon = item.icon; return <div key={item.title} className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm"><span className={`grid h-11 w-11 place-items-center rounded-xl ${item.tone}`}><Icon size={21}/></span><div><p className="text-xs text-slate-500">{item.title}</p><p className="text-xl font-extrabold text-slate-900">{item.count}</p></div></div>; })}
    </div>

    <div className="flex flex-col gap-3 rounded-2xl border border-pink-100 bg-white p-3 shadow-sm sm:flex-row">
      <label className="flex min-h-11 flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3 text-slate-400"><Search size={17}/><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search name, email, order or message" className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"/></label>
      <select value={status} onChange={(event) => { setStatus(event.target.value as SupportRequestStatus | ""); setPage(1); }} className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700"><option value="">All requests</option><option value="NEW">New</option><option value="IN_PROGRESS">In progress</option><option value="RESOLVED">Resolved</option></select>
      {isFetching && !isLoading && <span className="flex items-center gap-2 px-2 text-xs text-slate-400"><LoaderCircle size={15} className="animate-spin"/>Refreshing</span>}
    </div>

    {isError ? <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"><p>Could not load support requests.</p><button onClick={() => void refetch()} className="mt-3 rounded-lg border border-red-200 bg-white px-3 py-2 font-semibold">Retry</button></div>
      : isLoading ? <div className="flex items-center justify-center gap-2 rounded-2xl border border-pink-100 bg-white p-12 text-sm text-slate-500"><LoaderCircle className="h-5 w-5 animate-spin text-primary"/>Loading support inbox…</div>
        : requests.length === 0 ? <div className="rounded-2xl border border-pink-100 bg-white p-10 text-center"><LifeBuoy className="mx-auto h-9 w-9 text-pink-300"/><h2 className="mt-3 font-bold text-slate-800">No support requests found</h2><p className="mt-1 text-sm text-slate-500">New Contact Us form submissions will appear here.</p></div>
          : <div className="space-y-3">{requests.map((request) => <article key={request.id} className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-slate-900">{request.subject}</h2><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusTone[request.status]}`}>{statusLabel[request.status]}</span>{request.orderId && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">Order {request.orderId}</span>}</div><p className="mt-1 text-xs text-slate-500">{request.name} · {dateLabel(request.createdAt)}</p></div>
              <select aria-label={`Update status for ${request.name}`} value={request.status} disabled={updateState.isLoading} onChange={(event) => void changeStatus(request.id, event.target.value as SupportRequestStatus)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 disabled:opacity-50"><option value="NEW">New</option><option value="IN_PROGRESS">In progress</option><option value="RESOLVED">Resolved</option></select>
            </div>
            <p className="my-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{request.message}</p>
            <div className="flex flex-wrap gap-2"><a href={`mailto:${request.email}?subject=${encodeURIComponent(`Re: ${request.subject}${request.orderId ? ` — Order ${request.orderId}` : ""}`)}`} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white"><Mail size={14}/>Email {request.email}</a>{request.phone && <a href={`tel:${request.phone}`} className="inline-flex items-center gap-2 rounded-lg border border-pink-200 px-3 py-2 text-xs font-bold text-primary"><Phone size={14}/>Call {request.phone}</a>}</div>
          </article>)}</div>}

    {meta && meta.totalPages > 1 && <footer className="flex items-center justify-between rounded-xl border border-pink-100 bg-white px-4 py-3 text-sm"><span className="text-slate-500">Page {meta.page} / {meta.totalPages} · {meta.total} requests</span><div className="flex gap-2"><button disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-lg border px-3 py-2 disabled:opacity-40"><ChevronLeft size={16}/></button><button disabled={page >= meta.totalPages} onClick={() => setPage((current) => Math.min(meta.totalPages, current + 1))} className="rounded-lg border px-3 py-2 disabled:opacity-40"><ChevronRight size={16}/></button></div></footer>}
  </section>;
}
