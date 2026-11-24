import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Activity, AlertTriangle, ChevronLeft, ChevronRight, Clock3, Eye,
  LayoutGrid, List, LoaderCircle, Search, ShieldAlert,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  ActivityLog, ActivityLogQuery, ErrorLog, ErrorLogQuery,
  useGetActivityLogQuery, useGetActivityLogsQuery,
  useGetErrorLogQuery, useGetErrorLogsQuery,
} from "@/redux/features/admin/auditLogsApi";

type LogKind = "activity" | "error";
type LogRecord = ActivityLog | ErrorLog;

const dateLabel = (value?: string | null) => value
  ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
  : "—";

const isErrorLog = (log: LogRecord): log is ErrorLog => "errorCode" in log;

function AuditLogsPage({ kind }: { kind: LogKind }) {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState(searchParams.get("userId") ?? "");
  const [visitorId, setVisitorId] = useState("");
  const [categoryOrLevel, setCategoryOrLevel] = useState("");
  const [statusCode, setStatusCode] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"table" | "cards">("table");
  const [selected, setSelected] = useState<LogRecord | null>(null);

  const applied = useMemo(() => ({
    search: search.trim() || undefined,
    ...(categoryOrLevel ? kind === "activity"
      ? { category: categoryOrLevel } : { level: categoryOrLevel as "WARN" | "ERROR" } : {}),
    ...(statusCode && /^\d{3}$/.test(statusCode) ? { statusCode: Number(statusCode) } : {}),
  }), [categoryOrLevel, kind, search, statusCode]);

  const activityQuery = useGetActivityLogsQuery(
    { page, limit: 10, ...applied, userId: userId.trim() || undefined, visitorId: visitorId.trim() || undefined } as ActivityLogQuery,
    { skip: kind !== "activity" },
  );
  const errorQuery = useGetErrorLogsQuery(
    { page, limit: 10, ...applied, userId: userId.trim() || undefined, visitorId: visitorId.trim() || undefined } as ErrorLogQuery,
    { skip: kind !== "error" },
  );
  const activityDetail = useGetActivityLogQuery(selected && !isErrorLog(selected) ? selected.id : "", {
    skip: !selected || isErrorLog(selected),
  });
  const errorDetail = useGetErrorLogQuery(selected && isErrorLog(selected) ? selected.requestId : "", {
    skip: !selected || !isErrorLog(selected),
  });

  const query = kind === "activity" ? activityQuery : errorQuery;
  const rows = (query.data?.data ?? []) as LogRecord[];
  const meta = query.data?.meta;
  const title = kind === "activity" ? "Activity Logs" : "Error Logs";
  const detailResult = kind === "activity" ? activityDetail.data?.data : errorDetail.data?.data;
  const detailLoading = kind === "activity" ? activityDetail.isFetching : errorDetail.isFetching;
  const detail = detailResult ?? selected;

  const applyFilters = () => setPage(1);
  const clearFilters = () => {
    setSearch(""); setUserId(""); setVisitorId(""); setCategoryOrLevel(""); setStatusCode(""); setPage(1);
  };

  return (
    <section className="space-y-5 pb-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Admin monitoring</p>
          <h1 className="mt-1 flex items-center gap-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            {kind === "activity" ? <Activity className="h-7 w-7 text-primary" /> : <ShieldAlert className="h-7 w-7 text-primary" />}
            {title}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {kind === "activity"
              ? "Review user and visitor actions, request details, IP, and device context."
              : "Inspect application failures, request IDs, affected users, and diagnostic details."}
          </p>
        </div>
        <div className="rounded-xl border border-pink-100 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
          {query.isFetching ? "Loading records…" : `${meta?.total ?? 0} records`}
        </div>
      </header>

      <div className="grid gap-3 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-[minmax(220px,1.5fr)_minmax(150px,1fr)_minmax(150px,1fr)_170px_130px_auto]">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && applyFilters()}
            placeholder={kind === "activity" ? "Search action, path, user…" : "Search error, request ID, path…"}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary" />
        </label>
        <input value={userId} onChange={(event) => setUserId(event.target.value)} onKeyDown={(event) => event.key === "Enter" && applyFilters()}
          placeholder="Filter by user ID"
          className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary" />
        <input value={visitorId} onChange={(event) => setVisitorId(event.target.value)} onKeyDown={(event) => event.key === "Enter" && applyFilters()}
          placeholder="Filter by visitor ID"
          className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary" />
        {kind === "activity" ? (
          <select value={categoryOrLevel} onChange={(event) => setCategoryOrLevel(event.target.value)} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm">
            <option value="">All categories</option><option value="AUTH">Authentication</option><option value="ADMIN">Admin actions</option><option value="API">API requests</option><option value="PAGE_VIEW">Page views</option>
          </select>
        ) : (
          <select value={categoryOrLevel} onChange={(event) => setCategoryOrLevel(event.target.value)} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm">
            <option value="">All levels</option><option value="ERROR">Error</option><option value="WARN">Warning</option>
          </select>
        )}
        <input value={statusCode} onChange={(event) => setStatusCode(event.target.value)} onKeyDown={(event) => event.key === "Enter" && applyFilters()}
          inputMode="numeric" placeholder="HTTP status" className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-primary" />
        <div className="flex gap-2">
          <button onClick={applyFilters} className="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">Apply</button>
          <button onClick={clearFilters} className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">Clear</button>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-pink-100 bg-white px-4 py-3 shadow-sm">
        <p className="text-sm text-gray-500">Newest records first · filters are applied on the server</p>
        <div className="flex rounded-lg border border-gray-200 p-1">
          <button onClick={() => setView("table")} aria-label="Table view" className={`rounded-md p-2 ${view === "table" ? "bg-primary text-white" : "text-gray-500"}`}><List size={16} /></button>
          <button onClick={() => setView("cards")} aria-label="Card view" className={`rounded-md p-2 ${view === "cards" ? "bg-primary text-white" : "text-gray-500"}`}><LayoutGrid size={16} /></button>
        </div>
      </div>

      {query.isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">Could not load {title.toLowerCase()}. Check the API connection and make sure you are signed in as an admin.</div>
      ) : query.isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-pink-100 bg-white p-12 text-sm text-gray-500"><LoaderCircle className="h-5 w-5 animate-spin text-primary" />Loading {title.toLowerCase()}…</div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-pink-100 bg-white p-12 text-center"><div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-pink-50 text-primary">{kind === "activity" ? <Activity /> : <AlertTriangle />}</div><p className="font-semibold text-gray-800">No {title.toLowerCase()} found</p><p className="mt-1 text-sm text-gray-500">Try clearing a filter, or new records will appear here as activity is recorded.</p></div>
      ) : view === "table" ? (
        <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
          <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-pink-50/70 text-[11px] uppercase tracking-wide text-gray-500"><tr>
              <th className="px-4 py-3">Time</th><th className="px-4 py-3">{kind === "activity" ? "Action" : "Error"}</th><th className="px-4 py-3">User / Visitor</th><th className="px-4 py-3">Request</th><th className="px-4 py-3">IP</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">View</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">{rows.map((row) => {
              const error = isErrorLog(row);
              return <tr key={row.id} className="hover:bg-pink-50/30">
                <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-600">{dateLabel(row.createdAt)}</td>
                <td className="max-w-[300px] px-4 py-3"><p className="truncate font-semibold text-gray-800">{error ? `${row.errorCode} · ${row.errorType}` : `${row.category} · ${row.action}`}</p><p className="mt-1 truncate text-xs text-gray-500">{error ? row.message : `${row.method ?? ""} ${row.path}`}</p></td>
                <td className="px-4 py-3 text-xs"><p className="font-medium text-gray-700">{(!error ? row.user?.email : null) ?? row.userId ?? "Anonymous"}</p><p className="mt-1 text-gray-400">Visitor: {row.visitorId ?? "—"}</p></td>
                <td className="max-w-[180px] truncate px-4 py-3 font-mono text-[11px] text-gray-500">{error ? row.requestId : row.requestId ?? row.resourceId ?? row.id}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{row.ipAddress ?? "—"}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${(row.statusCode ?? 200) >= 400 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"}`}>{error ? `${row.level} · ${row.statusCode}` : row.statusCode ?? "—"}</span></td>
                <td className="px-4 py-3"><button onClick={() => setSelected(row)} className="inline-flex items-center gap-1 rounded-lg border border-pink-100 px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-pink-50"><Eye size={14} />View</button></td>
              </tr>;
            })}</tbody>
          </table></div>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{rows.map((row) => {
          const error = isErrorLog(row);
          return <article key={row.id} className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3"><div><p className="font-bold text-gray-800">{error ? row.errorCode : row.action}</p><p className="mt-1 text-xs text-gray-500">{error ? row.errorType : row.category}</p></div><span className="rounded-full bg-pink-50 px-2.5 py-1 text-xs text-primary">{error ? row.statusCode : row.statusCode ?? "—"}</span></div>
            <p className="mt-3 line-clamp-2 text-sm text-gray-600">{error ? row.message : row.description ?? row.path}</p>
            <div className="mt-4 space-y-1 text-xs text-gray-500"><p className="flex items-center gap-1"><Clock3 size={13} />{dateLabel(row.createdAt)}</p><p className="truncate">User: {(!error ? row.user?.email : null) ?? row.userId ?? "Anonymous"}</p><p className="truncate">Visitor: {row.visitorId ?? "—"}</p><p className="truncate">IP: {row.ipAddress ?? "—"}</p></div>
            <button onClick={() => setSelected(row)} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary"><Eye size={15} />View details</button>
          </article>;
        })}</div>
      )}

      {meta && meta.totalPages > 1 && <footer className="flex items-center justify-between rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm shadow-sm"><span className="text-gray-500">Page {meta.page} of {meta.totalPages} · {meta.total} records</span><div className="flex gap-2"><button disabled={!meta.hasPreviousPage} onClick={() => setPage((current) => Math.max(1, current - 1))} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 disabled:opacity-40"><ChevronLeft size={16} />Previous</button><button disabled={!meta.hasNextPage} onClick={() => setPage((current) => current + 1)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 disabled:opacity-40">Next<ChevronRight size={16} /></button></div></footer>}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border-pink-100 bg-white sm:max-w-2xl">
          <DialogHeader><DialogTitle className="text-gray-900">{kind === "activity" ? "Activity details" : "Error details"}</DialogTitle><DialogDescription>Full record from the backend audit log.</DialogDescription></DialogHeader>
          {detailLoading ? <div className="flex items-center gap-2 py-8 text-sm text-gray-500"><LoaderCircle className="h-4 w-4 animate-spin" />Loading full details…</div> : detail && <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-5 text-emerald-200">{JSON.stringify(detail, null, 2)}</pre>}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export const ActivityLogsPage = () => <AuditLogsPage kind="activity" />;
export const ErrorLogsPage = () => <AuditLogsPage kind="error" />;
