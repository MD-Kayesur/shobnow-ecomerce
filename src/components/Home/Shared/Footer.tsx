import React from "react";
import { Link } from "react-router-dom";
import {
  Smartphone,
  Facebook,
  Linkedin,
  Instagram,
  Twitter,
} from "lucide-react";
import SSLCommerzPaymentSection from "./SSLCommerzPaymentSection";
import shobNowLogo from "@/assets/Logo/shobnow-logo.png";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#FFFCFE] dark:bg-[#080B11] pt-12 sm:pt-16 pb-12 font-inter border-t border-pink-50 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        {/* Main Content Grid: Brand Info on Left + 3 Columns of Links */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16 pb-12">
          {/* Column 1: Brand Info & Mobile App Box */}
          <div className="w-full lg:max-w-[340px] flex flex-col justify-start items-start gap-8">
            <div className="space-y-4">
              {/* Logo */}
              <Link to="/" className="inline-flex items-center select-none group" aria-label="SHOB Now Home">
                <div className="relative flex items-center dark:bg-white/95 dark:px-2.5 dark:py-1 dark:rounded-xl dark:shadow-xs transition-all">
                  <img
                    src={shobNowLogo}
                    alt="SHOB Now"
                    className="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
              </Link>

              {/* Tagline */}
              <p className="text-[#33373F] dark:text-gray-300 text-base font-normal leading-6">
                Design amazing digital experiences that create more happy in the world.
              </p>
            </div>

            {/* Install Web-app Badge */}
            <div className="w-full sm:w-auto p-3 rounded-lg border border-[#FDBDD2] dark:border-gray-700 flex items-center gap-3 bg-[#FFFDFE] dark:bg-gray-800/80 shadow-2xs hover:border-[#A20E4C] dark:hover:border-[#FF4D82] transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-[#FAF0F3] dark:bg-gray-700 text-[#A20E4C] dark:text-[#FF4D82] flex items-center justify-center shrink-0">
                <Smartphone size={22} />
              </div>
              <div>
                <span className="text-[#1B1E23] dark:text-white text-base font-semibold leading-snug block">
                  Install our web-app:
                </span>
                <span className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-tight">
                  Android &amp; IOS
                </span>
              </div>
            </div>
          </div>

          {/* 3 Nav Columns: Categories, Useful Links, Pages */}
          <div className="w-full lg:flex-1 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 lg:gap-16">
            {/* Column 2: Categories */}
            <div className="flex flex-col gap-3.5">
              <h4 className="text-[#1B1E23] dark:text-white text-lg font-faustina font-semibold leading-[21.6px]">
                Categories
              </h4>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link to="/shop?category=skin-care" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    Skin care solution
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=melasma" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    Melasma Solution
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=student-pack" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    Student Pack
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=hair-care" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    Hair Care
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=combo-set" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    Combo Set
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=food-supps" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    Supplement
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=makeup" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    Makeup
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=accessories" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Useful Links */}
            <div className="flex flex-col gap-3.5">
              <h4 className="text-[#1B1E23] dark:text-white text-lg font-faustina font-semibold leading-[21.6px]">
                Useful Links
              </h4>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link to="/contact" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/shipping" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    Shipping &amp; Delivery
                  </Link>
                </li>
                <li>
                  <Link to="/returns" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    Return &amp; Refund
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    Privacy &amp; Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    Terms &amp; Condition
                  </Link>
                </li>
                <li>
                  <Link to="/offers" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    Promotions
                  </Link>
                </li>
                <li>
                  <Link to="/guidelines" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    Digital Commerce Operation Guidelines
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Pages */}
            <div className="flex flex-col gap-3.5">
              <h4 className="text-[#1B1E23] dark:text-white text-lg font-faustina font-semibold leading-[21.6px]">
                Pages
              </h4>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link to="/shop" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to="/shop?sort=bestselling" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    Top Selling
                  </Link>
                </li>
                <li>
                  <Link to="/shop?sort=newest" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link to="/shop?filter=featured" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    Featured Products
                  </Link>
                </li>
                <li>
                  <Link to="/brands" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    Brands
                  </Link>
                </li>
                <li>
                  <Link to="/track-order" className="text-[#33373F] dark:text-gray-400 text-sm font-normal leading-[21px] hover:text-[#A20E4C] dark:hover:text-[#FF4D82] transition-colors">
                    Order Tracking
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Real Interactive SSLCOMMERZ Payment Cards Component */}
        <SSLCommerzPaymentSection />

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="pt-8 border-t border-[#D490AD] dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#A20E4C] dark:text-[#FF4D82] text-base font-manrope font-normal leading-6">
            © 2026 SHOB Now. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A20E4C] dark:text-[#FF4D82] hover:opacity-80 transition-opacity"
              aria-label="X (Twitter)"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A20E4C] dark:text-[#FF4D82] hover:opacity-80 transition-opacity"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A20E4C] dark:text-[#FF4D82] hover:opacity-80 transition-opacity"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A20E4C] dark:text-[#FF4D82] hover:opacity-80 transition-opacity"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
