import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";

import { router } from "./app/router";
import { AppQueryProvider } from "./app/providers/query-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppQueryProvider>
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 12,
            colorPrimary: "#1677ff",
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </AppQueryProvider>
  </React.StrictMode>
);