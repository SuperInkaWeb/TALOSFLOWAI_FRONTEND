import { useEffect, useMemo, useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Tag,
  Button,
  Drawer,
  Grid,
} from "antd";
import type { MenuProps } from "antd";
import {
  DashboardOutlined,
  BgColorsOutlined,
  FileTextOutlined,
  LinkOutlined,
  RobotOutlined,
  CreditCardOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../app/store/auth.store";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const formatName = (value: string) => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const roleMap: Record<string, string> = {
  OWNER: "Propietario",
  ADMIN: "Administrador",
  USER: "Usuario",
  SUPER_ADMIN: "Super administrador",
};

const roleColorMap: Record<string, string> = {
  OWNER: "blue",
  ADMIN: "purple",
  USER: "default",
  SUPER_ADMIN: "gold",
};

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  const logout = useAuthStore((state) => state.logout);
  const schema = useAuthStore((state) => state.schema);
  const role = useAuthStore((state) => state.role);

  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    return saved === "true";
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleCollapsedChange = (value: boolean) => {
    setCollapsed(value);
    localStorage.setItem("sidebar_collapsed", String(value));
  };

  useEffect(() => {
    if (isMobile) setMobileOpen(false);
  }, [location.pathname, isMobile]);

  const items: MenuProps["items"] = useMemo(
    () => [
      {
        key: "/app/dashboard",
        icon: <DashboardOutlined />,
        label: "Dashboard",
        title: "Dashboard",
      },
      {
        key: "/app/branding",
        icon: <BgColorsOutlined />,
        label: "Branding",
        title: "Branding",
      },
      {
        key: "/app/social-accounts",
        icon: <LinkOutlined />,
        label: "Social Accounts",
        title: "Social Accounts",
      },
      {
        key: "/app/posts",
        icon: <FileTextOutlined />,
        label: "Posts",
        title: "Posts",
      },
      {
        key: "/app/ai",
        icon: <RobotOutlined />,
        label: "AI Studio",
        title: "AI Studio",
      },
      {
        key: "/app/billing",
        icon: <CreditCardOutlined />,
        label: "Billing",
        title: "Billing",
      },
    ],
    []
  );

  const userMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Cerrar sesión",
      onClick: () => {
        logout();
        navigate("/auth/login");
      },
    },
  ];

  const rawOrganization = schema
    ? schema.replace(/^inquilino_/, "").replace(/^tenant_/, "")
    : "";

  const displayOrganization = rawOrganization
    ? formatName(rawOrganization)
    : "Sin organización";

  const displayRole = role ? roleMap[role] ?? role.replaceAll("_", " ") : "Sin rol";
  const roleColor = role ? roleColorMap[role] ?? "default" : "default";

  const sidebarMenu = (
    <>
      <div
        style={{
          height: 76,
          display: "flex",
          alignItems: "center",
          justifyContent: isMobile
            ? "space-between"
            : collapsed
            ? "center"
            : "space-between",
          padding: isMobile ? "0 20px" : collapsed ? "0 12px" : "0 20px",
          color: "#fff",
          fontWeight: 800,
          fontSize: isMobile ? 28 : collapsed ? 22 : 28,
          letterSpacing: -0.8,
          transition: "all 0.25s ease",
        }}
      >
        <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    transition: "all 0.25s ease",
  }}
