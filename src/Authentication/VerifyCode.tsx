// src/pages/VerifyCode.tsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import authPhoto from "@/assets/photo/signup.svg";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import { setUser } from "@/redux/features/auth/authSlice";
import { OtpType } from "@/redux/types/auth.type";
import { useResendOtpMutation, useVerifyOtpMutation } from "@/redux/features/auth/authApi";
import "./VerifyCode.css";

const getOtpErrorMessage = (error: unknown) => {
  const apiError = error as {
    data?: { message?: string | string[]; errors?: { message?: string }[] };
    error?: string;
  };
  const message =
    apiError?.data?.message ??
    apiError?.data?.errors?.[0]?.message ??
    apiError?.error ??
    "We could not verify that code. Please try again.";
  return Array.isArray(message) ? message.join(" ") : message;
};

const isInvalidOtpError = (error: unknown) => {
  const apiError = error as {
    data?: { error?: string; message?: string | string[] };
    error?: string;
  };
  const code = apiError?.data?.error?.toUpperCase();
  const rawMessage = apiError?.data?.message ?? apiError?.error ?? "";
  const message = Array.isArray(rawMessage) ? rawMessage.join(" ") : rawMessage;
  return code === "OTP_INVALID" || /invalid\s+(otp|code)|otp\s+is\s+invalid/i.test(message);
};

const OTP_VALIDITY_SECONDS = 10 * 60;
const RESEND_COOLDOWN_SECONDS = OTP_VALIDITY_SECONDS;

