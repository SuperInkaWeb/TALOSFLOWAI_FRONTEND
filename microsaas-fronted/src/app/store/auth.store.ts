import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  sub?: string;
  userId?: number;
  scope?: "TENANT" | "PLATFORM";
  orgId?: number;
  schema?: string;
  role?: string;
};

type UserSession = {
  token: string | null;
  isAuthenticated: boolean;
  userId?: number;
  scope?: "TENANT" | "PLATFORM";
  orgId?: number;
  schema?: string;
  role?: string;

  setToken: (token: string) => void;
  logout: () => void;
};

function extractUserId(decoded: JwtPayload): number | undefined {
  if (typeof decoded.userId === "number") {
    return decoded.userId;
  }

  if (decoded.sub) {
    const parsed = Number(decoded.sub);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
}

const savedToken = localStorage.getItem("access_token");

let initialToken: string | null = null;
let initialIsAuthenticated = false;
let initialUserId: number | undefined = undefined;
let initialScope: "TENANT" | "PLATFORM" | undefined = undefined;
let initialOrgId: number | undefined = undefined;
let initialSchema: string | undefined = undefined;
let initialRole: string | undefined = undefined;

if (savedToken) {
  try {
    const decoded = jwtDecode<JwtPayload>(savedToken);

    initialToken = savedToken;
    initialIsAuthenticated = true;
    initialUserId = extractUserId(decoded);
    initialScope = decoded.scope ?? "TENANT";
    initialOrgId = decoded.orgId;
    initialSchema = decoded.schema;
    initialRole = decoded.role;
  } catch {
    localStorage.removeItem("access_token");
  }
}

export const useAuthStore = create<UserSession>((set) => ({
  token: initialToken,
  isAuthenticated: initialIsAuthenticated,
  userId: initialUserId,
  scope: initialScope,
  orgId: initialOrgId,
  schema: initialSchema,
  role: initialRole,

  setToken: (token: string) => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);

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

      set({
        token: null,
        isAuthenticated: false,
        userId: undefined,
        scope: undefined,
        orgId: undefined,
        schema: undefined,
        role: undefined,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");

    set({
      token: null,
      isAuthenticated: false,
      userId: undefined,
      scope: undefined,
      orgId: undefined,
      schema: undefined,
      role: undefined,
    });
  },
}));