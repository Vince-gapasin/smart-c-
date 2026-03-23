/**
 * Authentication Service
 * All methods call the real backend. No mocks.
 */

import { apiClient } from "../lib/api-client";

export class AuthService {
  /**
   * Login a customer with email and password
   * Returns { success, data: { token, user } }
   */
  async login(request) {
    return apiClient.post("/auth/login", {
      email: request.email,
      password: request.password,
      role: request.role,
    });
  }

  /**
   * Login a verifier with email, password, and 2FA code
   * Returns { success, data: { token, user } }
   */
  async verifierLogin(request) {
    return apiClient.post("/auth/verifier-login", {
      email: request.email,
      password: request.password,
      twoFactorCode: request.twoFactorCode,
    });
  }

  /**
   * Register a new customer
   * Returns { success, data: { token, user } }
   */
  async signup(request) {
    return apiClient.post("/auth/signup", {
      email: request.email,
      password: request.password,
      fullName: request.fullName || request.name,
    });
  }

  /**
   * Logout the current user (stateless JWT — just clears session)
   */
  async logout() {
    return apiClient.post("/auth/logout", {});
  }

  /**
   * Get current user session from sessionStorage
   * (No separate session endpoint — JWT is stateless)
   */
  async getSession() {
    try {
      const stored = sessionStorage.getItem("auth");
      if (stored) {
        const { user } = JSON.parse(stored);
        if (user?.token) {
          return { success: true, data: user };
        }
      }
    } catch {
      // ignore
    }
    return { success: true, data: null };
  }

  /**
   * Request password reset email
   */
  async requestPasswordReset(email) {
    return apiClient.post("/auth/forgot-password", { email });
  }

  /**
   * Request verifier access
   */
  async requestVerifierAccess(data) {
    return apiClient.post("/auth/request-access", data);
  }
}

export const authService = new AuthService();