import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";
import "./ForgotPassword.css";

const OTP_LIFETIME_MS = 10 * 60 * 1000;

const getErrorMessage = (error: unknown) => {
  const apiError = error as { data?: { message?: string | string[] }; error?: string };
  const message = apiError?.data?.message ?? apiError?.error ?? "We could not send the reset code. Please try again.";
  return Array.isArray(message) ? message.join(" ") : message;
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [requestReset, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    try {
      const response = await requestReset({ email: normalizedEmail }).unwrap();

      // The API intentionally responds generically so it does not reveal whether an email is registered.
      sessionStorage.setItem("auth_reset_identifier", normalizedEmail);
      sessionStorage.setItem("auth_reset_method", "email");
      sessionStorage.setItem("auth_otp_type", "PASSWORD_RESET");
      sessionStorage.setItem("auth_otp_expires_at", String(Date.now() + OTP_LIFETIME_MS));
      sessionStorage.setItem("auth_otp_resend_at", String(Date.now() + OTP_LIFETIME_MS));
      sessionStorage.removeItem("auth_otp_challenge_id");
      sessionStorage.removeItem("auth_password_reset_token");

      toast.success(response.message || "If an account exists for this email, a reset code has been sent.");
      navigate("/verify-otp");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <main className="forgot-page">
      <section className="forgot-card" aria-labelledby="forgot-title">
        <Link to="/login" className="forgot-back-link">
          <ArrowLeft aria-hidden="true" />
          Back to sign in
        </Link>

        <Link to="/" className="forgot-brand" aria-label="Shop Now home">
          <img src="/Glossy%20Pink%20Shopping%20Arrow%20Logo.png" alt="Shop Now" />
        </Link>

        <div className="forgot-heading">
          <span className="forgot-eyebrow">ACCOUNT RECOVERY</span>
          <h1 id="forgot-title">Forgot your password?</h1>
          <p>Enter the email address linked to your account. If it is registered, we’ll send you a secure 6-digit reset code.</p>
        </div>

        <form className="forgot-form" onSubmit={handleSubmit}>
          <label htmlFor="recovery-email">Email address</label>
          <div className="forgot-input-wrap">
            <Mail aria-hidden="true" />
            <input
              id="recovery-email"
              type="email"
              autoComplete="email"
              autoFocus
              required
              maxLength={254}
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <p className="forgot-privacy-note">For your security, we’ll show the same confirmation whether or not the address has an account.</p>

          <button type="submit" className="forgot-submit" disabled={isLoading} aria-busy={isLoading}>
            {isLoading ? <span className="forgot-spinner" aria-hidden="true" /> : <span>Send reset code</span>}
            {isLoading ? <span>Sending…</span> : <ArrowRight aria-hidden="true" />}
          </button>
        </form>

        <p className="forgot-footer">
          Remember your password? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
};

export default ForgotPassword;
