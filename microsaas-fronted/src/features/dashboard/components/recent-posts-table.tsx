import { Space, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { PostItem, PostStatus } from "../../../types/post.types";

const { Text } = Typography;

type Props = {
  posts: PostItem[];
  loading?: boolean;
};

function getStatusColor(status: PostStatus) {
  switch (status) {
    case "PUBLISHED":
      return "green";
    case "FAILED":
      return "red";
    case "SCHEDULED":
      return "blue";
    case "DRAFT":
      return "gold";
    case "PROCESSING":
      return "purple";
    case "CANCELED":
      return "default";
    default:
      return "default";
  }
}

function getStatusLabel(status: PostStatus) {
  switch (status) {
    case "PUBLISHED":
      return "Publicado";
    case "FAILED":
      return "Fallido";
    case "SCHEDULED":
      return "Programado";
    case "DRAFT":
      return "Borrador";
    case "PROCESSING":
      return "Procesando";
    case "CANCELED":
      return "Cancelado";
    default:
      return status;
  }
}

function formatDate(date?: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleString();
}

export function RecentPostsTable({ posts, loading }: Props) {
  const columns: ColumnsType<PostItem> = [
    {
      title: "Contenido",
      dataIndex: "content",
      key: "content",
      render: (value: string, record) => (
        <Space direction="vertical" size={2}>
          <Text ellipsis={{ tooltip: value }} style={{ maxWidth: 380 }}>
            {value}
          </Text>

          {record.mediaUrl ? (
            <Text type="secondary" style={{ fontSize: 12 }}>
              Con imagen
            </Text>
          ) : null}
        </Space>
      ),
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: PostStatus) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: "Páginas",
      key: "pages",
      render: (_, record) => {
        if (!record.targets?.length) return "-";

        return (
          <Space size={[4, 4]} wrap>
            {record.targets.map((target) => (
              <Tag key={target.socialPageId}>{target.pageName}</Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: "Creado",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => formatDate(value),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={posts}
      loading={loading}
      pagination={false}
      scroll={{ x: 900 }}
    />
  );
}