import { Button, Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";
import { useUpdateUser } from "../hooks/use-update-user";
import type { UpdateUserRequest, UserItem, UserRole } from "../../../types/user.types";

type Props = {
  open: boolean;
  user: UserItem | null;
  onClose: () => void;
};

const roleOptions: { label: string; value: UserRole }[] = [
  { label: "Administrador", value: "ADMIN" },
  { label: "Editor", value: "EDITOR" },
  { label: "Viewer", value: "VIEWER" },
];

export function EditUserModal({ open, user, onClose }: Props) {
  const [form] = Form.useForm<UpdateUserRequest>();
  const updateUser = useUpdateUser();

  useEffect(() => {
    if (user && open) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role === "OWNER" ? "ADMIN" : user.role,
      });
    } else {
      form.resetFields();
    }
  }, [user, open, form]);

  const handleFinish = async (values: UpdateUserRequest) => {
    if (!user) return;

    await updateUser.mutateAsync({
      userId: user.id,
      payload: {
        ...values,
        email: values.email.trim().toLowerCase(),
        name: values.name.trim(),
      },
    });

    onClose();
  };

  return (
    <Modal
      title="Editar usuario"
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
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Ingresa el email" },
            { type: "email", message: "Ingresa un email válido" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Rol"
          name="role"
          rules={[{ required: true, message: "Selecciona el rol" }]}
        >
          <Select options={roleOptions} disabled={user?.role === "OWNER"} />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={updateUser.isPending}
        >
          Guardar cambios
        </Button>
      </Form>
    </Modal>
  );
}