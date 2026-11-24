// src/components/Home/Shared/CategoriesModal.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  X,
  Sparkles,
  ShoppingBag,
  Flame,
  Truck,
  Compass,
  User,
  Heart,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

// --- Custom Pink Line Art SVG Icons matching the exact screenshot aesthetics ---

const SkinCareIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Woman face outline with sparkle */}
    <path d="M12 3a7 7 0 0 0-7 7c0 4 3 8 7 11 4-3 7-7 7-11a7 7 0 0 0-7-7z" />
    <path d="M9 10a1 1 0 1 0 0-.01" />
    <path d="M15 10a1 1 0 1 0 0-.01" />
    <path d="M10 14c.6.6 1.4 1 2 1s1.4-.4 2-1" />
    <path d="M19 4l.5 1.5L21 6l-1.5.5L19 8l-.5-1.5L17 6l1.5-.5z" fill="currentColor" stroke="none" />
  </svg>
);

const BodyCareIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Body silhouette & wellness figure */}
    <circle cx="12" cy="4" r="2" />
    <path d="M12 6v6m-4-3 4 2 4-2" />
    <path d="M9 14c0 3-1 6-3 7m6-7v7m3-7c0 3 1 6 3 7" />
  </svg>
);

const HairCareIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Face with flowing radiant hair */}
    <circle cx="12" cy="11" r="5" />
    <path d="M7 11c0-4 2-8 5-8s5 4 5 8" />
    <path d="M6 13c-1 3-1 6 0 8m12-8c1 3 1 6 0 8" />
    <path d="M10 12h.01m4 0h.01" />
    <path d="M11 14c.5.5 1.5.5 2 0" />
    <path d="M19 2l.5 1.5L21 4l-1.5.5L19 6l-.5-1.5L17 4l1.5-.5z" fill="currentColor" stroke="none" />
  </svg>
);

const BabyCareIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Baby feeding bottle & rattle */}
    <rect x="7" y="7" width="7" height="13" rx="2" />
    <path d="M9 4h3v3H9zM10.5 2v2" />
    <circle cx="18" cy="13" r="3" />
    <path d="M18 16v5" />
    <circle cx="10.5" cy="13" r="1" fill="currentColor" />
  </svg>
);

const LifestyleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Chic handbag & necklace */}
    <path d="M6 9h12l1 11H5L6 9z" />
    <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    <circle cx="12" cy="14" r="1.5" />
  </svg>
);

const FoodSuppsIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Supplement bottle & capsules */}
    <rect x="5" y="8" width="8" height="12" rx="2" />
    <path d="M7 5h4v3H7z" />
    <path d="M7 14h4" />
    <rect x="16" y="10" width="4" height="9" rx="2" transform="rotate(25 18 14.5)" />
  </svg>
);

const StudentPackIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Student wearing graduation cap */}
    <path d="M22 10 12 5 2 10l10 5 10-5z" />
    <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
    <path d="M22 10v6" />
  </svg>
);

const ComboIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Gift box with ribbon */}
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <rect x="4" y="12" width="16" height="9" rx="1" />
    <path d="M12 8v13M12 8a2.5 2.5 0 0 1-2.5-2.5C9.5 4.1 12 3 12 3s2.5 1.1 2.5 2.5A2.5 2.5 0 0 1 12 8z" />
  </svg>
);

const TrialIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Circular seal badge */}
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="6" strokeDasharray="2 2" />
    <path d="M12 9v6m-3-3h6" />
  </svg>
);

const SheetMaskIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Sheet mask facial shape */}
    <path d="M12 3c-4.5 0-8 3.5-8 8.5 0 4.5 3 8.5 8 8.5s8-4 8-8.5C20 6.5 16.5 3 12 3z" />
    <ellipse cx="9" cy="11" rx="1.5" ry="1" />
    <ellipse cx="15" cy="11" rx="1.5" ry="1" />
    <path d="M12 13v1.5" />
    <ellipse cx="12" cy="16.5" rx="2" ry="0.8" />
  </svg>
);

const MakeupIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Lipstick with sparkle */}
    <rect x="8" y="11" width="8" height="10" rx="1" />
    <path d="M9 11V6l6-3v8" />
    <path d="M18 5l.5 1L20 6.5l-1 .5-.5 1-.5-1-1-.5 1-.5z" fill="currentColor" stroke="none" />
  </svg>
);

const RedTruckIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Delivery truck with red/cyan highlights */}
    <path d="M1 4h13v13H1z" fill="#E53935" stroke="#E53935" fillOpacity="0.2" />
    <path d="M14 8h5l3 4v5h-8V8z" fill="#E53935" stroke="#E53935" fillOpacity="0.3" />
    <circle cx="5.5" cy="18.5" r="2.5" fill="#374151" stroke="#374151" />
    <circle cx="17.5" cy="18.5" r="2.5" fill="#374151" stroke="#374151" />
    <path d="M1 9h13" stroke="#E53935" />
  </svg>
);

// --- Category Data Structure ---

export interface SubCategory {
  name: string;
  slug: string;
  count?: number;
}

export interface CategoryModalItem {
  id: string;
  name: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  badge?: {
    text: string;
    type: "cyan" | "red";
  };
  hasArrow?: boolean;
  subcategories?: SubCategory[];
}

export const CATEGORIES_MODAL_DATA: CategoryModalItem[] = [
  {
    id: "shop-now",
    name: "Shop Now",
    slug: "shop",
    icon: RedTruckIcon,
    link: "/shop",
    badge: {
      text: "সারাদেশে শর্তহীন ফ্রি হোম ডেলিভারি!",
      type: "cyan",
    },
    hasArrow: false,
  },
  {
    id: "skin-care",
    name: "Skin Care",
    slug: "skin-care",
    icon: SkinCareIcon,
    link: "/shop?category=skin-care",
    hasArrow: true,
    subcategories: [
      { name: "Cleansers & Face Wash", slug: "cleansers", count: 18 },
      { name: "Toners & Face Mists", slug: "toners-mists", count: 14 },
      { name: "Serums & Ampoules", slug: "serums-ampoules", count: 24 },
      { name: "Moisturizers & Creams", slug: "moisturizers-creams", count: 19 },
      { name: "Sunscreen & SPF Care", slug: "sunscreen-spf", count: 16 },
      { name: "Eye Creams & Patches", slug: "eye-care", count: 8 },
    ],
  },
  {
    id: "body-care",
    name: "Body, Hand & Foot Care",
    slug: "body-care",
    icon: BodyCareIcon,
    link: "/shop?category=body-care",
    hasArrow: true,
    subcategories: [
      { name: "Body Lotions & Butter", slug: "body-lotions-creams", count: 12 },
      { name: "Body Wash & Soap", slug: "body-wash-soap", count: 10 },
      { name: "Body Scrubs & Gels", slug: "body-scrubs-gels", count: 8 },
      { name: "Hand & Foot Cream", slug: "hand-foot-cream", count: 9 },
    ],
  },
  {
    id: "hair-care",
    name: "Hair, Eye, Lip & Teeth Care",
    slug: "hair-care",
    icon: HairCareIcon,
    link: "/shop?category=hair-care",
    hasArrow: true,
    subcategories: [
      { name: "Hair Shampoo", slug: "hair-shampoo", count: 15 },
      { name: "Hair Conditioner", slug: "hair-conditioner", count: 11 },
      { name: "Hair Serum & Oil", slug: "hair-serum-oil", count: 9 },
      { name: "Lip Balms & Masks", slug: "lip-care", count: 14 },
      { name: "Oral Care & Toothpaste", slug: "oral-care", count: 6 },
    ],
  },
  {
    id: "baby-products",
    name: "Baby Product",
    slug: "baby-products",
    icon: BabyCareIcon,
    link: "/shop?category=baby-products",
    hasArrow: true,
    subcategories: [
      { name: "Baby Wash & Shampoo", slug: "baby-wash-shampoo", count: 7 },
      { name: "Baby Lotions & Creams", slug: "baby-lotions-creams", count: 8 },
      { name: "Baby Sun Protection", slug: "baby-sun-protection", count: 5 },
      { name: "Baby Cleansers & Bars", slug: "baby-cleansers-bars", count: 6 },
    ],
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    slug: "bags",
    icon: LifestyleIcon,
    link: "/shop?category=bags",
    hasArrow: true,
    subcategories: [
      { name: "Crossbody & Handbags", slug: "crossbody-handbags", count: 10 },
      { name: "Daily Canvas Totes", slug: "canvas-totes", count: 6 },
      { name: "Vanity & Cosmetic Pouches", slug: "cosmetic-pouches", count: 8 },
      { name: "Beauty Accessories & Brushes", slug: "accessories", count: 12 },
    ],
  },
  {
    id: "food-supps",
    name: "Food & Supplement",
    slug: "food-supps",
    icon: FoodSuppsIcon,
    link: "/shop?category=food-supps",
    hasArrow: true,
    subcategories: [
      { name: "Collagen Supplements", slug: "collagen-supplements", count: 8 },
      { name: "Probiotics & Digestion", slug: "probiotics-digestion", count: 6 },
      { name: "Korean Red Ginseng", slug: "red-ginseng", count: 5 },
      { name: "Vitamins & Diet Tea", slug: "vitamins-diet-tea", count: 7 },
    ],
  },
  {
    id: "student-pack",
    name: "Student Pack",
    slug: "student-pack",
    icon: StudentPackIcon,
    link: "/shop?filter=featured",
    hasArrow: false,
  },
  {
    id: "combo",
    name: "Combo",
    slug: "combo-set",
    icon: ComboIcon,
    link: "/shop?category=combo-set",
    badge: {
      text: "OFFER",
      type: "red",
    },
    hasArrow: false,
    subcategories: [
      { name: "Skincare Routines", slug: "skincare-routines", count: 6 },
      { name: "Trial & Travel Kits", slug: "travel-kits", count: 8 },
      { name: "Festive Gift Boxes", slug: "gift-boxes", count: 5 },
    ],
  },
  {
    id: "trial-version",
    name: "Trial Version",
    slug: "trial-version",
    icon: TrialIcon,
    link: "/shop?sort=newest",
    hasArrow: false,
  },
  {
    id: "sheet-mask",
    name: "Sheet Mask",
    slug: "sheet-mask",
    icon: SheetMaskIcon,
    link: "/shop?category=skin-care",
    hasArrow: false,
  },
  {
    id: "makeup",
    name: "Makeup",
    slug: "makeup",
    icon: MakeupIcon,
    link: "/shop?category=makeup",
    hasArrow: true,
    subcategories: [
      { name: "Cushion & Foundation", slug: "cushion-foundation", count: 12 },
      { name: "B.B Cream & Primer", slug: "bb-cream", count: 9 },
      { name: "Lip Tint & Velvet Sticks", slug: "lip-tint", count: 18 },
      { name: "Eye & Brow Makeup", slug: "eye-brow", count: 14 },
    ],
  },
];

