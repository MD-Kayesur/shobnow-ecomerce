import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import {
  selectCartTotalCount,
  openCartDrawer,
} from "@/redux/features/cart/cartSlice";
import { NAV_SUB_ITEMS as subNavItems } from "@/data/shopData";
import shobNowLogo from "@/assets/Logo/shobnow-logo.png";
import CategoriesModal from "./CategoriesModal";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? (theme === "dark" || resolvedTheme === "dark") : false;

  const cartCount = useAppSelector(selectCartTotalCount);

  // Precision active item check so only the targeted category is active at one time
  const isNavItemActive = (itemPath: string) => {
    const { pathname, search, hash } = location;

    // 1. Top Selling
    if (itemPath === "/top-selling") {
      return pathname === "/top-selling" || search.includes("sort=bestselling");
    }

    // 2. New Arrivals
    if (itemPath.includes("newest")) {
      return search.includes("sort=newest");
    }

    // 3. Featured Products
    if (itemPath.includes("featured")) {
      return search.includes("filter=featured");
    }

    // 4. Brands
    if (itemPath === "/brands") {
      return pathname === "/brands" || search.includes("filter=brands");
    }

    // 5. Order Tracking
    if (itemPath === "/track-order") {
      return pathname === "/track-order";
    }

    // 6. All Categories
    if (itemPath === "/#categories" || itemPath === "/categories") {
      return pathname === "/categories" || hash === "#categories";
    }

    // 7. Shop: ONLY active when specifically on /shop and NOT on any specific sub-filter
    if (itemPath === "/shop") {
      return (
        (pathname === "/shop" || pathname === "/products") &&
        !search.includes("sort=bestselling") &&
        !search.includes("sort=newest") &&
        !search.includes("filter=featured")
      );
    }

    return pathname === itemPath;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full font-inter select-none shadow-xs transition-colors duration-200">
      {/* 1. TOP BLACK NOTIFICATION BAR (Exact Figma Code) */}
      <div className="w-full bg-[#090B0E] py-2 px-4 sm:px-20 flex justify-center items-center gap-5 text-[#FDFDFD] text-[13px] font-normal leading-tight">
        <span>20% off on featured products</span>
        <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-white/40" />
        <span className="hidden sm:inline-block">Home delivery available</span>
      </div>

      {/* 2. MAIN HEADER BAR (Exact Figma Code + Dark Mode) */}
      <div className="w-full bg-[#FDFDFD] dark:bg-[#0E131F] py-3 border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-4 sm:gap-10 lg:gap-20">
          {/* Logo: SHOB Now */}
          <Link
            to="/"
            className="flex items-center select-none shrink-0 group py-0.5"
            aria-label="SHOB Now Home"
          >
            <div className="relative flex items-center dark:bg-white/95 dark:px-2.5 dark:py-1 dark:rounded-xl dark:shadow-xs transition-all">
              <img
                src={shobNowLogo}
                alt="SHOB Now"
                className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Centered Pill Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl hidden md:flex items-center"
          >
            <div className="w-full flex items-center bg-[#E9EBEE] dark:bg-gray-800/90 rounded-[30px] px-3.5 py-2.5 gap-2 transition-all focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:ring-2 focus-within:ring-[#A20E4C]/20 focus-within:border-[#A20E4C] border border-transparent dark:border-gray-700">
              <Search size={18} className="text-[#80899C] dark:text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search for products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-[#3F444E] dark:text-gray-100 placeholder:text-[#80899C] dark:placeholder:text-gray-400 focus:outline-hidden"
              />
            </div>
          </form>

          {/* Right Action Items: Cart, Login, and Theme Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Cart Button */}
            <button
              onClick={() => dispatch(openCartDrawer())}
              className="relative h-11 w-11 p-2.5 bg-[#E9EBEE] hover:bg-[#dfe2e6] dark:bg-gray-800 dark:hover:bg-gray-700 rounded-[30px] flex items-center justify-center text-[#3F444E] dark:text-gray-200 transition-colors cursor-pointer"
              title="Shopping Cart"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FFE2FF] text-[#500624] border border-[#f3c8f3] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Login Button with #FFE2FF */}
            <Link
              to="/login"
              className="py-2.5 pl-2.5 pr-4.5 bg-[#FFE2FF] hover:bg-[#ffd1ff] rounded-[30px] flex items-center gap-2 text-[#500624] text-sm font-bold transition-all shadow-xs cursor-pointer hover:shadow-md"
            >
              <div className="w-6 h-6 rounded-full bg-[#500624]/10 flex items-center justify-center">
                <User size={15} className="text-[#500624]" />
              </div>
              <span className="hidden sm:inline">Login</span>
            </Link>

            {/* Theme Toggle Button (BESIDE LOGIN BUTTON - RIGHT SIDE) */}
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="h-11 w-11 p-2.5 bg-[#E9EBEE] hover:bg-[#dfe2e6] dark:bg-gray-800 dark:hover:bg-gray-700 rounded-[30px] flex items-center justify-center text-[#3F444E] dark:text-amber-400 transition-all cursor-pointer shadow-xs hover:shadow-md group"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {mounted ? (
                isDark ? (
                  <Sun size={20} className="text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
                ) : (
                  <Moon size={20} className="text-[#3F444E] transition-transform duration-300 group-hover:-rotate-12" />
                )
              ) : (
                <div className="w-5 h-5" />
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white md:hidden cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. SUBNAV BAR (Exact Figma Code + Dark Mode) */}
      <nav className="w-full bg-[#FDFDFD] dark:bg-[#0E131F] border-b border-[#F6E7ED] dark:border-gray-800 transition-colors duration-200 hidden md:block">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 h-12 flex items-center gap-4 lg:gap-6 overflow-x-auto no-scrollbar">
          {subNavItems.map((item, idx) => {
            const active = isNavItemActive(item.path);
            const isAllCategories = item.name === "All Categories" || item.path === "/#categories" || item.path === "/categories";

            if (isAllCategories) {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setIsCategoryModalOpen((prev) => !prev)}
                  className={`text-sm lg:text-base font-['Inter'] whitespace-nowrap transition-all px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 cursor-pointer ${
                    isCategoryModalOpen || active
                      ? "bg-[#FFE2FF] text-[#500624] font-bold shadow-2xs"
                      : "text-gray-700 dark:text-gray-300 hover:text-[#500624] dark:hover:text-[#FFE2FF] hover:bg-[#FFE2FF]/20 font-medium"
                  }`}
                  aria-label="Toggle All Categories Modal"
                >
                  <LayoutGrid size={16} className="text-[#A20E4C]" />
                  <span>{item.name}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      isCategoryModalOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              );
            }

            return (
              <Link
                key={idx}
                to={item.path}
                className={`text-sm lg:text-base font-['Inter'] whitespace-nowrap transition-all px-3 py-1 rounded-full ${
                  active
                    ? "bg-[#FFE2FF] text-[#500624] font-bold shadow-2xs"
                    : "text-gray-700 dark:text-gray-300 hover:text-[#500624] dark:hover:text-[#FFE2FF] hover:bg-[#FFE2FF]/20 font-medium"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden w-full bg-white dark:bg-[#0E131F] border-b border-gray-200 dark:border-gray-800 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 transition-colors duration-200">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="w-full mb-3">
            <div className="w-full flex items-center bg-[#E9EBEE] dark:bg-gray-800 rounded-full px-3 py-2 gap-2">
              <Search size={16} className="text-[#80899C] dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search for products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-[#3F444E] dark:text-gray-100 placeholder:text-[#80899C] dark:placeholder:text-gray-400 outline-none"
              />
            </div>
          </form>

          {subNavItems.map((item, idx) => {
            const active = isNavItemActive(item.path);
            const isAllCategories = item.name === "All Categories" || item.path === "/#categories" || item.path === "/categories";

            if (isAllCategories) {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsCategoryModalOpen(true);
                  }}
                  className={`w-full text-left flex items-center justify-between py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isCategoryModalOpen || active
                      ? "bg-[#FFE2FF] text-[#500624] font-bold"
                      : "text-[#3F444E] dark:text-gray-300 hover:text-[#500624] dark:hover:text-[#FFE2FF] hover:bg-[#FFE2FF]/20"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <LayoutGrid size={16} className="text-[#A20E4C]" />
                    <span>{item.name}</span>
                  </span>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              );
            }

            return (
              <Link
                key={idx}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#FFE2FF] text-[#500624] font-bold"
                    : "text-[#3F444E] dark:text-gray-300 hover:text-[#500624] dark:hover:text-[#FFE2FF] hover:bg-[#FFE2FF]/20"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      )}

      {/* Categories Drawer Modal matching user screenshots */}
      <CategoriesModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </header>
  );
};

export default NavBar;
