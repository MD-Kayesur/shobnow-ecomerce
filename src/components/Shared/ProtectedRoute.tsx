// src/components/ProtectedRoute.tsx
import { useAppSelector } from "@/redux/hooks/redux-hook";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, token, isInitialized } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isInitialized) return <div role="status" className="auth-session-loading">Restoring your secure session…</div>;
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
