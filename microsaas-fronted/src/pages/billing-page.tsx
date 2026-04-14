import { useMemo, type ReactNode } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Progress,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from "antd";
import {
  ArrowUpOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  RocketOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useBillingSubscription } from "../features/billing/hooks/use-billing-subscription";
import { useBillingUsage } from "../features/billing/hooks/use-billing-usage";
import { useCreateCheckoutSession } from "../features/billing/hooks/use-create-checkout-session";
import { useCustomerPortal } from "../features/billing/hooks/use-customer-portal";

const { Title, Text } = Typography;

function formatDate(value?: string | null) {
  if (!value) return "No disponible";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatDateOnly(value?: string | null) {
  if (!value) return "No disponible";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
  }).format(date);
}

function getStatusTag(status: string) {
  switch (status) {
    case "ACTIVE":
      return (
        <Tag color="success" icon={<CheckCircleOutlined />}>
          Activa
        </Tag>
      );
    case "TRIALING":
      return (
        <Tag color="processing" icon={<ClockCircleOutlined />}>
          En prueba
        </Tag>
      );
    case "PAST_DUE":
      return (
        <Tag color="warning" icon={<WarningOutlined />}>
          Pago pendiente
        </Tag>
      );
    case "CANCELED":
      return <Tag color="default">Cancelada</Tag>;
    case "EXPIRED":
      return <Tag color="error">Expirada</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "ACTIVE":
      return "Activa";
    case "TRIALING":
      return "En prueba";
    case "PAST_DUE":
      return "Pago pendiente";
    case "CANCELED":
      return "Cancelada";
    case "EXPIRED":
      return "Expirada";
    default:
      return status;
  }
}

function getProviderLabel(provider: string) {
  switch (provider) {
    case "STRIPE":
      return "Pago con Stripe";
    case "INTERNAL":
      return "Plan incluido";
    default:
      return provider;
  }
}

function getPeriodLabel(period: string) {
  switch (period) {
    case "MONTHLY":
      return "Mensual";
    case "YEARLY":
      return "Anual";
    case "LIFETIME":
      return "De por vida";
    default:
      return period;
  }
}

function getPlanColor(planCode: string) {
  switch (planCode) {
    case "FREE":
      return "#8c8c8c";
    case "PLUS":
      return "#1677ff";
    case "PRO":
      return "#722ed1";
    default:
      return "#1677ff";
  }
}

function getDaysRemaining(endDateValue?: string | null) {
  if (!endDateValue) return null;

  const now = new Date();
  const endDate = new Date(endDateValue);

  if (Number.isNaN(endDate.getTime())) return null;

  const diffMs = endDate.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function getCycleProgress(start?: string, end?: string) {
  if (!start || !end) return 0;

  const startDate = new Date(start);
  const endDate = new Date(end);
  const now = new Date();

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime()) ||
    endDate.getTime() <= startDate.getTime()
  ) {
    return 0;
  }

  const totalMs = endDate.getTime() - startDate.getTime();
  const elapsedMs = now.getTime() - startDate.getTime();

  return Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100)));
}

function resolveNextPlanId(planCode: string): number | null {
  if (planCode === "FREE") return 2;
  if (planCode === "PLUS") return 3;
  return null;
}

function resolveNextPlanLabel(planCode: string): string | null {
  if (planCode === "FREE") return "PLUS";
  if (planCode === "PLUS") return "PRO";
  return null;
}

function mapWarning(code: string) {
  switch (code) {
    case "PLAN_LIMIT_REACHED":
      return "Has alcanzado el límite de publicaciones de tu plan.";
    case "LOW_POSTS_REMAINING":
      return "Te quedan pocas publicaciones disponibles.";
    case "LOW_AI_REMAINING":
      return "Te quedan pocas generaciones IA disponibles.";
    case "LOW_SOCIAL_ACCOUNTS_REMAINING":
      return "Te queda poco espacio para conectar más cuentas sociales.";
    case "SOCIAL_ACCOUNTS_LIMIT_REACHED":
      return "Has alcanzado el límite de cuentas sociales de tu plan.";
    case "SUBSCRIPTION_PAST_DUE":
      return "Tu suscripción tiene un pago pendiente.";
    default:
      return code;
  }
}

