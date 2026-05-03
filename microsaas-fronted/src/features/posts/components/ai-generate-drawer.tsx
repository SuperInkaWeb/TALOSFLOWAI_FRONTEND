import {
  Alert,
  Button,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Grid,
  Input,
  Select,
  Space,
  Switch,
  Typography,
  message,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";
import { useGeneratePost } from "../hooks/use-generate-post";
import { usePlanAccess } from "../../billing/hooks/use-plan-access";
import type {
  AiPlatform,
  AiTemplateValue,
  AiTone,
  GenerateFullPostRequest,
  GenerateFullPostResponse,
  ImageGenerationMode,
  RegeneratePostRequest,
} from "../../../types/ai.types";
import type { PostPageOption } from "./post-form-drawer";

const { Text } = Typography;
const { useBreakpoint } = Grid;

type FormValues = {
  idea: string;
  tone: AiTone;
  platform: AiPlatform;
  targetPageIds: number[];
  scheduledAt?: Dayjs | null;
  creativeOptions: {
    useBranding: boolean;
    showLogo: boolean;
    showCTA: boolean;
    showSocialLinks: boolean;
    template?: AiTemplateValue | null;
    imageGenerationMode?: ImageGenerationMode;
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

const TEMPLATE_OPTIONS: Array<{ label: string; value: AiTemplateValue }> = [
  { label: "Automático premium", value: "PREMIUM_AUTO" },
  { label: "Marca social", value: "SOCIAL_BRAND" },
  { label: "Fuerte", value: "BOLD" },
  { label: "Dividido", value: "SPLIT" },
  { label: "Mínimo", value: "MINIMAL" },
];

const IMAGE_MODE_OPTIONS: Array<{ label: string; value: ImageGenerationMode }> =
  [
    { label: "Base editable", value: "EDITABLE_BASE" },
    { label: "Anuncio final IA", value: "FINAL_AD_CREATIVE" },
  ];

const TONE_OPTIONS: Array<{ label: string; value: AiTone }> = [
  { label: "Profesional", value: "PROFESIONAL" },
  { label: "Emocional", value: "EMOCIONAL" },
  { label: "Divertido", value: "DIVERTIDO" },
  { label: "Persuasivo", value: "PERSUASIVO" },
  { label: "Cercano", value: "CERCANO" },
];

const PLATFORM_OPTIONS: Array<{ label: string; value: AiPlatform }> = [
  { label: "Facebook", value: "FACEBOOK" },
  { label: "Instagram", value: "INSTAGRAM" },
];

const PREMIUM_TEMPLATES: AiTemplateValue[] = ["PREMIUM_AUTO"];
const PREMIUM_IMAGE_MODES: ImageGenerationMode[] = ["FINAL_AD_CREATIVE"];

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
    return data?.message || data?.error || "No se pudo generar el post con IA";
  }

  if (error instanceof Error) return error.message;

  return "No se pudo generar el post con IA";
}

export function AiGenerateDrawer({
  open,
  onClose,
  onSuccess,
  pages,
}: Props) {
  const [form] = Form.useForm<FormValues>();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const generateMutation = useGeneratePost();
  const [messageApi, contextHolder] = message.useMessage();

  const {
    canSchedule,
    canUseMultiPage,
    canUsePremiumAi,
    canUsePremiumImages,
  } = usePlanAccess();

  const sortedPages = useMemo(
    () => [...pages].sort((a, b) => a.name.localeCompare(b.name)),
    [pages]
  );

  const selectedPageIds = Form.useWatch("targetPageIds", form) ?? [];
  const selectedTemplate =
    Form.useWatch(["creativeOptions", "template"], form) ?? "PREMIUM_AUTO";
  const selectedImageMode =
    Form.useWatch(["creativeOptions", "imageGenerationMode"], form) ??
    "FINAL_AD_CREATIVE";

  const isPremiumTemplate = PREMIUM_TEMPLATES.includes(selectedTemplate);
  const isPremiumImageMode = PREMIUM_IMAGE_MODES.includes(selectedImageMode);

  const handleFinish = async (values: FormValues) => {
    const isTryingMultiPage = values.targetPageIds.length > 1;
    const isTryingSchedule = !!values.scheduledAt;
    const isTryingPremiumTemplate =
      !!values.creativeOptions.template &&
      PREMIUM_TEMPLATES.includes(values.creativeOptions.template);
    const isTryingPremiumImageMode =
      !!values.creativeOptions.imageGenerationMode &&
      PREMIUM_IMAGE_MODES.includes(values.creativeOptions.imageGenerationMode);

    if (isTryingSchedule && !canSchedule) {
      messageApi.warning("Tu plan actual no permite programar publicaciones.");
      return;
    }

    if (isTryingMultiPage && !canUseMultiPage) {
      messageApi.warning(
        "Tu plan actual no permite publicar en varias páginas al mismo tiempo."
      );
      return;
    }

    if (isTryingPremiumTemplate && !canUsePremiumAi) {
      messageApi.warning("Tu plan actual no permite templates premium.");
      return;
    }

    if (isTryingPremiumImageMode && !canUsePremiumImages) {
      messageApi.warning("Tu plan actual no permite imágenes premium.");
      return;
    }

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
        template: values.creativeOptions.template ?? "PREMIUM_AUTO",
        imageGenerationMode:
          values.creativeOptions.imageGenerationMode ?? "FINAL_AD_CREATIVE",
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
    } catch (error) {
      messageApi.error(getErrorMessage(error));
    }
  };

  return (
    <>
      {contextHolder}

      <Drawer
        title="Generar post con IA"
        open={open}
        onClose={onClose}
        width={isMobile ? "100%" : 560}
        destroyOnClose
        styles={{
          body: {
            padding: isMobile ? 16 : 24,
          },
        }}
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
              showCTA: true,
              showSocialLinks: true,
              template: "PREMIUM_AUTO",
              imageGenerationMode: "FINAL_AD_CREATIVE",
            },
          }}
        >
          {!canUseMultiPage && (
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
              message="Tu plan actual permite una sola página por generación."
            />
          )}

          {!canSchedule && (
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
              message="La programación de publicaciones no está disponible en tu plan actual."
            />
          )}

          {(!canUsePremiumAi || !canUsePremiumImages) && (
            <Alert
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
              message="Algunas opciones creativas premium están limitadas por tu plan."
            />
          )}

          <Form.Item
            label="Idea"
            name="idea"
            rules={[
              { required: true, message: "La idea es obligatoria" },
              { min: 5, message: "Escribe una idea más clara" },
            ]}
          >
            <Input.TextArea
              rows={isMobile ? 4 : 5}
              placeholder="Ej: Promocionar hamburguesas 2x1 para MrChucks en Cuenca Ricaurte"
              maxLength={1200}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="Tono"
            name="tone"
            rules={[{ required: true, message: "Selecciona un tono" }]}
          >
            <Select options={TONE_OPTIONS} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Plataforma"
            name="platform"
            rules={[{ required: true, message: "Selecciona una plataforma" }]}
          >
            <Select options={PLATFORM_OPTIONS} style={{ width: "100%" }} />
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
              {
                validator: async (_, value: number[] | undefined) => {
                  const selected = value ?? [];
                  if (selected.length <= 1) return;
                  if (!canUseMultiPage) {
                    throw new Error(
                      "Tu plan actual no permite seleccionar varias páginas."
                    );
                  }
                },
              },
            ]}
            extra={
              !canUseMultiPage
                ? "Tu plan actual permite seleccionar solo una página."
                : "Puedes seleccionar una o más páginas."
            }
          >
            <Select
              mode="multiple"
              maxCount={canUseMultiPage ? undefined : 1}
              placeholder="Selecciona una o más páginas"
              options={sortedPages.map((page) => ({
                label: page.name,
                value: page.id,
              }))}
              optionFilterProp="label"
              showSearch
              style={{ width: "100%" }}
              maxTagCount="responsive"
            />
          </Form.Item>

          <Form.Item
            label="Programar para"
            name="scheduledAt"
            extra={
              canSchedule
                ? "Opcional. Si envías fecha, el backend puede crear el post como programado."
                : "Tu plan actual no permite programación."
            }
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              format="YYYY-MM-DD HH:mm:ss"
              disabled={!canSchedule}
              disabledDate={(current) =>
                current ? current.isBefore(dayjs().startOf("day")) : false
              }
            />
          </Form.Item>

          <Divider>Opciones creativas</Divider>

          <Form.Item
            label="Template"
            name={["creativeOptions", "template"]}
            rules={[
              { required: true, message: "Selecciona un template" },
              {
                validator: async (_, value: AiTemplateValue | undefined) => {
                  if (!value) return;
                  if (PREMIUM_TEMPLATES.includes(value) && !canUsePremiumAi) {
                    throw new Error(
                      "Tu plan actual no permite templates premium."
                    );
                  }
                },
              },
            ]}
            extra={
              <Text type="secondary">
                {canUsePremiumAi
                  ? "Usa Automático premium para mantener el flujo premium del backend."
                  : "Los templates premium no están disponibles en tu plan actual."}
              </Text>
            }
          >
            <Select
              style={{ width: "100%" }}
              options={TEMPLATE_OPTIONS.map((option) => ({
                ...option,
                disabled:
                  PREMIUM_TEMPLATES.includes(option.value) && !canUsePremiumAi,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Modo de generación"
            name={["creativeOptions", "imageGenerationMode"]}
            rules={[
              { required: true, message: "Selecciona un modo" },
              {
                validator: async (
                  _,
                  value: ImageGenerationMode | undefined
                ) => {
                  if (!value) return;
                  if (
                    PREMIUM_IMAGE_MODES.includes(value) &&
                    !canUsePremiumImages
                  ) {
                    throw new Error(
                      "Tu plan actual no permite modos premium de generación de imagen."
                    );
                  }
                },
              },
            ]}
            extra={
              <Text type="secondary">
                {canUsePremiumImages
                  ? "Usa Anuncio final IA para que la IA genere una pieza casi completa y el backend solo remate branding."
                  : "Los modos premium de imagen no están disponibles en tu plan actual."}
              </Text>
            }
          >
            <Select
              style={{ width: "100%" }}
              options={IMAGE_MODE_OPTIONS.map((option) => ({
                ...option,
                disabled:
                  PREMIUM_IMAGE_MODES.includes(option.value) &&
                  !canUsePremiumImages,
              }))}
            />
          </Form.Item>

          {(selectedPageIds.length > 1 && !canUseMultiPage) ||
          (isPremiumTemplate && !canUsePremiumAi) ||
          (isPremiumImageMode && !canUsePremiumImages) ? (
            <Alert
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
              message="Hay opciones seleccionadas que no están disponibles en tu plan."
            />
          ) : null}

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
            disabled={pages.length === 0}
          >
            Generar con IA
          </Button>
        </Form>
      </Drawer>
    </>
  );
}