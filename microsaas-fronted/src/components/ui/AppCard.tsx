/*import { Card } from "antd";
import type { ReactNode, CSSProperties } from "react";
import { useThemeStore } from "../../app/store/theme.store";

type AppCardProps = {
  children: ReactNode;
  title?: ReactNode;
  extra?: ReactNode;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
};

export function AppCard({
  children,
  title,
  extra,
  style,
  bodyStyle,
}: AppCardProps) {
  const { mode } = useThemeStore();
  const isDark = mode === "dark";

  return (
    <Card
      title={title}
      extra={extra}
      bordered={false}
      styles={{
        header: {
          color: isDark ? "#ffffff" : "#0f172a",
          borderBottom: isDark ? "1px solid #1e293b" : "1px solid #e5e7eb",
        },
        body: {
          ...bodyStyle,
        },
      }}
      style={{
        borderRadius: 16,
        background: isDark ? "#020617" : "#ffffff",
        border: isDark ? "1px solid #1e293b" : "1px solid #e5e7eb",
        boxShadow: isDark
          ? "0 8px 24px rgba(0,0,0,0.16)"
          : "0 8px 24px rgba(15,23,42,0.06)",
        ...style,
      }}
    >
      {children}
    </Card>
  );
}*/