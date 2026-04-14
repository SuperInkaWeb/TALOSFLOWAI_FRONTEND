import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../../components/layout/app-layout";
import { PrivateRoute } from "./private-route";
import { LoginPage } from "../../pages/login-page";
import { SignupPage } from "../../pages/signup-page";
import { DashboardPage } from "../../pages/dashboard-page";
import { BrandingPage } from "../../pages/branding-page";
import { SocialAccountsPage } from "../../pages/social-accounts-page";
import { PostsPage } from "../../pages/posts-page";
import { AiPage } from "../../pages/ai-page";
import { BillingPage } from "../../pages/billing-page";
import ReferralsPage from "../../pages/referral-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/auth/signup",
    element: <SignupPage />,
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
        path: "dashboard",
        element: <DashboardPage />,
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
        path: "ai",
        element: <AiPage />,
      },
      {
        path: "billing",
        element: <BillingPage />,
      },

      {
        path: "referrals",
        element: <ReferralsPage />,
      }
    ],
  },
]);