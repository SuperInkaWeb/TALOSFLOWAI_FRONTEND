import { Button, Flex, Input, Space, Typography, Upload, message } from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { useUploadBrandAsset } from "../hooks/use-upload-brand-asset";

const { Text } = Typography;

type Props = {
  label: string;
  value?: string | null;
  onChange: (value: string) => void;
  onClear?: () => void;
};

export function BrandImageUpload({ label, value, onChange, onClear }: Props) {
  const uploadMutation = useUploadBrandAsset();

  const uploadProps: UploadProps = {
    accept: "image/png,image/jpeg,image/jpg,image/webp",
    showUploadList: false,
    beforeUpload: async (file) => {
      try {
        const result = await uploadMutation.mutateAsync(file as File);
        onChange(result.url);
        message.success(`${label} subido correctamente`);
      } catch {
        // el error ya se maneja en el hook
      }
      return false;
    },
  };

  return (
    <Space direction="vertical" size={8} style={{ width: "100%" }}>
      <Text>{label}</Text>

      <Flex gap={8}>
        <Input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... o sube una imagen"
        />

        <Upload {...uploadProps}>
          <Button
            icon={<UploadOutlined />}
            loading={uploadMutation.isPending}
          >
            Subir
          </Button>
        </Upload>

        {!!value && (
          <Button
            icon={<DeleteOutlined />}
            onClick={onClear}
          />
        )}
      </Flex>
    </Space>
  );
}