import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuthStore } from "../store/auth.store";

export function PrivateRoute({ children }: PropsWithChildren) {
  const location = useLocation();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const scope = useAuthStore((state) => state.scope);

  // Sin sesión
  if (!isAuthenticated || !token) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // Usuarios PLATFORM no deben entrar al tenant app
  if (scope === "PLATFORM") {
    return <Navigate to="/platform/organizations" replace />;
  }

  return <>{children}</>;
}