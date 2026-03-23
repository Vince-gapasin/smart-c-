/**
 * LumenID Unified Icon System
 * ============================
 * Style Guide:
 * - ViewBox: 0 0 24 24
 * - Stroke weight: 1.5px (primary), 1.25px (secondary details)
 * - Stroke linecap: round | Stroke linejoin: round
 * - Aesthetic: Duotone (fill layer @ 12–20% + stroke layer @ 100%)
 * - All icons use `currentColor` for theme compatibility
 */

import { motion } from "motion/react";

// ──────────────────────────────────────────────────────────────
// TRUST TRIANGLE: ROLE ICONS
// ──────────────────────────────────────────────────────────────

/**
 * ISSUER ICON — Institutional Authority
 */
export function IssuerIcon({ size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Issuer — Institutional Authority"
      className={className}
    >
      {/* Duotone fill layer */}
      <path d="M4 10.5V19H20V10.5L12 5.5L4 10.5Z" fill="currentColor" opacity="0.14" />
      <rect x="5" y="10" width="14" height="1.5" rx="0.5" fill="currentColor" opacity="0.25" />
      {/* Pediment / roof */}
      <path d="M2 10.5L12 5L22 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Entablature beam */}
      <path d="M4 10.5H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Building body walls */}
      <path d="M4 10.5V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 10.5V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Base step */}
      <path d="M2 19H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Three columns */}
      <path d="M8 12V18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 12V18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 12V18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Apex medallion / crest */}
      <circle cx="12" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.25" fill="currentColor" fillOpacity="0.3" />
    </svg>
  );
}

/**
 * HOLDER ICON — Sovereign Identity
 */
