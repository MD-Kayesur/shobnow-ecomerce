// ============================================================================
// CENTRALIZED STOREFRONT & APPLICATION DATA (src/data/data.ts)
// ============================================================================
// All static and mock datasets in this project are centralized in this file.
// Components must NEVER declare mock or static datasets inline.
// ============================================================================

// --- 1. ASSET IMPORTS ---
// Hero Banner Images
import pujaBanner from "@/assets/banners/banner-puja.jpg";
import skincareBanner from "@/assets/banners/banner-skincare.jpg";
import makeupBanner from "@/assets/banners/banner-makeup.jpg";

// Landing Page Category Circle Cutout Images (12 Categories)
import catSkincare from "@/assets/categories/cat-skincare.png";
import catPersonalcare from "@/assets/categories/cat-personalcare.png";
import catMakeup from "@/assets/categories/cat-makeup.png";
import catLipcare from "@/assets/categories/cat-lipcare.png";
import catHaircare from "@/assets/categories/cat-haircare.png";
import catFragrance from "@/assets/categories/cat-fragrance.png";
import catFoodsupps from "@/assets/categories/cat-foodsupps.png";
import catComboset from "@/assets/categories/cat-comboset.png";
import catBodycare from "@/assets/categories/cat-bodycare.png";
import catBags from "@/assets/categories/cat-bags.png";
import catBabyproducts from "@/assets/categories/cat-babyproducts.png";
import catAccessories from "@/assets/categories/cat-accessories.png";

// Brand Marquee Logos (Choice Legacy authentic brand partners)
import brand1 from "@/assets/brands/brand-1.png";
import brand2 from "@/assets/brands/brand-2.png";
import brand3 from "@/assets/brands/brand-3.png";
import brand4 from "@/assets/brands/brand-4.png";
import brand5 from "@/assets/brands/brand-5.png";
import brand6 from "@/assets/brands/brand-6.png";
import brand7 from "@/assets/brands/brand-7.png";
import brand8 from "@/assets/brands/brand-8.png";
import brand9 from "@/assets/brands/brand-9.png";
import brand10 from "@/assets/brands/brand-10.png";

// Top Brands 20 Grid Logos (Matching Screenshot)
import topBrandAnua from "@/assets/brands/top-brand-anua.png";
import topBrandAplb from "@/assets/brands/top-brand-aplb.png";
import topBrandArencia from "@/assets/brands/top-brand-arencia.png";
import topBrandAxisY from "@/assets/brands/top-brand-axis-y.png";
import topBrandBeaute from "@/assets/brands/top-brand-beaute.png";
import topBrandBeautyOfJoseon from "@/assets/brands/top-brand-beauty-of-joseon.png";
import topBrandCarenel from "@/assets/brands/top-brand-carenel.png";
import topBrandCelimax from "@/assets/brands/top-brand-celimax.png";
import topBrandCosrx from "@/assets/brands/top-brand-cosrx.png";
import topBrandDabo from "@/assets/brands/top-brand-dabo.png";
import topBrandDrAlthea from "@/assets/brands/top-brand-dr-althea.png";
import topBrandNatureSkin from "@/assets/brands/top-brand-nature-skin.png";
import topBrandImFrom from "@/assets/brands/top-brand-im-from.png";
import topBrandIunik from "@/assets/brands/top-brand-iunik.png";
import topBrandMedicube from "@/assets/brands/top-brand-medicube.png";
import topBrandMissha from "@/assets/brands/top-brand-missha.png";
import topBrandPurito from "@/assets/brands/top-brand-purito.png";
import topBrandSkin1004 from "@/assets/brands/top-brand-skin1004.png";
import topBrandDeciem from "@/assets/brands/top-brand-deciem.png";
import topBrandTheFaceShop from "@/assets/brands/top-brand-the-face-shop.png";

// Product Details & Related Jars Assets
import vivviraMain from "@/assets/products/vivvira-main.jpg";
import vivviraThumb1 from "@/assets/products/vivvira-thumb-1.jpg";
import vivviraThumb2 from "@/assets/products/vivvira-thumb-2.jpg";
import vivviraThumb3 from "@/assets/products/vivvira-thumb-3.jpg";
import prodBienPink from "@/assets/products/prod-bien-pink.jpg";
import prodRedJars from "@/assets/products/prod-red-jars.jpg";
import prodPeachColvea from "@/assets/products/prod-peach-colvea.jpg";
import prodGreenJar from "@/assets/products/prod-green-jar.jpg";

// Promo & Featured Banners Assets
import bannerAugust from "@/assets/banners/banner-august-deals.jpg";
import featGreen from "@/assets/banners/feat-green.jpg";
import featCenter from "@/assets/banners/feat-center.jpg";
import featDenim from "@/assets/banners/feat-denim.jpg";
import heroEkos from "@/assets/banners/hero-ekos-maracuja.jpg";
import heroActiveC from "@/assets/banners/hero-active-c.jpg";
import promoPinkSkincare from "@/assets/banners/promo-pink-skincare.jpg";

// ============================================================================
// 1. HERO BANNER SLIDES DATA
// ============================================================================
export interface BannerSlide {
  id: number;
  image: string;
  alt: string;
  link: string;
}

export const HERO_BANNER_SLIDES: BannerSlide[] = [
  {
    id: 1,
    image: pujaBanner,
    alt: "Durga Puja Dhamaka Offer - Flat 15% Off with Free Delivery",
    link: "/offers",
  },
  {
    id: 2,
    image: skincareBanner,
    alt: "Glow Like Never Before - Premium K-Beauty Skincare Collection",
    link: "/category/skin-care",
  },
  {
    id: 3,
    image: makeupBanner,
    alt: "Festival Glamour Makeup Special - Buy 2 Get 1 Free",
    link: "/category/makeup",
  },
];

// Helper to provide duplicated loop slides for seamless Swiper 3-card peeking
export const getExtendedBannerSlides = (): BannerSlide[] => [
  ...HERO_BANNER_SLIDES,
  ...HERO_BANNER_SLIDES.map((slide, idx) => ({
    ...slide,
    id: slide.id + 100 + idx,
  })),
];

// ============================================================================
// 2. BRAND MARQUEE LOGOS DATA
// ============================================================================
export interface MarqueeBrandItem {
  id: number;
  name: string;
  logo: string;
  url?: string;
}

export const BRAND_MARQUEE_LIST: MarqueeBrandItem[] = [
  { id: 1, name: "APLB", logo: brand1 },
  { id: 2, name: "medicube", logo: brand2 },
  { id: 3, name: "CeraVe", logo: brand3 },
  { id: 4, name: "COSRX", logo: brand4 },
  { id: 5, name: "K-SECRET", logo: brand5 },
  { id: 6, name: "L'ORÉAL PARIS", logo: brand6 },
  { id: 7, name: "AXIS-Y", logo: brand7 },
  { id: 8, name: "Simple", logo: brand8 },
  { id: 9, name: "isntree", logo: brand9 },
  { id: 10, name: "iUNIK", logo: brand10 },
];

// ============================================================================
// 2B. TOP BRANDS GRID DATA (20 BRANDS MATCHING SCREENSHOT 4x5 GRID)
// ============================================================================
export interface TopBrandItem {
  id: number;
  name: string;
  slug: string;
  logo: string;
  link: string;
}

export const TOP_BRANDS_GRID: TopBrandItem[] = [
  { id: 1, name: "Anua", slug: "anua", logo: topBrandAnua, link: "/shop?brand=Anua" },
  { id: 2, name: "APLB", slug: "aplb", logo: topBrandAplb, link: "/shop?brand=APLB" },
  { id: 3, name: "Arencia", slug: "arencia", logo: topBrandArencia, link: "/shop?brand=Arencia" },
  { id: 4, name: "AXIS-Y", slug: "axis-y", logo: topBrandAxisY, link: "/shop?brand=AXIS-Y" },
  { id: 5, name: "BEAUTÉ", slug: "beaute", logo: topBrandBeaute, link: "/shop?brand=BEAUTÉ" },
  { id: 6, name: "Beauty of Joseon", slug: "beauty-of-joseon", logo: topBrandBeautyOfJoseon, link: "/shop?brand=Beauty%20of%20Joseon" },
  { id: 7, name: "CARE:NEL", slug: "carenel", logo: topBrandCarenel, link: "/shop?brand=CARE:NEL" },
  { id: 8, name: "celimax", slug: "celimax", logo: topBrandCelimax, link: "/shop?brand=celimax" },
  { id: 9, name: "COSRX", slug: "cosrx", logo: topBrandCosrx, link: "/shop?brand=COSRX" },
  { id: 10, name: "DABO", slug: "dabo", logo: topBrandDabo, link: "/shop?brand=Dabo" },
  { id: 11, name: "Dr. Althea", slug: "dr-althea", logo: topBrandDrAlthea, link: "/shop?brand=Dr.%20Althea" },
  { id: 12, name: "Nature Skin", slug: "nature-skin", logo: topBrandNatureSkin, link: "/shop?brand=Nature%20Skin" },
  { id: 13, name: "I'm from", slug: "im-from", logo: topBrandImFrom, link: "/shop?brand=I%27m%20from" },
  { id: 14, name: "iUNIK", slug: "iunik", logo: topBrandIunik, link: "/shop?brand=iUNIK" },
  { id: 15, name: "medicube", slug: "medicube", logo: topBrandMedicube, link: "/shop?brand=medicube" },
  { id: 16, name: "MISSHA", slug: "missha", logo: topBrandMissha, link: "/shop?brand=Missha" },
  { id: 17, name: "Purito", slug: "purito", logo: topBrandPurito, link: "/shop?brand=Purito" },
  { id: 18, name: "SKIN1004", slug: "skin1004", logo: topBrandSkin1004, link: "/shop?brand=SKIN1004" },
  { id: 19, name: "DECIEM", slug: "deciem", logo: topBrandDeciem, link: "/shop?brand=DECIEM" },
  { id: 20, name: "THE FACE SHOP", slug: "the-face-shop", logo: topBrandTheFaceShop, link: "/shop?brand=THE%20FACE%20SHOP" },
];

// ============================================================================
// 3. BRAND CATEGORIES (12 CATEGORIES MATCHING LANDING PAGE VISUAL)
// ============================================================================
export interface BrandCategoryItem {
  id: number;
  title: string;
  slug: string;
  image: string;
  bgColor: string;
  link: string;
  subtitle: string;
  badge?: string;
  itemCount: number;
}

export const BRAND_CATEGORIES_DATA: BrandCategoryItem[] = [
  {
    id: 1,
    title: "Skin Care",
    slug: "skin-care",
    image: catSkincare,
    bgColor: "#e6f4f1",
    link: "/shop?category=skin-care",
    subtitle: "Cleanse & Hydrate",
    badge: "Popular",
    itemCount: 10,
  },
  {
    id: 2,
    title: "Personal Care",
    slug: "personal-care",
    image: catPersonalcare,
    bgColor: "#d6edfb",
    link: "/shop?category=personal-care",
    subtitle: "Daily Hygiene",
    itemCount: 10,
  },
  {
    id: 3,
    title: "Makeup",
    slug: "makeup",
    image: catMakeup,
    bgColor: "#edeef8",
    link: "/shop?category=makeup",
    subtitle: "Glow & Glamour",
    badge: "Trending",
    itemCount: 10,
  },
  {
    id: 4,
    title: "Lip Care",
    slug: "lip-care",
    image: catLipcare,
    bgColor: "#fad7dd",
    link: "/shop?category=lip-care",
    subtitle: "Tint & Moisture",
    badge: "Hot",
    itemCount: 10,
  },
  {
    id: 5,
    title: "Hair Care",
    slug: "hair-care",
    image: catHaircare,
    bgColor: "#fae9d9",
    link: "/shop?category=hair-care",
    subtitle: "Shine & Repair",
    itemCount: 10,
  },
  {
    id: 6,
    title: "Fragrance",
    slug: "fragrance",
    image: catFragrance,
    bgColor: "#eff0f7",
    link: "/shop?category=fragrance",
    subtitle: "Scents & Mists",
    itemCount: 10,
  },
  {
    id: 7,
    title: "Food & Supps",
    slug: "food-supps",
    image: catFoodsupps,
    bgColor: "#fbdad5",
    link: "/shop?category=food-supps",
    subtitle: "Collagen & Health",
    itemCount: 10,
  },
  {
    id: 8,
    title: "Combo Set",
    slug: "combo-set",
    image: catComboset,
    bgColor: "#d6edfb",
    link: "/shop?category=combo-set",
    subtitle: "Gift Sets & Bundles",
    badge: "Save 20%",
    itemCount: 10,
  },
  {
    id: 9,
    title: "Body Care",
    slug: "body-care",
    image: catBodycare,
    bgColor: "#faf8df",
    link: "/shop?category=body-care",
    subtitle: "Lotion & Scrubs",
    itemCount: 10,
  },
  {
    id: 10,
    title: "Bags",
    slug: "bags",
    image: catBags,
    bgColor: "#f9e8d8",
    link: "/shop?category=bags",
    subtitle: "Vanity & Pouches",
    itemCount: 10,
  },
  {
    id: 11,
    title: "Baby Products",
    slug: "baby-products",
    image: catBabyproducts,
    bgColor: "#dee8f7",
    link: "/shop?category=baby-products",
    subtitle: "Gentle & Mild",
    itemCount: 10,
  },
  {
    id: 12,
    title: "Accessories",
    slug: "accessories",
    image: catAccessories,
    bgColor: "#e6f4f1",
    link: "/shop?category=accessories",
    subtitle: "Beauty Tools",
    itemCount: 10,
  },
];

// ============================================================================
// 4. NAVBAR NAVIGATION CATEGORIES DATA
// ============================================================================
export interface NavCategoryItem {
  label: string;
  path: string;
  isSpecial?: boolean;
}

export const NAV_CATEGORIES: NavCategoryItem[] = [
  { label: "SKIN CARE", path: "/shop?category=skin-care" },
  { label: "MAKEUP", path: "/shop?category=makeup" },
  { label: "HAIR CARE", path: "/shop?category=hair-care" },
  { label: "BABY CARE", path: "/shop?category=baby-products" },
  { label: "LIP CARE", path: "/shop?category=lip-care" },
  { label: "FRAGRANCE", path: "/shop?category=fragrance" },
  { label: "OFFERS", path: "/offers", isSpecial: true },
];

// ============================================================================
// 5. FOOTER STATIC LINKS & PAYMENT METHODS DATA
// ============================================================================
export interface FooterLinkItem {
  label: string;
  path: string;
}

export interface PaymentLogoItem {
  name: string;
  color: string;
  bg: string;
  border: string;
}

export const FOOTER_ABOUT_LINKS: FooterLinkItem[] = [
  { label: "Contact", path: "/contact" },
  { label: "About Us", path: "/about" },
  { label: "Career", path: "/career" },
];

export const FOOTER_HELP_LINKS: FooterLinkItem[] = [
  { label: "Terms & Condition", path: "/terms" },
  { label: "Privacy Policy", path: "/privacy" },
];

export const FOOTER_POLICY_LINKS: FooterLinkItem[] = [
  { label: "Refund & Return Policy", path: "/refund-policy" },
  { label: "Delivery Policy", path: "/delivery-policy" },
];

export const PAYMENT_LOGOS: PaymentLogoItem[] = [
  { name: "VISA", color: "#1A1F71", bg: "#f8f9fa", border: "#e2e8f0" },
  { name: "Mastercard", color: "#EB001B", bg: "#fff", border: "#e2e8f0" },
  { name: "AMEX", color: "#006FCF", bg: "#f0f7ff", border: "#b8d9fc" },
  { name: "UnionPay", color: "#C61D23", bg: "#fff", border: "#e2e8f0" },
  { name: "Diners", color: "#004B87", bg: "#f8f9fa", border: "#e2e8f0" },
  { name: "JCB", color: "#003A80", bg: "#fff", border: "#e2e8f0" },
  { name: "bKash", color: "#E2136E", bg: "#FFF0F6", border: "#FFADD2" },
  { name: "Nagad", color: "#E62E04", bg: "#FFF2E8", border: "#FFBB96" },
  { name: "Rocket", color: "#8C3494", bg: "#F9F0FF", border: "#D3ADF7" },
  { name: "Upay", color: "#005BAA", bg: "#E6F4FF", border: "#91CAFF" },
  { name: "City Bank", color: "#00529B", bg: "#fff", border: "#e2e8f0" },
  { name: "BRAC Bank", color: "#004884", bg: "#fff", border: "#e2e8f0" },
  { name: "EBL", color: "#0072BC", bg: "#fff", border: "#e2e8f0" },
  { name: "DBBL", color: "#00833E", bg: "#fff", border: "#e2e8f0" },
  { name: "tap", color: "#0081C9", bg: "#fff", border: "#e2e8f0" },
  { name: "OK Wallet", color: "#00A859", bg: "#fff", border: "#e2e8f0" },
];

// ============================================================================
// 6. SHOP CATALOG, FILTERS & MOCK PRODUCTS DATA
// ============================================================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockQuantity: number;
  image: string;
  hoverImage?: string;
  description: string;
  volume: string;
  tags?: string[];
  skinType?: string[];
  skinConcern?: string[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  sku?: string;
  productType?: string;
  sizes?: string[];
  galleryImages?: string[];
  keyFeatures?: string[];
  ingredients?: string;
  howToUse?: string;
  editorNote?: string;
}

export interface CategorySubItem {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  count: number;
  subcategories: CategorySubItem[];
}

export interface BrandItem {
  id: string;
  name: string;
  count: number;
}

export interface SortOption {
  id: string;
  label: string;
}

export interface ShopFilterState {
  search: string;
  category: string;
  subcategory: string;
  selectedBrands: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  onSaleOnly: boolean;
  rating: number | null;
  skinConcern: string;
  sortBy: string;
}

export const PRICE_LIMITS = {
  min: 150,
  max: 6500,
  step: 50,
};

