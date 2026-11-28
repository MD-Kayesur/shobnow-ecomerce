import { Wrench } from "lucide-react";
import PromoBarSettings from "@/AdminDashboard/components/PromoBarSettings";

const SystemMaintenancePage = () => (
  <div className="mx-auto max-w-5xl space-y-6 pb-10">
    <header className="flex items-start gap-3">
      <span className="rounded-xl bg-primary-light p-3 text-primary"><Wrench size={22}/></span>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Maintenance</h1>
        <p className="mt-1 text-sm text-gray-500">Manage system-wide storefront features and promotional messages.</p>
      </div>
    </header>
    <PromoBarSettings />
  </div>
);

export default SystemMaintenancePage;
