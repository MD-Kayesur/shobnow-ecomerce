import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaMicrosoft } from "react-icons/fa";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import { setUser } from "@/redux/features/auth/authSlice";
import { User } from "@/redux/types/auth.type";
import "./Login.css";

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

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleLogin = (role: "admin" | "user") => {
    setIsLoading(true);
    const userEmail = email.trim() || (role === "admin" ? "admin@shopnow.com" : "user@shopnow.com");
    const userName = role === "admin" ? "System Admin" : "Valued Customer";
    const user: User = {
      id: role === "admin" ? "admin-01" : "user-01",
      name: userName,
      email: userEmail,
      role,
    };
    const token = createMockJwt({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    dispatch(setUser({ user, token }));
    localStorage.setItem("user", JSON.stringify(user));
    const targetRoute = role === "admin" ? "/admin-dashboard" : "/user-dashboard";
    toast.success(`Welcome back, ${user.name}!`, {
      description: `Authenticated as ${role.toUpperCase()}. Redirecting to your dashboard...`,
    });
    setTimeout(() => {
      setIsLoading(false);
      navigate(targetRoute);
    }, 400);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const role = email.toLowerCase().includes("admin") ? "admin" : "user";
    handleRoleLogin(role);
  };

  const handleSocialSignIn = (provider: string) => {
    toast.info(`Connecting with ${provider}...`, {
      description: `Authenticating via ${provider} Single Sign-On...`,
    });
    setTimeout(() => handleRoleLogin("user"), 600);
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

          <button type="submit" className="login-submit" disabled={isLoading}>
            <span>{isLoading ? "Signing in..." : "Sign In"}</span>
            {!isLoading && <ArrowRight aria-hidden="true" />}
          </button>
        </form>

        <div className="login-divider"><span>or continue with</span></div>

        <div className="login-socials" aria-label="Other sign-in options">
          <button type="button" onClick={() => handleSocialSignIn("Google")} aria-label="Continue with Google">
            <FcGoogle />
          </button>
          <button type="button" onClick={() => handleSocialSignIn("GitHub")} aria-label="Continue with GitHub">
            <FaGithub className="github-icon" />
          </button>
          <button type="button" onClick={() => handleSocialSignIn("Microsoft")} aria-label="Continue with Microsoft">
            <FaMicrosoft className="microsoft-icon" />
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
