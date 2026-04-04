export type PostErrorDiagnosisType =
  | "TEMPORARY"
  | "MEDIA_INVALID"
  | "AUTH"
  | "CONTENT_INVALID"
  | "UNKNOWN";

export type PostErrorDiagnosis = {
  type: PostErrorDiagnosisType;
  title: string;
  description: string;
  allowDirectRetry: boolean;
};

function normalizeError(errorMessage?: string | null) {
  return errorMessage?.toLowerCase().trim() ?? "";
}

export function diagnosePostError(
  errorMessage?: string | null
): PostErrorDiagnosis {
  const error = normalizeError(errorMessage);

  if (!error) {
    return {
      type: "UNKNOWN",
      title: "Error no identificado",
      description: "No se pudo determinar la causa exacta del fallo.",
      allowDirectRetry: false,
    };
  }

  if (
    error.includes("timeout") ||
    error.includes("temporarily") ||
    error.includes("temporary") ||
    error.includes("network") ||
    error.includes("connection reset") ||
    error.includes("connection refused") ||
    error.includes("service unavailable") ||
    error.includes("bad gateway") ||
    error.includes("gateway timeout") ||
    error.includes("internal server error") ||
    error.includes("try again")
  ) {
    return {
      type: "TEMPORARY",
      title: "Fallo temporal",
      description:
        "El error parece temporal. Puedes reintentar la publicación directamente.",
      allowDirectRetry: true,
    };
  }

  if (
    error.includes("invalid image") ||
    error.includes("missing or invalid image file") ||
    error.includes("unsupported format")
  ) {
    return {
      type: "MEDIA_INVALID",
      title: "Problema con la imagen",
      description:
        "La imagen no es válida o no pudo ser procesada. Debes cambiarla o regenerarla antes de publicar.",
      allowDirectRetry: false,
    };
  }

  if (
    error.includes("permission") ||
    error.includes("permissions") ||
    error.includes("token") ||
    error.includes("expired") ||
    error.includes("unauthorized") ||
    error.includes("forbidden")
  ) {
    return {
      type: "AUTH",
      title: "Problema de autenticación o permisos",
      description:
        "La cuenta conectada o sus permisos deben revisarse antes de volver a intentar.",
      allowDirectRetry: false,
    };
  }

  if (error.includes("invalid parameter")) {
    return {
      type: "CONTENT_INVALID",
      title: "Contenido inválido",
      description:
        "El contenido enviado fue rechazado. Debes corregir el post antes de volver a publicarlo.",
      allowDirectRetry: false,
    };
  }

  return {
    type: "UNKNOWN",
    title: "Corrección manual requerida",
    description:
      "Este error requiere revisión manual antes de volver a publicar.",
    allowDirectRetry: false,
  };
}