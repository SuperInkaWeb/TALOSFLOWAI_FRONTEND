import { Button, Popconfirm, Space, Tag, message } from "antd";
import type { PostItem } from "../../../types/post.types";
import { useCancelPost } from "../hooks/use-cancel-post";
import { usePublishPost } from "../hooks/use-publish-post";
import { useRestorePost } from "../hooks/use-restore-post";

type Props = {
  post: PostItem;
  onEdit: (post: PostItem) => void;
};

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

export function PostActions({ post, onEdit }: Props) {
  const publishMutation = usePublishPost();
  const cancelMutation = useCancelPost();
  const restoreMutation = useRestorePost();

  const isLoading =
    publishMutation.isPending ||
    cancelMutation.isPending ||
    restoreMutation.isPending;

  const handlePublish = async () => {
    try {
      await publishMutation.mutateAsync(post.id);
      message.success("Publicación enviada correctamente");
    } catch (error) {
      console.error(error);
      message.error(getErrorMessage(error, "No se pudo publicar"));
    }
  };

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync(post.id);
      message.success("Publicación cancelada correctamente");
    } catch (error) {
      console.error(error);
      message.error(getErrorMessage(error, "No se pudo cancelar"));
    }
  };

  const handleRestore = async () => {
    try {
      await restoreMutation.mutateAsync(post.id);
      message.success("Publicación restaurada correctamente");
    } catch (error) {
      console.error(error);
      message.error(getErrorMessage(error, "No se pudo restaurar"));
    }
  };

  return (
    <Space wrap>
      {(post.status === "DRAFT" || post.status === "SCHEDULED") && (
        <Button onClick={() => onEdit(post)} disabled={isLoading}>
          Editar
        </Button>
      )}

      {post.status === "DRAFT" && (
        <Popconfirm
          title="¿Publicar ahora?"
          description="Esta acción intentará publicar el post inmediatamente."
          onConfirm={handlePublish}
          okText="Sí"
          cancelText="No"
        >
          <Button type="primary" loading={publishMutation.isPending} disabled={isLoading}>
            Publicar
          </Button>
        </Popconfirm>
      )}

      {post.status === "SCHEDULED" && (
        <Popconfirm
          title="¿Cancelar publicación programada?"
          description="La publicación dejará de estar programada."
          onConfirm={handleCancel}
          okText="Sí"
          cancelText="No"
        >
          <Button danger loading={cancelMutation.isPending} disabled={isLoading}>
            Cancelar
          </Button>
        </Popconfirm>
      )}

      {post.status === "CANCELED" && (
        <Popconfirm
          title="¿Restaurar publicación?"
          description="La publicación será restaurada por el backend."
          onConfirm={handleRestore}
          okText="Sí"
          cancelText="No"
        >
          <Button loading={restoreMutation.isPending} disabled={isLoading}>
            Restaurar
          </Button>
        </Popconfirm>
      )}

      {(post.status === "PUBLISHED" ||
        post.status === "FAILED" ||
        post.status === "PROCESSING") && (
        <Tag color="default">Sin acciones</Tag>
      )}
    </Space>
  );
}