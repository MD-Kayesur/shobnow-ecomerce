// src/UserDashboard/components/DashboardCard.tsx
import { ShoppingBag, Heart, CreditCard, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export interface UserStatCard {
  title: string;
  value: string;
  subtitle: string;
  badge?: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

const USER_STATS: UserStatCard[] = [
  {
    title: "Active Orders",
    value: "2",
    subtitle: "In transit via Pathao Courier",
    badge: "1 Arriving Today",
    link: "/user-dashboard/orders",
    icon: ShoppingBag,
    iconBg: "bg-pink-50 dark:bg-pink-950/40",
    iconColor: "text-primary",
  },
  {
    title: "Saved to Wishlist",
    value: "6",
    subtitle: "Authentic skincare & cosmetics",
    badge: "2 On Sale",
    link: "/user-dashboard/wishlist",
    icon: Heart,
    iconBg: "bg-rose-50 dark:bg-rose-950/40",
    iconColor: "text-rose-500",
  },
  {
    title: "Total Lifetime Spent",
    value: "৳28,400",
    subtitle: "Across 8 completed orders",
    badge: "Free Delivery",
    link: "/user-dashboard/history",
    icon: CreditCard,
    iconBg: "bg-purple-50 dark:bg-purple-950/40",
    iconColor: "text-purple-600",
  },
  {
    title: "Beauty Club Points",
    value: "1,420 pts",
    subtitle: "Redeemable for ৳1,420 discount",
    badge: "Gold VIP Tier",
    link: "/user-dashboard/profile",
    icon: Sparkles,
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    iconColor: "text-amber-500",
  },
];

const DashboardCard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
      {USER_STATS.map((stat) => {
        const Icon = stat.icon;
        return (
          <Link
            key={stat.title}
            to={stat.link}
            className="group p-5 bg-white dark:bg-[#141A24] rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              {stat.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100/70 dark:bg-pink-900/30 text-primary uppercase">
                  {stat.badge}
                </span>
              )}
            </div>

            <div className="mt-4">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {stat.title}
              </span>
              <div className="text-2xl font-bold font-faustina text-gray-900 dark:text-white mt-0.5">
                {stat.value}
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 truncate">
                {stat.subtitle}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default DashboardCard;

