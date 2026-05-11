import type { AxiosError } from "axios";

type ApiErrorBody = {
  message?: string;
  error?: string;
  code?: string;
};

export function getApiErrorMessage(
  error: unknown,
  fallback = "Ocurrió un error inesperado. Intenta nuevamente."
) {
  const axiosError = error as AxiosError<ApiErrorBody> | undefined;

  const status = axiosError?.response?.status;

  const code =
    axiosError?.response?.data?.code ||
    axiosError?.response?.data?.error;

  const rawMessage =
    axiosError?.response?.data?.message ||
    axiosError?.response?.data?.error ||
    axiosError?.message ||
    "";

  const lower = rawMessage.toLowerCase();

  // =========================
  // AUTH
  // =========================

  if (status === 401) {
    return "Tu sesión expiró. Inicia sesión nuevamente.";
  }

  if (status === 403) {
    if (code === "ORGANIZATION_ACCESS_BLOCKED") {
      return rawMessage || "Tu organización está suspendida o inactiva.";
    }

    if (
      code === "PLAN_LIMIT_REACHED" ||
      code === "PLAN_ACCESS_DENIED" ||
      code === "AI_LIMIT_REACHED" ||
      code === "POST_LIMIT_REACHED" ||
      code === "IMAGE_REGEN_LIMIT_REACHED" ||
      code === "TEXT_REGEN_LIMIT_REACHED" ||
      code?.includes("LIMIT")
    ) {
      return rawMessage || "Tu plan actual no permite esta acción.";
    }

    return "No tienes permisos para realizar esta acción.";
  }

  // =========================
  // COMMON HTTP
  // =========================

  if (status === 404) {
    return "No se encontró la información solicitada.";
  }

  if (status === 409) {
    return rawMessage || "No se pudo completar la acción por un conflicto.";
  }

  if (status === 429) {
    return "Demasiadas solicitudes. Espera un momento e intenta nuevamente.";
  }

  if (status && status >= 500) {
    return "El servidor tuvo un problema. Intenta nuevamente más tarde.";
  }

  // =========================
  // TECHNICAL ERRORS
  // =========================

  const isTechnicalError =
    lower.includes("sql") ||
    lower.includes("column") ||
    lower.includes("hibernate") ||
    lower.includes("jdbc") ||
    lower.includes("position:") ||
    lower.includes("constraint") ||
    lower.includes("syntax") ||
    lower.includes("password_changed_at") ||
    lower.includes("must_change_password") ||
    lower.includes("relation") ||
    lower.includes("does not exist") ||
    lower.includes("stacktrace") ||
    lower.includes("nullpointer") ||
    lower.includes("illegalstateexception");

  if (isTechnicalError) {
    return "Ocurrió un error interno. Intenta nuevamente.";
  }

  // =========================
  // IA
  // =========================

  const isAiError =
    lower.includes("groq") ||
    lower.includes("openai") ||
    lower.includes("llama") ||
    lower.includes("api key") ||
    lower.includes("timeout") ||
    lower.includes("timed out");

  if (isAiError) {
    return "No se pudo completar la generación con IA. Intenta nuevamente en unos segundos.";
  }

  // =========================
  // STRIPE
  // =========================

  const isStripeError =
    lower.includes("stripe") ||
    lower.includes("checkout") ||
    lower.includes("customer portal") ||
    lower.includes("no such price");

  if (isStripeError) {
    return "No se pudo procesar la facturación. Intenta nuevamente.";
  }

  // =========================
  // META / FACEBOOK
  // =========================

  const isMetaError =
    lower.includes("facebook") ||
    lower.includes("meta") ||
    lower.includes("instagram") ||
    lower.includes("graph api");

  if (isMetaError) {
    return "No se pudo conectar con Meta/Facebook. Verifica los permisos de la cuenta.";
  }

  // =========================
  // CLOUDINARY
  // =========================

  const isCloudinaryError =
    lower.includes("cloudinary") ||
    lower.includes("image upload");

  if (isCloudinaryError) {
    return "No se pudo procesar la imagen generada.";
  }

  // =========================
  // NETWORK
  // =========================

  const isNetworkError =
    lower.includes("network error") ||
    lower.includes("err_network") ||
    lower.includes("failed to fetch");

  if (isNetworkError) {
    return "No se pudo conectar con el servidor. Revisa tu conexión e intenta nuevamente.";
  }

  // =========================
  // RAW MESSAGE
  // =========================

  if (rawMessage && rawMessage.trim().length > 0) {
    return rawMessage;
  }

  return fallback;
}