import { useState } from "react";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { api } from "../services/api";
import { useAuthStore } from "../app/store/auth.store";

type LoginForm = {
  slug: string;
  email: string;
  password: string;
};

type ApiErrorResponse = {
  message?: string;
};

const { Title, Text } = Typography;

export function LoginPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const [loading, setLoading] = useState(false);

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
      const backendMessage =
        axiosError.response?.data?.message || "No se pudo iniciar sesión";

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
        background: "#f5f7fb",
        padding: 24,
      }}
    >
      <Card style={{ width: 420, borderRadius: 16 }}>
        <Title level={2}>Iniciar sesión</Title>
        <Text type="secondary">Accede a tu panel Qoribex</Text>

        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 24 }}
          disabled={loading}
        >
          <Form.Item
            label="Slug de la organización"
            name="slug"
            rules={[
              {
                required: true,
                message: "Ingresa el slug de tu organización",
              },
            ]}
          >
            <Input placeholder="tesalia" disabled={loading} />
          </Form.Item>

          <Form.Item
            label="Correo"
            name="email"
            rules={[
              { required: true, message: "Ingresa tu correo" },
              { type: "email", message: "Ingresa un correo válido" },
            ]}
          >
            <Input placeholder="correo@empresa.com" disabled={loading} />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: "Ingresa tu contraseña" }]}
          >
            <Input.Password placeholder="********" disabled={loading} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </Form>

        <div style={{ marginTop: 16 }}>
          <Text>
            ¿No tienes cuenta? <Link to="/auth/signup">Crear organización</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}