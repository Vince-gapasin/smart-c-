import * as React from "react";
import { authService } from "../services/auth-service";

const AuthContext = React.createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Initialize auth state from sessionStorage on mount
  React.useEffect(() => {
    const initAuth = async () => {
      try {
        const storedAuth = sessionStorage.getItem("auth");
        if (storedAuth) {
          const parsedAuth = JSON.parse(storedAuth);
          if (parsedAuth.user) {
            // Trust sessionStorage — token was valid when saved
            setUser(parsedAuth.user);
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        sessionStorage.removeItem("auth");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Persist auth state to sessionStorage whenever it changes
  React.useEffect(() => {
    if (user) {
      sessionStorage.setItem("auth", JSON.stringify({ user }));
    } else {
      sessionStorage.removeItem("auth");
    }
  }, [user]);

  // Listen for global unauthorized events
  React.useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      sessionStorage.removeItem("auth");
    };
    window.addEventListener("lumen_unauthorized", handleUnauthorized);
    return () => window.removeEventListener("lumen_unauthorized", handleUnauthorized);
  }, []);

  /** Customer login */
  const login = React.useCallback(async (email, password, role) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password, role });
      if (!response.success) {
        throw new Error(response.error || response.message || "Login failed");
      }
      // Backend returns { token, user } in data
      const userData = response.data?.user ?? response.data;
      if (!userData) throw new Error("No user data returned");
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Verifier login with 2FA */
  const verifierLogin = React.useCallback(async (email, password, twoFactorCode) => {
    setIsLoading(true);
    try {
      const response = await authService.verifierLogin({ email, password, twoFactorCode });
      if (!response.success) {
        throw new Error(response.error || response.message || "Verifier login failed");
      }
      const userData = response.data?.user ?? response.data;
      if (!userData) throw new Error("No user data returned");
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Customer signup */
  const signup = React.useCallback(async (email, password, fullName) => {
    setIsLoading(true);
    try {
      const response = await authService.signup({ email, password, fullName });
      if (!response.success) {
        throw new Error(response.error || "Signup failed");
      }
      const userData = response.data?.user ?? response.data;
      if (!userData) throw new Error("No user data returned");
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      sessionStorage.removeItem("auth");
    }
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      verifierLogin,
      signup,
      logout,
      setUser,
    }),
    [user, isLoading, login, verifierLogin, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}