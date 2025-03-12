import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
interface PublicRouteProps {
  children: React.ReactNode;
}
export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, userRoles } = useAuth();
  if (isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    const primaryRole = userRoles[0];
    return <Navigate to={`/${primaryRole}`} replace />;
  }
  return <>{children}</>;
};

