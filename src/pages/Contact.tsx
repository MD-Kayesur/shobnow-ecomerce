import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa6";
import { toast } from "sonner";
import { CONTACT_FAQS as FAQS } from "@/data/shopData";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderId: "",
    subject: "General Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields (Name, Email, Message)");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        "Thank you! Your message has been sent. Our team will contact you within 2-4 hours."
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        orderId: "",
        subject: "General Inquiry",
        message: "",
      });
    }, 900);
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
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-300 mb-3 border border-pink-200/60 dark:border-pink-900/40">
            <Sparkles size={13} />
            WE'RE HERE TO HELP
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Faustina'] text-gray-900 dark:text-white tracking-tight">
            Get in Touch with <span className="text-pink-800 dark:text-[#FF4D82] italic">SHOB Now</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-['Inter']">
            Have questions about your order, product authenticity, or personalized beauty recommendations? Our friendly support team is ready to assist you 7 days a week.
          </p>
        </div>

        {/* 4 Contact Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {/* Card 1: Phone Hotline */}
          <div className="bg-white dark:bg-[#111622] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Phone size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Customer Support Hotline</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Daily: 9:00 AM – 10:00 PM</p>
            <a
              href="tel:+8809612345678"
              className="text-sm font-semibold text-pink-800 dark:text-pink-400 hover:text-pink-900 dark:hover:text-pink-300 flex items-center gap-1"
            >
              +880 9612-345678
            </a>
          </div>

          {/* Card 2: WhatsApp Chat */}
          <div className="bg-white dark:bg-[#111622] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaWhatsapp size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">WhatsApp Live Chat</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Instant answers & order updates</p>
            <a
              href="https://wa.me/8801712345678"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
            >
              Chat on WhatsApp <ExternalLink size={13} />
            </a>
          </div>

          {/* Card 3: Email Support */}
          <div className="bg-white dark:bg-[#111622] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Email Support</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Average response time: 2 hours</p>
            <a
              href="mailto:support@shownow.com.bd"
              className="text-sm font-semibold text-pink-800 dark:text-pink-400 hover:text-pink-900 dark:hover:text-pink-300 flex items-center gap-1"
            >
              support@shownow.com.bd
            </a>
          </div>

          {/* Card 4: Corporate Office */}
          <div className="bg-white dark:bg-[#111622] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MapPin size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Corporate Flagship</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">House 42, Road 11, Block D, Banani</p>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Dhaka-1213, Bangladesh</span>
          </div>
        </div>

        {/* Main Grid: Contact Form + Location / Hours Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#111622] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-xs">
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
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#FFE2FF] hover:bg-[#ffd1ff] text-[#500624] text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Office Hours & Fast Support Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Business Hours Card */}
            <div className="bg-white dark:bg-[#111622] rounded-3xl p-6 sm:p-7 border border-gray-100 dark:border-gray-800 shadow-xs">
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
            <div className="bg-gradient-to-br from-pink-50/70 via-white to-rose-50/30 dark:from-[#1A121A] dark:via-[#111622] dark:to-[#181C28] rounded-3xl p-6 sm:p-7 border border-pink-100 dark:border-gray-800">
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
            <div className="bg-white dark:bg-[#111622] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-xs flex items-start gap-3">
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
        <div className="bg-white dark:bg-[#111622] rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-gray-800 shadow-xs mb-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-300 mb-2 border border-pink-200/60 dark:border-pink-900/40 font-['Inter']">
              <HelpCircle size={13} />
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Faustina'] text-gray-900 dark:text-white">
              Quick Answers to Common Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-gray-100 dark:divide-gray-800 font-['Inter']">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.question} className="py-4">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left gap-4 font-semibold text-gray-900 dark:text-white text-sm sm:text-base hover:text-pink-800 dark:hover:text-pink-400 transition-colors cursor-pointer"
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
