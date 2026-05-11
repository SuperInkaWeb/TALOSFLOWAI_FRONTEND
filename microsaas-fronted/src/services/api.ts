import axios from "axios";
import { message } from "antd";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error("VITE_API_URL no está definida");
}

let blockMessageShown = false;
let blockRedirectInProgress = false;

let sessionExpiredShown = false;
let sessionRedirectInProgress = false;

function clearSession() {
  localStorage.removeItem("access_token");
}

function redirectToLogin(query: "blocked" | "expired") {
  const currentPath = window.location.pathname;
  const isAlreadyInLogin = currentPath.startsWith("/auth/login");

  if (!isAlreadyInLogin) {
    window.location.href = `/auth/login?${query}=1`;
  }
}

function handleOrganizationBlocked(messageText?: string) {
  if (blockRedirectInProgress) return;

  blockRedirectInProgress = true;
  clearSession();

  const finalMessage =
    messageText ||
    "Tu organización está suspendida o inactiva. Contacta al administrador.";

  if (!blockMessageShown) {
    blockMessageShown = true;
    message.error(finalMessage);

    setTimeout(() => {
      blockMessageShown = false;
    }, 2500);
  }

  redirectToLogin("blocked");

  setTimeout(() => {
    blockRedirectInProgress = false;
  }, 1000);
}

function handleSessionExpired() {
  if (sessionRedirectInProgress) return;

  sessionRedirectInProgress = true;
  clearSession();

  if (!sessionExpiredShown) {
    sessionExpiredShown = true;
    message.warning("Tu sesión expiró. Inicia sesión nuevamente.");

    setTimeout(() => {
      sessionExpiredShown = false;
    }, 2500);
  }

  redirectToLogin("expired");

  setTimeout(() => {
    sessionRedirectInProgress = false;
  }, 1000);
}

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  config.headers = config.headers ?? {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const apiError = error?.response?.data?.error;
    const apiMessage = error?.response?.data?.message;

    if (status === 401) {
      handleSessionExpired();
      return Promise.reject(error);
    }

    if (status === 403 && apiError === "ORGANIZATION_ACCESS_BLOCKED") {
      handleOrganizationBlocked(apiMessage);
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);