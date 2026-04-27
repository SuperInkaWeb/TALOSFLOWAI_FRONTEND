import {
  Alert,
  Button,
  Card,
  Col,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ApartmentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlatformOrganizations } from "../hooks/use-platform-organizations";
import { useUpdatePlatformOrganizationStatusAction } from "../hooks/use-update-platform-organization-status-action";
import type { PlatformOrganizationItem } from "../../../types/platform.types";
import { formatDateTime } from "../../../utils/date";

const { Title, Text } = Typography;

type StatusFilter = "ACTIVE" | "SUSPENDED" | "INACTIVE" | undefined;
type SchemaFilter = "READY" | "PENDING" | undefined;

function getStatusColor(status: string) {
  switch (status) {
    case "ACTIVE":
      return "green";
    case "SUSPENDED":
      return "red";
    case "INACTIVE":
      return "default";
    default:
      return "default";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "ACTIVE":
      return "Activa";
    case "SUSPENDED":
      return "Suspendida";
    case "INACTIVE":
      return "Inactiva";
    default:
      return status;
  }
}

function getPlanColor(planName?: string | null) {
  switch ((planName || "").toUpperCase()) {
    case "FREE":
      return "default";
    case "PLUS":
      return "blue";
    case "PRO":
      return "purple";
    default:
      return "gold";
  }
}