export function HolderIcon({ size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Holder — Sovereign Identity"
      className={className}
    >
      {/* Duotone fill — hexagon body */}
      <path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" fill="currentColor" opacity="0.12" />
      {/* Person body fill */}
      <circle cx="12" cy="9.5" r="2.5" fill="currentColor" opacity="0.22" />
      <path d="M7.5 18.5C7.5 15.46 9.52 13 12 13C14.48 13 16.5 15.46 16.5 18.5" fill="currentColor" opacity="0.14" />
      {/* Hexagon outline */}
      <path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Person head */}
      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      {/* Person shoulders */}
      <path d="M7.5 18.5C7.5 15.46 9.52 13 12 13C14.48 13 16.5 15.46 16.5 18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * VERIFIER ICON — Instant Validation
 */
export function VerifierIcon({ size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Verifier — Instant Validation"
      className={className}
    >
      {/* Duotone fill */}
      <path d="M2 12C5 7 8.5 4.5 12 4.5C15.5 4.5 19 7 22 12C19 17 15.5 19.5 12 19.5C8.5 19.5 5 17 2 12Z" fill="currentColor" opacity="0.12" />
      <circle cx="12" cy="12" r="3.5" fill="currentColor" opacity="0.2" />
      {/* Eye outline */}
      <path d="M2 12C5 7 8.5 4.5 12 4.5C15.5 4.5 19 7 22 12C19 17 15.5 19.5 12 19.5C8.5 19.5 5 17 2 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Iris circle */}
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      {/* Pupil with checkmark */}
      <path d="M10.5 12L11.5 13L13.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Scanning beam — subtle dashed line across the eye */}
      <path d="M4 10L20 10" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeDasharray="2 3" opacity="0.35" />
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// FUNCTIONAL CONCEPT ICONS
// ──────────────────────────────────────────────────────────────

export function SelectiveDisclosureIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="4" width="18" height="4" rx="1.5" fill="currentColor" opacity="0.14" />
      <rect x="3" y="10" width="14" height="4" rx="1.5" fill="currentColor" opacity="0.1" />
      <rect x="3" y="16" width="9" height="4" rx="1.5" fill="currentColor" opacity="0.06" />
      <rect x="3" y="4" width="18" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="6" r="1" fill="currentColor" />
      <path d="M9 6H17" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <rect x="3" y="10" width="14" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="12" r="1" fill="currentColor" opacity="0.7" />
      <path d="M9 12H14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.7" />
      <rect x="3" y="16" width="9" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.35" />
      <circle cx="6" cy="18" r="1" fill="currentColor" opacity="0.25" />
      <path d="M9 18H11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.25" />
      <path d="M20 18C20 17 19.5 16 19 16M20 18C20 19 19.5 20 19 20" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.4" />
      <circle cx="21" cy="12" r="1" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function MultiSigIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="10" y="11.5" width="7" height="6" rx="1" fill="currentColor" opacity="0.18" />
      <circle cx="3" cy="5" r="1.75" stroke="currentColor" strokeWidth="1.25" />
      <path d="M4.75 5H8M8 4.4V5.6M7 4.65V5.35" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="3" cy="12" r="1.75" stroke="currentColor" strokeWidth="1.25" />
      <path d="M4.75 12H8M8 11.4V12.6M7 11.65V12.35" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="3" cy="19" r="1.75" stroke="currentColor" strokeWidth="1.25" />
      <path d="M4.75 19H8M8 18.4V19.6M7 18.65V19.35" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M8 5L10 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <path d="M8 12H10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <path d="M8 19L10 16.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <path d="M12 11.5V9.5C12 8.4 12.45 7.5 13.5 7.5C14.55 7.5 15 8.4 15 9.5V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="10" y="11.5" width="7" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13.5" cy="14" r="0.8" fill="currentColor" />
      <path d="M13.5 14.8V16.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function IPFSLinkIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.22" />
      <circle cx="12" cy="3.5" r="1.5" fill="currentColor" opacity="0.14" />
      <circle cx="19.5" cy="8" r="1.5" fill="currentColor" opacity="0.14" />
      <circle cx="19.5" cy="16" r="1.5" fill="currentColor" opacity="0.14" />
      <circle cx="12" cy="20.5" r="1.5" fill="currentColor" opacity="0.14" />
      <circle cx="4.5" cy="16" r="1.5" fill="currentColor" opacity="0.14" />
      <circle cx="4.5" cy="8" r="1.5" fill="currentColor" opacity="0.14" />
      <path d="M12 9.5L12 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <path d="M14.17 10.5L18 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <path d="M14.17 13.5L18 16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <path d="M12 14.5L12 19" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <path d="M9.83 13.5L6 16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <path d="M9.83 10.5L6 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
      <path d="M12 5L18 8M18 8L18 16M18 16L12 19M12 19L6 16M6 16L6 8M6 8L12 5" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" strokeDasharray="2 2" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="3.5" r="1.5" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="19.5" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="19.5" cy="16" r="1.5" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="12" cy="20.5" r="1.5" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="4.5" cy="16" r="1.5" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="4.5" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="12" cy="12" r="0.75" fill="currentColor" />
    </svg>
  );
}

export function BlockchainAnchorIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="9" width="9" height="6" rx="3" fill="currentColor" opacity="0.14" />
      <rect x="13" y="9" width="9" height="6" rx="3" fill="currentColor" opacity="0.14" />
      <rect x="2" y="9" width="9" height="6" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="9" width="9" height="6" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 9V7C10.5 5.9 11.17 5 12 5C12.83 5 13.5 5.9 13.5 7V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10.5 15V17C10.5 18.1 11.17 19 12 19C12.83 19 13.5 18.1 13.5 17V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17.5 12L19 12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.5" />
      <path d="M5 12L6.5 12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function ZKProofIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z" fill="currentColor" opacity="0.12" />
      <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 11C8 11 8.75 10 9.5 10C10.25 10 11 11 11 11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M8 11C8 11 8.75 12 9.5 12C10.25 12 11 11 11 11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.4" />
      <path d="M13 11C13 11 13.75 10 14.5 10C15.25 10 16 11 16 11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M13 11C13 11 13.75 12 14.5 12C15.25 12 16 11 16 11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.4" />
      <circle cx="10.5" cy="16" r="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M12 16H15M15 15.3V16.7M14 15.55V16.45" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export function DIDIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 3H14L19 8V21H5V3Z" fill="currentColor" opacity="0.12" />
      <path d="M14 3L19 8H14V3Z" fill="currentColor" opacity="0.2" />
      <path d="M5 3H14L19 8V21H5V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 3V8H19" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 11H16" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M8 14H13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="8" cy="17.5" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="11" cy="17.5" r="1" fill="currentColor" opacity="0.3" />
      <path d="M9 17.5H10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// STATE-AWARE VERIFICATION ICONS
// ──────────────────────────────────────────────────────────────

export function IntegrityIcon({ size = 24, className = "", verified = false, pending = false }) {
  const activeOpacity = verified ? 1 : pending ? 0.6 : 0.3;
  const fillOpacity = verified ? 0.25 : pending ? 0.12 : 0.07;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Integrity Check"
      className={className}
      style={{ transition: "all 0.4s ease" }}
    >
      <rect x="2" y="9.5" width="9" height="5" rx="2.5" fill="currentColor" opacity={fillOpacity} style={{ transition: "opacity 0.4s ease" }} />
      <rect x="13" y="9.5" width="9" height="5" rx="2.5" fill="currentColor" opacity={fillOpacity} style={{ transition: "opacity 0.4s ease" }} />
      <rect x="2" y="9.5" width="9" height="5" rx="2.5" stroke="currentColor" strokeWidth="1.5" opacity={activeOpacity} style={{ transition: "opacity 0.4s ease" }} />
      <rect x="13" y="9.5" width="9" height="5" rx="2.5" stroke="currentColor" strokeWidth="1.5" opacity={activeOpacity} style={{ transition: "opacity 0.4s ease" }} />
      <path
        d="M10.5 9.5V7.5C10.5 6.4 11.17 5.5 12 5.5C12.83 5.5 13.5 6.4 13.5 7.5V9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={verified ? 1 : 0.2}
        style={{ transition: "opacity 0.4s ease" }}
      />
      <path
        d="M10.5 14.5V16.5C10.5 17.6 11.17 18.5 12 18.5C12.83 18.5 13.5 17.6 13.5 16.5V14.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={verified ? 1 : 0.2}
        style={{ transition: "opacity 0.4s ease" }}
      />
      <path
        d="M11 12H13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity={verified ? 1 : 0.15}
        style={{ transition: "opacity 0.4s ease" }}
      />
      {verified && (
        <>
          <circle cx="5.5" cy="12" r="0.6" fill="currentColor" opacity="0.5" />
          <circle cx="18.5" cy="12" r="0.6" fill="currentColor" opacity="0.5" />
        </>
      )}
    </svg>
  );
}

