import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  Progress,
  Row,
  Skeleton,
  Space,
  Switch,
  Tag,
  Typography,
  ColorPicker,
} from "antd";
import type { Color } from "antd/es/color-picker";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  InfoCircleOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import { useEffect, useMemo } from "react";
import { BrandImageUpload } from "../features/branding/components/brand-image-upload";
import { useBrandProfile } from "../features/branding/hooks/use-brand-profile";
import { useUpdateBrandProfile } from "../features/branding/hooks/use-update-brand-profile";
import type { UpsertBrandProfileRequest } from "../types/brand.types";
import { BrandSocialLinksSection } from "../features/branding/components/brand-social-links-section";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

type BrandingFormValues = UpsertBrandProfileRequest;

const DEFAULT_VALUES: BrandingFormValues = {
  brandName: "",
  legalName: "",
  businessDescription: "",
  logoUrl: "",
  logoDarkUrl: "",
  logoLightUrl: "",
  iconLogoUrl: "",
  primaryColor: "#1677FF",
  secondaryColor: "#111827",
  accentColor: "#22C55E",
  backgroundColor: "#FFFFFF",
  textColor: "#111111",
  defaultCtaText: "Contáctanos hoy",
  defaultCtaEnabled: false,
  showLogoByDefault: true,
  showCtaByDefault: true,
  showContactByDefault: true,
  showSocialsByDefault: true,
  defaultTemplate: "PREMIUM_AUTO",
  isActive: true,
};

function normalizeNullableString(value?: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizeHex(value?: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized.toUpperCase() : null;
}

function getColorValue(color?: string | null, fallback?: string) {
  return color?.trim() || fallback || "#1677FF";
}

function CompletionItem({
  label,
  completed,
}: {
  label: string;
  completed: boolean;
}) {
  return (
    <Flex align="center" gap={8}>
      {completed ? (
        <CheckCircleFilled style={{ color: "#52c41a" }} />
      ) : (
        <CloseCircleFilled style={{ color: "#ff4d4f" }} />
      )}
      <Text>{label}</Text>
    </Flex>
  );
}

function ColorBadge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Flex
      align="center"
      gap={8}
      style={{
        padding: "6px 10px",
        border: "1px solid #f0f0f0",
        borderRadius: 999,
        background: "#fff",
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: value,
          border: "1px solid rgba(0,0,0,0.12)",
          flexShrink: 0,
        }}
      />
      <Text style={{ fontSize: 12 }}>
        {label}: {value}
      </Text>
    </Flex>
  );
}

function PreviewLogo({
  brandName,
  logoUrl,
  primaryColor,
  accentColor,
}: {
  brandName: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
}) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="Logo de marca"
        style={{
          width: 64,
          height: 64,
          objectFit: "cover",
          borderRadius: 16,
          border: "1px solid rgba(0,0,0,0.08)",
          background: "#fff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: 16,
        display: "grid",
        placeItems: "center",
        background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
        color: "#fff",
        fontWeight: 800,
        fontSize: 24,
        boxShadow: `0 10px 24px ${primaryColor}33`,
      }}
    >
      {(brandName || "M").charAt(0).toUpperCase()}
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 12,
        padding: 12,
        background: "#fff",
      }}
    >
      <div style={{ fontSize: 12, color: "#8c8c8c", marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 600, fontSize: 13 }}>{value}</div>
    </div>
  );
}

function ColorField({
  form,
  name,
  fallback,
}: {
  form: any;
  name: keyof BrandingFormValues;
  fallback: string;
}) {
  const value = Form.useWatch(name as string, form) || fallback;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        border: "1px solid #d9d9d9",
        borderRadius: 10,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <div
        style={{
          width: 52,
          minWidth: 52,
          height: 42,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRight: "1px solid #f0f0f0",
          background: "#fafafa",
        }}
      >
        <ColorPicker
          value={value}
          onChange={(color: Color) => {
            form.setFieldValue(name, color.toHexString().toUpperCase());
          }}
          showText={false}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: value,
              border: "1px solid rgba(0,0,0,0.12)",
              cursor: "pointer",
            }}
          />
        </ColorPicker>
      </div>

      <Input
        bordered={false}
        value={value}
        onChange={(e) => form.setFieldValue(name, e.target.value.toUpperCase())}
        placeholder={fallback}
        style={{
          flex: 1,
          height: 42,
          paddingInline: 12,
          boxShadow: "none",
        }}
      />
    </div>
  );
}