// --- Menu Tab Items ---
const MENU_TAB_ITEMS = [
  { name: "Home Storefront", path: "/", icon: Compass },
  { name: "Shop All Authentic Products", path: "/shop", icon: ShoppingBag },
  { name: "Top Selling Bestsellers", path: "/top-selling", icon: Flame, badge: "HOT" },
  { name: "New Korean Arrivals", path: "/shop?sort=newest", icon: Sparkles, badge: "NEW" },
  { name: "Featured Luxury Deals", path: "/shop?filter=featured", icon: Heart },
  { name: "Top Brand Directory", path: "/brands", icon: ShoppingBag },
  { name: "Order Tracking Logistics", path: "/track-order", icon: Truck },
  { name: "User Account Dashboard", path: "/user-dashboard", icon: User },
  { name: "Customer Helpdesk & FAQ", path: "/contact", icon: HelpCircle },
];

export interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategoriesModal: React.FC<CategoriesModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"CATEGORIES" | "MENU">("CATEGORIES");
  const [hoveredCategory, setHoveredCategory] = useState<CategoryModalItem | null>(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCategoryClick = (cat: CategoryModalItem) => {
    navigate(cat.link);
    onClose();
  };

  const handleSubcategoryClick = (cat: CategoryModalItem, sub: SubCategory) => {
    navigate(`/shop?category=${cat.slug}&subcategory=${sub.slug}`);
    onClose();
  };

  const toggleMobileSub = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMobileExpandedCat(mobileExpandedCat === catId ? null : catId);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-start select-none">
      {/* 1. Backdrop Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
      />

      {/* Floating Close Button for Desktop & Tablet */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 z-30 p-2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-all cursor-pointer left-[324px] sm:left-[334px]"
        title="Close Categories Menu (ESC)"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      {/* 2. Main Left-Docked Drawer matching Screenshot */}
      <div
        className="relative z-20 w-full max-w-[310px] sm:max-w-[320px] h-full bg-white dark:bg-[#0E131F] shadow-2xl border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden animate-in slide-in-from-left duration-200"
      >
        {/* Dual Tabs Bar: CATEGORIES and MENU */}
        <div className="grid grid-cols-2 border-b border-gray-200 dark:border-gray-800 bg-[#F4F4F4] dark:bg-[#141A26] shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab("CATEGORIES");
              setHoveredCategory(null);
            }}
            className={`py-3.5 px-4 text-center text-xs sm:text-sm font-black tracking-wider transition-all cursor-pointer relative ${
              activeTab === "CATEGORIES"
                ? "bg-[#EAEAEA] dark:bg-[#1A2230] text-gray-900 dark:text-white"
                : "bg-[#F7F7F7] dark:bg-[#0E131F] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <span>CATEGORIES</span>
            {activeTab === "CATEGORIES" && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E91E63]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("MENU");
              setHoveredCategory(null);
            }}
            className={`py-3.5 px-4 text-center text-xs sm:text-sm font-bold tracking-wider transition-all cursor-pointer relative ${
              activeTab === "MENU"
                ? "bg-[#EAEAEA] dark:bg-[#1A2230] text-gray-900 dark:text-white font-black"
                : "bg-[#F7F7F7] dark:bg-[#0E131F] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <span>MENU</span>
            {activeTab === "MENU" && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E91E63]" />
            )}
          </button>
        </div>

        {/* Tab Content List Container */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/80 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          {activeTab === "CATEGORIES" ? (
            CATEGORIES_MODAL_DATA.map((cat) => {
              const Icon = cat.icon;
              const hasSubs = cat.subcategories && cat.subcategories.length > 0;
              const isMobileExpanded = mobileExpandedCat === cat.id;
              const isHovered = hoveredCategory?.id === cat.id;

              return (
                <div
                  key={cat.id}
                  onMouseEnter={() => hasSubs && setHoveredCategory(cat)}
                  className={`transition-colors group ${
                    isHovered
                      ? "bg-pink-50/70 dark:bg-pink-950/20"
                      : "hover:bg-gray-50/80 dark:hover:bg-gray-800/40"
                  }`}
                >
                  <div className="flex items-stretch justify-between min-h-[48px]">
                    {/* Left: Icon + Title + Badges */}
                    <div
                      onClick={() => handleCategoryClick(cat)}
                      className="flex-1 flex items-center gap-3 px-3.5 py-3 cursor-pointer min-w-0"
                    >
                      <div className="w-5 h-5 flex items-center justify-center shrink-0 text-[#E91E63]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[13px] font-medium text-gray-800 dark:text-gray-100 group-hover:text-[#E91E63] transition-colors truncate">
                        {cat.name}
                      </span>

                      {/* Pill Badge (e.g. Free Delivery or OFFER) */}
                      {cat.badge && (
                        cat.badge.type === "cyan" ? (
                          <span className="ml-1 bg-[#00A3C4] hover:bg-[#0092B0] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs leading-tight whitespace-nowrap">
                            {cat.badge.text}
                          </span>
                        ) : (
                          <span className="ml-1 bg-[#E53935] text-white text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-2xs whitespace-nowrap">
                            {cat.badge.text}
                          </span>
                        )
                      )}
                    </div>

                    {/* Right: Vertical line with right chevron box for categories with subcategories */}
                    {cat.hasArrow && (
                      <button
                        type="button"
                        onClick={(e) => toggleMobileSub(cat.id, e)}
                        className="w-11 flex items-center justify-center border-l border-gray-100 dark:border-gray-800/80 text-gray-400 group-hover:text-[#E91E63] hover:bg-gray-100/60 dark:hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
                        aria-label={`View subcategories for ${cat.name}`}
                      >
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-150 ${
                            isMobileExpanded ? "rotate-90 text-[#E91E63]" : "group-hover:translate-x-0.5"
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Mobile Accordion Subcategories (Inline for touch devices) */}
                  {hasSubs && isMobileExpanded && (
                    <div className="sm:hidden px-4 py-2 bg-gray-50/80 dark:bg-gray-900/60 border-t border-gray-100 dark:border-gray-800 space-y-1">
                      {cat.subcategories?.map((sub) => (
                        <button
                          key={sub.slug}
                          onClick={() => handleSubcategoryClick(cat, sub)}
                          className="w-full text-left py-1.5 px-3 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-[#E91E63] hover:bg-white dark:hover:bg-gray-800 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>{sub.name}</span>
                          {sub.count && (
                            <span className="text-[10px] text-gray-400">({sub.count})</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            // MENU Tab Items
            MENU_TAB_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3.5 hover:bg-pink-50/50 dark:hover:bg-gray-800/40 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-6 h-6 flex items-center justify-center shrink-0 text-[#E91E63] group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[13px] sm:text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-[#E91E63] transition-colors">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-[#E91E63] text-white shadow-2xs">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#E91E63] transition-colors" />
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Modal Bottom Footer / Quick Action */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-[#FAF7F5] dark:bg-[#090D14] flex items-center justify-between text-xs shrink-0">
          <Link
            to="/shop"
            onClick={onClose}
            className="text-[#E91E63] font-bold hover:underline inline-flex items-center gap-1"
          >
            <span>Explore All 1,000+ Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-[10px] text-gray-400">100% Authentic</span>
        </div>
      </div>

      {/* 3. Desktop Subcategory Flyout Panel (Positioned on the right of Categories list) */}
      {activeTab === "CATEGORIES" && hoveredCategory && hoveredCategory.subcategories && (
        <div
          onMouseEnter={() => setHoveredCategory(hoveredCategory)}
          onMouseLeave={() => setHoveredCategory(null)}
          className="hidden sm:block relative z-20 w-72 h-full bg-white dark:bg-[#111726] shadow-2xl border-r border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-150"
        >
          {/* Header of Flyout */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-[#F4F4F4] dark:bg-[#141A26]">
            <div className="flex items-center gap-2 text-[#E91E63] font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>{hoveredCategory.name}</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              Browse subcategories & curated routines
            </p>
          </div>

          {/* Subcategories List */}
          <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-130px)] scrollbar-thin">
            {hoveredCategory.subcategories.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => handleSubcategoryClick(hoveredCategory, sub)}
                className="w-full text-left p-2.5 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-[#E91E63] hover:bg-pink-50/60 dark:hover:bg-[#E91E63]/20 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E91E63]/40 group-hover:bg-[#E91E63] transition-colors" />
                  <span>{sub.name}</span>
                </div>
                {sub.count && (
                  <span className="text-[10px] text-gray-400 group-hover:text-[#E91E63] font-normal">
                    {sub.count} items
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Flyout Footer: View All in this Category */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-[#FAF7F5] dark:bg-[#141A26] absolute bottom-0 left-0 right-0">
            <button
              onClick={() => handleCategoryClick(hoveredCategory)}
              className="w-full py-2 rounded-xl bg-[#E91E63] hover:bg-[#D81B60] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View All {hoveredCategory.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesModal;
