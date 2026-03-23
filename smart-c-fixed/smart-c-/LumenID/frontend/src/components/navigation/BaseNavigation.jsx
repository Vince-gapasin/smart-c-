import { Link } from "react-router";
import { motion } from "motion/react";

/**
 * Unified Base Navigation Component
 * * This component provides a consistent structural layout and design
 * across all navigation contexts (Public, Customer, Admin/Verifier).
 * * Key Features:
 * - Identical height, padding, and spacing across all views
 * - Consistent logo placement and responsive behavior
 * - Unified glassmorphic styling with backdrop blur
 * - Dynamic content areas for role-specific navigation items
 * - Smooth animations and transitions
 */

export function BaseNavigation({
  logo,
  leftContent,
  rightContent,
  className = ""
}) {
  const Icon = logo.icon;

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-xl bg-card/90 border-b border-border/50 shadow-lg shadow-black/5 ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo + Dynamic Left Content */}
          <div className="flex items-center gap-6 sm:gap-8">
            {/* Unified Logo Component */}
            <Link
              to={logo.to}
              className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
              aria-label={logo.ariaLabel || `Go to ${logo.text}`}
            >
              <motion.div
                className={`relative w-10 h-10 bg-gradient-to-br ${logo.iconGradient} rounded-xl flex items-center justify-center shadow-lg`}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{
                  scale: 0.95,
                  transition: { duration: 0.1 }
                }}
              >
                <Icon className="w-5 h-5 text-white" aria-hidden="true" />
              </motion.div>
              <span className={`font-bold text-xl bg-gradient-to-r ${logo.textGradient} bg-clip-text text-transparent whitespace-nowrap`}>
                {logo.text}
              </span>
            </Link>

            {/* Dynamic Left Content (Navigation Links) */}
            {leftContent && (
              <div className="hidden md:flex items-center gap-2">
                {leftContent}
              </div>
            )}
          </div>

          {/* Right Section: Dynamic Right Content (Actions/User Menu) */}
          <div className="flex items-center gap-2">
            {rightContent}
          </div>
        </div>
      </div>
    </nav>
  );
}

/**
 * Unified Navigation Button Component
 * Provides consistent styling for navigation buttons across all views
 */
export function NavButton({
  onClick,
  icon: Icon,
  label,
  isActive = false,
  className = "",
  ariaLabel,
  showLabelOnMobile = false
}) {
  const baseClasses = "h-10 rounded-lg touch-target transition-all duration-200";
  const activeClasses = isActive
    ? "bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/40 shadow-lg shadow-cyan-500/10"
    : "text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${activeClasses} px-4 ${className}`}
      aria-label={ariaLabel || label}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="flex items-center gap-2">
        <Icon className="w-4 h-4" aria-hidden="true" />
        <span className={showLabelOnMobile ? "inline" : "hidden sm:inline"}>
          {label}
        </span>
      </span>
    </button>
  );
}

/**
 * Mobile-only Navigation Button (Icon only, no label)
 */
export function MobileNavButton({
  onClick,
  icon: Icon,
  label,
  isActive = false,
  className = "",
  ariaLabel
}) {
  const baseClasses = "h-10 w-10 rounded-lg touch-target p-0 transition-all duration-200";
  const activeClasses = isActive
    ? "bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/40 shadow-lg shadow-cyan-500/10"
    : "text-muted-foreground hover:text-foreground hover:bg-accent/50 border border-transparent";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${activeClasses} ${className}`}
      aria-label={ariaLabel || label}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="w-5 h-5 mx-auto" aria-hidden="true" />
    </button>
  );
}