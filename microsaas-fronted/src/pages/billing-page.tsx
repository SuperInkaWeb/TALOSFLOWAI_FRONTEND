import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Progress,
  Result,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
  message,
  Divider,
} from "antd";
import {
  CheckOutlined,
  CreditCardOutlined,
  RocketOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { AxiosError } from "axios";

import { useAuthStore } from "../app/store/auth.store";
import { useBillingPlans } from "../features/billing/hooks/use-billing-plans";
import { useBillingSubscription } from "../features/billing/hooks/use-billing-subscription";
import { useBillingUsage } from "../features/billing/hooks/use-billing-usage";
import { useCreateCheckoutSession } from "../features/billing/hooks/use-create-checkout-session";
import { useCustomerPortal } from "../features/billing/hooks/use-customer-portal";
import {
  canUseCustomerPortal,
  getPlanActionLabel,
  isCurrentPlan,
} from "../features/billing/utils/billing.helpers";
import type { BillingPlanResponse } from "../types/billing.types";

const { Title, Text } = Typography;

type ApiErrorBody = {
  message?: string;
  error?: string;
};

function getStatusColor(status?: string) {
  switch (status) {
    case "ACTIVE":
      return "green";
    case "TRIALING":
      return "blue";
    case "PAST_DUE":
      return "orange";
    case "CANCELED":
      return "red";
    case "EXPIRED":
      return "default";
    case "INCOMPLETE":
      return "magenta";
    default:
      return "default";
  }
}

function formatDate(date?: string | null) {
  if (!date) return "-";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("es-EC", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function clampPercent(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function formatPrice(priceCents: number, currency: string) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(priceCents / 100);
}

function getApiErrorMessage(error: unknown) {
  const axiosError = error as AxiosError<ApiErrorBody> | undefined;

  const text =
    axiosError?.response?.data?.message ||
    axiosError?.response?.data?.error ||
    axiosError?.message ||
    "";

  const lower = text.toLowerCase();

  if (
    lower.includes("sql") ||
    lower.includes("column") ||
    lower.includes("hibernate") ||
    lower.includes("jdbc") ||
    lower.includes("position:") ||
    lower.includes("constraint") ||
    lower.includes("syntax")
  ) {
    return "Ocurrió un error interno. Intenta nuevamente.";
  }

  return text || "Ocurrió un error inesperado.";
}

function getFirstQueryErrorMessage(...errors: unknown[]) {
  for (const error of errors) {
    const text = getApiErrorMessage(error);
    if (text) return text;
  }

  return "Intenta nuevamente.";
}

function buildPlanFeatures(plan: BillingPlanResponse) {
  const features = [
    `${plan.maxPosts} posts por período`,
    `${plan.maxAiGenerations} generaciones IA`,
    `${plan.maxImageGenerations} imágenes`,
    `${plan.maxSocialAccounts} cuentas sociales`,
    `${plan.maxAdmins} admins`,
    `${plan.maxEditors} editores`,
  ];

  if (plan.allowScheduling) features.push("Programación de publicaciones");
  if (plan.allowMultiPage) features.push("Multicuenta / multipágina");
  if (plan.allowPremiumAi) features.push("IA premium");
  if (plan.allowPremiumImages) features.push("Imágenes premium");
  if (plan.allowAbTesting) features.push("A/B testing");
  if (plan.allowApprovalFlow) features.push("Flujo de aprobación");
  if (plan.trialDays > 0) features.push(`${plan.trialDays} días de prueba`);

  return features;
}

function getFriendlyWarningText(warning: string) {
  switch (warning) {
    case "POSTS_LIMIT_REACHED":
      return "Has alcanzado el límite de posts de tu plan.";
    case "LOW_POSTS_REMAINING":
      return "Te quedan pocos posts disponibles.";
    case "AI_LIMIT_REACHED":
      return "Has alcanzado el límite de generaciones IA.";
    case "LOW_AI_REMAINING":
      return "Te quedan pocas generaciones IA.";
    case "IMAGES_LIMIT_REACHED":
      return "Has alcanzado el límite de imágenes.";
    case "LOW_IMAGES_REMAINING":
      return "Te quedan pocas imágenes disponibles.";
    case "SOCIAL_ACCOUNTS_LIMIT_REACHED":
      return "Has alcanzado el límite de cuentas sociales.";
    case "LOW_SOCIAL_ACCOUNTS_REMAINING":
      return "Te quedan pocos espacios para cuentas sociales.";
    default:
      return warning;
  }
}

export function BillingPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const role = useAuthStore((state) => state.role);
  const canManageBilling = role === "OWNER" || role === "ADMIN";

  const {
    data: plans,
    isLoading: plansLoading,
    isError: plansError,
    error: plansQueryError,
  } = useBillingPlans();

  const {
    data: subscription,
    isLoading: subscriptionLoading,
    isError: subscriptionError,
    error: subscriptionQueryError,
  } = useBillingSubscription();

  const {
    data: usage,
    isLoading: usageLoading,
    isError: usageError,
    error: usageQueryError,
  } = useBillingUsage();

  const checkoutMutation = useCreateCheckoutSession();
  const portalMutation = useCustomerPortal();

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success === "1") {
      message.success("Proceso de checkout iniciado o suscripción actualizada.");
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("success");
      setSearchParams(nextParams, { replace: true });
    }

    if (canceled === "1") {
      message.warning("El proceso fue cancelado.");
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("canceled");
      setSearchParams(nextParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const loading = plansLoading || subscriptionLoading || usageLoading;
  const hasError = plansError || subscriptionError || usageError;

  const warnings = useMemo(() => usage?.warnings ?? [], [usage]);

  const handleOpenPortal = async () => {
    if (!canManageBilling) {
      message.warning(
        "Solo el propietario o administrador puede gestionar la suscripción."
      );
      return;
    }

    try {
      const url = await portalMutation.mutateAsync();
      window.location.href = url;
    } catch (error) {
      console.error(error);
      message.error(getApiErrorMessage(error) || "No se pudo abrir el portal.");
    }
  };

  const handlePlanAction = async (plan: BillingPlanResponse) => {
    if (!canManageBilling) {
      message.warning(
        "Solo el propietario o administrador puede cambiar el plan."
      );
      return;
    }

    try {
      if (isCurrentPlan(subscription, plan)) {
        return;
      }

      if (canUseCustomerPortal(subscription)) {
        const url = await portalMutation.mutateAsync();
        window.location.href = url;
        return;
      }

      if (plan.priceCents <= 0) {
        message.info("El plan gratuito se gestiona internamente.");
        return;
      }

      const url = await checkoutMutation.mutateAsync(plan.id);
      window.location.href = url;
    } catch (error) {
      console.error(error);
      message.error(
        getApiErrorMessage(error) || "No se pudo iniciar la acción del plan."
      );
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Title level={2}>Billing</Title>
        <Card>
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </div>
    );
  }

  if (hasError) {
    return (
      <div style={{ padding: 24 }}>
        <Result
          status="error"
          title="No se pudo cargar billing"
          subTitle={getFirstQueryErrorMessage(
            plansQueryError,
            subscriptionQueryError,
            usageQueryError
          )}
        />
      </div>
    );
  }

  if (!plans || !subscription || !usage) {
    return (
      <div style={{ padding: 24 }}>
        <Empty description="No hay información disponible de billing." />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>
            Billing y planes
          </Title>

          <Text type="secondary">
            {canManageBilling
              ? "Gestiona tu suscripción, revisa límites y elige el plan que mejor se adapte a tu negocio."
              : "Puedes revisar el plan y el uso actual. La suscripción la gestiona el propietario o administrador."}
          </Text>
        </div>

        {!canManageBilling && (
          <Alert
            type="info"
            showIcon
            message="Gestión de suscripción restringida"
            description="Solo el propietario o administrador puede cambiar planes, abrir Stripe o administrar la suscripción."
          />
        )}

        <Card>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={16}>
              <Space direction="vertical" size={8}>
                <Space wrap>
                  <Title level={3} style={{ margin: 0 }}>
                    {subscription.planName}
                  </Title>
                  <Tag color={getStatusColor(subscription.status)}>
                    {subscription.status}
                  </Tag>
                  <Tag>{subscription.billingPeriod}</Tag>
                  <Tag>{subscription.provider}</Tag>
                </Space>

                <Text>
                  Período actual: {formatDate(subscription.currentPeriodStart)} -{" "}
                  {formatDate(subscription.currentPeriodEnd)}
                </Text>

                {subscription.trialEndsAt &&
                  subscription.status === "TRIALING" && (
                    <Text type="secondary">
                      Trial hasta: {formatDate(subscription.trialEndsAt)}
                    </Text>
                  )}

                {subscription.cancelAtPeriodEnd && (
                  <Alert
                    type="warning"
                    showIcon
                    message="La suscripción se cancelará al finalizar el período actual."
                  />
                )}
              </Space>
            </Col>

            <Col xs={24} md={8}>
              <Space direction="vertical" style={{ width: "100%" }}>
                {canManageBilling && canUseCustomerPortal(subscription) && (
                  <Button
                    type="primary"
                    icon={<CreditCardOutlined />}
                    onClick={handleOpenPortal}
                    loading={portalMutation.isPending}
                    block
                  >
                    Administrar suscripción
                  </Button>
                )}

                {!canManageBilling && canUseCustomerPortal(subscription) && (
                  <Button disabled block icon={<CreditCardOutlined />}>
                    Solo owner/admin
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </Card>

        {warnings.length > 0 && (
          <Alert
            type="warning"
            showIcon
            message="Advertencias de uso"
            description={
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {warnings.map((warning, index) => (
                  <li key={`${warning}-${index}`}>
                    {getFriendlyWarningText(warning)}
                  </li>
                ))}
              </ul>
            }
          />
        )}

        {!usage.canPublish && (
          <Alert
            type="error"
            showIcon
            message="Tu plan o estado actual no permite publicar en este momento."
          />
        )}

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} lg={6}>
            <Card title="Posts">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Progress percent={clampPercent(usage.postsUsedPercent)} />
                <Text>
                  {usage.postsUsed} / {usage.postsLimit}
                </Text>
                <Text type="secondary">Restantes: {usage.postsRemaining}</Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <Card title="IA">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Progress percent={clampPercent(usage.aiUsedPercent)} />
                <Text>
                  {usage.aiUsed} / {usage.aiLimit}
                </Text>
                <Text type="secondary">Restantes: {usage.aiRemaining}</Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <Card title="Imágenes">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Progress percent={clampPercent(usage.imagesUsedPercent)} />
                <Text>
                  {usage.imagesUsed} / {usage.imagesLimit}
                </Text>
                <Text type="secondary">Restantes: {usage.imagesRemaining}</Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12} lg={6}>
            <Card title="Cuentas sociales">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Progress
                  percent={clampPercent(usage.socialAccountsUsedPercent)}
                />
                <Text>
                  {usage.socialAccountsUsed} / {usage.socialAccountsLimit}
                </Text>
                <Text type="secondary">
                  Restantes: {usage.socialAccountsRemaining}
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>

        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            Planes disponibles
          </Title>
          <Text type="secondary">
            {canManageBilling
              ? "Puedes elegir o cambiar el plan de la organización."
              : "Estos son los planes disponibles. Para cambiar de plan, solicita ayuda al propietario o administrador."}
          </Text>
        </div>

        <Row gutter={[16, 16]}>
          {plans.map((plan) => {
            const current = isCurrentPlan(subscription, plan);
            const actionLabel = getPlanActionLabel(subscription, plan);
            const features = buildPlanFeatures(plan);

            return (
              <Col xs={24} md={12} xl={6} key={plan.id}>
                <Card
                  hoverable={canManageBilling}
                  style={{
                    height: "100%",
                    borderWidth: plan.code === "PLUS" ? 2 : 1,
                    opacity: canManageBilling || current ? 1 : 0.85,
                  }}
                >
                  <Space
                    direction="vertical"
                    size={16}
                    style={{ width: "100%" }}
                  >
                    <Space align="center" wrap>
                      <Title level={4} style={{ margin: 0 }}>
                        {plan.name}
                      </Title>
                      {current && <Tag color="green">Actual</Tag>}
                      {plan.code === "PLUS" && !current && (
                        <Tag color="blue">Popular</Tag>
                      )}
                    </Space>

                    <div>
                      <Title level={3} style={{ margin: 0 }}>
                        {formatPrice(plan.priceCents, plan.currency)}
                      </Title>
                      <Text type="secondary">
                        / {plan.billingPeriod.toLowerCase()}
                      </Text>
                    </div>

                    {plan.trialDays > 0 && plan.priceCents > 0 && (
                      <Tag color="cyan">{plan.trialDays} días de prueba</Tag>
                    )}

                    <Divider style={{ margin: 0 }} />

                    <Space direction="vertical" size={8}>
                      {features.map((feature) => (
                        <Space key={feature} size={8} align="start">
                          <CheckOutlined style={{ marginTop: 4 }} />
                          <Text>{feature}</Text>
                        </Space>
                      ))}
                    </Space>

                    <Divider style={{ margin: 0 }} />

                    <Button
                      type={current ? "default" : "primary"}
                      icon={
                        !current ? <RocketOutlined /> : <ThunderboltOutlined />
                      }
                      disabled={current || !canManageBilling}
                      loading={
                        canManageBilling &&
                        ((checkoutMutation.isPending &&
                          checkoutMutation.variables === plan.id) ||
                          portalMutation.isPending)
                      }
                      onClick={() => handlePlanAction(plan)}
                      block
                    >
                      {!canManageBilling
                        ? current
                          ? "Plan actual"
                          : "Solo owner/admin"
                        : actionLabel}
                    </Button>
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Space>
    </div>
  );
}