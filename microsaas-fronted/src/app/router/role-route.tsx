import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { Result } from "antd";

import { useAuthStore } from "../store/auth.store";

type UserRole =
  | "OWNER"
  | "ADMIN"
  | "EDITOR"
  | "VIEWER"
  | "SUPER_ADMIN";

type Props = PropsWithChildren<{
  allowedRoles: UserRole[];
}>;

export function RoleRoute({ allowedRoles, children }: Props) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);
  const scope = useAuthStore((state) => state.scope);

  // No autenticado
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Tokens PLATFORM no deben entrar al SaaS tenant
  if (scope !== "TENANT") {
    return <Navigate to="/platform/organizations" replace />;
  }

  // Rol inválido o sin permiso
  if (!role || !allowedRoles.includes(role)) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="No tienes permisos para acceder a esta sección."
      />
    );
  }

  return <>{children}</>;
}