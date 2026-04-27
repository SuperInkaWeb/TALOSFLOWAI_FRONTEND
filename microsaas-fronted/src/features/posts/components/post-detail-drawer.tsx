import { useMemo } from "react";
import {
  Alert,
  Button,
  Descriptions,
  Drawer,
  Image,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import type { PostItem, PostStatus, PostTargetStatus } from "../../../types/post.types";
import { usePublishPost } from "../hooks/use-publish-post";
import { useCancelPost } from "../hooks/use-cancel-post";
import { useRestorePost } from "../hooks/use-restore-post";
import { useRetryPost } from "../hooks/use-retry-post";
import { diagnosePostError } from "../utils/post-error-diagnosis";

const { Paragraph, Text, Link } = Typography;

type Props = {
  open: boolean;
  post: PostItem | null;
  onClose: () => void;
  onEdit?: (post: PostItem) => void;
  onRegenerateImage?: (post: PostItem) => void;
  onRegenerateText?: (post: PostItem) => void;
};

function getStatusColor(status: PostStatus) {
  switch (status) {
    case "DRAFT":
      return "default";
    case "SCHEDULED":
      return "blue";
    case "PROCESSING":
      return "processing";
    case "PUBLISHED":
      return "green";
    case "FAILED":
      return "red";
    case "CANCELED":
      return "orange";
    default:
      return "default";
  }
}

function getStatusLabel(status: PostStatus) {
  switch (status) {
    case "DRAFT":
      return "Borrador";
    case "SCHEDULED":
      return "Programado";
    case "PROCESSING":
      return "Procesando";
    case "PUBLISHED":
      return "Publicado";
    case "FAILED":
      return "Fallido";
    case "CANCELED":
      return "Cancelado";
    default:
      return status;
  }
}

function getTargetAlertType(status: PostTargetStatus) {
  switch (status) {
    case "SUCCESS":
      return "success" as const;
    case "FAILED":
      return "error" as const;
    case "PENDING":
      return "info" as const;
    case "CANCELED":
      return "warning" as const;
    default:
      return "info" as const;
  }
}

function getErrorMessage(error: unknown, fallback: string) {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response
  ) {
    const data = error.response.data as { message?: string; error?: string };
    return data?.message || data?.error || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function formatDateTime(value?: string | null) {
  if (!value) return "No disponible";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString("es-EC");
}

export function PostDetailDrawer({
  open,
  post,
  onClose,
  onEdit,
  onRegenerateImage,
  onRegenerateText,
}: Props) {
  const diagnosis = useMemo(() => {
    if (!post) return null;
    return diagnosePostError(post.errorMessage);
  }, [post]);

  const publishMutation = usePublishPost();
  const cancelMutation = useCancelPost();
  const restoreMutation = useRestorePost();
  const retryMutation = useRetryPost();

  if (!post) {
    return (
      <Drawer
        open={open}
        onClose={onClose}
        title="Detalle del post"
        width={760}
        destroyOnClose
      />
    );
  }

  const isPublishing = publishMutation.isPending;
  const isCanceling = cancelMutation.isPending;
  const isRestoring = restoreMutation.isPending;
  const isRetrying = retryMutation.isPending;

  const isBusy = isPublishing || isCanceling || isRestoring || isRetrying;

  // Alineado con PostActions
  const canPublish = post.status === "DRAFT";
  const canCancel = post.status === "SCHEDULED";
  const canRestore = post.status === "CANCELED";
  const canEdit =
    post.status === "DRAFT" ||
    post.status === "SCHEDULED" ||
    post.status === "FAILED";

  const canRetry =
    post.status === "FAILED" && Boolean(diagnosis?.allowDirectRetry);

  const canRegenerateImage =
    post.status === "FAILED" && diagnosis?.type === "MEDIA_INVALID";

  const canRegenerateText =
    post.status === "FAILED" && diagnosis?.type === "CONTENT_INVALID";

  const handlePublish = async () => {
    try {
      await publishMutation.mutateAsync(post.id);
      message.success("Publicación realizada correctamente");
    } catch (error) {
      message.error(getErrorMessage(error, "No se pudo publicar el post"));
    }
  };

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync(post.id);
      message.success("Post cancelado correctamente");
    } catch (error) {
      message.error(getErrorMessage(error, "No se pudo cancelar el post"));
    }
  };

  const handleRestore = async () => {
    try {
      await restoreMutation.mutateAsync(post.id);
      message.success("Post restaurado correctamente");
    } catch (error) {
      message.error(getErrorMessage(error, "No se pudo restaurar el post"));
    }
  };

  const handleRetry = async () => {
    try {
      await retryMutation.mutateAsync(post.id);
      message.success("Publicación reintentada correctamente");
    } catch (error) {
      message.error(
        getErrorMessage(error, "No se pudo reintentar la publicación")
      );
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`Post #${post.id}`}
      width={760}
      destroyOnClose
      extra={
        <Space wrap>
          {canEdit && onEdit && (
            <Button onClick={() => onEdit(post)} disabled={isBusy}>
              Editar
            </Button>
          )}

          {canRegenerateText && onRegenerateText && (
            <Button onClick={() => onRegenerateText(post)} disabled={isBusy}>
              Regenerar texto
            </Button>
          )}

          {canRegenerateImage && onRegenerateImage && (
            <Button onClick={() => onRegenerateImage(post)} disabled={isBusy}>
              Regenerar imagen
            </Button>
          )}

          {canRestore && (
            <Button
              onClick={handleRestore}
              loading={isRestoring}
              disabled={isBusy}
            >
              Restaurar
            </Button>
          )}

          {canCancel && (
            <Button
              danger
              onClick={handleCancel}
              loading={isCanceling}
              disabled={isBusy}
            >
              Cancelar
            </Button>
          )}

          {canRetry && (
            <Button
              onClick={handleRetry}
              loading={isRetrying}
              disabled={isBusy}
            >
              Reintentar publicación
            </Button>
          )}

          {canPublish && (
            <Button
              type="primary"
              onClick={handlePublish}
              loading={isPublishing}
              disabled={isBusy}
            >
              Publicar ahora
            </Button>
          )}
        </Space>
      }
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Descriptions bordered size="small" column={1}>
          <Descriptions.Item label="Estado">
            <Tag color={getStatusColor(post.status)}>
              {getStatusLabel(post.status)}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Contenido">
            <Paragraph style={{ marginBottom: 0, whiteSpace: "pre-wrap" }}>
              {post.content || "Sin contenido"}
            </Paragraph>
          </Descriptions.Item>

          <Descriptions.Item label="Imagen">
            {post.mediaUrl ? (
              <Space direction="vertical" size="small">
                <Image
                  src={post.mediaUrl}
                  alt={`Post ${post.id}`}
                  style={{ maxWidth: 260, borderRadius: 8 }}
                />
                <Link href={post.mediaUrl} target="_blank">
                  Abrir imagen
                </Link>
              </Space>
            ) : (
              <Text type="secondary">Sin imagen</Text>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Programado para">
            {post.scheduledAt ? formatDateTime(post.scheduledAt) : "No programado"}
          </Descriptions.Item>

          <Descriptions.Item label="Publicado en">
            {post.publishedAt
              ? formatDateTime(post.publishedAt)
              : "Aún no publicado"}
          </Descriptions.Item>

          <Descriptions.Item label="Creado en">
            {formatDateTime(post.createdAt)}
          </Descriptions.Item>

          <Descriptions.Item label="Actualizado en">
            {formatDateTime(post.updatedAt)}
          </Descriptions.Item>
        </Descriptions>

        {post.status === "FAILED" && diagnosis && (
          <Alert
            type={diagnosis.allowDirectRetry ? "warning" : "error"}
            showIcon
            message={diagnosis.title}
            description={
              <Space direction="vertical" size={6}>
                <Text>{diagnosis.description}</Text>
                {post.errorMessage && (
                  <Text type="secondary">
                    Detalle técnico: {post.errorMessage}
                  </Text>
                )}
              </Space>
            }
          />
        )}

        {post.targets?.length > 0 && (
          <div>
            <Text strong>Targets</Text>

            <Space
              direction="vertical"
              size="small"
              style={{ width: "100%", marginTop: 12 }}
            >
              {post.targets.map((target) => (
                <Alert
                  key={`${target.socialPageId}-${target.pageName}`}
                  type={getTargetAlertType(target.status)}
                  showIcon
                  message={`${target.pageName} · ${target.status}`}
                  description={
                    target.errorMessage
                      ? `Error: ${target.errorMessage}`
                      : "Sin errores"
                  }
                />
              ))}
            </Space>
          </div>
        )}
      </Space>
    </Drawer>
  );
}