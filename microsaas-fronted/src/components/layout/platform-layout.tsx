import { Layout, Menu, Typography, Button, Space, Avatar } from "antd";
import {
  ApartmentOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../app/store/auth.store";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export function PlatformLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const selectedKey = location.pathname.startsWith("/platform/organizations")
    ? "organizations"
    : location.pathname.startsWith("/platform/security")
    ? "security"
    : "";

  const handleLogout = () => {
    logout();
    navigate("/platform/login");
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#020617" }}>
      <Sider
        width={260}
        style={{
          background: "#0b1220",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            padding: 20,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Space align="start" size="middle">
            <Avatar
              src="/taloslogo.png"
              shape="square"
              size={44}
              style={{ borderRadius: 12 }}
            />
            <div>
              <Title level={4} style={{ color: "white", margin: 0 }}>
                TalosFlow AI
              </Title>
              <Text style={{ color: "#94a3b8" }}>Platform Admin</Text>
            </div>
          </Space>
        </div>

        <div style={{ padding: 12 }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{
              background: "transparent",
              borderInlineEnd: "none",
            }}
            items={[
              {
                key: "organizations",
                icon: <ApartmentOutlined />,
                label: (
                  <Link to="/platform/organizations">Organizaciones</Link>
                ),
              },
              {
                key: "security",
                icon: <SafetyCertificateOutlined />,
                label: <Link to="/platform/security">Seguridad</Link>,
              },
            ]}
          />
        </div>
      </Sider>

      <Layout style={{ background: "#f8fafc" }}>
        <Header
          style={{
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid #e2e8f0",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Space size="middle">
            <DashboardOutlined style={{ color: "#334155" }} />
            <Text style={{ color: "#334155", fontWeight: 500 }}>
              Panel global de administración
            </Text>
          </Space>

          <Space>
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Space>
        </Header>

        <Content
          style={{
            padding: 24,
            background:
              "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
            minHeight: 0,
          }}
        >
          <div
            style={{
              minHeight: "calc(100vh - 112px)",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}