type LimitStatProps = {
  title: string;
  value: number;
  icon: ReactNode;
};

function LimitStat({ title, value, icon }: LimitStatProps) {
  return (
    <div
      style={{
        border: "1px solid #f0f0f0",
        borderRadius: 16,
        padding: 18,
        background: "#fafafa",
        height: "100%",
      }}
    >
      <Space direction="vertical" size={8} style={{ width: "100%" }}>
        <Text type="secondary">{title}</Text>
        <Space size={10} align="center">
          <span style={{ fontSize: 22, lineHeight: 1 }}>{icon}</span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#1f1f1f",
            }}
          >
            {value}
          </span>
        </Space>
      </Space>
    </div>
  );
}

type UsageCardProps = {
  title: string;
  used: number;
  limit: number;
  remaining?: number;
  percent: number;
};

function getProgressStatus(percent: number): "success" | "normal" | "exception" {
  if (percent >= 90) return "exception";
  if (percent >= 70) return "normal";
  return "success";
}

function getUsageHint(percent: number) {
  if (percent >= 90) return "Estás por alcanzar el límite";
  if (percent >= 70) return "Uso alto del plan";
  return "Uso saludable";
}

function UsageCard({
  title,
  used,
  limit,
  remaining,
  percent,
}: UsageCardProps) {
  return (
    <div
      style={{
        border: "1px solid #f0f0f0",
        borderRadius: 16,
        padding: 18,
        background: "#fafafa",
        height: "100%",
      }}
    >
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <div>
          <Text type="secondary">{title}</Text>
          <div style={{ marginTop: 4, fontWeight: 700, fontSize: 18 }}>
            {used} / {limit}
          </div>
        </div>

        <Progress
          percent={percent}
          showInfo={false}
          strokeLinecap="round"
          status={getProgressStatus(percent)}
        />

        <Text type="secondary">
          {typeof remaining === "number"
            ? `Te quedan ${remaining}`
            : `${percent}% del límite usado`}
        </Text>

        <Text type="secondary">{getUsageHint(percent)}</Text>
      </Space>
    </div>
  );
}

