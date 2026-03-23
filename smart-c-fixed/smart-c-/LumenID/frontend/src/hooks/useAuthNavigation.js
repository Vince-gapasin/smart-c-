import { useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { ROUTES, getDefaultRouteForRole } from "../constants/routes";
import { toast } from "sonner";

/**
 * Custom hook for authentication-related navigation
 * Centralizes navigation logic and prevents memory leaks from unmounted components
 */

export function useAuthNavigation() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Safe navigation that only executes if component is still mounted
   */
  const safeNavigate = useCallback(
    (path, delay = 0) => {
      if (delay > 0) {
        setTimeout(() => {
          if (isMountedRef.current) {
            navigate(path);
          }
        }, delay);
      } else {
        navigate(path);
      }
    },
    [navigate]
  );

  /**
   * Navigate to the appropriate dashboard based on user role
   */
  const navigateToDashboard = useCallback(() => {
    const route = getDefaultRouteForRole(user?.role || null);
    safeNavigate(route, 500);
  }, [user, safeNavigate]);

  /**
   * Handle logout with navigation
   */
  const handleLogout = useCallback(() => {
    logout();
    toast.success("Logged out successfully");
    safeNavigate(ROUTES.AUTH.ROLE_SELECTION);
  }, [logout, safeNavigate]);

  /**
   * Navigate back to role selection
   */
  const navigateToRoleSelection = useCallback(() => {
    safeNavigate(ROUTES.AUTH.ROLE_SELECTION);
  }, [safeNavigate]);

  /**
   * Navigate to home
   */
  const navigateToHome = useCallback(() => {
    safeNavigate(ROUTES.HOME);
  }, [safeNavigate]);

  return {
    navigate: safeNavigate,
    navigateToDashboard,
    handleLogout,
    navigateToRoleSelection,
    navigateToHome,
  };
}