import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Sparkles,
  Zap,
  Gift,
  Heart,
  TrendingUp,
  GraduationCap,
  ChevronRight,
  Send,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  CAREER_JOB_POSITIONS as JOBS,
  CAREER_PERKS,
  CAREER_DEPARTMENTS,
  CareerJobPosition,
} from "@/data/shopData";

const PERK_ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp,
  Gift,
  Zap,
  GraduationCap,
  Heart,
  Sparkles,
  HeartPulse: Heart,
  Clock: Zap,
};

const Career: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [selectedJob, setSelectedJob] = useState<CareerJobPosition | null>(null);
  const [applicationData, setApplicationData] = useState({
    fullName: "",
    email: "",
    phone: "",
    portfolio: "",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = CAREER_DEPARTMENTS;

  const filteredJobs =
    selectedDept === "All"
      ? JOBS
      : JOBS.filter((job) => job.department.toLowerCase() === selectedDept.toLowerCase());

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationData.fullName || !applicationData.email || !applicationData.phone) {
      toast.error("Please fill in your name, email, and phone number.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        `Application submitted for ${selectedJob?.title}! Our HR team will review your profile.`
      );
      setSelectedJob(null);
      setApplicationData({
        fullName: "",
        email: "",
        phone: "",
        portfolio: "",
        note: "",
      });
    }, 1000);
  };

  return (
    <div className="bg-[#fdfbf9] dark:bg-[#090D14] min-h-screen py-8 sm:py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/" className="hover:text-pink-800 dark:hover:text-[#FF4D82] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-800 dark:text-gray-200 font-semibold">Career</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-[#FF4D82] border border-pink-200/60 dark:border-pink-900/50 mb-3">
            <Sparkles size={13} />
            JOIN THE KC BAZAR TEAM
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Faustina'] text-gray-900 dark:text-white tracking-tight">
            Build the Future of E-Commerce with <span className="text-pink-800 dark:text-[#FF4D82] italic">KC Bazar</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            We are passionate creators, skincare enthusiasts, and tech innovators transforming how Bangladesh shops for authentic beauty and lifestyle products. Come do your best work with us!
          </p>
        </div>

        {/* Why Work With Us Perks */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold font-['Faustina'] text-gray-900 dark:text-white">
              Why You’ll Love Working at KC Bazar
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              We invest deeply in our people with an empowering culture and real benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAREER_PERKS.map((perk) => {
              const Icon = PERK_ICON_MAP[perk.iconName] || Sparkles;
              return (
                <div
                  key={perk.title}
                  className="bg-white dark:bg-[#111622] rounded-2xl p-6 border border-pink-100/80 dark:border-gray-800 shadow-xs hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-[#FF4D82] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{perk.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{perk.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Open Positions Section */}
        <div id="openings" className="bg-white dark:bg-[#111622] rounded-3xl p-6 sm:p-10 border border-pink-100/80 dark:border-gray-800 shadow-xs mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-pink-800 dark:text-[#FF4D82] uppercase tracking-wider">
                WE’RE HIRING
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Faustina'] text-gray-900 dark:text-white mt-1">
                Open Career Opportunities
              </h2>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Showing {filteredJobs.length} open position{filteredJobs.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDept === dept
                    ? "bg-pink-800 dark:bg-pink-700 text-white shadow-xs"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-pink-300 dark:hover:border-pink-900/60 bg-gray-50/40 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-[#151c2c] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-[#FF4D82]">
                      {job.department}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-200/80 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {job.type}
                    </span>
                    <span className="text-xs text-gray-400">• Exp: {job.experience}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold font-['Faustina'] text-gray-900 dark:text-white">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} /> {job.location}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed pt-1">
                    {job.description}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-3 pt-2 md:pt-0">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-pink-800 hover:bg-pink-900 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Apply Now <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* General Application Callout */}
          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-pink-50 dark:from-pink-950/30 via-white dark:via-[#111622] to-amber-50/50 dark:to-amber-950/20 border border-pink-200 dark:border-pink-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                Don’t see a role that fits your background?
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                We are always looking for exceptional talent in customer care, marketing, and logistics.
              </p>
            </div>
            <a
              href="mailto:careers@kcbazar.com.bd?subject=General%20Application%20-%20KC%20Bazar"
              className="shrink-0 px-5 py-2.5 rounded-xl bg-pink-800 hover:bg-pink-900 text-white text-xs font-bold transition-all shadow-xs"
            >
              Send Resume to careers@kcbazar.com.bd
            </a>
          </div>
        </div>

        {/* Application Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111622] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-pink-100/80 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <span className="text-[10px] font-bold text-pink-800 dark:text-[#FF4D82] bg-pink-50 dark:bg-pink-950/40 px-2.5 py-1 rounded-full uppercase">
                  {selectedJob.department}
                </span>
                <h3 className="text-xl font-bold font-['Faustina'] text-gray-900 dark:text-white mt-2">
                  Apply for {selectedJob.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                  <MapPin size={12} /> {selectedJob.location} • {selectedJob.type}
                </p>
              </div>

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Full Name <span className="text-pink-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={applicationData.fullName}
                    onChange={(e) =>
                      setApplicationData({ ...applicationData, fullName: e.target.value })
                    }
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-800/20 focus:border-pink-800 outline-hidden transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                      Email <span className="text-pink-600">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={applicationData.email}
                      onChange={(e) =>
                        setApplicationData({ ...applicationData, email: e.target.value })
                      }
                      placeholder="tanvir@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-800/20 focus:border-pink-800 outline-hidden transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                      Phone <span className="text-pink-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={applicationData.phone}
                      onChange={(e) =>
                        setApplicationData({ ...applicationData, phone: e.target.value })
                      }
                      placeholder="01711-XXXXXX"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-800/20 focus:border-pink-800 outline-hidden transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    LinkedIn or Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={applicationData.portfolio}
                    onChange={(e) =>
                      setApplicationData({ ...applicationData, portfolio: e.target.value })
                    }
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-800/20 focus:border-pink-800 outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Brief Note / Why You'd Excel
                  </label>
                  <textarea
                    rows={3}
                    value={applicationData.note}
                    onChange={(e) =>
                      setApplicationData({ ...applicationData, note: e.target.value })
                    }
                    placeholder="Tell us about your relevant experience..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-pink-800/20 focus:border-pink-800 outline-hidden transition-colors"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-pink-800 hover:bg-pink-900 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60 transition-colors"
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send size={14} /> Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Career;
