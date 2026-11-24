import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaTiktok } from "react-icons/fa";
import { toast } from "sonner";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { OtpType } from "@/redux/types/auth.type";
import "./Login.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await login({ email: email.trim().toLowerCase(), password }).unwrap();
      const type: OtpType = response.data.requiresVerification ? "ACCOUNT_VERIFY" : "LOGIN";
      const deadline = Date.now() + 10 * 60 * 1000;
      sessionStorage.setItem("auth_reset_identifier", (response.data.email || email).trim().toLowerCase());
      sessionStorage.setItem("auth_reset_method", "email");
      sessionStorage.setItem("auth_otp_type", type);
      sessionStorage.setItem("auth_otp_expires_at", String(deadline));
      sessionStorage.setItem("auth_otp_resend_at", String(deadline));
      if (response.data.challengeId) sessionStorage.setItem("auth_otp_challenge_id", response.data.challengeId);
      else sessionStorage.removeItem("auth_otp_challenge_id");
      toast.success(type === "LOGIN" ? "Check your email for the login code." : "Verify your email to finish signing in.");
      navigate("/verify-otp");
    } catch (error) {
      const apiError = error as { data?: { message?: string | string[] }; error?: string };
      const message = apiError.data?.message ?? apiError.error ?? "Unable to sign in. Check your details and try again.";
      toast.error(Array.isArray(message) ? message.join(" ") : message);
    }
  };

  const handleSocialSignIn = (provider: string) => {
    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || "http://localhost:4001/api/v1";
    const apiOrigin = apiEndpoint.replace(/\/api\/v1\/?$/, "");
    window.location.assign(`${apiOrigin}/api/v1/auth/oauth/${provider.toLowerCase()}`);
  };

  return (
    <main className="login-page">
      <div className="login-card" aria-labelledby="login-title">
        <Link to="/" className="login-brand" aria-label="Shop Now home">
          <img src="/Glossy%20Pink%20Shopping%20Arrow%20Logo.png" alt="Shop Now" />
        </Link>

        <h1 id="login-title">Login</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">Email</label>
          <div className="login-input-wrap">
            <Mail aria-hidden="true" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <label htmlFor="password">Password</label>
          <div className="login-input-wrap">
            <Lock aria-hidden="true" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          <div className="login-forgot-row">
            <span />
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className="login-submit" disabled={isLoading} aria-busy={isLoading}>
            <span>{isLoading ? "Signing in..." : "Sign In"}</span>
            {isLoading ? (
              <span className="login-loading-spinner" aria-hidden="true" />
            ) : (
              <ArrowRight aria-hidden="true" />
            )}
          </button>
        </form>

        <div className="login-divider"><span>or continue with</span></div>

        <div className="login-socials" aria-label="Other sign-in options">
          <button type="button" onClick={() => handleSocialSignIn("Google")} aria-label="Continue with Google">
            <FcGoogle />
          </button>
          <button type="button" onClick={() => handleSocialSignIn("Facebook")} aria-label="Continue with Facebook">
            <FaFacebookF className="facebook-icon" />
          </button>
          <button type="button" onClick={() => handleSocialSignIn("TikTok")} aria-label="Continue with TikTok">
            <FaTiktok className="tiktok-icon" />
          </button>
        </div>

        <p className="login-register">
          Don’t have an account? <Link to="/signup">Register here</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
