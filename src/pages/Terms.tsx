import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

import { POLICY_PAGE_TABS } from "@/data/shopData";

const Terms: React.FC = () => {
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
          <span className="text-gray-800 dark:text-gray-200 font-semibold">Terms & Conditions</span>
        </nav>

        {/* Policy Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {POLICY_PAGE_TABS.map((tab) => {
            const isActive = tab.path === "/terms";
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
              <FileText size={16} />
              LEGAL AGREEMENT
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-['Faustina'] text-gray-900 dark:text-white">
              Terms & Conditions
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
              Last updated: January 2026 • Effective for all KC Bazar users in Bangladesh
            </p>
          </div>

          {/* Quick Notice Box */}
          <div className="bg-pink-50/60 dark:bg-pink-950/30 border border-pink-200/80 dark:border-pink-900/40 rounded-2xl p-4 sm:p-5 mb-8 flex items-start gap-3.5">
            <AlertCircle size={20} className="text-pink-800 dark:text-[#FF4D82] shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
              Welcome to <strong>KC Bazar</strong>. By accessing or using our website, mobile application, or purchasing products, you agree to be bound by the terms outlined below. Please read them carefully.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {/* Section 1 */}
            <div>
              <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-[#FF4D82] text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Acceptance & Eligibility
              </h2>
              <p>
                By creating an account, browsing our catalog, or placing an order on KC Bazar, you confirm that you are at least 18 years of age (or have parental/guardian consent) and are legally capable of entering into binding contracts under the laws of Bangladesh.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-[#FF4D82] text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Product Authenticity & Descriptions
              </h2>
              <p>
                KC Bazar strictly guarantees the 100% authenticity of all products sold on our platform. We source goods directly from authorized brand importers, foreign brand subsidiaries, and licensed distributors. While we strive to display accurate descriptions, ingredient lists, and high-resolution images, subtle color variations may occur depending on your screen settings.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-[#FF4D82] text-xs flex items-center justify-center font-bold">
                  3
                </span>
                Pricing & Payments
              </h2>
              <p>
                All prices are listed in Bangladeshi Taka (BDT ৳) and include applicable taxes unless specified otherwise. We reserve the right to correct any typographical or computational pricing errors. Available payment methods include:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600 dark:text-gray-400 pl-2">
                <li>Cash on Delivery (COD) across Bangladesh</li>
                <li>Mobile Financial Services: bKash, Nagad, Rocket, Upay</li>
                <li>Credit & Debit Cards: Visa, MasterCard, American Express, UnionPay</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-[#FF4D82] text-xs flex items-center justify-center font-bold">
                  4
                </span>
                Order Confirmation & Cancellation
              </h2>
              <p>
                Once an order is placed, our system will generate an order confirmation with your invoice number. KC Bazar reserves the right to cancel any order in the event of stock unavailability, suspicious or fraudulent activity, or unverified contact details. Customers may cancel orders free of charge prior to dispatch by contacting support.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-[#FF4D82] text-xs flex items-center justify-center font-bold">
                  5
                </span>
                Intellectual Property
              </h2>
              <p>
                All content, trademarks, logos, graphics, and design layouts appearing on KC Bazar are protected by copyright and intellectual property laws of Bangladesh. Reproduction, redistribution, or commercial use without prior written consent is strictly prohibited.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-[#FF4D82] text-xs flex items-center justify-center font-bold">
                  6
                </span>
                Governing Law & Jurisdiction
              </h2>
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with the laws of the People’s Republic of Bangladesh. Any dispute arising out of or relating to these terms shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.
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
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Have questions regarding our terms?</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Our customer legal and support team is here to assist you.</p>
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

export default Terms;
