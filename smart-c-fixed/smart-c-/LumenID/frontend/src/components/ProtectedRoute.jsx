import * as React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({
  children,
  requiredRole,
  requireAuth = true
}) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Check if authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate
        to="/auth/role-selection"
        replace
        state={{ from: location.pathname, message: "Please sign in to access this page" }}
      />
    );
  }

  // Check if specific role is required and user doesn't have it
  if (requiredRole && user?.role !== requiredRole) {
    // If user is authenticated but doesn't have the right role
    if (isAuthenticated) {
      return <Navigate to="/access-denied" replace />;
    }

    // If user is not authenticated, redirect to login
    return (
      <Navigate
        to="/auth/role-selection"
        replace
        state={{ from: location.pathname, message: "Please sign in with appropriate credentials" }}
      />
    );
  }

  // All checks passed, render the protected content
  return <>{children}</>;
}