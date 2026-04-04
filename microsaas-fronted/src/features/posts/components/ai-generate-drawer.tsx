import {
  Button,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Select,
  Space,
  Switch,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";
import { useGeneratePost } from "../hooks/use-generate-post";
import type {
  GenerateFullPostRequest,
  GenerateFullPostResponse,
  RegeneratePostRequest,
} from "../../../types/ai.types";
import type { PostPageOption } from "./post-form-drawer";

type FormValues = {
  idea: string;
  tone: string;
  platform: string;
  targetPageIds: number[];
  scheduledAt?: Dayjs | null;
  creativeOptions: {
    useBranding: boolean;
    showLogo: boolean;
    showCTA: boolean;
    showSocialLinks: boolean;
    template?: string | null;
  };
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (
    data: GenerateFullPostResponse,
    regeneratePayload: RegeneratePostRequest
  ) => void;
  pages: PostPageOption[];
};

export function AiGenerateDrawer({
  open,
  onClose,
  onSuccess,
  pages,
}: Props) {
  const [form] = Form.useForm<FormValues>();
  const generateMutation = useGeneratePost();
  const [messageApi, contextHolder] = message.useMessage();

  const sortedPages = useMemo(
    () => [...pages].sort((a, b) => a.name.localeCompare(b.name)),
    [pages]
  );

  const handleFinish = async (values: FormValues) => {
    const payload: GenerateFullPostRequest = {
      idea: values.idea.trim(),
      tone: values.tone,
      platform: values.platform,
      targetPageIds: values.targetPageIds,
      scheduledAt: values.scheduledAt
        ? values.scheduledAt.format("YYYY-MM-DDTHH:mm:ss")
        : null,
      creativeOptions: {
        useBranding: values.creativeOptions.useBranding,
        showLogo: values.creativeOptions.showLogo,
        showCTA: values.creativeOptions.showCTA,
        showSocialLinks: values.creativeOptions.showSocialLinks,
        template: values.creativeOptions.template ?? null,
      },
    };

    const regeneratePayload: RegeneratePostRequest = {
      idea: payload.idea,
      tone: payload.tone,
      platform: payload.platform,
    };

    try {
      const result = await generateMutation.mutateAsync(payload);
      messageApi.success("Post generado correctamente con IA");
      onSuccess(result, regeneratePayload);
      form.resetFields();
      onClose();
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "No se pudo generar el post con IA";
      messageApi.error(backendMessage);
    }
  };

  return (
    <>
      {contextHolder}

      <Drawer
        title="Generar post con IA"
        open={open}
        onClose={onClose}
        width={560}
        destroyOnClose
      >
        <Form<FormValues>
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            tone: "PROFESIONAL",
            platform: "FACEBOOK",
            targetPageIds: [],
            scheduledAt: null,
            creativeOptions: {
              useBranding: true,
              showLogo: true,
              showCTA: false,
              showSocialLinks: true,
              template: "PREMIUM_AUTO",
            },
          }}
        >
          <Form.Item
            label="Idea"
            name="idea"
            rules={[
              { required: true, message: "La idea es obligatoria" },
              { min: 5, message: "Escribe una idea más clara" },
            ]}
          >
            <Input.TextArea
              rows={5}
              placeholder="Ej: Promocionar hamburguesas artesanales con delivery inmediato y combos especiales"
            />
          </Form.Item>

          <Form.Item
            label="Tono"
            name="tone"
            rules={[{ required: true, message: "Selecciona un tono" }]}
          >
            <Select
              options={[
                { label: "Profesional", value: "PROFESIONAL" },
                { label: "Emocional", value: "EMOCIONAL" },
                { label: "Divertido", value: "DIVERTIDO" },
                { label: "Persuasivo", value: "PERSUASIVO" },
                { label: "Cercano", value: "CERCANO" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Plataforma"
            name="platform"
            rules={[{ required: true, message: "Selecciona una plataforma" }]}
          >
            <Select
              options={[
                { label: "Facebook", value: "FACEBOOK" },
                { label: "Instagram", value: "INSTAGRAM" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Páginas objetivo"
            name="targetPageIds"
            rules={[
              {
                required: true,
                type: "array",
                min: 1,
                message: "Debes seleccionar al menos una página",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Selecciona una o más páginas"
              options={sortedPages.map((page) => ({
                label: page.name,
                value: page.id,
              }))}
              optionFilterProp="label"
              showSearch
            />
          </Form.Item>

          <Form.Item
            label="Programar para"
            name="scheduledAt"
            extra="Opcional. Si envías fecha, el backend puede crear el post como programado."
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={(current) =>
                current ? current.isBefore(dayjs().startOf("day")) : false
              }
            />
          </Form.Item>

          <Divider>Opciones creativas</Divider>

          <Form.Item
            label="Template"
            name={["creativeOptions", "template"]}
            rules={[{ required: true, message: "Selecciona un template" }]}
          >
            <Select
              options={[
                { label: "Premium Auto", value: "PREMIUM_AUTO" },
                { label: "Social Brand", value: "SOCIAL_BRAND" },
                { label: "Minimal", value: "MINIMAL" },
              ]}
            />
          </Form.Item>

          <Space
            direction="vertical"
            size="middle"
            style={{ width: "100%", marginBottom: 16 }}
          >
            <Form.Item
              label="Usar branding"
              name={["creativeOptions", "useBranding"]}
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="Mostrar logo"
              name={["creativeOptions", "showLogo"]}
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="Mostrar CTA"
              name={["creativeOptions", "showCTA"]}
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="Mostrar redes sociales"
              name={["creativeOptions", "showSocialLinks"]}
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Switch />
            </Form.Item>
          </Space>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={generateMutation.isPending}
          >
            Generar con IA
          </Button>
        </Form>
      </Drawer>
    </>
  );
}