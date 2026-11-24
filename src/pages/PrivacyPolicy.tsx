import React from "react";
import { Link } from "react-router-dom";
import {
  Lock,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

import { POLICY_PAGE_TABS } from "@/data/shopData";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-[#fdfbf9] dark:bg-[#090D14] min-h-screen py-8 sm:py-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/" className="hover:text-pink-800 dark:hover:text-[#FF4D82] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-400">Help</span>
          <span>/</span>
          <span className="text-gray-800 dark:text-gray-200 font-semibold">Privacy Policy</span>
        </nav>

        {/* Policy Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {POLICY_PAGE_TABS.map((tab) => {
            const isActive = tab.path === "/privacy";
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
              <Lock size={16} />
              DATA PROTECTION & TRUST
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-['Faustina'] text-gray-900 dark:text-white">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
              Last updated: January 2026 • Compliant with Bangladesh Digital Security regulations
            </p>
          </div>

          {/* Quick Notice Box */}
          <div className="bg-pink-50/60 dark:bg-pink-950/30 border border-pink-200/80 dark:border-pink-900/40 rounded-2xl p-4 sm:p-5 mb-8 flex items-start gap-3.5">
            <ShieldCheck size={20} className="text-pink-800 dark:text-[#FF4D82] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
              At <strong>KC Bazar</strong>, your privacy and personal information security are our paramount commitment. We will never sell, lease, or rent your personal data to any third party for marketing purposes.
            </p>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-8 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {/* Section 1 */}
            <div>
              <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-[#FF4D82] text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Information We Collect
              </h2>
              <p className="mb-2">
                When you use KC Bazar, we collect information necessary to fulfill your orders and provide an exceptional shopping experience:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400 pl-2">
                <li><strong>Contact details:</strong> Name, phone number, delivery address, and email address.</li>
                <li><strong>Transaction details:</strong> Ordered items, billing address, payment mode, and order history.</li>
                <li><strong>Technical data:</strong> IP address, device type, browser information, and visited pages (via cookies for performance optimization).</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-[#FF4D82] text-xs flex items-center justify-center font-bold">
                  2
                </span>
                How We Use Your Information
              </h2>
              <p>
                We use collected information solely for legitimate business operations:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600 dark:text-gray-400 pl-2">
                <li>Processing and delivering your orders with accurate courier dispatch</li>
                <li>Sending SMS order status notifications and real-time tracking links</li>
                <li>Providing responsive customer support and resolving inquiries</li>
                <li>Preventing fraudulent transactions and unauthorized account activities</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-[#FF4D82] text-xs flex items-center justify-center font-bold">
                  3
                </span>
                Sharing with Trusted Partners
              </h2>
              <p>
                We only share essential customer data with trusted third-party service providers who assist us in order fulfillment:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600 dark:text-gray-400 pl-2">
                <li><strong>Delivery Partners:</strong> SteadFast Courier, Pathao, and RedX (recipient name, address, phone number).</li>
                <li><strong>Payment Gateways:</strong> PCI-DSS certified payment processors (bKash, Nagad, SSLCommerz). We never store complete credit/debit card numbers on our servers.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-[#FF4D82] text-xs flex items-center justify-center font-bold">
                  4
                </span>
                Data Security & Encryption
              </h2>
              <p>
                We employ industry-standard 256-bit Secure Socket Layer (SSL) encryption across our entire application. All sensitive information exchanged between your device and our servers is encrypted in transit and stored in protected, access-controlled data environments.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-[#FF4D82] text-xs flex items-center justify-center font-bold">
                  5
                </span>
                Cookies and User Preferences
              </h2>
              <p>
                KC Bazar uses essential cookies to remember your shopping cart items, manage user sessions, and analyze site performance. You may disable cookies in your browser settings, though doing so may affect cart functionality.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-[#FF4D82] text-xs flex items-center justify-center font-bold">
                  6
                </span>
                Your Privacy Rights
              </h2>
              <p>
                You retain the right to review, update, or request deletion of your personal account information at any time. To make a data request, please email our Data Privacy Officer at <a href="mailto:privacy@kcbazar.com.bd" className="text-pink-800 dark:text-[#FF4D82] font-semibold hover:underline">privacy@kcbazar.com.bd</a>.
              </p>
            </div>
          </div>

          {/* Need Assistance Card */}
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-[#FF4D82] flex items-center justify-center">
                <HelpCircle size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Questions about your data privacy?</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Contact our privacy team at privacy@kcbazar.com.bd</p>
              </div>
            </div>
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-xl bg-pink-800 hover:bg-pink-900 text-white text-xs font-bold transition-all shadow-xs"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
