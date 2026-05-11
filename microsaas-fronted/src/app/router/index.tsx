import { createBrowserRouter, Navigate } from "react-router-dom";

import { AppLayout } from "../../components/layout/app-layout";
import { PrivateRoute } from "./private-route";
import { PlatformRoute } from "./platform-route";
import { RoleRoute } from "./role-route";

import { LandingPage } from "../../pages/landing-page";
import { LoginPage } from "../../pages/login-page";
import { SignupPage } from "../../pages/signup-page";
import { ForgotPasswordPage } from "../../pages/forgot-password-page";
import { ResetPasswordPage } from "../../pages/reset-password-page";

import { DashboardPage } from "../../pages/dashboard-page";
import { BrandingPage } from "../../pages/branding-page";
import { SocialAccountsPage } from "../../pages/social-accounts-page";
import { PostsPage } from "../../pages/posts-page";
import { BillingPage } from "../../pages/billing-page";
import ReferralsPage from "../../pages/referral-page";
import { UsersPage } from "../../pages/users-page";
import { AccountPage } from "../../pages/account-page";
import { SettingsPage } from "../../pages/settings-page";

import { PlatformLayout } from "../../components/layout/platform-layout";
import { PlatformLoginPage } from "../../features/platform/pages/platform-login-page";
import { PlatformOrganizationsPage } from "../../features/platform/pages/platform-organizations-page";
import { PlatformOrganizationDetailPage } from "../../features/platform/pages/platform-organization-detail-page";
import { PlatformSecurityPage } from "../../features/platform/pages/platform-security-page";

import PrivacyPolicyPage from "../../pages/legal/PrivacyPolicyPage";
import TermsOfServicePage from "../../pages/legal/TermsOfServicePage";
import DataDeletionPage from "../../pages/legal/DataDeletionPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicyPage />,
  },
  {
    path: "/terms-of-service",
    element: <TermsOfServicePage />,
  },
  {
    path: "/data-deletion",
    element: <DataDeletionPage />,
  },

  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/auth/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/auth/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/auth/signup",
    element: <SignupPage />,
  },

  {
    path: "/platform/login",
    element: <PlatformLoginPage />,
  },
  {
    path: "/platform",
    element: (
      <PlatformRoute>
        <PlatformLayout />
      </PlatformRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/platform/organizations" replace />,
      },
      {
        path: "organizations",
        element: <PlatformOrganizationsPage />,
      },
      {
        path: "organizations/:id",
        element: <PlatformOrganizationDetailPage />,
      },
      {
        path: "security",
        element: <PlatformSecurityPage />,
      },
    ],
  },

  {
    path: "/app",
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "users",
        element: (
          <RoleRoute allowedRoles={["OWNER", "ADMIN"]}>
            <UsersPage />
          </RoleRoute>
        ),
      },
      {
        path: "branding",
        element: <BrandingPage />,
      },
      {
        path: "social-accounts",
        element: <SocialAccountsPage />,
      },
      {
        path: "posts",
        element: <PostsPage />,
      },
      {
        path: "billing",
        element: (
          <RoleRoute allowedRoles={["OWNER", "ADMIN"]}>
            <BillingPage />
          </RoleRoute>
        ),
      },
      {
        path: "referrals",
        element: <ReferralsPage />,
      },
      {
        path: "account",
        element: <AccountPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);