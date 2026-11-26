import React, { useState } from "react";
import { toast } from "sonner";
import { useSubscribeNewsletterMutation } from "@/redux/features/storefront/storefrontApi";

export const NewsletterVIP: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribe, { isLoading }] = useSubscribeNewsletterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    try {
      const response = await subscribe({ email: normalizedEmail, source: "storefront-footer" }).unwrap();
      toast.success(response.message || "Thank you for subscribing!", {
        description: "You will receive our latest updates and exclusive offers.",
      });
      setEmail("");
    } catch (error) {
      const response = error as { data?: { message?: string | string[] } };
      const message = response.data?.message;
      toast.error(Array.isArray(message) ? message.join(" ") : message || "Could not subscribe right now. Please try again.");
    }
  };

  return (
    <section className="w-full bg-[#FFFCFE] dark:bg-[#090D14] py-8 sm:py-12 transition-colors duration-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        {/* Exact Figma Container: background #FEEAF1, borderRadius 12, padding 48px */}
        <div className="w-full bg-[#FEEAF1] dark:bg-[#1C141B] rounded-xl py-12 px-6 sm:px-10 lg:px-14 shadow-2xs border border-pink-200/50 dark:border-pink-900/40 transition-colors duration-200">
          <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="flex-1 max-w-2xl text-center lg:text-left">
              <h3 className="text-2xl sm:text-[24px] font-faustina font-semibold text-[#1B1E23] dark:text-white leading-[28.8px] tracking-tight">
                Get notified when we launch
              </h3>
              <p className="mt-2 text-sm sm:text-base font-inter font-normal text-[#33373F] dark:text-gray-300 leading-6">
                Stay up to date with the latest news, announcements, and articles.
              </p>
            </div>

            {/* Right Email Form */}
            <form
              onSubmit={handleSubmit}
              className="w-full lg:w-[420px] flex flex-col sm:flex-row items-center gap-3 sm:gap-4 shrink-0"
            >
              <div className="w-full flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FDFDFD] dark:bg-gray-800 text-[#1B1E23] dark:text-white placeholder-[#717680] dark:placeholder-gray-400 text-base font-inter rounded-lg border border-[#D5D7DA] dark:border-gray-700 focus:outline-none focus:border-[#930D45] dark:focus:border-[#FF4D82] shadow-xs"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#FFE2FF] hover:bg-[#ffd1ff] disabled:opacity-60 disabled:cursor-not-allowed text-[#500624] font-inter font-bold text-lg leading-[23.4px] rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                {isLoading ? "Submitting…" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterVIP;
