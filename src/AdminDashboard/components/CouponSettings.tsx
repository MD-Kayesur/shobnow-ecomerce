import { useCallback, useState } from "react";
import { BadgePercent, Eye, Pencil, Plus, RefreshCw, Tag, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateAdminCouponMutation,
  useDeleteAdminCouponMutation,
  useGenerateAdminCouponCodeMutation,
  useGetAdminCouponsQuery,
  useUpdateAdminCouponMutation,
  useUpdateAdminCouponStatusMutation,
  type AdminCoupon,
} from "@/redux/features/admin/couponsApi";

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100";
const localDateTime = (value?: string | null) => value ? new Date(new Date(value).getTime() - new Date(value).getTimezoneOffset() * 60_000).toISOString().slice(0, 16) : "";

function messageFrom(error: unknown) {
  if (typeof error === "object" && error !== null && "data" in error) {
    const message = (error as { data?: { message?: string | string[] } }).data?.message;
    if (Array.isArray(message)) return message.join(" ");
    if (message) return message;
  }
  return "Could not complete the coupon request. Check the admin session and try again.";
}

const CouponSettings = () => {
  const { data, isLoading, isError, refetch } = useGetAdminCouponsQuery();
  const [createCoupon, { isLoading: isCreating }] = useCreateAdminCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateAdminCouponMutation();
  const [deleteCoupon] = useDeleteAdminCouponMutation();
  const [generateCouponCode, { isLoading: isGeneratingCode }] = useGenerateAdminCouponCodeMutation();
  const [updateStatus] = useUpdateAdminCouponStatusMutation();
  const [editingCoupon, setEditingCoupon] = useState<AdminCoupon | null>(null);
  const [viewingCoupon, setViewingCoupon] = useState<AdminCoupon | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENT" | "FIXED">("PERCENT");
  const [discountValue, setDiscountValue] = useState("");
  const [minimumOrder, setMinimumOrder] = useState("0");
  const [maximumDiscount, setMaximumDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [perUserLimit, setPerUserLimit] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const coupons = data?.data ?? [];

  const resetForm = () => {
    setEditingCoupon(null); setCode(""); setName(""); setDescription(""); setDiscountType("PERCENT");
    setDiscountValue(""); setMinimumOrder("0"); setMaximumDiscount(""); setUsageLimit("");
    setPerUserLimit(""); setStartsAt(""); setEndsAt("");
  };

  const generateNextCode = useCallback(async () => {
    try {
      const result = await generateCouponCode().unwrap();
      setCode(result.data.code);
    } catch (error) { toast.error(messageFrom(error)); }
  }, [generateCouponCode]);

  const handleOpenCreate = () => {
    resetForm();
    setIsEditorOpen(true);
    void generateNextCode();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim() || undefined,
      discountType,
      discountValue: Number(discountValue),
      minimumOrder: Number(minimumOrder || 0),
      maximumDiscount: maximumDiscount ? Number(maximumDiscount) : undefined,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      perUserLimit: perUserLimit ? Number(perUserLimit) : undefined,
      startsAt: startsAt ? new Date(startsAt).toISOString() : undefined,
      endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
    };
    try {
      if (editingCoupon) await updateCoupon({ id: editingCoupon.id, coupon: input }).unwrap();
      else await createCoupon(input).unwrap();
      toast.success(editingCoupon ? "Coupon updated" : "Coupon created", { description: `${input.code} is ready to use.` });
      resetForm(); setIsEditorOpen(false);
    } catch (error) { toast.error(messageFrom(error)); }
  };

  const handleEdit = (coupon: AdminCoupon) => {
    setEditingCoupon(coupon); setCode(coupon.code); setName(coupon.name); setDescription(coupon.description || "");
    setDiscountType(coupon.discountType); setDiscountValue(String(coupon.discountValue));
    setMinimumOrder(String(coupon.minimumOrder)); setMaximumDiscount(coupon.maximumDiscount ? String(coupon.maximumDiscount) : "");
    setUsageLimit(coupon.usageLimit ? String(coupon.usageLimit) : ""); setPerUserLimit(coupon.perUserLimit ? String(coupon.perUserLimit) : "");
    setStartsAt(localDateTime(coupon.startsAt)); setEndsAt(localDateTime(coupon.endsAt)); setIsEditorOpen(true);
  };

  const handleDelete = async (coupon: AdminCoupon) => {
    if (!window.confirm(`Delete coupon ${coupon.code}? It will no longer appear in this list or be usable.`)) return;
    try {
      await deleteCoupon(coupon.id).unwrap();
      if (editingCoupon?.id === coupon.id) { resetForm(); setIsEditorOpen(false); }
      if (viewingCoupon?.id === coupon.id) setViewingCoupon(null);
      toast.success(`Coupon ${coupon.code} deleted.`);
    } catch (error) { toast.error(messageFrom(error)); }
  };

  const handleStatus = async (coupon: AdminCoupon) => {
    try { await updateStatus({ id: coupon.id, isActive: !coupon.isActive }).unwrap(); }
    catch (error) { toast.error(messageFrom(error)); }
  };

  const statusFor = (coupon: AdminCoupon) => {
    const now = Date.now();
    if (!coupon.isActive) return "Inactive";
    if (coupon.usageLimit !== null && coupon.usageLimit !== undefined && coupon.usageCount >= coupon.usageLimit) return "Limit reached";
    if (coupon.startsAt && new Date(coupon.startsAt).getTime() > now) return "Scheduled";
    if (coupon.endsAt && new Date(coupon.endsAt).getTime() <= now) return "Expired";
    return "Active";
  };

  const closeEditor = () => { resetForm(); setIsEditorOpen(false); };

  return (
    <>
      <section className="space-y-5 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-pink-50 p-2.5 text-pink-600"><BadgePercent size={20}/></span>
            <div><h2 className="text-base font-bold text-gray-900">Coupon management</h2><p className="mt-1 text-sm text-gray-500">Create and manage discount codes, limits, and schedules.</p></div>
          </div>
          <button type="button" onClick={handleOpenCreate} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#ed2b83] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d81b70]"><Plus size={16}/>Generate Coupon</button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3"><h3 className="flex items-center gap-2 text-sm font-bold text-gray-800"><Tag size={16} className="text-pink-600"/>All coupons <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-semibold text-pink-700">{coupons.length}</span></h3><button type="button" onClick={() => void refetch()} className="rounded-lg p-1.5 text-gray-500 hover:bg-white" aria-label="Refresh coupons"><RefreshCw size={15}/></button></div>
          {isLoading ? <p className="p-4 text-sm text-gray-500">Loading coupons…</p> : isError ? <div className="flex items-center justify-between p-4 text-sm text-rose-600"><span>Could not load coupons. Check your admin access.</span><button type="button" onClick={() => void refetch()} className="font-bold underline">Retry</button></div> : coupons.length === 0 ? <div className="p-8 text-center"><span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-pink-50 text-[#ed2b83]"><Tag size={18}/></span><p className="mt-3 text-sm font-semibold text-gray-800">No coupons created yet</p><p className="mt-1 text-xs text-gray-500">Use Generate Coupon to create your first discount code.</p></div> : (
            <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-sm"><thead className="bg-white text-[10px] uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3">Coupon</th><th className="px-4 py-3">Discount</th><th className="px-4 py-3">Minimum</th><th className="px-4 py-3">Usage</th><th className="px-4 py-3">Schedule</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{coupons.map((coupon) => {
              const status = statusFor(coupon);
              return <tr key={coupon.id}>
                <td className="px-4 py-3"><strong className="block text-gray-900">{coupon.code}</strong><span className="text-xs text-gray-500">{coupon.name}</span></td>
                <td className="px-4 py-3 font-semibold text-gray-800">{coupon.discountType === "PERCENT" ? `${coupon.discountValue}%` : `৳${Number(coupon.discountValue).toLocaleString()}`}{coupon.maximumDiscount ? <span className="block text-[11px] font-normal text-gray-500">max ৳{Number(coupon.maximumDiscount).toLocaleString()}</span> : null}</td>
                <td className="px-4 py-3">৳{Number(coupon.minimumOrder).toLocaleString()}</td>
                <td className="px-4 py-3">{coupon.usageCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : " / ∞"}{coupon.perUserLimit ? <span className="block text-[11px] text-gray-500">{coupon.perUserLimit} per customer</span> : null}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{coupon.startsAt ? new Date(coupon.startsAt).toLocaleDateString() : "Now"} – {coupon.endsAt ? new Date(coupon.endsAt).toLocaleDateString() : "No end"}</td>
                <td className="px-4 py-3"><button type="button" onClick={() => void handleStatus(coupon)} title="Toggle active status" className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${status === "Active" ? "bg-emerald-50 text-emerald-700" : status === "Limit reached" || status === "Expired" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-600"}`}>{status}</button></td>
                <td className="px-4 py-3"><div className="flex justify-end gap-1"><button type="button" onClick={() => setViewingCoupon(coupon)} aria-label={`View ${coupon.code}`} title="View details" className="rounded-lg p-2 text-gray-500 hover:bg-pink-50 hover:text-[#ed2b83]"><Eye size={15}/></button><button type="button" onClick={() => handleEdit(coupon)} aria-label={`Edit ${coupon.code}`} title="Edit coupon" className="rounded-lg p-2 text-gray-500 hover:bg-pink-50 hover:text-[#ed2b83]"><Pencil size={15}/></button><button type="button" onClick={() => void handleDelete(coupon)} aria-label={`Delete ${coupon.code}`} title="Delete coupon" className="rounded-lg p-2 text-gray-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={15}/></button></div></td>
              </tr>;
            })}</tbody></table></div>
          )}
        </div>
      </section>

      {isEditorOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-3 backdrop-blur-[2px] sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) closeEditor(); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="coupon-dialog-title" className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-pink-100 bg-white p-5 shadow-2xl sm:p-7">
          <div className="mb-5 flex items-start justify-between gap-3 border-b border-gray-100 pb-4"><div><h2 id="coupon-dialog-title" className="text-lg font-bold text-gray-900">{editingCoupon ? "Update coupon" : "Generate a coupon"}</h2><p className="mt-1 text-sm text-gray-500">Set the discount, eligibility limits, and availability dates.</p></div><button type="button" onClick={closeEditor} aria-label="Close coupon form" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X size={18}/></button></div>
          <form onSubmit={(event) => void handleSubmit(event)} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-xs font-semibold text-gray-700">Coupon code *<span className="mt-1.5 flex gap-2"><input required minLength={2} maxLength={40} value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder={isGeneratingCode ? "Generating secure code…" : "Secure code will be generated"} className={`${inputClass} min-w-0 flex-1 uppercase`}/><button type="button" onClick={() => void generateNextCode()} disabled={isGeneratingCode || isCreating || isUpdating} className="shrink-0 rounded-xl border border-pink-200 bg-white px-3 text-xs font-semibold text-[#c90061] hover:bg-pink-50 disabled:opacity-50">{isGeneratingCode ? "Generating…" : "Regenerate"}</button></span></label>
            <label className="text-xs font-semibold text-gray-700">Coupon name *<input required minLength={2} maxLength={100} value={name} onChange={(event) => setName(event.target.value)} placeholder="Welcome offer" className={`${inputClass} mt-1.5`}/></label>
            <label className="text-xs font-semibold text-gray-700">Discount type<select value={discountType} onChange={(event) => setDiscountType(event.target.value as "PERCENT" | "FIXED")} className={`${inputClass} mt-1.5`}><option value="PERCENT">Percentage (%)</option><option value="FIXED">Fixed amount (৳)</option></select></label>
            <label className="text-xs font-semibold text-gray-700">Discount value *<input required type="number" min="0.01" max={discountType === "PERCENT" ? 100 : undefined} step="0.01" value={discountValue} onChange={(event) => setDiscountValue(event.target.value)} placeholder={discountType === "PERCENT" ? "10" : "200"} className={`${inputClass} mt-1.5`}/></label>
            <label className="text-xs font-semibold text-gray-700">Minimum order (৳)<input type="number" min="0" step="0.01" value={minimumOrder} onChange={(event) => setMinimumOrder(event.target.value)} className={`${inputClass} mt-1.5`}/></label>
            <label className="text-xs font-semibold text-gray-700">Maximum discount (৳, optional)<input type="number" min="0.01" step="0.01" value={maximumDiscount} onChange={(event) => setMaximumDiscount(event.target.value)} className={`${inputClass} mt-1.5`}/></label>
            <label className="text-xs font-semibold text-gray-700">Total use limit<input type="number" min="1" step="1" value={usageLimit} onChange={(event) => setUsageLimit(event.target.value)} placeholder="Unlimited" className={`${inputClass} mt-1.5`}/></label>
            <label className="text-xs font-semibold text-gray-700">Uses per customer<input type="number" min="1" step="1" value={perUserLimit} onChange={(event) => setPerUserLimit(event.target.value)} placeholder="Unlimited" className={`${inputClass} mt-1.5`}/></label>
            <label className="text-xs font-semibold text-gray-700">Starts at<input type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} className={`${inputClass} mt-1.5`}/></label>
            <label className="text-xs font-semibold text-gray-700">Ends at<input type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} className={`${inputClass} mt-1.5`}/></label>
            <label className="text-xs font-semibold text-gray-700 sm:col-span-2">Description (optional)<input maxLength={300} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Offer details for customers" className={`${inputClass} mt-1.5`}/></label>
            <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3"><button disabled={isCreating || isUpdating || isGeneratingCode || !code} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#ed2b83] px-5 text-sm font-bold text-white hover:bg-[#d81b70] disabled:opacity-50"><Plus size={16}/>{isCreating || isUpdating ? "Saving…" : editingCoupon ? "Save changes" : "Create coupon"}</button><button type="button" onClick={closeEditor} className="min-h-11 rounded-xl border border-gray-200 px-5 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button></div>
          </form>
        </section>
      </div>}

      {viewingCoupon && <div className="fixed inset-0 z-[101] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) setViewingCoupon(null); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="coupon-details-title" className="w-full max-w-lg rounded-2xl border border-pink-100 bg-white p-5 shadow-2xl sm:p-6">
          <div className="mb-4 flex items-start justify-between border-b border-gray-100 pb-4"><div><p className="text-[10px] font-bold uppercase tracking-wider text-[#ed2b83]">Coupon details</p><h2 id="coupon-details-title" className="mt-1 text-xl font-bold text-gray-900">{viewingCoupon.code}</h2><p className="text-sm text-gray-500">{viewingCoupon.name}</p></div><button type="button" onClick={() => setViewingCoupon(null)} aria-label="Close coupon details" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X size={18}/></button></div>
          <dl className="grid grid-cols-2 gap-x-5 gap-y-4 text-sm"><Detail label="Discount" value={viewingCoupon.discountType === "PERCENT" ? `${viewingCoupon.discountValue}%` : `৳${Number(viewingCoupon.discountValue).toLocaleString()}`}/><Detail label="Status" value={statusFor(viewingCoupon)}/><Detail label="Minimum order" value={`৳${Number(viewingCoupon.minimumOrder).toLocaleString()}`}/><Detail label="Maximum discount" value={viewingCoupon.maximumDiscount ? `৳${Number(viewingCoupon.maximumDiscount).toLocaleString()}` : "No limit"}/><Detail label="Total usage" value={`${viewingCoupon.usageCount} / ${viewingCoupon.usageLimit ?? "Unlimited"}`}/><Detail label="Per customer" value={viewingCoupon.perUserLimit?.toString() ?? "Unlimited"}/><Detail label="Starts" value={viewingCoupon.startsAt ? new Date(viewingCoupon.startsAt).toLocaleString() : "Immediately"}/><Detail label="Ends" value={viewingCoupon.endsAt ? new Date(viewingCoupon.endsAt).toLocaleString() : "No end date"}/><div className="col-span-2"><dt className="text-xs text-gray-500">Description</dt><dd className="mt-1 text-sm text-gray-800">{viewingCoupon.description || "No description provided."}</dd></div></dl>
          <button type="button" onClick={() => { setViewingCoupon(null); handleEdit(viewingCoupon); }} className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-[#ed2b83] px-4 text-sm font-semibold text-white hover:bg-[#d81b70]"><Pencil size={15}/>Edit coupon</button>
        </section>
      </div>}
    </>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => <div><dt className="text-xs text-gray-500">{label}</dt><dd className="mt-1 font-medium text-gray-900">{value}</dd></div>;

export default CouponSettings;
