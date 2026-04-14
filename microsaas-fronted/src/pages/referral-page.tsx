// src/features/referrals/pages/ReferralsPage.tsx
import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Modal,
  Progress,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Typography,
  message,
} from "antd";
import {
  CopyOutlined,
  GiftOutlined,
  LinkOutlined,
  MessageOutlined,
  ShareAltOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { useReferralSummary } from "../features/referrals/hooks/use-referral-summary";
import { useReferralList } from "../features/referrals/hooks/use-referral-list";
import ReferralHistoryTable from "../features/referrals/components/referral-history-table";

const { Title, Paragraph, Text } = Typography;

const MAX_REWARDED_REFERRALS_PER_MONTH = 5;

export default function ReferralsPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useReferralSummary();

  const {
    data: referralList = [],
    isLoading: isReferralListLoading,
  } = useReferralList();

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      messageApi.success(`${label} copiado`);
    } catch {
      messageApi.error(`No se pudo copiar ${label.toLowerCase()}`);
    }
  };

  const referralInviteMessage = useMemo(() => {
    if (!data) return "";

    return `Hola, te comparto mi enlace para unirte a TalosFlow y probar la plataforma: ${data.referralLink}`;
  }, [data]);

  const handleCopyInviteMessage = async () => {
    await handleCopy(referralInviteMessage, "Mensaje");
  };

  const handleShareWhatsapp = () => {
    if (!data) return;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(referralInviteMessage)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const cleanReferralLink = data?.referralLink
    ?.replace(/^https?:\/\//, "")
    ?.replace(/^www\./, "");

  const rewardedThisMonthPercent = data
    ? Math.min(
        100,
        Math.round(
          (data.rewardedThisMonth / MAX_REWARDED_REFERRALS_PER_MONTH) * 100
        )
      )
    : 0;

  const hasBonuses = (data?.bonusAi ?? 0) > 0 || (data?.bonusImages ?? 0) > 0;

  if (isLoading) {
    return (
      <>
        {contextHolder}
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Skeleton active paragraph={{ rows: 3 }} />
          <Skeleton active paragraph={{ rows: 6 }} />
        </Space>
      </>
    );
  }

  if (isError || !data) {
    return (
      <>
        {contextHolder}
        <Card>
          <Space direction="vertical">
            <Title level={4} style={{ margin: 0 }}>
              No se pudo cargar el resumen de referidos
            </Title>
            <Paragraph type="secondary" style={{ margin: 0 }}>
              Intenta nuevamente para obtener tu enlace y tus métricas.
            </Paragraph>
            <Button type="primary" onClick={() => refetch()} loading={isFetching}>
              Reintentar
            </Button>
          </Space>
        </Card>
      </>
    );
  }

  return (
    <>
      {contextHolder}

      <Modal
        open={shareModalOpen}
        onCancel={() => setShareModalOpen(false)}
        footer={null}
        title="Compartir enlace de referido"
        centered
      >
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Comparte tu enlace y gana recompensas cuando una organización se
            registre y use la plataforma.
          </Paragraph>

          <Card size="small" style={{ background: "#fafafa" }}>
            <Space direction="vertical" size={10} style={{ width: "100%" }}>
              <Text strong>Código</Text>
              <Text code style={{ fontSize: 15 }}>
                {data.referralCode}
              </Text>

              <Divider style={{ margin: "4px 0" }} />

              <Text strong>Link</Text>
              <Text style={{ wordBreak: "break-all" }}>{data.referralLink}</Text>

              <Divider style={{ margin: "4px 0" }} />

              <Text strong>Mensaje sugerido</Text>
              <Text style={{ whiteSpace: "pre-wrap" }}>{referralInviteMessage}</Text>
            </Space>
          </Card>

          <Space direction="vertical" size={10} style={{ width: "100%" }}>
            <Button
              type="primary"
              icon={<LinkOutlined />}
              block
              onClick={() => handleCopy(data.referralLink, "Link")}
            >
              Copiar link de invitación
            </Button>

            <Button
              icon={<MessageOutlined />}
              block
              onClick={handleCopyInviteMessage}
            >
              Copiar mensaje listo
            </Button>

            <Button
              icon={<CopyOutlined />}
              block
              onClick={() => handleCopy(data.referralCode, "Código")}
            >
              Copiar código
            </Button>

            <Button
              icon={<WhatsAppOutlined />}
              block
              onClick={handleShareWhatsapp}
            >
              Compartir por WhatsApp
            </Button>
          </Space>
        </Space>
      </Modal>

      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        <Card variant="borderless" styles={{ body: { padding: 24 } }}>
          <Space direction="vertical" size={8} style={{ width: "100%" }}>
            <Space align="center">
              <ShareAltOutlined />
              <Title level={3} style={{ margin: 0 }}>
                Programa de referidos
              </Title>
            </Space>

            <Paragraph type="secondary" style={{ marginBottom: 0 }}>
              Invita a otras organizaciones y gana bonus de IA e imágenes cuando
              usen el producto.
            </Paragraph>
          </Space>
        </Card>

        <Card
          style={{
            background: "#f6f9ff",
            border: "1px solid #dbeafe",
          }}
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} lg={16}>
              <Space direction="vertical" size={8}>
                <Text strong style={{ fontSize: 16 }}>
                  Gana recompensas por cada referido
                </Text>

                <Text type="secondary">
                  Comparte tu enlace. Cuando una organización se registre y use la
                  plataforma, recibirás recompensas automáticas.
                </Text>

                <Space wrap>
                  <Tag color="blue" style={{ padding: "4px 10px" }}>
                    +30 IA
                  </Tag>
                  <Tag color="purple" style={{ padding: "4px 10px" }}>
                    +30 imágenes
                  </Tag>
                </Space>
              </Space>
            </Col>

            <Col xs={24} lg={8}>
              <Space
                direction="vertical"
                size={10}
                style={{ width: "100%", alignItems: "flex-start" }}
              >
                <Button
                  type="primary"
                  size="large"
                  icon={<ShareAltOutlined />}
                  onClick={() => setShareModalOpen(true)}
                >
                  Invitar ahora
                </Button>

                <Text type="secondary">
                  Usa tu enlace y compártelo en WhatsApp, email o redes.
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={14}>
            <Card title="Tu enlace de referido">
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <div>
                  <Text strong>Código</Text>

                  <Card size="small" style={{ marginTop: 8, background: "#fafafa" }}>
                    <Space
                      style={{
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text code style={{ fontSize: 16 }}>
                        {data.referralCode}
                      </Text>

                      <Button
                        icon={<CopyOutlined />}
                        onClick={() => handleCopy(data.referralCode, "Código")}
                      >
                        Copiar código
                      </Button>
                    </Space>
                  </Card>
                </div>

                <div>
                  <Text strong>Link</Text>

                  <Card size="small" style={{ marginTop: 8, background: "#fafafa" }}>
                    <Space direction="vertical" size={12} style={{ width: "100%" }}>
                      <Text style={{ wordBreak: "break-all" }}>
                        {cleanReferralLink}
                      </Text>

                      <Space wrap>
                        <Button
                          type="primary"
                          icon={<LinkOutlined />}
                          onClick={() => handleCopy(data.referralLink, "Link")}
                        >
                          Copiar link
                        </Button>

                        <Button
                          icon={<MessageOutlined />}
                          onClick={handleCopyInviteMessage}
                        >
                          Copiar mensaje
                        </Button>

                        <Button
                          icon={<ShareAltOutlined />}
                          onClick={handleShareWhatsapp}
                        >
                          Compartir por WhatsApp
                        </Button>
                      </Space>
                    </Space>
                  </Card>
                </div>

                <Divider style={{ margin: "8px 0" }} />

                <Space direction="vertical" size={8}>
                  <Text strong>¿Cómo ganar recompensas?</Text>

                  <Text type="secondary">
                    1. Comparte tu enlace
                    <br />
                    2. Una nueva organización se registra
                    <br />
                    3. Usa la plataforma
                    <br />
                    4. Ganas bonus automáticamente
                  </Text>
                </Space>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={10}>
            <Card title="Bonus actuales">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Bonus IA"
                    value={data.bonusAi}
                    prefix={<GiftOutlined />}
                  />
                </Col>

                <Col span={12}>
                  <Statistic
                    title="Bonus imágenes"
                    value={data.bonusImages}
                    prefix={<GiftOutlined />}
                  />
                </Col>
              </Row>

              <Divider />

              <Space direction="vertical" size={10} style={{ width: "100%" }}>
                <Text strong>Estado</Text>

                {hasBonuses ? (
                  <Space wrap>
                    <Tag color="blue">IA: {data.bonusAi}</Tag>
                    <Tag color="purple">Imágenes: {data.bonusImages}</Tag>
                  </Space>
                ) : (
                  <Text type="secondary">
                    Aún no tienes recompensas. Invita a tu primera organización 🚀
                  </Text>
                )}

                <Divider style={{ margin: "6px 0" }} />

                <Space direction="vertical" size={6} style={{ width: "100%" }}>
                  <Text strong>Progreso mensual</Text>

                  <Progress
                    percent={rewardedThisMonthPercent}
                    status="active"
                    strokeColor="#6366f1"
                  />

                  <Text type="secondary">
                    {data.rewardedThisMonth}/{MAX_REWARDED_REFERRALS_PER_MONTH} referidos premiados este mes
                  </Text>
                </Space>
              </Space>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} xl={6}>
            <Card hoverable>
              <Statistic
                title="Total referidos"
                value={data.totalReferrals}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} md={12} xl={6}>
            <Card hoverable>
              <Statistic
                title="Pendientes"
                value={data.pendingReferrals}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} md={12} xl={6}>
            <Card hoverable>
              <Statistic
                title="Premiados"
                value={data.rewardedReferrals}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} md={12} xl={6}>
            <Card hoverable>
              <Statistic
                title="Premiados este mes"
                value={data.rewardedThisMonth}
                prefix={<GiftOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card title="Historial de referidos">
          <ReferralHistoryTable
            data={referralList}
            loading={isReferralListLoading}
          />
        </Card>
      </Space>
    </>
  );
}