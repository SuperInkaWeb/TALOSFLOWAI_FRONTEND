import {
  Alert,
  Button,
  Card,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";
import { useUsers } from "../features/users/hooks/use-users";
import { useDeleteUser } from "../features/users/hooks/use-delete-user";
import { CreateUserModal } from "../features/users/components/create-user-modal";
import { EditUserModal } from "../features/users/components/edit-user-modal";
import { ChangePasswordModal } from "../features/users/components/change-password-modal";
import type { UserItem } from "../types/user.types";
import { useAuthStore } from "../app/store/auth.store";

const { Title, Text } = Typography;

function roleTag(role: string) {
  switch (role) {
    case "OWNER":
      return <Tag color="gold">OWNER</Tag>;
    case "ADMIN":
      return <Tag color="processing">ADMIN</Tag>;
    case "EDITOR":
      return <Tag color="green">EDITOR</Tag>;
    case "VIEWER":
      return <Tag>VIEWER</Tag>;
    default:
      return <Tag>{role}</Tag>;
  }
}

export function UsersPage() {
  const { data, isLoading, isError } = useUsers();
  const deleteUser = useDeleteUser();
  const currentRole = useAuthStore((state) => state.role);
  const currentUserId = useAuthStore((state) => state.userId);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const canManageUsers = currentRole === "OWNER" || currentRole === "ADMIN";

  const columns = useMemo<ColumnsType<UserItem>>(
    () => [
      {
        title: "Nombre",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Rol",
        dataIndex: "role",
        key: "role",
        render: (role: string) => roleTag(role),
      },
      {
        title: "Acciones",
        key: "actions",
        render: (_, record) => {
          const isSelf = record.id === currentUserId;

          return (
            <Space wrap>
              <Button
                onClick={() => {
                  setSelectedUser(record);
                  setEditOpen(true);
                }}
                disabled={!canManageUsers}
              >
                Editar
              </Button>

              <Button
                onClick={() => {
                  setSelectedUser(record);
                  setPasswordOpen(true);
                }}
                disabled={!canManageUsers}
              >
                Contraseña
              </Button>

              <Popconfirm
                title="Eliminar usuario"
                description="¿Seguro que deseas eliminar este usuario?"
                okText="Sí"
                cancelText="No"
                onConfirm={() => deleteUser.mutate(record.id)}
                disabled={!canManageUsers || record.role === "OWNER" || isSelf}
              >
                <Button
                  danger
                  disabled={!canManageUsers || record.role === "OWNER" || isSelf}
                  loading={deleteUser.isPending}
                >
                  Eliminar
                </Button>
              </Popconfirm>
            </Space>
          );
        },
      },
    ],
    [canManageUsers, currentUserId, deleteUser]
  );

  if (!canManageUsers) {
    return (
      <div style={{ padding: 16 }}>
        <Alert
          type="warning"
          showIcon
          message="No tienes permisos para gestionar usuarios"
          description="Solo OWNER y ADMIN pueden acceder a esta sección."
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Usuarios
            </Title>
            <Text type="secondary">
              Gestiona los usuarios y roles de tu organización
            </Text>
          </div>

          <Button type="primary" onClick={() => setCreateOpen(true)}>
            Crear usuario
          </Button>
        </div>

        <Card>
          <Table<UserItem>
            rowKey="id"
            loading={isLoading}
            columns={columns}
            dataSource={data ?? []}
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: "No hay usuarios registrados" }}
          />

          {isError && (
            <Alert
              style={{ marginTop: 16 }}
              type="error"
              showIcon
              message="No se pudieron cargar los usuarios"
              description="Verifica tu conexión o el estado del backend."
            />
          )}
        </Card>
      </Space>

      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <EditUserModal
        open={editOpen}
        user={selectedUser}
        onClose={() => {
          setEditOpen(false);
          setSelectedUser(null);
        }}
      />

      <ChangePasswordModal
        open={passwordOpen}
        user={selectedUser}
        onClose={() => {
          setPasswordOpen(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
}