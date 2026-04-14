import { Avatar, Card, Space, Tag, Typography } from "antd";
import {
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { useThemeStore } from "../app/store/theme.store";

const { Text, Paragraph } = Typography;

type PostPreviewProps = {
  pageName?: string;
  content: string;
  imageUrl?: string | null;
  date?: string;
  status?: string;
};

function getStatusConfig(status?: string) {
  switch (status) {
    case "DRAFT":
      return { label: "Borrador", color: "gold" as const };
    case "SCHEDULED":
      return { label: "Programado", color: "processing" as const };
    case "PUBLISHED":
      return { label: "Publicado", color: "success" as const };
    case "FAILED":
      return { label: "Fallido", color: "error" as const };
    case "PROCESSING":
      return { label: "Procesando", color: "purple" as const };
    case "CANCELED":
      return { label: "Cancelado", color: "default" as const };
    default:
      return { label: status || "Sin estado", color: "default" as const };
  }
}

export function PostPreview({
  pageName,
  content,
  imageUrl,
  date,
  status,
}: PostPreviewProps) {
  const { mode } = useThemeStore();
  const isDark = mode === "dark";

  const safePageName = pageName?.trim() || "Página";
  const safeContent = content?.trim() || "Sin contenido";
  const statusConfig = getStatusConfig(status);

  return (
    <Card
      size="small"
      style={{
        borderRadius: 18,
        background: isDark ? "#0f172a" : "#ffffff",
        border: isDark ? "1px solid #1e293b" : "1px solid #e5e7eb",
        boxShadow: isDark
          ? "0 10px 28px rgba(0,0,0,0.18)"
          : "0 10px 28px rgba(15,23,42,0.06)",
        overflow: "hidden",
      }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ padding: 16 }}>
        <Space direction="vertical" size={14} style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
              width: "100%",
            }}
          >
            <Space align="start" size={12}>
              <Avatar
                size={42}
                style={{
                  background: isDark ? "#1e293b" : "#e2e8f0",
                  color: isDark ? "#cbd5e1" : "#334155",
                  flexShrink: 0,
                  fontWeight: 700,
                }}
              >
                {safePageName.charAt(0).toUpperCase()}
              </Avatar>

              <div style={{ minWidth: 0 }}>
                <div>
                  <Text strong style={{ color: isDark ? "#ffffff" : "#0f172a" }}>
                    {safePageName}
                  </Text>
                </div>

                <Space size={6} wrap>
                  <Text
                    style={{
                      fontSize: 12,
                      color: isDark ? "#94a3b8" : "#64748b",
                    }}
                  >
                    {date || "Ahora"}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: isDark ? "#64748b" : "#94a3b8",
                    }}
                  >
                    ·
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: isDark ? "#94a3b8" : "#64748b",
                    }}
                  >
                    Público
                  </Text>
                </Space>
              </div>
            </Space>

            <Tag color={statusConfig.color} style={{ borderRadius: 999 }}>
              {statusConfig.label}
            </Tag>
          </div>

          <Paragraph
            style={{
              color: isDark ? "#e2e8f0" : "#334155",
              whiteSpace: "pre-wrap",
              lineHeight: 1.65,
              marginBottom: 0,
            }}
          >
            {safeContent}
          </Paragraph>
        </Space>
      </div>

      {imageUrl ? (
        <div
          style={{
            width: "100%",
            borderTop: isDark ? "1px solid #1e293b" : "1px solid #e5e7eb",
            borderBottom: isDark ? "1px solid #1e293b" : "1px solid #e5e7eb",
            background: isDark ? "#020617" : "#f8fafc",
          }}
        >
          <img
            src={imageUrl}
            alt="Vista previa del post"
            style={{
              width: "100%",
              maxHeight: 360,
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      ) : null}

      <div style={{ padding: 14 }}>
        <Space direction="vertical" size={10} style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: isDark ? "#94a3b8" : "#64748b",
              fontSize: 12,
            }}
          >
            <span>👍 24</span>
            <span>3 comentarios · 1 compartido</span>
          </div>

          <div
            style={{
              borderTop: isDark ? "1px solid #1e293b" : "1px solid #e5e7eb",
              paddingTop: 10,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
            }}
          >
            <div
              style={{
                textAlign: "center",
                color: isDark ? "#94a3b8" : "#64748b",
                fontWeight: 500,
              }}
            >
              <LikeOutlined style={{ marginRight: 6 }} />
              Me gusta
            </div>
            <div
              style={{
                textAlign: "center",
                color: isDark ? "#94a3b8" : "#64748b",
                fontWeight: 500,
              }}
            >
              <MessageOutlined style={{ marginRight: 6 }} />
              Comentar
            </div>
            <div
              style={{
                textAlign: "center",
                color: isDark ? "#94a3b8" : "#64748b",
                fontWeight: 500,
              }}
            >
              <ShareAltOutlined style={{ marginRight: 6 }} />
              Compartir
            </div>
          </div>
        </Space>
      </div>
    </Card>
  );
}