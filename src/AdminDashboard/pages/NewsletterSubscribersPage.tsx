import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, LoaderCircle, Mail, Search, Users } from "lucide-react";
import { useGetNewsletterSubscribersQuery, type NewsletterStatus } from "@/redux/features/admin/newsletterApi";

const dateLabel = (value?: string | null) => value
  ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
  : "—";

export default function NewsletterSubscribersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<NewsletterStatus | "">("");
  const [page, setPage] = useState(1);
  const query = useMemo(() => ({ page, limit: 20, search: search.trim() || undefined, status: status || undefined }), [page, search, status]);
  const { data, isLoading, isFetching, isError, refetch } = useGetNewsletterSubscribersQuery(query);
  const rows = data?.data.subscribers ?? [];
  const summary = data?.data.summary;
  const meta = data?.meta;

  return (
    <section className="space-y-5 pb-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Store audience</p>
        <h1 className="mt-1 flex items-center gap-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
          <Mail className="h-7 w-7 text-primary" /> Newsletter subscribers
        </h1>
        <p className="mt-1 text-sm text-gray-500">View storefront signup emails and the pseudonymous visitor ID recorded at signup.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total subscribers", value: summary?.total ?? "—", icon: Users, tone: "text-primary bg-pink-50" },
          { label: "Subscribed", value: summary?.subscribed ?? "—", icon: Mail, tone: "text-emerald-600 bg-emerald-50" },
          { label: "Unsubscribed", value: summary?.unsubscribed ?? "—", icon: Mail, tone: "text-slate-600 bg-slate-100" },
        ].map((item) => {
          const Icon = item.icon;
          return <article key={item.label} className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
              {item.label}<span className={`grid h-9 w-9 place-items-center rounded-xl ${item.tone}`}><Icon className="h-4 w-4" /></span>
            </div>
            <p className="mt-2 text-3xl font-extrabold text-slate-900">{item.value}</p>
          </article>;
        })}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm sm:flex-row">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search subscriber email..." className="w-full rounded-xl border border-pink-100 bg-[#fffafd] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary" />
        </label>
        <select value={status} onChange={(event) => { setStatus(event.target.value as NewsletterStatus | ""); setPage(1); }} className="rounded-xl border border-pink-100 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-primary">
          <option value="">All statuses</option>
          <option value="SUBSCRIBED">Subscribed</option>
          <option value="UNSUBSCRIBED">Unsubscribed</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
        {(isFetching && !isLoading) && <div className="h-1 animate-pulse bg-primary" />}
        {isError ? <div className="p-8 text-center">
          <p className="font-semibold text-rose-700">Could not load newsletter subscribers.</p>
          <p className="mt-1 text-sm text-slate-500">Check the admin session and backend connection, then retry.</p>
          <button onClick={() => void refetch()} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Retry</button>
        </div> : isLoading ? <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500"><LoaderCircle className="h-5 w-5 animate-spin" /> Loading subscribers…</div> : rows.length === 0 ? <div className="p-12 text-center text-sm text-slate-500">No newsletter subscribers match these filters.</div> : <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-pink-50/70 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-5 py-3">Email</th><th className="px-5 py-3">Visitor ID</th><th className="px-5 py-3">Signup source</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Subscribed at</th><th className="px-5 py-3">Updated</th></tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {rows.map((subscriber) => <tr key={subscriber.id} className="hover:bg-pink-50/30">
                  <td className="px-5 py-4 font-semibold text-slate-800">{subscriber.email}</td>
                  <td className="max-w-[220px] truncate px-5 py-4 font-mono text-xs text-slate-500" title={subscriber.visitorId ?? "Not provided"}>{subscriber.visitorId ?? "Not recorded"}</td>
                  <td className="px-5 py-4 text-slate-600">{subscriber.source || "—"}</td>
                  <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${subscriber.status === "SUBSCRIBED" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{subscriber.status === "SUBSCRIBED" ? "Subscribed" : "Unsubscribed"}</span></td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">{dateLabel(subscriber.subscribedAt)}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">{dateLabel(subscriber.updatedAt)}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
          <footer className="flex flex-col gap-3 border-t border-pink-50 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>Showing {rows.length} of {meta?.total ?? rows.length} subscribers</span>
            <div className="flex items-center gap-3">
              <button disabled={!meta?.hasPreviousPage || isFetching} onClick={() => setPage((current) => Math.max(1, current - 1))} className="inline-flex items-center gap-1 rounded-lg border border-pink-100 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> Previous</button>
              <span>Page {meta?.page ?? page} of {meta?.totalPages ?? 1}</span>
              <button disabled={!meta?.hasNextPage || isFetching} onClick={() => setPage((current) => current + 1)} className="inline-flex items-center gap-1 rounded-lg border border-pink-100 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40">Next <ChevronRight className="h-4 w-4" /></button>
            </div>
          </footer>
        </>}
      </div>
      <p className="text-xs text-slate-400">Visitor ID is a browser-generated identifier used to correlate anonymous activity; it does not prove a visitor’s real-world identity.</p>
    </section>
  );
}
