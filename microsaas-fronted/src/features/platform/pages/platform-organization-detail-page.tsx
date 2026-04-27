import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Popconfirm,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { usePlatformOrganizationDetail } from "../hooks/use-platform-organization-detail";
import { useUpdatePlatformOrganizationStatus } from "../hooks/use-update-platform-organization-status";
import { formatDateTime } from "../../../utils/date";

const { Title, Text } = Typography;

function getOrganizationStatusTag(status: string) {
  const color =
    status === "ACTIVE"
      ? "green"
      : status === "SUSPENDED"
      ? "red"
      : status === "INACTIVE"
      ? "default"
      : "default";

  return <Tag color={color}>{status}</Tag>;
}

function getBooleanTag(value: boolean, trueText = "Sí", falseText = "No") {
  return value ? <Tag color="success">{trueText}</Tag> : <Tag>{falseText}</Tag>;
}

function getPostStatusTag(status: string) {
  const color =
    status === "PUBLISHED"
      ? "green"
      : status === "SCHEDULED"
      ? "blue"
      : status === "PROCESSING"
      ? "gold"
      : status === "FAILED"
      ? "red"
      : status === "CANCELED"
      ? "default"
      : "default";

  return <Tag color={color}>{status}</Tag>;
}

function getAuditActionTag(action: string) {
  if (action === "UPDATE_ORGANIZATION_STATUS") {
    return <Tag color="blue">Cambio de estado</Tag>;
  }

  return <Tag>{action}</Tag>;
}

