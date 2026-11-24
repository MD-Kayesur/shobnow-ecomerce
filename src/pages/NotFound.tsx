import React from "react";
import { Link } from "react-router-dom";
import { Home, ShoppingBag } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] bg-[#fdfbf9] dark:bg-[#090D14] flex items-center justify-center px-4 sm:px-6 py-16 transition-colors duration-300">
      <div className="max-w-md w-full text-center">
        {/* Glow & 404 Visual */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500/20 to-pink-700/20 blur-2xl transform scale-150 pointer-events-none" />
          <span className="text-8xl sm:text-9xl font-bold font-['Faustina'] tracking-tighter bg-gradient-to-r from-pink-900 via-pink-700 to-pink-500 bg-clip-text text-transparent dark:from-pink-300 dark:via-pink-500 dark:to-pink-400 drop-shadow-sm">
            404
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold font-['Faustina'] text-gray-900 dark:text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back to beauty.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-pink-800 hover:bg-pink-900 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home size={16} /> Back to Home
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white dark:bg-[#111622] hover:bg-pink-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag size={16} className="text-pink-800 dark:text-[#FF4D82]" /> Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;