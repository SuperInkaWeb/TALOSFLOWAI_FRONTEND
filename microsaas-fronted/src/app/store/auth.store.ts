import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  orgId: number;
  schema: string;
  role: string;
};

type UserSession = {
  token: string | null;
  isAuthenticated: boolean;
  orgId?: number;
  schema?: string;
  role?: string;
  setToken: (token: string) => void;
  logout: () => void;
  clearSession: () => void;
};

const savedToken = localStorage.getItem("access_token");

let initialOrgId: number | undefined = undefined;
let initialSchema: string | undefined = undefined;
let initialRole: string | undefined = undefined;
let initialToken: string | null = savedToken;
let initialIsAuthenticated = !!savedToken;

if (savedToken) {
  try {
    const decoded = jwtDecode<JwtPayload>(savedToken);
    initialOrgId = decoded.orgId;
    initialSchema = decoded.schema;
    initialRole = decoded.role;
  } catch {
    localStorage.removeItem("access_token");
    initialToken = null;
    initialIsAuthenticated = false;
  }
}

export const useAuthStore = create<UserSession>((set) => ({
  token: initialToken,
  isAuthenticated: initialIsAuthenticated,
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
        orgId: decoded.orgId,
        schema: decoded.schema,
        role: decoded.role,
      });
    } catch {
      localStorage.removeItem("access_token");

      set({
        token: null,
        isAuthenticated: false,
        orgId: undefined,
        schema: undefined,
        role: undefined,
      });
    }
  },

  clearSession: () => {
    localStorage.removeItem("access_token");

    set({
      token: null,
      isAuthenticated: false,
      orgId: undefined,
      schema: undefined,
      role: undefined,
    });
  },

  logout: () => {
    localStorage.removeItem("access_token");

    set({
      token: null,
      isAuthenticated: false,
      orgId: undefined,
      schema: undefined,
      role: undefined,
    });
  },
}));