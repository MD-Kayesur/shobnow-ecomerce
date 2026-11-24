// src/components/AdminDashboard/Shared/AdminDashboardNavBar.tsx
import { Menu, Settings, ShieldCheck, LogOut, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import userPlaceholder from "@/assets/icons/user.svg";

export interface NavbarProps {
  onMobileMenuToggle: () => void;
  notificationCount?: number;
  userName?: string;
  isSidebarOpen: boolean;
}

const AdminDashboardNavBar: React.FC<NavbarProps> = ({
  onMobileMenuToggle,
  notificationCount: _notificationCount = 3,
  userName = "Admin User",
  isSidebarOpen,
}) => {
  return (
    <div className="bg-white dark:bg-[#0F141C] border-b border-gray-200/80 dark:border-gray-800 transition-colors">
      <header
        className={`flex items-center justify-between h-16 px-4 md:px-8 ${
          isSidebarOpen ? "max-w-[1400px] mx-auto" : ""
        }`}
      >
        {/* Left Section: Mobile Menu + Title */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gray-700 dark:text-gray-300 hover:text-primary cursor-pointer"
            onClick={onMobileMenuToggle}
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Admin Portal
            </span>
            <span className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
              Hello, {userName}
            </span>
          </div>
        </div>

        {/* Right Section: User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* User Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full ring-2 ring-primary/20 hover:ring-primary/50 transition-all cursor-pointer p-0 w-9 h-9"
              >
                <img
                  src={userPlaceholder}
                  alt={userName}
                  className="w-full h-full rounded-full object-cover"
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 bg-white dark:bg-[#141A24] text-gray-800 dark:text-gray-100 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-1.5"
            >
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800/80 mb-1">
                <p className="text-xs font-bold text-gray-900 dark:text-white">{userName}</p>
                <p className="text-[11px] text-gray-500">Super Administrator</p>
              </div>

              <Link to="/admin-dashboard/settings">
                <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl hover:bg-primary-light hover:text-primary dark:hover:bg-primary/20 cursor-pointer transition-colors">
                  <Settings className="w-4 h-4 text-primary" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>

              <Link to="/admin-dashboard/settings#security-password-section">
                <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl hover:bg-primary-light hover:text-primary dark:hover:bg-primary/20 cursor-pointer transition-colors">
                  <KeyRound className="w-4 h-4 text-primary" />
                  <span>Change Password</span>
                </DropdownMenuItem>
              </Link>

              <Link to="/privacy-policy">
                <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl hover:bg-primary-light hover:text-primary dark:hover:bg-primary/20 cursor-pointer transition-colors">
                  <ShieldCheck className="w-4 h-4 text-gray-500" />
                  <span>Privacy Policy</span>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-gray-800" />

              <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer transition-colors">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
};

export default AdminDashboardNavBar;
