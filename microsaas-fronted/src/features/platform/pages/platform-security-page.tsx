import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { SortOrder } from "antd/es/table/interface";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useMemo, useState } from "react";
import type { Dayjs } from "dayjs";
import type { PlatformLoginAttemptItem } from "../../../types/platform.types";
import { formatDateTime } from "../../../utils/date";
import { usePlatformLoginAttempts } from "../hooks/use-platform-login-attempts";
import { usePlatformLoginAttemptsSummary } from "../hooks/use-platform-login-attempts-summary";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

type SuspiciousIpItem = {
  ipAddress: string;
  totalAttempts: number;
  failedAttempts: number;
  successfulAttempts: number;
};

type SuccessFilter = "SUCCESS" | "FAILED" | undefined;

function safeTime(value?: string | null) {
  return value ? new Date(value).getTime() : 0;
}

export function PlatformSecurityPage() {
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [success, setSuccess] = useState<SuccessFilter>(undefined);
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(
    null
  );

  const pageSize = 10;

  const filters = useMemo(
    () => ({
      slug: slug.trim() || undefined,
      email: email.trim() || undefined,
      ipAddress: ipAddress.trim() || undefined,
      success:
        success === "SUCCESS"
          ? true
          : success === "FAILED"
          ? false
          : undefined,
      page: page - 1,
      size: pageSize,
    }),
    [slug, email, ipAddress, success, page]
  );

  const { data: summary, isLoading: summaryLoading } =
    usePlatformLoginAttemptsSummary();

  const { data, isLoading } = usePlatformLoginAttempts(filters);

  const rawAttempts = data?.content ?? [];

  const displayedAttempts = useMemo(() => {
    if (!dateRange || (!dateRange[0] && !dateRange[1])) {
      return rawAttempts;
    }

    const start = dateRange[0]?.startOf("day").valueOf();
    const end = dateRange[1]?.endOf("day").valueOf();

    return rawAttempts.filter((item) => {
      const createdAt = safeTime(item.createdAt);
      if (!createdAt) return false;
      if (start && createdAt < start) return false;
      if (end && createdAt > end) return false;
      return true;
    });
  }, [rawAttempts, dateRange]);

  const suspiciousIps = useMemo<SuspiciousIpItem[]>(() => {
    const map = new Map<string, SuspiciousIpItem>();

    for (const item of displayedAttempts) {
      const key = item.ipAddress || "unknown";

      const existing = map.get(key) || {
        ipAddress: key,
        totalAttempts: 0,
        failedAttempts: 0,
        successfulAttempts: 0,
      };

      existing.totalAttempts += 1;

      if (item.success) {
        existing.successfulAttempts += 1;
      } else {
        existing.failedAttempts += 1;
      }

      map.set(key, existing);
    }

    return Array.from(map.values())
      .filter((item) => item.failedAttempts >= 2)
      .sort((a, b) => {
        if (b.failedAttempts !== a.failedAttempts) {
          return b.failedAttempts - a.failedAttempts;
        }
        return b.totalAttempts - a.totalAttempts;
      })
      .slice(0, 10);
  }, [displayedAttempts]);

  const failedAttemptsVisible = displayedAttempts.filter((item) => !item.success).length;
  const successAttemptsVisible = displayedAttempts.filter((item) => item.success).length;

  const columns: ColumnsType<PlatformLoginAttemptItem> = [
    {
      title: "Fecha",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => safeTime(a.createdAt) - safeTime(b.createdAt),
      defaultSortOrder: "descend" as SortOrder,
      sortDirections: ["descend", "ascend"],
      render: (value?: string | null) => formatDateTime(value),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      sorter: (a, b) => a.slug.localeCompare(b.slug),
      render: (value: string) => <Text code>{value}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "IP",
      dataIndex: "ipAddress",
      key: "ipAddress",
      sorter: (a, b) => a.ipAddress.localeCompare(b.ipAddress),
      render: (value: string) => <Text code>{value}</Text>,
    },
    {
      title: "Estado",
      dataIndex: "success",
      key: "success",
      sorter: (a, b) => Number(a.success) - Number(b.success),
      render: (value: boolean) =>
        value ? (
          <Tag color="success">SUCCESS</Tag>
        ) : (
          <Tag color="error">FAILED</Tag>
        ),
    },
    {
      title: "Motivo",
      dataIndex: "reason",
      key: "reason",
      render: (value?: string | null) =>
        value ? value : <Text type="secondary">—</Text>,
    },
  ];

  const suspiciousIpColumns: ColumnsType<SuspiciousIpItem> = [
    {
      title: "IP",
      dataIndex: "ipAddress",
      key: "ipAddress",
      render: (value: string) => <Text code>{value}</Text>,
    },
    {
      title: "Intentos",
      dataIndex: "totalAttempts",
      key: "totalAttempts",
      sorter: (a, b) => a.totalAttempts - b.totalAttempts,
    },
    {
      title: "Fallidos",
      dataIndex: "failedAttempts",
      key: "failedAttempts",
      sorter: (a, b) => a.failedAttempts - b.failedAttempts,
      render: (value: number) => <Tag color="error">{value}</Tag>,
    },
    {
      title: "Exitosos",
      dataIndex: "successfulAttempts",
      key: "successfulAttempts",
      sorter: (a, b) => a.successfulAttempts - b.successfulAttempts,
      render: (value: number) => <Tag color="success">{value}</Tag>,
    },
  ];

  const handleClear = () => {
    setSlug("");
    setEmail("");
    setIpAddress("");
    setSuccess(undefined);
    setDateRange(null);
    setPage(1);
  };

  return (
    <Space direction="vertical" size={20} style={{ width: "100%" }}>
      <div>
        <Title level={3} style={{ margin: 0 }}>
          Seguridad
        </Title>
        <Text type="secondary">
          Monitoreo de intentos de inicio de sesión en la plataforma
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <Card bordered={false} style={{ borderRadius: 16 }}>
            <Statistic
              title="Intentos totales"
              value={summary?.totalAttempts ?? 0}
              prefix={<SafetyCertificateOutlined />}
              loading={summaryLoading}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card bordered={false} style={{ borderRadius: 16 }}>
            <Statistic
              title="Intentos fallidos"
              value={summary?.failedAttempts ?? 0}
              prefix={<CloseCircleOutlined />}
              loading={summaryLoading}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card bordered={false} style={{ borderRadius: 16 }}>
            <Statistic
              title="Intentos exitosos"
              value={summary?.successfulAttempts ?? 0}
              prefix={<CheckCircleOutlined />}
              loading={summaryLoading}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card bordered={false} style={{ borderRadius: 16 }}>
            <Statistic
              title="IPs únicas"
              value={summary?.uniqueIpCount ?? 0}
              prefix={<GlobalOutlined />}
              loading={summaryLoading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
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
              style={{ width: "100%", marginBottom: 8 }}
            >
              <Row gutter={[12, 12]}>
                <Col xs={24} md={12} lg={7}>
                  <Input
                    allowClear
                    size="large"
                    prefix={<SearchOutlined />}
                    placeholder="Filtrar por slug"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setPage(1);
                    }}
                  />
                </Col>

                <Col xs={24} md={12} lg={7}>
                  <Input
                    allowClear
                    size="large"
                    placeholder="Filtrar por email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setPage(1);
                    }}
                  />
                </Col>

                <Col xs={24} md={12} lg={6}>
                  <Input
                    allowClear
                    size="large"
                    placeholder="Filtrar por IP"
                    value={ipAddress}
                    onChange={(e) => {
                      setIpAddress(e.target.value);
                      setPage(1);
                    }}
                  />
                </Col>

                <Col xs={24} md={12} lg={4}>
                  <Select<SuccessFilter>
                    allowClear
                    size="large"
                    placeholder="Estado"
                    style={{ width: "100%" }}
                    value={success}
                    onChange={(value) => {
                      setSuccess(value);
                      setPage(1);
                    }}
                    options={[
                      { label: "Exitoso", value: "SUCCESS" },
                      { label: "Fallido", value: "FAILED" },
                    ]}
                  />
                </Col>

                <Col xs={24} md={12} lg={4}>
                  <Button size="large" block onClick={handleClear}>
                    Limpiar
                  </Button>
                </Col>
              </Row>

              <RangePicker
                style={{ width: "100%" }}
                size="large"
                value={dateRange}
                placeholder={["Fecha inicio", "Fecha fin"]}
                onChange={(values) => {
                  setDateRange(
                    values ? [values[0] ?? null, values[1] ?? null] : null
                  );
                  setPage(1);
                }}
              />
            </Space>

            <Table<PlatformLoginAttemptItem>
              rowKey="id"
              loading={isLoading}
              dataSource={displayedAttempts}
              columns={columns}
              pagination={{
                current: page,
                pageSize,
                total: data?.totalElements ?? 0,
                showSizeChanger: false,
                onChange: (nextPage) => setPage(nextPage),
              }}
              locale={{
                emptyText:
                  "No hay intentos registrados. El sistema mostrará actividad cuando existan accesos o fallos de autenticación.",
              }}
              rowClassName={(record) =>
                !record.success ? "security-row-failed" : ""
              }
            />
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Card bordered={false} style={{ borderRadius: 16 }}>
              <Statistic
                title="Fallidos visibles"
                value={failedAttemptsVisible}
                prefix={<WarningOutlined />}
              />
            </Card>

            <Card bordered={false} style={{ borderRadius: 16 }}>
              <Statistic
                title="Exitosos visibles"
                value={successAttemptsVisible}
                prefix={<CheckCircleOutlined />}
              />
            </Card>

            <Card
              bordered={false}
              title="IPs sospechosas"
              style={{ borderRadius: 16 }}
            >
              <Table<SuspiciousIpItem>
                rowKey="ipAddress"
                size="small"
                pagination={false}
                dataSource={suspiciousIps}
                columns={suspiciousIpColumns}
                locale={{ emptyText: "Sin IPs sospechosas" }}
              />
            </Card>
          </Space>
        </Col>
      </Row>
    </Space>
  );
}