export function BillingPage() {
  const {
    data: subscription,
    isLoading: subscriptionLoading,
    isError: subscriptionError,
    error: subscriptionErrorValue,
  } = useBillingSubscription();

  const {
    data: usage,
    isLoading: usageLoading,
    isError: usageError,
  } = useBillingUsage();

  const checkoutMutation = useCreateCheckoutSession();
  const customerPortalMutation = useCustomerPortal();

  const loading = subscriptionLoading || usageLoading;

  const nextPlanId = useMemo(
    () => resolveNextPlanId(subscription?.planCode ?? ""),
    [subscription?.planCode]
  );

  const nextPlanLabel = useMemo(
    () => resolveNextPlanLabel(subscription?.planCode ?? ""),
    [subscription?.planCode]
  );

  async function handleUpgrade() {
    if (!subscription) return;

    if (!nextPlanId) {
      message.info("Tu plan actual ya no tiene un upgrade automático configurado.");
      return;
    }

    try {
      const url = await checkoutMutation.mutateAsync(nextPlanId);
      window.location.href = url;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "No se pudo iniciar el proceso de actualización de plan.";
      message.error(errorMessage);
    }
  }

  async function handleCustomerPortal() {
    try {
      const url = await customerPortalMutation.mutateAsync();
      window.location.href = url;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "No se pudo abrir el portal de suscripción.";
      message.error(errorMessage);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (subscriptionError || !subscription) {
    return (
      <Alert
        type="error"
        showIcon
        message="No se pudo cargar la información de facturación"
        description={
          subscriptionErrorValue instanceof Error
            ? subscriptionErrorValue.message
            : "Ocurrió un error inesperado al consultar tu suscripción."
        }
      />
    );
  }

  const planColor = getPlanColor(subscription.planCode);
  const isTrialing = subscription.status === "TRIALING";
  const isPastDue = subscription.status === "PAST_DUE";
  const daysRemaining = getDaysRemaining(subscription.currentPeriodEnd);
  const progressPercent = getCycleProgress(
    subscription.currentPeriodStart,
    subscription.currentPeriodEnd
  );

  const showExternalData =
    !!subscription.providerSubscriptionId ||
    !!subscription.providerCustomerId ||
    subscription.provider === "STRIPE";

  return (
    <Space direction="vertical" size={20} style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>
            Facturación
          </Title>
          <Text type="secondary">
            Revisa tu plan actual, estado de suscripción, renovación, límites y consumo.
          </Text>
        </div>

        <Space wrap>
          {subscription.provider === "STRIPE" && subscription.providerCustomerId ? (
            <Button
              icon={<CreditCardOutlined />}
              onClick={handleCustomerPortal}
              loading={customerPortalMutation.isPending}
            >
              Administrar suscripción
            </Button>
          ) : null}

          {nextPlanId ? (
            <Button
              type="primary"
              icon={<ArrowUpOutlined />}
              onClick={handleUpgrade}
              loading={checkoutMutation.isPending}
            >
              {nextPlanLabel ? `Actualizar a ${nextPlanLabel}` : "Actualizar plan"}
            </Button>
          ) : null}
        </Space>
      </div>

      {isTrialing && (
        <Alert
          type="info"
          showIcon
          message="Tu organización está en período de prueba"
          description={
            daysRemaining !== null && daysRemaining >= 0
              ? `Tu prueba finaliza el ${formatDate(
                  subscription.currentPeriodEnd
                )}. Te quedan ${daysRemaining} día${
                  daysRemaining === 1 ? "" : "s"
                }.`
              : `Tu prueba finaliza el ${formatDate(subscription.currentPeriodEnd)}.`
          }
        />
      )}

      {isPastDue && (
        <Alert
          type="warning"
          showIcon
          message="Tienes un pago pendiente"
          description="Tu suscripción sigue registrada, pero necesitas regularizar el cobro para evitar interrupciones en el servicio."
        />
      )}

      {usage?.warnings?.length ? (
        <Alert
          type="warning"
          showIcon
          message="Hay avisos importantes sobre tu plan"
          description={
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {usage.warnings.map((warning, index) => (
                <li key={`${warning}-${index}`}>{mapWarning(warning)}</li>
              ))}
            </ul>
          }
        />
      ) : null}

      {usageError && (
        <Alert
          type="warning"
          showIcon
          message="No se pudo cargar el consumo actual"
          description="La suscripción se mostró correctamente, pero el uso actual no pudo recuperarse."
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card bordered={false} style={{ borderRadius: 20 }} bodyStyle={{ padding: 24 }}>
            <Space direction="vertical" size={24} style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <Text type="secondary">Plan actual</Text>

                  <div style={{ marginTop: 8 }}>
                    <Space align="center" wrap>
                      <Title level={2} style={{ margin: 0 }}>
                        {subscription.planName}
                      </Title>

                      <Tag color="blue" style={{ borderRadius: 999, paddingInline: 10 }}>
                        {getPeriodLabel(subscription.billingPeriod)}
                      </Tag>
                    </Space>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <Text type="secondary">
                      Estado comercial, límites del plan y consumo del ciclo actual.
                    </Text>
                  </div>
                </div>

                <Space wrap>
                  {getStatusTag(subscription.status)}
                  <Tag
                    style={{
                      borderRadius: 999,
                      paddingInline: 10,
                      color: planColor,
                      borderColor: `${planColor}33`,
                      background: `${planColor}12`,
                    }}
                  >
                    {subscription.planCode}
                  </Tag>
                  <Tag style={{ borderRadius: 999, paddingInline: 10 }}>
                    {getProviderLabel(subscription.provider)}
                  </Tag>
                </Space>
              </div>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <LimitStat
                    title="Posts máximos"
                    value={subscription.maxPosts}
                    icon={<RocketOutlined />}
                  />
                </Col>

                <Col xs={24} md={8}>
                  <LimitStat
                    title="Generaciones IA"
                    value={subscription.maxAiGenerations}
                    icon={<RocketOutlined />}
                  />
                </Col>

                <Col xs={24} md={8}>
                  <LimitStat
                    title="Cuentas sociales"
                    value={subscription.maxSocialAccounts}
                    icon={<CreditCardOutlined />}
                  />
                </Col>
              </Row>

              <div
                style={{
                  border: "1px solid #f0f0f0",
                  borderRadius: 16,
                  padding: 18,
                  background: "#fafafa",
                }}
              >
                <Space direction="vertical" size={14} style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <Text strong>Ciclo actual</Text>
                      <div style={{ marginTop: 4 }}>
                        <Text type="secondary">
                          {daysRemaining !== null
                            ? daysRemaining >= 0
                              ? `Quedan ${daysRemaining} día${
                                  daysRemaining === 1 ? "" : "s"
                                } del período actual`
                              : "El período actual ya finalizó"
                            : "Seguimiento del período actual"}
                        </Text>
                      </div>
                    </div>

                    <Text strong>{progressPercent}%</Text>
                  </div>

                  <Progress
                    percent={progressPercent}
                    showInfo={false}
                    strokeLinecap="round"
                  />

                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Text type="secondary">Inicio del período</Text>
                      <div style={{ marginTop: 6, fontWeight: 600 }}>
                        {formatDate(subscription.currentPeriodStart)}
                      </div>
                    </Col>

                    <Col xs={24} md={12}>
                      <Text type="secondary">
                        {subscription.cancelAtPeriodEnd
                          ? "Finaliza al terminar el período"
                          : isTrialing
                          ? "Fin de prueba"
                          : "Próxima renovación"}
                      </Text>
                      <div style={{ marginTop: 6, fontWeight: 600 }}>
                        {formatDate(subscription.currentPeriodEnd)}
                      </div>
                    </Col>
                  </Row>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Card bordered={false} style={{ borderRadius: 20 }} bodyStyle={{ padding: 24 }}>
              <Space direction="vertical" size={10} style={{ width: "100%" }}>
                <Text type="secondary">Estado</Text>

                <Space align="center" size={12}>
                  <span
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        subscription.status === "ACTIVE"
                          ? "#f6ffed"
                          : subscription.status === "TRIALING"
                          ? "#e6f4ff"
                          : subscription.status === "PAST_DUE"
                          ? "#fffbe6"
                          : "#fafafa",
                      border: "1px solid #f0f0f0",
                      fontSize: 18,
                    }}
                  >
                    {subscription.status === "PAST_DUE" ? (
                      <WarningOutlined />
                    ) : subscription.status === "TRIALING" ? (
                      <ClockCircleOutlined />
                    ) : (
                      <CheckCircleOutlined />
                    )}
                  </span>

                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#1f1f1f" }}>
                      {getStatusLabel(subscription.status)}
                    </div>
                    <Text type="secondary">
                      {usage?.canPublish === false
                        ? "La publicación está restringida por límites o estado comercial"
                        : subscription.cancelAtPeriodEnd
                        ? "La suscripción está programada para finalizar"
                        : "La suscripción se encuentra operativa"}
                    </Text>
                  </div>
                </Space>
              </Space>
            </Card>

            <Card bordered={false} style={{ borderRadius: 20 }} bodyStyle={{ padding: 24 }}>
              <Space direction="vertical" size={14} style={{ width: "100%" }}>
                <Text type="secondary">Resumen del plan</Text>

                <Space align="start" size={12}>
                  <CalendarOutlined style={{ marginTop: 4 }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {getPeriodLabel(subscription.billingPeriod)}
                    </div>
                    <Text type="secondary">
                      Modalidad de facturación del plan actual
                    </Text>
                  </div>
                </Space>

                <Space align="start" size={12}>
                  <CreditCardOutlined style={{ marginTop: 4 }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {subscription.cancelAtPeriodEnd
                        ? "Finaliza al cierre del período"
                        : "Renovación automática activa"}
                    </div>
                    <Text type="secondary">
                      {subscription.cancelAtPeriodEnd
                        ? "No se renovará automáticamente"
                        : "Tu plan seguirá activo mientras el cobro esté al día"}
                    </Text>
                  </div>
                </Space>

                {usage ? (
                  <Space align="start" size={12}>
                    <RocketOutlined style={{ marginTop: 4 }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {usage.canPublish ? "Publicación habilitada" : "Publicación restringida"}
                      </div>
                      <Text type="secondary">
                        Estado operativo según consumo y suscripción actual
                      </Text>
                    </div>
                  </Space>
                ) : null}
              </Space>
            </Card>

            <Card bordered={false} style={{ borderRadius: 20 }} bodyStyle={{ padding: 24 }}>
              <Space direction="vertical" size={14} style={{ width: "100%" }}>
                <Text type="secondary">Origen de la suscripción</Text>

                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>
                    {getProviderLabel(subscription.provider)}
                  </div>
                  <Text type="secondary">
                    Fuente actual de la suscripción
                  </Text>
                </div>

                {showExternalData ? (
                  <>
                    <div>
                      <Text type="secondary">Suscripción externa</Text>
                      <div style={{ marginTop: 6, fontWeight: 600, wordBreak: "break-all" }}>
                        {subscription.providerSubscriptionId || "No disponible"}
                      </div>
                    </div>

                    <div>
                      <Text type="secondary">Cliente externo</Text>
                      <div style={{ marginTop: 6, fontWeight: 600, wordBreak: "break-all" }}>
                        {subscription.providerCustomerId || "No disponible"}
                      </div>
                    </div>
                  </>
                ) : (
                  <Alert
                    type="info"
                    showIcon
                    message="Este plan no depende de un proveedor externo"
                  />
                )}
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>

      <Card bordered={false} style={{ borderRadius: 20 }} bodyStyle={{ padding: 24 }}>
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
          <div>
            <Title level={4} style={{ marginBottom: 4 }}>
              Consumo actual
            </Title>
            <Text type="secondary">
              Uso del ciclo{" "}
              {usage
                ? `${formatDateOnly(usage.periodStart)} - ${formatDateOnly(
                    usage.periodEnd
                  )}`
                : "actual"}{" "}
              frente a los límites de tu plan.
            </Text>
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <UsageCard
                title="Posts usados"
                used={usage?.postsUsed ?? 0}
                limit={usage?.postsLimit ?? subscription.maxPosts}
                remaining={usage?.postsRemaining}
                percent={usage?.postsUsedPercent ?? 0}
              />
            </Col>

            <Col xs={24} md={8}>
              <UsageCard
                title="Generaciones IA usadas"
                used={usage?.aiUsed ?? 0}
                limit={usage?.aiLimit ?? subscription.maxAiGenerations}
                remaining={usage?.aiRemaining}
                percent={usage?.aiUsedPercent ?? 0}
              />
            </Col>

            <Col xs={24} md={8}>
              <UsageCard
                title="Cuentas sociales usadas"
                used={usage?.socialAccountsUsed ?? 0}
                limit={usage?.socialAccountsLimit ?? subscription.maxSocialAccounts}
                remaining={usage?.socialAccountsRemaining}
                percent={usage?.socialAccountsUsedPercent ?? 0}
              />
            </Col>
          </Row>
        </Space>
      </Card>
    </Space>
  );
}