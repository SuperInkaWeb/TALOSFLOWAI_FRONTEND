import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { postService } from "../../../services/post.service";
import type { PagedResponse, PostItem } from "../../../types/post.types";
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

function getStatusColor(status: string) {
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

function getStatusLabel(status: string) {
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

function updatePostInPagedCache(
  oldData: PagedResponse<PostItem> | undefined,
  updatedPost: PostItem
): PagedResponse<PostItem> | undefined {
  if (!oldData) return oldData;

  return {
    ...oldData,
    items: oldData.items.map((item) =>
      item.id === updatedPost.id ? updatedPost : item
    ),
  };
}

export function PostDetailDrawer({
  open,
  post,
  onClose,
  onEdit,
  onRegenerateImage,
  onRegenerateText,
}: Props) {
  const queryClient = useQueryClient();

  const diagnosis = useMemo(() => {
    if (!post) return null;
    return diagnosePostError(post.errorMessage);
  }, [post]);

  const publishMutation = useMutation({
    mutationFn: (postId: number) => postService.publishPost(postId),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(["post", updatedPost.id], updatedPost);

      queryClient.setQueriesData(
        { queryKey: ["posts"] },
        (oldData: PagedResponse<PostItem> | undefined) =>
          updatePostInPagedCache(oldData, updatedPost)
      );

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", updatedPost.id] });

      message.success("Publicación realizada correctamente");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "No se pudo publicar el post";

      message.error(errorMessage);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (postId: number) => postService.cancelPost(postId),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(["post", updatedPost.id], updatedPost);

      queryClient.setQueriesData(
        { queryKey: ["posts"] },
        (oldData: PagedResponse<PostItem> | undefined) =>
          updatePostInPagedCache(oldData, updatedPost)
      );

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", updatedPost.id] });

      message.success("Post cancelado correctamente");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "No se pudo cancelar el post";

      message.error(errorMessage);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (postId: number) => postService.restorePost(postId),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(["post", updatedPost.id], updatedPost);

      queryClient.setQueriesData(
        { queryKey: ["posts"] },
        (oldData: PagedResponse<PostItem> | undefined) =>
          updatePostInPagedCache(oldData, updatedPost)
      );

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", updatedPost.id] });

      message.success("Post restaurado correctamente");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "No se pudo restaurar el post";

      message.error(errorMessage);
    },
  });

  const { mutate: retryPost, isPending: isRetrying } = useRetryPost();

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

  const isBusy = isPublishing || isCanceling || isRestoring || isRetrying;

  const canPublish = post.status === "DRAFT" || post.status === "SCHEDULED";
  const canCancel = post.status === "DRAFT" || post.status === "SCHEDULED";
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
              onClick={() => restoreMutation.mutate(post.id)}
              loading={isRestoring}
              disabled={isBusy}
            >
              Restaurar
            </Button>
          )}

          {canCancel && (
            <Button
              danger
              onClick={() => cancelMutation.mutate(post.id)}
              loading={isCanceling}
              disabled={isBusy}
            >
              Cancelar
            </Button>
          )}

          {canRetry && (
            <Button
              onClick={() => retryPost(post.id)}
              loading={isRetrying}
              disabled={isBusy}
            >
              Reintentar publicación
            </Button>
          )}

          {canPublish && (
            <Button
              type="primary"
              onClick={() => publishMutation.mutate(post.id)}
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
            {post.scheduledAt || "No programado"}
          </Descriptions.Item>

          <Descriptions.Item label="Publicado en">
            {post.publishedAt || "Aún no publicado"}
          </Descriptions.Item>

          <Descriptions.Item label="Creado en">
            {post.createdAt}
          </Descriptions.Item>

          <Descriptions.Item label="Actualizado en">
            {post.updatedAt}
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
              {post.targets.map((target) => {
                const alertType =
                  target.status === "SUCCESS"
                    ? "success"
                    : target.status === "FAILED"
                    ? "error"
                    : target.status === "PENDING"
                    ? "info"
                    : "warning";

                return (
                  <Alert
                    key={`${target.socialPageId}-${target.pageName}`}
                    type={alertType}
                    showIcon
                    message={`${target.pageName} · ${target.status}`}
                    description={
                      target.errorMessage
                        ? `Error: ${target.errorMessage}`
                        : "Sin errores"
                    }
                  />
                );
              })}
            </Space>
          </div>
        )}
      </Space>
    </Drawer>
  );
}