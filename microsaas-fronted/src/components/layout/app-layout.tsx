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
  CreditCardOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BulbOutlined,
  ShareAltOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../app/store/auth.store";
import { useThemeStore } from "../../app/store/theme.store";
import { useCurrentUser } from "../../features/users/hooks/use-current-user";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const formatOrganizationName = (value: string) => {
  if (!value) return "Organización";

  return value
    .replace(/^tenant[_-]?/i, "")
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const roleMap: Record<string, string> = {
  OWNER: "Propietario",
  ADMIN: "Administrador",
  EDITOR: "Editor",
  VIEWER: "Visualizador",
  USER: "Usuario",
  SUPER_ADMIN: "Super administrador",
};

const roleColorMap: Record<string, string> = {
  OWNER: "blue",
  ADMIN: "purple",
  EDITOR: "green",
  VIEWER: "default",
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
  const userId = useAuthStore((state) => state.userId);

  const { data: currentUser } = useCurrentUser(userId);

 const [cachedUser, setCachedUser] = useState<typeof currentUser | null>(() => {
  const saved = localStorage.getItem("current_user");

  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    localStorage.removeItem("current_user");
    return null;
  }
});

useEffect(() => {
  if (currentUser?.name || currentUser?.email) {
    setCachedUser(currentUser);
    localStorage.setItem("current_user", JSON.stringify(currentUser));
  }
}, [currentUser]);

  const { mode, toggleTheme } = useThemeStore();
  const isDark = mode === "dark";

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
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  const items: MenuProps["items"] = useMemo(() => {
    const baseItems: MenuProps["items"] = [
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
        key: "/app/billing",
        icon: <CreditCardOutlined />,
        label: "Billing",
        title: "Billing",
      },
      {
        key: "/app/referrals",
        icon: <ShareAltOutlined />,
        label: "Referrals",
        title: "Referrals",
      },
    ];

    if (role === "OWNER" || role === "ADMIN") {
      baseItems.splice(6, 0, {
        key: "/app/users",
        icon: <UserOutlined />,
        label: "Users",
        title: "Users",
      });
    }

    return baseItems;
  }, [role]);

  const displayOrganization = formatOrganizationName(schema || "Organización");
  const displayRole = roleMap[role || "USER"] || "Usuario";
  const roleColor = roleColorMap[role || "USER"] || "default";

  const displayName =
    currentUser?.name?.trim() ||
    cachedUser?.name?.trim() ||
    "Mi cuenta";

  const displayEmail =
    currentUser?.email?.trim() ||
    cachedUser?.email?.trim() ||
    "Sesión activa";

  const avatarInitial =
    (currentUser?.name || cachedUser?.name)?.trim()?.charAt(0)?.toUpperCase() ||
    (currentUser?.email || cachedUser?.email)?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  const userMenuItems: MenuProps["items"] = [
    {
      key: "account",
      icon: <UserOutlined />,
      label: "Mi cuenta",
      onClick: () => navigate("/app/account"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Ajustes",
      onClick: () => navigate("/app/settings"),
    },
    {
      key: "billing",
      icon: <CreditCardOutlined />,
      label: "Billing",
      onClick: () => navigate("/app/billing"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Cerrar sesión",
      danger: true,
      onClick: () => {
      localStorage.removeItem("current_user");
      logout();
      navigate("/auth/login");
    },
    },
  ];

  const sidebarMenu = (
    <>
      <div
        style={{
          height: 84,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "0 16px" : collapsed ? "0 16px" : "0 18px",
          borderBottom: isDark
            ? "1px solid rgba(148, 163, 184, 0.12)"
            : "1px solid rgba(15, 23, 42, 0.08)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: collapsed && !isMobile ? 0 : 12,
            width: "100%",
            minWidth: 0,
          }}
        >
          <img
            src="/taloslogo.png"
            alt="TalosFlow"
            style={{
              width: collapsed && !isMobile ? 40 : 42,
              height: collapsed && !isMobile ? 40 : 42,
              borderRadius: 12,
              objectFit: "cover",
              boxShadow: isDark
                ? "0 8px 24px rgba(99, 102, 241, 0.28)"
                : "0 8px 24px rgba(99, 102, 241, 0.18)",
              flexShrink: 0,
            }}
          />

          {!collapsed && !isMobile && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.05,
                minWidth: 0,
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: isDark ? "#ffffff" : "#0f172a",
                  letterSpacing: -0.6,
                  whiteSpace: "nowrap",
                }}
              >
                TalosFlow
              </span>

              <span
                style={{
                  fontSize: 12,
                  color: isDark ? "#94a3b8" : "#64748b",
                  marginTop: 4,
                  whiteSpace: "nowrap",
                }}
              >
                Social AI Platform
              </span>
            </div>
          )}
        </div>

        {isMobile ? (
          <Button
            type="text"
            icon={
              <MenuFoldOutlined
                style={{
                  color: isDark ? "#fff" : "#0f172a",
                  fontSize: 18,
                }}
              />
            }
            onClick={() => setMobileOpen(false)}
          />
        ) : !collapsed ? (
          <Button
            type="text"
            icon={
              <MenuFoldOutlined
                style={{
                  color: isDark ? "#fff" : "#0f172a",
                  fontSize: 18,
                }}
              />
            }
            onClick={() => handleCollapsedChange(true)}
          />
        ) : null}
      </div>

      <div style={{ paddingTop: 10, flex: 1, overflow: "auto" }}>
        <Menu
          theme={isDark ? "dark" : "light"}
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
      </div>
    </>
  );

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(135deg, #020617, #0f172a)"
          : "#f5f7fb",
      }}
    >
      <style>
        {`
          .premium-sider {
            background: ${
              isDark
                ? "linear-gradient(180deg, #020617 0%, #0f172a 100%)"
                : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)"
            } !important;
            transition: all 0.28s ease !important;
            border-right: ${
              isDark
                ? "1px solid rgba(148, 163, 184, 0.12)"
                : "1px solid rgba(15, 23, 42, 0.08)"
            };
          }

          .premium-sider .ant-layout-sider-children {
            display: flex;
            flex-direction: column;
            height: 100%;
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
            color: ${isDark ? "#cbd5e1" : "#334155"} !important;
          }

          .premium-sider .ant-menu-item .ant-menu-item-icon {
            font-size: 18px;
            color: ${isDark ? "#cbd5e1" : "#334155"} !important;
          }

          .premium-sider .ant-menu-item:hover {
            background: ${
              isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(99, 102, 241, 0.08)"
            } !important;
            transform: translateX(2px);
            color: ${isDark ? "#ffffff" : "#111827"} !important;
          }

          .premium-sider .ant-menu-item:hover .ant-menu-item-icon {
            color: ${isDark ? "#ffffff" : "#111827"} !important;
          }

          .premium-sider .ant-menu-item-selected {
            background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%) !important;
            box-shadow: 0 8px 20px rgba(99, 102, 241, 0.28);
            color: #ffffff !important;
          }

          .premium-sider .ant-menu-item-selected .ant-menu-item-icon {
            color: #ffffff !important;
          }

          .premium-sider .ant-menu-item-selected::after {
            display: none !important;
          }

          .premium-account:hover {
            background: ${
              isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(15, 23, 42, 0.04)"
            };
          }

          .premium-drawer .ant-drawer-content {
            background: ${
              isDark
                ? "linear-gradient(180deg, #020617 0%, #0f172a 100%)"
                : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)"
            } !important;
          }

          .premium-drawer .ant-drawer-body {
            padding: 0 !important;
            background: ${
              isDark
                ? "linear-gradient(180deg, #020617 0%, #0f172a 100%)"
                : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)"
            } !important;
          }

          .premium-user-dropdown .ant-dropdown-menu {
            background: ${isDark ? "#0f172a" : "#ffffff"} !important;
            border: 1px solid ${isDark ? "#1e293b" : "#e2e8f0"} !important;
            box-shadow: 0 12px 30px rgba(0,0,0,0.18) !important;
            border-radius: 14px !important;
            padding: 8px !important;
          }

          .premium-user-dropdown .ant-dropdown-menu-item {
            color: ${isDark ? "#e2e8f0" : "#0f172a"} !important;
            border-radius: 10px !important;
          }

          .premium-user-dropdown .ant-dropdown-menu-item:hover {
            background: ${
              isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.05)"
            } !important;
          }

          .premium-user-dropdown .ant-dropdown-menu-item-danger {
            color: #f87171 !important;
          }

          .premium-user-dropdown .ant-dropdown-menu-item-danger:hover {
            background: rgba(248,113,113,0.12) !important;
          }
        `}
      </style>

      {!isMobile && (
        <Sider
          theme={isDark ? "dark" : "light"}
          collapsible
          collapsed={collapsed}
          trigger={null}
          width={248}
          collapsedWidth={88}
          className="premium-sider"
          style={{
            boxShadow: isDark
              ? "2px 0 18px rgba(0,0,0,0.18)"
              : "2px 0 18px rgba(15,23,42,0.06)",
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

      <Layout
        style={{
          background: "transparent",
          transition: "all 0.28s ease",
        }}
      >
        <Header
          style={{
            background: isDark ? "rgba(2, 6, 23, 0.82)" : "rgba(255,255,255,0.82)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: isMobile ? "0 16px" : "0 24px",
            borderBottom: isDark
              ? "1px solid rgba(148, 163, 184, 0.12)"
              : "1px solid rgba(15, 23, 42, 0.08)",
            height: 76,
            lineHeight: "normal",
          }}
        >
          <Space align="center" size={16}>
            {isMobile ? (
              <Button
                type="text"
                icon={
                  <MenuUnfoldOutlined
                    style={{ fontSize: 18, color: isDark ? "#ffffff" : "#0f172a" }}
                  />
                }
                onClick={() => setMobileOpen(true)}
              />
            ) : collapsed ? (
              <Button
                type="text"
                icon={
                  <MenuUnfoldOutlined
                    style={{ fontSize: 18, color: isDark ? "#ffffff" : "#0f172a" }}
                  />
                }
                onClick={() => handleCollapsedChange(false)}
              />
            ) : null}

            <Space direction="vertical" size={4}>
              <Text
                strong
                style={{
                  fontSize: isMobile ? 16 : 18,
                  color: isDark ? "#ffffff" : "#0f172a",
                }}
              >
                Panel principal
              </Text>

              <Space align="center" size={10} wrap>
                <Text
                  strong
                  style={{
                    fontSize: isMobile ? 14 : 16,
                    color: isDark ? "#e2e8f0" : "#334155",
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

          <Space align="center" size={10}>
            <Button
              type="text"
              onClick={toggleTheme}
              icon={
                <BulbOutlined
                  style={{
                    fontSize: 18,
                    color: isDark ? "#facc15" : "#6366f1",
                  }}
                />
              }
            />

            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={["click"]}
              overlayClassName="premium-user-dropdown"
            >
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
                  style={{
                    backgroundColor: isDark ? "#1e293b" : "#e2e8f0",
                    color: isDark ? "#cbd5e1" : "#334155",
                    border: isDark
                      ? "1px solid rgba(148, 163, 184, 0.18)"
                      : "1px solid rgba(15, 23, 42, 0.08)",
                    fontWeight: 700,
                  }}
                >
                  {avatarInitial}
                </Avatar>

                {!isMobile && (
                  <Space
                    direction="vertical"
                    size={0}
                    style={{ minWidth: 0, lineHeight: 1.1 }}
                  >
                    <Text
                      strong
                      style={{
                        color: isDark ? "#ffffff" : "#0f172a",
                        maxWidth: 180,
                      }}
                      ellipsis
                    >
                      {displayName}
                    </Text>

                    <Text
                      style={{
                        fontSize: 12,
                        color: isDark ? "#94a3b8" : "#64748b",
                        maxWidth: 180,
                      }}
                      ellipsis
                    >
                      {displayEmail}
                    </Text>
                  </Space>
                )}
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ margin: isMobile ? 16 : 20 }}>
          <div
            style={{
              minHeight: isMobile ? "calc(100vh - 108px)" : "calc(100vh - 116px)",
              background: "transparent",
              borderRadius: 20,
              padding: 0,
              boxShadow: "none",
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