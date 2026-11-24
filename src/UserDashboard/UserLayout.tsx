import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAppSelector } from "@/redux/hooks/redux-hook";
import { useCurrentUser } from "@/redux/features/auth/authSlice";
import UserDashboardNavbar from "./components/UserDashboardNavbar";
import UserSidebar from "./components/UserSidebar";
import "./UserDashboard.css";

const UserLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useAppSelector(useCurrentUser);

  return <div className="sn-dashboard-layout">
    <div className="sn-desktop-sidebar"><UserSidebar /></div>
    <div className="sn-main-area">
      <UserDashboardNavbar onMobileMenuToggle={() => setIsMobileMenuOpen(true)} userName={user?.name || "Shop Now customer"} />
      <main className="sn-page-content"><Outlet /></main>
    </div>
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetContent side="left" className="sn-mobile-sidebar p-0">
        <UserSidebar onItemClick={() => setIsMobileMenuOpen(false)} />
      </SheetContent>
    </Sheet>
  </div>;
};

export default UserLayout;
