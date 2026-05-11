import { Button, Popconfirm, Space, Tag, message } from "antd";
import type { PostItem } from "../../../types/post.types";

import { useCancelPost } from "../hooks/use-cancel-post";
import { usePublishPost } from "../hooks/use-publish-post";
import { useRestorePost } from "../hooks/use-restore-post";

import { getApiErrorMessage } from "../../../shared/utils/error.utils";

type Props = {
  post: PostItem;
  onEdit: (post: PostItem) => void;
};

const ACTION_MESSAGE_KEY = "post-action";

export function PostActions({ post, onEdit }: Props) {
  const publishMutation = usePublishPost();
  const cancelMutation = useCancelPost();
  const restoreMutation = useRestorePost();

  const isLoading =
    publishMutation.isPending ||
    cancelMutation.isPending ||
    restoreMutation.isPending;

  const handlePublish = async () => {
    if (isLoading) return;

    try {
      message.loading({
        key: ACTION_MESSAGE_KEY,
        content: "Publicando post...",
        duration: 0,
      });

      await publishMutation.mutateAsync(post.id);

      message.success({
        key: ACTION_MESSAGE_KEY,
        content: "Publicación enviada correctamente.",
        duration: 3,
      });
    } catch (error) {
      console.error(error);

      message.error({
        key: ACTION_MESSAGE_KEY,
        content: getApiErrorMessage(error, "No se pudo publicar."),
        duration: 5,
      });
    }
  };

  const handleCancel = async () => {
    if (isLoading) return;

    try {
      message.loading({
        key: ACTION_MESSAGE_KEY,
        content: "Cancelando publicación...",
        duration: 0,
      });

      await cancelMutation.mutateAsync(post.id);

      message.success({
        key: ACTION_MESSAGE_KEY,
        content: "Publicación cancelada correctamente.",
        duration: 3,
      });
    } catch (error) {
      console.error(error);

      message.error({
        key: ACTION_MESSAGE_KEY,
        content: getApiErrorMessage(error, "No se pudo cancelar."),
        duration: 5,
      });
    }
  };

  const handleRestore = async () => {
    if (isLoading) return;

    try {
      message.loading({
        key: ACTION_MESSAGE_KEY,
        content: "Restaurando publicación...",
        duration: 0,
      });

      await restoreMutation.mutateAsync(post.id);

      message.success({
        key: ACTION_MESSAGE_KEY,
        content: "Publicación restaurada correctamente.",
        duration: 3,
      });
    } catch (error) {
      console.error(error);

      message.error({
        key: ACTION_MESSAGE_KEY,
        content: getApiErrorMessage(error, "No se pudo restaurar."),
        duration: 5,
      });
    }
  };

  return (
    <Space wrap>
      {(post.status === "DRAFT" || post.status === "SCHEDULED") && (
        <Button
          onClick={() => onEdit(post)}
          disabled={isLoading}
        >
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
          okButtonProps={{
            loading: publishMutation.isPending,
          }}
        >
          <Button
            type="primary"
            loading={publishMutation.isPending}
            disabled={isLoading}
          >
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
          okButtonProps={{
            loading: cancelMutation.isPending,
          }}
        >
          <Button
            danger
            loading={cancelMutation.isPending}
            disabled={isLoading}
          >
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
          okButtonProps={{
            loading: restoreMutation.isPending,
          }}
        >
          <Button
            loading={restoreMutation.isPending}
            disabled={isLoading}
          >
            Restaurar
          </Button>
        </Popconfirm>
      )}

      {(post.status === "PUBLISHED" ||
        post.status === "FAILED" ||
        post.status === "PROCESSING") && (
        <Tag color="default">
          Sin acciones
        </Tag>
      )}
    </Space>
  );
}