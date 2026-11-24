// src/pages/VerifyCode.tsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Truck,
  RotateCcw,
  Check,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import authPhoto from "@/assets/photo/signup.svg";

const VerifyCode = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("email");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load identifier from previous step or default
  useEffect(() => {
    const saved = sessionStorage.getItem("auth_reset_identifier") || "ayesha.r@gmail.com";
    const method = sessionStorage.getItem("auth_reset_method") || "email";
    setIdentifier(saved);
    setDeliveryMethod(method);
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Mask identifier for visual privacy (e.g. ay***r@gmail.com)
  const maskedIdentifier = () => {
    if (!identifier) return "your account";
    if (identifier.includes("@")) {
      const [name, domain] = identifier.split("@");
      if (name.length <= 3) return `${name[0]}***@${domain}`;
      return `${name.slice(0, 2)}***${name.slice(-1)}@${domain}`;
    }
    return identifier.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2");
  };

  // Handle single digit input
  const handleChange = (index: number, value: string) => {
    // Only numbers
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue && value !== "") return;

    const newOtp = [...otp];
    newOtp[index] = cleanValue.slice(-1);
    setOtp(newOtp);

    // Auto-advance
    if (cleanValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste full code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  // Resend code handler
  const handleResend = () => {
    if (!canResend) return;
    setCountdown(59);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();

    toast.success("New verification code dispatched!", {
      description: `A fresh 6-digit OTP was sent to ${identifier}.`,
    });
  };

  // Submit code
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    setIsLoading(true);
    sessionStorage.setItem("auth_otp_verified", "true");

    toast.success("Identity verified successfully!", {
      description: "Now choose a strong new password.",
    });

    setTimeout(() => {
      setIsLoading(false);
      navigate("/reset-password");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#090D14] flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      <div className="max-w-5xl w-full flex flex-col md:flex-row overflow-hidden rounded-3xl bg-white dark:bg-[#111622] border border-pink-100/80 dark:border-gray-800 shadow-[0_20px_60px_-15px_rgba(162,14,76,0.08)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
        {/* Left Side - Luxury Brand Banner */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#A20E4C] via-[#7E0B3B] to-[#4A0623] p-8 lg:p-10 text-white relative overflow-hidden flex-col justify-between">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-rose-300/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Tagline */}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wider uppercase border border-white/20">
              <Sparkles size={13} className="text-pink-200" />
              <span>SHOB Now • Two-Factor Security</span>
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold font-['Faustina'] leading-tight mt-4 text-white">
              Verify Your <br />
              <span className="text-pink-200 italic">Identity.</span>
            </h1>
            <p className="text-pink-100/80 text-xs sm:text-sm mt-2 font-['Inter'] leading-relaxed max-w-sm">
              We just delivered a 6-digit confirmation code. Please enter it below to confirm account ownership.
            </p>
          </div>

          {/* Illustration Container */}
          <div className="relative z-10 my-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner flex items-center justify-center">
            <img
              src={authPhoto}
              alt="Verification visual"
              className="max-h-52 w-auto object-contain drop-shadow-md"
            />
          </div>

          {/* Trust Highlights */}
          <div className="relative z-10 pt-4 border-t border-white/15 grid grid-cols-3 gap-2 text-center text-[11px] font-['Inter'] text-pink-100/90">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck size={16} className="text-pink-200" />
              <span>Anti-Fraud Check</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Truck size={16} className="text-pink-200" />
              <span>Immediate Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CheckCircle2 size={16} className="text-pink-200" />
              <span>Session Secured</span>
            </div>
          </div>
        </div>

        {/* Right Side - Code Input Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center bg-white dark:bg-[#111622] transition-colors duration-200">
          <div className="mb-6 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wider text-pink-800 dark:text-pink-300 uppercase bg-pink-50 dark:bg-pink-950/40 rounded-full border border-pink-200/60 dark:border-pink-900/50 mb-2">
              <Lock size={13} />
              <span>Step 2 of 3 • Authenticate</span>
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-['Faustina'] font-bold tracking-tight text-zinc-900 dark:text-white">
              Enter 6-Digit Code
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1 font-['Inter']">
              Sent to <span className="font-semibold text-zinc-800 dark:text-zinc-200">{maskedIdentifier()}</span> (
              {deliveryMethod === "email" ? "Email" : "SMS"}).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 6 Digit Input Boxes */}
            <div className="flex justify-between gap-2 sm:gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl bg-gray-50/80 dark:bg-gray-800/60 text-zinc-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:border-pink-800 dark:focus:border-pink-500 focus:ring-2 focus:ring-pink-800/20 outline-none transition shadow-2xs"
                  aria-label={`Digit ${idx + 1}`}
                />
              ))}
            </div>

            {/* Countdown / Resend Section */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-['Inter']">
              <span className="text-gray-500 dark:text-gray-400">
                Didn't receive code?
              </span>

              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="inline-flex items-center gap-1.5 text-pink-800 dark:text-pink-400 font-bold hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Resend Code</span>
                </button>
              ) : (
                <span className="text-gray-400 dark:text-gray-500 font-medium font-mono">
                  Resend in 00:{countdown.toString().padStart(2, "0")}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || otp.join("").length < 6}
              className="w-full bg-[#FFE2FF] hover:bg-[#ffd1ff] text-[#500624] font-bold py-3 sm:py-3.5 rounded-xl transition-all duration-200 cursor-pointer shadow-xs flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99]"
            >
              <Check className="w-4 h-4" />
              <span>{isLoading ? "Verifying..." : "Verify & Proceed"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Pre-fill */}
          <div className="mt-5 p-3 rounded-xl bg-pink-50/60 dark:bg-pink-950/20 border border-pink-200/50 dark:border-pink-900/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-pink-900 dark:text-pink-300 uppercase tracking-wider">
                🧪 Instant Test Code:
              </span>
              <button
                type="button"
                onClick={() => setOtp(["1", "2", "3", "4", "5", "6"])}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 text-pink-800 dark:text-pink-300 border border-pink-200 dark:border-pink-800 hover:bg-pink-100/50 cursor-pointer text-xs font-semibold"
              >
                Auto-fill 123456
              </button>
            </div>
          </div>

          {/* Navigation Back */}
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 text-xs sm:text-sm font-['Inter']">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-pink-800 dark:hover:text-pink-300 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Change Address / Phone</span>
            </Link>

            <Link
              to="/login"
              className="text-gray-500 hover:text-pink-800 dark:text-gray-400 dark:hover:text-pink-300"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;

