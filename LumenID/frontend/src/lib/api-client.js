/**
 * API Client for Backend Communication
 * Centralized HTTP client with auth token injection and standardized response handling.
 * Backend returns: { success, message, data: payload }
 * This client surfaces: { success, message, data: payload } — no double-wrapping.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  _getToken() {
    try {
      const stored = sessionStorage.getItem("auth");
      if (stored) {
        const { user } = JSON.parse(stored);
        return user?.token || null;
      }
    } catch {
      // ignore
    }
    return null;
  }

  async request(endpoint, options = {}) {
    const { params, ...fetchOptions } = options;

    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      url += `?${new URLSearchParams(params).toString()}`;
    }

    const token = this._getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchOptions.headers,
    };

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
          data: null,
        };
      }

      // Unwrap backend envelope: { success, message, data: payload }
      return {
        success: data.success ?? true,
        message: data.message,
        data: data.data ?? data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error occurred",
        data: null,
      };
    }
  }

  get(endpoint, params) {
    return this.request(endpoint, { method: "GET", params });
  }

  post(endpoint, body) {
    return this.request(endpoint, { method: "POST", body: JSON.stringify(body) });
  }

  put(endpoint, body) {
    return this.request(endpoint, { method: "PUT", body: JSON.stringify(body) });
  }

  patch(endpoint, body) {
    return this.request(endpoint, { method: "PATCH", body: JSON.stringify(body) });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);