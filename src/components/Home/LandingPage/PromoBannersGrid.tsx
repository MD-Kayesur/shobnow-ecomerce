import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Gift } from "lucide-react";

export const PromoBannersGrid: React.FC = () => {
  return (
    <section className="w-full py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Banner 1: Korean Glass Skin Edit */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1B4B] via-[#2E1065] to-[#4C1D95] text-white p-8 sm:p-10 flex flex-col justify-between min-h-[300px] sm:min-h-[360px] shadow-xl hover:shadow-2xl transition-all duration-500">
            {/* Background Glows & Patterns */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/20 text-fuchsia-300 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-fuchsia-300" />
                <span>Cult K-Beauty Trend</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight leading-tight mb-3">
                The Glass Skin Ritual
              </h3>
              <p className="text-sm text-gray-200 max-w-sm leading-relaxed">
                Niacinamide, snail mucin & centella essentials from COSRX, Beauty of Joseon, and Anua for an effortless, luminous glow.
              </p>
            </div>

            <div className="relative z-10 pt-6">
              <Link
                to="/shop?category=skin-care"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-950 font-bold text-xs uppercase tracking-wider hover:bg-fuchsia-100 transition-colors shadow-lg shadow-black/20 group-hover:gap-3 transition-all"
              >
                <span>Shop Glass Skin Edit</span>
                <ArrowRight className="w-4 h-4 text-fuchsia-600" />
              </Link>
            </div>
          </div>

          {/* Banner 2: Limited Edition Combo Deals */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#047857] text-white p-8 sm:p-10 flex flex-col justify-between min-h-[300px] sm:min-h-[360px] shadow-xl hover:shadow-2xl transition-all duration-500">
            {/* Background Glows & Patterns */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 mb-4">
                <Gift className="w-3.5 h-3.5 text-amber-300" />
                <span>Value Savings</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight leading-tight mb-3">
                Curated Combo Bundles
              </h3>
              <p className="text-sm text-gray-200 max-w-sm leading-relaxed">
                Save up to 30% on full morning & evening skincare steps, hair repair kits, and festival vanity sets.
              </p>
            </div>

            <div className="relative z-10 pt-6">
              <Link
                to="/shop?category=combo-set"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-400 text-gray-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-colors shadow-lg shadow-black/20 group-hover:gap-3 transition-all"
              >
                <span>Explore Value Bundles</span>
                <ArrowRight className="w-4 h-4 text-gray-950" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBannersGrid;
