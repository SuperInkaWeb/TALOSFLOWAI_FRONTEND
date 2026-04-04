import {
  Alert,
  Card,
  Col,
  Divider,
  Empty,
  Progress,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
import type { CSSProperties, MouseEvent } from "react";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  LinkOutlined,
  RobotOutlined,
  CloseCircleOutlined,
  EditOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useDashboardSummary } from "../features/dashboard/hooks/use-dashboard-summary";

const { Title, Paragraph, Text } = Typography;

function formatDate(date: string | null) {
  if (!date) return "Sin fecha";

  return new Date(date).toLocaleString("es-EC", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function renderStatusTag(status: string) {
  switch (status) {
    case "DRAFT":
      return (
        <Tag icon={<EditOutlined />} color="gold">
          Borrador
        </Tag>
      );
    case "SCHEDULED":
      return (
        <Tag icon={<ClockCircleOutlined />} color="processing">
          Programado
        </Tag>
      );
    case "PUBLISHED":
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Publicado
        </Tag>
      );
    case "FAILED":
      return (
        <Tag icon={<CloseCircleOutlined />} color="error">
          Fallido
        </Tag>
      );
    case "CANCELED":
      return <Tag color="default">Cancelado</Tag>;
    case "PROCESSING":
      return <Tag color="purple">Procesando</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
}

function getActivityDate(post: {
  updatedAt: string;
  publishedAt?: string | null;
  scheduledAt?: string | null;
}) {
  return post.publishedAt || post.scheduledAt || post.updatedAt;
}

const softCardStyle: CSSProperties = {
  borderRadius: 16,
  boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
  transition: "all 0.2s ease",
};

function handleCardMouseEnter(e: MouseEvent<HTMLDivElement>) {
  e.currentTarget.style.transform = "translateY(-4px)";
  e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.08)";
}

function handleCardMouseLeave(e: MouseEvent<HTMLDivElement>) {
  e.currentTarget.style.transform = "none";
  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.04)";
}