export function PlatformOrganizationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const organizationId = Number(id);

  const { data, isLoading, isError, error } = usePlatformOrganizationDetail(
    Number.isNaN(organizationId) ? undefined : organizationId
  );

  const updateStatusMutation = useUpdatePlatformOrganizationStatus(
    Number.isNaN(organizationId) ? undefined : organizationId
  );

  if (!id || Number.isNaN(organizationId)) {
    return (
      <Alert
        type="error"
        message="ID de organización inválido"
        description="La ruta no contiene un id válido."
      />
    );
  }

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (isError) {
    return (
      <Alert
        type="error"
        message="No se pudo cargar el detalle"
        description={(error as any)?.response?.data?.message || "Error inesperado"}
      />
    );
  }

  if (!data) {
    return (
      <Alert
        type="warning"
        message="Sin datos"
        description="No se recibió información de la organización."
      />
    );
  }

  const isActive = data.organization.status === "ACTIVE";
  const isSuspended = data.organization.status === "SUSPENDED";

 return (
  <Space direction="vertical" size={20} style={{ width: "100%" }}>
    
    {/* HEADER */}
    <Card
      style={{
        borderRadius: 16,
        background: "#ffffff",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
      }}
    >
      <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col>
          <Space direction="vertical" size={4}>
            <Title level={3} style={{ margin: 0 }}>
              {data.organization.name}
            </Title>

            <Space size={8} wrap>
              <Text type="secondary">{data.organization.slug}</Text>
              <Text type="secondary">•</Text>
              <Text type="secondary">{data.organization.schemaName}</Text>
              {getOrganizationStatusTag(data.organization.status)}
            </Space>
          </Space>
        </Col>

        <Col>
          <Space wrap>
            {isActive && (
              <Popconfirm
                title="Suspender organización"
                description="Se bloqueará el acceso a todos los usuarios"
                okText="Suspender"
                okButtonProps={{ danger: true }}
                onConfirm={() => updateStatusMutation.mutate("SUSPENDED")}
              >
                <Button danger loading={updateStatusMutation.isPending}>
                  Suspender
                </Button>
              </Popconfirm>
            )}

            {isSuspended && (
              <Popconfirm
                title="Activar organización"
                onConfirm={() => updateStatusMutation.mutate("ACTIVE")}
              >
                <Button type="primary" loading={updateStatusMutation.isPending}>
                  Activar
                </Button>
              </Popconfirm>
            )}

            <Button onClick={() => navigate("/platform/organizations")}>
              Volver
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>

    {/* ALERTAS */}
    {data.organization.status === "SUSPENDED" && (
      <Alert
        type="error"
        message="Organización suspendida"
        description="No puede operar actualmente"
      />
    )}

    {!data.provisioning.schemaReady && (
      <Alert
        type="warning"
        message="Provisioning pendiente"
        description={data.provisioning.provisioningError || "Schema no listo"}
      />
    )}

    {/* STATS */}
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12} xl={6}>
        <Card>
          <Statistic title="Usuarios" value={data.users.total} />
        </Card>
      </Col>

      <Col xs={24} md={12} xl={6}>
        <Card>
          <Statistic
            title="Cuentas conectadas"
            value={data.social.connectedAccountsCount}
          />
        </Card>
      </Col>

      <Col xs={24} md={12} xl={6}>
        <Card>
          <Statistic
            title="Páginas"
            value={data.social.pagesCount}
          />
        </Card>
      </Col>

      <Col xs={24} md={12} xl={6}>
        <Card>
          <Statistic title="Posts" value={data.posts.total} />
        </Card>
      </Col>
    </Row>

    {/* INFO */}
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <Card title="Organización">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="ID">
              {data.organization.id}
            </Descriptions.Item>
            <Descriptions.Item label="Estado">
              {getOrganizationStatusTag(data.organization.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Creado">
              {formatDateTime(data.organization.createdAt)}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card title="Provisioning">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Schema Ready">
              {getBooleanTag(data.provisioning.schemaReady)}
            </Descriptions.Item>
            <Descriptions.Item label="Error">
              {data.provisioning.provisioningError || "-"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>

    {/* BILLING + USAGE */}
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <Card title="Billing">
          {data.billing ? (
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Status">
                <Tag color="green">{data.billing.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Plan">
                {data.billing.planId}
              </Descriptions.Item>
              <Descriptions.Item label="Periodo">
                {formatDateTime(data.billing.currentPeriodStart)} →{" "}
                {formatDateTime(data.billing.currentPeriodEnd)}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Text type="secondary">Sin suscripción</Text>
          )}
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card title="Usage">
          {data.usage ? (
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Posts">
                {data.usage.postsUsed}
              </Descriptions.Item>
              <Descriptions.Item label="IA">
                {data.usage.aiUsed}
              </Descriptions.Item>
              <Descriptions.Item label="Imágenes">
                {data.usage.imageGenerationsUsed}
              </Descriptions.Item>
            </Descriptions>
          ) : (
            <Text type="secondary">Sin uso</Text>
          )}
        </Card>
      </Col>
    </Row>

    {/* TABLAS */}
    <Card title="Usuarios recientes">
      <Table
        rowKey="id"
        pagination={false}
        dataSource={data.users.recentUsers}
        columns={[
          { title: "Nombre", dataIndex: "name" },
          { title: "Email", dataIndex: "email" },
          {
            title: "Rol",
            dataIndex: "role",
            render: (v: string) => <Tag>{v}</Tag>,
          },
        ]}
      />
    </Card>

    <Card title="Posts recientes">
      <Table
        rowKey="id"
        pagination={false}
        dataSource={data.posts.recentPosts}
        columns={[
          { title: "ID", dataIndex: "id" },
          { title: "Contenido", dataIndex: "contentPreview" },
          {
            title: "Estado",
            dataIndex: "status",
            render: (v: string) => getPostStatusTag(v),
          },
        ]}
      />
    </Card>

    <Card title="Auditoría">
      <Table
        rowKey="id"
        pagination={false}
        dataSource={data.recentAuditLogs}
        columns={[
          {
            title: "Acción",
            dataIndex: "action",
            render: (v: string) => getAuditActionTag(v),
          },
          {
            title: "Fecha",
            dataIndex: "createdAt",
            render: (v?: string) => formatDateTime(v),
          },
        ]}
      />
    </Card>
  </Space>
);
}