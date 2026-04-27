import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export function PlatformRoute({ children }: PropsWithChildren) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const scope = useAuthStore((state) => state.scope);

  if (!isAuthenticated || scope !== "PLATFORM") {
    return <Navigate to="/platform/login" replace />;
  }

  return <>{children}</>;
}