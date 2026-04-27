import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Typography,
  message,
  Space,
} from "antd";
import { Link } from "react-router-dom";
import type { AxiosError } from "axios";
import { api } from "../services/api";

type ForgotPasswordForm = {
  slug: string;
  email: string;
};

type ApiErrorResponse = {
  error?: string;
  message?: string;
};

const { Title, Text } = Typography;

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onFinish = async (values: ForgotPasswordForm) => {
    if (loading) return;

    try {
      setLoading(true);
      setSuccessMessage(null);

      const response = await api.post("/auth/forgot-password", {
        slug: values.slug.trim().toLowerCase(),
        email: values.email.trim().toLowerCase(),
      });

      setSuccessMessage(
        response.data?.message ||
          "Si existe una cuenta, recibirás un correo con instrucciones."
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const backendMessage =
        axiosError.response?.data?.message ||
        "No se pudo procesar la solicitud";

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
        styles={{ body: { padding: 28 } }}
      >
        {/* HEADER */}
        <Space direction="vertical" size={18} style={{ width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src="/taloslogo.png"
              alt="TalosFlow AI"
              style={{ width: 44, height: 44, borderRadius: 12 }}
            />
            <div>
              <Title level={3} style={{ margin: 0, color: "#fff" }}>
                TalosFlow AI
              </Title>
              <Text style={{ color: "#94a3b8" }}>
                Recupera el acceso a tu cuenta
              </Text>
            </div>
          </div>

          <div>
            <Title level={2} style={{ color: "#fff", marginBottom: 6 }}>
              Recuperar contraseña
            </Title>
            <Text style={{ color: "#94a3b8" }}>
              Te enviaremos un enlace seguro para restablecer tu contraseña.
            </Text>
          </div>
        </Space>

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <Alert
            type="success"
            showIcon
            message={successMessage}
            style={{
              marginTop: 16,
              borderRadius: 12,
            }}
          />
        )}

        {/* FORM */}
        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 24 }}>
          <Form.Item
            label={<span style={{ color: "#e2e8f0" }}>Slug de la organización</span>}
            name="slug"
            rules={[
              { required: true, message: "Ingresa el slug de tu organización" },
            ]}
          >
            <Input placeholder="talos-agency" size="large" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#e2e8f0" }}>Correo</span>}
            name="email"
            rules={[
              { required: true, message: "Ingresa tu correo" },
              { type: "email", message: "Correo inválido" },
            ]}
          >
            <Input placeholder="carlos@talosflow.ai" size="large" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            Enviar enlace
          </Button>
        </Form>

        {/* FOOTER */}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Text style={{ color: "#94a3b8" }}>
            ¿Recordaste tu contraseña?{" "}
            <Link to="/auth/login">Volver al login</Link>
          </Text>
        </div>

        <div style={{ marginTop: 12, textAlign: "center" }}>
          <Text style={{ color: "#94a3b8" }}>
            <Link to="/">Volver al inicio</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}