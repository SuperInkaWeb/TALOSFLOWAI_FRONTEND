import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Progress,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import {
  CreditCardOutlined,
  LockOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../app/store/auth.store";
import { useThemeStore } from "../app/store/theme.store";
import { ChangePasswordModal } from "../features/users/components/change-password-modal";
import { useCurrentUser } from "../features/users/hooks/use-current-user";
import { useBillingUsage } from "../features/billing/hooks/use-billing-usage";

const { Title, Text } = Typography;

const roleMap: Record<string, string> = {
  OWNER: "Propietario",
  ADMIN: "Administrador",
  EDITOR: "Editor",
  VIEWER: "Visualizador",
  USER: "Usuario",
  SUPER_ADMIN: "Super administrador",
};

const roleColorMap: Record<string, string> = {
  OWNER: "blue",
  ADMIN: "purple",
  EDITOR: "green",
  VIEWER: "default",
  USER: "default",
  SUPER_ADMIN: "gold",
};

const formatOrganizationName = (value: string) => {
  if (!value) return "Organización";

  return value
    .replace(/^tenant[_-]?/i, "")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

function getSubscriptionTagColor(status?: string) {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "TRIALING":
      return "processing";
    case "PAST_DUE":
      return "warning";
    case "CANCELED":
      return "error";
    default:
      return "default";
  }
}

function getSubscriptionLabel(status?: string) {
  switch (status) {
    case "ACTIVE":
      return "Activa";
    case "TRIALING":
      return "Trial";
    case "PAST_DUE":
      return "Pago pendiente";
    case "CANCELED":
      return "Cancelada";
    default:
      return status || "Sin estado";
  }
}

function formatBillingWarning(code: string) {
  switch (code) {
    case "PLAN_LIMIT_REACHED":
      return "Has alcanzado el límite de publicaciones del plan.";
    case "LOW_POSTS_REMAINING":
      return "Te quedan pocas publicaciones disponibles.";
    case "AI_LIMIT_REACHED":
      return "Has alcanzado el límite de uso de IA.";
    case "LOW_AI_REMAINING":
      return "Te queda poco uso de IA disponible.";
    case "IMAGES_LIMIT_REACHED":
      return "Has alcanzado el límite de generación de imágenes.";
    case "LOW_IMAGES_REMAINING":
      return "Te quedan pocas generaciones de imágenes disponibles.";
    case "SOCIAL_ACCOUNTS_LIMIT_REACHED":
      return "Has alcanzado el límite de cuentas sociales del plan.";
    case "LOW_SOCIAL_ACCOUNTS_REMAINING":
      return "Te queda poco espacio para conectar más cuentas sociales.";
    case "SUBSCRIPTION_PAST_DUE":
      return "Tu suscripción tiene pagos pendientes.";
    case "SUBSCRIPTION_NOT_ACTIVE":
      return "Tu suscripción no está activa.";
    default:
      return code;
  }
}

type InfoCardProps = {
  label: string;
  value: string;
  isDark: boolean;
};

function InfoCard({ label, value, isDark }: InfoCardProps) {
  return (
    <Card
      size="small"
      style={{
        borderRadius: 16,
        background: isDark ? "#111827" : "#f8fafc",
        border: isDark
          ? "1px solid rgba(148, 163, 184, 0.12)"
          : "1px solid #e5e7eb",
        boxShadow: "none",
      }}
      bodyStyle={{ padding: 16 }}
    >
      <Space direction="vertical" size={4}>
        <Text type="secondary">{label}</Text>
        <Text
          strong
          style={{
            color: isDark ? "#ffffff" : "#0f172a",
            wordBreak: "break-word",
          }}
        >
          {value}
        </Text>
      </Space>
    </Card>
  );
}

type ActionCardProps = {
  title: string;
  description: string;
  buttonText: string;
  icon: React.ReactNode;
  onClick: () => void;
  isDark: boolean;
  buttonType?: "default" | "primary";
};

function ActionCard({
  title,
  description,
  buttonText,
  icon,
  onClick,
  isDark,
  buttonType = "default",
}: ActionCardProps) {
  return (
    <Card
      style={{
        borderRadius: 20,
        background: isDark ? "rgba(15, 23, 42, 0.75)" : "#ffffff",
        border: isDark
          ? "1px solid rgba(148, 163, 184, 0.12)"
          : "1px solid #eef2f7",
        boxShadow: isDark
          ? "0 10px 24px rgba(0,0,0,0.16)"
          : "0 10px 24px rgba(15, 23, 42, 0.04)",
      }}
      bodyStyle={{ padding: 24 }}
    >
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <Text
          strong
          style={{
            fontSize: 17,
            color: isDark ? "#ffffff" : "#0f172a",
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: isDark ? "#94a3b8" : "#64748b",
            lineHeight: 1.6,
          }}
        >
          {description}
        </Text>

        <Button
          type={buttonType}
          icon={icon}
          block
          size="large"
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </Space>
    </Card>
  );
}

export function AccountPage() {
  const navigate = useNavigate();
  const { mode } = useThemeStore();
  const isDark = mode === "dark";

  const currentUserId = useAuthStore((state) => state.userId);
  const schema = useAuthStore((state) => state.schema);
  const role = useAuthStore((state) => state.role);

  const [passwordOpen, setPasswordOpen] = useState(false);

  const {
    data: currentUser,
    isLoading,
    isError,
    error,
  } = useCurrentUser();

  const { data: billingUsage } = useBillingUsage();

  const displayRole = roleMap[role || "USER"] || "Usuario";
  const roleColor = roleColorMap[role || "USER"] || "default";
  const displayOrganization = formatOrganizationName(schema || "Organización");

  const initial =
    currentUser?.name?.trim()?.charAt(0)?.toUpperCase() ||
    currentUser?.email?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  if (!currentUserId) {
    return (
      <div style={{ padding: 16 }}>
        <Alert
          type="error"
          showIcon
          message="No se pudo identificar tu sesión"
          description="El token actual no contiene userId. Debes volver a iniciar sesión."
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ padding: 16 }}>
        <Card
          style={{
            borderRadius: 20,
            background: isDark ? "rgba(15, 23, 42, 0.75)" : "#ffffff",
            border: isDark
              ? "1px solid rgba(148, 163, 184, 0.12)"
              : "1px solid #eef2f7",
          }}
        >
          <Space>
            <Spin />
            <Text style={{ color: isDark ? "#e2e8f0" : "#334155" }}>
              Cargando datos de tu cuenta...
            </Text>
          </Space>
        </Card>
      </div>
    );
  }

  if (isError || !currentUser) {
    const backendMessage =
      (error as any)?.response?.data?.message ||
      (error as any)?.response?.data?.error ||
      "No fue posible obtener la información del usuario actual.";

    return (
      <div style={{ padding: 16 }}>
        <Alert
          type="error"
          showIcon
          message="No se pudo cargar tu cuenta"
          description={backendMessage}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        <div>
          <Title
            level={2}
            style={{
              margin: 0,
              color: isDark ? "#ffffff" : "#0f172a",
            }}
          >
            Mi cuenta
          </Title>

          <Text
            style={{
              color: isDark ? "#94a3b8" : "#64748b",
              fontSize: 15,
            }}
          >
            Administra tu perfil, seguridad y accesos rápidos.
          </Text>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={14}>
            <Card
              style={{
                borderRadius: 24,
                background: isDark ? "rgba(15, 23, 42, 0.75)" : "#ffffff",
                border: isDark
                  ? "1px solid rgba(148, 163, 184, 0.12)"
                  : "1px solid #eef2f7",
                boxShadow: isDark
                  ? "0 10px 24px rgba(0,0,0,0.16)"
                  : "0 10px 24px rgba(15, 23, 42, 0.04)",
              }}
              bodyStyle={{ padding: 24 }}
            >
              <Space direction="vertical" size={20} style={{ width: "100%" }}>
                <Space size={16} align="center" wrap>
                  <Avatar
                    size={76}
                    style={{
                      backgroundColor: isDark ? "#1e293b" : "#e2e8f0",
                      color: isDark ? "#e2e8f0" : "#334155",
                      fontSize: 30,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                    icon={!initial ? <UserOutlined /> : undefined}
                  >
                    {initial}
                  </Avatar>

                  <Space direction="vertical" size={2} style={{ minWidth: 0 }}>
                    <Text
                      strong
                      style={{
                        fontSize: 24,
                        color: isDark ? "#ffffff" : "#0f172a",
                        lineHeight: 1.1,
                      }}
                    >
                      {currentUser.name}
                    </Text>

                    <Text
                      style={{
                        color: isDark ? "#94a3b8" : "#64748b",
                        fontSize: 15,
                      }}
                    >
                      {currentUser.email}
                    </Text>

                    <Tag
                      color={roleColor}
                      style={{
                        width: "fit-content",
                        borderRadius: 999,
                        paddingInline: 10,
                        fontWeight: 600,
                        marginTop: 8,
                      }}
                    >
                      {displayRole}
                    </Tag>
                  </Space>
                </Space>

                <Divider
                  style={{
                    margin: 0,
                    borderColor: isDark
                      ? "rgba(148, 163, 184, 0.12)"
                      : "#eef2f7",
                  }}
                />

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <InfoCard
                      label="Nombre"
                      value={currentUser.name}
                      isDark={isDark}
                    />
                  </Col>

                  <Col xs={24} md={12}>
                    <InfoCard
                      label="Email"
                      value={currentUser.email}
                      isDark={isDark}
                    />
                  </Col>

                  <Col xs={24} md={12}>
                    <InfoCard
                      label="Rol"
                      value={displayRole}
                      isDark={isDark}
                    />
                  </Col>

                  <Col xs={24} md={12}>
                    <InfoCard
                      label="Organización"
                      value={displayOrganization}
                      isDark={isDark}
                    />
                  </Col>
                </Row>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={10}>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <ActionCard
                title="Seguridad"
                description="Cambia tu contraseña de acceso de forma segura y mantén protegida tu cuenta."
                buttonText="Cambiar contraseña"
                icon={<LockOutlined />}
                onClick={() => setPasswordOpen(true)}
                isDark={isDark}
                buttonType="primary"
              />

              <Card
                style={{
                  borderRadius: 20,
                  background: isDark ? "rgba(15, 23, 42, 0.75)" : "#ffffff",
                  border: isDark
                    ? "1px solid rgba(148, 163, 184, 0.12)"
                    : "1px solid #eef2f7",
                  boxShadow: isDark
                    ? "0 10px 24px rgba(0,0,0,0.16)"
                    : "0 10px 24px rgba(15, 23, 42, 0.04)",
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Space direction="vertical" size={14} style={{ width: "100%" }}>
                  <Space
                    align="center"
                    style={{ width: "100%", justifyContent: "space-between" }}
                    wrap
                  >
                    <Text
                      strong
                      style={{
                        fontSize: 17,
                        color: isDark ? "#ffffff" : "#0f172a",
                      }}
                    >
                      Suscripción
                    </Text>

                    {billingUsage?.subscriptionStatus && (
                      <Tag
                        color={getSubscriptionTagColor(
                          billingUsage.subscriptionStatus
                        )}
                        style={{ borderRadius: 999, fontWeight: 600 }}
                      >
                        {getSubscriptionLabel(billingUsage.subscriptionStatus)}
                      </Tag>
                    )}
                  </Space>

                  <div
                    style={{
                      padding: 14,
                      borderRadius: 16,
                      background: isDark ? "#111827" : "#f8fafc",
                      border: isDark
                        ? "1px solid rgba(148, 163, 184, 0.12)"
                        : "1px solid #e5e7eb",
                    }}
                  >
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">Plan actual</Text>
                      <Text
                        strong
                        style={{
                          fontSize: 18,
                          color: isDark ? "#ffffff" : "#0f172a",
                        }}
                      >
                        {billingUsage?.planName || "Sin plan"}
                      </Text>
                    </Space>
                  </div>

                  <div>
                    <Space
                      align="center"
                      style={{ width: "100%", justifyContent: "space-between" }}
                    >
                      <Text style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                        Posts
                      </Text>
                      <Text style={{ color: isDark ? "#e2e8f0" : "#334155" }}>
                        {billingUsage?.postsUsed ?? 0} /{" "}
                        {billingUsage?.postsLimit ?? 0}
                      </Text>
                    </Space>

                    <Progress
                      percent={billingUsage?.postsUsedPercent ?? 0}
                      size="small"
                      status={
                        (billingUsage?.postsUsedPercent ?? 0) >= 100
                          ? "exception"
                          : "normal"
                      }
                    />

                    <Text
                      style={{
                        color: isDark ? "#94a3b8" : "#64748b",
                        fontSize: 12,
                      }}
                    >
                      Restantes: {billingUsage?.postsRemaining ?? 0}
                    </Text>
                  </div>

                  <div>
                    <Space
                      align="center"
                      style={{ width: "100%", justifyContent: "space-between" }}
                    >
                      <Text style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                        IA
                      </Text>
                      <Text style={{ color: isDark ? "#e2e8f0" : "#334155" }}>
                        {billingUsage?.aiUsed ?? 0} /{" "}
                        {billingUsage?.aiLimit ?? 0}
                      </Text>
                    </Space>

                    <Progress
                      percent={billingUsage?.aiUsedPercent ?? 0}
                      size="small"
                      status={
                        (billingUsage?.aiUsedPercent ?? 0) >= 100
                          ? "exception"
                          : "normal"
                      }
                    />

                    <Text
                      style={{
                        color: isDark ? "#94a3b8" : "#64748b",
                        fontSize: 12,
                      }}
                    >
                      Restantes: {billingUsage?.aiRemaining ?? 0}
                    </Text>
                  </div>

                  {!!billingUsage?.warnings?.length && (
                    <Alert
                      type="warning"
                      showIcon
                      message="Atención en tu suscripción"
                      description={billingUsage.warnings
                        .map(formatBillingWarning)
                        .join(" ")}
                    />
                  )}

                  <Button
                    icon={<CreditCardOutlined />}
                    block
                    size="large"
                    onClick={() => navigate("/app/billing")}
                  >
                    Ir a Billing
                  </Button>
                </Space>
              </Card>

              <ActionCard
                title="Preferencias"
                description="Administra apariencia y futuras preferencias personales de la aplicación."
                buttonText="Ir a Ajustes"
                icon={<SettingOutlined />}
                onClick={() => navigate("/app/settings")}
                isDark={isDark}
              />
            </Space>
          </Col>
        </Row>
      </Space>

      <ChangePasswordModal
        open={passwordOpen}
        user={currentUser}
        onClose={() => setPasswordOpen(false)}
      />
    </div>
  );
}