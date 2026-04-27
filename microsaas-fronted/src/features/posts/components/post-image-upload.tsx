import { Button, Flex, Image, Input, Space, Typography, Upload, message } from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { useUploadPostImage } from "../hooks/use-upload-post-image";

const { Text } = Typography;

type Props = {
  label?: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
};

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const MAX_FILE_SIZE_MB = 5;

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
    return data?.message || data?.error || "No se pudo subir la imagen del post";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "No se pudo subir la imagen del post";
}

export function PostImageUpload({
  label,
  value,
  onChange,
}: Props) {
  const uploadMutation = useUploadPostImage();

  const triggerChange = (nextValue: string | null) => {
    onChange?.(nextValue);
  };

  const handleManualChange = (nextValue: string) => {
    const normalized = nextValue.trim();
    triggerChange(normalized.length > 0 ? normalized : null);
  };

  const handleClear = () => {
    triggerChange(null);
  };

  const uploadProps: UploadProps = {
    accept: ALLOWED_TYPES.join(","),
    showUploadList: false,
    disabled: uploadMutation.isPending,
    beforeUpload: async (file) => {
      const isAllowedType = ALLOWED_TYPES.includes(file.type);
      if (!isAllowedType) {
        message.error("Solo se permiten imágenes PNG, JPG, JPEG o WEBP.");
        return Upload.LIST_IGNORE;
      }

      const isAllowedSize = file.size / 1024 / 1024 <= MAX_FILE_SIZE_MB;
      if (!isAllowedSize) {
        message.error(`La imagen no debe superar ${MAX_FILE_SIZE_MB} MB.`);
        return Upload.LIST_IGNORE;
      }

      try {
        const result = await uploadMutation.mutateAsync(file as File);
        triggerChange(result.url);
        message.success("Imagen subida correctamente");
      } catch (error) {
        console.error(error);
        message.error(getErrorMessage(error));
      }

      return false;
    },
  };

  return (
    <Space direction="vertical" size={8} style={{ width: "100%" }}>
      {label ? <Text>{label}</Text> : null}

      <Flex gap={8} align="start">
        <Input
          value={value ?? ""}
          onChange={(e) => handleManualChange(e.target.value)}
          placeholder="https://... o sube una imagen"
          disabled={uploadMutation.isPending}
        />

        <Upload {...uploadProps}>
          <Button
            type="default"
            htmlType="button"
            icon={<UploadOutlined />}
            loading={uploadMutation.isPending}
          >
            Subir
          </Button>
        </Upload>

        {!!value && (
          <Button
            type="default"
            htmlType="button"
            icon={<DeleteOutlined />}
            onClick={handleClear}
            disabled={uploadMutation.isPending}
          />
        )}
      </Flex>

      {!!value && (
        <Image
          src={value}
          alt="Preview imagen del post"
          width={260}
          style={{ borderRadius: 12 }}
          fallback="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
        />
      )}
    </Space>
  );
}