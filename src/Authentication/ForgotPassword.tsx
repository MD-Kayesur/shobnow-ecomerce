// src/pages/ForgotPassword.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Truck,
  KeyRound,
  Send,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import authPhoto from "@/assets/photo/signup.svg";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "phone">("email");
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = identifier.trim();

    if (!value) {
      toast.error(
        deliveryMethod === "email"
          ? "Please enter your registered email address."
          : "Please enter your registered phone number."
      );
      return;
    }

    if (deliveryMethod === "email" && !/\S+@\S+\.\S+/.test(value)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    // Save identifier for verify code & reset password steps
    sessionStorage.setItem("auth_reset_identifier", value);
    sessionStorage.setItem("auth_reset_method", deliveryMethod);

    toast.success("Verification code sent!", {
      description: `A 6-digit OTP has been sent to ${value}.`,
    });

    setTimeout(() => {
      setIsLoading(false);
      navigate("/verify-code");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#090D14] flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      <div className="max-w-5xl w-full flex flex-col md:flex-row overflow-hidden rounded-3xl bg-white dark:bg-[#111622] border border-pink-100/80 dark:border-gray-800 shadow-[0_20px_60px_-15px_rgba(162,14,76,0.08)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
        {/* Left Side - Brand Banner */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#A20E4C] via-[#7E0B3B] to-[#4A0623] p-8 lg:p-10 text-white relative overflow-hidden flex-col justify-between">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-rose-300/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Tagline */}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wider uppercase border border-white/20">
              <Sparkles size={13} className="text-pink-200" />
              <span>SHOB Now • Account Recovery</span>
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold font-['Faustina'] leading-tight mt-4 text-white">
              Forgot Your <br />
              <span className="text-pink-200 italic">Password?</span>
            </h1>
            <p className="text-pink-100/80 text-xs sm:text-sm mt-2 font-['Inter'] leading-relaxed max-w-sm">
              Don’t worry! It happens. We’ll verify your identity with a secure 6-digit one-time passcode to get you back into your account.
            </p>
          </div>

          {/* Illustration Container */}
          <div className="relative z-10 my-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner flex items-center justify-center">
            <img
              src={authPhoto}
              alt="Password recovery illustration"
              className="max-h-52 w-auto object-contain drop-shadow-md"
            />
          </div>

          {/* Trust Highlights */}
          <div className="relative z-10 pt-4 border-t border-white/15 grid grid-cols-3 gap-2 text-center text-[11px] font-['Inter'] text-pink-100/90">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck size={16} className="text-pink-200" />
              <span>Instant Verification</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Truck size={16} className="text-pink-200" />
              <span>Fast Reset</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CheckCircle2 size={16} className="text-pink-200" />
              <span>100% Encrypted</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center bg-white dark:bg-[#111622] transition-colors duration-200">
          <div className="mb-6 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wider text-pink-800 dark:text-pink-300 uppercase bg-pink-50 dark:bg-pink-950/40 rounded-full border border-pink-200/60 dark:border-pink-900/50 mb-2">
              <KeyRound size={13} />
              <span>Step 1 of 3 • Identify</span>
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-['Faustina'] font-bold tracking-tight text-zinc-900 dark:text-white">
              Reset Password
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1 font-['Inter']">
              Select how you’d like to receive your verification code.
            </p>
          </div>

          {/* Recovery Channel Switcher */}
          <div className="mb-6">
            <label className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-2 block font-['Inter']">
              Recovery Channel:
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-2xl border border-gray-200/70 dark:border-gray-700">
              <button
                type="button"
                onClick={() => {
                  setDeliveryMethod("email");
                  setIdentifier("");
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  deliveryMethod === "email"
                    ? "bg-[#FFE2FF] text-[#500624] shadow-xs font-bold"
                    : "text-gray-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-gray-700/60"
                }`}
              >
                <Mail className="w-4 h-4 text-[#500624]" />
                <span>Via Email</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeliveryMethod("phone");
                  setIdentifier("");
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  deliveryMethod === "phone"
                    ? "bg-[#FFE2FF] text-[#500624] shadow-xs font-bold"
                    : "text-gray-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-gray-700/60"
                }`}
              >
                <Phone className="w-4 h-4 text-[#500624]" />
                <span>Via SMS</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dynamic Identifier Field */}
            <div className="flex flex-col">
              <label
                htmlFor="identifier"
                className="text-zinc-800 dark:text-gray-200 text-xs sm:text-sm font-semibold mb-1.5 flex items-center gap-2"
              >
                {deliveryMethod === "email" ? (
                  <>
                    <Mail className="w-4 h-4 text-pink-800 dark:text-pink-400" />
                    <span>Registered Email Address</span>
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4 text-pink-800 dark:text-pink-400" />
                    <span>Registered Phone Number (+880)</span>
                  </>
                )}
              </label>
              <input
                id="identifier"
                type={deliveryMethod === "email" ? "email" : "tel"}
                placeholder={
                  deliveryMethod === "email" ? "user@example.com" : "+880 1712-345678"
                }
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/60 text-zinc-900 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-gray-700 focus:border-pink-800 dark:focus:border-pink-500 focus:ring-2 focus:ring-pink-800/20 outline-none transition text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FFE2FF] hover:bg-[#ffd1ff] text-[#500624] font-bold py-3 sm:py-3.5 rounded-xl transition-all duration-200 cursor-pointer shadow-xs flex items-center justify-center gap-2 mt-2 disabled:opacity-60 active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              <span>{isLoading ? "Sending OTP Code..." : "Send Verification Code"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Pre-fills */}
          <div className="mt-5 p-3 rounded-xl bg-pink-50/60 dark:bg-pink-950/20 border border-pink-200/50 dark:border-pink-900/40">
            <p className="text-[11px] font-semibold text-pink-900 dark:text-pink-300 uppercase tracking-wider mb-1.5">
              💡 Quick Testing Shortcut:
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setDeliveryMethod("email");
                  setIdentifier("ayesha.r@gmail.com");
                }}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 text-pink-800 dark:text-pink-300 border border-pink-200 dark:border-pink-800 hover:bg-pink-100/50 cursor-pointer"
              >
                Use User: ayesha.r@gmail.com
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeliveryMethod("email");
                  setIdentifier("admin@shopnow.com");
                }}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 text-pink-800 dark:text-pink-300 border border-pink-200 dark:border-pink-800 hover:bg-pink-100/50 cursor-pointer"
              >
                Use Admin: admin@shopnow.com
              </button>
            </div>
          </div>

          {/* Navigation Back */}
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 text-xs sm:text-sm font-['Inter']">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-pink-800 dark:hover:text-pink-300 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>

            <p className="text-gray-500 dark:text-gray-400">
              Need an account?{" "}
              <Link
                to="/signup"
                className="text-pink-800 dark:text-pink-400 hover:underline font-semibold"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

