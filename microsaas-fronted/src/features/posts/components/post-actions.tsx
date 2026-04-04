import { Button, Popconfirm, Space, message } from "antd";
import type { PostItem } from "../../../types/post.types";
import { useCancelPost } from "../hooks/use-cancel-post";
import { usePublishPost } from "../hooks/use-publish-post";
import { useRestorePost } from "../hooks/use-restore-post";

type Props = {
  post: PostItem;
  onEdit: (post: PostItem) => void;
};

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
      message.error("No se pudo publicar");
      console.error(error);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync(post.id);
      message.success("Publicación cancelada correctamente");
    } catch (error) {
      message.error("No se pudo cancelar");
      console.error(error);
    }
  };

  const handleRestore = async () => {
    try {
      await restoreMutation.mutateAsync(post.id);
      message.success("Publicación restaurada correctamente");
    } catch (error) {
      message.error("No se pudo restaurar");
      console.error(error);
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
          <Button type="primary" loading={isLoading}>
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
          <Button danger loading={isLoading}>
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
          <Button loading={isLoading}>Restaurar</Button>
        </Popconfirm>
      )}

      {(post.status === "PUBLISHED" ||
        post.status === "FAILED" ||
        post.status === "PROCESSING") && (
        <Button disabled>Sin acciones</Button>
      )}
    </Space>
  );
}