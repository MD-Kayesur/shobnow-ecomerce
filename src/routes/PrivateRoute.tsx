// src/routes/PrivateRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAppSelector } from "@/redux/hooks/redux-hook";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { token, isInitialized } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isInitialized) return <div role="status" className="auth-session-loading">Restoring your secure session…</div>;
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
