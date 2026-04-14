import {
  Alert,
  Card,
  Col,
  Divider,
  Empty,
  Progress,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
import {
  FileTextOutlined,
  LinkOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { useDashboardSummary } from "../features/dashboard/hooks/use-dashboard-summary";
import { useThemeStore } from "../app/store/theme.store";
import { PostPreview } from "../components/PostPreview";

const { Title, Text } = Typography;

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
      return <Tag color="gold">Borrador</Tag>;
    case "SCHEDULED":
      return <Tag color="processing">Programado</Tag>;
    case "PUBLISHED":
      return <Tag color="success">Publicado</Tag>;
    case "FAILED":
      return <Tag color="error">Fallido</Tag>;
    case "PROCESSING":
      return <Tag color="purple">Procesando</Tag>;
    case "CANCELED":
      return <Tag>Cancelado</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
}

export function DashboardPage() {
  const { data, isLoading, isError } = useDashboardSummary();
  const { mode } = useThemeStore();

  const isDark = mode === "dark";

  if (isLoading) {
    return (
      <div style={{ padding: 16 }}>
        <Text style={{ color: isDark ? "#ffffff" : "#0f172a" }}>
          Cargando dashboard...
        </Text>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div style={{ padding: 16 }}>
        <Alert
          type="error"
          showIcon
          message="No se pudo cargar el dashboard"
          description="Verifica tu conexión, el backend o la sesión actual."
        />
      </div>
    );
  }

  const aiPercent =
    data.aiLimit > 0 ? Math.round((data.aiUsed / data.aiLimit) * 100) : 0;

  const summaryCardStyle = {
    borderRadius: 16,
    background: isDark ? "#020617" : "#ffffff",
    border: isDark ? "1px solid #1e293b" : "1px solid #e5e7eb",
    boxShadow: isDark
      ? "0 8px 24px rgba(0,0,0,0.16)"
      : "0 8px 24px rgba(15,23,42,0.06)",
  } as const;

  return (
    <div style={{ padding: 16 }}>
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="/taloslogo.png"
            alt="TalosFlow AI"
            style={{ width: 36, height: 36, objectFit: "contain" }}
          />
          <div>
            <Title
              level={3}
              style={{ margin: 0, color: isDark ? "#ffffff" : "#0f172a" }}
            >
              TalosFlow AI
            </Title>
            <Text style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
              Panel de control inteligente
            </Text>
          </div>
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
                borderRadius: 16,
                background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                color: "#fff",
                boxShadow: "0 10px 28px rgba(99,102,241,0.28)",
              }}
            >
              <Space direction="vertical" size={10} style={{ width: "100%" }}>
                <Space>
                  <FileTextOutlined />
                  <Text style={{ color: "#fff" }}>Publicaciones</Text>
                </Space>

                <Statistic
                  value={data.totalPosts}
                  valueStyle={{ color: "#fff" }}
                />

                <Text style={{ color: "#e2e8f0" }}>
                  Total de posts creados
                </Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12} xl={8}>
            <Card
              bordered={false}
              style={{
                borderRadius: 16,
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                color: "#fff",
                boxShadow: "0 10px 28px rgba(168,85,247,0.24)",
              }}
            >
              <Space direction="vertical" size={10} style={{ width: "100%" }}>
                <Space>
                  <LinkOutlined />
                  <Text style={{ color: "#fff" }}>Páginas</Text>
                </Space>

                <Statistic
                  value={data.totalPages}
                  valueStyle={{ color: "#fff" }}
                />

                <Text style={{ color: "#e2e8f0" }}>Páginas conectadas</Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12} xl={8}>
            <Card
              bordered={false}
              style={{
                borderRadius: 16,
                background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                color: "#fff",
                boxShadow: "0 10px 28px rgba(59,130,246,0.24)",
              }}
            >
              <Space direction="vertical" size={10} style={{ width: "100%" }}>
                <Space>
                  <RobotOutlined />
                  <Text style={{ color: "#fff" }}>Uso IA</Text>
                </Space>

                <Statistic
                  value={data.aiUsed}
                  suffix={`/ ${data.aiLimit}`}
                  valueStyle={{ color: "#fff" }}
                />

                <Progress
                  percent={aiPercent}
                  size="small"
                  strokeColor="#ffffff"
                  trailColor="rgba(255,255,255,0.22)"
                />
              </Space>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {[
            { label: "Borradores", value: data.draftPosts, color: "#facc15" },
            {
              label: "Programados",
              value: data.scheduledPosts,
              color: "#38bdf8",
            },
            {
              label: "Publicados",
              value: data.publishedPosts,
              color: "#4ade80",
            },
            { label: "Fallidos", value: data.failedPosts, color: "#f87171" },
          ].map((item) => (
            <Col xs={24} md={12} xl={6} key={item.label}>
              <Card style={summaryCardStyle}>
                <Statistic
                  title={
                    <span style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                      {item.label}
                    </span>
                  }
                  value={item.value}
                  valueStyle={{ color: item.color }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={16}>
            <Card
              title={
                <span style={{ color: isDark ? "#ffffff" : "#0f172a" }}>
                  Actividad reciente
                </span>
              }
              style={summaryCardStyle}
            >
              {!data.recentPosts || data.recentPosts.length === 0 ? (
                <Empty
                  description={
                    <span style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                      No hay actividad reciente
                    </span>
                  }
                />
              ) : (
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  {data.recentPosts.map((post) => (
                    <div key={post.id}>
                      <PostPreview
                        pageName={post.targets?.[0]?.pageName || "Sin página"}
                        content={post.content || ""}
                        imageUrl={post.mediaUrl}
                        date={formatDate(post.updatedAt)}
                        status={post.status}
                      />
                    </div>
                  ))}
                </Space>
              )}
            </Card>
          </Col>

          <Col xs={24} xl={8}>
            <Card
              title={
                <span style={{ color: isDark ? "#ffffff" : "#0f172a" }}>
                  Resumen
                </span>
              }
              style={summaryCardStyle}
            >
              <Space direction="vertical" size={14} style={{ width: "100%" }}>
                <div>
                  <Text style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                    Tasa de éxito: {data.successRate}%
                  </Text>
                  <div style={{ marginTop: 8 }}>
                    <Progress percent={data.successRate} />
                  </div>
                </div>

                <Divider
                  style={{
                    borderColor: isDark ? "#1e293b" : "#e5e7eb",
                    margin: 0,
                  }}
                />

                <div>
                  <Text style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                    IA usada: {data.aiUsed}/{data.aiLimit}
                  </Text>
                </div>

                <Divider
                  style={{
                    borderColor: isDark ? "#1e293b" : "#e5e7eb",
                    margin: 0,
                  }}
                />

                <div>
                  <Text style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                    Estado general:
                  </Text>
                  <div style={{ marginTop: 8 }}>
                    <Space wrap>
                      {renderStatusTag("DRAFT")}
                      {renderStatusTag("SCHEDULED")}
                      {renderStatusTag("PUBLISHED")}
                      {renderStatusTag("FAILED")}
                    </Space>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
}