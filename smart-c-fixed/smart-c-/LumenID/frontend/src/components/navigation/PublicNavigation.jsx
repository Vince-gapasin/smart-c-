import { useLocation, useNavigate } from "react-router";
import { Wallet, ArrowLeft } from "lucide-react";
import { BaseNavigation } from "./BaseNavigation";

export function PublicNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  // Don't show nav on landing page
  if (location.pathname === "/") return null;

  // Don't show on auth pages
  if (location.pathname.startsWith("/auth")) return null;

  // Right Content: Back to Role Selection Button
  const rightContent = (
    <button
      onClick={() => navigate("/auth/role-selection")}
      className="h-10 px-4 rounded-lg touch-target border border-border/50 text-foreground hover:bg-white/5 transition-all duration-200"
      aria-label="Back to role selection"
    >
      <span className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">Back to Role Selection</span>
      </span>
    </button>
  );

  return (
    <BaseNavigation
      logo={{
        to: "/",
        icon: Wallet,
        iconGradient: "from-violet-500 via-purple-500 to-fuchsia-500",
        text: "LumenID",
        textGradient: "from-cyan-400 via-purple-400 to-pink-400",
        ariaLabel: "LumenID - Go to Home"
      }}
      rightContent={rightContent}
    />
  );
}