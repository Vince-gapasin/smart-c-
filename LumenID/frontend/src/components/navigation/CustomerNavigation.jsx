import { useLocation } from "react-router";
import { LayoutDashboard, Vault, UserCircle, LogOut } from "lucide-react";
import { NavButton, MobileNavButton, BaseNavigation } from "./BaseNavigation";
import { useAuthNavigation } from "../../hooks/useAuthNavigation";
import { ROUTES } from "../../constants/routes";

export function CustomerNavigation() {
  const location = useLocation();
  const { handleLogout, navigate } = useAuthNavigation();

  const isOnDashboard = location.pathname === ROUTES.CUSTOMER.DASHBOARD;
  const isOnVault = location.pathname === ROUTES.CUSTOMER.VAULT;
  const isOnProfile = location.pathname === ROUTES.CUSTOMER.PROFILE;

  // Left Content: Navigation Links (Desktop)
  const leftContent = (
    <>
      <NavButton
        onClick={() => navigate(ROUTES.CUSTOMER.DASHBOARD)}
        icon={LayoutDashboard}
        label="Dashboard"
        isActive={isOnDashboard}
      />
      <NavButton
        onClick={() => navigate(ROUTES.CUSTOMER.VAULT)}
        icon={Vault}
        label="My Vault"
        isActive={isOnVault}
      />
      <NavButton
        onClick={() => navigate(ROUTES.CUSTOMER.PROFILE)}
        icon={UserCircle}
        label="Profile"
        isActive={isOnProfile}
      />
    </>
  );

  // Right Content: Mobile Navigation + Logout
  const rightContent = (
    <>
      {/* Mobile Navigation - Icons Only */}
      <div className="flex md:hidden items-center gap-2">
        <MobileNavButton
          onClick={() => navigate(ROUTES.CUSTOMER.DASHBOARD)}
          icon={LayoutDashboard}
          label="Dashboard"
          isActive={isOnDashboard}
        />
        <MobileNavButton
          onClick={() => navigate(ROUTES.CUSTOMER.VAULT)}
          icon={Vault}
          label="My Vault"
          isActive={isOnVault}
        />
        <MobileNavButton
          onClick={() => navigate(ROUTES.CUSTOMER.PROFILE)}
          icon={UserCircle}
          label="Profile"
          isActive={isOnProfile}
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
        to: ROUTES.CUSTOMER.DASHBOARD,
        icon: Vault,
        iconGradient: "from-cyan-500 via-blue-500 to-indigo-500",
        text: "LumenID",
        textGradient: "from-cyan-400 via-blue-400 to-indigo-400",
        ariaLabel: "LumenID Customer Portal - Go to Dashboard"
      }}
      leftContent={leftContent}
      rightContent={rightContent}
    />
  );
}