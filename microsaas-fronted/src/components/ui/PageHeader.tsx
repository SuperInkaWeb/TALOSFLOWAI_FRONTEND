/*import { Space, Typography } from "antd";
import type { ReactNode } from "react";
import { useThemeStore } from "../../app/store/theme.store";

const { Title, Text } = Typography;

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  extra?: ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  icon,
  extra,
}: PageHeaderProps) {
  const { mode } = useThemeStore();
  const isDark = mode === "dark";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <Space align="center" size={12}>
        {icon ? (
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              display: "grid",
              placeItems: "center",
              background: isDark ? "#0f172a" : "#ffffff",
              border: isDark ? "1px solid #1e293b" : "1px solid #e5e7eb",
              boxShadow: isDark
                ? "0 8px 24px rgba(0,0,0,0.14)"
                : "0 8px 24px rgba(15,23,42,0.06)",
            }}
          >
            {icon}
          </div>
        ) : null}

        <div>
          <Title
            level={3}
            style={{
              margin: 0,
              color: isDark ? "#ffffff" : "#0f172a",
            }}
          >
            {title}
          </Title>

          {subtitle ? (
            <Text style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
              {subtitle}
            </Text>
          ) : null}
        </div>
      </Space>

      {extra ? <div>{extra}</div> : null}
    </div>
  );
}*/