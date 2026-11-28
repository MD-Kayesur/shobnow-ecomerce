import { BadgePercent } from "lucide-react";
import CouponSettings from "@/AdminDashboard/components/CouponSettings";

const CouponManagementPage = () => (
  <div className="mx-auto max-w-6xl space-y-6 pb-10">
    <header className="flex items-start gap-3">
      <span className="rounded-xl bg-primary-light p-3 text-primary"><BadgePercent size={22}/></span>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
        <p className="mt-1 text-sm text-gray-500">Create, update, activate, and remove discount coupons.</p>
      </div>
    </header>
    <CouponSettings />
  </div>
);

export default CouponManagementPage;
