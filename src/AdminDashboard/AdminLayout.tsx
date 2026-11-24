// src/AdminDashboard/AdminLayout.tsx
import AdminDashboardNavBar from "./components/AdminDashboardNavBar";
import AdminSidebar from "./components/AdminSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./AdminDashboard.css";

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { pathname } = useLocation();

  const shouldHideNavbar = pathname === "/admin-dashboard/invoice-form";

  const shouldHideSidebar = () => {
    const hideExact = ["/admin-dashboard/add-product"];
    const pathnameSegments = pathname.split("/");

    const isProductDetails =
      pathname.startsWith("/admin-dashboard/all-products/") &&
      pathnameSegments.length === 4;

    const isOrderDetails =
      pathname.startsWith("/admin-dashboard/all-orders/") &&
      pathnameSegments.length === 4;

    const isBuyerProfile =
      pathname.startsWith("/admin-dashboard/all-orders/") &&
      pathnameSegments.length === 5 &&
      pathname.endsWith("/buyer-profile");

    return (
      hideExact.includes(pathname) ||
      isProductDetails ||
      isOrderDetails ||
      isBuyerProfile
    );
  };

  useEffect(() => {
    const pathnameSegments = pathname.split("/");

    const isDetailView =
      (pathname.startsWith("/admin-dashboard/all-products/") &&
        pathnameSegments.length === 4) ||
      (pathname.startsWith("/admin-dashboard/all-orders/") &&
        pathnameSegments.length === 4) ||
      (pathname.startsWith("/admin-dashboard/all-orders/") &&
        pathnameSegments.length === 5 &&
        pathname.endsWith("/buyer-profile"));

    const isAddProduct = pathname === "/admin-dashboard/add-product";
    const isAllProduct = pathname === "/admin-dashboard/all-products";
    const isAllOrder = pathname === "/admin-dashboard/all-orders";
    const isInquiries = pathname === "/admin-dashboard/inquiries-details";
    const isInvoice = pathname === "/admin-dashboard/invoice-form";

    setIsSidebarOpen(
      isDetailView ||
        isAddProduct ||
        isAllProduct ||
        isAllOrder ||
        isInquiries ||
        isInvoice
    );
  }, [pathname]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="admin-dashboard-shell flex h-screen overflow-hidden">
      {/* Sidebar - Fixed on Desktop */}
      {!shouldHideSidebar() && (
        <div className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-30 admin-dashboard-sidebar">
          <AdminSidebar />
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex flex-col flex-1 transition-all duration-200 ease-in-out ${
          !shouldHideSidebar() ? "lg:ml-72" : ""
        }`}
      >
        {/* Navbar */}
        {!shouldHideNavbar && (
          <div
            className={`fixed top-0 right-0 z-20 transition-all duration-200 ${
              !shouldHideSidebar() ? "left-0 lg:left-72" : "left-0"
            }`}
          >
            <AdminDashboardNavBar
              onMobileMenuToggle={handleMobileMenuToggle}
              notificationCount={3}
              isSidebarOpen={isSidebarOpen}
            />
          </div>
        )}

        {/* Mobile Sidebar Sheet */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <div className="hidden" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 admin-dashboard-sidebar">
            <AdminSidebar onItemClick={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Scrollable Page Content */}
        <main
          className={`flex-1 overflow-y-auto mt-16 admin-dashboard-content ${
            isSidebarOpen ? "pt-4 md:pt-8" : "p-4 md:p-8"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
