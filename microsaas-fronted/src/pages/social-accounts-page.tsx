import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  FacebookOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  DisconnectOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { socialService } from "../services/social.service";
import { useSocialAccounts } from "../features/social-accounts/hooks/use-social-accounts";
import { useSocialPages } from "../features/social-accounts/hooks/use-social-pages";
import { useSyncSocialPages } from "../features/social-accounts/hooks/use-sync-social-pages";
import { useDisconnectSocialAccount } from "../features/social-accounts/hooks/use-disconnect-social-account";
import { useActivateSocialAccount } from "../features/social-accounts/hooks/use-activate-social-account";
import type { SocialAccount, SocialPage } from "../types/social.types";

const { Title, Paragraph, Text } = Typography;

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

function renderStatusTag(status: string) {
  if (status === "ACTIVE") {
    return <Tag color="success">● Activo</Tag>;
  }

  if (status === "DISCONNECTED") {
    return <Tag color="error">● Desconectado</Tag>;
  }

  return <Tag>{status}</Tag>;
}

export function SocialAccountsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [connecting, setConnecting] = useState(false);

  const {
    data: accounts = [],
    isLoading: accountsLoading,
    isFetching: accountsFetching,
  } = useSocialAccounts();

  const {
    data: pages = [],
    isLoading: pagesLoading,
    isFetching: pagesFetching,
  } = useSocialPages();

  const syncMutation = useSyncSocialPages();
  const disconnectMutation = useDisconnectSocialAccount();
  const activateMutation = useActivateSocialAccount();

  const success = searchParams.get("success");
  const provider = searchParams.get("provider");
  const accountName = searchParams.get("accountName");
  const error = searchParams.get("error");

  useEffect(() => {
    if (success === "1" && provider === "meta") {
      message.success(
        accountName
          ? `Cuenta conectada correctamente: ${accountName}`
          : "Cuenta Meta conectada correctamente"
      );

      const next = new URLSearchParams(searchParams);
      next.delete("success");
      next.delete("provider");
      next.delete("socialAccountId");
      next.delete("accountName");
      setSearchParams(next, { replace: true });
    }

    if (success === "0" && provider === "meta" && error) {
      message.error(`Error conectando Meta: ${error}`);

      const next = new URLSearchParams(searchParams);
      next.delete("success");
      next.delete("provider");
      next.delete("error");
      setSearchParams(next, { replace: true });
    }
  }, [success, provider, accountName, error, searchParams, setSearchParams]);

  useEffect(() => {
    if (syncMutation.isSuccess) {
      message.success("Páginas sincronizadas correctamente");
    }
  }, [syncMutation.isSuccess]);

  useEffect(() => {
    if (disconnectMutation.isSuccess) {
      message.success("Cuenta desconectada correctamente");
    }
  }, [disconnectMutation.isSuccess]);

  useEffect(() => {
    if (activateMutation.isSuccess) {
      message.success("Cuenta activada correctamente");
    }
  }, [activateMutation.isSuccess]);

  const handleConnectMeta = async () => {
    try {
      setConnecting(true);
      const response = await socialService.getConnectMetaUrl();
      window.location.href = response.authorizationUrl;
    } catch (err: any) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo iniciar la conexión con Meta";

      message.error(apiMessage);
      setConnecting(false);
    }
  };

  const handleSyncAccount = (accountId: number) => {
    syncMutation.mutate(accountId);
  };

  const handleSyncFirstAvailable = () => {
    if (!accounts.length) {
      message.warning("Primero conecta una cuenta");
      return;
    }

    handleSyncAccount(accounts[0].id);
  };

  const activeAccountsCount = useMemo(
    () => accounts.filter((account) => account.status === "ACTIVE").length,
    [accounts]
  );

  const accountMap = useMemo(() => {
    const map = new Map<number, string>();
    accounts.forEach((account) => {
      map.set(account.id, account.accountName);
    });
    return map;
  }, [accounts]);

  const sortedPages = useMemo(() => {
    return [...pages].sort(
      (a, b) =>
        new Date(b.connectedAt).getTime() - new Date(a.connectedAt).getTime()
    );
  }, [pages]);

  const accountColumns = useMemo(
    () => [
      {
        title: "Cuenta",
        dataIndex: "accountName",
        key: "accountName",
        render: (_: string, record: SocialAccount) => (
          <Space direction="vertical" size={0}>
            <Text strong>{record.accountName}</Text>
            <Text type="secondary">{record.providerName}</Text>
          </Space>
        ),
      },
      {
        title: "Estado",
        dataIndex: "status",
        key: "status",
        render: (value: string) => renderStatusTag(value),
      },
      {
        title: "Conectada",
        dataIndex: "connectedAt",
        key: "connectedAt",
        render: (value: string) => formatDate(value),
      },
      {
        title: "Expira",
        dataIndex: "expiresAt",
        key: "expiresAt",
        render: (value?: string | null) =>
          value ? formatDate(value) : "No informado por Meta",
      },
      {
        title: "Acciones",
        key: "actions",
        render: (_: unknown, record: SocialAccount) => (
          <Space wrap>
            <Button
              icon={<ReloadOutlined />}
              loading={syncMutation.isPending}
              onClick={() => handleSyncAccount(record.id)}
            >
              Sincronizar páginas
            </Button>

            {record.status === "ACTIVE" ? (
              <Button
                danger
                icon={<DisconnectOutlined />}
                loading={disconnectMutation.isPending}
                onClick={() => disconnectMutation.mutate(record.id)}
              >
                Desconectar
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                loading={activateMutation.isPending}
                onClick={() => activateMutation.mutate(record.id)}
              >
                Activar
              </Button>
            )}
          </Space>
        ),
      },
    ],
    [syncMutation.isPending, disconnectMutation, activateMutation]
  );

  const pageColumns = useMemo(
    () => [
      {
        title: "Página",
        dataIndex: "pageName",
        key: "pageName",
        render: (value: string) => <Text strong>{value}</Text>,
      },
      {
        title: "Cuenta social",
        dataIndex: "socialAccountId",
        key: "socialAccountId",
        render: (id: number) => accountMap.get(id) || `Cuenta #${id}`,
      },
      {
        title: "Estado",
        dataIndex: "status",
        key: "status",
        render: (value: string) => renderStatusTag(value),
      },
      {
        title: "Conectada",
        dataIndex: "connectedAt",
        key: "connectedAt",
        render: (value: string) => formatDate(value),
      },
    ],
    [accountMap]
  );

  return (
    <Space direction="vertical" size={16} style={{ display: "flex" }}>
      <div>
        <Title level={2} style={{ marginBottom: 0 }}>
          Social Accounts
        </Title>
        <Paragraph type="secondary" style={{ marginTop: 8 }}>
          Conecta Meta, sincroniza tus páginas y deja lista la base para
          publicaciones y generación con IA.
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Card>
                  <Space align="start">
                    <LinkOutlined style={{ fontSize: 20 }} />
                    <Statistic
                      title="Cuentas conectadas"
                      value={accounts.length}
                      valueStyle={{ fontSize: 28 }}
                    />
                  </Space>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card>
                  <Space align="start">
                    <FacebookOutlined style={{ fontSize: 20 }} />
                    <Statistic
                      title="Páginas disponibles"
                      value={pages.length}
                      valueStyle={{ fontSize: 28 }}
                    />
                  </Space>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card>
                  <Space align="start">
                    <CheckCircleOutlined style={{ fontSize: 20 }} />
                    <Statistic
                      title="Cuentas activas"
                      value={activeAccountsCount}
                      valueStyle={{ fontSize: 28 }}
                    />
                  </Space>
                </Card>
              </Col>
            </Row>
      <Alert
        type="info"
        showIcon
        message="Integración Meta"
        description="Conecta tu cuenta de Facebook, sincroniza las páginas administradas y úsalas después en Posts y AI."
      />

      <Card>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Space direction="vertical" size={4}>
              <Text strong>Conectar nueva cuenta</Text>
              <Text type="secondary">
                Inicia el flujo OAuth con Meta para registrar una cuenta en el
                tenant actual.
              </Text>
            </Space>
          </Col>

          <Col>
            <Button
              type="primary"
              icon={<FacebookOutlined />}
              loading={connecting}
              onClick={handleConnectMeta}
            >
              Conectar Facebook
            </Button>
          </Col>
        </Row>
      </Card>

      <Card
        title="Cuentas conectadas"
        extra={accountsFetching ? <Text type="secondary">Actualizando...</Text> : null}
      >
        {accountsLoading ? (
          <div style={{ textAlign: "center", padding: 32 }}>
            <Spin />
          </div>
        ) : accounts.length === 0 ? (
          <Empty description="Todavía no hay cuentas conectadas" />
        ) : (
          <Table<SocialAccount>
            rowKey="id"
            columns={accountColumns}
            dataSource={accounts}
            pagination={false}
            scroll={{ x: 900 }}
          />
        )}
      </Card>

      <Card
        title="Páginas disponibles"
        extra={pagesFetching ? <Text type="secondary">Actualizando...</Text> : null}
      >
        {pagesLoading ? (
          <div style={{ textAlign: "center", padding: 32 }}>
            <Spin />
          </div>
        ) : sortedPages.length === 0 ? (
          <Empty description="Aún no hay páginas sincronizadas">
            <Button
              icon={<ReloadOutlined />}
              loading={syncMutation.isPending}
              onClick={handleSyncFirstAvailable}
            >
              Sincronizar ahora
            </Button>
          </Empty>
        ) : (
          <Table<SocialPage>
            rowKey="id"
            columns={pageColumns}
            dataSource={sortedPages}
            pagination={false}
            scroll={{ x: 800 }}
          />
        )}
      </Card>
    </Space>
  );
}