// src/UserDashboard/components/UserSidebar.tsx
import shobNowLogo from "@/assets/Logo/shobnow-logo.png";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  UserCheck,
  Clock,
  ArrowLeft,
  Sparkles,
  Headphones,
} from "lucide-react";

export interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  badge?: string;
}

export interface UserSidebarProps {
  onItemClick?: () => void;
}

const userSidebarItems: SidebarItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard Overview",
    href: "/user-dashboard/dashboard",
  },
  {
    icon: ShoppingBag,
    label: "My Orders & Tracking",
    href: "/user-dashboard/orders",
    badge: "2 Active",
  },
  {
    icon: Heart,
    label: "My Wishlist",
    href: "/user-dashboard/wishlist",
    badge: "6",
  },
  {
    icon: UserCheck,
    label: "Profile & Addresses",
    href: "/user-dashboard/profile",
  },
  {
    icon: Clock,
    label: "Purchase History",
    href: "/user-dashboard/history",
  },
];

const UserSidebar: React.FC<UserSidebarProps> = ({ onItemClick }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-[#1A0B13] dark:bg-[#0B070D] text-white select-none border-r border-[#3A1426] transition-colors">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-[#3A1426]">
        <Link
          to="/"
          onClick={onItemClick}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
            <img
              src={shobNowLogo}
              alt="ShopNow"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-[#FF80AB] transition-colors">
                ShopNow
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#A20E4C] text-white">
                VIP
              </span>
            </div>
            <span className="text-[11px] text-pink-200/70 font-medium truncate flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FF80AB] inline" /> User Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1.5 scrollbar-none">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-pink-200/50 uppercase">
          My Account
        </div>

        {userSidebarItems.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href === "/user-dashboard/dashboard" &&
              location.pathname === "/user-dashboard");
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.href}
              onClick={onItemClick}
              className={`group flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#A20E4C] text-white shadow-md shadow-[#A20E4C]/30 font-semibold"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-pink-300/70 group-hover:text-white"
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <Badge
                  variant="secondary"
                  className={`text-[10px] px-1.5 py-0.5 font-bold uppercase rounded-md transition-colors ${
                    isActive
                      ? "bg-white/20 text-white border-transparent"
                      : "bg-[#A20E4C]/25 text-[#FF80AB] border border-[#A20E4C]/40"
                  }`}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Footer Section: Back to Storefront */}
      <div className="p-3 border-t border-[#3A1426] space-y-2">
        <Link
          to="/"
          onClick={onItemClick}
          className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-pink-200/90 bg-white/5 hover:bg-white/10 hover:text-white transition-all border border-pink-500/20"
        >
          <div className="flex items-center gap-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Store</span>
          </div>
          <span className="text-[10px] text-pink-400">Shop</span>
        </Link>

        <div className="p-3 rounded-xl bg-gradient-to-br from-[#2D0D1D] to-[#1F0712] border border-[#500624] text-xs">
          <div className="flex items-center gap-2 text-[#FF80AB] font-bold text-[11px] mb-1">
            <Headphones className="w-3.5 h-3.5" />
            <span>VIP Concierge Support</span>
          </div>
          <p className="text-[11px] text-pink-200/70 leading-relaxed mb-2">
            Need help with an order or product routine?
          </p>
          <a
            href="tel:+8801700000000"
            className="inline-flex items-center justify-center w-full py-1.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 font-semibold text-[11px] border border-pink-500/30 transition-colors"
          >
            Direct Helpdesk
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;

