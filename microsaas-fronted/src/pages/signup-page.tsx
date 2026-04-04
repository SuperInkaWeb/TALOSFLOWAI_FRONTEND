import { Button, Card, Form, Input, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

type SignupForm = {
  orgName: string;
  slug: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
};

const { Title, Text } = Typography;

export function SignupPage() {
  const navigate = useNavigate();

  const onFinish = async (values: SignupForm) => {
    try {
      await api.post("/organizations", values);
      message.success("Organización creada correctamente");
      navigate("/auth/login");
    } catch {
      message.error("No se pudo crear la organización");
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

        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 24 }}>
          <Form.Item
            label="Nombre de la organización"
            name="orgName"
            rules={[{ required: true, message: "Ingresa el nombre" }]}
          >
            <Input placeholder="Empresa Xbox" />
          </Form.Item>

          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: "Ingresa el slug" }]}
          >
            <Input placeholder="xbox" />
          </Form.Item>

          <Form.Item
            label="Nombre del propietario"
            name="ownerName"
            rules={[{ required: true, message: "Ingresa el nombre del owner" }]}
          >
            <Input placeholder="Alexis Chuisaca" />
          </Form.Item>

          <Form.Item
            label="Correo del propietario"
            name="ownerEmail"
            rules={[{ required: true, message: "Ingresa el correo" }]}
          >
            <Input placeholder="anarea@xboxone.com" />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="ownerPassword"
            rules={[{ required: true, message: "Ingresa la contraseña" }]}
          >
            <Input.Password placeholder="********" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Crear cuenta
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