export function AuthenticityIcon({ size = 24, className = "", verified = false, pending = false }) {
  const activeOpacity = verified ? 1 : pending ? 0.65 : 0.3;
  const outerOpacity = verified ? 0.8 : pending ? 0.4 : 0.2;
  const dash = verified ? "none" : "3 3";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Authenticity Check"
      className={className}
      style={{ transition: "all 0.4s ease" }}
    >
      <circle cx="12" cy="14" r="1.2" fill="currentColor" opacity={activeOpacity} style={{ transition: "opacity 0.4s ease" }} />
      <path
        d="M9 14C9 12.34 10.34 11 12 11C13.66 11 15 12.34 15 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={activeOpacity}
        strokeDasharray={dash}
        style={{ transition: "all 0.4s ease" }}
      />
      <path
        d="M7 14C7 11.24 9.24 9 12 9C14.76 9 17 11.24 17 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={activeOpacity * 0.85}
        strokeDasharray={dash}
        style={{ transition: "all 0.4s ease" }}
      />
      <path
        d="M5 14C5 10.13 8.13 7 12 7C15.87 7 19 10.13 19 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={activeOpacity * 0.7}
        strokeDasharray={dash}
        style={{ transition: "all 0.4s ease" }}
      />
      <path
        d="M3 14C3 8.48 7.48 4 12 4C16.52 4 21 8.48 21 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={outerOpacity}
        strokeDasharray={dash}
        style={{ transition: "all 0.4s ease" }}
      />
      <path
        d="M9 14C9 14 9.5 17 12 17C12.83 17 13.5 16.8 14 16.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={activeOpacity}
        style={{ transition: "opacity 0.4s ease" }}
      />
      {verified && (
        <path
          d="M3 14H21"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeDasharray="2 3"
          opacity="0.4"
        />
      )}
    </svg>
  );
}

