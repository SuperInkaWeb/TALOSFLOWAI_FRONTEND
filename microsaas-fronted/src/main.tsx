import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider, theme as antdTheme } from "antd";
import "antd/dist/reset.css";

import { router } from "./app/router";
import { AppQueryProvider } from "./app/providers/query-provider";
import { useThemeStore } from "./app/store/theme.store";

function AppWithTheme() {
  const { mode } = useThemeStore();

  return (
    <ConfigProvider
      theme={{
        algorithm:
          mode === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
        token: {
          borderRadius: 12,
          colorPrimary: "#6366f1", // más acorde a tu branding
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppQueryProvider>
      <AppWithTheme />
    </AppQueryProvider>
  </React.StrictMode>
);