import { useState } from "react";
import { BadgePercent, Plus, RefreshCw, Tag } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateAdminCouponMutation,
  useGetAdminCouponsQuery,
  useUpdateAdminCouponStatusMutation,
} from "@/redux/features/admin/couponsApi";

const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100";

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
  const [updateStatus] = useUpdateAdminCouponStatusMutation();
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

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createCoupon({
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
      }).unwrap();
      toast.success("Coupon created", { description: `${code.trim().toUpperCase()} is ready to use.` });
      setCode(""); setName(""); setDescription(""); setDiscountValue("");
      setMinimumOrder("0"); setMaximumDiscount(""); setUsageLimit(""); setPerUserLimit(""); setStartsAt(""); setEndsAt("");
    } catch (error) { toast.error(messageFrom(error)); }
  };

  const handleStatus = async (id: string, isActive: boolean) => {
    try { await updateStatus({ id, isActive }).unwrap(); }
    catch (error) { toast.error(messageFrom(error)); }
  };

  return (
    <section className="space-y-5 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
        <span className="rounded-xl bg-pink-50 p-2.5 text-pink-600"><BadgePercent size={20} /></span>
        <div><h2 className="text-base font-bold text-gray-900">Coupon management</h2><p className="mt-1 text-sm text-gray-500">Create discount codes, set limits and schedule when customers can use them.</p></div>
      </div>

      <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs font-semibold text-gray-700">Coupon code *<input required minLength={2} maxLength={40} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="WELCOME10" className={`${inputClass} mt-1.5 uppercase`} /></label>
        <label className="text-xs font-semibold text-gray-700">Coupon name *<input required minLength={2} maxLength={100} value={name} onChange={(e) => setName(e.target.value)} placeholder="Welcome offer" className={`${inputClass} mt-1.5`} /></label>
        <label className="text-xs font-semibold text-gray-700">Discount type<select value={discountType} onChange={(e) => setDiscountType(e.target.value as "PERCENT" | "FIXED")} className={`${inputClass} mt-1.5`}><option value="PERCENT">Percentage (%)</option><option value="FIXED">Fixed amount (৳)</option></select></label>
        <label className="text-xs font-semibold text-gray-700">Discount value *<input required type="number" min="0.01" max={discountType === "PERCENT" ? 100 : undefined} step="0.01" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder={discountType === "PERCENT" ? "10" : "200"} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-xs font-semibold text-gray-700">Minimum order (৳)<input type="number" min="0" step="0.01" value={minimumOrder} onChange={(e) => setMinimumOrder(e.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-xs font-semibold text-gray-700">Maximum discount (৳, optional)<input type="number" min="0.01" step="0.01" value={maximumDiscount} onChange={(e) => setMaximumDiscount(e.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-xs font-semibold text-gray-700">Total use limit<input type="number" min="1" step="1" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} placeholder="Unlimited" className={`${inputClass} mt-1.5`} /></label>
        <label className="text-xs font-semibold text-gray-700">Uses per customer<input type="number" min="1" step="1" value={perUserLimit} onChange={(e) => setPerUserLimit(e.target.value)} placeholder="Unlimited" className={`${inputClass} mt-1.5`} /></label>
        <label className="text-xs font-semibold text-gray-700">Starts at<input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-xs font-semibold text-gray-700">Ends at<input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className={`${inputClass} mt-1.5`} /></label>
        <label className="text-xs font-semibold text-gray-700 sm:col-span-2">Description (optional)<input maxLength={300} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Offer details for customers" className={`${inputClass} mt-1.5`} /></label>
        <div className="flex items-end"><button disabled={isCreating} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#ed2b83] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#d81b70] disabled:opacity-50"><Plus size={17}/>{isCreating ? "Creating..." : "Create coupon"}</button></div>
      </form>

      <div className="overflow-hidden rounded-xl border border-gray-100">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3"><h3 className="flex items-center gap-2 text-sm font-bold text-gray-800"><Tag size={16} className="text-pink-600"/>Existing coupons</h3><button type="button" onClick={() => void refetch()} className="rounded-lg p-1.5 text-gray-500 hover:bg-white" aria-label="Refresh coupons"><RefreshCw size={15}/></button></div>
        {isLoading ? <p className="p-4 text-sm text-gray-500">Loading coupons...</p> : isError ? <div className="flex items-center justify-between p-4 text-sm text-rose-600"><span>Could not load coupons. Check your admin access.</span><button type="button" onClick={() => void refetch()} className="font-bold underline">Retry</button></div> : coupons.length === 0 ? <p className="p-4 text-sm text-gray-500">No coupons created yet.</p> : (
          <div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead className="bg-white text-[11px] uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3">Coupon</th><th className="px-4 py-3">Discount</th><th className="px-4 py-3">Minimum</th><th className="px-4 py-3">Uses</th><th className="px-4 py-3">Schedule</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-gray-100">{coupons.map((coupon) => <tr key={coupon.id}><td className="px-4 py-3"><strong className="block text-gray-900">{coupon.code}</strong><span className="text-xs text-gray-500">{coupon.name}</span></td><td className="px-4 py-3 font-semibold text-gray-800">{coupon.discountType === "PERCENT" ? `${coupon.discountValue}%` : `৳${Number(coupon.discountValue).toLocaleString()}`}{coupon.maximumDiscount ? <span className="block text-[11px] font-normal text-gray-500">max ৳{Number(coupon.maximumDiscount).toLocaleString()}</span> : null}</td><td className="px-4 py-3">৳{Number(coupon.minimumOrder).toLocaleString()}</td><td className="px-4 py-3">{coupon.usageCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : " / ∞"}{coupon.perUserLimit ? <span className="block text-[11px] text-gray-500">{coupon.perUserLimit} per customer</span> : null}</td><td className="px-4 py-3 text-xs text-gray-600">{coupon.startsAt ? new Date(coupon.startsAt).toLocaleDateString() : "Now"} – {coupon.endsAt ? new Date(coupon.endsAt).toLocaleDateString() : "No end"}</td><td className="px-4 py-3"><button type="button" onClick={() => void handleStatus(coupon.id, !coupon.isActive)} className={`rounded-full px-3 py-1 text-xs font-bold ${coupon.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>{coupon.isActive ? "Active" : "Inactive"}</button></td></tr>)}</tbody></table></div>
        )}
      </div>
    </section>
  );
};

export default CouponSettings;