export function ValidityIcon({ size = 24, className = "", verified = false, pending = false }) {
  const strokeOpacity = verified ? 1 : pending ? 0.7 : 0.4;
  const fillOpacity = verified ? 0.2 : pending ? 0.1 : 0.06;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Validity Check"
      className={className}
      style={{ transition: "all 0.4s ease" }}
    >
      <rect x="3" y="5" width="18" height="16" rx="2" fill="currentColor" opacity={fillOpacity} style={{ transition: "opacity 0.4s ease" }} />
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" opacity={strokeOpacity} style={{ transition: "opacity 0.4s ease" }} />
      <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" opacity={strokeOpacity} style={{ transition: "opacity 0.4s ease" }} />
      <path d="M8 3V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={strokeOpacity} style={{ transition: "opacity 0.4s ease" }} />
      <path d="M16 3V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity={strokeOpacity} style={{ transition: "opacity 0.4s ease" }} />
      {!verified && (
        <>
          <circle cx="8" cy="14" r="1" fill="currentColor" opacity={strokeOpacity * 0.6} />
          <circle cx="12" cy="14" r="1" fill="currentColor" opacity={strokeOpacity * 0.6} />
          <circle cx="16" cy="14" r="1" fill="currentColor" opacity={strokeOpacity * 0.4} />
          <circle cx="8" cy="18" r="1" fill="currentColor" opacity={strokeOpacity * 0.4} />
          <circle cx="12" cy="18" r="1" fill="currentColor" opacity={strokeOpacity * 0.4} />
        </>
      )}
      {verified && (
        <path
          d="M8 14.5L10.5 17L16 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {pending && !verified && (
        <circle cx="12" cy="15" r="2.5" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
      )}
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// ISSUER TAB ICONS
// ──────────────────────────────────────────────────────────────

export function MintCredentialIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 3H15L19 7V21H5V3Z" fill="currentColor" opacity="0.12" />
      <path d="M15 3V7H19" fill="currentColor" opacity="0.2" />
      <path d="M5 3H15L19 7V21H5V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M15 3V7H19" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="14" r="3.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M12 12.5V15.5M10.5 14H13.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export function ActivityLogsIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" opacity="0.1" />
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7" cy="8" r="1.25" fill="currentColor" />
      <path d="M10 8H17" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="7" cy="12" r="1.25" fill="currentColor" opacity="0.7" />
      <path d="M10 12H15" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.7" />
      <circle cx="7" cy="16" r="1.25" fill="currentColor" opacity="0.4" />
      <path d="M10 16H13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.4" />
      <path d="M17 15L18 13L19 15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  );
}

export function LegalStandingIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M8 13C8 11.34 9.79 10 12 10C14.21 10 16 11.34 16 13" fill="currentColor" opacity="0.12" />
      <path d="M12 3V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 20H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 8H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 8L4 13M3 13H5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M4 13C4 14.66 5.34 16 7 16" stroke="currentColor" strokeWidth="0" />
      <path d="M2 13C2 13 3 15 4 15C5 15 6 13 6 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M20 8L20 13M19 13H21" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M18 14C18 14 19 16 20 16C21 16 22 14 22 14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="12" cy="3" r="1" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// COMPOSITE DISPLAY COMPONENT: Trust Triangle
// ──────────────────────────────────────────────────────────────

const sizeMap = { sm: 32, md: 48, lg: 64 };

