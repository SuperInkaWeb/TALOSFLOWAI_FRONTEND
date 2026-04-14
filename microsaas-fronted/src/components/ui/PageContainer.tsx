import type { ReactNode } from "react";
import { Space } from "antd";
import { useThemeStore } from "../../app/store/theme.store";

type PageContainerProps = {
  children: ReactNode;
};

export function PageContainer({ children }: PageContainerProps) {
  const { mode } = useThemeStore();
  const isDark = mode === "dark";

  return (
    <div
      style={{
        padding: 16,
        minHeight: "100%",
        background: "transparent",
      }}
    >
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        {children}
      </Space>
    </div>
  );
}