>
  {/* 🔷 Isotipo */}
  <div
    style={{
      width: collapsed ? 36 : 42,
      height: collapsed ? 36 : 42,
      borderRadius: 12,
      background: "linear-gradient(135deg, #1677ff, #4096ff)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 800,
      fontSize: collapsed ? 16 : 18,
      color: "#fff",
      boxShadow: "0 6px 16px rgba(22,119,255,0.35)",
      transition: "all 0.25s ease",
    }}
              >
                Q
              </div>

              {/* 🔤 Texto (solo cuando está abierto) */}
              {!collapsed && !isMobile && (
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: "#fff",
                    letterSpacing: -0.5,
                    transition: "all 0.25s ease",
                  }}
                >
                  Qoribex
                </span>
              )}
            </div>

        {isMobile ? (
          <Button
            type="text"
            icon={<MenuFoldOutlined style={{ color: "#fff", fontSize: 18 }} />}
            onClick={() => setMobileOpen(false)}
          />
        ) : !collapsed ? (
          <Button
            type="text"
            icon={<MenuFoldOutlined style={{ color: "#fff", fontSize: 18 }} />}
            onClick={() => handleCollapsedChange(true)}
          />
        ) : null}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        inlineCollapsed={!isMobile && collapsed}
        selectedKeys={[location.pathname]}
        items={items}
        onClick={({ key }) => {
          navigate(key);
          if (isMobile) setMobileOpen(false);
        }}
        style={{
          borderInlineEnd: "none",
          fontSize: 15,
          background: "transparent",
          paddingInline: 8,
        }}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fb" }}>
      <style>
        {`
          .premium-sider {
            background: linear-gradient(180deg, #020617 0%, #0f172a 100%) !important;
            transition: all 0.28s ease !important;
          }

          .premium-sider .ant-layout-sider-children {
            display: flex;
            flex-direction: column;
          }

          .premium-sider .ant-menu {
            background: transparent !important;
          }

          .premium-sider .ant-menu-item {
            height: 48px;
            line-height: 48px;
            border-radius: 14px;
            margin-block: 6px;
            transition: all 0.2s ease;
          }

          .premium-sider .ant-menu-item .ant-menu-item-icon {
            font-size: 18px;
          }

          .premium-sider .ant-menu-item:hover {
            background: rgba(255, 255, 255, 0.08) !important;
            transform: translateX(2px);
          }

          .premium-sider .ant-menu-item-selected {
            background: linear-gradient(90deg, #1677ff 0%, #4096ff 100%) !important;
            box-shadow: 0 8px 20px rgba(22, 119, 255, 0.28);
          }

          .premium-sider .ant-menu-item-selected::after {
            display: none !important;
          }

          .premium-account:hover {
            background: #f8fafc;
          }

          .premium-drawer .ant-drawer-body {
            padding: 0 !important;
            background: linear-gradient(180deg, #020617 0%, #0f172a 100%) !important;
          }
        `}
      </style>

      {!isMobile && (
        <Sider
          theme="dark"
          collapsible
          collapsed={collapsed}
          trigger={null}
          width={248}
          collapsedWidth={88}
          className="premium-sider"
          style={{
            boxShadow: "2px 0 12px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          {sidebarMenu}
        </Sider>
      )}

      {isMobile && (
        <Drawer
          title={null}
          placement="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          closable={false}
          width={248}
          className="premium-drawer"
        >
          {sidebarMenu}
        </Drawer>
      )}

      <Layout style={{ background: "#f5f7fb", transition: "all 0.28s ease" }}>
        <Header
          style={{
            background: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: isMobile ? "0 16px" : "0 24px",
            borderBottom: "1px solid #eef2f7",
            height: 76,
            lineHeight: "normal",
          }}
        >
          <Space align="center" size={16}>
            {isMobile ? (
              <Button
                type="text"
                icon={<MenuUnfoldOutlined style={{ fontSize: 18 }} />}
                onClick={() => setMobileOpen(true)}
              />
            ) : collapsed ? (
              <Button
                type="text"
                icon={<MenuUnfoldOutlined style={{ fontSize: 18 }} />}
                onClick={() => handleCollapsedChange(false)}
              />
            ) : null}

            <Space direction="vertical" size={4}>
              <Text
                strong
                style={{
                  fontSize: isMobile ? 16 : 18,
                  color: "#111827",
                }}
              >
                Panel principal
              </Text>

              <Space align="center" size={10} wrap>
                <Text
                  strong
                  style={{
                    fontSize: isMobile ? 14 : 16,
                    color: "#1f2937",
                  }}
                >
                  {displayOrganization}
                </Text>

                <Tag
                  color={roleColor}
                  style={{
                    marginInlineEnd: 0,
                    paddingInline: 10,
                    borderRadius: 999,
                    fontWeight: 600,
                  }}
                >
                  {displayRole}
                </Tag>
              </Space>
            </Space>
          </Space>

          <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
            <Space
              size={10}
              className="premium-account"
              style={{
                cursor: "pointer",
                padding: isMobile ? "6px 8px" : "8px 12px",
                borderRadius: 14,
                transition: "background 0.2s ease",
              }}
            >
              <Avatar
                size={isMobile ? 36 : 40}
                icon={<UserOutlined />}
                style={{ backgroundColor: "#e5e7eb", color: "#6b7280" }}
              />
              {!isMobile && (
                <Space direction="vertical" size={0}>
                  <Text strong style={{ color: "#111827" }}>
                    Mi cuenta
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Sesión activa
                  </Text>
                </Space>
              )}
            </Space>
          </Dropdown>
        </Header>

        <Content style={{ margin: isMobile ? 16 : 24 }}>
          <div
            style={{
              minHeight: isMobile ? "calc(100vh - 108px)" : "calc(100vh - 124px)",
              background: "#ffffff",
              borderRadius: 20,
              padding: isMobile ? 18 : 28,
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
              transition: "all 0.28s ease",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}