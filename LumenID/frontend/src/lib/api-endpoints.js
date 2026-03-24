/**
 * API Endpoint Definitions
 * Centralized endpoint configuration for consistent routing
 */

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    logout: "/auth/logout",
    session: "/auth/session",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    verifierLogin: "/auth/verifier-login",
    requestAccess: "/auth/request-access",
  },

  // User Management
  users: {
    profile: "/users/profile",
    updateProfile: "/users/profile",
    deleteAccount: "/users/account",
  },

  // Credentials
  credentials: {
    list: "/credentials",
    byId: (id) => `/credentials/${id}`,
    byDID: (did) => `/credentials/did/${did}`,
    issue: "/credentials/issue",
    verify: (id) => `/credentials/verify/${id}`,
    revoke: (id) => `/credentials/${id}/revoke`,
    search: "/credentials/search",
    submissions: {
      pending: "/credentials/submissions/pending",
      byId: (id) => `/credentials/submissions/${id}`,
      approve: (id) => `/credentials/submissions/${id}/approve`,
      reject: (id) => `/credentials/submissions/${id}/reject`,
    },
  },

  // DID Management
  did: {
    document: (did) => `/did/${did}`,
    create: "/did/create",
    update: (did) => `/did/${did}`,
    resolve: "/did/resolve",
  },

  // Verification
  verification: {
    verify: "/verification/verify",
    history: "/verification/history",
    report: (id) => `/verification/reports/${id}`,
  },

  // Admin
  admin: {
    users: "/admin/users",
    credentials: "/admin/credentials",
    analytics: "/admin/analytics",
    logs: "/admin/logs",
  },
};