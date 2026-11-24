// src/Authentication/Login.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  User as UserIcon,
  ArrowLeft,
  Lock,
  Mail,
  Check,
} from "lucide-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks/redux-hook";
import { setUser } from "@/redux/features/auth/authSlice";
import { User } from "@/redux/types/auth.type";
import shobNowLogo from "@/assets/Logo/shobnow-logo.png";
import signupIllustration from "@/assets/photo/signup.svg";

// Helper to generate a valid base64-encoded JWT structure so jwtDecode works seamlessly
const createMockJwt = (payload: { id: string; name: string; email: string; role: User["role"] }) => {
  try {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = btoa(
      JSON.stringify({
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400 * 7,
        ...payload,
      })
    );
    return `${header}.${body}.signature`;
  } catch {
    return "mock-jwt-token";
  }
};

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("user@shopnow.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<"admin" | "user">("user");
  const [isLoading, setIsLoading] = useState(false);

  // Core login handler for specific role
  const handleRoleLogin = (role: "admin" | "user") => {
    setIsLoading(true);

    const userEmail = email.trim() || (role === "admin" ? "admin@shopnow.com" : "user@shopnow.com");
    const userName = role === "admin" ? "System Admin" : "Valued Customer";

    const user: User = {
      id: role === "admin" ? "admin-01" : "user-01",
      name: userName,
      email: userEmail,
      role: role,
    };

    const token = createMockJwt({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Save to Redux store & persistent storage
    dispatch(setUser({ user, token }));
    if (rememberMe) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.setItem("user", JSON.stringify(user));
    }

    const targetRoute = role === "admin" ? "/admin-dashboard" : "/user-dashboard";
    const panelLabel = role === "admin" ? "Admin Management Panel" : "Customer Dashboard";

    toast.success(`Welcome back, ${user.name}!`, {
      description: `Authenticated as ${role.toUpperCase()}. Redirecting to ${panelLabel}...`,
    });

    setTimeout(() => {
      setIsLoading(false);
      navigate(targetRoute);
    }, 400);
  };

  // Form submission handler based on selected tab / email
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let roleToUse: "admin" | "user" = selectedRole;
    if (email.toLowerCase().includes("admin")) {
      roleToUse = "admin";
    } else if (email.toLowerCase().includes("user") || email.toLowerCase().includes("client")) {
      roleToUse = "user";
    }
    handleRoleLogin(roleToUse);
  };

  // Social sign-in handler
  const handleSocialSignIn = (provider: string) => {
    toast.info(`Connecting with ${provider}...`, {
      description: `Authenticating via ${provider} Single Sign-On...`,
    });
    setTimeout(() => {
      handleRoleLogin("user");
    }, 600);
  };

  const isEmailValid = email.includes("@") && email.includes(".");

  return (
    <div className="h-screen max-h-screen w-full bg-white select-none overflow-hidden flex flex-col justify-between">
      {/* Main Split Layout Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center px-4 sm:px-8 lg:px-12 py-3 sm:py-6 h-full overflow-hidden">
        
        {/* Left Side: Illustration + Top Logo & Back to Store */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between h-full py-2 pr-6 xl:pr-12 border-r border-gray-100/80">
          {/* Top Logo & Back Button */}
          <div className="flex items-center justify-between w-full shrink-0">
            <Link to="/" className="flex items-center gap-2 group transition-transform hover:scale-105" title="SHOB Now Home">
              <img
                src={shobNowLogo}
                alt="SHOB Now"
                className="h-7 xl:h-8 w-auto object-contain"
              />
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-medium text-gray-600 hover:text-gray-900 transition-all cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-gray-500" />
              <span>Back to Store</span>
            </Link>
          </div>

          {/* Centered Reception Illustration (matches media_1795376052868_59396895.jpg) */}
          <div className="my-auto flex items-center justify-center w-full px-4 xl:px-8 py-2">
            <img
              src={signupIllustration}
              alt="Shop Now Customer Support Desk Illustration"
              className="w-full max-w-[500px] xl:max-w-[560px] max-h-[58vh] xl:max-h-[64vh] object-contain drop-shadow-xs transition-transform duration-300 hover:scale-[1.01]"
            />
          </div>

          {/* Subtle bottom note */}
          <div className="text-[11px] text-gray-400 text-left shrink-0">
            © {new Date().getFullYear()} SHOB Now Inc. All rights reserved.
          </div>
        </div>

        {/* Right Side: Login Form (matches media_1795376052868_59396895.jpg) */}
        <div className="lg:col-span-5 flex flex-col justify-center h-full px-2 sm:px-6 xl:px-10 py-2 w-full max-w-md mx-auto">
          
          {/* Mobile Top Header (Visible only on small screens) */}
          <div className="flex lg:hidden items-center justify-between w-full mb-3 shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img src={shobNowLogo} alt="SHOB Now" className="h-6 w-auto" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs text-gray-600"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Store</span>
            </Link>
          </div>

          <div className="w-full">
            {/* Heading & Subtitle */}
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight leading-tight">
                Welcome Back :)
              </h1>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed font-normal">
                To keep connected with us please login with your personal information by email address and password <span className="inline-block text-amber-500">🔔</span>
              </p>
            </div>

            {/* Role Switcher Tabs (Admin / Customer) */}
            <div className="mb-3.5">
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-xl border border-gray-200/60">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("user");
                    if (!email || email === "admin@shopnow.com") {
                      setEmail("user@shopnow.com");
                    }
                  }}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                    selectedRole === "user"
                      ? "bg-white text-blue-600 shadow-xs font-semibold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>Customer Access</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole("admin");
                    if (!email || email === "user@shopnow.com") {
                      setEmail("admin@shopnow.com");
                    }
                  }}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                    selectedRole === "admin"
                      ? "bg-white text-[#A20E4C] shadow-xs font-semibold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A20E4C]" />
                  <span>Admin Access</span>
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Email Address Field */}
              <div className="flex flex-col">
                <label className="text-[11px] font-medium text-gray-500 mb-1 ml-0.5">
                  Email Address
                </label>
                <div className="relative flex items-center bg-[#F4F6F9] rounded-xl px-3.5 py-2.5 border border-transparent focus-within:border-[#008DEA] focus-within:bg-white transition-all shadow-2xs">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0 mr-2.5" />
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder={selectedRole === "admin" ? "admin@shopnow.com" : "Justin@ghostlamp.io"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent w-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none"
                  />
                  {isEmailValid && (
                    <div className="w-4 h-4 rounded-full bg-[#00C853] flex items-center justify-center text-white shrink-0 ml-2 shadow-xs animate-in fade-in duration-200">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col">
                <label className="text-[11px] font-medium text-gray-500 mb-1 ml-0.5">
                  Password
                </label>
                <div className="relative flex items-center bg-[#F4F6F9] rounded-xl px-3.5 py-2.5 border border-transparent focus-within:border-[#008DEA] focus-within:bg-white transition-all shadow-2xs">
                  <Lock className="w-4 h-4 text-gray-400 shrink-0 mr-2.5" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent w-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none shrink-0 ml-2 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <AiOutlineEyeInvisible size={17} /> : <AiOutlineEye size={17} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forget Password Row */}
              <div className="flex items-center justify-between pt-0.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      rememberMe ? "bg-[#00C853] text-white" : "border border-gray-300 bg-white"
                    }`}
                  >
                    {rememberMe && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs text-gray-500 font-normal">Remember Me</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs text-gray-400 hover:text-[#008DEA] transition-colors"
                >
                  Forget Password?
                </Link>
              </div>

              {/* Buttons Row: Login Now (blue pill) & Create Account (white pill) */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-7 py-2.5 rounded-full bg-[#008DEA] hover:bg-[#007cd0] text-white text-xs sm:text-sm font-medium shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? "Signing in..." : "Login Now"}
                </button>

                <Link
                  to="/signup"
                  className="px-6 py-2.5 rounded-full bg-white hover:bg-gray-50 text-gray-600 border border-gray-200/90 shadow-2xs text-xs sm:text-sm font-medium text-center active:scale-95 transition-all cursor-pointer"
                >
                  Create Account
                </Link>
              </div>
            </form>

            {/* Social Join Row: Google, Facebook, Twitter Circles */}
            <div className="mt-4 pt-2">
              <p className="text-xs text-gray-400 mb-2.5 font-normal">
                Or you can join with
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSocialSignIn("Google")}
                  className="w-9 h-9 rounded-full bg-white border border-gray-200/80 shadow-2xs flex items-center justify-center hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Sign in with Google"
                >
                  <FcGoogle size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialSignIn("Facebook")}
                  className="w-9 h-9 rounded-full bg-[#1877F2] text-white shadow-2xs flex items-center justify-center hover:bg-[#166fe5] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Sign in with Facebook"
                >
                  <FaFacebookF size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialSignIn("Twitter")}
                  className="w-9 h-9 rounded-full bg-[#1DA1F2] text-white shadow-2xs flex items-center justify-center hover:bg-[#1a94df] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Sign in with Twitter"
                >
                  <FaTwitter size={14} />
                </button>
              </div>
            </div>

            {/* Quick 1-Click Role Direct Demo Access */}
            <div className="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center gap-2">
              <span className="text-[10px] text-gray-400 font-medium">Quick Demo:</span>
              <button
                type="button"
                onClick={() => handleRoleLogin("admin")}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
              >
                ⚡ 1-Click Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleLogin("user")}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
              >
                ⚡ 1-Click Customer
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
