import { useEffect, useMemo } from "react";
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Select,
  Space,
  message,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useCreatePost } from "../hooks/use-create-post";
import { useUpdatePost } from "../hooks/use-update-post";
import { PostImageUpload } from "../components/post-image-upload";
import type { PostItem } from "../../../types/post.types";

const { TextArea } = Input;
const { Text } = Typography;

export type PostPageOption = {
  id: number;
  name: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
  pages: PostPageOption[];
  mode: "create" | "edit";
  post?: PostItem | null;
};

type FormValues = {
  content: string;
  mediaUrl?: string | null;
  targetPageIds: number[];
  scheduledAt?: dayjs.Dayjs | null;
};

function formatLocalDateTime(value?: dayjs.Dayjs | null) {
  if (!value) return null;
  return value.format("YYYY-MM-DDTHH:mm:ss");
}

function getErrorMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response
  ) {
    const data = error.response.data as { message?: string; error?: string };
    return data?.message || data?.error || "Ocurrió un error al guardar el post";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error al guardar el post";
}

export function PostFormDrawer({
  open,
  onClose,
  onSaved,
  pages,
  mode,
  post,
}: Props) {
  const [form] = Form.useForm<FormValues>();

  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();

  const isEditMode = mode === "edit" && !!post;
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const sortedPages = useMemo(
    () => [...pages].sort((a, b) => a.name.localeCompare(b.name)),
    [pages]
  );

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      content: post?.content ?? "",
      mediaUrl: post?.mediaUrl ?? null,
      targetPageIds: post?.targets?.map((target) => target.socialPageId) ?? [],
      scheduledAt: post?.scheduledAt ? dayjs(post.scheduledAt) : null,
    });
  }, [open, post, form]);

  const handleSubmit = async (values: FormValues) => {
    try {
      const normalizedMediaUrl =
        typeof values.mediaUrl === "string" ? values.mediaUrl.trim() : "";

      const payload = {
        content: values.content.trim(),
        mediaUrl: normalizedMediaUrl.length > 0 ? normalizedMediaUrl : null,
        targetPageIds: values.targetPageIds,
        scheduledAt: values.scheduledAt
          ? formatLocalDateTime(values.scheduledAt)
          : null,
      };

      if (isEditMode && post) {
        await updateMutation.mutateAsync({
          postId: post.id,
          data: payload,
        });

        await onSaved();
        message.success("Post actualizado correctamente");
      } else {
        await createMutation.mutateAsync(payload);
        await onSaved();
        message.success("Post creado correctamente");
      }

      form.resetFields();
      onClose();
    } catch (error) {
      message.error(getErrorMessage(error));
      console.error(error);
    }
  };

  const drawerTitle = isEditMode ? "Editar post" : "Nuevo post";
  const submitLabel = isEditMode ? "Guardar cambios" : "Crear post";

  return (
    <Drawer
      title={drawerTitle}
      width={520}
      open={open}
      onClose={onClose}
      destroyOnClose
    >
      <Form<FormValues>
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Contenido"
          name="content"
          rules={[
            { required: true, message: "El contenido es obligatorio" },
            { min: 3, message: "Escribe un contenido válido" },
          ]}
        >
          <TextArea
            rows={6}
            placeholder="Escribe el contenido del post..."
            maxLength={2000}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="Imagen del post"
          name="mediaUrl"
          extra="Puedes pegar una URL o subir una imagen. Si lo borras al editar, la imagen se eliminará del post."
        >
          <PostImageUpload />
        </Form.Item>

        <Form.Item
          label="Páginas objetivo"
          name="targetPageIds"
          rules={[
            {
              required: true,
              type: "array",
              min: 1,
              message: "Selecciona al menos una página",
            },
          ]}
          extra={
            pages.length === 0 ? (
              <Text type="secondary">
                No hay páginas disponibles. Verifica que tengas páginas conectadas.
              </Text>
            ) : undefined
          }
        >
          <Select
            mode="multiple"
            placeholder="Selecciona una o más páginas"
            options={sortedPages.map((page) => ({
              label: page.name,
              value: page.id,
            }))}
            disabled={pages.length === 0}
            optionFilterProp="label"
            showSearch
          />
        </Form.Item>

        <Form.Item
          label="Programar publicación (opcional)"
          name="scheduledAt"
          extra="Si lo dejas vacío, el post se guarda como borrador. Si tiene fecha, se guarda como programado."
        >
          <DatePicker
            showTime
            format="DD/MM/YYYY HH:mm"
            style={{ width: "100%" }}
            placeholder="Selecciona fecha y hora"
            allowClear
          />
        </Form.Item>

        <Space size="middle">
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={pages.length === 0}
          >
            {submitLabel}
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
}