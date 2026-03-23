import * as React from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Layout } from "./components/Layout";
import { LandingPage } from "./components/LandingPage";
import { NotFoundPage } from "./components/NotFoundPage";
import { AccessDeniedPage } from "./components/AccessDeniedPage";

// Authentication Components
import { RoleSelection } from "./components/auth/RoleSelection";
import { CustomerLogin } from "./components/auth/CustomerLogin";
import { CustomerSignup } from "./components/auth/CustomerSignup";
import { VerifierLogin } from "./components/auth/VerifierLogin";
import { ForgotPassword } from "./components/auth/ForgotPassword";
import { RequestAccess } from "./components/auth/RequestAccess";

// Customer Route Components
import { ProfileCreation } from "./components/customer/ProfileCreation";
import { CustomerDashboard } from "./components/customer/CustomerDashboard";
import { CustomerProfile } from "./components/customer/CustomerProfile";
import { CustomerVault } from "./components/customer/CustomerVault";

// Admin Route Components
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { IssuerPortal } from "./components/admin/IssuerPortal";
import { VerifierPortal } from "./components/admin/VerifierPortal";

// Legal Pages
import { Terms } from "./components/Terms";
import { Privacy } from "./components/Privacy";

// Relying Party
import { PublicVerifyPortal } from "./components/relying-party/PublicVerifyPortal";

// Protected Route Wrapper
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        element: <Layout />,
        children: [
          // Landing Page
          {
            index: true,
            element: <LandingPage />,
          },

          // Legal Pages (Public)
          {
            path: "terms",
            element: <Terms />,
          },
          {
            path: "privacy",
            element: <Privacy />,
          },

          // Authentication Routes (Public)
          {
            path: "auth/role-selection",
            element: <RoleSelection />,
          },
          {
            path: "verify",
            element: <PublicVerifyPortal />,
          },
          {
            path: "auth/customer-login",
            element: <CustomerLogin />,
          },
          {
            path: "auth/customer-signup",
            element: <CustomerSignup />,
          },
          {
            path: "auth/verifier-login",
            element: <VerifierLogin />,
          },
          {
            path: "auth/forgot-password",
            element: <ForgotPassword />,
          },
          {
            path: "auth/request-access",
            element: <RequestAccess />,
          },

          // Customer Routes (Protected - Customer Role Only)
          {
            path: "customer",
            element: (
              <ProtectedRoute requiredRole="customer">
                <Navigate to="/customer/dashboard" replace />
              </ProtectedRoute>
            ),
          },
          {
            path: "customer/profile-creation",
            element: (
              <ProtectedRoute requiredRole="customer">
                <ProfileCreation />
              </ProtectedRoute>
            ),
          },
          {
            path: "customer/dashboard",
            element: (
              <ProtectedRoute requiredRole="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: "customer/profile",
            element: (
              <ProtectedRoute requiredRole="customer">
                <CustomerProfile />
              </ProtectedRoute>
            ),
          },
          {
            path: "customer/vault",
            element: (
              <ProtectedRoute requiredRole="customer">
                <CustomerVault />
              </ProtectedRoute>
            ),
          },

          // Admin/Verifier Routes (Protected - Verifier Role Only)
          {
            path: "admin",
            element: (
              <ProtectedRoute requiredRole="verifier">
                <Navigate to="/admin/dashboard" replace />
              </ProtectedRoute>
            ),
          },
          {
            path: "admin/dashboard",
            element: (
              <ProtectedRoute requiredRole="verifier">
                <AdminDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: "admin/issuer-portal",
            element: (
              <ProtectedRoute requiredRole="verifier">
                <IssuerPortal />
              </ProtectedRoute>
            ),
          },
          {
            path: "admin/verifier-portal",
            element: (
              <ProtectedRoute requiredRole="verifier">
                <VerifierPortal />
              </ProtectedRoute>
            ),
          },

          // Legacy route redirects
          {
            path: "auth/customer/login",
            element: <Navigate to="/auth/customer-login" replace />,
          },
          {
            path: "auth/customer/signup",
            element: <Navigate to="/auth/customer-signup" replace />,
          },
          {
            path: "auth/verifier/login",
            element: <Navigate to="/auth/verifier-login" replace />,
          },
          {
            path: "dashboard",
            element: <Navigate to="/" replace />,
          },
          {
            path: "issuer",
            element: <Navigate to="/admin/issuer-portal" replace />,
          },
          {
            path: "admin/issuer",
            element: <Navigate to="/admin/issuer-portal" replace />,
          },
          {
            path: "vault",
            element: <Navigate to="/customer/vault" replace />,
          },
          {
            path: "verifier",
            element: <Navigate to="/admin/verifier-portal" replace />,
          },
          {
            path: "admin/verifier",
            element: <Navigate to="/admin/verifier-portal" replace />,
          },
          {
            path: "verifier/dashboard",
            element: <Navigate to="/admin/dashboard" replace />,
          },

          // Access Denied Page
          {
            path: "access-denied",
            element: <AccessDeniedPage />,
          },

          // 404 Catch All
          {
            path: "*",
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
]);