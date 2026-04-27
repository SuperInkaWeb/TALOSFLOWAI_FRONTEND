import { Button, Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";
import { useCreateUser } from "../hooks/use-create-user";
import type { CreateUserRequest, UserRole } from "../../../types/user.types";

type Props = {
  open: boolean;
  onClose: () => void;
};

const roleOptions: { label: string; value: UserRole }[] = [
  { label: "Administrador", value: "ADMIN" },
  { label: "Editor", value: "EDITOR" },
  { label: "Viewer", value: "VIEWER" },
];

export function CreateUserModal({ open, onClose }: Props) {
  const [form] = Form.useForm<CreateUserRequest>();
  const createUser = useCreateUser();

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleFinish = async (values: CreateUserRequest) => {
    try {
      await createUser.mutateAsync({
        ...values,
        email: values.email.trim().toLowerCase(),
        name: values.name.trim(),
        password: values.password.trim(),
      });

      onClose();
    } catch {
      // El mensaje de error ya lo muestra el hook
    }
  };

  return (
    <Modal
      title="Crear usuario"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Nombre"
          name="name"
          rules={[{ required: true, message: "Ingresa el nombre" }]}
        >
          <Input placeholder="Nombre completo" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Ingresa el email" },
            { type: "email", message: "Ingresa un email válido" },
          ]}
        >
          <Input placeholder="correo@empresa.com" />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="password"
          rules={[
            { required: true, message: "Ingresa la contraseña" },
            { min: 6, message: "La contraseña debe tener al menos 6 caracteres" },
          ]}
        >
          <Input.Password placeholder="********" />
        </Form.Item>

        <Form.Item label="Rol" name="role" initialValue="EDITOR">
          <Select options={roleOptions} />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={createUser.isPending}
        >
          Crear usuario
        </Button>
      </Form>
    </Modal>
  );
}