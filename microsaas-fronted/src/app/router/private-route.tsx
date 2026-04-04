import { Navigate } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { useAuthStore } from "../store/auth.store";

export function PrivateRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}