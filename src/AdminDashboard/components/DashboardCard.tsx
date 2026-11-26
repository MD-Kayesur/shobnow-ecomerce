// src/components/AdminDashboard/Dashboard/DashboardCard.tsx
import { TrendingUp, ShoppingBag, Users, AlertCircle } from "lucide-react";

const DashboardCard = () => {
  const metricsData = [
    {
      title: "Total Sales Revenue",
      amount: "৳ 1,48,250",
      change: "+18.4%",
      isPositive: true,
      unit: "vs last week",
      icon: TrendingUp,
      accent: "primary",
    },
    {
      title: "Total Orders",
      amount: "128",
      change: "+12",
      isPositive: true,
      unit: "new orders today",
      icon: ShoppingBag,
      accent: "primary",
    },
    {
      title: "Active Customers",
      amount: "1,240",
      change: "+5.2%",
      isPositive: true,
      unit: "registered users",
      icon: Users,
      accent: "primary",
    },
    {
      title: "Inventory Alert",
      amount: "6 Items",
      change: "Action needed",
      isPositive: false,
      unit: "low stock warning",
      icon: AlertCircle,
      accent: "warning",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
      {metricsData.map((card) => {
        const Icon = card.icon;
        const isWarning = card.accent === "warning";

        return (
          <div
            key={card.title}
            className="p-5 bg-white rounded-2xl border border-gray-200/80 shadow-xs flex flex-col justify-between transition-all hover:shadow-md hover:border-primary/30 group"
          >
            {/* Top Row: Icon + Title */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1.5 font-sans tracking-tight">
                  {card.amount}
                </h3>
              </div>

              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                  isWarning
                    ? "bg-amber-50 text-amber-600 border border-amber-200/50"
                    : "bg-primary-light text-primary border border-primary/20"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {/* Bottom Row: Indicator & Unit */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span
                className={`font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                  card.isPositive
                    ? "bg-emerald-50 text-emerald-600 "
                    : "bg-amber-50 text-amber-600 "
                }`}
              >
                {card.change}
              </span>
              <span className="text-gray-400 ">{card.unit}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCard;
