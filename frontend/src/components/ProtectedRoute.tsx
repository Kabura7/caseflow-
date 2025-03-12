import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingPage from "./LoadingPage";
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}
export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { isAuthenticated, userRoles, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return <LoadingPage />;
  }
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/signup"
        state={{
          from: location.pathname,
        }}
        replace
      />
    );
  }
  const hasRequiredRole = allowedRoles.some((role) => userRoles.includes(role));
  if (!hasRequiredRole) {
    const defaultRoute = userRoles.includes("lawyer") ? "/lawyer" : "/client";
    return <Navigate to={defaultRoute} replace />;
  }
  return <>{children}</>;
};
