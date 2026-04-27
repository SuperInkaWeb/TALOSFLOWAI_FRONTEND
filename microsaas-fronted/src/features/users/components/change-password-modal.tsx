import { Button, Form, Input, Modal, Space, Typography, message } from "antd";
import { LockOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../app/store/auth.store";
import { useUpdateUserPassword } from "../hooks/use-update-user-password";
import type { UserItem } from "../../../types/user.types";

const { Text } = Typography;

type FormValues = {
  password: string;
  confirmPassword: string;
};

type Props = {
  open: boolean;
  user: UserItem | null;
  onClose: () => void;
};

export function ChangePasswordModal({ open, user, onClose }: Props) {
  const [form] = Form.useForm<FormValues>();
  const updatePassword = useUpdateUserPassword();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleFinish = async (values: FormValues) => {
    if (!user) return;

    try {
      await updatePassword.mutateAsync({
        userId: user.id,
        payload: {
          password: values.password.trim(),
        },
      });

      message.success("Contraseña actualizada correctamente");
      message.info("Por seguridad, debes iniciar sesión nuevamente");

      form.resetFields();
      onClose();

      setTimeout(() => {
        logout();
        navigate("/auth/login", { replace: true });
      }, 1200);
    } catch {
      // El hook ya maneja el error
    }
  };

  return (
    <Modal
      title="Cambiar contraseña"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Space align="start" size={12}>
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f8fafc",
              border: "1px solid #e5e7eb",
              flexShrink: 0,
            }}
          >
            <SafetyCertificateOutlined style={{ fontSize: 18 }} />
          </span>

          <Space direction="vertical" size={2}>
            <Text strong>Actualizar contraseña</Text>
            <Text type="secondary">
              Define una nueva contraseña segura para la cuenta
              {user?.email ? ` de ${user.email}` : ""}.
            </Text>
          </Space>
        </Space>

        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Nueva contraseña"
            name="password"
            rules={[
              { required: true, message: "Ingresa la nueva contraseña" },
              {
                min: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Ingresa la nueva contraseña"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            label="Confirmar contraseña"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Confirma la contraseña" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
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
              prefix={<LockOutlined />}
              placeholder="Confirma la nueva contraseña"
              autoComplete="new-password"
            />
          </Form.Item>

          <Space direction="vertical" size={10} style={{ width: "100%" }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={updatePassword.isPending}
            >
              Actualizar contraseña
            </Button>

            <Button block onClick={onClose} disabled={updatePassword.isPending}>
              Cancelar
            </Button>
          </Space>
        </Form>
      </Space>
    </Modal>
  );
}