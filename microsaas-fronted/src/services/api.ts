import axios from "axios";
import { message } from "antd";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error("VITE_API_URL no está definida");
}

let blockMessageShown = false;
let blockRedirectInProgress = false;

function handleOrganizationBlocked(messageText?: string) {
  if (blockRedirectInProgress) return;

  blockRedirectInProgress = true;
  localStorage.removeItem("access_token");

  const finalMessage =
    messageText || "Tu organización está suspendida o inactiva. Contacta al administrador.";

  if (!blockMessageShown) {
    blockMessageShown = true;
    message.error(finalMessage);

    setTimeout(() => {
      blockMessageShown = false;
    }, 2500);
  }

  const currentPath = window.location.pathname;
  const isAlreadyInLogin = currentPath.startsWith("/auth/login");

  if (!isAlreadyInLogin) {
    window.location.href = "/auth/login?blocked=1";
    return;
  }

  setTimeout(() => {
    blockRedirectInProgress = false;
  }, 1000);
}

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const apiError = error?.response?.data?.error;
    const apiMessage = error?.response?.data?.message;

    if (status === 403 && apiError === "ORGANIZATION_ACCESS_BLOCKED") {
      handleOrganizationBlocked(apiMessage);
    }

    return Promise.reject(error);
  }
);