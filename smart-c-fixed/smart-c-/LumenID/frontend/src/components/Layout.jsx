import { Outlet, useLocation } from "react-router";
import { PublicNavigation } from "./navigation/PublicNavigation";
import { CustomerNavigation } from "./navigation/CustomerNavigation";
import { AdminNavigation } from "./navigation/AdminNavigation";
import { VerifierNavigation } from "./navigation/VerifierNavigation";
import { useAuth } from "../contexts/AuthContext";

export function Layout() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  // Pages that should not display any navigation
  const hideNavigationPaths = [
    "/customer/profile-creation",
  ];

  const shouldHideNavigation = hideNavigationPaths.includes(location.pathname);

  // Determine which navigation to show
  const getNavigation = () => {
    if (shouldHideNavigation) {
      return null;
    }

    // Verifier portal has its own standalone navigation
    if (location.pathname === "/admin/verifier-portal") {
      return <VerifierNavigation />;
    }

    if (!isAuthenticated || location.pathname.startsWith("/auth") || location.pathname === "/") {
      return <PublicNavigation />;
    }

    if (user?.role === "customer" && location.pathname.startsWith("/customer")) {
      return <CustomerNavigation />;
    }

    if (user?.role === "verifier" && location.pathname.startsWith("/admin")) {
      return <AdminNavigation />;
    }

    return <PublicNavigation />;
  };

  return (
    <div className="min-h-screen">
      {getNavigation()}
      <main>
        <Outlet />
      </main>
    </div>
  );
}