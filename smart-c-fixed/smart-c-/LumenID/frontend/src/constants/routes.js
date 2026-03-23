/**
 * Centralized route constants for navigation
 * This prevents typos and makes route changes easier
 */

export const ROUTES = {
    // Public Routes
    HOME: "/",
    TERMS: "/terms",
    PRIVACY: "/privacy",
    VERIFY: "/verify",
    ACCESS_DENIED: "/access-denied",
    NOT_FOUND: "*",

    // Auth Routes
    AUTH: {
        ROLE_SELECTION: "/auth/role-selection",
        CUSTOMER_LOGIN: "/auth/customer-login",
        CUSTOMER_SIGNUP: "/auth/customer-signup",
        VERIFIER_LOGIN: "/auth/verifier-login",
        FORGOT_PASSWORD: "/auth/forgot-password",
        REQUEST_ACCESS: "/auth/request-access",
    },

    // Customer Routes
    CUSTOMER: {
        BASE: "/customer",
        DASHBOARD: "/customer/dashboard",
        PROFILE: "/customer/profile",
        VAULT: "/customer/vault",
        PROFILE_CREATION: "/customer/profile-creation",
    },

    // Admin Routes
    ADMIN: {
        BASE: "/admin",
        DASHBOARD: "/admin/dashboard",
        ISSUER_PORTAL: "/admin/issuer-portal",
        VERIFIER_PORTAL: "/admin/verifier-portal",
    },
};

/**
 * Helper to get the default dashboard route for a role
 */
export function getDefaultRouteForRole(role) {
    if (role === "customer") return ROUTES.CUSTOMER.DASHBOARD;
    if (role === "verifier") return ROUTES.ADMIN.DASHBOARD;
    return ROUTES.HOME;
}

/**
 * Helper to get the login route for a role
 */
export function getLoginRouteForRole(role) {
    if (role === "customer") return ROUTES.AUTH.CUSTOMER_LOGIN;
    if (role === "verifier") return ROUTES.AUTH.VERIFIER_LOGIN;
    return ROUTES.AUTH.ROLE_SELECTION;
}