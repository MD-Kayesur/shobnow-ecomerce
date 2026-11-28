import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  ArrowRight,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa6";
import { toast } from "sonner";
import { CONTACT_FAQS as FAQS } from "@/data/shopData";
import contactHeroCluster from "@/assets/contact/contact-hero-cluster.png";
import { useSubmitSupportRequestMutation } from "@/redux/features/storefront/storefrontApi";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderId: "",
    subject: "General Inquiry",
    message: "",
  });
  const [submitSupportRequest, { isLoading: isSubmitting }] = useSubmitSupportRequestMutation();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields (Name, Email, Message)");
      return;
    }

    try {
      const result = await submitSupportRequest({
        name: formData.name.trim(), email: formData.email.trim(),
        phone: formData.phone.trim() || undefined, orderId: formData.orderId.trim() || undefined,
        subject: formData.subject, message: formData.message.trim(),
      }).unwrap();
      toast.success(`Support request received. Reference: ${result.data.reference}`);
      setFormData({ name: "", email: "", phone: "", orderId: "", subject: "General Inquiry", message: "" });
    } catch (error) {
      const message = (error as { data?: { message?: string | string[] } })?.data?.message;
      toast.error(Array.isArray(message) ? message.join(" ") : message || "Could not submit your support request. Please try again.");
    }
  };

  return (
    <div className="bg-[#fdfbf9] dark:bg-[#090D14] text-gray-800 dark:text-gray-100 min-h-screen py-8 sm:py-12 transition-colors duration-200">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-6 font-['Inter']">
          <Link to="/" className="hover:text-pink-800 dark:hover:text-[#FF4D82] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-800 dark:text-gray-200 font-semibold">Contact Us</span>
        </nav>

        {/* Hero Header */}
        <div className="relative mb-7 grid min-h-[210px] overflow-hidden rounded-[28px] border border-pink-100 bg-[linear-gradient(110deg,#fffafd_0%,#fff2f8_58%,#ffe7f2_100%)] px-6 py-7 shadow-[0_8px_26px_rgba(162,14,76,0.045)] sm:mb-9 sm:min-h-[240px] sm:px-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <div className="relative z-10 max-w-2xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-200/70 bg-white/85 px-3 py-1 text-xs font-bold text-[#A20E4C] shadow-sm">
              <Sparkles size={13} /> WE’RE HERE TO HELP
            </span>
            <h1 className="mt-3 font-['Faustina'] text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-[44px]">
              Get in Touch with <span className="italic text-[#C41462]">SHOB Now</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl font-['Inter'] text-sm leading-6 text-gray-600 dark:text-gray-300 sm:text-base lg:mx-0">
              Have questions about your order, product authenticity, or personalized beauty recommendations? Our friendly support team is ready to assist you 7 days a week.
            </p>
          </div>
          <div className="relative mx-auto mt-3 h-40 w-full max-w-sm sm:h-48 lg:absolute lg:bottom-0 lg:right-4 lg:mt-0 lg:h-[235px] lg:w-[38%] lg:max-w-none">
            <img src={contactHeroCluster} alt="ShobNow beauty gift bag with skincare products and flowers" className="h-full w-full object-contain object-center lg:object-right-bottom" />
          </div>
        </div>

        {/* 4 Contact Channels */}
        <div className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Phone Hotline */}
          <div className="group flex min-h-[220px] flex-col rounded-2xl border border-pink-100 bg-white p-5 shadow-[0_4px_16px_rgba(70,20,45,0.045)] transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-[#111622]">
            <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Phone size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Customer Support Hotline</h3>
            <p className="mb-3 text-sm font-bold text-[#A20E4C]">+880 9612-345678</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Daily: 9:00 AM – 10:00 PM</p>
            <a
              href="tel:+8809612345678"
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f51372] to-[#e90068] px-4 py-2.5 text-xs font-bold text-white shadow-[0_5px_13px_rgba(233,0,104,0.18)] transition hover:brightness-105"
            >
              Call Now <ArrowRight size={14} />
            </a>
          </div>

          {/* Card 2: WhatsApp Chat */}
          <div className="group flex min-h-[220px] flex-col rounded-2xl border border-pink-100 bg-white p-5 shadow-[0_4px_16px_rgba(70,20,45,0.045)] transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-[#111622]">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaWhatsapp size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">WhatsApp Live Chat</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Instant answers & order updates</p>
            <a
              href="https://wa.me/8801712345678"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-800 dark:bg-[#111622] dark:text-emerald-400"
            >
              Chat Now <ArrowRight size={14} />
            </a>
          </div>

          {/* Card 3: Email Support */}
          <div className="group flex min-h-[220px] flex-col rounded-2xl border border-pink-100 bg-white p-5 shadow-[0_4px_16px_rgba(70,20,45,0.045)] transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-[#111622]">
            <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Email Support</h3>
            <p className="mb-3 truncate text-sm font-bold text-[#A20E4C]">support@shownow.com.bd</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Average response time: 2 hours</p>
            <a
              href="mailto:support@shownow.com.bd"
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f51372] to-[#e90068] px-4 py-2.5 text-xs font-bold text-white shadow-[0_5px_13px_rgba(233,0,104,0.18)] transition hover:brightness-105"
            >
              Send an Email <ArrowRight size={14} />
            </a>
          </div>

          {/* Card 4: Corporate Office */}
          <div className="group flex min-h-[220px] flex-col rounded-2xl border border-pink-100 bg-white p-5 shadow-[0_4px_16px_rgba(70,20,45,0.045)] transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-[#111622]">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MapPin size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Corporate Flagship</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">House 42, Road 11, Block D, Banani</p>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Dhaka-1213, Bangladesh</span>
            <a href="https://maps.google.com/?q=House+42+Road+11+Block+D+Banani+Dhaka" target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f51372] to-[#e90068] px-4 py-2.5 text-xs font-bold text-white shadow-[0_5px_13px_rgba(233,0,104,0.18)] transition hover:brightness-105">Get Directions <ArrowRight size={14}/></a>
          </div>
        </div>

        {/* Main Grid: Contact Form + Location / Hours Info */}
        <div className="mb-9 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Contact Form (7 cols) */}
          <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-[0_6px_24px_rgba(70,20,45,0.045)] dark:border-gray-800 dark:bg-[#111622] sm:p-8 lg:col-span-7">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={20} className="text-pink-800 dark:text-pink-400" />
              <h2 className="text-xl sm:text-2xl font-bold font-['Faustina'] text-gray-900 dark:text-white">
                Send Us a Message
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 font-['Inter']">
              Fill out the form below and our dedicated support representative will get back to you promptly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 font-['Inter']">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ayesha Rahman"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-800/20 focus:border-pink-800 dark:focus:border-pink-500 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. ayesha@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-800/20 focus:border-pink-800 dark:focus:border-pink-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 01712-XXXXXX"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-800/20 focus:border-pink-800 dark:focus:border-pink-500 transition-all"
                  />
                </div>

                {/* Order ID */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Order ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.orderId}
                    onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                    placeholder="e.g. SN-8921"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-800/20 focus:border-pink-800 dark:focus:border-pink-500 transition-all"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Subject / Category
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-800/20 focus:border-pink-800 dark:focus:border-pink-500 transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Order Status & Delivery">Order Status & Delivery</option>
                  <option value="Return / Exchange / Refund">Return / Exchange / Refund</option>
                  <option value="Product Authenticity & Ingredients">Product Authenticity & Ingredients</option>
                  <option value="Corporate / Bulk Purchases">Corporate / Bulk Purchases</option>
                  <option value="Feedback / Suggestions">Feedback / Suggestions</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  Your Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us how we can help you today..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-pink-800/20 focus:border-pink-800 dark:focus:border-pink-500 transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f51372] to-[#e90068] px-8 py-3 text-sm font-bold text-white shadow-[0_7px_18px_rgba(233,0,104,0.2)] transition-all hover:brightness-105 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
              >
                {isSubmitting ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"/>Sending Message…</> : <><Send size={16} />Send Message</>}
              </button>
            </form>
          </div>

          {/* Right: Office Hours & Fast Support Channels (5 cols) */}
          <div className="space-y-4 lg:col-span-5">
            {/* Business Hours Card */}
            <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-[0_6px_24px_rgba(70,20,45,0.045)] dark:border-gray-800 dark:bg-[#111622] sm:p-7">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={20} className="text-pink-800 dark:text-pink-400" />
                <h3 className="text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white">Operating Hours</h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-['Inter']">
                <li className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="font-medium text-gray-800 dark:text-gray-200">Online Store & Orders</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Open 24/7</span>
                </li>
                <li className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="font-medium text-gray-800 dark:text-gray-200">Phone Support Hotline</span>
                  <span>9:00 AM – 10:00 PM</span>
                </li>
                <li className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-800">
                  <span className="font-medium text-gray-800 dark:text-gray-200">WhatsApp & Messenger Chat</span>
                  <span>8:00 AM – 11:00 PM</span>
                </li>
                <li className="flex justify-between items-center py-1.5">
                  <span className="font-medium text-gray-800 dark:text-gray-200">Showroom / Experience Center</span>
                  <span>10:00 AM – 9:00 PM</span>
                </li>
              </ul>
            </div>

            {/* Direct Connect Box */}
            <div className="rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50/80 via-white to-rose-50/40 p-6 dark:from-[#1A121A] dark:via-[#111622] dark:to-[#181C28] dark:border-gray-800 sm:p-7">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-pink-800 dark:text-pink-400" />
                <h3 className="text-base font-bold font-['Faustina'] text-gray-900 dark:text-white">Prefer Instant Messaging?</h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 leading-relaxed font-['Inter']">
                Connect with our expert beauty consultants directly on your favorite messaging app for fast personalized advice.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 font-['Inter']">
                <a
                  href="https://wa.me/8801712345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <FaWhatsapp size={16} />
                  WhatsApp
                </a>
                <a
                  href="https://m.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <FaFacebookMessenger size={16} />
                  Messenger
                </a>
              </div>
            </div>

            {/* Satisfaction Guarantee Notice */}
            <div className="flex items-start gap-3 rounded-3xl border border-pink-100 bg-gradient-to-br from-white to-pink-50/60 p-6 shadow-[0_6px_24px_rgba(70,20,45,0.045)] dark:border-gray-800 dark:from-[#111622] dark:to-[#181C28]">
              <CheckCircle2 size={22} className="text-pink-800 dark:text-pink-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold font-['Faustina'] text-gray-900 dark:text-white">100% Genuine Care</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed font-['Inter']">
                  Every inquiry is handled by trained skincare and customer service specialists based right here in Dhaka.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="mb-12 rounded-3xl border border-pink-100 bg-white p-6 shadow-[0_6px_24px_rgba(70,20,45,0.045)] dark:border-gray-800 dark:bg-[#111622] sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-300 mb-2 border border-pink-200/60 dark:border-pink-900/40 font-['Inter']">
              <HelpCircle size={13} />
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Faustina'] text-gray-900 dark:text-white">
              Quick Answers to Common Questions
            </h2>
          </div>

          <div className="mx-auto max-w-5xl space-y-2 font-['Inter']">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.question} className="rounded-xl border border-pink-100 px-4 py-1 dark:border-gray-800">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 py-3 text-left text-sm font-semibold text-gray-900 transition-colors hover:text-[#A20E4C] dark:text-white dark:hover:text-pink-400 sm:text-base"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`text-gray-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-pink-800 dark:text-pink-400" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed pr-6">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
