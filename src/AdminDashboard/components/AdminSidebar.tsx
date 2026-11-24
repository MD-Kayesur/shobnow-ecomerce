// src/components/AdminDashboard/Shared/AdminSidebar.tsx
import shobNowLogo from "@/assets/Logo/shobnow-logo.png";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  ShoppingBag,
  Package,
  Layers,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  badge?: string;
  children?: { label: string; href: string }[];
}

export interface SidebarProps {
  items?: SidebarItem[];
  onItemClick?: () => void;
}

// Default E-commerce Admin Sidebar Items
const defaultSidebarItems: SidebarItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin-dashboard/dashboard",
  },
  {
    icon: Package,
    label: "Products / Inventory",
    href: "/admin-dashboard/products",
  },
  {
    icon: ShoppingBag,
    label: "Orders Management",
    href: "/admin-dashboard/orders",
    badge: "New",
  },
  {
    icon: Users,
    label: "Customers",
    href: "/admin-dashboard/customers",
  },
  {
    icon: Layers,
    label: "Categories & Brands",
    href: "/admin-dashboard/categories",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/admin-dashboard/settings",
  },
];

const AdminSidebar: React.FC<SidebarProps> = ({
  items = defaultSidebarItems,
  onItemClick,
}) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <div className="flex flex-col h-full bg-[#0F141C] text-gray-200 border-r border-gray-800 select-none">
      {/* Brand Logo & Title */}
      <div className="p-4 border-b border-gray-800/80">
        <Link
          to="/admin-dashboard/dashboard"
          onClick={onItemClick}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md transition-transform group-hover:scale-105 shrink-0">
            <img
              src={shobNowLogo}
              alt="ShopNow Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight font-sans truncate">
                ShopNow
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-primary text-white shadow-xs">
                Admin
              </span>
            </div>
            <span className="text-[11px] text-gray-400 font-medium truncate flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary inline" /> Control Center
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1.5 scrollbar-none">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
          Management
        </div>

        {items.map((item) => {
          const isActive =
            location.pathname === item.href ||
            item.children?.some((child) => location.pathname === child.href);
          const isOpen = openMenu === item.label;
          const Icon = item.icon;

          if (item.href && !item.children) {
            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={onItemClick}
                className={`group flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/25 font-semibold"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-primary"
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
                        : "bg-primary/15 text-primary border border-primary/30"
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          }

          return (
            <div key={item.label}>
              <button
                onClick={() => toggleMenu(item.label)}
                className={`group flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/25 font-semibold"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-primary"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] bg-primary/15 text-primary border border-primary/30"
                    >
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {item.children && isOpen && (
                <div className="ml-7 mt-1.5 space-y-1 pl-2 border-l border-gray-800">
                  {item.children.map((child) => {
                    const childActive = location.pathname === child.href;
                    return (
                      <Link
                        key={child.label}
                        to={child.href}
                        onClick={onItemClick}
                        className={`block px-3 py-1.5 text-xs rounded-lg transition-all ${
                          childActive
                            ? "text-primary font-semibold bg-primary/10"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
