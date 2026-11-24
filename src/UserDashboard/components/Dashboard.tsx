// src/UserDashboard/components/Dashboard.tsx
import { Link } from "react-router-dom";
import {
  Truck,
  ArrowRight,
  Sparkles,
  Clock,
  Heart,
  UserCheck,
} from "lucide-react";
import DashboardCard from "./DashboardCard";

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Welcome & Live Order Alert Banner */}
      <div className="p-6 bg-gradient-to-r from-[#500624] via-[#7B0D3A] to-[#A20E4C] rounded-2xl text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold text-pink-100 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#FF80AB]" />
              <span>Gold VIP Member • 1,420 Reward Pts</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-faustina tracking-tight">
              Welcome back, Ayesha!
            </h1>
            <p className="text-sm text-pink-100/90 max-w-xl leading-relaxed">
              Your order <span className="font-bold underline text-white">#SN-98241</span> has been dispatched via Pathao Courier and is estimated to arrive today by 4:00 PM.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/user-dashboard/orders"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-primary font-bold text-xs shadow-md hover:bg-pink-50 transition-all cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Delivery</span>
            </Link>
          </div>
        </div>

        {/* Decorative circle glow */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* 4 E-Commerce Stat Cards */}
      <DashboardCard />

      {/* Active Order Live Progress Stepper Preview */}
      <div className="p-6 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-primary flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Active Order Live Tracking (#SN-98241)
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Courier: Pathao Logistics • Tracking ID: <span className="font-mono font-bold text-gray-700 dark:text-gray-300">PTH-82914-BD</span>
              </p>
            </div>
          </div>

          <Link
            to="/user-dashboard/orders"
            className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Delivery Progress Bar */}
        <div className="relative pt-2 pb-1">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="space-y-1.5">
              <div className="w-7 h-7 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                ✓
              </div>
              <span className="font-bold text-gray-800 dark:text-gray-200 block text-[11px]">Confirmed</span>
              <span className="text-[10px] text-gray-400 block">Today, 9:15 AM</span>
            </div>

            <div className="space-y-1.5">
              <div className="w-7 h-7 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                ✓
              </div>
              <span className="font-bold text-gray-800 dark:text-gray-200 block text-[11px]">Quality Checked</span>
              <span className="text-[10px] text-gray-400 block">Today, 10:30 AM</span>
            </div>

            <div className="space-y-1.5">
              <div className="w-7 h-7 mx-auto rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs ring-4 ring-pink-100 dark:ring-pink-950/60 shadow-sm animate-pulse">
                🚚
              </div>
              <span className="font-bold text-primary block text-[11px]">Out for Delivery</span>
              <span className="text-[10px] text-primary font-semibold block">Rider: Shakil (+880 1711)</span>
            </div>

            <div className="space-y-1.5 opacity-40">
              <div className="w-7 h-7 mx-auto rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <span className="font-medium text-gray-500 block text-[11px]">Delivered</span>
              <span className="text-[10px] text-gray-400 block">Est: Today, 4 PM</span>
            </div>
          </div>
        </div>

        {/* Item preview inside active order */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="text-gray-500">
              <span className="font-bold text-gray-900 dark:text-white">2 Items:</span> Cosrx Advanced Snail 96 Mucin Essence, Beauty of Joseon Relief Sun Rice
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Total:</span>
            <span className="font-bold text-sm text-primary">৳4,550 (SSLCommerz Paid)</span>
          </div>
        </div>
      </div>

      {/* Quick Links & Shortcuts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/user-dashboard/wishlist"
          className="p-5 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs hover:border-primary/50 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                My Wishlist
              </h3>
              <p className="text-xs text-gray-400">6 items saved</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/user-dashboard/profile"
          className="p-5 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs hover:border-primary/50 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                Saved Addresses
              </h3>
              <p className="text-xs text-gray-400">Dhanmondi, Dhaka (Default)</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/user-dashboard/history"
          className="p-5 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs hover:border-primary/50 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                Purchase Receipts
              </h3>
              <p className="text-xs text-gray-400">8 completed orders</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;

