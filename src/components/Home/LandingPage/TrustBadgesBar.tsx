import React from "react";
import { Truck, ShieldCheck, CreditCard, RotateCcw, Headset } from "lucide-react";
import { TRUST_BADGES_DATA } from "@/data/shopData";

const ICON_MAP = {
  Truck,
  ShieldCheck,
  CreditCard,
  RotateCcw,
  Headset,
};

export const TrustBadgesBar: React.FC = () => {
  return (
    <section className="w-full bg-white border-y border-gray-100 py-6 sm:py-8 my-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {TRUST_BADGES_DATA.map((item, index) => {
            const Icon = ICON_MAP[item.iconName];
            return (
              <div
                key={index}
                className="group p-4 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-gray-100 hover:border-primary/20 transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5 hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0 border border-gray-100">
                  <Icon className="w-6 h-6 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-primary transition-colors truncate">
                      {item.title}
                    </h4>
                    {item.badge && (
                      <span className="hidden xl:inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-500 leading-tight">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadgesBar;
