import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type {
  BrandSocialLinkResponse,
  CreateBrandSocialLinkRequest,
  UpdateBrandSocialLinkRequest,
} from "../../../types/brand.types";
import { BRAND_CONTACT_PLATFORM_OPTIONS } from "../constants/brand-social-platforms";
import { useBrandProfile } from "../hooks/use-brand-profile";
import { useBrandSocialLinks } from "../hooks/use-brand-social-links";
import { useCreateBrandSocialLink } from "../hooks/use-create-brand-social-link";
import { useUpdateBrandSocialLink } from "../hooks/use-update-brand-social-link";
import { useDeleteBrandSocialLink } from "../hooks/use-delete-brand-social-link";

const { Text, Link } = Typography;

type FormValues = {
  platform: CreateBrandSocialLinkRequest["platform"];
  label?: string;
  value: string;
  url?: string;
  isActive: boolean;
  isPrimary: boolean;
};

function normalizeNullableString(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function formatPlatformLabel(platform: string) {
  const match = BRAND_CONTACT_PLATFORM_OPTIONS.find(
    (item) => item.value === platform
  );
  return match?.label ?? platform;
}

function getDisplayName(item: BrandSocialLinkResponse) {
  return item.label?.trim() || "Sin nombre";
}

function getDisplayValue(item: BrandSocialLinkResponse) {
  return item.value?.trim() || "-";
}

export function BrandSocialLinksSection() {
  const [form] = Form.useForm<FormValues>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] =
    useState<BrandSocialLinkResponse | null>(null);

  const { data: brandProfile } = useBrandProfile();
  const { data = [], isLoading } = useBrandSocialLinks(false);

  const createMutation = useCreateBrandSocialLink();
  const updateMutation = useUpdateBrandSocialLink();
  const deleteMutation = useDeleteBrandSocialLink();

  const hasActiveBrandProfile = Boolean(
    brandProfile?.id && brandProfile?.isActive
  );

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const openCreateModal = () => {
    if (!hasActiveBrandProfile) {
      message.warning("Primero debes crear y activar tu perfil de marca.");
      return;
    }

    setEditingItem(null);
    form.setFieldsValue({
      platform: "INSTAGRAM",
      label: "",
      value: "",
      url: "",
      isActive: true,
      isPrimary: data.length === 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: BrandSocialLinkResponse) => {
    setEditingItem(item);
    form.setFieldsValue({
      platform: item.platform,
      label: item.label ?? "",
      value: item.value,
      url: item.url ?? "",
      isActive: item.isActive,
      isPrimary: item.isPrimary,
    });
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    form.resetFields();
  };

  const unsetOtherPrimaryLinks = async (currentId?: number) => {
    const currentPrimary = data.filter(
      (item) => item.isPrimary && item.id !== currentId
    );

    for (const item of currentPrimary) {
      const payload: UpdateBrandSocialLinkRequest = {
        platform: item.platform,
        label: item.label ?? null,
        value: item.value,
        url: item.url ?? null,
        isActive: item.isActive,
        isPrimary: false,
      };

      await updateMutation.mutateAsync({
        id: item.id,
        data: payload,
      });
    }
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    if (values.isPrimary) {
      await unsetOtherPrimaryLinks(editingItem?.id);
    }

    const payload: UpdateBrandSocialLinkRequest = {
      platform: values.platform,
      label: normalizeNullableString(values.label),
      value: values.value.trim(),
      url: normalizeNullableString(values.url),
      isActive: values.isActive,
      isPrimary: values.isPrimary,
    };

    if (editingItem) {
      await updateMutation.mutateAsync({
        id: editingItem.id,
        data: payload,
      });

      message.success("Red/contacto actualizado correctamente");
    } else {
      await createMutation.mutateAsync(payload);
      message.success("Red/contacto agregado correctamente");
    }

    handleClose();
  };

  const columns: ColumnsType<BrandSocialLinkResponse> = useMemo(
    () => [
      {
        title: "Plataforma",
        dataIndex: "platform",
        key: "platform",
        width: 150,
        render: (value: string) => <Tag>{formatPlatformLabel(value)}</Tag>,
      },
      {
        title: "Nombre",
        key: "label",
        width: 220,
        render: (_, record) => {
          const text = getDisplayName(record);
          return (
            <Tooltip title={text}>
              <Text>{text}</Text>
            </Tooltip>
          );
        },
      },
      {
        title: "Dato",
        key: "value",
        render: (_, record) => {
          const text = getDisplayValue(record);

          if (record.url) {
            return (
              <Tooltip title={text}>
                <Link href={record.url} target="_blank">
                  {text}
                </Link>
              </Tooltip>
            );
          }

          return (
            <Tooltip title={text}>
              <Text>{text}</Text>
            </Tooltip>
          );
        },
      },
      {
        title: "Principal",
        key: "isPrimary",
        width: 120,
        render: (_, record) =>
          record.isPrimary ? (
            <Tag color="gold">Sí</Tag>
          ) : (
            <Text type="secondary">No</Text>
          ),
      },
      {
        title: "Estado",
        key: "status",
        width: 120,
        render: (_, record) =>
          record.isActive ? <Tag color="green">Activo</Tag> : <Tag>Inactivo</Tag>,
      },
      {
        title: "Acciones",
        key: "actions",
        width: 170,
        render: (_, record) => (
          <Space wrap>
            <Button size="small" onClick={() => openEditModal(record)}>
              Editar
            </Button>

            <Popconfirm
              title="Eliminar red/contacto"
              description="Esta acción no se puede deshacer."
              okText="Eliminar"
              cancelText="Cancelar"
              onConfirm={() => deleteMutation.mutate(record.id)}
            >
              <Button size="small" danger loading={deleteMutation.isPending}>
                Eliminar
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [deleteMutation.isPending]
  );

  return (
    <Card
      bordered={false}
      title="Redes y contacto"
      extra={
        <Button
          type="primary"
          onClick={openCreateModal}
          disabled={!hasActiveBrandProfile}
        >
          Agregar red/contacto
        </Button>
      }
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        {!hasActiveBrandProfile && (
          <Alert
            type="warning"
            showIcon
            message="Primero configura y activa tu perfil de marca."
            description="Después de guardar tu branding podrás agregar redes sociales, teléfono, web o email."
          />
        )}

        <Text type="secondary">
          Configura redes sociales, teléfono, web o email de tu marca para
          usarlos después en diseños y posts automáticos.
        </Text>

        {data.length === 0 && !isLoading ? (
          <Card size="small">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Aún no has agregado redes o datos de contacto"
            >
              <Button
                type="primary"
                onClick={openCreateModal}
                disabled={!hasActiveBrandProfile}
              >
                Agregar el primero
              </Button>
            </Empty>
          </Card>
        ) : (
          <Table
            rowKey="id"
            loading={isLoading}
            dataSource={data}
            columns={columns}
            pagination={false}
            scroll={{ x: 900 }}
          />
        )}
      </Space>

      <Modal
        title={editingItem ? "Editar red/contacto" : "Agregar red/contacto"}
        open={isModalOpen}
        onCancel={handleClose}
        onOk={handleSubmit}
        confirmLoading={isSubmitting}
        okText={editingItem ? "Guardar cambios" : "Crear"}
        cancelText="Cancelar"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="platform"
            label="Canal"
            rules={[{ required: true, message: "Selecciona un canal" }]}
          >
            <Select options={BRAND_CONTACT_PLATFORM_OPTIONS} />
          </Form.Item>

          <Form.Item name="label" label="Nombre">
            <Input placeholder="Ej: Instagram principal, Ventas, Soporte" />
          </Form.Item>

          <Form.Item
            name="value"
            label="Dato"
            rules={[{ required: true, message: "Ingresa el dato principal" }]}
          >
            <Input placeholder="Ej: @qoribex, +593999999999, qoribex.com, contacto@..." />
          </Form.Item>

          <Form.Item name="url" label="Enlace">
            <Input placeholder="https://..., mailto:..., tel:..." />
          </Form.Item>

          <Form.Item
            name="isPrimary"
            label="Canal principal"
            valuePropName="checked"
            extra="Solo uno puede quedar como principal."
          >
            <Switch />
          </Form.Item>

          <Form.Item name="isActive" label="Activo" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}