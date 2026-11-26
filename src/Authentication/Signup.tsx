// src/Authentication/Signup.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User as UserIcon,
  Lock,
  Mail,
  Phone,
  ArrowLeft,
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

// Helper to generate a valid base64-encoded JWT structure
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  // Mock social sign-up
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
    <div className="h-screen max-h-screen w-full bg-white select-none overflow-hidden flex flex-col justify-between">
      {/* Main Split Layout Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center px-4 sm:px-8 lg:px-12 py-2 sm:py-5 h-full overflow-hidden">
        
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

        {/* Right Side: Registration Form (matches media_1795376052868_59396895.jpg) */}
        <div className="lg:col-span-5 flex flex-col justify-center h-full px-2 sm:px-6 xl:px-10 py-1 sm:py-2 w-full max-w-md mx-auto">
          
          {/* Mobile Top Header (Visible only on small screens) */}
          <div className="flex lg:hidden items-center justify-between w-full mb-2 shrink-0">
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
            <div className="mb-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight leading-tight">
                Create Account :)
              </h1>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed font-normal">
                To keep connected with us please register with your personal information by email address and password <span className="inline-block text-amber-500">🔔</span>
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {/* Full Name & Phone in 2-col on larger mobile, or stacked */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Full Name */}
                <div className="flex flex-col">
                  <label className="text-[11px] font-medium text-gray-500 mb-0.5 ml-0.5">
                    Full Name
                  </label>
                  <div className="relative flex items-center bg-[#F4F6F9] rounded-xl px-3 py-2 border border-transparent focus-within:border-[#008DEA] focus-within:bg-white transition-all shadow-2xs">
                    <UserIcon className="w-3.5 h-3.5 text-gray-400 shrink-0 mr-2" />
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Justin Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-transparent w-full text-xs text-gray-800 placeholder-gray-400 outline-none"
                    />
                    {isNameValid && (
                      <div className="w-3.5 h-3.5 rounded-full bg-[#00C853] flex items-center justify-center text-white shrink-0 ml-1 shadow-xs animate-in fade-in">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex flex-col">
                  <label className="text-[11px] font-medium text-gray-500 mb-0.5 ml-0.5">
                    Phone (Optional)
                  </label>
                  <div className="relative flex items-center bg-[#F4F6F9] rounded-xl px-3 py-2 border border-transparent focus-within:border-[#008DEA] focus-within:bg-white transition-all shadow-2xs">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0 mr-2" />
                    <input
                      id="phone"
                      type="tel"
                      placeholder="017XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-transparent w-full text-xs text-gray-800 placeholder-gray-400 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address Field */}
              <div className="flex flex-col">
                <label className="text-[11px] font-medium text-gray-500 mb-0.5 ml-0.5">
                  Email Address
                </label>
                <div className="relative flex items-center bg-[#F4F6F9] rounded-xl px-3.5 py-2 border border-transparent focus-within:border-[#008DEA] focus-within:bg-white transition-all shadow-2xs">
                  <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0 mr-2.5" />
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="Justin@ghostlamp.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent w-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none"
                  />
                  {isEmailValid && (
                    <div className="w-4 h-4 rounded-full bg-[#00C853] flex items-center justify-center text-white shrink-0 ml-2 shadow-xs animate-in fade-in">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Password & Confirm Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Password Field */}
                <div className="flex flex-col">
                  <label className="text-[11px] font-medium text-gray-500 mb-0.5 ml-0.5">
                    Password
                  </label>
                  <div className="relative flex items-center bg-[#F4F6F9] rounded-xl px-3 py-2 border border-transparent focus-within:border-[#008DEA] focus-within:bg-white transition-all shadow-2xs">
                    <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0 mr-2" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-transparent w-full text-xs text-gray-800 placeholder-gray-400 outline-none tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none shrink-0 ml-1 cursor-pointer"
                    >
                      {showPassword ? <AiOutlineEyeInvisible size={16} /> : <AiOutlineEye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Retype Password */}
                <div className="flex flex-col">
                  <label className="text-[11px] font-medium text-gray-500 mb-0.5 ml-0.5">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center bg-[#F4F6F9] rounded-xl px-3 py-2 border border-transparent focus-within:border-[#008DEA] focus-within:bg-white transition-all shadow-2xs">
                    <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0 mr-2" />
                    <input
                      id="retypePassword"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••••••"
                      value={retypePassword}
                      onChange={(e) => setRetypePassword(e.target.value)}
                      className="bg-transparent w-full text-xs text-gray-800 placeholder-gray-400 outline-none tracking-wider"
                    />
                    {passwordsMatch && (
                      <div className="w-3.5 h-3.5 rounded-full bg-[#00C853] flex items-center justify-center text-white shrink-0 ml-1 shadow-xs animate-in fade-in">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Agree to Terms Checkbox */}
              <div className="flex items-center gap-2 pt-0.5 text-xs">
                <div
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    agreeTerms ? "bg-[#00C853] text-white" : "border border-gray-300 bg-white"
                  }`}
                >
                  {agreeTerms && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <label
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className="text-[11px] text-gray-500 cursor-pointer select-none"
                >
                  I agree to the <Link to="/terms" className="text-[#008DEA] hover:underline">Terms</Link> and <Link to="/privacy-policy" className="text-[#008DEA] hover:underline">Privacy Policy</Link>
                </label>
              </div>

              {/* Buttons Row: Register Now (blue pill) & Login Now (white pill) */}
              <div className="flex items-center gap-3 pt-1.5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-7 py-2.5 rounded-full bg-[#008DEA] hover:bg-[#007cd0] text-white text-xs sm:text-sm font-medium shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? "Creating..." : "Register Now"}
                </button>

                <Link
                  to="/login"
                  className="px-6 py-2.5 rounded-full bg-white hover:bg-gray-50 text-gray-600 border border-gray-200/90 shadow-2xs text-xs sm:text-sm font-medium text-center active:scale-95 transition-all cursor-pointer"
                >
                  Login Now
                </Link>
              </div>
            </form>

            {/* Social Join Row: Google, Facebook, Twitter Circles */}
            <div className="mt-3.5 pt-1.5">
              <p className="text-xs text-gray-400 mb-2 font-normal">
                Or you can join with
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSocialSignUp("Google")}
                  className="w-9 h-9 rounded-full bg-white border border-gray-200/80 shadow-2xs flex items-center justify-center hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Sign up with Google"
                >
                  <FcGoogle size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialSignUp("Facebook")}
                  className="w-9 h-9 rounded-full bg-[#1877F2] text-white shadow-2xs flex items-center justify-center hover:bg-[#166fe5] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Sign up with Facebook"
                >
                  <FaFacebookF size={14} />
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialSignUp("Twitter")}
                  className="w-9 h-9 rounded-full bg-[#1DA1F2] text-white shadow-2xs flex items-center justify-center hover:bg-[#1a94df] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Sign up with Twitter"
                >
                  <FaTwitter size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;
