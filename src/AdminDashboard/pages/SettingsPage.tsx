// src/pages/Admin/SettingsPage.tsx
import { useState } from "react";
import {
  Settings,
  Save,
  Truck,
  CreditCard,
  Store,
  Check,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import PromoBarSettings from "@/AdminDashboard/components/PromoBarSettings";
import CouponSettings from "@/AdminDashboard/components/CouponSettings";

const SettingsPage = () => {
  const [storeName, setStoreName] = useState("ShopNow (ShobNow)");
  const [supportEmail, setSupportEmail] = useState("support@shopnow.com.bd");
  const [supportPhone, setSupportPhone] = useState("+880 1700-000000");
  const [insideDhakaFee, setInsideDhakaFee] = useState(60);
  const [outsideDhakaFee, setOutsideDhakaFee] = useState(120);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(2500);
  const [sslCommerzEnabled, setSslCommerzEnabled] = useState(true);
  const [codEnabled, setCodEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  // Admin Change Password state
  const [adminCurrentPassword, setAdminCurrentPassword] = useState("");
  const [adminNewPassword, setAdminNewPassword] = useState("");
  const [adminConfirmPassword, setAdminConfirmPassword] = useState("");
  const [showAdminCurrentPassword, setShowAdminCurrentPassword] = useState(false);
  const [showAdminNewPassword, setShowAdminNewPassword] = useState(false);
  const [showAdminConfirmPassword, setShowAdminConfirmPassword] = useState(false);
  const [isAdminChangingPassword, setIsAdminChangingPassword] = useState(false);
  const [adminPasswordSuccess, setAdminPasswordSuccess] = useState(false);
  const [adminPasswordError, setAdminPasswordError] = useState("");

  const handleAdminPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPasswordError("");
    setAdminPasswordSuccess(false);

    if (!adminCurrentPassword) {
      setAdminPasswordError("Please enter your current admin password.");
      return;
    }
    if (adminNewPassword.length < 6) {
      setAdminPasswordError("New admin password must be at least 6 characters.");
      return;
    }
    if (adminNewPassword !== adminConfirmPassword) {
      setAdminPasswordError("New password and confirm password do not match.");
      return;
    }
    if (adminNewPassword === adminCurrentPassword) {
      setAdminPasswordError("New password cannot be the same as your current password.");
      return;
    }

    setIsAdminChangingPassword(true);
    setTimeout(() => {
      setIsAdminChangingPassword(false);
      setAdminPasswordSuccess(true);
      setAdminCurrentPassword("");
      setAdminNewPassword("");
      setAdminConfirmPassword("");
      toast.success("Admin Password Updated Successfully!", {
        description: "Your administrator security credentials have been updated securely.",
      });
      setTimeout(() => setAdminPasswordSuccess(false), 4000);
    }, 500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-primary" />
            Store Settings & Configuration
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure store defaults, shipping rates, payment gateways, and theme branding.
          </p>
        </div>

        {saved && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200">
            <Check className="w-4 h-4" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      <PromoBarSettings />
      <CouponSettings />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Store Information */}
        <div className="p-6 bg-white rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Store className="w-5 h-5 text-primary" />
            General Store Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Customer Support Hotline
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Default Currency
              </label>
              <input
                type="text"
                disabled
                value="BDT (৳) - Bangladeshi Taka"
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Delivery & Shipping Rates */}
        <div className="p-6 bg-white rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Truck className="w-5 h-5 text-primary" />
            Shipping & Courier Rates (Bangladesh)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Inside Dhaka City (৳)
              </label>
              <input
                type="number"
                value={insideDhakaFee}
                onChange={(e) => setInsideDhakaFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Outside Dhaka / All Bangladesh (৳)
              </label>
              <input
                type="number"
                value={outsideDhakaFee}
                onChange={(e) => setOutsideDhakaFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Free Delivery Above (৳)
              </label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Payment Gateways */}
        <div className="p-6 bg-white rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <CreditCard className="w-5 h-5 text-primary" />
            Payment Gateway Integrations
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer">
              <div>
                <p className="text-sm font-bold text-gray-900 ">
                  SSLCommerz Payment Gateway
                </p>
                <p className="text-xs text-gray-500">
                  Accept Visa, Mastercard, bKash, Nagad, Rocket, and Internet Banking.
                </p>
              </div>
              <input
                type="checkbox"
                checked={sslCommerzEnabled}
                onChange={(e) => setSslCommerzEnabled(e.target.checked)}
                className="w-5 h-5 accent-primary cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer">
              <div>
                <p className="text-sm font-bold text-gray-900 ">
                  Cash on Delivery (COD)
                </p>
                <p className="text-xs text-gray-500">
                  Allow customers to pay cash when product arrives at their doorstep.
                </p>
              </div>
              <input
                type="checkbox"
                checked={codEnabled}
                onChange={(e) => setCodEnabled(e.target.checked)}
                className="w-5 h-5 accent-primary cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary-hover font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configuration</span>
          </button>
        </div>
      </form>

      {/* Administrator Security & Change Password Section */}
      <form
        id="security-password-section"
        onSubmit={handleAdminPasswordChange}
        className="p-6 bg-white rounded-2xl border border-gray-200/80 shadow-xs space-y-5 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" />
            Admin Security & Change Password
          </h2>
          <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 inline" /> Super Admin Access Protection
          </span>
        </div>

        {/* Inline Alerts */}
        {adminPasswordError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 " />
            <span>{adminPasswordError}</span>
          </div>
        )}

        {adminPasswordSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-600 " />
            <span>Admin password updated successfully! Please keep your administrator credentials secure.</span>
          </div>
        )}

        {/* 3 Password Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          {/* Current Admin Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Current Admin Password
            </label>
            <div className="relative">
              <input
                type={showAdminCurrentPassword ? "text" : "password"}
                value={adminCurrentPassword}
                onChange={(e) => {
                  setAdminCurrentPassword(e.target.value);
                  if (adminPasswordError) setAdminPasswordError("");
                }}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowAdminCurrentPassword(!showAdminCurrentPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-primary transition-colors cursor-pointer"
                aria-label={showAdminCurrentPassword ? "Hide password" : "Show password"}
              >
                {showAdminCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Admin Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              New Admin Password
            </label>
            <div className="relative">
              <input
                type={showAdminNewPassword ? "text" : "password"}
                value={adminNewPassword}
                onChange={(e) => {
                  setAdminNewPassword(e.target.value);
                  if (adminPasswordError) setAdminPasswordError("");
                }}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowAdminNewPassword(!showAdminNewPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-primary transition-colors cursor-pointer"
                aria-label={showAdminNewPassword ? "Hide password" : "Show password"}
              >
                {showAdminNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm New Admin Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Confirm New Admin Password
            </label>
            <div className="relative">
              <input
                type={showAdminConfirmPassword ? "text" : "password"}
                value={adminConfirmPassword}
                onChange={(e) => {
                  setAdminConfirmPassword(e.target.value);
                  if (adminPasswordError) setAdminPasswordError("");
                }}
                placeholder="Re-type new password"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowAdminConfirmPassword(!showAdminConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-primary transition-colors cursor-pointer"
                aria-label={showAdminConfirmPassword ? "Hide password" : "Show password"}
              >
                {showAdminConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Guideline Footnote & Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <p className="text-[11px] text-gray-400">
            Security: Administrative passwords must be strong and distinct. All administrative sessions are logged for audit compliance.
          </p>

          <button
            type="submit"
            disabled={isAdminChangingPassword}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold shadow-xs hover:bg-amber-600 hover:text-white transition-all cursor-pointer disabled:opacity-60"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isAdminChangingPassword ? "Updating..." : "Update Admin Password"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
