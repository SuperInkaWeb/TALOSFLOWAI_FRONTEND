import {
  BellOutlined,
  BulbOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Space, Switch, Tag, Typography } from "antd";
import { useThemeStore } from "../app/store/theme.store";

const { Title, Text } = Typography;

type ComingSoonCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  isDark: boolean;
};

function ComingSoonCard({
  title,
  description,
  icon,
  isDark,
}: ComingSoonCardProps) {
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
      bodyStyle={{ padding: 20 }}
    >
      <Space direction="vertical" size={10} style={{ width: "100%" }}>
        <Space align="center" size={10}>
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: isDark ? "#111827" : "#f8fafc",
              border: isDark
                ? "1px solid rgba(148, 163, 184, 0.12)"
                : "1px solid #e5e7eb",
              color: isDark ? "#cbd5e1" : "#334155",
              flexShrink: 0,
            }}
          >
            {icon}
          </span>

          <Space direction="vertical" size={0}>
            <Text
              strong
              style={{
                fontSize: 16,
                color: isDark ? "#ffffff" : "#0f172a",
              }}
            >
              {title}
            </Text>
            <Tag
              color="default"
              style={{
                width: "fit-content",
                borderRadius: 999,
                marginTop: 4,
              }}
            >
              Próximamente
            </Tag>
          </Space>
        </Space>

        <Text
          style={{
            color: isDark ? "#94a3b8" : "#64748b",
            lineHeight: 1.6,
          }}
        >
          {description}
        </Text>
      </Space>
    </Card>
  );
}

export function SettingsPage() {
  const { mode, toggleTheme } = useThemeStore();
  const isDark = mode === "dark";

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
            Ajustes
          </Title>

          <Text
            style={{
              color: isDark ? "#94a3b8" : "#64748b",
              fontSize: 15,
            }}
          >
            Configura tus preferencias personales y prepara tu espacio de trabajo.
          </Text>
        </div>

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
          <Space direction="vertical" size={18} style={{ width: "100%" }}>
            <Space align="center" size={12}>
              <span
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isDark ? "#111827" : "#f8fafc",
                  border: isDark
                    ? "1px solid rgba(148, 163, 184, 0.12)"
                    : "1px solid #e5e7eb",
                  color: isDark ? "#facc15" : "#6366f1",
                  flexShrink: 0,
                }}
              >
                <BulbOutlined style={{ fontSize: 18 }} />
              </span>

              <Space direction="vertical" size={0}>
                <Text
                  strong
                  style={{
                    fontSize: 18,
                    color: isDark ? "#ffffff" : "#0f172a",
                  }}
                >
                  Apariencia
                </Text>
                <Text style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                  Cambia entre modo claro y oscuro.
                </Text>
              </Space>
            </Space>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                padding: 16,
                borderRadius: 16,
                background: isDark ? "#111827" : "#f8fafc",
                border: isDark
                  ? "1px solid rgba(148, 163, 184, 0.12)"
                  : "1px solid #e5e7eb",
              }}
            >
              <Space direction="vertical" size={2}>
                <Text
                  strong
                  style={{
                    color: isDark ? "#ffffff" : "#0f172a",
                  }}
                >
                  Tema oscuro
                </Text>
                <Text
                  style={{
                    color: isDark ? "#94a3b8" : "#64748b",
                    fontSize: 13,
                  }}
                >
                  Activa una interfaz más cómoda para trabajo prolongado.
                </Text>
              </Space>

              <Switch checked={isDark} onChange={toggleTheme} />
            </div>
          </Space>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <ComingSoonCard
              title="Notificaciones"
              description="Configura alertas y avisos dentro de la plataforma para actividades importantes."
              icon={<BellOutlined />}
              isDark={isDark}
            />
          </Col>

          <Col xs={24} md={12}>
            <ComingSoonCard
              title="Idioma"
              description="Personaliza el idioma de la interfaz para adaptarlo a tu flujo de trabajo."
              icon={<GlobalOutlined />}
              isDark={isDark}
            />
          </Col>

          <Col xs={24} md={12}>
            <ComingSoonCard
              title="Zona horaria"
              description="Ajusta la zona horaria para publicaciones programadas y horarios del sistema."
              icon={<ClockCircleOutlined />}
              isDark={isDark}
            />
          </Col>

          <Col xs={24} md={12}>
            <ComingSoonCard
              title="Preferencias personales"
              description="Aquí podrás guardar configuraciones personalizadas para adaptar mejor tu experiencia."
              icon={<BulbOutlined />}
              isDark={isDark}
            />
          </Col>
        </Row>
      </Space>
    </div>
  );
}