export function TrustTriangle({ className = "", size = "md" }) {
  const iconSize = sizeMap[size];
  const roles = [
    {
      Icon: IssuerIcon,
      label: "Issuer",
      sublabel: "Institutional Authority",
      gradient: "from-violet-500 to-fuchsia-500",
      glow: "shadow-violet-500/30",
      ring: "border-violet-500/30",
    },
    {
      Icon: HolderIcon,
      label: "Holder",
      sublabel: "Sovereign Identity",
      gradient: "from-cyan-500 to-blue-500",
      glow: "shadow-cyan-500/30",
      ring: "border-cyan-500/30",
    },
    {
      Icon: VerifierIcon,
      label: "Verifier",
      sublabel: "Instant Validation",
      gradient: "from-emerald-500 to-teal-500",
      glow: "shadow-emerald-500/30",
      ring: "border-emerald-500/30",
    },
  ];

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 ${className}`}>
      {roles.map(({ Icon, label, sublabel, gradient, glow, ring }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="flex flex-col items-center gap-3"
        >
          <div
            className={`bg-gradient-to-br ${gradient} rounded-2xl p-3 shadow-lg ${glow} border ${ring} border-opacity-30`}
          >
            <Icon size={iconSize} className="text-white" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold">{label}</p>
            <p className="text-xs text-muted-foreground">{sublabel}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// VERIFICATION STATE TRIO
// ──────────────────────────────────────────────────────────────

export function VerificationTrio({
  integrityVerified = false,
  authenticityVerified = false,
  validityVerified = false,
  integrityPending = false,
  authenticityPending = false,
  validityPending = false,
  size = 32,
  showLabels = true,
}) {
  const checks = [
    {
      Icon: IntegrityIcon,
      label: "Integrity",
      sublabel: "Data unmodified",
      verified: integrityVerified,
      pending: integrityPending,
      verifiedColor: "text-emerald-400",
      verifiedBg: "bg-emerald-500/15 border-emerald-500/30",
      idleColor: "text-muted-foreground",
      idleBg: "bg-muted/30 border-border/50",
      pendingColor: "text-yellow-400",
      pendingBg: "bg-yellow-500/10 border-yellow-500/30",
      glow: "shadow-emerald-500/20",
    },
    {
      Icon: AuthenticityIcon,
      label: "Authenticity",
      sublabel: "Issuer confirmed",
      verified: authenticityVerified,
      pending: authenticityPending,
      verifiedColor: "text-violet-400",
      verifiedBg: "bg-violet-500/15 border-violet-500/30",
      idleColor: "text-muted-foreground",
      idleBg: "bg-muted/30 border-border/50",
      pendingColor: "text-yellow-400",
      pendingBg: "bg-yellow-500/10 border-yellow-500/30",
      glow: "shadow-violet-500/20",
    },
    {
      Icon: ValidityIcon,
      label: "Validity",
      sublabel: "Not expired",
      verified: validityVerified,
      pending: validityPending,
      verifiedColor: "text-cyan-400",
      verifiedBg: "bg-cyan-500/15 border-cyan-500/30",
      idleColor: "text-muted-foreground",
      idleBg: "bg-muted/30 border-border/50",
      pendingColor: "text-yellow-400",
      pendingBg: "bg-yellow-500/10 border-yellow-500/30",
      glow: "shadow-cyan-500/20",
    },
  ];

  return (
    <div className="flex items-start gap-4">
      {checks.map(({ Icon, label, sublabel, verified, pending, verifiedColor, verifiedBg, idleColor, idleBg, pendingColor, pendingBg, glow }, i) => {
        const isActive = verified || pending;
        const colorClass = verified ? verifiedColor : pending ? pendingColor : idleColor;
        const bgClass = verified ? verifiedBg : pending ? pendingBg : idleBg;
        const shadowClass = verified ? `shadow-lg ${glow}` : "";

        return (
          <motion.div
            key={label}
            className="flex flex-col items-center gap-2 flex-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
          >
            <motion.div
              className={`w-full flex items-center justify-center p-3 rounded-xl border transition-all duration-500 ${bgClass} ${shadowClass} ${colorClass}`}
              animate={verified ? { scale: [1, 1.04, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              <Icon size={size} verified={verified} pending={pending} />
            </motion.div>
            {showLabels && (
              <div className="text-center">
                <p className={`text-xs font-semibold transition-colors duration-400 ${colorClass}`}>{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}