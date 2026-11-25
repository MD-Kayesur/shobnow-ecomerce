import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, LoaderCircle, Mail, Phone, User as UserIcon } from "lucide-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaTiktok } from "react-icons/fa";
import { toast } from "sonner";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import "./Signup.css";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [formError, setFormError] = useState("");
  const [registerUser, { isLoading }] = useRegisterMutation();

  const passwordChecks = {
    length: password.length >= 8,
    mixedCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[^A-Za-z0-9\s]/.test(password),
  };
  const passwordStrong = Object.values(passwordChecks).every(Boolean);
  const emailFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setEmailTouched(true);
    if (!emailFormatValid) {
      const message = "Enter a valid email address, for example name@example.com.";
      setFormError(message);
      toast.error(message);
      return;
    }
    if (password !== retypePassword) {
      setFormError("Your passwords do not match. Please check both fields.");
      toast.error("Passwords do not match.");
      return;
    }
    if (!passwordStrong) {
      const message = "Use at least 8 characters with uppercase and lowercase letters, a number, and a symbol.";
      setFormError(message);
      toast.error(message);
      return;
    }
    if (!agreeTerms) {
      toast.error("Please agree to the Terms & Privacy Policy.");
      return;
    }

    try {
      const normalizedPhone = phone.replace(/[\s()-]/g, "");
      if (normalizedPhone && !/^(?:01[3-9]\d{8}|\+?8801[3-9]\d{8})$/.test(normalizedPhone)) {
        const message = "Enter a valid Bangladesh mobile number, or leave the optional phone field blank.";
        setFormError(message);
        toast.error(message);
        return;
      }
      await registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword: retypePassword,
        ...(normalizedPhone ? { phoneNumber: normalizedPhone } : {}),
      }).unwrap();

      sessionStorage.setItem("auth_reset_identifier", email.trim().toLowerCase());
      sessionStorage.setItem("auth_reset_method", "email");
      sessionStorage.setItem("auth_otp_type", "ACCOUNT_VERIFY");
      sessionStorage.setItem("auth_otp_expires_at", String(Date.now() + 10 * 60 * 1000));
      sessionStorage.setItem("auth_otp_resend_at", String(Date.now() + 10 * 60 * 1000));
      toast.success("Account created. Check your email for the verification code.");
      navigate("/verify-otp");
    } catch (error: unknown) {
      const apiError = error as {
        data?: { message?: string | string[]; error?: string; errors?: { message?: string }[] };
        error?: string;
      };
      const message = apiError?.data?.message ?? apiError?.data?.errors?.[0]?.message ?? apiError?.error ??
        "We could not create your account. Please check your connection and try again.";
      if (apiError?.data?.error === "ACCOUNT_PENDING_VERIFICATION") {
        sessionStorage.setItem("auth_reset_identifier", email.trim().toLowerCase());
        sessionStorage.setItem("auth_reset_method", "email");
        sessionStorage.setItem("auth_otp_type", "ACCOUNT_VERIFY");
        sessionStorage.setItem("auth_otp_expires_at", String(Date.now() + 10 * 60 * 1000));
        sessionStorage.setItem("auth_otp_resend_at", String(Date.now() + 10 * 60 * 1000));
        toast.success("This account is waiting for email verification. We sent a fresh code.");
        navigate("/verify-otp");
        return;
      }
      setFormError(Array.isArray(message) ? message.join(" ") : message);
      toast.error(Array.isArray(message) ? message.join(" ") : message);
    }
  };

  const handleSocialSignUp = (provider: string) => {
    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || "http://localhost:4001/api/v1";
    const apiOrigin = apiEndpoint.replace(/\/api\/v1\/?$/, "");
    window.location.assign(`${apiOrigin}/api/v1/auth/oauth/${provider.toLowerCase()}`);
  };

  return (
    <main className="signup-page">
      <section className="signup-card" aria-labelledby="signup-title">
        <Link to="/" className="signup-brand" aria-label="Shop Now home">
          <img src="/Glossy%20Pink%20Shopping%20Arrow%20Logo.png" alt="Shop Now" />
        </Link>

        <h1 id="signup-title">Create Account</h1>
        <p className="signup-subtitle">Join Shop Now and discover something good.</p>

        <form onSubmit={handleSubmit} className="signup-form" noValidate>
          <div className="signup-field-grid">
            <div className="signup-field">
              <label htmlFor="signup-name">Full Name</label>
              <div className="signup-input-wrap">
                <UserIcon aria-hidden="true" />
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
            </div>

            <div className="signup-field">
              <label htmlFor="signup-phone">Phone <span>(optional)</span></label>
              <div className="signup-input-wrap">
                <Phone aria-hidden="true" />
                <input
                  id="signup-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="signup-field">
            <label htmlFor="signup-email">Email Address</label>
            <div className="signup-input-wrap">
              <Mail aria-hidden="true" />
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                required
                  aria-invalid={emailTouched && !emailFormatValid}
                  aria-describedby={emailTouched && !emailFormatValid ? "signup-email-error" : undefined}
                placeholder="you@example.com"
                value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (formError) setFormError("");
                  }}
                  onBlur={() => setEmailTouched(true)}
              />
            </div>
              {emailTouched && email.trim().length > 0 && !emailFormatValid && (
                <p id="signup-email-error" className="signup-form-error" role="alert">
                  Enter a valid email address, for example name@example.com.
                </p>
              )}
          </div>

          <div className="signup-field-grid">
            <div className="signup-field">
              <label htmlFor="signup-password">Password</label>
              <div className="signup-input-wrap">
                <Lock aria-hidden="true" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={72}
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="signup-password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
              {password.length > 0 && (
                <p className={`signup-password-hint ${passwordStrong ? "is-valid" : "is-invalid"}`} aria-live="polite">
                  {passwordStrong
                    ? "Strong password"
                    : "Use 8+ characters with uppercase, lowercase, a number, and a symbol."}
                </p>
              )}
            </div>

            <div className="signup-field">
              <label htmlFor="signup-confirm-password">Confirm Password</label>
              <div className="signup-input-wrap">
                <Lock aria-hidden="true" />
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Repeat password"
                  value={retypePassword}
                  onChange={(event) => setRetypePassword(event.target.value)}
                />
        <button
          type="button"
          className="signup-password-toggle"
          onClick={() => setShowConfirmPassword((visible) => !visible)}
          aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
        >
          {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </button>
              </div>
            </div>
          </div>

          <label className="signup-terms">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(event) => setAgreeTerms(event.target.checked)}
            />
            <span>
              I agree to the <Link to="/terms">Terms</Link> and <Link to="/privacy-policy">Privacy Policy</Link>
            </span>
          </label>

          {formError && <p className="signup-form-error" role="alert">{formError}</p>}

          <button type="submit" className="signup-submit" disabled={isLoading} aria-busy={isLoading}>
            <span>{isLoading ? "Creating account..." : "Create Account"}</span>
            {isLoading ? <LoaderCircle className="signup-loading-spinner" aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
          </button>
        </form>

        <div className="signup-divider"><span>or continue with</span></div>

        <div className="signup-socials" aria-label="Other sign-up options">
          <button type="button" onClick={() => handleSocialSignUp("Google")} aria-label="Sign up with Google">
            <FcGoogle />
          </button>
          <button type="button" onClick={() => handleSocialSignUp("Facebook")} aria-label="Sign up with Facebook">
            <FaFacebookF className="facebook-icon" />
          </button>
          <button type="button" onClick={() => handleSocialSignUp("TikTok")} aria-label="Sign up with TikTok">
            <FaTiktok className="tiktok-icon" />
          </button>
        </div>

        <p className="signup-login-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
};

export default Signup;
