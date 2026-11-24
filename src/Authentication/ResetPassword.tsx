// src/pages/ResetPassword.tsx
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Check,
  X,
  Key,
} from "lucide-react";
import { toast } from "sonner";
import authPhoto from "@/assets/photo/signup.svg";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password requirements assessment
  const checks = useMemo(() => {
    return {
      length: password.length >= 8,
      caseMix: /[a-z]/.test(password) && /[A-Z]/.test(password),
      hasNumberOrSymbol: /[\d\W]/.test(password),
      matches: password.length > 0 && password === confirmPassword,
    };
  }, [password, confirmPassword]);

  // Overall strength score 0 to 3
  const strengthScore = useMemo(() => {
    let score = 0;
    if (checks.length) score++;
    if (checks.caseMix) score++;
    if (checks.hasNumberOrSymbol) score++;
    return score;
  }, [checks]);

  const strengthMeta = [
    { label: "Too Weak", color: "bg-red-500", text: "text-red-500" },
    { label: "Fair", color: "bg-amber-500", text: "text-amber-500" },
    { label: "Good", color: "bg-blue-500", text: "text-blue-500" },
    { label: "Strong & Secure", color: "bg-emerald-500", text: "text-emerald-500" },
  ][strengthScore];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!checks.length) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (!checks.caseMix || !checks.hasNumberOrSymbol) {
      toast.error("Please meet all password complexity requirements.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      toast.success("Password reset successful!", {
        description: "Your new password is now active.",
      });

      // Clear auth recovery session flags
      sessionStorage.removeItem("auth_reset_identifier");
      sessionStorage.removeItem("auth_reset_method");
      sessionStorage.removeItem("auth_otp_verified");

      // Auto redirect after 3s
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }, 600);
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
              <span>SHOB Now • Complete Security</span>
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold font-['Faustina'] leading-tight mt-4 text-white">
              Create New <br />
              <span className="text-pink-200 italic">Password.</span>
            </h1>
            <p className="text-pink-100/80 text-xs sm:text-sm mt-2 font-['Inter'] leading-relaxed max-w-sm">
              Your new password should be unique, strong, and different from previously used passwords.
            </p>
          </div>

          {/* Illustration Container */}
          <div className="relative z-10 my-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner flex items-center justify-center">
            <img
              src={authPhoto}
              alt="Password reset visual"
              className="max-h-52 w-auto object-contain drop-shadow-md"
            />
          </div>

          {/* Trust Highlights */}
          <div className="relative z-10 pt-4 border-t border-white/15 grid grid-cols-3 gap-2 text-center text-[11px] font-['Inter'] text-pink-100/90">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck size={16} className="text-pink-200" />
              <span>Argon2 Security</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Truck size={16} className="text-pink-200" />
              <span>Zero-Downtime</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CheckCircle2 size={16} className="text-pink-200" />
              <span>Instant Activation</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form or Success State */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center bg-white dark:bg-[#111622] transition-colors duration-200">
          {isSuccess ? (
            /* Success State */
            <div className="text-center py-8 space-y-5">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border-4 border-emerald-200 dark:border-emerald-800 shadow-md animate-bounce">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold font-['Faustina'] text-zinc-900 dark:text-white">
                  Password Updated!
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 max-w-sm mx-auto font-['Inter']">
                  Your password has been successfully reset. You can now use your new credentials to sign in.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full bg-[#FFE2FF] hover:bg-[#ffd1ff] text-[#500624] font-bold py-3.5 rounded-xl transition-all duration-200 cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Proceed to Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                Automatically redirecting in 3 seconds...
              </p>
            </div>
          ) : (
            /* Reset Form */
            <>
              <div className="mb-6 text-center md:text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wider text-pink-800 dark:text-pink-300 uppercase bg-pink-50 dark:bg-pink-950/40 rounded-full border border-pink-200/60 dark:border-pink-900/50 mb-2">
                  <Key size={13} />
                  <span>Step 3 of 3 • Set New Password</span>
                </span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-['Faustina'] font-bold tracking-tight text-zinc-900 dark:text-white">
                  Set New Password
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1 font-['Inter']">
                  Must be at least 8 characters with a mix of letters & numbers.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password Field */}
                <div className="flex flex-col">
                  <label
                    htmlFor="password"
                    className="text-zinc-800 dark:text-gray-200 text-xs sm:text-sm font-semibold mb-1.5 flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-pink-800 dark:text-pink-400" />
                    <span>New Password</span>
                  </label>

                  <div className="relative w-full">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-50/80 dark:bg-gray-800/60 text-zinc-900 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-gray-700 focus:border-pink-800 dark:focus:border-pink-500 focus:ring-2 focus:ring-pink-800/20 outline-none transition text-sm shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 hover:text-pink-800 dark:hover:text-pink-400 transition-colors duration-200 focus:outline-none cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password Field */}
                <div className="flex flex-col">
                  <label
                    htmlFor="confirmPassword"
                    className="text-zinc-800 dark:text-gray-200 text-xs sm:text-sm font-semibold mb-1.5 flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-pink-800 dark:text-pink-400" />
                    <span>Confirm New Password</span>
                  </label>

                  <div className="relative w-full">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-50/80 dark:bg-gray-800/60 text-zinc-900 dark:text-white placeholder-gray-400 border border-gray-200 dark:border-gray-700 focus:border-pink-800 dark:focus:border-pink-500 focus:ring-2 focus:ring-pink-800/20 outline-none transition text-sm shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 hover:text-pink-800 dark:hover:text-pink-400 transition-colors duration-200 focus:outline-none cursor-pointer"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Password Strength Meter */}
                {password.length > 0 && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200/70 dark:border-gray-700/60 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-gray-500 dark:text-gray-400">Password Strength:</span>
                      <span className={strengthMeta.text}>{strengthMeta.label}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 h-1.5">
                      <div className={`h-full rounded-full transition-all ${strengthScore >= 1 ? strengthMeta.color : "bg-gray-200 dark:bg-gray-700"}`} />
                      <div className={`h-full rounded-full transition-all ${strengthScore >= 2 ? strengthMeta.color : "bg-gray-200 dark:bg-gray-700"}`} />
                      <div className={`h-full rounded-full transition-all ${strengthScore >= 3 ? strengthMeta.color : "bg-gray-200 dark:bg-gray-700"}`} />
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px] font-['Inter']">
                      <div className={`flex items-center gap-1.5 ${checks.length ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-gray-400 dark:text-gray-500"}`}>
                        {checks.length ? <Check size={12} /> : <X size={12} />}
                        <span>8+ characters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${checks.caseMix ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-gray-400 dark:text-gray-500"}`}>
                        {checks.caseMix ? <Check size={12} /> : <X size={12} />}
                        <span>Uppercase & lowercase</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${checks.hasNumberOrSymbol ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-gray-400 dark:text-gray-500"}`}>
                        {checks.hasNumberOrSymbol ? <Check size={12} /> : <X size={12} />}
                        <span>Number or symbol</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${checks.matches ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-gray-400 dark:text-gray-500"}`}>
                        {checks.matches ? <Check size={12} /> : <X size={12} />}
                        <span>Passwords match</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !checks.length || password !== confirmPassword}
                  className="w-full bg-[#FFE2FF] hover:bg-[#ffd1ff] text-[#500624] font-bold py-3 sm:py-3.5 rounded-xl transition-all duration-200 cursor-pointer shadow-xs flex items-center justify-center gap-2 mt-2 disabled:opacity-60 active:scale-[0.99]"
                >
                  <Check className="w-4 h-4" />
                  <span>{isLoading ? "Updating Password..." : "Update Password"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Navigation Back */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 text-xs sm:text-sm font-['Inter']">
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-400 hover:text-pink-800 dark:hover:text-pink-300 font-medium transition-colors"
                >
                  Cancel & Return to Login
                </Link>

                <Link
                  to="/forgot-password"
                  className="text-pink-800 dark:text-pink-400 hover:underline font-semibold"
                >
                  Restart Verification
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

