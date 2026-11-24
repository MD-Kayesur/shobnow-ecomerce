import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Menu, Search, UserRound, LogOut } from "lucide-react";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { logOut, useCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/redux-hook";

export interface NavbarProps { onMobileMenuToggle: () => void; userName?: string; isSidebarOpen?: boolean }

const UserDashboardNavbar: React.FC<NavbarProps> = ({ onMobileMenuToggle, userName }) => {
  const [search, setSearch] = useState("");
  const user = useAppSelector(useCurrentUser);
  const name = userName || user?.name || "Shop Now customer";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const handleSignOut = async () => {
    try { await logout().unwrap(); } catch { /* Clear the local session if the API is unavailable. */ }
    dispatch(logOut());
    navigate("/login", { replace: true });
  };
  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    navigate(`/shop${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""}`);
  };

  return <header className="sn-topbar">
    <button className="sn-mobile-menu" onClick={onMobileMenuToggle} aria-label="Open menu"><Menu size={22} /></button>
    <form className="sn-search" onSubmit={submitSearch}><Search size={21} /><input aria-label="Search products" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products..." /></form>
    <div className="sn-top-actions">
      <Link to="/user-dashboard/orders" className="sn-notification-button" aria-label="Notifications"><Bell size={22} /><i /></Link>
      <details className="sn-user-menu"><summary><span className="sn-avatar">{name.charAt(0).toUpperCase()}</span><span className="sn-user-details"><b>{name}</b><small>Shop Now member</small></span><ChevronDown size={17} /></summary><div className="sn-user-dropdown"><Link to="/user-dashboard/profile"><UserRound size={16} /> My profile</Link><button onClick={handleSignOut}><LogOut size={16} /> Log out</button></div></details>
    </div>
  </header>;
};

export default UserDashboardNavbar;