function normalizeText(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

export function PlatformOrganizationsPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = usePlatformOrganizations();
  const updateStatusMutation = useUpdatePlatformOrganizationStatusAction();

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(undefined);
  const [planFilter, setPlanFilter] = useState<string | undefined>(undefined);
  const [schemaFilter, setSchemaFilter] = useState<SchemaFilter>(undefined);

  const organizations = data ?? [];

  const availablePlans = useMemo(() => {
    return Array.from(
      new Set(
        organizations
          .map((item) => item.planName)
          .filter((value): value is string => Boolean(value?.trim()))
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [organizations]);

  const filteredOrganizations = useMemo(() => {
    const query = normalizeText(searchText);

    return organizations.filter((item) => {
      const matchesSearch =
        !query ||
        normalizeText(item.name).includes(query) ||
        normalizeText(item.slug).includes(query) ||
        normalizeText(item.schemaName).includes(query) ||
        normalizeText(item.planName).includes(query);

      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesPlan = !planFilter || item.planName === planFilter;
      const matchesSchema =
        !schemaFilter ||
        (schemaFilter === "READY" && item.schemaReady) ||
        (schemaFilter === "PENDING" && !item.schemaReady);

      return matchesSearch && matchesStatus && matchesPlan && matchesSchema;
    });
  }, [organizations, searchText, statusFilter, planFilter, schemaFilter]);

  const totalOrganizations = filteredOrganizations.length;
  const activeOrganizations = filteredOrganizations.filter(
    (item) => item.status === "ACTIVE"
  ).length;
  const suspendedOrganizations = filteredOrganizations.filter(
    (item) => item.status === "SUSPENDED"
  ).length;
  const pendingSchemaOrganizations = filteredOrganizations.filter(
    (item) => !item.schemaReady
  ).length;

  const goToDetail = (id: number) => {
    navigate(`/platform/organizations/${id}`);
  };

  const clearFilters = () => {
    setSearchText("");
    setStatusFilter(undefined);
    setPlanFilter(undefined);
    setSchemaFilter(undefined);
  };

  const columns: ColumnsType<PlatformOrganizationItem> = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.name}</Text>
          <Text type="secondary">{record.slug}</Text>
        </Space>
      ),
    },
    {
      title: "Schema",
      dataIndex: "schemaName",
      key: "schemaName",
      sorter: (a, b) => a.schemaName.localeCompare(b.schemaName),
      render: (value: string) => <Text code>{value}</Text>,
    },
    {
      title: "Paquete",
      dataIndex: "planName",
      key: "planName",
      sorter: (a, b) => (a.planName || "").localeCompare(b.planName || ""),
      render: (value?: string | null) =>
        value ? (
          <Tag color={getPlanColor(value)}>{value}</Tag>
        ) : (
          <Text type="secondary">Sin plan</Text>
        ),
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (value: string) => (
        <Tag color={getStatusColor(value)}>{getStatusLabel(value)}</Tag>
      ),
    },
    {
      title: "Provisioning",
      dataIndex: "schemaReady",
      key: "schemaReady",
      sorter: (a, b) => Number(a.schemaReady) - Number(b.schemaReady),
      render: (value: boolean) =>
        value ? (
          <Tag color="success">READY</Tag>
        ) : (
          <Tag color="warning">PENDING</Tag>
        ),
    },
    {
      title: "Creado",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) =>
        new Date(a.createdAt || 0).getTime() -
        new Date(b.createdAt || 0).getTime(),
      render: (value?: string | null) => formatDateTime(value),
    },
    {
      title: "Acciones",
      key: "actions",
      width: 280,
      render: (_, record) => {
        const isActive = record.status === "ACTIVE";
        const isSuspended = record.status === "SUSPENDED";
        const isPendingRow =
          updateStatusMutation.isPending &&
          updateStatusMutation.variables?.id === record.id;

        return (
          <div onClick={(event) => event.stopPropagation()}>
            <Space wrap>
              <Button onClick={() => goToDetail(record.id)}>Ver detalle</Button>

              {isActive && (
                <Popconfirm
                  title="Suspender organización"
                  description="Esto bloqueará el acceso al sistema para todos los usuarios."
                  okText="Suspender"
                  okButtonProps={{ danger: true }}
                  cancelText="Cancelar"
                  onConfirm={() =>
                    updateStatusMutation.mutate({
                      id: record.id,
                      status: "SUSPENDED",
                    })
                  }
                >
                  <Button danger loading={isPendingRow}>
                    Suspender
                  </Button>
                </Popconfirm>
              )}

              {isSuspended && (
                <Popconfirm
                  title="Activar organización"
                  description="La organización volverá a operar normalmente."
                  okText="Activar"
                  cancelText="Cancelar"
                  onConfirm={() =>
                    updateStatusMutation.mutate({
                      id: record.id,
                      status: "ACTIVE",
                    })
                  }
                >
                  <Button type="primary" loading={isPendingRow}>
                    Activar
                  </Button>
                </Popconfirm>
              )}

              {!isActive && !isSuspended && (
                <Popconfirm
                  title="Activar organización"
                  description="¿Seguro que deseas activar esta organización?"
                  okText="Activar"
                  cancelText="Cancelar"
                  onConfirm={() =>
                    updateStatusMutation.mutate({
                      id: record.id,
                      status: "ACTIVE",
                    })
                  }
                >
                  <Button type="primary" loading={isPendingRow}>
                    Activar
                  </Button>
                </Popconfirm>
              )}
            </Space>
          </div>
        );
      },
    },
  ];

  return (
    <Space direction="vertical" size={20} style={{ width: "100%" }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Organizaciones
        </Title>
        <Text type="secondary">
          Gestión global de tenants, paquetes, provisioning y estado operativo
        </Text>
      </div>

      {isError && (
        <Alert
          type="error"
          showIcon
          message="No se pudo cargar la lista de organizaciones"
          description="Verifica la conexión o vuelve a intentarlo."
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <Card bordered={false} style={{ borderRadius: 16 }}>
            <Statistic
              title="Total organizaciones"
              value={totalOrganizations}
              prefix={<ApartmentOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card bordered={false} style={{ borderRadius: 16 }}>
            <Statistic
              title="Activas"
              value={activeOrganizations}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card bordered={false} style={{ borderRadius: 16 }}>
            <Statistic
              title="Suspendidas"
              value={suspendedOrganizations}
              prefix={<StopOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card bordered={false} style={{ borderRadius: 16 }}>
            <Statistic
              title="Schema pendiente"
              value={pendingSchemaOrganizations}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        bordered={false}
        style={{
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
        }}
      >
        <Space
          direction="vertical"
          size={16}
          style={{ width: "100%", marginBottom: 16 }}
        >
          <Row gutter={[12, 12]}>
            <Col xs={24} md={12} lg={8}>
              <Input
                allowClear
                size="large"
                prefix={<SearchOutlined />}
                placeholder="Buscar por nombre, slug, schema o paquete"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>

            <Col xs={24} md={6} lg={4}>
              <Select
                allowClear
                size="large"
                placeholder="Estado"
                style={{ width: "100%" }}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                options={[
                  { value: "ACTIVE", label: "Activa" },
                  { value: "SUSPENDED", label: "Suspendida" },
                  { value: "INACTIVE", label: "Inactiva" },
                ]}
              />
            </Col>

            <Col xs={24} md={6} lg={4}>
              <Select
                allowClear
                size="large"
                placeholder="Paquete"
                style={{ width: "100%" }}
                value={planFilter}
                onChange={(value) => setPlanFilter(value)}
                options={availablePlans.map((plan) => ({
                  value: plan,
                  label: plan,
                }))}
              />
            </Col>

            <Col xs={24} md={6} lg={4}>
              <Select
                allowClear
                size="large"
                placeholder="Schema"
                style={{ width: "100%" }}
                value={schemaFilter}
                onChange={(value) => setSchemaFilter(value)}
                options={[
                  { value: "READY", label: "READY" },
                  { value: "PENDING", label: "PENDING" },
                ]}
              />
            </Col>

            <Col xs={24} md={6} lg={4}>
              <Button size="large" block onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </Col>
          </Row>
        </Space>

        <Table<PlatformOrganizationItem>
          rowKey="id"
          loading={isLoading}
          dataSource={filteredOrganizations}
          columns={columns}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          locale={{ emptyText: "No hay organizaciones registradas" }}
          onRow={(record) => ({
            onClick: () => goToDetail(record.id),
            style: { cursor: "pointer" },
          })}
        />
      </Card>
    </Space>
  );
}