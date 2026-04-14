import { useMemo, useState } from "react";
import { Select, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ReferralListItemResponse } from "../../../types/referral.types";

const { Text } = Typography;

type Props = {
  data: ReferralListItemResponse[];
  loading?: boolean;
};

type StatusFilter = "ALL" | "PENDING" | "QUALIFIED" | "REWARDED" | "REJECTED";

function getStatusTag(status: ReferralListItemResponse["status"]) {
  switch (status) {
    case "PENDING":
      return <Tag color="gold">Pendiente</Tag>;
    case "QUALIFIED":
      return <Tag color="blue">Calificado</Tag>;
    case "REWARDED":
      return <Tag color="green">Premiado</Tag>;
    case "REJECTED":
      return <Tag color="red">Rechazado</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
}

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  return new Intl.DateTimeFormat("es-EC", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function isRewardedThisMonth(rewardedAt: string | null) {
  if (!rewardedAt) return false;

  const now = new Date();
  const rewardedDate = new Date(rewardedAt);

  return (
    rewardedDate.getFullYear() === now.getFullYear() &&
    rewardedDate.getMonth() === now.getMonth()
  );
}

export default function ReferralHistoryTable({ data, loading }: Props) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const filteredData = useMemo(() => {
    if (statusFilter === "ALL") return data;
    return data.filter((item) => item.status === statusFilter);
  }, [data, statusFilter]);

  const columns: ColumnsType<ReferralListItemResponse> = [
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (value, record) => (
        <Space wrap>
          {getStatusTag(value)}
          {record.status === "REWARDED" && isRewardedThisMonth(record.rewardedAt) ? (
            <Tag color="processing">Este mes</Tag>
          ) : null}
        </Space>
      ),
    },
    {
      title: "Organización referida",
      key: "organization",
      width: 240,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Text strong>
            {record.referredOrganizationName || `Org #${record.referredOrganizationId}`}
          </Text>
          <Text type="secondary">
            {record.referredOrganizationSlug
              ? `/${record.referredOrganizationSlug}`
              : `ID #${record.referredOrganizationId}`}
          </Text>
        </Space>
      ),
    },
    {
      title: "Código usado",
      dataIndex: "referralCode",
      key: "referralCode",
      width: 160,
      render: (value) => <Text code>{value}</Text>,
    },
    {
      title: "Recompensa",
      key: "reward",
      width: 220,
      render: (_, record) => (
        <Space wrap>
          <Tag color="blue">+{record.rewardAiAmount} IA</Tag>
          <Tag color="purple">+{record.rewardImageAmount} imágenes</Tag>
        </Space>
      ),
    },
    {
      title: "Creado",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (value) => formatDate(value),
    },
    {
      title: "Calificado",
      dataIndex: "qualifiedAt",
      key: "qualifiedAt",
      width: 180,
      render: (value) => formatDate(value),
    },
    {
      title: "Premiado",
      dataIndex: "rewardedAt",
      key: "rewardedAt",
      width: 180,
      render: (value, record) => (
        <Space direction="vertical" size={2}>
          <Text>{formatDate(value)}</Text>
          {record.status === "REWARDED" && isRewardedThisMonth(record.rewardedAt) ? (
            <Tag color="success">Premiado este mes</Tag>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Space wrap style={{ justifyContent: "space-between", width: "100%" }}>
        <Space direction="vertical" size={4}>
          <Text strong>Filtrar historial</Text>
          <Text type="secondary">
            Visualiza tus referidos por estado.
          </Text>
        </Space>

        <Select<StatusFilter>
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ minWidth: 220 }}
          options={[
            { value: "ALL", label: "Todos" },
            { value: "PENDING", label: "Pendientes" },
            { value: "QUALIFIED", label: "Calificados" },
            { value: "REWARDED", label: "Premiados" },
            { value: "REJECTED", label: "Rechazados" },
          ]}
        />
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 1200 }}
        locale={{
          emptyText: "No hay referidos para el filtro seleccionado",
        }}
      />
    </Space>
  );
}