export const SORT_OPTIONS: SortOption[] = [
  { id: "popularity", label: "Popularity" },
  { id: "rating", label: "Average Rating" },
  { id: "newest", label: "Newness" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
];

export const SKIN_CONCERNS: string[] = [
  "All Concerns",
  "Acne & Blemishes",
  "Brightening & Dark Spots",
  "Hydration & Dryness",
  "Pore Care & Oil Control",
  "Sun Protection",
  "Anti-Aging & Firming",
  "Redness & Calming",
];

// All 12 Categories for Shop Filter Sidebar
export const SHOP_CATEGORIES: CategoryItem[] = [
  {
    id: "skin-care",
    name: "Skin Care",
    slug: "skin-care",
    count: 10,
    subcategories: [
      { id: "cleanser", name: "Cleansers", slug: "cleanser", count: 2 },
      { id: "toner", name: "Toners & Mists", slug: "toner", count: 2 },
      { id: "serum", name: "Serums & Ampoules", slug: "serum", count: 3 },
      { id: "moisturizer", name: "Moisturizers & Creams", slug: "moisturizer", count: 1 },
      { id: "sunscreen", name: "Sunscreen & SPF", slug: "sunscreen", count: 2 },
    ],
  },
  {
    id: "personal-care",
    name: "Personal Care",
    slug: "personal-care",
    count: 10,
    subcategories: [
      { id: "oral-care", name: "Oral Care", slug: "oral-care", count: 2 },
      { id: "shaving", name: "Shaving & Grooming", slug: "shaving", count: 2 },
      { id: "deodorant", name: "Deodorant & Mist", slug: "deodorant", count: 2 },
      { id: "intimate-care", name: "Intimate Care", slug: "intimate-care", count: 2 },
      { id: "sanitizer", name: "Sanitizer & Hygiene", slug: "sanitizer", count: 2 },
    ],
  },
  {
    id: "makeup",
    name: "Makeup",
    slug: "makeup",
    count: 10,
    subcategories: [
      { id: "cushion", name: "Cushion & Foundation", slug: "cushion", count: 3 },
      { id: "bb-cream", name: "B.B Cream", slug: "bb-cream", count: 2 },
      { id: "powder", name: "Powder & Primer", slug: "powder", count: 2 },
      { id: "eyebrow", name: "Eye & Brow Makeup", slug: "eyebrow", count: 3 },
    ],
  },
  {
    id: "lip-care",
    name: "Lip Care",
    slug: "lip-care",
    count: 10,
    subcategories: [
      { id: "lip-mask", name: "Lip Sleeping Masks", slug: "lip-mask", count: 2 },
      { id: "lip-tint", name: "Lip Tint & Gloss", slug: "lip-tint", count: 3 },
      { id: "lip-balm", name: "Lip Balms & Sticks", slug: "lip-balm", count: 3 },
      { id: "lip-scrub", name: "Lip Scrubs & Oils", slug: "lip-scrub", count: 2 },
    ],
  },
  {
    id: "hair-care",
    name: "Hair Care",
    slug: "hair-care",
    count: 10,
    subcategories: [
      { id: "shampoo", name: "Hair Shampoo", slug: "shampoo", count: 3 },
      { id: "conditioner", name: "Hair Conditioner", slug: "conditioner", count: 2 },
      { id: "hair-serum", name: "Hair Serum & Oil", slug: "hair-serum", count: 3 },
      { id: "hair-treatment", name: "Scalp Tonic & Mask", slug: "hair-treatment", count: 2 },
    ],
  },
  {
    id: "fragrance",
    name: "Fragrance",
    slug: "fragrance",
    count: 10,
    subcategories: [
      { id: "eau-de-parfum", name: "Eau De Parfum", slug: "eau-de-parfum", count: 3 },
      { id: "body-mist", name: "Dress & Body Mist", slug: "body-mist", count: 3 },
      { id: "hair-perfume", name: "Hair & Fabric Perfume", slug: "hair-perfume", count: 2 },
      { id: "diffuser", name: "Diffusers & Rollers", slug: "diffuser", count: 2 },
    ],
  },
  {
    id: "food-supps",
    name: "Food & Supps",
    slug: "food-supps",
    count: 10,
    subcategories: [
      { id: "collagen", name: "Collagen Supplements", slug: "collagen", count: 4 },
      { id: "probiotics", name: "Probiotics & Digestion", slug: "probiotics", count: 2 },
      { id: "korean-ginseng", name: "Korean Red Ginseng", slug: "korean-ginseng", count: 2 },
      { id: "vitamins", name: "Vitamins & Diet Tea", slug: "vitamins", count: 2 },
    ],
  },
  {
    id: "combo-set",
    name: "Combo Set",
    slug: "combo-set",
    count: 10,
    subcategories: [
      { id: "skincare-combo", name: "Skincare Routines", slug: "skincare-combo", count: 5 },
      { id: "travel-kit", name: "Trial & Travel Kits", slug: "travel-kit", count: 3 },
      { id: "festive-gift", name: "Festive Gift Boxes", slug: "festive-gift", count: 2 },
    ],
  },
  {
    id: "body-care",
    name: "Body Care",
    slug: "body-care",
    count: 10,
    subcategories: [
      { id: "body-lotion", name: "Body Lotions & Creams", slug: "body-lotion", count: 4 },
      { id: "body-wash", name: "Body Wash & Soap", slug: "body-wash", count: 3 },
      { id: "body-scrub", name: "Body Scrubs & Gels", slug: "body-scrub", count: 2 },
      { id: "hand-cream", name: "Hand & Foot Cream", slug: "hand-cream", count: 1 },
    ],
  },
  {
    id: "bags",
    name: "Bags",
    slug: "bags",
    count: 10,
    subcategories: [
      { id: "crossbody", name: "Crossbody & Handbags", slug: "crossbody", count: 3 },
      { id: "tote-bag", name: "Daily Canvas Totes", slug: "tote-bag", count: 2 },
      { id: "vanity-pouch", name: "Vanity & Cosmetic Pouches", slug: "vanity-pouch", count: 3 },
      { id: "cosmetic-case", name: "Travel Makeup Cases", slug: "cosmetic-case", count: 2 },
    ],
  },
  {
    id: "baby-products",
    name: "Baby Products",
    slug: "baby-products",
    count: 10,
    subcategories: [
      { id: "baby-wash", name: "Baby Wash & Shampoo", slug: "baby-wash", count: 4 },
      { id: "baby-lotion", name: "Baby Lotions & Creams", slug: "baby-lotion", count: 3 },
      { id: "baby-sunscreen", name: "Baby Sun Protection", slug: "baby-sunscreen", count: 2 },
      { id: "diaper-cream", name: "Baby Cleansers & Bars", slug: "diaper-cream", count: 1 },
    ],
  },
  {
    id: "accessories",
    name: "Accessories",
    slug: "accessories",
    count: 10,
    subcategories: [
      { id: "beauty-blender", name: "Sponges & Puffs", slug: "beauty-blender", count: 3 },
      { id: "brush-sets", name: "Makeup Brush Sets", slug: "brush-sets", count: 2 },
      { id: "spa-tools", name: "Facial Rollers & Gua Sha", slug: "spa-tools", count: 2 },
      { id: "bath-mitts", name: "Exfoliating Mitts & Net", slug: "bath-mitts", count: 3 },
    ],
  },
];

export const SHOP_BRANDS: BrandItem[] = [
  { id: "anua", name: "Anua", count: 12 },
  { id: "aplb", name: "APLB", count: 10 },
  { id: "arencia", name: "Arencia", count: 6 },
  { id: "axis-y", name: "AXIS-Y", count: 11 },
  { id: "beaute", name: "BEAUTÉ", count: 5 },
  { id: "beauty-of-joseon", name: "Beauty of Joseon", count: 16 },
  { id: "carenel", name: "CARE:NEL", count: 7 },
  { id: "celimax", name: "celimax", count: 8 },
  { id: "cosrx", name: "COSRX", count: 15 },
  { id: "dabo", name: "Dabo", count: 12 },
  { id: "dr-althea", name: "Dr. Althea", count: 6 },
  { id: "nature-skin", name: "Nature Skin", count: 9 },
  { id: "im-from", name: "I'm from", count: 8 },
  { id: "iunik", name: "iUNIK", count: 7 },
  { id: "medicube", name: "medicube", count: 14 },
  { id: "missha", name: "Missha", count: 12 },
  { id: "purito", name: "Purito", count: 8 },
  { id: "skin1004", name: "SKIN1004", count: 14 },
  { id: "deciem", name: "DECIEM", count: 6 },
  { id: "the-face-shop", name: "THE FACE SHOP", count: 9 },
  { id: "tirtir", name: "Tirtir", count: 18 },
  { id: "laneige", name: "Laneige", count: 9 },
  { id: "romand", name: "Rom&nd", count: 8 },
  { id: "aromatica", name: "AROMATICA", count: 8 },
  { id: "kundal", name: "Kundal", count: 6 },
  { id: "torriden", name: "Torriden", count: 6 },
  { id: "green-finger", name: "Green Finger", count: 5 },
  { id: "pyunkang-yul", name: "Pyunkang Yul", count: 7 },
  { id: "isntree", name: "Isntree", count: 6 },
  { id: "round-lab", name: "Round Lab", count: 6 },
  { id: "wdressroom", name: "W.Dressroom", count: 4 },
  { id: "lemona", name: "Lemona", count: 4 },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    "id": "prod-tirtir-ampoule",
    "name": "Tirtir Ceramic Milk Ampoule",
    "slug": "tirtir-ceramic-milk-ampoule",
    "brand": "Tirtir",
    "productType": "Ampoule",
    "sku": "CL100827",
    "category": "skin-care",
    "subcategory": "serum",
    "price": 2999,
    "originalPrice": 3299,
    "discountPercent": 9,
    "rating": 5,
    "reviewsCount": 18,
    "inStock": true,
    "stockQuantity": 9,
    "image": "https://choicelegacy.com.bd/cdn/shop/files/imgi_7_1_105982fa-cfe5-443f-b13b-cad0f6355e8b.webp?v=1777210432",
    "hoverImage": "https://choicelegacy.com.bd/cdn/shop/files/imgi_10_4_f22eaad1-0235-40f5-ae36-b8610ccd840f.webp?v=1777210432",
    "galleryImages": [
      "https://choicelegacy.com.bd/cdn/shop/files/imgi_7_1_105982fa-cfe5-443f-b13b-cad0f6355e8b.webp?v=1777210432",
      "https://choicelegacy.com.bd/cdn/shop/files/imgi_10_4_f22eaad1-0235-40f5-ae36-b8610ccd840f.webp?v=1777210432",
      "https://choicelegacy.com.bd/cdn/shop/files/imgi_12_7_834a8fc4-1715-4da3-98ab-11f9b9700540.webp?v=1777210433"
    ],
    "sizes": [
      "40ml"
    ],
    "volume": "40 ml",
    "description": "Pamper your skin with the ultimate hydration experience: the TIRTIR Ceramic Milk Ampoule. Formulated with Vegan Milk and Squalane to restore suppleness, strengthen the barrier, and create an authentic glass-skin glow.",
    "editorNote": "আপনি যদি এমন একটি হাইড্রেটিং সিরাম চান যা স্কিনকে ডিপলি নারিশ করে কিন্তু ভারী বা স্টিকি ফিল না রেখে গ্লোয়িং, প্লাম্পড লুক দেয়, তাহলে এই এম্পুল টি আপনার জন্য খুব ভালো একটি অপশন হতে পারে।",
    "keyFeatures": [
      "3-in-1 Hydrating Serum: Delivers deep nourishment, intense hydration, and robust skin barrier protection.",
      "Vegan Milk Formula: Formulated with Lactobacillus and Soymilk fermentation.",
      "Squalane & Rice Bran Oil: Locks in moisture and fortifies natural ceramides.",
      "Fast-Absorbing & Silky: Leaves a radiant dew without sticky residue."
    ],
    "ingredients": "Aqua/Water/Eau, Isopropyl Myristate, Oryza Sativa (Rice) Bran Oil, Lactobacillus/Soymilk Ferment Filtrate, Squalane, Ceramide NP, Glycerin.",
    "howToUse": "After cleansing and toning, dispense 2-3 drops onto palms and gently press across face until fully absorbed.",
    "skinType": [
      "All Skin",
      "Dry",
      "Sensitive"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Anti-Aging & Firming"
    ],
    "isFeatured": true
  },
  {
    "id": "prod-sc-2",
    "name": "SKIN1004 Madagascar Centella Asiatica 100 Ampoule",
    "slug": "skin1004-madagascar-centella-ampoule",
    "brand": "SKIN1004",
    "category": "skin-care",
    "subcategory": "serum",
    "price": 1850,
    "originalPrice": 2200,
    "discountPercent": 16,
    "rating": 4.9,
    "reviewsCount": 142,
    "inStock": true,
    "stockQuantity": 28,
    "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=80",
    "description": "Pure 100% Centella Asiatica extract from untamed Madagascar nature to soothe acne inflammation, calm redness, and repair weakened barriers.",
    "volume": "100 ml",
    "tags": [
      "100% Centella",
      "Barrier Repair",
      "Hypoallergenic"
    ],
    "skinType": [
      "Sensitive",
      "Acne-Prone",
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming",
      "Acne & Blemishes"
    ],
    "isFeatured": true
  },
  {
    "id": "prod-sc-3",
    "name": "COSRX Advanced Snail 96 Mucin Power Essence",
    "slug": "cosrx-advanced-snail-96-mucin-power-essence",
    "brand": "COSRX",
    "category": "skin-care",
    "subcategory": "serum",
    "price": 1650,
    "originalPrice": 1950,
    "discountPercent": 15,
    "rating": 4.9,
    "reviewsCount": 310,
    "inStock": true,
    "stockQuantity": 45,
    "image": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80",
    "description": "Enriched with 96% snail secretion filtrate to deeply repair moisture loss, fade post-breakout scars, and revitalize damaged skin.",
    "volume": "100 ml",
    "tags": [
      "Cult Favorite",
      "Glass Skin",
      "Snail Mucin"
    ],
    "skinType": [
      "All Skin",
      "Dry",
      "Combination"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ],
    "isFeatured": true
  },
  {
    "id": "prod-sc-4",
    "name": "Beauty of Joseon Relief Sun : Rice + Probiotics SPF50+ PA++++",
    "slug": "beauty-of-joseon-relief-sun-rice-probiotics",
    "brand": "Beauty of Joseon",
    "category": "skin-care",
    "subcategory": "sunscreen",
    "price": 1450,
    "originalPrice": 1750,
    "discountPercent": 17,
    "rating": 5,
    "reviewsCount": 285,
    "inStock": true,
    "stockQuantity": 34,
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228852-6d35a585d566?auto=format&fit=crop&w=700&q=80",
    "description": "Lightweight organic sunscreen containing 30% Rice Extract and Grain Fermented Extracts that melts into skin like a rich lotion without white cast.",
    "volume": "50 ml",
    "tags": [
      "No White Cast",
      "SPF50+ PA++++",
      "Rice Water"
    ],
    "skinType": [
      "Sensitive",
      "Normal",
      "Combination"
    ],
    "skinConcern": [
      "Sun Protection",
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-sc-5",
    "name": "Anua Heartleaf 77% Soothing Toner",
    "slug": "anua-heartleaf-77-soothing-toner",
    "brand": "Anua",
    "category": "skin-care",
    "subcategory": "toner",
    "price": 2100,
    "originalPrice": 2400,
    "discountPercent": 12,
    "rating": 4.8,
    "reviewsCount": 165,
    "inStock": true,
    "stockQuantity": 20,
    "image": "https://images.unsplash.com/photo-1567928815116-2f080c98f993?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Formulated with 77% Houttuynia Cordata Extract to regulate oil-moisture balance and soothe troubled skin.",
    "volume": "250 ml",
    "tags": [
      "Heartleaf",
      "Acne Soothing",
      "Korea No.1 Toner"
    ],
    "skinType": [
      "Acne-Prone",
      "Sensitive",
      "Oily"
    ],
    "skinConcern": [
      "Acne & Blemishes",
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-sc-6",
    "name": "COSRX Low pH Good Morning Gel Cleanser",
    "slug": "cosrx-low-ph-good-morning-gel-cleanser",
    "brand": "COSRX",
    "category": "skin-care",
    "subcategory": "cleanser",
    "price": 950,
    "originalPrice": 1150,
    "discountPercent": 17,
    "rating": 4.8,
    "reviewsCount": 198,
    "inStock": true,
    "stockQuantity": 50,
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Gentle morning cleanser with Tea Tree Oil and natural BHA to refine pores without stripping moisture.",
    "volume": "150 ml",
    "tags": [
      "Low pH",
      "Tea Tree",
      "Daily Cleanser"
    ],
    "skinType": [
      "All Skin",
      "Oily",
      "Sensitive"
    ],
    "skinConcern": [
      "Pore Care & Oil Control",
      "Acne & Blemishes"
    ]
  },
  {
    "id": "prod-sc-7",
    "name": "Torriden DIVE-IN Low Molecular Hyaluronic Acid Serum",
    "slug": "torriden-dive-in-hyaluronic-acid-serum",
    "brand": "Torriden",
    "category": "skin-care",
    "subcategory": "serum",
    "price": 1950,
    "originalPrice": 2250,
    "discountPercent": 13,
    "rating": 4.9,
    "reviewsCount": 112,
    "inStock": true,
    "stockQuantity": 22,
    "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80",
    "description": "5-D multi-depth Hyaluronic Acid molecular complex providing instant plump hydration for dehydrated dermis.",
    "volume": "50 ml",
    "tags": [
      "5D Hyaluronic",
      "Deep Plump",
      "Olive Young Winner"
    ],
    "skinType": [
      "Dehydrated",
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-sc-8",
    "name": "Round Lab 1025 Dokdo Toner",
    "slug": "round-lab-1025-dokdo-toner",
    "brand": "Round Lab",
    "category": "skin-care",
    "subcategory": "toner",
    "price": 1750,
    "originalPrice": 2000,
    "discountPercent": 12,
    "rating": 4.9,
    "reviewsCount": 138,
    "inStock": true,
    "stockQuantity": 18,
    "image": "https://images.unsplash.com/photo-1567928815116-2f080c98f993?auto=format&fit=crop&w=700&q=80",
    "description": "Deep sea water mineral toner that gently exfoliates dead skin cells with Hatching EX-07 enzyme while restoring skin comfort.",
    "volume": "200 ml",
    "tags": [
      "Mineral Deep Sea",
      "Gentle Exfoliant",
      "Clean Beauty"
    ],
    "skinType": [
      "Sensitive",
      "Dry",
      "Combination"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Pore Care & Oil Control"
    ]
  },
  {
    "id": "prod-sc-9",
    "name": "Isntree Hyaluronic Acid Watery Sun Gel SPF50+",
    "slug": "isntree-hyaluronic-acid-watery-sun-gel",
    "brand": "Isntree",
    "category": "skin-care",
    "subcategory": "sunscreen",
    "price": 1550,
    "originalPrice": 1850,
    "discountPercent": 16,
    "rating": 4.8,
    "reviewsCount": 94,
    "inStock": true,
    "stockQuantity": 25,
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Watery gel texture infused with 8 types of Hyaluronic Acid, Centella, and Astaxanthin. Leaves zero cast and keeps skin quenched.",
    "volume": "50 ml",
    "tags": [
      "Water Gel",
      "Chemical SPF",
      "Ultra Hydrating"
    ],
    "skinType": [
      "Dry",
      "Combination",
      "All Skin"
    ],
    "skinConcern": [
      "Sun Protection",
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-sc-10",
    "name": "AXIS-Y Dark Spot Correcting Glow Serum",
    "slug": "axis-y-dark-spot-correcting-glow-serum",
    "brand": "AXIS-Y",
    "category": "skin-care",
    "subcategory": "serum",
    "price": 1600,
    "originalPrice": 1900,
    "discountPercent": 16,
    "rating": 4.7,
    "reviewsCount": 175,
    "inStock": true,
    "stockQuantity": 30,
    "image": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "5% Niacinamide and Rice Bran blend targeting hyperpigmentation, stubborn sun spots, and uneven texture.",
    "volume": "50 ml",
    "tags": [
      "5% Niacinamide",
      "Dark Spot Fading",
      "Vegan"
    ],
    "skinType": [
      "All Skin",
      "Hyperpigmented"
    ],
    "skinConcern": [
      "Brightening & Dark Spots",
      "Acne & Blemishes"
    ]
  },
  {
    "id": "prod-pc-1",
    "name": "Median Dental IQ 93% Tartar Protection Toothpaste",
    "slug": "median-dental-iq-93-tartar-protection-toothpaste",
    "brand": "Dabo",
    "category": "personal-care",
    "subcategory": "oral-care",
    "price": 450,
    "originalPrice": 550,
    "discountPercent": 18,
    "rating": 4.7,
    "reviewsCount": 30,
    "inStock": true,
    "stockQuantity": 15,
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Authentic Korean Median Dental IQ 93% Tartar Protection Toothpaste crafted with dermatologically verified botanical ingredients for daily family hygiene and lasting freshness.",
    "volume": "120 g",
    "tags": [
      "Korea Tartar Care",
      "Authentic Import",
      "Daily Essential"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-pc-2",
    "name": "Dabo Eco Life White Tea Foam Cleanser & Shave",
    "slug": "dabo-eco-life-white-tea-foam-cleanser-shave",
    "brand": "Dabo",
    "category": "personal-care",
    "subcategory": "shaving",
    "price": 650,
    "originalPrice": 750,
    "discountPercent": 13,
    "rating": 4.8,
    "reviewsCount": 38,
    "inStock": true,
    "stockQuantity": 18,
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Authentic Korean Dabo Eco Life White Tea Foam Cleanser & Shave crafted with dermatologically verified botanical ingredients for daily family hygiene and lasting freshness.",
    "volume": "180 ml",
    "tags": [
      "2-in-1 Shave Wash",
      "Authentic Import",
      "Daily Essential"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-pc-3",
    "name": "Dr. Jart+ Ceramidin Hand & Body Antiperspirant Stick",
    "slug": "dr-jart-ceramidin-hand-body-antiperspirant-stick",
    "brand": "Cerave",
    "category": "personal-care",
    "subcategory": "deodorant",
    "price": 1250,
    "originalPrice": 1450,
    "discountPercent": 14,
    "rating": 4.9,
    "reviewsCount": 46,
    "inStock": true,
    "stockQuantity": 21,
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Authentic Korean Dr. Jart+ Ceramidin Hand & Body Antiperspirant Stick crafted with dermatologically verified botanical ingredients for daily family hygiene and lasting freshness.",
    "volume": "40 g",
    "tags": [
      "Ceramide Care",
      "Authentic Import",
      "Daily Essential"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-pc-4",
    "name": "Nature Skin Charcoal Pore Refining Peeling Shave Foam",
    "slug": "nature-skin-charcoal-pore-refining-peeling-shave-foam",
    "brand": "Dabo",
    "category": "personal-care",
    "subcategory": "shaving",
    "price": 850,
    "originalPrice": 980,
    "discountPercent": 13,
    "rating": 4.7,
    "reviewsCount": 54,
    "inStock": true,
    "stockQuantity": 24,
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Authentic Korean Nature Skin Charcoal Pore Refining Peeling Shave Foam crafted with dermatologically verified botanical ingredients for daily family hygiene and lasting freshness.",
    "volume": "150 ml",
    "tags": [
      "Charcoal Detox",
      "Authentic Import",
      "Daily Essential"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-pc-5",
    "name": "Perioe Total 7 Original Clean Toothbrush 4-Pack",
    "slug": "perioe-total-7-original-clean-toothbrush-4-pack",
    "brand": "Dabo",
    "category": "personal-care",
    "subcategory": "oral-care",
    "price": 550,
    "originalPrice": 650,
    "discountPercent": 15,
    "rating": 4.8,
    "reviewsCount": 62,
    "inStock": true,
    "stockQuantity": 27,
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Authentic Korean Perioe Total 7 Original Clean Toothbrush 4-Pack crafted with dermatologically verified botanical ingredients for daily family hygiene and lasting freshness.",
    "volume": "4 Pieces",
    "tags": [
      "Micro Bristles",
      "Authentic Import",
      "Daily Essential"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-pc-6",
    "name": "Innisfree Daily Mild Intimate Hygiene Wash",
    "slug": "innisfree-daily-mild-intimate-hygiene-wash",
    "brand": "Innisfree",
    "category": "personal-care",
    "subcategory": "intimate-care",
    "price": 1150,
    "originalPrice": 1350,
    "discountPercent": 15,
    "rating": 4.9,
    "reviewsCount": 70,
    "inStock": true,
    "stockQuantity": 30,
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Authentic Korean Innisfree Daily Mild Intimate Hygiene Wash crafted with dermatologically verified botanical ingredients for daily family hygiene and lasting freshness.",
    "volume": "200 ml",
    "tags": [
      "pH Balanced",
      "Authentic Import",
      "Daily Essential"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-pc-7",
    "name": "AROMATICA Tea Tree Purifying Body Mist & Deodorant",
    "slug": "aromatica-tea-tree-purifying-body-mist-deodorant",
    "brand": "AROMATICA",
    "category": "personal-care",
    "subcategory": "deodorant",
    "price": 1350,
    "originalPrice": 1550,
    "discountPercent": 13,
    "rating": 4.7,
    "reviewsCount": 78,
    "inStock": true,
    "stockQuantity": 33,
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Authentic Korean AROMATICA Tea Tree Purifying Body Mist & Deodorant crafted with dermatologically verified botanical ingredients for daily family hygiene and lasting freshness.",
    "volume": "100 ml",
    "tags": [
      "Tea Tree Fresh",
      "Authentic Import",
      "Daily Essential"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-pc-8",
    "name": "B&B Hypoallergenic Personal Sanitizing Gel",
    "slug": "b-b-hypoallergenic-personal-sanitizing-gel",
    "brand": "Green Finger",
    "category": "personal-care",
    "subcategory": "sanitizer",
    "price": 720,
    "originalPrice": 850,
    "discountPercent": 15,
    "rating": 4.8,
    "reviewsCount": 86,
    "inStock": true,
    "stockQuantity": 36,
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Authentic Korean B&B Hypoallergenic Personal Sanitizing Gel crafted with dermatologically verified botanical ingredients for daily family hygiene and lasting freshness.",
    "volume": "500 ml",
    "tags": [
      "Hospital Grade",
      "Authentic Import",
      "Daily Essential"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-pc-9",
    "name": "Etude House Silk Scarf Damage Care Hair & Body Mist",
    "slug": "etude-house-silk-scarf-damage-care-hair-body-mist",
    "brand": "Etude House",
    "category": "personal-care",
    "subcategory": "deodorant",
    "price": 980,
    "originalPrice": 1150,
    "discountPercent": 15,
    "rating": 4.9,
    "reviewsCount": 94,
    "inStock": true,
    "stockQuantity": 39,
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Authentic Korean Etude House Silk Scarf Damage Care Hair & Body Mist crafted with dermatologically verified botanical ingredients for daily family hygiene and lasting freshness.",
    "volume": "120 ml",
    "tags": [
      "Floral Fresh",
      "Authentic Import",
      "Daily Essential"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-pc-10",
    "name": "Holika Holika Pure Essence Hygiene Cleansing Wipes",
    "slug": "holika-holika-pure-essence-hygiene-cleansing-wipes",
    "brand": "Holika Holika",
    "category": "personal-care",
    "subcategory": "sanitizer",
    "price": 420,
    "originalPrice": 500,
    "discountPercent": 16,
    "rating": 4.7,
    "reviewsCount": 102,
    "inStock": true,
    "stockQuantity": 42,
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Authentic Korean Holika Holika Pure Essence Hygiene Cleansing Wipes crafted with dermatologically verified botanical ingredients for daily family hygiene and lasting freshness.",
    "volume": "60 Sheets",
    "tags": [
      "Anti-Bacterial",
      "Authentic Import",
      "Daily Essential"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-mu-1",
    "name": "TIRTIR Mask Fit Red Cushion Foundation SPF40 PA++",
    "slug": "tirtir-mask-fit-red-cushion-foundation-spf40-pa",
    "brand": "Tirtir",
    "category": "makeup",
    "subcategory": "cushion",
    "price": 2650,
    "originalPrice": 2950,
    "discountPercent": 10,
    "rating": 4.8,
    "reviewsCount": 45,
    "inStock": true,
    "stockQuantity": 18,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
    "description": "Achieve runway-ready glass skin and effortless Korean aesthetic perfection with the high-performance TIRTIR Mask Fit Red Cushion Foundation SPF40 PA++.",
    "volume": "18 g",
    "tags": [
      "72H Lasting Glow",
      "K-Beauty Makeup",
      "Long-Wearing"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Pore Care & Oil Control"
    ]
  },
  {
    "id": "prod-mu-2",
    "name": "Missha M Perfect Cover B.B Cream SPF42 PA+++",
    "slug": "missha-m-perfect-cover-b-b-cream-spf42-pa",
    "brand": "Missha",
    "category": "makeup",
    "subcategory": "bb-cream",
    "price": 1450,
    "originalPrice": 1750,
    "discountPercent": 17,
    "rating": 4.8999999999999995,
    "reviewsCount": 57,
    "inStock": true,
    "stockQuantity": 20,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
    "description": "Achieve runway-ready glass skin and effortless Korean aesthetic perfection with the high-performance Missha M Perfect Cover B.B Cream SPF42 PA+++.",
    "volume": "50 ml",
    "tags": [
      "High Coverage",
      "K-Beauty Makeup",
      "Long-Wearing"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Pore Care & Oil Control"
    ]
  },
  {
    "id": "prod-mu-3",
    "name": "Innisfree No Sebum Mineral Powder",
    "slug": "innisfree-no-sebum-mineral-powder",
    "brand": "Innisfree",
    "category": "makeup",
    "subcategory": "powder",
    "price": 680,
    "originalPrice": 800,
    "discountPercent": 15,
    "rating": 4.8,
    "reviewsCount": 69,
    "inStock": true,
    "stockQuantity": 22,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
    "description": "Achieve runway-ready glass skin and effortless Korean aesthetic perfection with the high-performance Innisfree No Sebum Mineral Powder.",
    "volume": "5 g",
    "tags": [
      "Sebum Control",
      "K-Beauty Makeup",
      "Long-Wearing"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Pore Care & Oil Control"
    ]
  },
  {
    "id": "prod-mu-4",
    "name": "Clio Kill Cover The New Founwear Cushion",
    "slug": "clio-kill-cover-the-new-founwear-cushion",
    "brand": "Clio",
    "category": "makeup",
    "subcategory": "cushion",
    "price": 2850,
    "originalPrice": 3200,
    "discountPercent": 11,
    "rating": 4.8999999999999995,
    "reviewsCount": 81,
    "inStock": true,
    "stockQuantity": 24,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
    "description": "Achieve runway-ready glass skin and effortless Korean aesthetic perfection with the high-performance Clio Kill Cover The New Founwear Cushion.",
    "volume": "15g + Refill",
    "tags": [
      "Semi-Matte",
      "K-Beauty Makeup",
      "Long-Wearing"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Pore Care & Oil Control"
    ]
  },
  {
    "id": "prod-mu-5",
    "name": "Etude House Drawing Eye Brow Pencil",
    "slug": "etude-house-drawing-eye-brow-pencil",
    "brand": "Etude House",
    "category": "makeup",
    "subcategory": "eyebrow",
    "price": 380,
    "originalPrice": 450,
    "discountPercent": 16,
    "rating": 4.8,
    "reviewsCount": 93,
    "inStock": true,
    "stockQuantity": 26,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
    "description": "Achieve runway-ready glass skin and effortless Korean aesthetic perfection with the high-performance Etude House Drawing Eye Brow Pencil.",
    "volume": "0.25 g",
    "tags": [
      "Triangular Tip",
      "K-Beauty Makeup",
      "Long-Wearing"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Pore Care & Oil Control"
    ]
  },
  {
    "id": "prod-mu-6",
    "name": "Rom&nd Better Than Cheek Pastel Blusher",
    "slug": "rom-nd-better-than-cheek-pastel-blusher",
    "brand": "Rom&nd",
    "category": "makeup",
    "subcategory": "powder",
    "price": 950,
    "originalPrice": 1100,
    "discountPercent": 14,
    "rating": 4.8999999999999995,
    "reviewsCount": 105,
    "inStock": true,
    "stockQuantity": 28,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
    "description": "Achieve runway-ready glass skin and effortless Korean aesthetic perfection with the high-performance Rom&nd Better Than Cheek Pastel Blusher.",
    "volume": "4 g",
    "tags": [
      "Blurring Effect",
      "K-Beauty Makeup",
      "Long-Wearing"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Pore Care & Oil Control"
    ]
  },
  {
    "id": "prod-mu-7",
    "name": "Peripera Ink Black Cara Volumizing Mascara",
    "slug": "peripera-ink-black-cara-volumizing-mascara",
    "brand": "Peripera",
    "category": "makeup",
    "subcategory": "eyebrow",
    "price": 920,
    "originalPrice": 1050,
    "discountPercent": 12,
    "rating": 4.8,
    "reviewsCount": 117,
    "inStock": true,
    "stockQuantity": 30,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
    "description": "Achieve runway-ready glass skin and effortless Korean aesthetic perfection with the high-performance Peripera Ink Black Cara Volumizing Mascara.",
    "volume": "8 g",
    "tags": [
      "Waterproof Curl",
      "K-Beauty Makeup",
      "Long-Wearing"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Pore Care & Oil Control"
    ]
  },
  {
    "id": "prod-mu-8",
    "name": "Too Cool For School Artclass By Rodin Shading Contour",
    "slug": "too-cool-for-school-artclass-by-rodin-shading-contour",
    "brand": "Too Cool For School",
    "category": "makeup",
    "subcategory": "powder",
    "price": 1480,
    "originalPrice": 1700,
    "discountPercent": 13,
    "rating": 4.8999999999999995,
    "reviewsCount": 129,
    "inStock": true,
    "stockQuantity": 32,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
    "description": "Achieve runway-ready glass skin and effortless Korean aesthetic perfection with the high-performance Too Cool For School Artclass By Rodin Shading Contour.",
    "volume": "9.5 g",
    "tags": [
      "3-Color Contour",
      "K-Beauty Makeup",
      "Long-Wearing"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Pore Care & Oil Control"
    ]
  },
  {
    "id": "prod-mu-9",
    "name": "Beauty of Joseon Calming Glow Cushion SPF50+",
    "slug": "beauty-of-joseon-calming-glow-cushion-spf50",
    "brand": "Beauty of Joseon",
    "category": "makeup",
    "subcategory": "cushion",
    "price": 2250,
    "originalPrice": 2550,
    "discountPercent": 12,
    "rating": 4.8,
    "reviewsCount": 141,
    "inStock": true,
    "stockQuantity": 34,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
    "description": "Achieve runway-ready glass skin and effortless Korean aesthetic perfection with the high-performance Beauty of Joseon Calming Glow Cushion SPF50+.",
    "volume": "15 g",
    "tags": [
      "Hanbang Infused",
      "K-Beauty Makeup",
      "Long-Wearing"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Pore Care & Oil Control"
    ]
  },
  {
    "id": "prod-mu-10",
    "name": "The Saem Cover Perfection Tip Concealer SPF28",
    "slug": "the-saem-cover-perfection-tip-concealer-spf28",
    "brand": "The Saem",
    "category": "makeup",
    "subcategory": "bb-cream",
    "price": 520,
    "originalPrice": 620,
    "discountPercent": 16,
    "rating": 4.8999999999999995,
    "reviewsCount": 153,
    "inStock": true,
    "stockQuantity": 36,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
    "description": "Achieve runway-ready glass skin and effortless Korean aesthetic perfection with the high-performance The Saem Cover Perfection Tip Concealer SPF28.",
    "volume": "6.5 g",
    "tags": [
      "Flawless Cover",
      "K-Beauty Makeup",
      "Long-Wearing"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Pore Care & Oil Control"
    ]
  },
  {
    "id": "prod-lc-1",
    "name": "Laneige Lip Sleeping Mask - Berry Antioxidant",
    "slug": "laneige-lip-sleeping-mask-berry-antioxidant",
    "brand": "Laneige",
    "category": "lip-care",
    "subcategory": "lip-mask",
    "price": 1850,
    "originalPrice": 2150,
    "discountPercent": 14,
    "rating": 4.8,
    "reviewsCount": 50,
    "inStock": true,
    "stockQuantity": 25,
    "image": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    "description": "Nourish, tint, and protect chapped lips with the nutrient-rich hydration formula of Laneige Lip Sleeping Mask - Berry Antioxidant.",
    "volume": "20 g",
    "tags": [
      "Overnight Repair",
      "Juicy Glow",
      "Lip Plump"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-lc-2",
    "name": "Rom&nd Glasting Water Tint - Vintage Ocean",
    "slug": "rom-nd-glasting-water-tint-vintage-ocean",
    "brand": "Rom&nd",
    "category": "lip-care",
    "subcategory": "lip-tint",
    "price": 1050,
    "originalPrice": 1250,
    "discountPercent": 16,
    "rating": 4.8999999999999995,
    "reviewsCount": 60,
    "inStock": true,
    "stockQuantity": 27,
    "image": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    "description": "Nourish, tint, and protect chapped lips with the nutrient-rich hydration formula of Rom&nd Glasting Water Tint - Vintage Ocean.",
    "volume": "4 g",
    "tags": [
      "Glassy Tint",
      "Juicy Glow",
      "Lip Plump"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-lc-3",
    "name": "Peripera Ink Airy Velvet Lip Tint",
    "slug": "peripera-ink-airy-velvet-lip-tint",
    "brand": "Peripera",
    "category": "lip-care",
    "subcategory": "lip-tint",
    "price": 850,
    "originalPrice": 1000,
    "discountPercent": 15,
    "rating": 5,
    "reviewsCount": 70,
    "inStock": true,
    "stockQuantity": 29,
    "image": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    "description": "Nourish, tint, and protect chapped lips with the nutrient-rich hydration formula of Peripera Ink Airy Velvet Lip Tint.",
    "volume": "4 g",
    "tags": [
      "Airy Petal Soft",
      "Juicy Glow",
      "Lip Plump"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-lc-4",
    "name": "Torriden Solid In Ceramide Lip Essence",
    "slug": "torriden-solid-in-ceramide-lip-essence",
    "brand": "Torriden",
    "category": "lip-care",
    "subcategory": "lip-balm",
    "price": 750,
    "originalPrice": 900,
    "discountPercent": 17,
    "rating": 4.8,
    "reviewsCount": 80,
    "inStock": true,
    "stockQuantity": 31,
    "image": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    "description": "Nourish, tint, and protect chapped lips with the nutrient-rich hydration formula of Torriden Solid In Ceramide Lip Essence.",
    "volume": "11 ml",
    "tags": [
      "Ceramide Balm",
      "Juicy Glow",
      "Lip Plump"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-lc-5",
    "name": "Holika Holika Good Cera Super Ceramide Lip Oil Balm",
    "slug": "holika-holika-good-cera-super-ceramide-lip-oil-balm",
    "brand": "Holika Holika",
    "category": "lip-care",
    "subcategory": "lip-balm",
    "price": 650,
    "originalPrice": 780,
    "discountPercent": 17,
    "rating": 4.8999999999999995,
    "reviewsCount": 90,
    "inStock": true,
    "stockQuantity": 33,
    "image": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    "description": "Nourish, tint, and protect chapped lips with the nutrient-rich hydration formula of Holika Holika Good Cera Super Ceramide Lip Oil Balm.",
    "volume": "10 ml",
    "tags": [
      "Barrier Moisture",
      "Juicy Glow",
      "Lip Plump"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-lc-6",
    "name": "Dabo Collagen Moisture Plump Lip Serum",
    "slug": "dabo-collagen-moisture-plump-lip-serum",
    "brand": "Dabo",
    "category": "lip-care",
    "subcategory": "lip-scrub",
    "price": 480,
    "originalPrice": 580,
    "discountPercent": 17,
    "rating": 5,
    "reviewsCount": 100,
    "inStock": true,
    "stockQuantity": 35,
    "image": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    "description": "Nourish, tint, and protect chapped lips with the nutrient-rich hydration formula of Dabo Collagen Moisture Plump Lip Serum.",
    "volume": "12 ml",
    "tags": [
      "Marine Collagen",
      "Juicy Glow",
      "Lip Plump"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-lc-7",
    "name": "Apieu Honey & Milk Hydrating Lip Scrub",
    "slug": "apieu-honey-milk-hydrating-lip-scrub",
    "brand": "Apieu",
    "category": "lip-care",
    "subcategory": "lip-scrub",
    "price": 550,
    "originalPrice": 650,
    "discountPercent": 15,
    "rating": 4.8,
    "reviewsCount": 110,
    "inStock": true,
    "stockQuantity": 37,
    "image": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    "description": "Nourish, tint, and protect chapped lips with the nutrient-rich hydration formula of Apieu Honey & Milk Hydrating Lip Scrub.",
    "volume": "8 ml",
    "tags": [
      "Honey Exfoliant",
      "Juicy Glow",
      "Lip Plump"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-lc-8",
    "name": "Frudia Blueberry Hydrating Honey Lip Balm",
    "slug": "frudia-blueberry-hydrating-honey-lip-balm",
    "brand": "Frudia",
    "category": "lip-care",
    "subcategory": "lip-balm",
    "price": 620,
    "originalPrice": 750,
    "discountPercent": 17,
    "rating": 4.8999999999999995,
    "reviewsCount": 120,
    "inStock": true,
    "stockQuantity": 39,
    "image": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    "description": "Nourish, tint, and protect chapped lips with the nutrient-rich hydration formula of Frudia Blueberry Hydrating Honey Lip Balm.",
    "volume": "10 g",
    "tags": [
      "Honey Jam Glow",
      "Juicy Glow",
      "Lip Plump"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-lc-9",
    "name": "TIRTIR My Glow Lip Oil Nourishing Tint",
    "slug": "tirtir-my-glow-lip-oil-nourishing-tint",
    "brand": "Tirtir",
    "category": "lip-care",
    "subcategory": "lip-tint",
    "price": 1350,
    "originalPrice": 1550,
    "discountPercent": 13,
    "rating": 5,
    "reviewsCount": 130,
    "inStock": true,
    "stockQuantity": 41,
    "image": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    "description": "Nourish, tint, and protect chapped lips with the nutrient-rich hydration formula of TIRTIR My Glow Lip Oil Nourishing Tint.",
    "volume": "5.7 ml",
    "tags": [
      "Plumping Oil",
      "Juicy Glow",
      "Lip Plump"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-lc-10",
    "name": "Etude House Dear Darling Water Gel Tint",
    "slug": "etude-house-dear-darling-water-gel-tint",
    "brand": "Etude House",
    "category": "lip-care",
    "subcategory": "lip-mask",
    "price": 490,
    "originalPrice": 600,
    "discountPercent": 18,
    "rating": 4.8,
    "reviewsCount": 140,
    "inStock": true,
    "stockQuantity": 43,
    "image": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",
    "description": "Nourish, tint, and protect chapped lips with the nutrient-rich hydration formula of Etude House Dear Darling Water Gel Tint.",
    "volume": "5 g",
    "tags": [
      "Vibrant Pout",
      "Juicy Glow",
      "Lip Plump"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-hc-1",
    "name": "Mise En Scene Perfect Original Hair Serum",
    "slug": "mise-en-scene-perfect-original-hair-serum",
    "brand": "Mise En Scene",
    "category": "hair-care",
    "subcategory": "hair-serum",
    "price": 1250,
    "originalPrice": 1450,
    "discountPercent": 14,
    "rating": 4.8,
    "reviewsCount": 38,
    "inStock": true,
    "stockQuantity": 20,
    "image": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "description": "Restore salon-grade silkiness, control split ends, and invigorate hair roots with the specialized botanical formula of Mise En Scene Perfect Original Hair Serum.",
    "volume": "80 ml",
    "tags": [
      "7X Oil Cocktail",
      "Salon Care",
      "Silky Shine"
    ],
    "skinType": [
      "All Hair Types"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-hc-2",
    "name": "AROMATICA Rosemary Scalp Scaling Shampoo",
    "slug": "aromatica-rosemary-scalp-scaling-shampoo",
    "brand": "AROMATICA",
    "category": "hair-care",
    "subcategory": "shampoo",
    "price": 2150,
    "originalPrice": 2450,
    "discountPercent": 12,
    "rating": 4.8999999999999995,
    "reviewsCount": 45,
    "inStock": true,
    "stockQuantity": 22,
    "image": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "description": "Restore salon-grade silkiness, control split ends, and invigorate hair roots with the specialized botanical formula of AROMATICA Rosemary Scalp Scaling Shampoo.",
    "volume": "400 ml",
    "tags": [
      "Scalp Detox",
      "Salon Care",
      "Silky Shine"
    ],
    "skinType": [
      "All Hair Types"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-hc-3",
    "name": "AROMATICA Rosemary Root Enhancer Scalp Spray",
    "slug": "aromatica-rosemary-root-enhancer-scalp-spray",
    "brand": "AROMATICA",
    "category": "hair-care",
    "subcategory": "hair-treatment",
    "price": 1450,
    "originalPrice": 1700,
    "discountPercent": 15,
    "rating": 4.8,
    "reviewsCount": 52,
    "inStock": true,
    "stockQuantity": 24,
    "image": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "description": "Restore salon-grade silkiness, control split ends, and invigorate hair roots with the specialized botanical formula of AROMATICA Rosemary Root Enhancer Scalp Spray.",
    "volume": "100 ml",
    "tags": [
      "Root Strengthener",
      "Salon Care",
      "Silky Shine"
    ],
    "skinType": [
      "All Hair Types"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-hc-4",
    "name": "Elizavecca CER-100 Collagen Ceramide Hair Treatment",
    "slug": "elizavecca-cer-100-collagen-ceramide-hair-treatment",
    "brand": "Elizavecca",
    "category": "hair-care",
    "subcategory": "hair-treatment",
    "price": 950,
    "originalPrice": 1150,
    "discountPercent": 17,
    "rating": 4.8999999999999995,
    "reviewsCount": 59,
    "inStock": true,
    "stockQuantity": 26,
    "image": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "description": "Restore salon-grade silkiness, control split ends, and invigorate hair roots with the specialized botanical formula of Elizavecca CER-100 Collagen Ceramide Hair Treatment.",
    "volume": "100 ml",
    "tags": [
      "Intense Repair",
      "Salon Care",
      "Silky Shine"
    ],
    "skinType": [
      "All Hair Types"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-hc-5",
    "name": "Kundal Pure Natural Balancing Macadamia Shampoo",
    "slug": "kundal-pure-natural-balancing-macadamia-shampoo",
    "brand": "Kundal",
    "category": "hair-care",
    "subcategory": "shampoo",
    "price": 1850,
    "originalPrice": 2100,
    "discountPercent": 12,
    "rating": 4.8,
    "reviewsCount": 66,
    "inStock": true,
    "stockQuantity": 28,
    "image": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "description": "Restore salon-grade silkiness, control split ends, and invigorate hair roots with the specialized botanical formula of Kundal Pure Natural Balancing Macadamia Shampoo.",
    "volume": "500 ml",
    "tags": [
      "Honey & Macadamia",
      "Salon Care",
      "Silky Shine"
    ],
    "skinType": [
      "All Hair Types"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-hc-6",
    "name": "Kundal Honey & Macadamia Damage Care Conditioner",
    "slug": "kundal-honey-macadamia-damage-care-conditioner",
    "brand": "Kundal",
    "category": "hair-care",
    "subcategory": "conditioner",
    "price": 1850,
    "originalPrice": 2100,
    "discountPercent": 12,
    "rating": 4.8999999999999995,
    "reviewsCount": 73,
    "inStock": true,
    "stockQuantity": 30,
    "image": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "description": "Restore salon-grade silkiness, control split ends, and invigorate hair roots with the specialized botanical formula of Kundal Honey & Macadamia Damage Care Conditioner.",
    "volume": "500 ml",
    "tags": [
      "Silk Smoothing",
      "Salon Care",
      "Silky Shine"
    ],
    "skinType": [
      "All Hair Types"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-hc-7",
    "name": "Moremo Water Treatment Miracle 10 Liquid Mask",
    "slug": "moremo-water-treatment-miracle-10-liquid-mask",
    "brand": "Moremo",
    "category": "hair-care",
    "subcategory": "conditioner",
    "price": 2200,
    "originalPrice": 2500,
    "discountPercent": 12,
    "rating": 4.8,
    "reviewsCount": 80,
    "inStock": true,
    "stockQuantity": 32,
    "image": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "description": "Restore salon-grade silkiness, control split ends, and invigorate hair roots with the specialized botanical formula of Moremo Water Treatment Miracle 10 Liquid Mask.",
    "volume": "200 ml",
    "tags": [
      "10-Sec Magic",
      "Salon Care",
      "Silky Shine"
    ],
    "skinType": [
      "All Hair Types"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-hc-8",
    "name": "Ryo Damage Care Shampoo - Fermented Camellia",
    "slug": "ryo-damage-care-shampoo-fermented-camellia",
    "brand": "Ryo",
    "category": "hair-care",
    "subcategory": "shampoo",
    "price": 1650,
    "originalPrice": 1950,
    "discountPercent": 15,
    "rating": 4.8999999999999995,
    "reviewsCount": 87,
    "inStock": true,
    "stockQuantity": 34,
    "image": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "description": "Restore salon-grade silkiness, control split ends, and invigorate hair roots with the specialized botanical formula of Ryo Damage Care Shampoo - Fermented Camellia.",
    "volume": "400 ml",
    "tags": [
      "Herbal Roots",
      "Salon Care",
      "Silky Shine"
    ],
    "skinType": [
      "All Hair Types"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-hc-9",
    "name": "LADOR Keratin Power Glue Leave-in Ampoule",
    "slug": "lador-keratin-power-glue-leave-in-ampoule",
    "brand": "Lador",
    "category": "hair-care",
    "subcategory": "hair-serum",
    "price": 1380,
    "originalPrice": 1600,
    "discountPercent": 14,
    "rating": 4.8,
    "reviewsCount": 94,
    "inStock": true,
    "stockQuantity": 36,
    "image": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "description": "Restore salon-grade silkiness, control split ends, and invigorate hair roots with the specialized botanical formula of LADOR Keratin Power Glue Leave-in Ampoule.",
    "volume": "150 g",
    "tags": [
      "Keratin Seal",
      "Salon Care",
      "Silky Shine"
    ],
    "skinType": [
      "All Hair Types"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-hc-10",
    "name": "Daeng Gi Meo Ri Vitalizing Anti-Hair Loss Scalp Treatment",
    "slug": "daeng-gi-meo-ri-vitalizing-anti-hair-loss-scalp-treatment",
    "brand": "Daeng Gi Meo Ri",
    "category": "hair-care",
    "subcategory": "hair-serum",
    "price": 1950,
    "originalPrice": 2250,
    "discountPercent": 13,
    "rating": 4.8999999999999995,
    "reviewsCount": 101,
    "inStock": true,
    "stockQuantity": 38,
    "image": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "description": "Restore salon-grade silkiness, control split ends, and invigorate hair roots with the specialized botanical formula of Daeng Gi Meo Ri Vitalizing Anti-Hair Loss Scalp Treatment.",
    "volume": "145 ml",
    "tags": [
      "Anti-Fall Tonic",
      "Salon Care",
      "Silky Shine"
    ],
    "skinType": [
      "All Hair Types"
    ],
    "skinConcern": [
      "Hydration & Dryness"
    ]
  },
  {
    "id": "prod-fr-1",
    "name": "W.Dressroom New York Clear Perfume No.97 April Cotton",
    "slug": "w-dressroom-new-york-clear-perfume-no-97-april-cotton",
    "brand": "W.Dressroom",
    "category": "fragrance",
    "subcategory": "body-mist",
    "price": 750,
    "originalPrice": 900,
    "discountPercent": 17,
    "rating": 4.9,
    "reviewsCount": 22,
    "inStock": true,
    "stockQuantity": 12,
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=700&q=80",
    "description": "Immerse in Seoul's trendsetting olfactory luxury with W.Dressroom New York Clear Perfume No.97 April Cotton, featuring delicately balanced notes that linger effortlessly.",
    "volume": "70 ml",
    "tags": [
      "Clean Laundry Scent",
      "Luxury Scent",
      "Long Lasting"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-fr-2",
    "name": "W.Dressroom New York Clear Perfume No.49 Peach Blossom",
    "slug": "w-dressroom-new-york-clear-perfume-no-49-peach-blossom",
    "brand": "W.Dressroom",
    "category": "fragrance",
    "subcategory": "body-mist",
    "price": 750,
    "originalPrice": 900,
    "discountPercent": 17,
    "rating": 4.9,
    "reviewsCount": 27,
    "inStock": true,
    "stockQuantity": 14,
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=700&q=80",
    "description": "Immerse in Seoul's trendsetting olfactory luxury with W.Dressroom New York Clear Perfume No.49 Peach Blossom, featuring delicately balanced notes that linger effortlessly.",
    "volume": "70 ml",
    "tags": [
      "Juicy Sweet Peach",
      "Luxury Scent",
      "Long Lasting"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-fr-3",
    "name": "Nonfiction Gentle Night Eau De Parfum",
    "slug": "nonfiction-gentle-night-eau-de-parfum",
    "brand": "Nonfiction",
    "category": "fragrance",
    "subcategory": "eau-de-parfum",
    "price": 4850,
    "originalPrice": 5500,
    "discountPercent": 12,
    "rating": 4.9,
    "reviewsCount": 32,
    "inStock": true,
    "stockQuantity": 16,
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=700&q=80",
    "description": "Immerse in Seoul's trendsetting olfactory luxury with Nonfiction Gentle Night Eau De Parfum, featuring delicately balanced notes that linger effortlessly.",
    "volume": "100 ml",
    "tags": [
      "Suede & Cedar",
      "Luxury Scent",
      "Long Lasting"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-fr-4",
    "name": "Tamburins Chamo Perfume Balm & Fragrance Stick",
    "slug": "tamburins-chamo-perfume-balm-fragrance-stick",
    "brand": "Tamburins",
    "category": "fragrance",
    "subcategory": "eau-de-parfum",
    "price": 3650,
    "originalPrice": 4200,
    "discountPercent": 13,
    "rating": 4.9,
    "reviewsCount": 37,
    "inStock": true,
    "stockQuantity": 18,
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=700&q=80",
    "description": "Immerse in Seoul's trendsetting olfactory luxury with Tamburins Chamo Perfume Balm & Fragrance Stick, featuring delicately balanced notes that linger effortlessly.",
    "volume": "6.5 g",
    "tags": [
      "Chamomile Musk",
      "Luxury Scent",
      "Long Lasting"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-fr-5",
    "name": "Mumchit Fabric & Hair Perfume Mist - Soft Blue Soap",
    "slug": "mumchit-fabric-hair-perfume-mist-soft-blue-soap",
    "brand": "Mumchit",
    "category": "fragrance",
    "subcategory": "hair-perfume",
    "price": 890,
    "originalPrice": 1050,
    "discountPercent": 15,
    "rating": 4.9,
    "reviewsCount": 42,
    "inStock": true,
    "stockQuantity": 20,
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=700&q=80",
    "description": "Immerse in Seoul's trendsetting olfactory luxury with Mumchit Fabric & Hair Perfume Mist - Soft Blue Soap, featuring delicately balanced notes that linger effortlessly.",
    "volume": "100 ml",
    "tags": [
      "Fresh Soap Aroma",
      "Luxury Scent",
      "Long Lasting"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-fr-6",
    "name": "Kundal Perfume Diffuser - Baby Powder Floral",
    "slug": "kundal-perfume-diffuser-baby-powder-floral",
    "brand": "Kundal",
    "category": "fragrance",
    "subcategory": "diffuser",
    "price": 1450,
    "originalPrice": 1700,
    "discountPercent": 15,
    "rating": 4.9,
    "reviewsCount": 47,
    "inStock": true,
    "stockQuantity": 22,
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=700&q=80",
    "description": "Immerse in Seoul's trendsetting olfactory luxury with Kundal Perfume Diffuser - Baby Powder Floral, featuring delicately balanced notes that linger effortlessly.",
    "volume": "200 ml",
    "tags": [
      "Aromatherapy Room",
      "Luxury Scent",
      "Long Lasting"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-fr-7",
    "name": "AROMATICA Organic Essential Fragrance Roller - Serene Lavender",
    "slug": "aromatica-organic-essential-fragrance-roller-serene-lavender",
    "brand": "AROMATICA",
    "category": "fragrance",
    "subcategory": "diffuser",
    "price": 1150,
    "originalPrice": 1350,
    "discountPercent": 15,
    "rating": 4.9,
    "reviewsCount": 52,
    "inStock": true,
    "stockQuantity": 24,
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=700&q=80",
    "description": "Immerse in Seoul's trendsetting olfactory luxury with AROMATICA Organic Essential Fragrance Roller - Serene Lavender, featuring delicately balanced notes that linger effortlessly.",
    "volume": "10 ml",
    "tags": [
      "Relaxing Essential",
      "Luxury Scent",
      "Long Lasting"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-fr-8",
    "name": "Granhand Susie Salmon Signature Fine Perfume",
    "slug": "granhand-susie-salmon-signature-fine-perfume",
    "brand": "Granhand",
    "category": "fragrance",
    "subcategory": "eau-de-parfum",
    "price": 3950,
    "originalPrice": 4500,
    "discountPercent": 12,
    "rating": 4.9,
    "reviewsCount": 57,
    "inStock": true,
    "stockQuantity": 26,
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=700&q=80",
    "description": "Immerse in Seoul's trendsetting olfactory luxury with Granhand Susie Salmon Signature Fine Perfume, featuring delicately balanced notes that linger effortlessly.",
    "volume": "110 ml",
    "tags": [
      "Crisp Apple Amber",
      "Luxury Scent",
      "Long Lasting"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-fr-9",
    "name": "Innisfree Isle Number Floral Eau de Toilette",
    "slug": "innisfree-isle-number-floral-eau-de-toilette",
    "brand": "Innisfree",
    "category": "fragrance",
    "subcategory": "body-mist",
    "price": 2450,
    "originalPrice": 2800,
    "discountPercent": 13,
    "rating": 4.9,
    "reviewsCount": 62,
    "inStock": true,
    "stockQuantity": 28,
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=700&q=80",
    "description": "Immerse in Seoul's trendsetting olfactory luxury with Innisfree Isle Number Floral Eau de Toilette, featuring delicately balanced notes that linger effortlessly.",
    "volume": "50 ml",
    "tags": [
      "Jeju Camellia",
      "Luxury Scent",
      "Long Lasting"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-fr-10",
    "name": "Soohyang Scented Botanical Fragrance Mist - Itaewon 565",
    "slug": "soohyang-scented-botanical-fragrance-mist-itaewon-565",
    "brand": "Soohyang",
    "category": "fragrance",
    "subcategory": "hair-perfume",
    "price": 2100,
    "originalPrice": 2400,
    "discountPercent": 13,
    "rating": 4.9,
    "reviewsCount": 67,
    "inStock": true,
    "stockQuantity": 30,
    "image": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=700&q=80",
    "description": "Immerse in Seoul's trendsetting olfactory luxury with Soohyang Scented Botanical Fragrance Mist - Itaewon 565, featuring delicately balanced notes that linger effortlessly.",
    "volume": "120 ml",
    "tags": [
      "Green Woody Scent",
      "Luxury Scent",
      "Long Lasting"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-fs-1",
    "name": "Lemona Gyeol Low Molecular Fish Collagen Powder + Vitamin C",
    "slug": "lemona-gyeol-low-molecular-fish-collagen-powder-vitamin-c",
    "brand": "Lemona",
    "category": "food-supps",
    "subcategory": "collagen",
    "price": 1950,
    "originalPrice": 2300,
    "discountPercent": 15,
    "rating": 4.9,
    "reviewsCount": 65,
    "inStock": true,
    "stockQuantity": 20,
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Target beauty from within with the authentic Lemona Gyeol Low Molecular Fish Collagen Powder + Vitamin C. Packed with bio-available nutrients for plump skin elasticity and vibrant health.",
    "volume": "60 Sticks",
    "tags": [
      "Fish Collagen 500Da",
      "Inner Beauty",
      "Immunity Boost"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Anti-Aging & Firming",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-fs-2",
    "name": "Chong Kun Dang LACTO-FIT Probiotics Gold Digestive Formula",
    "slug": "chong-kun-dang-lacto-fit-probiotics-gold-digestive-formula",
    "brand": "Lacto-Fit",
    "category": "food-supps",
    "subcategory": "probiotics",
    "price": 2250,
    "originalPrice": 2600,
    "discountPercent": 13,
    "rating": 4.9,
    "reviewsCount": 76,
    "inStock": true,
    "stockQuantity": 23,
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Target beauty from within with the authentic Chong Kun Dang LACTO-FIT Probiotics Gold Digestive Formula. Packed with bio-available nutrients for plump skin elasticity and vibrant health.",
    "volume": "50 Sticks",
    "tags": [
      "Korea No.1 Probiotic",
      "Inner Beauty",
      "Immunity Boost"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Anti-Aging & Firming",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-fs-3",
    "name": "Cheong Kwan Jang Korean Red Ginseng Extract Pouches",
    "slug": "cheong-kwan-jang-korean-red-ginseng-extract-pouches",
    "brand": "KGC Ginseng",
    "category": "food-supps",
    "subcategory": "korean-ginseng",
    "price": 4650,
    "originalPrice": 5400,
    "discountPercent": 14,
    "rating": 4.9,
    "reviewsCount": 87,
    "inStock": true,
    "stockQuantity": 26,
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Target beauty from within with the authentic Cheong Kwan Jang Korean Red Ginseng Extract Pouches. Packed with bio-available nutrients for plump skin elasticity and vibrant health.",
    "volume": "30 Pouches",
    "tags": [
      "6-Year Root Red Ginseng",
      "Inner Beauty",
      "Immunity Boost"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Anti-Aging & Firming",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-fs-4",
    "name": "BB LAB Good Night Low Molecular Collagen Powder",
    "slug": "bb-lab-good-night-low-molecular-collagen-powder",
    "brand": "BB Lab",
    "category": "food-supps",
    "subcategory": "collagen",
    "price": 1750,
    "originalPrice": 2050,
    "discountPercent": 15,
    "rating": 4.9,
    "reviewsCount": 98,
    "inStock": true,
    "stockQuantity": 29,
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Target beauty from within with the authentic BB LAB Good Night Low Molecular Collagen Powder. Packed with bio-available nutrients for plump skin elasticity and vibrant health.",
    "volume": "30 Sticks",
    "tags": [
      "Berry Flavor Sleep",
      "Inner Beauty",
      "Immunity Boost"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Anti-Aging & Firming",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-fs-5",
    "name": "Youtheory Collagen Advanced Formula Skin Hydrolyzed",
    "slug": "youtheory-collagen-advanced-formula-skin-hydrolyzed",
    "brand": "Youtheory",
    "category": "food-supps",
    "subcategory": "collagen",
    "price": 3200,
    "originalPrice": 3700,
    "discountPercent": 14,
    "rating": 4.9,
    "reviewsCount": 109,
    "inStock": true,
    "stockQuantity": 32,
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Target beauty from within with the authentic Youtheory Collagen Advanced Formula Skin Hydrolyzed. Packed with bio-available nutrients for plump skin elasticity and vibrant health.",
    "volume": "290 Tablets",
    "tags": [
      "Type 1, 2, 3 Collagen",
      "Inner Beauty",
      "Immunity Boost"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Anti-Aging & Firming",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-fs-6",
    "name": "Evercollagen Time Biotin Collagen Booster",
    "slug": "evercollagen-time-biotin-collagen-booster",
    "brand": "Evercollagen",
    "category": "food-supps",
    "subcategory": "collagen",
    "price": 2850,
    "originalPrice": 3300,
    "discountPercent": 14,
    "rating": 4.9,
    "reviewsCount": 120,
    "inStock": true,
    "stockQuantity": 35,
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Target beauty from within with the authentic Evercollagen Time Biotin Collagen Booster. Packed with bio-available nutrients for plump skin elasticity and vibrant health.",
    "volume": "30 Sticks",
    "tags": [
      "Hair & Nail Biotin",
      "Inner Beauty",
      "Immunity Boost"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Anti-Aging & Firming",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-fs-7",
    "name": "Osulloc Korean Jeju Organic Roasted Green Tea",
    "slug": "osulloc-korean-jeju-organic-roasted-green-tea",
    "brand": "Osulloc",
    "category": "food-supps",
    "subcategory": "vitamins",
    "price": 950,
    "originalPrice": 1150,
    "discountPercent": 17,
    "rating": 4.9,
    "reviewsCount": 131,
    "inStock": true,
    "stockQuantity": 38,
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Target beauty from within with the authentic Osulloc Korean Jeju Organic Roasted Green Tea. Packed with bio-available nutrients for plump skin elasticity and vibrant health.",
    "volume": "20 Pyramid Bags",
    "tags": [
      "Jeju Organic Leaf",
      "Inner Beauty",
      "Immunity Boost"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Anti-Aging & Firming",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-fs-8",
    "name": "Teazen Kombucha Berry Flavor Effervescent Probiotic Drink",
    "slug": "teazen-kombucha-berry-flavor-effervescent-probiotic-drink",
    "brand": "Teazen",
    "category": "food-supps",
    "subcategory": "probiotics",
    "price": 850,
    "originalPrice": 990,
    "discountPercent": 14,
    "rating": 4.9,
    "reviewsCount": 142,
    "inStock": true,
    "stockQuantity": 41,
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Target beauty from within with the authentic Teazen Kombucha Berry Flavor Effervescent Probiotic Drink. Packed with bio-available nutrients for plump skin elasticity and vibrant health.",
    "volume": "10 Sticks",
    "tags": [
      "Zero Sugar Berry",
      "Inner Beauty",
      "Immunity Boost"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Anti-Aging & Firming",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-fs-9",
    "name": "GNST Inner Beauty Multivitamin & Mineral Jelly",
    "slug": "gnst-inner-beauty-multivitamin-mineral-jelly",
    "brand": "GNST",
    "category": "food-supps",
    "subcategory": "vitamins",
    "price": 1650,
    "originalPrice": 1950,
    "discountPercent": 15,
    "rating": 4.9,
    "reviewsCount": 153,
    "inStock": true,
    "stockQuantity": 44,
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Target beauty from within with the authentic GNST Inner Beauty Multivitamin & Mineral Jelly. Packed with bio-available nutrients for plump skin elasticity and vibrant health.",
    "volume": "30 Strips",
    "tags": [
      "Chewable Glow Jelly",
      "Inner Beauty",
      "Immunity Boost"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Anti-Aging & Firming",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-fs-10",
    "name": "Lemona Pink Collagen Skin Hydration Daily Sachets",
    "slug": "lemona-pink-collagen-skin-hydration-daily-sachets",
    "brand": "Lemona",
    "category": "food-supps",
    "subcategory": "korean-ginseng",
    "price": 1450,
    "originalPrice": 1700,
    "discountPercent": 15,
    "rating": 4.9,
    "reviewsCount": 164,
    "inStock": true,
    "stockQuantity": 47,
    "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "description": "Target beauty from within with the authentic Lemona Pink Collagen Skin Hydration Daily Sachets. Packed with bio-available nutrients for plump skin elasticity and vibrant health.",
    "volume": "30 Sticks",
    "tags": [
      "Blueberry Antioxidant",
      "Inner Beauty",
      "Immunity Boost"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Anti-Aging & Firming",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-cs-1",
    "name": "Beauty of Joseon Hanbang Trio Serum Discovery Set",
    "slug": "beauty-of-joseon-hanbang-trio-serum-discovery-set",
    "brand": "Beauty of Joseon",
    "category": "combo-set",
    "subcategory": "skincare-combo",
    "price": 3850,
    "originalPrice": 4600,
    "discountPercent": 16,
    "rating": 5,
    "reviewsCount": 80,
    "inStock": true,
    "stockQuantity": 10,
    "image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Complete curated ritual containing Beauty of Joseon Hanbang Trio Serum Discovery Set. Enjoy bundled value and perfectly harmonized skincare steps.",
    "volume": "3 x 30 ml",
    "tags": [
      "Save 16%",
      "Best Seller Set",
      "Gift Ready"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-cs-2",
    "name": "COSRX All About Snail 4-Step Starter Routine Kit",
    "slug": "cosrx-all-about-snail-4-step-starter-routine-kit",
    "brand": "COSRX",
    "category": "combo-set",
    "subcategory": "travel-kit",
    "price": 1950,
    "originalPrice": 2400,
    "discountPercent": 19,
    "rating": 5,
    "reviewsCount": 94,
    "inStock": true,
    "stockQuantity": 12,
    "image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Complete curated ritual containing COSRX All About Snail 4-Step Starter Routine Kit. Enjoy bundled value and perfectly harmonized skincare steps.",
    "volume": "4 Mini Sizes",
    "tags": [
      "Starter Kit",
      "Best Seller Set",
      "Gift Ready"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-cs-3",
    "name": "SKIN1004 Madagascar Centella Travel Kit 5-in-1",
    "slug": "skin1004-madagascar-centella-travel-kit-5-in-1",
    "brand": "SKIN1004",
    "category": "combo-set",
    "subcategory": "travel-kit",
    "price": 2350,
    "originalPrice": 2800,
    "discountPercent": 16,
    "rating": 5,
    "reviewsCount": 108,
    "inStock": true,
    "stockQuantity": 14,
    "image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Complete curated ritual containing SKIN1004 Madagascar Centella Travel Kit 5-in-1. Enjoy bundled value and perfectly harmonized skincare steps.",
    "volume": "5 Travel Items",
    "tags": [
      "TSA Approved",
      "Best Seller Set",
      "Gift Ready"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-cs-4",
    "name": "Anua Heartleaf Soothing & Calming Complete Routine Set",
    "slug": "anua-heartleaf-soothing-calming-complete-routine-set",
    "brand": "Anua",
    "category": "combo-set",
    "subcategory": "skincare-combo",
    "price": 5200,
    "originalPrice": 6200,
    "discountPercent": 16,
    "rating": 5,
    "reviewsCount": 122,
    "inStock": true,
    "stockQuantity": 16,
    "image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Complete curated ritual containing Anua Heartleaf Soothing & Calming Complete Routine Set. Enjoy bundled value and perfectly harmonized skincare steps.",
    "volume": "3 Full Items",
    "tags": [
      "Complete Acne Set",
      "Best Seller Set",
      "Gift Ready"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-cs-5",
    "name": "TIRTIR Glass Skin Dual Kit (Milk Ampoule 50ml + Mask Fit Cushion)",
    "slug": "tirtir-glass-skin-dual-kit-milk-ampoule-50ml-mask-fit-cushion",
    "brand": "Tirtir",
    "category": "combo-set",
    "subcategory": "skincare-combo",
    "price": 4800,
    "originalPrice": 5700,
    "discountPercent": 16,
    "rating": 5,
    "reviewsCount": 136,
    "inStock": true,
    "stockQuantity": 18,
    "image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Complete curated ritual containing TIRTIR Glass Skin Dual Kit (Milk Ampoule 50ml + Mask Fit Cushion). Enjoy bundled value and perfectly harmonized skincare steps.",
    "volume": "2 Full Items",
    "tags": [
      "Glass Skin Duo",
      "Best Seller Set",
      "Gift Ready"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-cs-6",
    "name": "Laneige Best Seller Lip & Water Sleeping Mask Duo",
    "slug": "laneige-best-seller-lip-water-sleeping-mask-duo",
    "brand": "Laneige",
    "category": "combo-set",
    "subcategory": "festive-gift",
    "price": 2650,
    "originalPrice": 3200,
    "discountPercent": 17,
    "rating": 5,
    "reviewsCount": 150,
    "inStock": true,
    "stockQuantity": 20,
    "image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Complete curated ritual containing Laneige Best Seller Lip & Water Sleeping Mask Duo. Enjoy bundled value and perfectly harmonized skincare steps.",
    "volume": "2 Full Items",
    "tags": [
      "Overnight Glow",
      "Best Seller Set",
      "Gift Ready"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-cs-7",
    "name": "Round Lab Dokdo 3-Step Hydration Bundle",
    "slug": "round-lab-dokdo-3-step-hydration-bundle",
    "brand": "Round Lab",
    "category": "combo-set",
    "subcategory": "skincare-combo",
    "price": 4500,
    "originalPrice": 5300,
    "discountPercent": 15,
    "rating": 5,
    "reviewsCount": 164,
    "inStock": true,
    "stockQuantity": 22,
    "image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Complete curated ritual containing Round Lab Dokdo 3-Step Hydration Bundle. Enjoy bundled value and perfectly harmonized skincare steps.",
    "volume": "3 Full Items",
    "tags": [
      "Deep Moisture",
      "Best Seller Set",
      "Gift Ready"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-cs-8",
    "name": "Some By Mi AHA BHA PHA 30 Days Miracle Starter Kit",
    "slug": "some-by-mi-aha-bha-pha-30-days-miracle-starter-kit",
    "brand": "Some By Mi",
    "category": "combo-set",
    "subcategory": "travel-kit",
    "price": 1750,
    "originalPrice": 2150,
    "discountPercent": 19,
    "rating": 5,
    "reviewsCount": 178,
    "inStock": true,
    "stockQuantity": 24,
    "image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Complete curated ritual containing Some By Mi AHA BHA PHA 30 Days Miracle Starter Kit. Enjoy bundled value and perfectly harmonized skincare steps.",
    "volume": "4 Mini Items",
    "tags": [
      "30-Day Clear",
      "Best Seller Set",
      "Gift Ready"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-cs-9",
    "name": "Isntree Hyaluronic Acid Hydrating Master Bundle",
    "slug": "isntree-hyaluronic-acid-hydrating-master-bundle",
    "brand": "Isntree",
    "category": "combo-set",
    "subcategory": "skincare-combo",
    "price": 3950,
    "originalPrice": 4700,
    "discountPercent": 16,
    "rating": 5,
    "reviewsCount": 192,
    "inStock": true,
    "stockQuantity": 26,
    "image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Complete curated ritual containing Isntree Hyaluronic Acid Hydrating Master Bundle. Enjoy bundled value and perfectly harmonized skincare steps.",
    "volume": "3 Full Items",
    "tags": [
      "Plump Routine",
      "Best Seller Set",
      "Gift Ready"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-cs-10",
    "name": "Dabo Eco Life White Tea Complete Luxury Gift Set",
    "slug": "dabo-eco-life-white-tea-complete-luxury-gift-set",
    "brand": "Dabo",
    "category": "combo-set",
    "subcategory": "festive-gift",
    "price": 3450,
    "originalPrice": 4200,
    "discountPercent": 18,
    "rating": 5,
    "reviewsCount": 206,
    "inStock": true,
    "stockQuantity": 28,
    "image": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Complete curated ritual containing Dabo Eco Life White Tea Complete Luxury Gift Set. Enjoy bundled value and perfectly harmonized skincare steps.",
    "volume": "5 Full Items",
    "tags": [
      "Luxury Festive",
      "Best Seller Set",
      "Gift Ready"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-bc-1",
    "name": "Dabo Speed Whitening Intensive Body Lotion SPF50+",
    "slug": "dabo-speed-whitening-intensive-body-lotion-spf50",
    "brand": "Dabo",
    "category": "body-care",
    "subcategory": "body-lotion",
    "price": 950,
    "originalPrice": 1150,
    "discountPercent": 17,
    "rating": 4.8,
    "reviewsCount": 42,
    "inStock": true,
    "stockQuantity": 22,
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Keep whole-body skin velvety soft, brightened, and deeply hydrated with the comforting formula of Dabo Speed Whitening Intensive Body Lotion SPF50+.",
    "volume": "200 ml",
    "tags": [
      "Instant Tone-Up",
      "Silky Skin",
      "Daily Moisture"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-bc-2",
    "name": "Illiyoon Ceramide Ato Concentrate Body Cream",
    "slug": "illiyoon-ceramide-ato-concentrate-body-cream",
    "brand": "Illiyoon",
    "category": "body-care",
    "subcategory": "body-lotion",
    "price": 1850,
    "originalPrice": 2200,
    "discountPercent": 16,
    "rating": 4.8,
    "reviewsCount": 50,
    "inStock": true,
    "stockQuantity": 25,
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Keep whole-body skin velvety soft, brightened, and deeply hydrated with the comforting formula of Illiyoon Ceramide Ato Concentrate Body Cream.",
    "volume": "200 ml",
    "tags": [
      "Ceramide Capsules",
      "Silky Skin",
      "Daily Moisture"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-bc-3",
    "name": "Illiyoon Ceramide Ato Body Wash Pump",
    "slug": "illiyoon-ceramide-ato-body-wash-pump",
    "brand": "Illiyoon",
    "category": "body-care",
    "subcategory": "body-wash",
    "price": 1950,
    "originalPrice": 2300,
    "discountPercent": 15,
    "rating": 4.8,
    "reviewsCount": 58,
    "inStock": true,
    "stockQuantity": 28,
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Keep whole-body skin velvety soft, brightened, and deeply hydrated with the comforting formula of Illiyoon Ceramide Ato Body Wash Pump.",
    "volume": "500 ml",
    "tags": [
      "Tear-Free Formula",
      "Silky Skin",
      "Daily Moisture"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-bc-4",
    "name": "Kundal Pure Body Wash - Cherry Blossom",
    "slug": "kundal-pure-body-wash-cherry-blossom",
    "brand": "Kundal",
    "category": "body-care",
    "subcategory": "body-wash",
    "price": 1650,
    "originalPrice": 1950,
    "discountPercent": 15,
    "rating": 4.8,
    "reviewsCount": 66,
    "inStock": true,
    "stockQuantity": 31,
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Keep whole-body skin velvety soft, brightened, and deeply hydrated with the comforting formula of Kundal Pure Body Wash - Cherry Blossom.",
    "volume": "500 ml",
    "tags": [
      "Floral Scent",
      "Silky Skin",
      "Daily Moisture"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-bc-5",
    "name": "Nature Skin Aloe Vera 99% Soothing Gel Large Jar",
    "slug": "nature-skin-aloe-vera-99-soothing-gel-large-jar",
    "brand": "Nature Skin",
    "category": "body-care",
    "subcategory": "body-lotion",
    "price": 550,
    "originalPrice": 680,
    "discountPercent": 19,
    "rating": 4.8,
    "reviewsCount": 74,
    "inStock": true,
    "stockQuantity": 34,
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Keep whole-body skin velvety soft, brightened, and deeply hydrated with the comforting formula of Nature Skin Aloe Vera 99% Soothing Gel Large Jar.",
    "volume": "300 ml",
    "tags": [
      "99% Pure Aloe",
      "Silky Skin",
      "Daily Moisture"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-bc-6",
    "name": "Plu Prestige Silk Body Scrub - White Musk",
    "slug": "plu-prestige-silk-body-scrub-white-musk",
    "brand": "Plu",
    "category": "body-care",
    "subcategory": "body-scrub",
    "price": 1350,
    "originalPrice": 1600,
    "discountPercent": 16,
    "rating": 4.8,
    "reviewsCount": 82,
    "inStock": true,
    "stockQuantity": 37,
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Keep whole-body skin velvety soft, brightened, and deeply hydrated with the comforting formula of Plu Prestige Silk Body Scrub - White Musk.",
    "volume": "180 g",
    "tags": [
      "Walnut Shell",
      "Silky Skin",
      "Daily Moisture"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-bc-7",
    "name": "AROMATICA Comforting Calendula Decoction Body Lotion",
    "slug": "aromatica-comforting-calendula-decoction-body-lotion",
    "brand": "AROMATICA",
    "category": "body-care",
    "subcategory": "body-lotion",
    "price": 2100,
    "originalPrice": 2450,
    "discountPercent": 14,
    "rating": 4.8,
    "reviewsCount": 90,
    "inStock": true,
    "stockQuantity": 40,
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Keep whole-body skin velvety soft, brightened, and deeply hydrated with the comforting formula of AROMATICA Comforting Calendula Decoction Body Lotion.",
    "volume": "300 ml",
    "tags": [
      "Organic Calendula",
      "Silky Skin",
      "Daily Moisture"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-bc-8",
    "name": "Pyunkang Yul Intensive Ceramide Body Lotion",
    "slug": "pyunkang-yul-intensive-ceramide-body-lotion",
    "brand": "Pyunkang Yul",
    "category": "body-care",
    "subcategory": "body-lotion",
    "price": 1850,
    "originalPrice": 2200,
    "discountPercent": 16,
    "rating": 4.8,
    "reviewsCount": 98,
    "inStock": true,
    "stockQuantity": 43,
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Keep whole-body skin velvety soft, brightened, and deeply hydrated with the comforting formula of Pyunkang Yul Intensive Ceramide Body Lotion.",
    "volume": "500 ml",
    "tags": [
      "Herbal Calming",
      "Silky Skin",
      "Daily Moisture"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-bc-9",
    "name": "Innisfree Green Tea Pure Gel Body Cleanser",
    "slug": "innisfree-green-tea-pure-gel-body-cleanser",
    "brand": "Innisfree",
    "category": "body-care",
    "subcategory": "body-wash",
    "price": 1450,
    "originalPrice": 1700,
    "discountPercent": 15,
    "rating": 4.8,
    "reviewsCount": 106,
    "inStock": true,
    "stockQuantity": 46,
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Keep whole-body skin velvety soft, brightened, and deeply hydrated with the comforting formula of Innisfree Green Tea Pure Gel Body Cleanser.",
    "volume": "310 ml",
    "tags": [
      "Jeju Green Tea",
      "Silky Skin",
      "Daily Moisture"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-bc-10",
    "name": "TonyMoly Magic Food Banana Hand Milk & Butter",
    "slug": "tonymoly-magic-food-banana-hand-milk-butter",
    "brand": "TonyMoly",
    "category": "body-care",
    "subcategory": "hand-cream",
    "price": 480,
    "originalPrice": 580,
    "discountPercent": 17,
    "rating": 4.8,
    "reviewsCount": 114,
    "inStock": true,
    "stockQuantity": 49,
    "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Keep whole-body skin velvety soft, brightened, and deeply hydrated with the comforting formula of TonyMoly Magic Food Banana Hand Milk & Butter.",
    "volume": "45 ml",
    "tags": [
      "Nutrient Banana",
      "Silky Skin",
      "Daily Moisture"
    ],
    "skinType": [
      "All Skin"
    ],
    "skinConcern": [
      "Hydration & Dryness",
      "Brightening & Dark Spots"
    ]
  },
  {
    "id": "prod-bg-1",
    "name": "K-Style Pastel Quilted Crossbody Chain Vanity Bag",
    "slug": "k-style-pastel-quilted-crossbody-chain-vanity-bag",
    "brand": "Choice Legacy",
    "category": "bags",
    "subcategory": "crossbody",
    "price": 2450,
    "originalPrice": 2950,
    "discountPercent": 17,
    "rating": 4.9,
    "reviewsCount": 25,
    "inStock": true,
    "stockQuantity": 14,
    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",
    "description": "Organize your cosmetics and elevate your fashion statement with the trend-forward K-Style Pastel Quilted Crossbody Chain Vanity Bag.",
    "volume": "1 Piece",
    "tags": [
      "Pastel Quilted",
      "Trendy Fashion",
      "Premium Quality"
    ],
    "skinType": [
      "All"
    ]
  },
  {
    "id": "prod-bg-2",
    "name": "Seoul Chic Premium Canvas Daily Tote Bag with Zip",
    "slug": "seoul-chic-premium-canvas-daily-tote-bag-with-zip",
    "brand": "Choice Legacy",
    "category": "bags",
    "subcategory": "tote-bag",
    "price": 1850,
    "originalPrice": 2250,
    "discountPercent": 18,
    "rating": 4.9,
    "reviewsCount": 31,
    "inStock": true,
    "stockQuantity": 16,
    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",
    "description": "Organize your cosmetics and elevate your fashion statement with the trend-forward Seoul Chic Premium Canvas Daily Tote Bag with Zip.",
    "volume": "1 Piece",
    "tags": [
      "Durable Canvas",
      "Trendy Fashion",
      "Premium Quality"
    ],
    "skinType": [
      "All"
    ]
  },
  {
    "id": "prod-bg-3",
    "name": "Waterproof Multi-Pocket Travel Cosmetic Organizer Bag",
    "slug": "waterproof-multi-pocket-travel-cosmetic-organizer-bag",
    "brand": "Choice Legacy",
    "category": "bags",
    "subcategory": "vanity-pouch",
    "price": 950,
    "originalPrice": 1200,
    "discountPercent": 21,
    "rating": 4.9,
    "reviewsCount": 37,
    "inStock": true,
    "stockQuantity": 18,
    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",
    "description": "Organize your cosmetics and elevate your fashion statement with the trend-forward Waterproof Multi-Pocket Travel Cosmetic Organizer Bag.",
    "volume": "1 Piece",
    "tags": [
      "Waterproof Multi-Pocket",
      "Trendy Fashion",
      "Premium Quality"
    ],
    "skinType": [
      "All"
    ]
  },
  {
    "id": "prod-bg-4",
    "name": "Vintage Plaid Accent Handbag with Shoulder Strap",
    "slug": "vintage-plaid-accent-handbag-with-shoulder-strap",
    "brand": "Choice Legacy",
    "category": "bags",
    "subcategory": "crossbody",
    "price": 2950,
    "originalPrice": 3500,
    "discountPercent": 16,
    "rating": 4.9,
    "reviewsCount": 43,
    "inStock": true,
    "stockQuantity": 20,
    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",
    "description": "Organize your cosmetics and elevate your fashion statement with the trend-forward Vintage Plaid Accent Handbag with Shoulder Strap.",
    "volume": "1 Piece",
    "tags": [
      "Plaid Classic",
      "Trendy Fashion",
      "Premium Quality"
    ],
    "skinType": [
      "All"
    ]
  },
  {
    "id": "prod-bg-5",
    "name": "Minimalist Vegan Leather Bucket Bag - Warm Oat",
    "slug": "minimalist-vegan-leather-bucket-bag-warm-oat",
    "brand": "Choice Legacy",
    "category": "bags",
    "subcategory": "crossbody",
    "price": 2650,
    "originalPrice": 3200,
    "discountPercent": 17,
    "rating": 4.9,
    "reviewsCount": 49,
    "inStock": true,
    "stockQuantity": 22,
    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",
    "description": "Organize your cosmetics and elevate your fashion statement with the trend-forward Minimalist Vegan Leather Bucket Bag - Warm Oat.",
    "volume": "1 Piece",
    "tags": [
      "Vegan Leather",
      "Trendy Fashion",
      "Premium Quality"
    ],
    "skinType": [
      "All"
    ]
  },
  {
    "id": "prod-bg-6",
    "name": "Compact Travel Makeup Vanity Case with LED Mirror",
    "slug": "compact-travel-makeup-vanity-case-with-led-mirror",
    "brand": "Choice Legacy",
    "category": "bags",
    "subcategory": "cosmetic-case",
    "price": 3250,
    "originalPrice": 3900,
    "discountPercent": 17,
    "rating": 4.9,
    "reviewsCount": 55,
    "inStock": true,
    "stockQuantity": 24,
    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",
    "description": "Organize your cosmetics and elevate your fashion statement with the trend-forward Compact Travel Makeup Vanity Case with LED Mirror.",
    "volume": "1 Piece",
    "tags": [
      "Built-In LED",
      "Trendy Fashion",
      "Premium Quality"
    ],
    "skinType": [
      "All"
    ]
  },
  {
    "id": "prod-bg-7",
    "name": "Pastel Lilac Structured Mini Top Handle Satchel",
    "slug": "pastel-lilac-structured-mini-top-handle-satchel",
    "brand": "Choice Legacy",
    "category": "bags",
    "subcategory": "crossbody",
    "price": 2750,
    "originalPrice": 3300,
    "discountPercent": 17,
    "rating": 4.9,
    "reviewsCount": 61,
    "inStock": true,
    "stockQuantity": 26,
    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",
    "description": "Organize your cosmetics and elevate your fashion statement with the trend-forward Pastel Lilac Structured Mini Top Handle Satchel.",
    "volume": "1 Piece",
    "tags": [
      "Structured Mini",
      "Trendy Fashion",
      "Premium Quality"
    ],
    "skinType": [
      "All"
    ]
  },
  {
    "id": "prod-bg-8",
    "name": "Clear Waterproof Holographic Toiletry Pouch",
    "slug": "clear-waterproof-holographic-toiletry-pouch",
    "brand": "Choice Legacy",
    "category": "bags",
    "subcategory": "vanity-pouch",
    "price": 450,
    "originalPrice": 600,
    "discountPercent": 25,
    "rating": 4.9,
    "reviewsCount": 67,
    "inStock": true,
    "stockQuantity": 28,
    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",
    "description": "Organize your cosmetics and elevate your fashion statement with the trend-forward Clear Waterproof Holographic Toiletry Pouch.",
    "volume": "1 Piece",
    "tags": [
      "Holographic Clear",
      "Trendy Fashion",
      "Premium Quality"
    ],
    "skinType": [
      "All"
    ]
  },
  {
    "id": "prod-bg-9",
    "name": "Japanese Corduroy Casual Everyday Shoulder Bag",
    "slug": "japanese-corduroy-casual-everyday-shoulder-bag",
    "brand": "Choice Legacy",
    "category": "bags",
    "subcategory": "tote-bag",
    "price": 1250,
    "originalPrice": 1550,
    "discountPercent": 19,
    "rating": 4.9,
    "reviewsCount": 73,
    "inStock": true,
    "stockQuantity": 30,
    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",
    "description": "Organize your cosmetics and elevate your fashion statement with the trend-forward Japanese Corduroy Casual Everyday Shoulder Bag.",
    "volume": "1 Piece",
    "tags": [
      "Soft Corduroy",
      "Trendy Fashion",
      "Premium Quality"
    ],
    "skinType": [
      "All"
    ]
  },
  {
    "id": "prod-bg-10",
    "name": "Velvet Embroidered Evening Clutch & Cosmetic Pouch",
    "slug": "velvet-embroidered-evening-clutch-cosmetic-pouch",
    "brand": "Choice Legacy",
    "category": "bags",
    "subcategory": "vanity-pouch",
    "price": 1650,
    "originalPrice": 1950,
    "discountPercent": 15,
    "rating": 4.9,
    "reviewsCount": 79,
    "inStock": true,
    "stockQuantity": 32,
    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",
    "description": "Organize your cosmetics and elevate your fashion statement with the trend-forward Velvet Embroidered Evening Clutch & Cosmetic Pouch.",
    "volume": "1 Piece",
    "tags": [
      "Plush Velvet",
      "Trendy Fashion",
      "Premium Quality"
    ],
    "skinType": [
      "All"
    ]
  },
  {
    "id": "prod-bp-1",
    "name": "Green Finger Chok Chok Moisture Baby Lotion",
    "slug": "green-finger-chok-chok-moisture-baby-lotion",
    "brand": "Green Finger",
    "category": "baby-products",
    "subcategory": "baby-lotion",
    "price": 1850,
    "originalPrice": 2150,
    "discountPercent": 14,
    "rating": 5,
    "reviewsCount": 35,
    "inStock": true,
    "stockQuantity": 18,
    "image": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Pediatrician-tested, tear-free, and hypoallergenic formula of Green Finger Chok Chok Moisture Baby Lotion designed to nurture infant skin gently.",
    "volume": "320 ml",
    "tags": [
      "Chok Chok Moisture",
      "Pediatrician Tested",
      "Tear-Free"
    ],
    "skinType": [
      "Baby Skin",
      "Sensitive"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-bp-2",
    "name": "Green Finger Pure Foaming Baby Head-to-Toe Wash",
    "slug": "green-finger-pure-foaming-baby-head-to-toe-wash",
    "brand": "Green Finger",
    "category": "baby-products",
    "subcategory": "baby-wash",
    "price": 1750,
    "originalPrice": 2050,
    "discountPercent": 15,
    "rating": 5,
    "reviewsCount": 43,
    "inStock": true,
    "stockQuantity": 20,
    "image": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Pediatrician-tested, tear-free, and hypoallergenic formula of Green Finger Pure Foaming Baby Head-to-Toe Wash designed to nurture infant skin gently.",
    "volume": "320 ml",
    "tags": [
      "Tear-Free Foam",
      "Pediatrician Tested",
      "Tear-Free"
    ],
    "skinType": [
      "Baby Skin",
      "Sensitive"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-bp-3",
    "name": "Pyunkang Yul Kids & Baby Ato Body Wash",
    "slug": "pyunkang-yul-kids-baby-ato-body-wash",
    "brand": "Pyunkang Yul",
    "category": "baby-products",
    "subcategory": "baby-wash",
    "price": 2150,
    "originalPrice": 2500,
    "discountPercent": 14,
    "rating": 5,
    "reviewsCount": 51,
    "inStock": true,
    "stockQuantity": 22,
    "image": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Pediatrician-tested, tear-free, and hypoallergenic formula of Pyunkang Yul Kids & Baby Ato Body Wash designed to nurture infant skin gently.",
    "volume": "590 ml",
    "tags": [
      "Ato Eczema Care",
      "Pediatrician Tested",
      "Tear-Free"
    ],
    "skinType": [
      "Baby Skin",
      "Sensitive"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-bp-4",
    "name": "Pyunkang Yul Kids & Baby Soothing Ato Cream",
    "slug": "pyunkang-yul-kids-baby-soothing-ato-cream",
    "brand": "Pyunkang Yul",
    "category": "baby-products",
    "subcategory": "baby-lotion",
    "price": 1850,
    "originalPrice": 2200,
    "discountPercent": 16,
    "rating": 5,
    "reviewsCount": 59,
    "inStock": true,
    "stockQuantity": 24,
    "image": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Pediatrician-tested, tear-free, and hypoallergenic formula of Pyunkang Yul Kids & Baby Soothing Ato Cream designed to nurture infant skin gently.",
    "volume": "200 ml",
    "tags": [
      "Barrier Relief",
      "Pediatrician Tested",
      "Tear-Free"
    ],
    "skinType": [
      "Baby Skin",
      "Sensitive"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-bp-5",
    "name": "B&B Hypoallergenic Baby Fabric Cleanser & Detergent",
    "slug": "b-b-hypoallergenic-baby-fabric-cleanser-detergent",
    "brand": "Green Finger",
    "category": "baby-products",
    "subcategory": "baby-wash",
    "price": 1350,
    "originalPrice": 1600,
    "discountPercent": 16,
    "rating": 5,
    "reviewsCount": 67,
    "inStock": true,
    "stockQuantity": 26,
    "image": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Pediatrician-tested, tear-free, and hypoallergenic formula of B&B Hypoallergenic Baby Fabric Cleanser & Detergent designed to nurture infant skin gently.",
    "volume": "1500 ml",
    "tags": [
      "Skin Gentle",
      "Pediatrician Tested",
      "Tear-Free"
    ],
    "skinType": [
      "Baby Skin",
      "Sensitive"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-bp-6",
    "name": "Sanosan Baby Care Bath & Shampoo Gentle Tear-Free",
    "slug": "sanosan-baby-care-bath-shampoo-gentle-tear-free",
    "brand": "Sanosan",
    "category": "baby-products",
    "subcategory": "baby-wash",
    "price": 1450,
    "originalPrice": 1750,
    "discountPercent": 17,
    "rating": 5,
    "reviewsCount": 75,
    "inStock": true,
    "stockQuantity": 28,
    "image": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Pediatrician-tested, tear-free, and hypoallergenic formula of Sanosan Baby Care Bath & Shampoo Gentle Tear-Free designed to nurture infant skin gently.",
    "volume": "500 ml",
    "tags": [
      "Organic Olive Oil",
      "Pediatrician Tested",
      "Tear-Free"
    ],
    "skinType": [
      "Baby Skin",
      "Sensitive"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-bp-7",
    "name": "Sebamed Baby Gentle Cleansing Bar Soap",
    "slug": "sebamed-baby-gentle-cleansing-bar-soap",
    "brand": "Sebamed",
    "category": "baby-products",
    "subcategory": "diaper-cream",
    "price": 580,
    "originalPrice": 700,
    "discountPercent": 17,
    "rating": 5,
    "reviewsCount": 83,
    "inStock": true,
    "stockQuantity": 30,
    "image": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Pediatrician-tested, tear-free, and hypoallergenic formula of Sebamed Baby Gentle Cleansing Bar Soap designed to nurture infant skin gently.",
    "volume": "100 g",
    "tags": [
      "pH 5.5 Sugar Tenside",
      "Pediatrician Tested",
      "Tear-Free"
    ],
    "skinType": [
      "Baby Skin",
      "Sensitive"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-bp-8",
    "name": "Green Finger Pure Mineral Baby Sun Cushion SPF50+",
    "slug": "green-finger-pure-mineral-baby-sun-cushion-spf50",
    "brand": "Green Finger",
    "category": "baby-products",
    "subcategory": "baby-sunscreen",
    "price": 2250,
    "originalPrice": 2650,
    "discountPercent": 15,
    "rating": 5,
    "reviewsCount": 91,
    "inStock": true,
    "stockQuantity": 32,
    "image": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Pediatrician-tested, tear-free, and hypoallergenic formula of Green Finger Pure Mineral Baby Sun Cushion SPF50+ designed to nurture infant skin gently.",
    "volume": "15 g",
    "tags": [
      "Physical Zinc Sun",
      "Pediatrician Tested",
      "Tear-Free"
    ],
    "skinType": [
      "Baby Skin",
      "Sensitive"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-bp-9",
    "name": "Baby Dove Rich Moisture Sensitive Head to Toe Wash",
    "slug": "baby-dove-rich-moisture-sensitive-head-to-toe-wash",
    "brand": "Baby Dove",
    "category": "baby-products",
    "subcategory": "baby-wash",
    "price": 1250,
    "originalPrice": 1500,
    "discountPercent": 17,
    "rating": 5,
    "reviewsCount": 99,
    "inStock": true,
    "stockQuantity": 34,
    "image": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Pediatrician-tested, tear-free, and hypoallergenic formula of Baby Dove Rich Moisture Sensitive Head to Toe Wash designed to nurture infant skin gently.",
    "volume": "400 ml",
    "tags": [
      "Prebiotic Moisture",
      "Pediatrician Tested",
      "Tear-Free"
    ],
    "skinType": [
      "Baby Skin",
      "Sensitive"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-bp-10",
    "name": "Mustela Hydra Bebe Daily Soothing Baby Facial Cream",
    "slug": "mustela-hydra-bebe-daily-soothing-baby-facial-cream",
    "brand": "Mustela",
    "category": "baby-products",
    "subcategory": "baby-lotion",
    "price": 1650,
    "originalPrice": 1950,
    "discountPercent": 15,
    "rating": 5,
    "reviewsCount": 107,
    "inStock": true,
    "stockQuantity": 36,
    "image": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608248597359-00994fa4e67a?auto=format&fit=crop&w=700&q=80",
    "description": "Pediatrician-tested, tear-free, and hypoallergenic formula of Mustela Hydra Bebe Daily Soothing Baby Facial Cream designed to nurture infant skin gently.",
    "volume": "40 ml",
    "tags": [
      "Avocado Perseose",
      "Pediatrician Tested",
      "Tear-Free"
    ],
    "skinType": [
      "Baby Skin",
      "Sensitive"
    ],
    "skinConcern": [
      "Redness & Calming"
    ]
  },
  {
    "id": "prod-ac-1",
    "name": "Korean SPA Exfoliating Viscose Deep Scrub Mitts (3-Pack)",
    "slug": "korean-spa-exfoliating-viscose-deep-scrub-mitts-3-pack",
    "brand": "Choice Legacy",
    "category": "accessories",
    "subcategory": "bath-mitts",
    "price": 350,
    "originalPrice": 450,
    "discountPercent": 22,
    "rating": 4.8,
    "reviewsCount": 30,
    "inStock": true,
    "stockQuantity": 40,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
    "description": "Upgrade your daily beauty ritual with Korean SPA Exfoliating Viscose Deep Scrub Mitts (3-Pack). Designed for seamless precision and hygienic application.",
    "volume": "3 Pieces",
    "tags": [
      "Viscose Exfoliant",
      "Essential Tool",
      "Pro Quality"
    ],
    "skinType": [
      "All"
    ]
  },
  {
    "id": "prod-ac-2",
    "name": "TIRTIR Hydrophilic Soft Air Cushion Puff Duo Pack",
    "slug": "tirtir-hydrophilic-soft-air-cushion-puff-duo-pack",
    "brand": "Tirtir",
    "category": "accessories",
    "subcategory": "beauty-blender",
    "price": 450,
    "originalPrice": 550,
    "discountPercent": 18,
    "rating": 4.8,
    "reviewsCount": 35,
    "inStock": true,
    "stockQuantity": 45,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
    "description": "Upgrade your daily beauty ritual with TIRTIR Hydrophilic Soft Air Cushion Puff Duo Pack. Designed for seamless precision and hygienic application.",
    "volume": "2 Pieces",
    "tags": [
      "Rubycell Tech",
      "Essential Tool",
      "Pro Quality"
    ],
    "skinType": [
      "All"
    ]
  },
  {
    "id": "prod-ac-3",
    "name": "Ultra-Plush Spa Makeup Bow Hairband for Skincare Routine",
    "slug": "ultra-plush-spa-makeup-bow-hairband-for-skincare-routine",
    "brand": "Choice Legacy",
    "category": "accessories",
    "subcategory": "spa-tools",
    "price": 250,
    "originalPrice": 350,
    "discountPercent": 29,
    "rating": 4.8,
    "reviewsCount": 40,
    "inStock": true,
    "stockQuantity": 50,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
    "description": "Upgrade your daily beauty ritual with Ultra-Plush Spa Makeup Bow Hairband for Skincare Routine. Designed for seamless precision and hygienic application.",
    "volume": "1 Piece",
    "tags": [
      "Super Soft Fleece",
      "Essential Tool",
      "Pro Quality"
    ],
    "skinType": [
      "All"
    ]
  },
  {
    "id": "prod-ac-4",
    "name": "Real Techniques Miracle Complexion Blender Sponge Trio",
    "slug": "real-techniques-miracle-complexion-blender-sponge-trio",
    "brand": "Real Techniques",
    "category": "accessories",
    "subcategory": "beauty-blender",
    "price": 1450,
    "originalPrice": 1750,
    "discountPercent": 17,
    "rating": 4.8,
    "reviewsCount": 45,
    "inStock": true,
    "stockQuantity": 55,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
    "description": "Upgrade your daily beauty ritual with Real Techniques Miracle Complexion Blender Sponge Trio. Designed for seamless precision and hygienic application.",
    "volume": "3 Sponges",
    "tags": [
      "Flawless Base",
      "Essential Tool",
      "Pro Quality"
    ],
    "skinType": [
      "All"
    ]
  },
  {
    "id": "prod-ac-5",
    "name": "Japanese Charcoal Konjac Face Cleansing Sponge",
    "slug": "japanese-charcoal-konjac-face-cleansing-sponge",
    "brand": "Choice Legacy",
    "category": "accessories",
    "subcategory": "beauty-blender",
    "price": 380,
    "originalPrice": 480,
    "discountPercent": 21,
    "rating": 4.8,
    "reviewsCount": 50,
    "inStock": true,
    "stockQuantity": 60,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
    "description": "Upgrade your daily beauty ritual with Japanese Charcoal Konjac Face Cleansing Sponge. Designed for seamless precision and hygienic application.",
    "volume": "1 Piece",
    "tags": [
      "Natural Konjac",
      "Essential Tool",
      "Pro Quality"
    ],
    "skinType": [
      "All"
    ]
  },
  {
    "id": "prod-ac-6",
    "name": "Silicone Facial Mask & Serum Applicator Spatula",
    "slug": "silicone-facial-mask-serum-applicator-spatula",
    "brand": "Choice Legacy",
    "category": "accessories",
    "subcategory": "spa-tools",
    "price": 220,
    "originalPrice": 300,
    "discountPercent": 27,
    "rating": 4.8,
    "reviewsCount": 55,
    "inStock": true,
    "stockQuantity": 65,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
    "description": "Upgrade your daily beauty ritual with Silicone Facial Mask & Serum Applicator Spatula. Designed for seamless precision and hygienic application.",
    "volume": "1 Piece",
    "tags": [
      "Hygienic Silicone",
      "Essential Tool",
      "Pro Quality"
    ],
    "skinType": [
      "All"
    ]
  },
  {
    "id": "prod-ac-7",
    "name": "Premium 10-Piece Rose Gold Soft Synthetic Beauty Brush Set",
    "slug": "premium-10-piece-rose-gold-soft-synthetic-beauty-brush-set",
    "brand": "Choice Legacy",
    "category": "accessories",
    "subcategory": "brush-sets",
    "price": 1950,
    "originalPrice": 2400,
    "discountPercent": 19,
    "rating": 4.8,
    "reviewsCount": 60,
    "inStock": true,
    "stockQuantity": 70,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
    "description": "Upgrade your daily beauty ritual with Premium 10-Piece Rose Gold Soft Synthetic Beauty Brush Set. Designed for seamless precision and hygienic application.",
    "volume": "10 Brushes",
    "tags": [
      "Cruelty-Free Bristles",
      "Essential Tool",
      "Pro Quality"
    ],
    "skinType": [
      "All"
    ]
  },
  {
    "id": "prod-ac-8",
    "name": "Dual-Sided Jade Facial Roller & Gua Sha Scraping Tool Set",
    "slug": "dual-sided-jade-facial-roller-gua-sha-scraping-tool-set",
    "brand": "Choice Legacy",
    "category": "accessories",
    "subcategory": "spa-tools",
    "price": 850,
    "originalPrice": 1100,
    "discountPercent": 23,
    "rating": 4.8,
    "reviewsCount": 65,
    "inStock": true,
    "stockQuantity": 75,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
    "description": "Upgrade your daily beauty ritual with Dual-Sided Jade Facial Roller & Gua Sha Scraping Tool Set. Designed for seamless precision and hygienic application.",
    "volume": "2 Pieces",
    "tags": [
      "Natural Xiuyan Jade",
      "Essential Tool",
      "Pro Quality"
    ],
    "skinType": [
      "All"
    ]
  },
  {
    "id": "prod-ac-9",
    "name": "Cotton Mesh Foaming Bubble Maker Net for Facial Soap",
    "slug": "cotton-mesh-foaming-bubble-maker-net-for-facial-soap",
    "brand": "Choice Legacy",
    "category": "accessories",
    "subcategory": "bath-mitts",
    "price": 150,
    "originalPrice": 220,
    "discountPercent": 32,
    "rating": 4.8,
    "reviewsCount": 70,
    "inStock": true,
    "stockQuantity": 80,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
    "description": "Upgrade your daily beauty ritual with Cotton Mesh Foaming Bubble Maker Net for Facial Soap. Designed for seamless precision and hygienic application.",
    "volume": "2 Pieces",
    "tags": [
      "Micro Bubble Whip",
      "Essential Tool",
      "Pro Quality"
    ],
    "skinType": [
      "All"
    ]
  },
  {
    "id": "prod-ac-10",
    "name": "Eyelash Curler with Ergonomic Handle & Refill Pads",
    "slug": "eyelash-curler-with-ergonomic-handle-refill-pads",
    "brand": "Choice Legacy",
    "category": "accessories",
    "subcategory": "spa-tools",
    "price": 420,
    "originalPrice": 550,
    "discountPercent": 24,
    "rating": 4.8,
    "reviewsCount": 75,
    "inStock": true,
    "stockQuantity": 85,
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",
    "description": "Upgrade your daily beauty ritual with Eyelash Curler with Ergonomic Handle & Refill Pads. Designed for seamless precision and hygienic application.",
    "volume": "1 Piece",
    "tags": [
      "Spring-Action Curl",
      "Essential Tool",
      "Pro Quality"
    ],
    "skinType": [
      "All"
    ]
  }
];

// ============================================================================
// 7. FIGMA STOREFRONT LANDING PAGE CATEGORIES & MARQUEE DATA
// ============================================================================
export interface FigmaCategoryItem {
  id: number;
  title: string;
  slug: string;
  image: string;
  bgColor: string;
  link: string;
}

export const FIGMA_CATEGORIES_ROW_1: FigmaCategoryItem[] = [
  { id: 1, title: "Skin Care", slug: "skin-care", image: catSkincare, bgColor: "#E0E7FF", link: "/shop?category=skin-care" },
  { id: 2, title: "Personal Care", slug: "personal-care", image: catPersonalcare, bgColor: "#FAE8FF", link: "/shop?category=personal-care" },
  { id: 3, title: "Makeup", slug: "makeup", image: catMakeup, bgColor: "#DCFCE7", link: "/shop?category=makeup" },
  { id: 4, title: "Lip Care", slug: "lip-care", image: catLipcare, bgColor: "#FFE4E6", link: "/shop?category=lip-care" },
  { id: 5, title: "Hair Care", slug: "hair-care", image: catHaircare, bgColor: "#E0F2FE", link: "/shop?category=hair-care" },
  { id: 6, title: "Fragrance", slug: "fragrance", image: catFragrance, bgColor: "#F7FEE7", link: "/shop?category=fragrance" },
];

export const FIGMA_CATEGORIES_ROW_2: FigmaCategoryItem[] = [
  { id: 7, title: "Food & Supps", slug: "food-supps", image: catFoodsupps, bgColor: "#FEFCE8", link: "/shop?category=food-supps" },
  { id: 8, title: "Combo Set", slug: "combo-set", image: catComboset, bgColor: "#FEE2E2", link: "/shop?category=combo-set" },
  { id: 9, title: "Body Care", slug: "body-care", image: catBodycare, bgColor: "#E0F2FE", link: "/shop?category=body-care" },
  { id: 10, title: "Bags", slug: "bags", image: catBags, bgColor: "#FFF7ED", link: "/shop?category=bags" },
  { id: 11, title: "Baby Product", slug: "baby-products", image: catBabyproducts, bgColor: "#DCFCE7", link: "/shop?category=baby-products" },
  { id: 12, title: "Accessories", slug: "accessories", image: catAccessories, bgColor: "#F3E8FF", link: "/shop?category=accessories" },
];

export const ALL_FIGMA_CATEGORIES: FigmaCategoryItem[] = [
  ...FIGMA_CATEGORIES_ROW_1,
  ...FIGMA_CATEGORIES_ROW_2,
];

export interface BrandMarqueeItem {
  id: number;
  name: string;
  logo: string;
  slug: string;
}

export const BRAND_MARQUEE_ITEMS: BrandMarqueeItem[] = [
  { id: 1, name: "COSRX", logo: topBrandCosrx, slug: "cosrx" },
  { id: 2, name: "Beauty of Joseon", logo: topBrandBeautyOfJoseon, slug: "beauty-of-joseon" },
  { id: 3, name: "Anua", logo: topBrandAnua, slug: "anua" },
  { id: 4, name: "SKIN1004", logo: topBrandSkin1004, slug: "skin1004" },
  { id: 5, name: "Medicube", logo: topBrandMedicube, slug: "medicube" },
  { id: 6, name: "Dr. Althea", logo: topBrandDrAlthea, slug: "dr-althea" },
  { id: 7, name: "Missha", logo: topBrandMissha, slug: "missha" },
  { id: 8, name: "Purito", logo: topBrandPurito, slug: "purito" },
  { id: 9, name: "The Face Shop", logo: topBrandTheFaceShop, slug: "the-face-shop" },
  { id: 10, name: "Celimax", logo: topBrandCelimax, slug: "celimax" },
  { id: 11, name: "Axis-Y", logo: topBrandAxisY, slug: "axis-y" },
  { id: 12, name: "Carenel", logo: topBrandCarenel, slug: "carenel" },
  { id: 13, name: "IUNIK", logo: topBrandIunik, slug: "iunik" },
  { id: 14, name: "DECIEM", logo: topBrandDeciem, slug: "deciem" },
  { id: 15, name: "Arencia", logo: topBrandArencia, slug: "arencia" },
  { id: 16, name: "I'm From", logo: topBrandImFrom, slug: "im-from" },
  { id: 17, name: "APLB", logo: topBrandAplb, slug: "aplb" },
  { id: 18, name: "Beauté", logo: topBrandBeaute, slug: "beaute" },
  { id: 19, name: "DABO", logo: topBrandDabo, slug: "dabo" },
  { id: 20, name: "Nature Skin", logo: topBrandNatureSkin, slug: "nature-skin" },
];

// ============================================================================
// 8. FEATURED PRODUCTS & REVIEWS DATA
// ============================================================================
export interface FeaturedItem {
  id: number;
  title: string;
  price: string;
  image: string;
  thumb: string;
  link: string;
}

export const FEATURED_ITEMS: FeaturedItem[] = [
  { id: 1, title: "Lalisa Daily Hydrating Milk", price: "$24.00", image: featGreen, thumb: featGreen, link: "/shop?category=skin-care" },
  { id: 2, title: "Ekos Maracujá Nectar Oil", price: "$32.00", image: heroEkos, thumb: heroEkos, link: "/shop?category=body-care" },
  { id: 3, title: "Lumière Golden Glow Cream", price: "$36.00", image: featCenter, thumb: featCenter, link: "/shop?category=skin-care" },
  { id: 4, title: "Denim Essence Day Repair", price: "$28.00", image: featDenim, thumb: featDenim, link: "/shop?category=skin-care" },
  { id: 5, title: "Active-C Brightening Elixir", price: "$42.00", image: heroActiveC, thumb: heroActiveC, link: "/shop?category=skin-care" },
  { id: 6, title: "Pink Peony Hydrating Essence", price: "$30.00", image: promoPinkSkincare, thumb: promoPinkSkincare, link: "/shop?category=skin-care" },
];

export interface CustomerReviewItem {
  id: number;
  author: string;
  avatar: string;
  productName: string;
  rating: number;
  date: string;
  comment: string;
  tag: string;
  bgColor: string;
  accentColor: string;
}

export const CUSTOMER_REVIEWS_DATA: CustomerReviewItem[] = [
  {
    id: 1,
    author: "Sadia Rahman",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    productName: "Tirtir Ceramic Milk Ampoule",
    rating: 5,
    date: "2 days ago",
    comment: "This gave me the glass skin finish I always dreamed of without feeling sticky or heavy. Delivered within 24 hours in Dhaka!",
    tag: "Glowing Skin",
    bgColor: "#E8EBFD",
    accentColor: "#6366F1",
  },
  {
    id: 2,
    author: "Nafisa Anjum",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    productName: "COSRX Snail 96 Mucin",
    rating: 5,
    date: "3 days ago",
    comment: "Completely repaired my damaged barrier within two weeks. 100% authentic product with original batch QR code. Highly recommended!",
    tag: "Skin Barrier",
    bgColor: "#FDE9F3",
    accentColor: "#D946EF",
  },
  {
    id: 3,
    author: "Farhana Islam",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    productName: "Beauty of Joseon Sunscreen",
    rating: 5,
    date: "5 days ago",
    comment: "Zero white cast, absorbs like a light moisturizer, and makeup sits so smoothly on top! Will definitely order my second bottle.",
    tag: "Sun Protection",
    bgColor: "#E8FCE9",
    accentColor: "#10B981",
  },
  {
    id: 4,
    author: "Tasnim Zarin",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80",
    productName: "Lumière Rejuvenating Cream",
    rating: 5,
    date: "1 week ago",
    comment: "Super fast delivery to Chittagong! The packaging was pristine with the genuine brand seal intact. Softest skin ever.",
    tag: "Luxury Care",
    bgColor: "#FEEFE6",
    accentColor: "#F97316",
  },
  {
    id: 5,
    author: "Mahrin Ahmed",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    productName: "Medicube Zero Pore Serum",
    rating: 5,
    date: "2 weeks ago",
    comment: "Noticeable reduction in sebum and pore texture within 10 days. Outstanding authenticity and customer care from KC Bazar.",
    tag: "Pore Care",
    bgColor: "#E2F6FF",
    accentColor: "#0284C7",
  },
  {
    id: 6,
    author: "Ayesha Siddiqua",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    productName: "Dr. Althea 345 Relief Cream",
    rating: 5,
    date: "2 weeks ago",
    comment: "Calms my redness overnight. I love that KC Bazar provides verified QR codes for batch authenticity. 10/10 service!",
    tag: "Calming Care",
    bgColor: "#F7FFE2",
    accentColor: "#65A30D",
  },
  {
    id: 7,
    author: "Ritu Chowdhury",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    productName: "Centella Calming Serum",
    rating: 5,
    date: "2 weeks ago",
    comment: "Calmed my redness and active breakouts in just 3 days! Best customer support service from SHOB Now.",
    tag: "Anti-Acne",
    bgColor: "#E2EFFF",
    accentColor: "#3B82F6",
  },
  {
    id: 8,
    author: "Sumaiya Binte",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    productName: "Rice Water Bright Foaming Cleanser",
    rating: 5,
    date: "3 weeks ago",
    comment: "Very gentle on sensitive skin, washes away dirt and waterproof makeup easily without stripping moisture.",
    tag: "Cleansing",
    bgColor: "#F3E2FF",
    accentColor: "#A855F7",
  },
];

// ============================================================================
// 9. SHOP PAGE BANNERS & SIDEBAR BRANDS DATA
// ============================================================================
export interface ShopBannerItem {
  id: number;
  image: string;
  alt: string;
}

export const SHOP_BANNERS: ShopBannerItem[] = [
  { id: 1, image: bannerAugust, alt: "August Beauty Deals" },
  { id: 2, image: skincareBanner, alt: "Skincare Essentials" },
  { id: 3, image: makeupBanner, alt: "Luxury Makeup Collection" },
  { id: 4, image: pujaBanner, alt: "Festive Exclusive Offers" },
];

export interface SidebarBrandItem {
  id: string;
  name: string;
  logo: string;
  count: number;
}

export const SIDEBAR_BRANDS: SidebarBrandItem[] = [
  { id: "anjo", name: "Anjo", logo: topBrandAnua, count: 50 },
  { id: "cosrx", name: "CosRx", logo: topBrandCosrx, count: 50 },
  { id: "dabo", name: "Dabo", logo: topBrandDabo, count: 50 },
  { id: "nature-skin", name: "ecorce Nature Skin", logo: topBrandNatureSkin, count: 50 },
  { id: "innisfree", name: "Innisfree", logo: topBrandBeautyOfJoseon, count: 50 },
  { id: "missha", name: "Missha", logo: topBrandMissha, count: 50 },
  { id: "the-saem", name: "The Saem", logo: topBrandSkin1004, count: 50 },
  { id: "anua", name: "Anua", logo: topBrandAnua, count: 50 },
  { id: "medicube", name: "Medicube", logo: topBrandMedicube, count: 50 },
];

// ============================================================================
// 10. PRODUCT DETAILS PAGE (VIVVIRA SPEC & SPEECH BUBBLE REVIEWS) DATA
// ============================================================================
export const VIVVIRA_GALLERY_IMAGES: string[] = [
  vivviraMain,
  vivviraThumb1,
  vivviraThumb2,
  vivviraThumb3,
];

export interface SpeechBubbleReview {
  id: string;
  author: string;
  avatar: string;
  bgColor: string;
  bubbleBorderColor: string;
  accentColor: string;
  comment: string;
  rating: number;
}

export const SPEECH_BUBBLE_REVIEWS: SpeechBubbleReview[] = [
  {
    id: "card-1",
    author: "Paula Oxford",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    bgColor: "#D8F3DC",
    bubbleBorderColor: "#B7E4C7",
    accentColor: "#2D6A4F",
    comment:
      "This gave me the glass skin finish I always dreamed of without feeling sticky or heavy. Delivered within 24 hours in Dhaka!",
    rating: 5,
  },
  {
    id: "card-2",
    author: "Paula Oxford",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
    bgColor: "#FFE5EC",
    bubbleBorderColor: "#FFC2D1",
    accentColor: "#A20E4C",
    comment:
      "Completely repaired my damaged barrier within two weeks. 100% authentic product with original batch QR code. Highly recommended!",
    rating: 5,
  },
  {
    id: "card-3",
    author: "Paula Oxford",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    bgColor: "#D7E3FC",
    bubbleBorderColor: "#BAC7F5",
    accentColor: "#274C77",
    comment:
      "Zero white cast, absorbs like a light moisturizer, and makeup sits so smoothly on top! Will definitely order my second bottle.",
    rating: 5,
  },
  {
    id: "card-4",
    author: "Paula Oxford",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
    bgColor: "#FEF9C3",
    bubbleBorderColor: "#FDE047",
    accentColor: "#854D0E",
    comment:
      "Super fast delivery! The packaging was pristine with the genuine brand seal intact. Softest and healthiest skin ever.",
    rating: 5,
  },
];

export interface RelatedProductMock {
  id: string;
  name: string;
  price: number;
  priceStr: string;
  stockStatus: string;
  soldCount: number;
  image: string;
  slug: string;
}

export const RELATED_PRODUCTS_MOCK: RelatedProductMock[] = [
  {
    id: "rel-1",
    name: "Name of the product",
    price: 123.0,
    priceStr: "$123.00",
    stockStatus: "In-Stock",
    soldCount: 12,
    image: prodBienPink,
    slug: "bien-luxury-peony-cream",
  },
  {
    id: "rel-2",
    name: "Name of the product",
    price: 123.0,
    priceStr: "$123.00",
    stockStatus: "In-Stock",
    soldCount: 12,
    image: prodRedJars,
    slug: "oak-moss-hydrating-balm",
  },
  {
    id: "rel-3",
    name: "Name of the product",
    price: 123.0,
    priceStr: "$123.00",
    stockStatus: "In-Stock",
    soldCount: 12,
    image: prodPeachColvea,
    slug: "colvea-renewal-facial-cream",
  },
  {
    id: "rel-4",
    name: "Name of the product",
    price: 123.0,
    priceStr: "$123.00",
    stockStatus: "In-Stock",
    soldCount: 12,
    image: prodGreenJar,
    slug: "botanica-fresh-herbal-cream",
  },
];

// ============================================================================
// 11. CURATED COLLECTIONS TABS DATA
// ============================================================================
export type CuratedTabType = "all" | "skincare" | "makeup" | "haircare" | "new";

export interface CuratedTabItem {
  id: CuratedTabType;
  label: string;
  badge?: string;
}

export const CURATED_COLLECTION_TABS: CuratedTabItem[] = [
  { id: "all", label: "🌟 All Curated" },
  { id: "skincare", label: "Skin Care", badge: "Trending" },
  { id: "makeup", label: "Makeup & Glow" },
  { id: "haircare", label: "Hair Care" },
  { id: "new", label: "✨ New Arrivals", badge: "Fresh" },
];

// ============================================================================
// 12. TRUST BADGES DATA
// ============================================================================
export interface TrustBadgeItem {
  iconName: "Truck" | "ShieldCheck" | "CreditCard" | "RotateCcw" | "Headset";
  title: string;
  description: string;
  badge?: string;
}

export const TRUST_BADGES_DATA: TrustBadgeItem[] = [
  {
    iconName: "Truck",
    title: "Free Express Delivery",
    description: "Across Bangladesh over ৳1,500",
    badge: "Fast",
  },
  {
    iconName: "ShieldCheck",
    title: "100% Authentic",
    description: "Directly imported genuine brands",
    badge: "Verified",
  },
  {
    iconName: "CreditCard",
    title: "Cash on Delivery",
    description: "bKash, Nagad & Cards accepted",
  },
  {
    iconName: "RotateCcw",
    title: "7-Day Easy Returns",
    description: "Hassle-free replacement policy",
  },
  {
    iconName: "Headset",
    title: "24/7 Support",
    description: "Dedicated assistance anytime",
  },
];

// ============================================================================
// 13. CUSTOMER TESTIMONIALS DATA & METRICS
// ============================================================================
export interface CustomerTestimonialItem {
  id: number;
  name: string;
  location: string;
  product: string;
  skinType: string;
  rating: number;
  comment: string;
  date: string;
}

export const CUSTOMER_TESTIMONIALS_DATA: CustomerTestimonialItem[] = [
  {
    id: 1,
    name: "Nusrat Jahan",
    location: "Dhanmondi, Dhaka",
    product: "Beauty of Joseon Relief Sun Rice + Probiotics",
    skinType: "Combination / Sensitive",
    rating: 5,
    comment:
      "100% authentic product! The delivery took only 24 hours inside Dhaka. The sunscreen leaves zero white cast and feels like a light moisturizer. Will definitely order again from KC Bazar!",
    date: "Verified Buyer • 2 days ago",
  },
  {
    id: 2,
    name: "Tanvir Ahmed",
    location: "Agrabad, Chattogram",
    product: "COSRX Advanced Snail 96 Mucin Power Essence",
    skinType: "Acne Prone / Dehydrated",
    rating: 5,
    comment:
      "I was skeptical about finding original Korean products in Bangladesh, but the batch code and QR code verified instantly. My skin texture has smoothed out tremendously in 3 weeks.",
    date: "Verified Buyer • 5 days ago",
  },
  {
    id: 3,
    name: "Farhana Rahman",
    location: "Sylhet Sadar",
    product: "Anua Heartleaf 77% Soothing Toner",
    skinType: "Redness / Sensitive Skin",
    rating: 5,
    comment:
      "Customer support was incredibly helpful in suggesting the right toner for my sensitive barrier. Packaging was flawless with bubble wrap. Top-notch service!",
    date: "Verified Buyer • 1 week ago",
  },
];

export interface TestimonialMetricItem {
  value: string;
  label: string;
  color: string;
}

export const TESTIMONIALS_METRICS: TestimonialMetricItem[] = [
  { value: "45k+", label: "Orders Delivered", color: "text-gray-900" },
  { value: "99.4%", label: "Authenticity Rating", color: "text-primary" },
  { value: "24-48h", label: "Average Shipping", color: "text-emerald-600" },
  { value: "4.9 / 5.0", label: "Customer Score", color: "text-amber-500" },
];

// ============================================================================
// 14. NAVIGATION SUB ITEMS
// ============================================================================
export interface NavSubItem {
  name: string;
  path: string;
}

export const NAV_SUB_ITEMS: NavSubItem[] = [
  { name: "All Categories", path: "/#categories" },
  { name: "Shop", path: "/shop" },
  { name: "Top Selling", path: "/top-selling" },
  { name: "New Arrivals", path: "/shop?sort=newest" },
  { name: "Featured Products", path: "/shop?filter=featured" },
  { name: "Brands", path: "/brands" },
  { name: "Order Tracking", path: "/track-order" },
];

// ============================================================================
// 15. CONTACT FAQS
// ============================================================================
export interface ContactFAQItem {
  question: string;
  answer: string;
}

export const CONTACT_FAQS: ContactFAQItem[] = [
  {
    question: "How long does delivery take inside and outside Dhaka?",
    answer:
      "Orders inside Dhaka are typically delivered within 24 to 48 hours. For deliveries outside Dhaka across all 64 districts of Bangladesh, delivery takes 48 to 72 hours via our authorized courier partners (SteadFast & Pathao).",
  },
  {
    question: "Are all products on Show NOW 100% authentic?",
    answer:
      "Yes, absolutely. We source all skincare, cosmetics, and fragrance products directly from authorized global brand manufacturers and verified official distributors. We provide a 100% authenticity guarantee on every purchase.",
  },
  {
    question: "What is your return and refund policy?",
    answer:
      "We offer a 7-day hassle-free return policy for any damaged, defective, or incorrect items. As long as the product is intact, unsealed (for hygienic items), and in original packaging with proof of purchase, we will process an immediate exchange or refund.",
  },
  {
    question: "Do you offer Cash on Delivery (COD)?",
    answer:
      "Yes! Cash on Delivery is available across all 64 districts of Bangladesh. You can also pay securely online via bKash, Nagad, Rocket, or Visa/Mastercard/Amex cards.",
  },
];

// ============================================================================
// 16. CAREERS & PERKS DATA
// ============================================================================
export interface CareerJobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  responsibilities: string[];
}

export const CAREER_JOB_POSITIONS: CareerJobPosition[] = [
  {
    id: "fe-dev",
    title: "Senior Frontend Engineer (React / TypeScript)",
    department: "Engineering",
    location: "Banani, Dhaka (Hybrid)",
    type: "Full-Time",
    experience: "3+ Years",
    description:
      "Join our core engineering team to build lightning-fast, high-converting e-commerce web applications with React, Vite, and Tailwind CSS.",
    responsibilities: [
      "Develop responsive and accessible web interfaces with clean architecture",
      "Optimize core web vitals, load speeds, and seamless checkout flows",
      "Collaborate with product designers and backend APIs for real-time inventory",
    ],
  },
  {
    id: "skin-consultant",
    title: "Skincare Specialist & Customer Advisor",
    department: "Customer Experience",
    location: "Banani Flagship, Dhaka",
    type: "Full-Time",
    experience: "1+ Years in Skincare / Cosmetics",
    description:
      "Help our customers identify their skin types and build personalized skincare routines using authentic Korean, Japanese, and Western skincare products.",
    responsibilities: [
      "Provide empathetic, expert recommendations via live chat and phone",
      "Analyze customer skin concerns (acne, hyperpigmentation, barrier repair)",
      "Maintain 98%+ customer satisfaction and feedback ratings",
    ],
  },
  {
    id: "growth-marketing",
    title: "Digital Growth & Performance Marketer",
    department: "Marketing",
    location: "Banani, Dhaka",
    type: "Full-Time",
    experience: "2+ Years",
    description:
      "Drive customer acquisition, retention, and brand love through high-ROI Meta, Google, and TikTok advertising campaigns.",
    responsibilities: [
      "Manage performance marketing budgets with data-driven ROAS targets",
      "Design A/B tests for landing pages, ad creatives, and promotion offers",
      "Analyze customer lifecycle, repurchase rates, and conversion funnels",
    ],
  },
  {
    id: "logistics-lead",
    title: "Warehouse & Inventory Operations Supervisor",
    department: "Logistics",
    location: "Tejgaon Hub, Dhaka",
    type: "Full-Time",
    experience: "2+ Years in E-commerce Warehousing",
    description:
      "Lead our fulfillment center operations to ensure 100% accurate dispatch, temperature-controlled product storage, and on-time courier handovers.",
    responsibilities: [
      "Supervise daily picking, quality check, and packaging operations",
      "Maintain precise batch number records and counterfeit-prevention checks",
      "Coordinate with third-party courier dispatchers (Pathao, SteadFast)",
    ],
  },
  {
    id: "content-creator",
    title: "Creative Content & Video Producer",
    department: "Brand & Creative",
    location: "Banani, Dhaka",
    type: "Full-Time",
    experience: "1+ Years",
    description:
      "Produce engaging short-form TikTok, Reels, and YouTube content showcasing skincare routines, product swatch tests, and authentic unboxings.",
    responsibilities: [
      "Script, film, and edit trendy video content for social channels",
      "Stay ahead of global skincare trends, viral ingredients, and tutorials",
      "Collaborate with verified influencers and dermatologists",
    ],
  },
];

export interface CareerPerkItem {
  iconName: "TrendingUp" | "Gift" | "HeartPulse" | "Clock" | "GraduationCap" | "Sparkles";
  title: string;
  desc: string;
}

export const CAREER_PERKS: CareerPerkItem[] = [
  {
    iconName: "TrendingUp",
    title: "Accelerated Growth",
    desc: "Rapid promotion pathways and real leadership opportunities in a high-growth environment.",
  },
  {
    iconName: "Gift",
    title: "Staff Product Discounts",
    desc: "Substantial employee discounts on all authentic global skincare, cosmetics, and perfumes.",
  },
  {
    iconName: "HeartPulse",
    title: "Health & Wellness",
    desc: "Comprehensive outpatient and hospital coverage, wellness stipends, and ergonomic workspace setups.",
  },
  {
    iconName: "Clock",
    title: "Flexible Hybrid Work",
    desc: "Balanced remote and in-office options for technology and creative positions.",
  },
  {
    iconName: "GraduationCap",
    title: "Continuous Learning",
    desc: "Annual educational budgets for professional certifications, engineering bootcamps, and masterclasses.",
  },
  {
    iconName: "Sparkles",
    title: "Vibrant Team Culture",
    desc: "Quarterly team offsites, product testing parties, and an inclusive, transparent work environment.",
  },
];

export const CAREER_DEPARTMENTS: string[] = [
  "All",
  "Engineering",
  "Customer Experience",
  "Marketing",
  "Logistics",
  "Brand & Creative",
];

// ============================================================================
// 17. ABOUT US DATA
// ============================================================================
export interface AboutStatItem {
  value: string;
  label: string;
  desc: string;
}

export const ABOUT_STATS: AboutStatItem[] = [
  { value: "50,000+", label: "Happy Shoppers", desc: "Across all 64 districts" },
  { value: "500+", label: "Authentic Brands", desc: "Official direct imports" },
  { value: "10,000+", label: "Curated Products", desc: "Skincare, makeup & lifestyle" },
  { value: "99.4%", label: "Satisfaction Rate", desc: "Top-rated beauty store" },
];

export interface AboutPillarItem {
  iconName: "ShieldCheck" | "Truck" | "HeartHandshake" | "Award";
  title: string;
  desc: string;
  badge: string;
}

export const ABOUT_PILLARS: AboutPillarItem[] = [
  {
    iconName: "ShieldCheck",
    title: "100% Authenticity Guarantee",
    desc: "We stand strictly against counterfeit goods. Every single product in our catalog is imported directly from official brand manufacturers and verified global distributors.",
    badge: "Zero Compromise",
  },
  {
    iconName: "Truck",
    title: "Express Nationwide Delivery",
    desc: "24-48 hours delivery inside Dhaka and 48-72 hours across Bangladesh. Free shipping on orders over ৳2,000 with real-time SMS order tracking.",
    badge: "Fast & Reliable",
  },
  {
    iconName: "HeartHandshake",
    title: "7-Day Easy Returns",
    desc: "Shop with peace of mind. If your item arrives defective, damaged, or incorrect, our return process ensures an immediate replacement or full refund.",
    badge: "Hassle-Free",
  },
  {
    iconName: "Award",
    title: "Expert Beauty Consultation",
    desc: "Not sure what suits your skin type? Our skincare and makeup specialists provide personalized recommendations to help you find your perfect routine.",
    badge: "Personalized Care",
  },
];

export interface AboutValueItem {
  title: string;
  desc: string;
}

export const ABOUT_VALUES: AboutValueItem[] = [
  {
    title: "Customer Trust Above All",
    desc: "We believe trust is earned through genuine products, transparent pricing, and unwavering customer support.",
  },
  {
    title: "Uncompromising Quality",
    desc: "Temperature-controlled warehousing and sealed packaging ensure products arrive in their purest, most potent condition.",
  },
  {
    title: "Empowering Beauty For Everyone",
    desc: "From gentle sensitive-skin serums to vibrant makeup and premium fragrances, we celebrate diversity and personal expression.",
  },
];

// ============================================================================
// 18. CUSTOMER POLICIES DATA
// ============================================================================
export interface PolicyTabItem {
  label: string;
  path: string;
}

export const POLICY_PAGE_TABS: PolicyTabItem[] = [
  { label: "Terms & Condition", path: "/terms" },
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Refund & Return Policy", path: "/refund-policy" },
  { label: "Delivery Policy", path: "/delivery-policy" },
];

export interface RefundStepItem {
  step: string;
  title: string;
  desc: string;
}

export const REFUND_STEPS: RefundStepItem[] = [
  {
    step: "01",
    title: "Report Within 7 Days",
    desc: "Contact our customer support team via hotline, WhatsApp, or contact form with your Order ID and photo/video proof.",
  },
  {
    step: "02",
    title: "Pickup or Courier Handover",
    desc: "Our courier partner will arrange a doorstep pickup from your address in Dhaka, or provide drop-off instructions for outside Dhaka.",
  },
  {
    step: "03",
    title: "Quality Verification",
    desc: "Our quality team inspects the item at our Dhaka warehouse within 24–48 hours to confirm the reported issue.",
  },
  {
    step: "04",
    title: "Immediate Refund or Exchange",
    desc: "Choose between an instant brand-new replacement or a full refund back to your bKash, Nagad, card, or bank account.",
  },
];

export interface RefundTimelineItem {
  method: string;
  time: string;
  fee: string;
}

export const REFUND_TIMELINES: RefundTimelineItem[] = [
  { method: "bKash / Nagad / Rocket", time: "3 – 5 Business Days", fee: "Free (0% Deduction)" },
  { method: "Visa / MasterCard / AMEX", time: "7 – 10 Business Days", fee: "Free (0% Deduction)" },
  { method: "Bank Transfer", time: "5 – 7 Business Days", fee: "Free (0% Deduction)" },
  { method: "Show NOW Store Credit", time: "Instant (Within 2 Hours)", fee: "+5% Bonus Credit" },
];

export interface ShippingZoneItem {
  zone: string;
  time: string;
  cost: string;
  freeThreshold: string;
  badge: string;
}

export const SHIPPING_ZONES: ShippingZoneItem[] = [
  {
    zone: "Inside Dhaka Metro",
    time: "24 – 48 Hours",
    cost: "৳60",
    freeThreshold: "FREE for orders over ৳2,000",
    badge: "Fastest Delivery",
  },
  {
    zone: "Dhaka Suburbs (Gazipur, Savar, Narayanganj)",
    time: "36 – 48 Hours",
    cost: "৳100",
    freeThreshold: "FREE for orders over ৳2,000",
    badge: "Suburban Hubs",
  },
  {
    zone: "Outside Dhaka (All 64 Districts)",
    time: "48 – 72 Hours",
    cost: "৳120",
    freeThreshold: "FREE for orders over ৳2,000",
    badge: "Nationwide Reach",
  },
];

export interface CourierPartnerItem {
  name: string;
  role: string;
}

export const COURIER_PARTNERS: CourierPartnerItem[] = [
  { name: "SteadFast Courier", role: "Primary Nationwide Express Partner" },
  { name: "Pathao Courier", role: "Inside Dhaka & Major Metros" },
  { name: "RedX Logistics", role: "Nationwide Doorstep Coverage" },
  { name: "Paperfly", role: "Remote & Upazila Deliveries" },
];

// ============================================================================
// 19. NOTIFICATIONS MOCK DATA
// ============================================================================
export interface NotificationItem {
  id: number;
  message: string;
  datetime: string;
}

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    message: "New Order #12345 Placed",
    datetime: "July 17, 2025 | 09:15 AM",
  },
  {
    id: 2,
    message: "Order #12347 – Delivered",
    datetime: "July 17, 2025 | 09:15 AM",
  },
  {
    id: 3,
    message: "Payment Received for Order #12345",
    datetime: "July 17, 2025 | 09:15 AM",
  },
  {
    id: 4,
    message: "Refund Processed for Order #12347",
    datetime: "July 17, 2025 | 09:15 AM",
  },
  {
    id: 5,
    message: "Delivery Rider Assigned for Order #12345",
    datetime: "July 17, 2025 | 09:15 AM",
  },
  {
    id: 6,
    message: "New Customer Registered",
    datetime: "July 17, 2025 | 09:15 AM",
  },
];

