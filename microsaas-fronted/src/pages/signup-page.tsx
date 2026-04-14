import { useEffect, useState } from "react";
import { Button, Card, Form, Input, Typography, message, Alert } from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { AxiosError } from "axios";
import { api } from "../services/api";
import { useAuthStore } from "../app/store/auth.store";

type SignupForm = {
  orgName: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (referralCodeFromUrl) {
    const code = referralCodeFromUrl.trim().toUpperCase();

    localStorage.setItem("referral_code", code);
    setReferralCodeStored(code); // 👈 fuerza render inmediato
  } else {
    localStorage.removeItem("referral_code");
    setReferralCodeStored(null); // 👈 limpia UI sin refresh
  }
}, [referralCodeFromUrl]);


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
      referralCode, // 👈 🔥 ESTE ES EL FIX
    });

    const loginResponse = await api.post("/auth/login", {
      slug: normalizedSlug,
      email: normalizedEmail,
      password: values.ownerPassword,
    });

    const token = loginResponse.data.token;
    setToken(token);

    // 🧹 limpiar referral después de éxito
    localStorage.removeItem("referral_code");
    setReferralCodeStored(null);

    message.success("Organización creada e inicio de sesión correcto");
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
        background: "#f5f7fb",
        padding: 24,
      }}
    >
      <Card style={{ width: 520, borderRadius: 16 }}>
        <Title level={2}>Crear organización</Title>
        <Text type="secondary">Comienza a usar Qoribex</Text>
        {referralCodeStored && (
            <Alert
              style={{ marginTop: 16 }}
              type="info"
              showIcon
              message="Registro con referido"
              description={`Estás usando el código ${referralCodeStored}. Podrás recibir beneficios 🎁`}
            />
          )}

        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 24 }}
          disabled={loading}
        >
          <Form.Item
            label="Nombre de la organización"
            name="orgName"
            rules={[{ required: true, message: "Ingresa el nombre" }]}
          >
            <Input placeholder="Empresa Xbox" disabled={loading} />
          </Form.Item>

          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: "Ingresa el slug" }]}
          >
            <Input placeholder="xbox" disabled={loading} />
          </Form.Item>

          <Form.Item
            label="Nombre del propietario"
            name="ownerName"
            rules={[{ required: true, message: "Ingresa el nombre del owner" }]}
          >
            <Input placeholder="Alexis Chuisaca" disabled={loading} />
          </Form.Item>

          <Form.Item
            label="Correo del propietario"
            name="ownerEmail"
            rules={[
              { required: true, message: "Ingresa el correo" },
              { type: "email", message: "Correo inválido" },
            ]}
          >
            <Input placeholder="anarea@xboxone.com" disabled={loading} />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="ownerPassword"
            rules={[{ required: true, message: "Ingresa la contraseña" }]}
          >
            <Input.Password placeholder="********" disabled={loading} />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            disabled={loading}
          >
            {loading ? "Creando organización e ingresando..." : "Crear cuenta"}
          </Button>
        </Form>

        <div style={{ marginTop: 16 }}>
          <Text>
            ¿Ya tienes cuenta? <Link to="/auth/login">Inicia sesión</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}