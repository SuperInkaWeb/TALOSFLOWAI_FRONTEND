import { useState } from "react";
import { Button, Card, Form, Input, Typography, message, Space } from "antd";
import { Navigate, useNavigate } from "react-router-dom";
import { platformAuthService } from "../../../services/platform-auth.service";
import { useAuthStore } from "../../../app/store/auth.store";

const { Title, Text } = Typography;

type FormValues = {
  email: string;
  password: string;
};

export function PlatformLoginPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const scope = useAuthStore((state) => state.scope);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated && scope === "PLATFORM") {
    return <Navigate to="/platform/organizations" replace />;
  }

  const onFinish = async (values: FormValues) => {
    if (loading) return;

    try {
      setLoading(true);

      const response = await platformAuthService.login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      setToken(response.token);
      message.success("Sesión iniciada");
      navigate("/platform/organizations");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "No se pudo iniciar sesión en platform";

      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(circle at top, rgba(124,58,237,0.18) 0%, #08101f 38%, #030712 100%)",
        padding: 24,
      }}
    >
      <Card
        style={{
          width: 440,
          maxWidth: "100%",
          borderRadius: 20,
          background: "rgba(8,16,31,0.88)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 20px 70px rgba(0,0,0,0.35)",
          backdropFilter: "blur(12px)",
        }}
        styles={{
          body: {
            padding: 28,
          },
        }}
      >
        <Space
          direction="vertical"
          size={18}
          style={{ width: "100%", marginBottom: 8 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src="/taloslogo.png"
              alt="TalosFlow AI"
              style={{
                width: 44,
                height: 44,
                objectFit: "contain",
                borderRadius: 12,
              }}
            />
            <div>
              <Title level={3} style={{ margin: 0, color: "#ffffff" }}>
                TalosFlow AI
              </Title>
              <Text style={{ color: "#94a3b8" }}>
                Acceso administrativo de plataforma
              </Text>
            </div>
          </div>

          <div>
            <Title level={2} style={{ color: "#ffffff", marginBottom: 6 }}>
              Platform Admin
            </Title>
            <Text style={{ color: "#94a3b8" }}>
              Inicia sesión como superadmin para gestionar organizaciones,
              seguridad y operaciones globales.
            </Text>
          </div>
        </Space>

        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 24 }}
          disabled={loading}
        >
          <Form.Item
            label={<span style={{ color: "#e2e8f0" }}>Correo</span>}
            name="email"
            rules={[
              { required: true, message: "Ingresa tu correo" },
              { type: "email", message: "Ingresa un correo válido" },
            ]}
          >
            <Input
              placeholder="admin@talosflow.ai"
              size="large"
              disabled={loading}
              style={{ borderRadius: 12 }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#e2e8f0" }}>Contraseña</span>}
            name="password"
            rules={[{ required: true, message: "Ingresa tu contraseña" }]}
          >
            <Input.Password
              placeholder="Ej: Admin123"
              size="large"
              disabled={loading}
              style={{ borderRadius: 12 }}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            disabled={loading}
            style={{
              marginTop: 8,
              height: 46,
              borderRadius: 12,
            }}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </Form>
      </Card>
    </div>
  );
}