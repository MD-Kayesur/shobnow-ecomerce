import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Shop from "@/pages/Shop";
import ProductDetails from "@/pages/ProductDetails";
import {
  Login,
  Signup,
  ForgotPassword,
  VerifyCode,
  ResetPassword,
} from "@/Authentication";
import SocialAuthCallback from "@/Authentication/SocialAuthCallback";
import TopSelling from "@/pages/TopSelling";
import Cart from "@/pages/Cart";
import Payment from "@/pages/Payment";
import Contact from "@/pages/Contact";
import AboutUs from "@/pages/AboutUs";
import Career from "@/pages/Career";
import Terms from "@/pages/Terms";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import RefundPolicy from "@/pages/RefundPolicy";
import DeliveryPolicy from "@/pages/DeliveryPolicy";

import {
  AdminLayout,
  AdminDashboardPage,
  SettingsPage,
  ProductsPage,
  BannersPage,
  OrdersPage,
  CustomersPage,
  CategoriesBrandsPage,
  ActivityLogsPage,
  ErrorLogsPage,
} from "@/AdminDashboard";
import AddProductWizardPage from "@/AdminDashboard/pages/AddProductWizardPage";

import {
  UserLayout,
  UserDashboardPage,
  UserOrdersPage,
  UserWishlistPage,
  UserProfilePage,
  UserPurchaseHistoryPage,
} from "@/UserDashboard";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/products",
        element: <Shop />,
      },
      {
        path: "/product/:slug",
        element: <ProductDetails />,
      },
      {
        path: "/products/:slug",
        element: <ProductDetails />,
      },
      {
        path: "/category/:categorySlug",
        element: <Shop />,
      },
      {
        path: "/offers",
        element: <Shop />,
      },
      {
        path: "/top-selling",
        element: <TopSelling />,
      },
      {
        path: "/top-sellings",
        element: <TopSelling />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/payment",
        element: <Payment />,
      },
      {
        path: "/checkout",
        element: <Payment />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signin",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/register",
        element: <Signup />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/verify-code",
        element: <VerifyCode />,
      },
      {
        path: "/verify-otp",
        element: <VerifyCode />,
      },
      {
        path: "/auth/social/callback",
        element: <SocialAuthCallback />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/about-us",
        element: <AboutUs />,
      },
      {
        path: "/career",
        element: <Career />,
      },
      {
        path: "/careers",
        element: <Career />,
      },
      {
        path: "/terms",
        element: <Terms />,
      },
      {
        path: "/terms-and-conditions",
        element: <Terms />,
      },
      {
        path: "/privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/refund-policy",
        element: <RefundPolicy />,
      },
      {
        path: "/refund-and-return-policy",
        element: <RefundPolicy />,
      },
      {
        path: "/delivery-policy",
        element: <DeliveryPolicy />,
      },
    ],
  },

  /* User Dashboard */
  {
    path: "/user-dashboard",
    element: <UserLayout />,
    children: [
      { index: true, element: <UserDashboardPage /> },
      { path: "dashboard", element: <UserDashboardPage /> },
      { path: "orders", element: <UserOrdersPage /> },
      { path: "wishlist", element: <UserWishlistPage /> },
      { path: "profile", element: <UserProfilePage /> },
      { path: "history", element: <UserPurchaseHistoryPage /> },
    ],
  },

  /* Backward Compatibility Redirects from legacy /client-dashboard to /user-dashboard */
  {
    path: "/client-dashboard",
    children: [
      { index: true, element: <Navigate to="/user-dashboard" replace /> },
      { path: "dashboard", element: <Navigate to="/user-dashboard/dashboard" replace /> },
      { path: "orders", element: <Navigate to="/user-dashboard/orders" replace /> },
      { path: "wishlist", element: <Navigate to="/user-dashboard/wishlist" replace /> },
      { path: "profile", element: <Navigate to="/user-dashboard/profile" replace /> },
      { path: "history", element: <Navigate to="/user-dashboard/history" replace /> },
      { path: "*", element: <Navigate to="/user-dashboard" replace /> },
    ],
  },

  /* Admin Dashboard */
  {
    path: "/admin-dashboard",
    element: (
      // <AdminRoute>
      <AdminLayout />
      // </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "dashboard", element: <AdminDashboardPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "banners", element: <BannersPage /> },
      { path: "add-product", element: <AddProductWizardPage /> },
      { path: "inventory", element: <ProductsPage /> },
      { path: "categories", element: <CategoriesBrandsPage /> },
      { path: "brands", element: <CategoriesBrandsPage /> },
      { path: "customers", element: <CustomersPage /> },
      { path: "users", element: <CustomersPage /> },
      { path: "activity-logs", element: <ActivityLogsPage /> },
      { path: "error-logs", element: <ErrorLogsPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "audit-log", element: <SettingsPage /> },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
