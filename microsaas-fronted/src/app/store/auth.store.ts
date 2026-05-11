import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

export type UserRole = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER" | "SUPER_ADMIN";
export type UserScope = "TENANT" | "PLATFORM";

type JwtPayload = {
  sub?: string;
  userId?: number;
  scope?: UserScope;
  orgId?: number;
  schema?: string;
  role?: UserRole;
  exp?: number;
};

type UserSession = {
  token: string | null;
  isAuthenticated: boolean;
  userId?: number;
  scope?: UserScope;
  orgId?: number;
  schema?: string;
  role?: UserRole;

  setToken: (token: string) => void;
  logout: () => void;
};

function extractUserId(decoded: JwtPayload): number | undefined {
  if (typeof decoded.userId === "number") return decoded.userId;

  if (decoded.sub) {
    const parsed = Number(decoded.sub);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
}

function isTokenExpired(decoded: JwtPayload): boolean {
  if (!decoded.exp) return false;
  return decoded.exp * 1000 < Date.now();
}

function emptySession() {
  return {
    token: null,
    isAuthenticated: false,
    userId: undefined,
    scope: undefined,
    orgId: undefined,
    schema: undefined,
    role: undefined,
  };
}

const savedToken = localStorage.getItem("access_token");

let initialState: Omit<UserSession, "setToken" | "logout"> = {
  token: null,
  isAuthenticated: false,
  userId: undefined,
  scope: undefined,
  orgId: undefined,
  schema: undefined,
  role: undefined,
};

if (savedToken) {
  try {
    const decoded = jwtDecode<JwtPayload>(savedToken);

    if (isTokenExpired(decoded)) {
      localStorage.removeItem("access_token");
    } else {
      initialState = {
        token: savedToken,
        isAuthenticated: true,
        userId: extractUserId(decoded),
        scope: decoded.scope ?? "TENANT",
        orgId: decoded.orgId,
        schema: decoded.schema,
        role: decoded.role,
      };
    }
  } catch {
    localStorage.removeItem("access_token");
  }
}

export const useAuthStore = create<UserSession>((set) => ({
  ...initialState,

  setToken: (token: string) => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (isTokenExpired(decoded)) {
        localStorage.removeItem("access_token");
        set(emptySession());
        return;
      }

      localStorage.setItem("access_token", token);

      set({
        token,
        isAuthenticated: true,
        userId: extractUserId(decoded),
        scope: decoded.scope ?? "TENANT",
        orgId: decoded.orgId,
        schema: decoded.schema,
        role: decoded.role,
      });
    } catch {
      localStorage.removeItem("access_token");
      set(emptySession());
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    set(emptySession());
  },
}));