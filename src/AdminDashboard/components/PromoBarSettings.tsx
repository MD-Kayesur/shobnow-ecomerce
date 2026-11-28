import { useEffect, useState } from "react";
import { Megaphone, Save, Trash2, Power } from "lucide-react";
import { toast } from "sonner";
import {
  useGetAdminPromoBarQuery,
  useDeleteAdminPromoBarMutation,
  useSaveAdminPromoBarMutation,
  type PromoBarInput,
} from "@/redux/features/admin/promoBarApi";

const defaultValues: PromoBarInput = {
  headline: "",
  offerText: "",
  deliveryText: "",
  isActive: false,
  startsAt: null,
  endsAt: null,
};

function toDateTimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function errorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }
  return "Could not save the promotional bar. Check the admin session and backend connection.";
}

const PromoBarSettings = () => {
  const { data, isLoading, isError, refetch } = useGetAdminPromoBarQuery();
  const [savePromoBar, { isLoading: isSaving }] = useSaveAdminPromoBarMutation();
  const [deletePromoBar, { isLoading: isDeleting }] = useDeleteAdminPromoBarMutation();
  const [form, setForm] = useState(defaultValues);
  const savedPromoBar = data?.data;

  useEffect(() => {
    const saved = data?.data;
    if (saved) {
      setForm({
        headline: saved.headline,
        offerText: saved.offerText ?? "",
        deliveryText: saved.deliveryText ?? "",
        isActive: saved.isActive,
        startsAt: saved.startsAt,
        endsAt: saved.endsAt,
      });
    } else if (!isLoading) {
      setForm(defaultValues);
    }
  }, [data, isLoading]);

  const update = (key: keyof PromoBarInput, value: string | boolean | null) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await savePromoBar({
        ...form,
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
        endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
      }).unwrap();
      toast.success("Promotional bar saved", { description: "The storefront will show it according to its status and schedule." });
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const handleToggle = async () => {
    if (!savedPromoBar) return;
    try {
      await savePromoBar({
        ...form,
        isActive: !savedPromoBar.isActive,
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
        endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
      }).unwrap();
      toast.success(savedPromoBar.isActive ? "Promotional bar turned off" : "Promotional bar turned on");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const handleDelete = async () => {
    if (!savedPromoBar || !window.confirm("Delete the promotional bar? It will disappear from the storefront.")) return;
    try {
      await deletePromoBar().unwrap();
      toast.success("Promotional bar deleted");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <section className="space-y-4 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
        <span className="rounded-xl bg-pink-50 p-2.5 text-pink-600"><Megaphone size={20} /></span>
        <div>
          <h2 className="text-base font-bold text-gray-900">Storefront promotional bar</h2>
          <p className="mt-1 text-sm text-gray-500">Control the slim announcement strip at the top of the storefront.</p>
        </div>
      </div>

      {isError && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <span>Could not load the saved promotional bar.</span>
          <button type="button" onClick={() => void refetch()} className="font-semibold underline">Retry</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-1.5 text-xs font-semibold text-gray-700">
            Headline
            <input required maxLength={100} value={form.headline} onChange={(event) => update("headline", event.target.value)} placeholder="e.g. Beauty Fest is Live" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-normal text-gray-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100" />
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-gray-700">
            Offer text
            <input maxLength={150} value={form.offerText ?? ""} onChange={(event) => update("offerText", event.target.value)} placeholder="Up to 40% OFF" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-normal text-gray-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100" />
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-gray-700">
            Delivery message
            <input maxLength={150} value={form.deliveryText ?? ""} onChange={(event) => update("deliveryText", event.target.value)} placeholder="Free Delivery over ৳1,000" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-normal text-gray-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5 text-xs font-semibold text-gray-700">
            Starts at (optional)
            <input type="datetime-local" value={toDateTimeLocal(form.startsAt)} onChange={(event) => update("startsAt", event.target.value || null)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-normal text-gray-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100" />
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-gray-700">
            Ends at (optional; controls countdown)
            <input type="datetime-local" value={toDateTimeLocal(form.endsAt)} onChange={(event) => update("endsAt", event.target.value || null)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-normal text-gray-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100" />
          </label>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-gray-700">
            <input type="checkbox" checked={form.isActive} onChange={(event) => update("isActive", event.target.checked)} className="h-4 w-4 accent-pink-600" />
            Show on storefront
          </label>
          <div className="flex flex-wrap gap-2">
            {savedPromoBar && <>
              <button type="button" onClick={() => void handleToggle()} disabled={isSaving || isDeleting} className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold disabled:opacity-60 ${savedPromoBar.isActive ? "border-amber-200 text-amber-700 hover:bg-amber-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}><Power size={16}/>{isSaving ? "Updating…" : savedPromoBar.isActive ? "Turn off" : "Turn on"}</button>
              <button type="button" onClick={() => void handleDelete()} disabled={isDeleting || isSaving} className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-60"><Trash2 size={16}/>{isDeleting ? "Deleting…" : "Delete"}</button>
            </>}
            <button type="submit" disabled={isSaving || isDeleting || isLoading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60">
              <Save size={16} />{isSaving ? "Saving…" : savedPromoBar ? "Update promotional bar" : "Create promotional bar"}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500">Leave dates empty to show it immediately with no countdown. If an end time is set, it controls the countdown and the bar hides when it expires. Deleting removes the saved configuration.</p>
      </form>
    </section>
  );
};

export default PromoBarSettings;
