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

export function PostImageUpload({
  label = "",
  value,
  onChange,
}: Props) {
  const uploadMutation = useUploadPostImage();

  const triggerChange = (nextValue: string | null) => {
    onChange?.(nextValue);
  };

  const uploadProps: UploadProps = {
    accept: "image/png,image/jpeg,image/jpg,image/webp",
    showUploadList: false,
    disabled: uploadMutation.isPending,
    beforeUpload: async (file) => {
      try {
        const result = await uploadMutation.mutateAsync(file as File);
        triggerChange(result.url);
        message.success(`${label} subida correctamente`);
      } catch {
        // el error ya se maneja en el hook
      }

      return false;
    },
  };

  const handleClear = () => {
    triggerChange(null);
  };

  return (
    <Space direction="vertical" size={8} style={{ width: "100%" }}>
      <Text>{label}</Text>

      <Flex gap={8} align="start">
        <Input
          value={value ?? ""}
          onChange={(e) => triggerChange(e.target.value || null)}
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
        />
      )}
    </Space>
  );
}