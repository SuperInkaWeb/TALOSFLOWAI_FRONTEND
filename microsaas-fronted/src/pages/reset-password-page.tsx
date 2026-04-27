import { useMemo, useState } from "react";
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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { AxiosError } from "axios";
import { api } from "../services/api";

type ResetPasswordForm = {
  newPassword: string;
  confirmPassword: string;
};

type ApiErrorResponse = {
  error?: string;
  message?: string;
};

const { Title, Text } = Typography;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<ResetPasswordForm>();

  const token = searchParams.get("token") || "";

  const hasRequiredParams = useMemo(() => {
    return token.trim().length > 0;
  }, [token]);

  const onFinish = async (values: ResetPasswordForm) => {
    if (loading || !hasRequiredParams) return;

    try {
      setLoading(true);

      const response = await api.post("/auth/reset-password", {
        token: token.trim(),
        newPassword: values.newPassword,
      });

      message.success(
        response.data?.message || "Tu contraseña fue actualizada correctamente"
      );

      navigate("/auth/login");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const backendMessage =
        axiosError.response?.data?.message ||
        "No se pudo restablecer la contraseña";

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
                Protege tu acceso a la plataforma
              </Text>
            </div>
          </div>

          <div>
            <Title level={2} style={{ color: "#ffffff", marginBottom: 6 }}>
              Nueva contraseña
            </Title>
            <Text style={{ color: "#94a3b8" }}>
              Crea una nueva contraseña segura para tu cuenta.
            </Text>
          </div>
        </Space>

        {!hasRequiredParams && (
          <Alert
            type="error"
            showIcon
            message="Enlace inválido"
            description="El enlace no contiene un token válido o ha sido modificado."
            style={{
              marginTop: 16,
              marginBottom: 8,
              borderRadius: 12,
            }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 24 }}
          disabled={loading || !hasRequiredParams}
        >
          <Form.Item
            label={<span style={{ color: "#e2e8f0" }}>Nueva contraseña</span>}
            name="newPassword"
            rules={[
              { required: true, message: "Ingresa una nueva contraseña" },
              { min: 8, message: "Debe tener al menos 8 caracteres" },
              {
                pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
                message: "Debe incluir mayúscula, minúscula y número",
              },
            ]}
            extra={
              <span style={{ color: "#94a3b8", fontSize: 12 }}>
                Mínimo 8 caracteres, con mayúscula, minúscula y número
              </span>
            }
          >
            <Input.Password
              placeholder="Ej: Talos123"
              size="large"
              style={{ borderRadius: 12 }}
            />
          </Form.Item>

          <Form.Item
            label={
              <span style={{ color: "#e2e8f0" }}>Confirmar contraseña</span>
            }
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Confirma tu nueva contraseña" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Las contraseñas no coinciden")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Repite tu nueva contraseña"
              size="large"
              style={{ borderRadius: 12 }}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            disabled={!hasRequiredParams}
            style={{
              marginTop: 8,
              height: 46,
              borderRadius: 12,
            }}
          >
            Guardar nueva contraseña
          </Button>
        </Form>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Text style={{ color: "#94a3b8" }}>
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