const VerifyCode = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [otpType, setOtpType] = useState<OtpType>("ACCOUNT_VERIFY");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN_SECONDS);
  const [otpExpiresIn, setOtpExpiresIn] = useState(OTP_VALIDITY_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [challengeId, setChallengeId] = useState("");
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Load the email and OTP purpose saved by registration or password recovery.
  useEffect(() => {
    const saved = sessionStorage.getItem("auth_reset_identifier") || "";
    const savedType = sessionStorage.getItem("auth_otp_type");
    setChallengeId(sessionStorage.getItem("auth_otp_challenge_id") || "");
    if (!saved) {
      navigate("/signup", { replace: true });
      return;
    }
    setIdentifier(saved);
    let expiresAt = Number(sessionStorage.getItem("auth_otp_expires_at"));
    if (!Number.isFinite(expiresAt) || expiresAt <= 0) {
      expiresAt = Date.now() + OTP_VALIDITY_SECONDS * 1000;
      sessionStorage.setItem("auth_otp_expires_at", String(expiresAt));
    }
    setOtpExpiresIn(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)));
    let resendAt = Number(sessionStorage.getItem("auth_otp_resend_at"));
    if (!Number.isFinite(resendAt) || resendAt < expiresAt) {
      resendAt = expiresAt;
      sessionStorage.setItem("auth_otp_resend_at", String(resendAt));
    }
    const resendRemaining = Math.max(0, Math.ceil((resendAt - Date.now()) / 1000));
    setCountdown(resendRemaining);
    setCanResend(resendRemaining === 0);
    if (savedType === "PASSWORD_RESET" || savedType === "LOGIN") {
      setOtpType(savedType);
    }
    inputRefs.current[0]?.focus();
  }, [navigate]);

  // Keep both timers anchored to absolute deadlines so refreshes do not reset them.
  useEffect(() => {
    const timer = setInterval(() => {
      const expiresAt = Number(sessionStorage.getItem("auth_otp_expires_at") || 0);
      const resendAt = Number(sessionStorage.getItem("auth_otp_resend_at") || 0);
      const expiryRemaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      const resendRemaining = Math.max(0, Math.ceil((resendAt - Date.now()) / 1000));
      setOtpExpiresIn(expiryRemaining);
      setCountdown(resendRemaining);
      setCanResend(resendRemaining === 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
  const handleResend = async () => {
    if (!canResend) return;
    try {
      await resendOtp({
        email: identifier,
        type: otpType,
        ...(otpType === "LOGIN" && challengeId ? { challengeId } : {}),
      }).unwrap();
      const resendAt = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;
      sessionStorage.setItem("auth_otp_resend_at", String(resendAt));
      setCountdown(RESEND_COOLDOWN_SECONDS);
      setCanResend(false);
      const expiresAt = Date.now() + OTP_VALIDITY_SECONDS * 1000;
      sessionStorage.setItem("auth_otp_expires_at", String(expiresAt));
      setOtpExpiresIn(OTP_VALIDITY_SECONDS);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      toast.success(`A new verification code was sent to ${maskedIdentifier()}.`);
    } catch (error: unknown) {
      const message = getOtpErrorMessage(error);
      toast.error(message);
    }
  };

  // Submit code
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    const expiresAt = Number(sessionStorage.getItem("auth_otp_expires_at") || 0);
    if (otpExpiresIn <= 0 || !expiresAt || Date.now() >= expiresAt) {
      setOtpExpiresIn(0);
      toast.error("This verification code has expired. Resend a new code to continue.");
      return;
    }
    if (code.length < 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    try {
      const result = await verifyOtp({
        email: identifier,
        code,
        type: otpType,
        ...(otpType === "LOGIN" && challengeId ? { challengeId } : {}),
      }).unwrap();
      if (otpType === "PASSWORD_RESET" && result.data && "resetToken" in result.data) {
        sessionStorage.setItem("auth_password_reset_token", result.data.resetToken);
        toast.success("Email verified. You can now set a new password.");
        navigate("/reset-password");
        return;
      }

      if (result.data && "accessToken" in result.data) {
        const normalizedUser = {
          ...result.data.user,
          role: String(result.data.user.role).toLowerCase() === "admin" ? "admin" as const : "user" as const,
        };
        dispatch(setUser({ user: normalizedUser, token: result.data.accessToken }));
        sessionStorage.removeItem("auth_reset_identifier");
        sessionStorage.removeItem("auth_reset_method");
        sessionStorage.removeItem("auth_otp_type");
        sessionStorage.removeItem("auth_otp_expires_at");
        sessionStorage.removeItem("auth_otp_resend_at");
        sessionStorage.removeItem("auth_otp_challenge_id");
        toast.success("Your email is verified. Welcome to Shop Now!");
        navigate(normalizedUser.role === "admin" ? "/admin-dashboard" : "/user-dashboard");
      }
    } catch (error: unknown) {
      if (isInvalidOtpError(error)) {
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
      toast.error(getOtpErrorMessage(error));
    }
  };

  const isLoading = isVerifying || isResending;
  const isPasswordRecovery = otpType === "PASSWORD_RESET";
  const returnPath = isPasswordRecovery
    ? "/forgot-password"
    : otpType === "ACCOUNT_VERIFY"
      ? "/signup"
      : "/login";
  const returnLabel = isPasswordRecovery
    ? "Back to Forgot Password"
    : otpType === "ACCOUNT_VERIFY"
      ? "Back to Register"
      : "Back to Login";
  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  return (
    <main className="verify-page">
      <section className="verify-card" aria-labelledby="verify-title">
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
        <div className="verify-form-panel">
          <div className="verify-heading">
            <img className="verify-logo" src="/Glossy%20Pink%20Shopping%20Arrow%20Logo.png" alt="Shop Now" />
            <h1 id="verify-title">{isPasswordRecovery ? "Password Reset" : "OTP Verification"}</h1>
            <p>
              {isPasswordRecovery
                ? "We've sent a 6-digit password reset code to your email address"
                : "We've sent a 6-digit code to your email address"}
            </p>
            <strong className="verify-address">{identifier || "you@example.com"}</strong>
          </div>

          <form onSubmit={handleSubmit} className="verify-form">
            {/* 6 Digit Input Boxes */}
            <div className="verify-code-inputs" role="group" aria-label="Six-digit verification code">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="password"
                  inputMode="numeric"
                  autoComplete={idx === 0 ? "one-time-code" : "off"}
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  disabled={otpExpiresIn <= 0}
                  className="verify-digit"
                  aria-label={`Code digit ${idx + 1}`}
                />
              ))}
            </div>

            {/* Countdown / Resend Section */}
            <div className="verify-resend-timer" aria-live="polite">

              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="verify-resend-button"
                >
                  <RotateCcw aria-hidden="true" />
                  <span>{isResending ? "Sending code…" : "Resend Code"}</span>
                </button>
              ) : (
                <>
                  <RotateCcw aria-hidden="true" />
                  <span>Resend Code</span>
                  <span className="verify-countdown">in {formatTime(countdown)}</span>
                </>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || otp.join("").length < 6 || otpExpiresIn <= 0}
              className="verify-submit"
              aria-busy={isVerifying}
            >
              <span>{isVerifying ? "Verifying…" : "Verify OTP"}</span>
              {isVerifying ? <LoaderCircle className="verify-spinner" /> : <ArrowRight aria-hidden="true" />}
            </button>
          </form>

          {/* Navigation Back */}
          <p className="verify-resend-prompt">
            Didn’t receive the code?{" "}
            {canResend ? (
              <button type="button" onClick={handleResend} disabled={isResending}>Resend Code</button>
            ) : (
              <span>Resend in {formatTime(countdown)}</span>
            )}
          </p>
          <nav className="verify-links" aria-label="Verification navigation">
            <Link to={returnPath}>
              <ArrowLeft aria-hidden="true" /> {returnLabel}
            </Link>
            {returnPath !== "/login" && <Link to="/login">Back to Login</Link>}
          </nav>
        </div>
      </section>
    </main>
  );
};

export default VerifyCode;