export function DashboardPage() {
  const { data, isLoading, isError } = useDashboardSummary();

  if (isLoading) {
    return (
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>
            Panel
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Resumen general de publicaciones, uso de IA y actividad reciente.
          </Paragraph>
        </div>

        <Skeleton active paragraph={{ rows: 10 }} />
      </Space>
    );
  }

  if (isError || !data) {
    return (
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <div>
          <Title level={2} style={{ marginBottom: 4 }}>
            Panel
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Resumen general de publicaciones, uso de IA y actividad reciente.
          </Paragraph>
        </div>

        <Alert
          type="error"
          showIcon
          message="No se pudieron cargar los datos del dashboard"
          description="Verifica que el backend esté activo, que el token se esté enviando correctamente y que la ruta /dashboard/summary esté disponible."
        />
      </Space>
    );
  }

  const aiPercent =
    data.aiLimit > 0 ? Math.round((data.aiUsed / data.aiLimit) * 100) : 0;

  const recentPosts = data.recentPosts ?? [];

  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <div>
        <Title level={2} style={{ marginBottom: 4 }}>
          Panel
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Resumen general de publicaciones, uso de IA y actividad reciente.
        </Paragraph>
      </div>

      <Alert
        type="info"
        showIcon
        message={`Tienes ${data.totalPosts} publicaciones, ${data.publishedPosts} publicadas y ${data.failedPosts} fallidas.`}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 18,
              background: "linear-gradient(135deg, #1677ff 0%, #4096ff 100%)",
              boxShadow: "0 8px 24px rgba(22,119,255,0.25)",
              color: "#fff",
              height: "100%",
            }}
          >
            <Space align="center" style={{ marginBottom: 12 }}>
              <FileTextOutlined style={{ fontSize: 20, color: "#fff" }} />
              <Text strong style={{ color: "#fff" }}>
                Publicaciones
              </Text>
            </Space>

            <Statistic
              value={data.totalPosts}
              valueStyle={{ color: "#fff", fontSize: 36 }}
            />

            <Text style={{ color: "rgba(255,255,255,0.85)" }}>
              Total de posts creados
            </Text>
          </Card>
        </Col>

        <Col xs={24} md={12} xl={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 18,
              background: "linear-gradient(135deg, #722ed1 0%, #9254de 100%)",
              boxShadow: "0 8px 24px rgba(114,46,209,0.22)",
              color: "#fff",
              height: "100%",
            }}
          >
            <Space align="center" style={{ marginBottom: 12 }}>
              <LinkOutlined style={{ fontSize: 20, color: "#fff" }} />
              <Text strong style={{ color: "#fff" }}>
                Páginas conectadas
              </Text>
            </Space>

            <Statistic
              value={data.totalPages}
              valueStyle={{ color: "#fff", fontSize: 36 }}
            />

            <Text style={{ color: "rgba(255,255,255,0.85)" }}>
              Páginas sincronizadas y disponibles
            </Text>
          </Card>
        </Col>

        <Col xs={24} md={12} xl={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 18,
              background: "linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)",
              boxShadow: "0 8px 24px rgba(250,140,22,0.22)",
              color: "#fff",
              height: "100%",
            }}
          >
            <Space align="center" style={{ marginBottom: 12 }}>
              <RobotOutlined style={{ fontSize: 20, color: "#fff" }} />
              <Text strong style={{ color: "#fff" }}>
                Uso de IA
              </Text>
            </Space>

            <Statistic
              value={data.aiUsed}
              suffix={`/ ${data.aiLimit}`}
              valueStyle={{ color: "#fff", fontSize: 36 }}
            />

            <div style={{ marginTop: 14 }}>
              <Progress
                percent={aiPercent}
                size="small"
                strokeColor="#ffffff"
                trailColor="rgba(255,255,255,0.25)"
              />
            </div>

            <Text style={{ color: "rgba(255,255,255,0.85)" }}>
              Generaciones realizadas
            </Text>
          </Card>
        </Col>

        <Col xs={24} md={12} xl={6}>
          <div onMouseEnter={handleCardMouseEnter} onMouseLeave={handleCardMouseLeave}>
            <Card bordered={false} style={softCardStyle}>
              <Statistic
                title="Borradores"
                value={data.draftPosts}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </div>
        </Col>

        <Col xs={24} md={12} xl={6}>
          <div onMouseEnter={handleCardMouseEnter} onMouseLeave={handleCardMouseLeave}>
            <Card bordered={false} style={softCardStyle}>
              <Statistic
                title="Programados"
                value={data.scheduledPosts}
                valueStyle={{ color: "#1677ff" }}
              />
            </Card>
          </div>
        </Col>

        <Col xs={24} md={12} xl={6}>
          <div onMouseEnter={handleCardMouseEnter} onMouseLeave={handleCardMouseLeave}>
            <Card bordered={false} style={softCardStyle}>
              <Statistic
                title="Publicados"
                value={data.publishedPosts}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </div>
        </Col>

        <Col xs={24} md={12} xl={6}>
          <div onMouseEnter={handleCardMouseEnter} onMouseLeave={handleCardMouseLeave}>
            <Card bordered={false} style={softCardStyle}>
              <Statistic
                title="Fallidos"
                value={data.failedPosts}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </div>
        </Col>

        <Col xs={24} xl={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 18,
              boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
              height: "100%",
            }}
          >
            <Space align="center" style={{ marginBottom: 12 }}>
              <BarChartOutlined style={{ fontSize: 20, color: "#13c2c2" }} />
              <Text strong>Rendimiento</Text>
            </Space>

            <Statistic
              value={data.successRate}
              suffix="%"
              valueStyle={{ fontSize: 34 }}
            />

            <div style={{ marginTop: 14 }}>
              <Progress percent={data.successRate} strokeColor="#13c2c2" />
            </div>

            <Text type="secondary">Publicaciones exitosas</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card
            bordered={false}
            title="Actividad reciente"
            style={{
              borderRadius: 18,
              boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
              height: "100%",
            }}
          >
            {recentPosts.length === 0 ? (
              <Empty
                description="Aún no tienes actividad reciente"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                {recentPosts.map((post) => (
                  <Card
                    key={post.id}
                    size="small"
                    style={{
                      borderRadius: 14,
                      background: "#fafafa",
                      border: "1px solid #f0f0f0",
                    }}
                  >
                    <Space direction="vertical" size={8} style={{ width: "100%" }}>
                      <Space
                        align="center"
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text strong>
                          {post.targets?.[0]?.pageName ?? "Sin página"} • #{post.id}
                        </Text>
                        {renderStatusTag(post.status)}
                      </Space>

                      <Text type="secondary">
                        {post.content.length > 160
                          ? `${post.content.slice(0, 160)}...`
                          : post.content}
                      </Text>

                      <Text type="secondary">
                        Fecha: {formatDate(getActivityDate(post))}
                      </Text>

                      {post.errorMessage && (
                        <Alert
                          type="error"
                          showIcon
                          message="Error en publicación"
                          description={post.errorMessage}
                        />
                      )}
                    </Space>
                  </Card>
                ))}
              </Space>
            )}
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card
            bordered={false}
            title="Resumen operativo"
            style={{
              borderRadius: 18,
              boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
              height: "100%",
            }}
          >
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <div>
                <Space align="center">
                  <BarChartOutlined />
                  <Text strong>Estado general</Text>
                </Space>
                <div style={{ marginTop: 10 }}>
                  <Progress
                    percent={Math.min(data.totalPosts > 0 ? data.successRate : 0, 100)}
                    strokeColor="#52c41a"
                    trailColor="#f0f0f0"
                    showInfo={false}
                    size="small"
                  />
                </div>
                <Text type="secondary">
                  {data.totalPosts === 0
                    ? "Aún no has creado publicaciones."
                    : `Tienes ${data.totalPosts} publicación(es) registradas en el sistema.`}
                </Text>
              </div>

              <Divider style={{ margin: "2px 0" }} />

              <div>
                <Text strong>Rendimiento</Text>
                <br />
                <Text type="secondary">
                  Tu tasa de éxito actual es de {data.successRate}%.
                </Text>
              </div>

              <Divider style={{ margin: "2px 0" }} />

              <div>
                <Text strong>Redes conectadas</Text>
                <br />
                <Text type="secondary">
                  {data.totalPages === 0
                    ? "No hay páginas sincronizadas todavía."
                    : `Tienes ${data.totalPages} página(s) disponible(s) para publicar.`}
                </Text>
              </div>

              <Divider style={{ margin: "2px 0" }} />

              <div>
                <Text strong>Uso de IA</Text>
                <br />
                <Text type="secondary">
                  Has usado {data.aiUsed} de {data.aiLimit} generaciones disponibles.
                </Text>
              </div>

              <Divider style={{ margin: "2px 0" }} />

              <div>
                <Text strong>Próximo foco</Text>
                <br />
                <Text type="secondary">
                  {data.draftPosts > 0
                    ? "Tienes borradores listos. El siguiente paso es programarlos o publicarlos."
                    : "El siguiente paso es crear más publicaciones y programarlas desde el módulo de Publicaciones."}
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}