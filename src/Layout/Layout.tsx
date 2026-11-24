import Footer from "@/components/Home/Shared/Footer";
import NavBar from "@/components/Home/Shared/NavBar";
import CartDrawer from "@/components/Cart/CartDrawer";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const Layout: React.FC = () => {
  const location = useLocation();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  // Routes where NavBar, Footer & CartDrawer should be completely hidden
  const authRoutes = [
    "/login",
    "/signin",
    "/signup",
    "/register",
    "/forgot-password",
    "/verify-code",
    "/verify-otp",
    "/reset-password",
  ];

  const normalizedPath = location.pathname.toLowerCase().replace(/\/+$/, "") || "/";
  const shouldHideLayout =
    authRoutes.includes(normalizedPath) ||
    authRoutes.some((route) => normalizedPath.startsWith(route));

  if (shouldHideLayout) {
    return (
      <main className="min-h-screen w-full bg-[#FDFBF9] dark:bg-[#090D14]">
        <Outlet />
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF9] dark:bg-[#090D14] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <NavBar />
      <main className="flex-1 w-full bg-[#FDFBF9] dark:bg-[#090D14] transition-colors duration-200">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default Layout;
