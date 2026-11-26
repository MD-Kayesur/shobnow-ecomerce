import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Heart,
  LayoutGrid,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
  Zap,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";
import {
  openCartDrawer,
  selectCartTotalCount,
} from "@/redux/features/cart/cartSlice";
import { NAV_SUB_ITEMS as subNavItems } from "@/data/shopData";
import { useGetPromoBarQuery } from "@/redux/features/storefront/storefrontApi";
import shobNowLogo from "@/assets/Logo/shobnow-logo.png";
import CategoriesModal from "./CategoriesModal";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector(selectCartTotalCount);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const { data: promoResponse } = useGetPromoBarQuery();
  const promoBar = promoResponse?.data;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!promoBar?.endsAt) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [promoBar?.endsAt]);

  const secondsRemaining = promoBar?.endsAt
    ? Math.max(0, Math.floor((new Date(promoBar.endsAt).getTime() - now) / 1000))
    : 0;
  const days = String(Math.floor(secondsRemaining / 86_400)).padStart(2, "0");
  const hours = String(Math.floor((secondsRemaining % 86_400) / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((secondsRemaining % 3600) / 60)).padStart(2, "0");
  const seconds = String(secondsRemaining % 60).padStart(2, "0");
  const isPromoVisible = Boolean(
    promoBar?.isActive && (!promoBar.endsAt || secondsRemaining > 0),
  );

  const isNavItemActive = (path: string) => {
    const { pathname, search, hash } = location;
    if (path === "/top-selling") return pathname === path || search.includes("sort=bestselling");
    if (path.includes("newest")) return search.includes("sort=newest");
    if (path.includes("featured")) return search.includes("filter=featured");
    if (path === "/brands") return pathname === path || search.includes("filter=brands");
    if (path === "/track-order") return pathname === path;
    if (path === "/#categories" || path === "/categories") return pathname === "/categories" || hash === "#categories";
    if (path === "/shop") {
      return (pathname === "/shop" || pathname === "/products") &&
        !search.includes("sort=bestselling") &&
        !search.includes("sort=newest") &&
        !search.includes("filter=featured");
    }
    return pathname === path;
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    navigate(`/shop?search=${encodeURIComponent(query)}`);
    setIsMobileMenuOpen(false);
  };

  const categoryItem = subNavItems.find(
    (item) => item.name === "All Categories" || item.path === "/#categories" || item.path === "/categories",
  );

  const desktopLinks = [
    { label: "Shop", path: "/shop" },
    { label: "Offers", path: "/shop?filter=featured", featured: true },
    { label: "Brands", path: "/brands" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white font-inter text-[#111827] shadow-[0_2px_12px_rgba(35,20,40,0.07)]">
      <div className="min-h-[34px] bg-gradient-to-r from-[#f44b9a] via-[#d60060] to-[#970044] px-3 text-white sm:px-6">
        <div className="mx-auto flex min-h-[36px] max-w-[1440px] items-center justify-between gap-2 text-[10px] font-semibold sm:gap-3 sm:text-xs">
          <div className="flex min-w-0 shrink-0 items-center gap-1.5 whitespace-nowrap sm:gap-2">
            <Zap size={14} fill="currentColor" className="shrink-0 text-yellow-300" />
            <span className="truncate">{promoBar?.headline || "Beauty Fest is Live"}</span>
          </div>
          <div className="hidden min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap sm:flex sm:gap-3">
            <span className="h-3 w-px bg-white/60" /><span>{promoBar?.offerText || "Up to 40% OFF"}</span>
            <span className="h-3 w-px bg-white/60" /><span>{promoBar?.deliveryText || "Free Delivery over ৳1,000"}</span>
          </div>
          {isPromoVisible && promoBar?.endsAt && secondsRemaining > 0 && <div className="ml-auto flex shrink-0 items-center gap-1 whitespace-nowrap sm:ml-0 sm:gap-1.5">
            <span className="hidden opacity-90 sm:inline">Ends in:</span>
            <span className="rounded-md bg-white/15 px-1.5 py-0.5 tabular-nums sm:px-2">{days}</span><span className="opacity-80">:</span>
            <span className="rounded-md bg-white/15 px-1.5 py-0.5 tabular-nums sm:px-2">{hours}</span><span className="opacity-80">:</span>
            <span className="rounded-md bg-white/15 px-1.5 py-0.5 tabular-nums sm:px-2">{minutes}</span><span className="opacity-80">:</span>
            <span className="rounded-md bg-white/15 px-1.5 py-0.5 tabular-nums sm:px-2">{seconds}</span>
          </div>}
        </div>
      </div>
      <div className="border-b border-[#f3e8ee] bg-white">
        <div className="mx-auto flex min-h-[58px] max-w-[1440px] items-center gap-3 px-3 sm:gap-4 sm:px-6 lg:gap-5">
          <Link to="/" className="group flex shrink-0 items-center" aria-label="Shop Now home">
            <img
              src={shobNowLogo}
              alt="Shop Now"
              className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.04] sm:h-12"
            />
          </Link>

          {categoryItem && <button type="button" onClick={() => setIsCategoryModalOpen((open) => !open)} aria-expanded={isCategoryModalOpen} className="hidden h-10 shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#f74c9b] to-[#e90068] px-4 text-sm font-bold text-white shadow-sm transition hover:shadow-md lg:inline-flex"><LayoutGrid size={16}/><span>All Categories</span><ChevronDown size={14}/></button>}

          <form onSubmit={handleSearchSubmit} className="hidden min-w-0 flex-1 lg:block lg:max-w-[430px] xl:max-w-[550px]">
            <label className="flex h-10 items-center gap-2.5 rounded-full border border-transparent bg-[#f1f1f5] px-3.5 transition-all focus-within:border-[#e72c7e]/35 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(231,44,126,0.09)]">
              <Search size={17} className="shrink-0 text-[#596579]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search for beauty, jewelry, lifestyle and more..."
                aria-label="Search products"
                className="w-full bg-transparent text-xs text-[#20263a] outline-none placeholder:text-[#7f8494] lg:text-sm"
              />
            </label>
          </form>

          <nav className="hidden min-w-0 flex-1 items-center justify-end gap-1 lg:flex xl:gap-2" aria-label="Main navigation">
            {desktopLinks.map((item) => {
              const active = isNavItemActive(item.path);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-2 text-xs font-semibold transition-colors xl:px-3 xl:text-sm ${active ? "bg-[#fff0f7] text-[#c60059]" : "text-[#171b2d] hover:bg-[#fff0f7] hover:text-[#c60059]"}`}
                >
                  {item.label}{item.featured && <span aria-hidden="true">🔥</span>}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 lg:ml-0">
            <Link
              to="/user-dashboard/wishlist"
              aria-label="Wishlist"
              title="Wishlist"
              className="hidden h-9 items-center justify-center gap-1.5 rounded-full px-2 text-[#22283a] transition-colors hover:bg-[#fff0f7] hover:text-[#d90060] sm:flex"
            >
              <Heart size={20} strokeWidth={1.8} />
              <span className="hidden text-xs font-semibold xl:inline">Wishlist</span>
            </Link>
            <button
              type="button"
              onClick={() => dispatch(openCartDrawer())}
              aria-label={`Shopping cart${cartCount ? `, ${cartCount} items` : ""}`}
              title="Shopping cart"
              className="relative flex h-9 items-center justify-center gap-1.5 rounded-full px-2 text-[#22283a] transition-colors hover:bg-[#fff0f7] hover:text-[#d90060]"
            >
              <ShoppingCart size={20} strokeWidth={1.8} />
              <span className="hidden text-xs font-semibold xl:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#e90070] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
            <Link
              to="/login"
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#ffe3f2] px-3 text-xs font-bold text-[#28162a] transition-all hover:bg-[#ffd0e8] hover:shadow-[0_3px_12px_rgba(217,0,96,0.15)] sm:px-3.5 sm:text-sm"
            >
              <User size={15} />
              <span>Login</span>
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#22283a] transition-colors hover:bg-[#fff0f7] hover:text-[#d90060] lg:hidden"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-3 pb-2 lg:hidden sm:px-6">
          <form onSubmit={handleSearchSubmit}>
            <label className="flex h-9 items-center gap-2 rounded-full bg-[#f1f1f5] px-3 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#e72c7e]/20">
              <Search size={16} className="shrink-0 text-[#596579]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search for beauty, jewelry, lifestyle and more..."
                aria-label="Search products"
                className="w-full bg-transparent text-xs text-[#20263a] outline-none placeholder:text-[#7f8494]"
              />
            </label>
          </form>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-b border-[#f3e8ee] bg-white px-3 py-2 shadow-lg lg:hidden sm:px-6">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-1">
            {categoryItem && (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCategoryModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#20263a] transition-colors hover:bg-[#fff0f7] hover:text-[#c60059]"
              >
                <LayoutGrid size={16} className="text-[#e72c7e]" /> All Categories
              </button>
            )}
            {subNavItems
              .filter((item) => item.name !== "All Categories" && item.path !== "/#categories" && item.path !== "/categories")
              .map((item) => (
                <Link
                  key={`${item.name}-${item.path}`}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[#fff0f7] hover:text-[#c60059] ${isNavItemActive(item.path) ? "bg-[#fff0f7] text-[#c60059]" : "text-[#20263a]"}`}
                >
                  {item.name}
                </Link>
              ))}
          </div>
        </div>
      )}

      <CategoriesModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </header>
  );
};

export default NavBar;
