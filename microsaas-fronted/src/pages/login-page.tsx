import { useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  message,
  Alert,
  Space,
} from "antd";
import { Link, Navigate, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { api } from "../services/api";
import { useAuthStore } from "../app/store/auth.store";

type LoginForm = {
  slug: string;
  email: string;
  password: string;
};

type ApiErrorResponse = {
  error?: string;
  message?: string;
};

const { Title, Text } = Typography;

export function LoginPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [loading, setLoading] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const isBlocked = params.get("blocked") === "1";

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  const onFinish = async (values: LoginForm) => {
    if (loading) return;

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        slug: values.slug.trim().toLowerCase(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      const token = response.data.token;
      setToken(token);

      message.success("Inicio de sesión correcto");
      navigate("/app/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const apiError = axiosError.response?.data?.error;
      const backendMessage =
        axiosError.response?.data?.message || "No se pudo iniciar sesión";

      if (apiError === "ORGANIZATION_ACCESS_BLOCKED") {
        return;
      }

      message.error(backendMessage);
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
          "radial-gradient(circle at top, rgba(22,119,255,0.18) 0%, #08101f 38%, #030712 100%)",
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
                Accede a tu espacio de trabajo
              </Text>
            </div>
          </div>

          <div>
            <Title level={2} style={{ color: "#ffffff", marginBottom: 6 }}>
              Iniciar sesión
            </Title>
            <Text style={{ color: "#94a3b8" }}>
              Gestiona tu contenido, tus páginas y tu automatización desde un solo lugar.
            </Text>
          </div>
        </Space>

        {isBlocked && (
          <Alert
            type="error"
            showIcon
            message="Acceso bloqueado"
            description="Tu organización está suspendida o inactiva. Contacta al administrador."
            style={{
              marginBottom: 16,
              borderRadius: 12,
            }}
          />
        )}

        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 24 }}
          disabled={loading}
        >
          <Form.Item
            label={
              <span style={{ color: "#e2e8f0" }}>
                Slug de la organización
              </span>
            }
            name="slug"
            rules={[
              {
                required: true,
                message: "Ingresa el slug de tu organización",
              },
            ]}
          >
            <Input
              placeholder="talos-agency"
              disabled={loading}
              size="large"
              style={{
                borderRadius: 12,
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#e2e8f0" }}>Correo</span>}
            name="email"
            rules={[
              { required: true, message: "Ingresa tu correo" },
              { type: "email", message: "Ingresa un correo válido" },
            ]}
          >
            <Input
              placeholder="carlos@talosflow.ai"
              disabled={loading}
              size="large"
              style={{
                borderRadius: 12,
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#e2e8f0" }}>Contraseña</span>}
            name="password"
            rules={[{ required: true, message: "Ingresa tu contraseña" }]}
          >
            <Input.Password
              placeholder="Ej: Talos123"
              disabled={loading}
              size="large"
              style={{
                borderRadius: 12,
              }}
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
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <div style={{ marginTop: 12, textAlign: "right" }}>
            <Link to="/auth/forgot-password">¿Olvidaste tu contraseña?</Link>
          </div>
        </Form>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Text style={{ color: "#94a3b8" }}>
            ¿No tienes cuenta? <Link to="/auth/signup">Crear organización</Link>
          </Text>
        </div>

        <div style={{ marginTop: 12, textAlign: "center" }}>
          <Text style={{ color: "#94a3b8" }}>
            ¿Quieres conocer la plataforma? <Link to="/">Ver landing</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}