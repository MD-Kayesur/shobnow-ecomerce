import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, Phone, User as UserIcon } from "lucide-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaMicrosoft } from "react-icons/fa";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import { setUser } from "@/redux/features/auth/authSlice";
import { User } from "@/redux/types/auth.type";
import "./Signup.css";

const createMockJwt = (payload: {
  id: string;
  name: string;
  email: string;
  role: User["role"];
}) => {
  try {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = btoa(
      JSON.stringify({
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400 * 7,
        ...payload,
      }),
    );
    return `${header}.${body}.signature`;
  } catch {
    return "mock-jwt-token";
  }
};

const Signup: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const isEmailValid = email.includes("@") && email.includes(".");
  const isNameValid = name.trim().length >= 3;
  const passwordsMatch = password.length >= 6 && password === retypePassword;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (password !== retypePassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (!agreeTerms) {
      toast.error("Please agree to the Terms & Privacy Policy.");
      return;
    }

    setIsLoading(true);
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role: "user",
    };
    const token = createMockJwt({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
    dispatch(setUser({ user: newUser, token }));
    localStorage.setItem("user", JSON.stringify(newUser));
    toast.success("Account created successfully!", {
      description: `Welcome to SHOB Now, ${newUser.name}! Redirecting to customer dashboard...`,
    });
    setTimeout(() => {
      setIsLoading(false);
      navigate("/user-dashboard");
    }, 500);
  };

  const handleSocialSignUp = (provider: string) => {
    toast.info(`Connecting with ${provider}...`, {
      description: `Setting up your SHOB Now account with ${provider}...`,
    });
    setTimeout(() => {
      const socialUser: User = {
        id: `user-${Date.now()}`,
        name: `${provider} Shopper`,
        email: `shopper@${provider.toLowerCase()}.com`,
        role: "user",
      };
      const token = createMockJwt({
        id: socialUser.id,
        name: socialUser.name,
        email: socialUser.email,
        role: socialUser.role,
      });
      dispatch(setUser({ user: socialUser, token }));
      localStorage.setItem("user", JSON.stringify(socialUser));
      toast.success(`${provider} account verified! Welcome to SHOB Now.`);
      navigate("/user-dashboard");
    }, 600);
  };

  return (
    <main className="signup-page">
      <section className="signup-card" aria-labelledby="signup-title">
        <Link to="/" className="signup-brand" aria-label="Shop Now home">
          <img src="/Glossy%20Pink%20Shopping%20Arrow%20Logo.png" alt="Shop Now" />
        </Link>

        <h1 id="signup-title">Create Account</h1>
        <p className="signup-subtitle">Join Shop Now and discover something good.</p>

        <form onSubmit={handleSubmit} className="signup-form">
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
                {isNameValid && <span className="signup-valid-mark" aria-label="Valid name">\u2713</span>}
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
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              {isEmailValid && <span className="signup-valid-mark" aria-label="Valid email">\u2713</span>}
            </div>
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
            </div>

            <div className="signup-field">
              <label htmlFor="signup-confirm-password">Confirm Password</label>
              <div className="signup-input-wrap">
                <Lock aria-hidden="true" />
                <input
                  id="signup-confirm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Repeat password"
                  value={retypePassword}
                  onChange={(event) => setRetypePassword(event.target.value)}
                />
                {passwordsMatch && <span className="signup-valid-mark" aria-label="Passwords match">\u2713</span>}
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

          <button type="submit" className="signup-submit" disabled={isLoading}>
            <span>{isLoading ? "Creating account..." : "Create Account"}</span>
            {!isLoading && <ArrowRight aria-hidden="true" />}
          </button>
        </form>

        <div className="signup-divider"><span>or continue with</span></div>

        <div className="signup-socials" aria-label="Other sign-up options">
          <button type="button" onClick={() => handleSocialSignUp("Google")} aria-label="Sign up with Google">
            <FcGoogle />
          </button>
          <button type="button" onClick={() => handleSocialSignUp("GitHub")} aria-label="Sign up with GitHub">
            <FaGithub />
          </button>
          <button type="button" onClick={() => handleSocialSignUp("Microsoft")} aria-label="Sign up with Microsoft">
            <FaMicrosoft className="signup-microsoft-icon" />
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
