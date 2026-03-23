import { useLocation } from "react-router";
import { LayoutDashboard, Building2, LogOut } from "lucide-react";
import { NavButton, MobileNavButton, BaseNavigation } from "./BaseNavigation";
import { useAuthNavigation } from "../../hooks/useAuthNavigation";
import { ROUTES } from "../../constants/routes";

export function AdminNavigation() {
  const location = useLocation();
  const { handleLogout, navigate } = useAuthNavigation();

  const isOnDashboard = location.pathname === ROUTES.ADMIN.DASHBOARD;
  const isOnIssuer = location.pathname === ROUTES.ADMIN.ISSUER_PORTAL;

  // Left Content: Navigation Links (Desktop)
  const leftContent = (
    <div className="hidden md:flex items-center gap-1">
      <NavButton
        onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}
        icon={LayoutDashboard}
        label="Dashboard"
        isActive={isOnDashboard}
      />
      <NavButton
        onClick={() => navigate(ROUTES.ADMIN.ISSUER_PORTAL)}
        icon={Building2}
        label="Issuer"
        isActive={isOnIssuer}
      />
    </div>
  );

  // Right Content: Mobile Navigation + Logout
  const rightContent = (
    <>
      {/* Mobile Navigation - Icons Only */}
      <div className="flex md:hidden items-center gap-2">
        <MobileNavButton
          onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}
          icon={LayoutDashboard}
          label="Dashboard"
          isActive={isOnDashboard}
        />
        <MobileNavButton
          onClick={() => navigate(ROUTES.ADMIN.ISSUER_PORTAL)}
          icon={Building2}
          label="Issuer"
          isActive={isOnIssuer}
        />
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="h-10 px-4 rounded-lg touch-target border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50 transition-all duration-200"
        aria-label="Logout"
      >
        <span className="flex items-center gap-2">
          <LogOut className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">Logout</span>
        </span>
      </button>
    </>
  );

  return (
    <BaseNavigation
      logo={{
        to: ROUTES.ADMIN.DASHBOARD,
        icon: LayoutDashboard,
        iconGradient: "from-emerald-500 via-teal-500 to-cyan-500",
        text: "LumenID Admin",
        textGradient: "from-emerald-400 via-teal-400 to-cyan-400",
        ariaLabel: "LumenID Admin Portal - Go to Dashboard"
      }}
      leftContent={leftContent}
      rightContent={rightContent}
    />
  );
}