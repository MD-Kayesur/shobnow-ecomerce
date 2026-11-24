// src/UserDashboard/UserLayout.tsx
import UserDashboardNavbar from "./components/UserDashboardNavbar";
import UserSidebar from "./components/UserSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF7F5] dark:bg-[#0B0F17]">
      {/* Sidebar - Fixed on Desktop */}
      <div className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-30">
        <UserSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 lg:ml-72 transition-all duration-200 ease-in-out">
        {/* Top Navbar */}
        <div className="fixed top-0 right-0 left-0 lg:left-72 z-20">
          <UserDashboardNavbar
            onMobileMenuToggle={handleMobileMenuToggle}
            userName="Ayesha Rahman"
          />
        </div>

        {/* Mobile Sidebar Sheet */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <span className="sr-only">Toggle Sidebar</span>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-72 bg-[#1A0B13] border-none text-white [&>button]:text-white"
          >
            <UserSidebar onItemClick={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Page Content Outlet */}
        <main className="flex-1 overflow-y-auto mt-16 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;

