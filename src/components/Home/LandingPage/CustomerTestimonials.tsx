import React from "react";
import { Star, CheckCircle, Quote, ThumbsUp } from "lucide-react";
import {
  CUSTOMER_TESTIMONIALS_DATA,
  TESTIMONIALS_METRICS,
} from "@/data/shopData";

export const CustomerTestimonials: React.FC = () => {
  return (
    <section className="w-full py-12 sm:py-16 bg-[#FAFAFC] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-2">
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Real Customer Love</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            Loved By 45,000+ Beauty Lovers
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            See how genuine K-Beauty and personal care transformed our customers' daily skincare rituals.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {CUSTOMER_TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative group"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-gray-100 group-hover:text-primary-light transition-colors" />

              <div>
                {/* Rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="text-xs font-bold text-primary truncate mb-1">
                  Product: {t.product}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      {t.name}
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    </h4>
                    <span className="text-[11px] text-gray-400">{t.location}</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-600 rounded-md">
                    {t.skinType}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-white border border-gray-100 shadow-sm text-center">
          {TESTIMONIALS_METRICS.map((stat, idx) => (
            <div key={idx}>
              <div className={`text-2xl sm:text-3xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
