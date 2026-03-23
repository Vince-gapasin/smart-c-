import { useState, useCallback } from "react";

/**
 * Custom hook for form validation
 * Reduces duplicate validation logic across components
 */

export function useFormValidation() {
  const [errors, setErrors] = useState({});

  const validateEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return false;
    }
    setErrors((prev) => {
      const { email: _email, ...rest } = prev;
      return rest;
    });
    return true;
  }, []);

  const validatePassword = useCallback((password) => {
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return false;
    }
    if (password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters",
      }));
      return false;
    }
    setErrors((prev) => {
      const { password: _password, ...rest } = prev;
      return rest;
    });
    return true;
  }, []);

  const validate2FACode = useCallback((code) => {
    if (!code) {
      setErrors((prev) => ({ ...prev, code: "2FA code is required" }));
      return false;
    }
    if (!/^\d{6}$/.test(code)) {
      setErrors((prev) => ({
        ...prev,
        code: "2FA code must be 6 digits",
      }));
      return false;
    }
    setErrors((prev) => {
      const { code: _code, ...rest } = prev;
      return rest;
    });
    return true;
  }, []);

  const validateField = useCallback((field, value, options = {}) => {
    let errorMessage = null;

    if (options.required && !value) {
      errorMessage = options.requiredMessage || `${field} is required`;
    } else if (options.pattern && !options.pattern.test(value)) {
      errorMessage = options.patternMessage || `Invalid ${field} format`;
    } else if (options.minLength && value.length < options.minLength) {
      errorMessage = options.minLengthMessage || `${field} must be at least ${options.minLength} characters`;
    } else if (options.customValidation && !options.customValidation(value)) {
      errorMessage = options.customMessage || `Invalid ${field}`;
    }

    if (errorMessage) {
      setErrors((prev) => ({ ...prev, [field]: errorMessage }));
      return false;
    }

    setErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
    return true;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearError = useCallback((field) => {
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  return {
    errors,
    validateEmail,
    validatePassword,
    validate2FACode,
    validateField,
    clearErrors,
    clearError,
  };
}