export function BrandingPage() {
  const [form] = Form.useForm<BrandingFormValues>();
  const watchedValues = Form.useWatch([], form);

  const { data, isLoading, isError } = useBrandProfile();
  const updateMutation = useUpdateBrandProfile();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        brandName: data.brandName ?? "",
        legalName: data.legalName ?? "",
        businessDescription: data.businessDescription ?? "",
        logoUrl: data.logoUrl ?? "",
        logoDarkUrl: data.logoDarkUrl ?? "",
        logoLightUrl: data.logoLightUrl ?? "",
        iconLogoUrl: data.iconLogoUrl ?? "",
        primaryColor: data.primaryColor ?? "#1677FF",
        secondaryColor: data.secondaryColor ?? "#111827",
        accentColor: data.accentColor ?? "#22C55E",
        backgroundColor: data.backgroundColor ?? "#FFFFFF",
        textColor: data.textColor ?? "#111111",
        defaultCtaText: data.defaultCtaText ?? "Contáctanos hoy",
        defaultCtaEnabled: data.defaultCtaEnabled,
        showLogoByDefault: data.showLogoByDefault,
        showCtaByDefault: data.showCtaByDefault,
        showContactByDefault: data.showContactByDefault,
        showSocialsByDefault: data.showSocialsByDefault,
        defaultTemplate: data.defaultTemplate ?? "PREMIUM_AUTO",
        isActive: data.isActive,
      });
    } else {
      form.setFieldsValue(DEFAULT_VALUES);
    }
  }, [data, form]);

  const brandName = watchedValues?.brandName?.trim() || "";
  const logoUrl = watchedValues?.logoUrl?.trim() || "";
  const primaryColor = getColorValue(watchedValues?.primaryColor, "#1677FF");
  const secondaryColor = getColorValue(watchedValues?.secondaryColor, "#111827");
  const accentColor = getColorValue(watchedValues?.accentColor, "#22C55E");
  const backgroundColor = getColorValue(watchedValues?.backgroundColor, "#FFFFFF");
  const textColor = getColorValue(watchedValues?.textColor, "#111111");
  const businessDescription =
    watchedValues?.businessDescription?.trim() ||
    "Describe tu negocio, propuesta de valor y estilo de comunicación para que tu marca se vea consistente en IA, posts y diseños.";
  const defaultCtaText =
    watchedValues?.defaultCtaText?.trim() || "Contáctanos hoy";
  const defaultCtaEnabled = watchedValues?.defaultCtaEnabled ?? false;
  const legalName = watchedValues?.legalName?.trim() || "Nombre legal o comercial";
  const isProfileActive = watchedValues?.isActive ?? true;

  const completion = useMemo(() => {
    const items = [
      { key: "brandName", label: "Nombre de marca", completed: !!brandName },
      { key: "logoUrl", label: "Logo principal", completed: !!logoUrl },
      {
        key: "primaryColor",
        label: "Color primario",
        completed: !!watchedValues?.primaryColor?.trim(),
      },
      {
        key: "businessDescription",
        label: "Descripción del negocio",
        completed: !!watchedValues?.businessDescription?.trim(),
      },
      {
        key: "defaultCtaText",
        label: "CTA por defecto",
        completed: !!watchedValues?.defaultCtaText?.trim(),
      },
    ];

    const completedCount = items.filter((item) => item.completed).length;
    const percent = Math.round((completedCount / items.length) * 100);

    return { items, percent };
  }, [
    brandName,
    logoUrl,
    watchedValues?.primaryColor,
    watchedValues?.businessDescription,
    watchedValues?.defaultCtaText,
  ]);

  const onFinish = (values: BrandingFormValues) => {
    const payload: UpsertBrandProfileRequest = {
      brandName: values.brandName.trim(),
      legalName: normalizeNullableString(values.legalName),
      businessDescription: normalizeNullableString(values.businessDescription),
      logoUrl: normalizeNullableString(values.logoUrl),
      logoDarkUrl: normalizeNullableString(values.logoDarkUrl),
      logoLightUrl: normalizeNullableString(values.logoLightUrl),
      iconLogoUrl: normalizeNullableString(values.iconLogoUrl),
      primaryColor: normalizeHex(values.primaryColor),
      secondaryColor: normalizeHex(values.secondaryColor),
      accentColor: normalizeHex(values.accentColor),
      backgroundColor: normalizeHex(values.backgroundColor),
      textColor: normalizeHex(values.textColor),
      defaultCtaText: normalizeNullableString(values.defaultCtaText),
      defaultCtaEnabled: values.defaultCtaEnabled,
      showLogoByDefault: values.showLogoByDefault,
      showCtaByDefault: values.showCtaByDefault,
      showContactByDefault: values.showContactByDefault,
      showSocialsByDefault: values.showSocialsByDefault,
      defaultTemplate: normalizeNullableString(values.defaultTemplate),
      isActive: values.isActive,
    };

    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 14 }} />;
  }

  const statusBorder = data?.isCompleted
    ? "1px solid rgba(82,196,26,0.35)"
    : "1px solid rgba(250,173,20,0.35)";

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <div>
        <Title level={2} style={{ marginBottom: 0 }}>
          Branding
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Configura la identidad visual y comercial de tu marca para usarla en IA,
          diseños y publicaciones.
        </Paragraph>
      </div>

      {isError && (
        <Alert
          type="error"
          showIcon
          message="No se pudo cargar el branding actual"
        />
      )}

      <Row gutter={[16, 16]} align="top">
        <Col xs={24} xl={16}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Card
              style={{ border: statusBorder }}
              extra={
                data?.isCompleted ? (
                  <Tag color="green">Completo</Tag>
                ) : (
                  <Tag color="gold">Incompleto</Tag>
                )
              }
            >
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <div>
                  <Text strong>Progreso del branding</Text>
                  <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                    El backend lo marca como completo cuando tiene nombre de marca,
                    logo principal y color primario.
                  </Paragraph>
                </div>

                <Progress percent={completion.percent} />

                <Row gutter={[12, 12]}>
                  {completion.items.map((item) => (
                    <Col xs={24} md={12} key={item.key}>
                      <CompletionItem label={item.label} completed={item.completed} />
                    </Col>
                  ))}
                </Row>
              </Space>
            </Card>

            <Card title="Perfil de marca">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={DEFAULT_VALUES}
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Nombre de marca"
                      name="brandName"
                      rules={[
                        {
                          required: true,
                          message: "El nombre de marca es obligatorio",
                        },
                      ]}
                    >
                      <Input placeholder="Qoribex" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Nombre legal" name="legalName">
                      <Input placeholder="Qoribex S.A.S." />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Descripción del negocio" name="businessDescription">
                  <TextArea
                    rows={4}
                    placeholder="Describe tu negocio, tu propuesta de valor y el tono de tu marca"
                    maxLength={500}
                    showCount
                  />
                </Form.Item>

                <Divider />

                <Title level={5}>Identidad visual</Title>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item name="logoUrl" noStyle>
                      <Input type="hidden" />
                    </Form.Item>

                    <Form.Item shouldUpdate noStyle>
                      {() => (
                        <BrandImageUpload
                          label="Logo principal"
                          value={form.getFieldValue("logoUrl")}
                          onChange={(value) => form.setFieldValue("logoUrl", value)}
                          onClear={() => form.setFieldValue("logoUrl", "")}
                        />
                      )}
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item name="logoDarkUrl" noStyle>
                      <Input type="hidden" />
                    </Form.Item>

                    <Form.Item shouldUpdate noStyle>
                      {() => (
                        <BrandImageUpload
                          label="Logo oscuro"
                          value={form.getFieldValue("logoDarkUrl")}
                          onChange={(value) => form.setFieldValue("logoDarkUrl", value)}
                          onClear={() => form.setFieldValue("logoDarkUrl", "")}
                        />
                      )}
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item name="logoLightUrl" noStyle>
                      <Input type="hidden" />
                    </Form.Item>

                    <Form.Item shouldUpdate noStyle>
                      {() => (
                        <BrandImageUpload
                          label="Logo claro"
                          value={form.getFieldValue("logoLightUrl")}
                          onChange={(value) => form.setFieldValue("logoLightUrl", value)}
                          onClear={() => form.setFieldValue("logoLightUrl", "")}
                        />
                      )}
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item name="iconLogoUrl" noStyle>
                      <Input type="hidden" />
                    </Form.Item>

                    <Form.Item shouldUpdate noStyle>
                      {() => (
                        <BrandImageUpload
                          label="Ícono"
                          value={form.getFieldValue("iconLogoUrl")}
                          onChange={(value) => form.setFieldValue("iconLogoUrl", value)}
                          onClear={() => form.setFieldValue("iconLogoUrl", "")}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Divider />

                <BrandSocialLinksSection/>


                <Title level={5}>Paleta de marca</Title>

                <Card
                  size="small"
                  style={{
                    marginBottom: 16,
                    borderRadius: 12,
                    background: "#fafafa",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <Flex gap={8} wrap>
                    <ColorBadge label="Primary" value={primaryColor} />
                    <ColorBadge label="Secondary" value={secondaryColor} />
                    <ColorBadge label="Accent" value={accentColor} />
                    <ColorBadge label="Background" value={backgroundColor} />
                    <ColorBadge label="Text" value={textColor} />
                  </Flex>
                </Card>

                <Row gutter={[16, 0]}>
                  <Col xs={24} md={12} xl={8}>
                    <Form.Item
                      label="Color primario"
                      name="primaryColor"
                      rules={[
                        {
                          pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                          message: "Ingresa un color HEX válido",
                        },
                      ]}
                    >
                      <ColorField form={form} name="primaryColor" fallback="#1677FF" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} xl={8}>
                    <Form.Item
                      label="Color secundario"
                      name="secondaryColor"
                      rules={[
                        {
                          pattern: /^$|^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                          message: "Ingresa un color HEX válido",
                        },
                      ]}
                    >
                      <ColorField form={form} name="secondaryColor" fallback="#111827" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} xl={8}>
                    <Form.Item
                      label="Color acento"
                      name="accentColor"
                      rules={[
                        {
                          pattern: /^$|^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                          message: "Ingresa un color HEX válido",
                        },
                      ]}
                    >
                      <ColorField form={form} name="accentColor" fallback="#22C55E" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} xl={8}>
                    <Form.Item
                      label="Color fondo"
                      name="backgroundColor"
                      rules={[
                        {
                          pattern: /^$|^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                          message: "Ingresa un color HEX válido",
                        },
                      ]}
                    >
                      <ColorField form={form} name="backgroundColor" fallback="#FFFFFF" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} xl={8}>
                    <Form.Item
                      label="Color texto"
                      name="textColor"
                      rules={[
                        {
                          pattern: /^$|^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                          message: "Ingresa un color HEX válido",
                        },
                      ]}
                    >
                      <ColorField form={form} name="textColor" fallback="#111111" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12} xl={8}>
                    <Form.Item label="Template por defecto" name="defaultTemplate">
                      <Input placeholder="PREMIUM_AUTO" />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                <Title level={5}>CTA y comportamiento por defecto</Title>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item label="CTA por defecto" name="defaultCtaText">
                      <Input placeholder="Contáctanos hoy" maxLength={180} showCount />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={8}>
                    <Card size="small" bordered>
                      <Flex justify="space-between" align="center">
                        <div>
                          <Text strong>CTA habilitado</Text>
                          <div>
                            <Text type="secondary">Activa el botón principal</Text>
                          </div>
                        </div>
                        <Form.Item
                          name="defaultCtaEnabled"
                          valuePropName="checked"
                          noStyle
                        >
                          <Switch />
                        </Form.Item>
                      </Flex>
                    </Card>
                  </Col>

                  <Col xs={24} md={8}>
                    <Card size="small" bordered>
                      <Flex justify="space-between" align="center">
                        <div>
                          <Text strong>Mostrar logo</Text>
                          <div>
                            <Text type="secondary">Visible por defecto</Text>
                          </div>
                        </div>
                        <Form.Item
                          name="showLogoByDefault"
                          valuePropName="checked"
                          noStyle
                        >
                          <Switch />
                        </Form.Item>
                      </Flex>
                    </Card>
                  </Col>

                  <Col xs={24} md={8}>
                    <Card size="small" bordered>
                      <Flex justify="space-between" align="center">
                        <div>
                          <Text strong>Mostrar CTA</Text>
                          <div>
                            <Text type="secondary">En piezas generadas</Text>
                          </div>
                        </div>
                        <Form.Item
                          name="showCtaByDefault"
                          valuePropName="checked"
                          noStyle
                        >
                          <Switch />
                        </Form.Item>
                      </Flex>
                    </Card>
                  </Col>

                  <Col xs={24} md={8}>
                    <Card size="small" bordered>
                      <Flex justify="space-between" align="center">
                        <div>
                          <Text strong>Mostrar contacto</Text>
                          <div>
                            <Text type="secondary">Datos de contacto</Text>
                          </div>
                        </div>
                        <Form.Item
                          name="showContactByDefault"
                          valuePropName="checked"
                          noStyle
                        >
                          <Switch />
                        </Form.Item>
                      </Flex>
                    </Card>
                  </Col>

                  <Col xs={24} md={8}>
                    <Card size="small" bordered>
                      <Flex justify="space-between" align="center">
                        <div>
                          <Text strong>Mostrar redes</Text>
                          <div>
                            <Text type="secondary">En diseños y footer</Text>
                          </div>
                        </div>
                        <Form.Item
                          name="showSocialsByDefault"
                          valuePropName="checked"
                          noStyle
                        >
                          <Switch />
                        </Form.Item>
                      </Flex>
                    </Card>
                  </Col>

                  <Col xs={24} md={8}>
                    <Card size="small" bordered>
                      <Flex justify="space-between" align="center">
                        <div>
                          <Text strong>Perfil activo</Text>
                          <div>
                            <Text type="secondary">Branding habilitado</Text>
                          </div>
                        </div>
                        <Form.Item name="isActive" valuePropName="checked" noStyle>
                          <Switch />
                        </Form.Item>
                      </Flex>
                    </Card>
                  </Col>
                </Row>

                <Divider />

                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={updateMutation.isPending}
                  >
                    Guardar branding
                  </Button>
                  <Button onClick={() => form.resetFields()}>Restablecer</Button>
                </Space>
              </Form>
            </Card>
          </Space>
        </Col>

        <Col xs={24} xl={8}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Card title="Vista previa de marca" style={{ border: statusBorder }}>
              <div
                style={{
                  background: `linear-gradient(180deg, ${backgroundColor}, #ffffff)`,
                  border: `1px solid ${secondaryColor}22`,
                  borderRadius: 18,
                  padding: 22,
                  minHeight: 380,
                }}
              >
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <Flex align="center" gap={14}>
                    <PreviewLogo
                      brandName={brandName}
                      logoUrl={logoUrl}
                      primaryColor={primaryColor}
                      accentColor={accentColor}
                    />

                    <div>
                      <div
                        style={{
                          color: textColor,
                          fontWeight: 800,
                          fontSize: 22,
                          lineHeight: 1.1,
                        }}
                      >
                        {brandName || "Tu marca"}
                      </div>
                      <div
                        style={{
                          color: secondaryColor,
                          fontSize: 13,
                          marginTop: 4,
                        }}
                      >
                        {legalName}
                      </div>
                    </div>
                  </Flex>

                  <div
                    style={{
                      borderRadius: 16,
                      padding: 18,
                      background: `linear-gradient(135deg, ${primaryColor}14, ${accentColor}14)`,
                      border: `1px solid ${primaryColor}22`,
                    }}
                  >
                    <Flex align="center" gap={8} style={{ marginBottom: 10 }}>
                      <ThunderboltFilled style={{ color: accentColor }} />
                      <Text strong style={{ color: primaryColor, fontSize: 16 }}>
                        Promoción destacada
                      </Text>
                    </Flex>

                    <div
                      style={{
                        color: textColor,
                        fontSize: 14,
                        lineHeight: 1.7,
                      }}
                    >
                      {businessDescription}
                    </div>
                  </div>

                  <Flex gap={8} wrap>
                    <ColorBadge label="Primary" value={primaryColor} />
                    <ColorBadge label="Secondary" value={secondaryColor} />
                    <ColorBadge label="Accent" value={accentColor} />
                  </Flex>

                  {defaultCtaEnabled ? (
                    <Button
                      type="primary"
                      size="large"
                      style={{
                        width: "100%",
                        height: 46,
                        background: primaryColor,
                        borderColor: primaryColor,
                        borderRadius: 12,
                        fontWeight: 700,
                        boxShadow: `0 10px 24px ${primaryColor}33`,
                      }}
                    >
                      {defaultCtaText}
                    </Button>
                  ) : (
                    <Alert
                      type="info"
                      showIcon
                      message="El CTA por defecto está desactivado"
                    />
                  )}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                    }}
                  >
                    <MiniStat
                      label="Template"
                      value={watchedValues?.defaultTemplate || "No definido"}
                    />
                    <MiniStat
                      label="Estado"
                      value={isProfileActive ? "Activo" : "Inactivo"}
                    />
                  </div>
                </Space>
              </div>
            </Card>

            <Card title="Resumen rápido">
              <Space direction="vertical" size={10} style={{ width: "100%" }}>
                <Flex justify="space-between">
                  <Text type="secondary">Estado del perfil</Text>
                  {data?.isCompleted ? (
                    <Tag color="green">Completo</Tag>
                  ) : (
                    <Tag color="gold">En progreso</Tag>
                  )}
                </Flex>

                <Flex justify="space-between">
                  <Text type="secondary">Marca</Text>
                  <Text strong>{brandName || "Sin definir"}</Text>
                </Flex>

                <Flex justify="space-between">
                  <Text type="secondary">Template</Text>
                  <Text>{watchedValues?.defaultTemplate || "No definido"}</Text>
                </Flex>

                <Flex justify="space-between">
                  <Text type="secondary">CTA</Text>
                  <Text>{defaultCtaEnabled ? "Activo" : "Inactivo"}</Text>
                </Flex>

                <Flex justify="space-between">
                  <Text type="secondary">Perfil</Text>
                  <Text>{isProfileActive ? "Activo" : "Inactivo"}</Text>
                </Flex>
              </Space>
            </Card>

            <Card title="Tips de branding">
              <Space direction="vertical" size={10}>
                <Flex align="start" gap={8}>
                  <InfoCircleOutlined style={{ color: primaryColor, marginTop: 3 }} />
                  <Text>Usa un logo visible y fácil de reconocer.</Text>
                </Flex>
                <Flex align="start" gap={8}>
                  <InfoCircleOutlined style={{ color: primaryColor, marginTop: 3 }} />
                  <Text>Define un CTA corto y directo para mejorar conversiones.</Text>
                </Flex>
                <Flex align="start" gap={8}>
                  <InfoCircleOutlined style={{ color: primaryColor, marginTop: 3 }} />
                  <Text>Mantén una paleta consistente para reforzar tu marca.</Text>
                </Flex>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </Space>
  );
}