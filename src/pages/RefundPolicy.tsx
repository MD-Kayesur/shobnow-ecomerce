import React from "react";
import { Link } from "react-router-dom";
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import {
  POLICY_PAGE_TABS,
  REFUND_STEPS as STEPS,
  REFUND_TIMELINES,
} from "@/data/shopData";

const RefundPolicy: React.FC = () => {
  return (
    <div className="bg-[#fdfbf9] dark:bg-[#090D14] min-h-screen py-8 sm:py-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/" className="hover:text-pink-800 dark:hover:text-[#FF4D82] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-400">Customer Policy</span>
          <span>/</span>
          <span className="text-gray-800 dark:text-gray-200 font-semibold">Refund & Return Policy</span>
        </nav>

        {/* Policy Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {POLICY_PAGE_TABS.map((tab) => {
            const isActive = tab.path === "/refund-policy";
            return (
              <Link
                key={tab.label}
                to={tab.path}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-pink-800 dark:bg-pink-700 text-white shadow-xs"
                    : "bg-white dark:bg-[#111622] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-[#111622] rounded-3xl p-6 sm:p-10 lg:p-12 border border-pink-100/80 dark:border-gray-800 shadow-xs">
          {/* Header */}
          <div className="border-b border-gray-100 dark:border-gray-800 pb-6 mb-8">
            <div className="flex items-center gap-2 text-xs font-bold text-pink-800 dark:text-[#FF4D82] uppercase tracking-wider mb-2">
              <RotateCcw size={16} />
              7-DAY SATISFACTION GUARANTEE
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-['Faustina'] text-gray-900 dark:text-white">
              Refund & Return Policy
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
              Easy, transparent, and fair returns for every customer across Bangladesh.
            </p>
          </div>

          {/* Guarantee Banner */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 rounded-2xl p-4 sm:p-5 mb-8 flex items-start gap-3.5">
            <ShieldCheck size={22} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 mb-0.5 font-['Faustina']">
                Our 100% Genuine & Damage-Free Guarantee
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
                If your package arrives damaged, unsealed, or contains an incorrect item, we will replace it or refund your money immediately at zero extra cost to you.
              </p>
            </div>
          </div>

          {/* 4 Step Process */}
          <div className="mb-12">
            <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white mb-4">
              How the Return Process Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {STEPS.map((s) => (
                <div
                  key={s.step}
                  className="p-5 rounded-2xl bg-gray-50/70 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-black text-pink-800 dark:text-[#FF4D82] bg-pink-50 dark:bg-pink-950/40 px-2.5 py-1 rounded-lg">
                      STEP {s.step}
                    </span>
                    <h3 className="text-sm font-bold font-['Faustina'] text-gray-900 dark:text-white mt-3 mb-1.5">{s.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Return Eligibility Criteria */}
          <div className="mb-12">
            <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white mb-4">
              Return Eligibility Criteria
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Eligible items */}
              <div className="p-6 rounded-2xl bg-emerald-50/30 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm mb-3">
                  <CheckCircle2 size={18} />
                  What IS Eligible for Return / Refund
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    Item damaged, cracked, or leaking upon courier arrival.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    Wrong product, shade, or variant received compared to your invoice.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    Defective bottle dropper, spray nozzle, or dispenser pump.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    Product close to or past expiry date at time of delivery.
                  </li>
                </ul>
              </div>

              {/* Ineligible items */}
              <div className="p-6 rounded-2xl bg-rose-50/30 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm mb-3">
                  <XCircle size={18} />
                  What IS NOT Eligible for Return
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    Cosmetics or skincare products with broken security seals or used content (for hygienic safety).
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    Items reported after the 7-day delivery window has expired.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    Damage caused by customer misuse or improper storage.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    Free promotional gifts or samples given with orders.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Refund Timelines Table */}
          <div className="mb-12">
            <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock size={18} className="text-pink-800 dark:text-[#FF4D82]" />
              Refund Processing Timelines
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 font-bold">
                  <tr>
                    <th className="p-3.5 sm:p-4">Payment Method</th>
                    <th className="p-3.5 sm:p-4">Processing Time</th>
                    <th className="p-3.5 sm:p-4">Deductions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                  {REFUND_TIMELINES.map((t) => (
                    <tr key={t.method} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="p-3.5 sm:p-4 font-semibold text-gray-900 dark:text-white">{t.method}</td>
                      <td className="p-3.5 sm:p-4">{t.time}</td>
                      <td className="p-3.5 sm:p-4 text-emerald-600 dark:text-emerald-400 font-medium">{t.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Action Section */}
          <div className="bg-gradient-to-r from-pink-50 dark:from-pink-950/30 via-white dark:via-[#111622] to-amber-50/50 dark:to-amber-950/20 rounded-2xl p-6 sm:p-8 border border-pink-200 dark:border-pink-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold font-['Faustina'] text-gray-900 dark:text-white">
                Need to request a return or exchange?
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                Our support team is standing by to resolve your issue quickly and smoothly.
              </p>
            </div>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl bg-pink-800 hover:bg-pink-900 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
            >
              Contact Support <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
