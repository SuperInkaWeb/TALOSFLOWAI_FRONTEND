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
import { useEffect, useMemo } from "react";

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
import { getApiErrorMessage } from "../../../shared/utils/error.utils";

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
const GENERATE_MESSAGE_KEY = "ai-generate-post";

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
    Form.useWatch(["creativeOptions", "template"], form) ??
    (canUsePremiumAi ? "PREMIUM_AUTO" : "SOCIAL_BRAND");

  const selectedImageMode =
    Form.useWatch(["creativeOptions", "imageGenerationMode"], form) ??
    (canUsePremiumImages ? "FINAL_AD_CREATIVE" : "EDITABLE_BASE");

  const isPremiumTemplate = PREMIUM_TEMPLATES.includes(selectedTemplate);
  const isPremiumImageMode = PREMIUM_IMAGE_MODES.includes(selectedImageMode);
  const isGenerating = generateMutation.isPending;

  useEffect(() => {
    if (!open) return;

    if (!canUsePremiumAi && selectedTemplate === "PREMIUM_AUTO") {
      form.setFieldValue(["creativeOptions", "template"], "SOCIAL_BRAND");
    }

    if (!canUsePremiumImages && selectedImageMode === "FINAL_AD_CREATIVE") {
      form.setFieldValue(
        ["creativeOptions", "imageGenerationMode"],
        "EDITABLE_BASE"
      );
    }
  }, [
    open,
    form,
    canUsePremiumAi,
    canUsePremiumImages,
    selectedTemplate,
    selectedImageMode,
  ]);

  const handleClose = () => {
    if (isGenerating) {
      messageApi.info("Espera a que termine la generación del post.");
      return;
    }

    onClose();
  };

  const handleFinish = async (values: FormValues) => {
    if (isGenerating) return;

    const isTryingMultiPage = values.targetPageIds.length > 1;
    const isTryingSchedule = !!values.scheduledAt;

    const template =
      values.creativeOptions.template ??
      (canUsePremiumAi ? "PREMIUM_AUTO" : "SOCIAL_BRAND");

    const imageGenerationMode =
      values.creativeOptions.imageGenerationMode ??
      (canUsePremiumImages ? "FINAL_AD_CREATIVE" : "EDITABLE_BASE");

    const isTryingPremiumTemplate = PREMIUM_TEMPLATES.includes(template);
    const isTryingPremiumImageMode =
      PREMIUM_IMAGE_MODES.includes(imageGenerationMode);

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
        template,
        imageGenerationMode,
      },
    };

    const regeneratePayload: RegeneratePostRequest = {
      idea: payload.idea,
      tone: payload.tone,
      platform: payload.platform,
    };

    try {
      messageApi.loading({
        key: GENERATE_MESSAGE_KEY,
        content: "Generando post con IA... Esto puede tardar unos segundos.",
        duration: 0,
      });

      const result = await generateMutation.mutateAsync(payload);

      messageApi.success({
        key: GENERATE_MESSAGE_KEY,
        content: "Post generado correctamente con IA.",
        duration: 3,
      });

      onSuccess(result, regeneratePayload);
      form.resetFields();
      onClose();
    } catch (error) {
      messageApi.error({
        key: GENERATE_MESSAGE_KEY,
        content: getApiErrorMessage(error, "No se pudo generar el post con IA."),
        duration: 5,
      });
    }
  };

  return (
    <>
      {contextHolder}

      <Drawer
        title="Generar post con IA"
        open={open}
        onClose={handleClose}
        width={isMobile ? "100%" : 560}
        destroyOnClose={!isGenerating}
        maskClosable={!isGenerating}
        keyboard={!isGenerating}
        closable={!isGenerating}
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
          disabled={isGenerating}
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
              template: canUsePremiumAi ? "PREMIUM_AUTO" : "SOCIAL_BRAND",
              imageGenerationMode: canUsePremiumImages
                ? "FINAL_AD_CREATIVE"
                : "EDITABLE_BASE",
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
              disabled={!canSchedule || isGenerating}
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
            loading={isGenerating}
            disabled={isGenerating || pages.length === 0}
          >
            {isGenerating ? "Generando..." : "Generar con IA"}
          </Button>
        </Form>
      </Drawer>
    </>
  );
}