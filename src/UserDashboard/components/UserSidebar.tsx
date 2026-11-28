import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Store, ClipboardList, Wallet, Heart, Bell, UserRound, Settings, CircleHelp, LogOut, Gift, Sparkles } from "lucide-react";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { logOut } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks/redux-hook";

const items = [
  { label: "Dashboard", href: "/user-dashboard", icon: LayoutDashboard },
  { label: "Shop", href: "/shop", icon: Store },
  { label: "My Orders", href: "/user-dashboard/orders", icon: ClipboardList },
  { label: "Wallet", href: "/user-dashboard/profile", icon: Wallet },
  { label: "Favorites", href: "/user-dashboard/wishlist", icon: Heart },
  { label: "My AI Looks", href: "/user-dashboard/ai-looks", icon: Sparkles },
  { label: "Notifications", href: "/user-dashboard/orders", icon: Bell },
  { label: "Profile", href: "/user-dashboard/profile", icon: UserRound },
  { label: "Settings", href: "/user-dashboard/profile", icon: Settings },
  { label: "Help & Support", href: "/contact", icon: CircleHelp },
];

export interface UserSidebarProps { onItemClick?: () => void }

const UserSidebar: React.FC<UserSidebarProps> = ({ onItemClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const handleLogout = async () => {
    try { await logout().unwrap(); } catch { /* Clear local auth even if the API is offline. */ }
    dispatch(logOut());
    onItemClick?.();
    navigate("/login", { replace: true });
  };
  return (
    <aside className="sn-sidebar">
      <Link to="/" onClick={onItemClick} className="sn-brand"><img src="/shobnow-logo.png" alt="Shop Now" /></Link>
      <nav className="sn-side-nav" aria-label="User dashboard">
        {items.map(({ label, href, icon: Icon }) => {
          const active = label === "Dashboard" ? location.pathname === "/user-dashboard" || location.pathname === "/user-dashboard/dashboard" : location.pathname === href;
          return <Link key={label} to={href} onClick={onItemClick} className={`sn-side-link${active ? " is-active" : ""}`}><Icon size={21} strokeWidth={1.8} /><span>{label}</span>{label === "Notifications" && <i>3</i>}</Link>;
        })}
      </nav>
      <button type="button" onClick={handleLogout} className="sn-side-logout"><LogOut size={19} /> Log out</button>
      <div className="sn-sidebar-offer"><span><Gift size={24} /></span><div><b>Special offer!</b><small>Discover this week’s beauty picks.</small><Link to="/offers" onClick={onItemClick}>Shop offers <span>→</span></Link></div></div>
    </aside>
  );
};

export default UserSidebar;
