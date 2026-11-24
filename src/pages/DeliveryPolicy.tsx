import React from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  Clock,
  Package,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import {
  POLICY_PAGE_TABS,
  SHIPPING_ZONES,
  COURIER_PARTNERS,
} from "@/data/shopData";

const DeliveryPolicy: React.FC = () => {
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
          <span className="text-gray-800 dark:text-gray-200 font-semibold">Delivery Policy</span>
        </nav>

        {/* Policy Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {POLICY_PAGE_TABS.map((tab) => {
            const isActive = tab.path === "/delivery-policy";
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
              <Truck size={16} />
              EXPRESS NATIONWIDE SHIPPING
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-['Faustina'] text-gray-900 dark:text-white">
              Delivery Policy & Shipping Rates
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
              Fast, tracked, and insured deliveries across all 64 districts of Bangladesh.
            </p>
          </div>

          {/* Free Shipping Alert Box */}
          <div className="bg-pink-50/60 dark:bg-pink-950/30 border border-pink-200/80 dark:border-pink-900/40 rounded-2xl p-4 sm:p-5 mb-8 flex items-start gap-3.5">
            <Sparkles size={22} className="text-pink-800 dark:text-[#FF4D82] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold font-['Faustina'] text-gray-900 dark:text-white mb-0.5">
                Free Delivery Promotion on Orders Over ৳2,000!
              </h3>
              <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">
                Enjoy 100% free delivery nationwide anywhere in Bangladesh when your subtotal reaches <strong>৳2,000 or more</strong>. The discount is automatically applied during checkout.
              </p>
            </div>
          </div>

          {/* Shipping Rates Table / Cards */}
          <div className="mb-12">
            <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white mb-4">
              Standard Shipping Rates & Delivery Timelines
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {SHIPPING_ZONES.map((zone) => (
                <div
                  key={zone.zone}
                  className="bg-gray-50/70 dark:bg-gray-900/40 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 flex flex-col justify-between hover:border-pink-300 dark:hover:border-pink-900/60 transition-all"
                >
                  <div>
                    <span className="text-[10px] font-bold text-pink-800 dark:text-[#FF4D82] bg-pink-50 dark:bg-pink-950/40 px-2.5 py-0.5 rounded-full">
                      {zone.badge}
                    </span>
                    <h3 className="text-sm font-bold font-['Faustina'] text-gray-900 dark:text-white mt-2.5 mb-1">{zone.zone}</h3>
                    <div className="text-2xl font-black text-gray-900 dark:text-white my-2">{zone.cost}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-2">
                      <Clock size={12} className="text-pink-800 dark:text-[#FF4D82]" /> {zone.time}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-200/60 dark:border-gray-800 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {zone.freeThreshold}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secure Packaging & Handling */}
          <div className="mb-12">
            <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Package size={20} className="text-pink-800 dark:text-[#FF4D82]" />
              Safety & Tamper-Proof Packaging
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/60 shadow-2xs space-y-1">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-pink-800 dark:text-[#FF4D82]" /> Multi-Layer Cushioning
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  Glass serums, delicate compacts, and perfumes are secured with shock-absorbent bubble wrap.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/60 shadow-2xs space-y-1">
                <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-pink-800 dark:text-[#FF4D82]" /> Security Hologram Tape
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  Every box is sealed with branded tamper-evident tape to ensure hands never touch your items in transit.
                </p>
              </div>
            </div>
          </div>

          {/* Courier Network */}
          <div className="mb-12">
            <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white mb-4">
              Our Verified Delivery Network
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {COURIER_PARTNERS.map((p) => (
                <div key={p.name} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
                  <div className="font-bold text-xs text-gray-900 dark:text-white">{p.name}</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{p.role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Delivery Instructions */}
          <div className="space-y-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-12">
            <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white">Important Delivery Notes</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 pl-2">
              <li>
                <strong>SMS Tracking:</strong> You will receive an SMS containing your tracking code and courier rider contact number once your parcel is dispatched.
              </li>
              <li>
                <strong>Delivery Attempts:</strong> Couriers will make up to three (3) delivery attempts. If you are unavailable, you can reschedule directly with the courier rider.
              </li>
              <li>
                <strong>Inspecting Packages:</strong> Please verify the outer box condition before handing over cash to the courier. If damaged or opened, do not accept the delivery.
              </li>
            </ul>
          </div>

          {/* Bottom Action Section */}
          <div className="bg-gradient-to-r from-pink-50 dark:from-pink-950/30 via-white dark:via-[#111622] to-amber-50/50 dark:to-amber-950/20 rounded-2xl p-6 sm:p-8 border border-pink-200 dark:border-pink-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold font-['Faustina'] text-gray-900 dark:text-white">
                Need help with an ongoing delivery?
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                Reach out with your Order ID for real-time live location updates.
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

export default DeliveryPolicy;
