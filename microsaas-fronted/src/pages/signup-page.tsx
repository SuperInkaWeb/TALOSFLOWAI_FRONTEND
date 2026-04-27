import { useEffect, useState } from "react";
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
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import type { AxiosError } from "axios";
import { api } from "../services/api";
import { useAuthStore } from "../app/store/auth.store";

type SignupForm = {
  orgName: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
  confirmPassword: string;
};

type ApiErrorResponse = {
  message?: string;
};

const { Title, Text } = Typography;

export function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCodeFromUrl = searchParams.get("ref");
  const [referralCodeStored, setReferralCodeStored] = useState<string | null>(null);
  const setToken = useAuthStore((state) => state.setToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (referralCodeFromUrl) {
      const code = referralCodeFromUrl.trim().toUpperCase();
      localStorage.setItem("referral_code", code);
      setReferralCodeStored(code);
    } else {
      const savedCode = localStorage.getItem("referral_code");
      setReferralCodeStored(savedCode?.toUpperCase() || null);
    }
  }, [referralCodeFromUrl]);

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  const onFinish = async (values: SignupForm) => {
    if (loading) return;

    const normalizedSlug = values.slug.trim().toLowerCase();
    const normalizedEmail = values.ownerEmail.trim().toLowerCase();

    try {
      setLoading(true);

      const referralCode =
        referralCodeStored?.trim().toUpperCase() || undefined;

      await api.post("/organizations", {
        ...values,
        slug: normalizedSlug,
        ownerEmail: normalizedEmail,
        referralCode,
      });

      const loginResponse = await api.post("/auth/login", {
        slug: normalizedSlug,
        email: normalizedEmail,
        password: values.ownerPassword,
      });

      const token = loginResponse.data.token;
      setToken(token);

      localStorage.removeItem("referral_code");
      setReferralCodeStored(null);

      message.success("Cuenta creada correctamente 🚀");
      navigate("/app/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const backendMessage =
        axiosError.response?.data?.message ||
        "No se pudo crear la organización";

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
          width: 540,
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
                Automatiza tu contenido con IA
              </Text>
            </div>
          </div>

          <div>
            <Title level={2} style={{ color: "#fff", marginBottom: 6 }}>
              Crear organización
            </Title>
            <Text style={{ color: "#94a3b8" }}>
              Configura tu espacio de trabajo en minutos
            </Text>
          </div>
        </Space>

        {referralCodeStored && (
          <Alert
            style={{ marginTop: 16, borderRadius: 12 }}
            type="info"
            showIcon
            message="Registro con referido"
            description={`Código aplicado: ${referralCodeStored}`}
          />
        )}

        {/* FORM */}
        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 24 }}>
          <Form.Item
            label={<span style={{ color: "#e2e8f0" }}>Nombre de la organización</span>}
            name="orgName"
            rules={[{ required: true, message: "Ingresa el nombre" }]}
          >
            <Input placeholder="Talos Marketing Agency" size="large" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#e2e8f0" }}>Slug</span>}
            name="slug"
            rules={[
              { required: true, message: "Ingresa el slug" },
              {
                pattern: /^[a-z0-9-]+$/,
                message: "Solo minúsculas, números y guiones",
              },
            ]}
          >
            <Input placeholder="talos-agency" size="large" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#e2e8f0" }}>Nombre del propietario</span>}
            name="ownerName"
            rules={[{ required: true, message: "Ingresa tu nombre" }]}
          >
            <Input placeholder="Carlos Mendoza" size="large" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#e2e8f0" }}>Correo</span>}
            name="ownerEmail"
            rules={[
              { required: true, message: "Ingresa el correo" },
              { type: "email", message: "Correo inválido" },
            ]}
          >
            <Input placeholder="carlos@talosflow.ai" size="large" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#e2e8f0" }}>Contraseña</span>}
            name="ownerPassword"
            rules={[
              { required: true },
              { min: 8, message: "Mínimo 8 caracteres" },
              {
                pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
                message: "Debe incluir mayúscula, minúscula y número",
              },
            ]}
            extra="Mínimo 8 caracteres, con mayúscula, minúscula y número"
          >
            <Input.Password placeholder="Ej: Talos123" size="large" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#e2e8f0" }}>Confirmar contraseña</span>}
            name="confirmPassword"
            dependencies={["ownerPassword"]}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("ownerPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Las contraseñas no coinciden");
                },
              }),
            ]}
          >
            <Input.Password placeholder="Repite tu contraseña" size="large" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            Crear cuenta
          </Button>
        </Form>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Text style={{ color: "#94a3b8" }}>
            ¿Ya tienes cuenta? <Link to="/auth/login">Inicia sesión</Link>
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