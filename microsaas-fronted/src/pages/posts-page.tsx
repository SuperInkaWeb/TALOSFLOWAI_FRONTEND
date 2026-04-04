import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";

import { usePosts } from "../features/posts/hooks/use-posts";
import { PostActions } from "../features/posts/components/post-actions";
import {
  PostFormDrawer,
  type PostPageOption,
} from "../features/posts/components/post-form-drawer";
import { AiGenerateDrawer } from "../features/posts/components/ai-generate-drawer";
import { AiPreviewCard } from "../features/posts/components/ai-preview-card";
import { PostDetailDrawer } from "../features/posts/components/post-detail-drawer";
import { useSocialPages } from "../features/dashboard/hooks/use-social-pages";

import type {
  PostItem,
  PostStatus,
  PostTargetItem,
} from "../types/post.types";
import type {
  GenerateFullPostResponse,
  RegeneratePostRequest,
} from "../types/ai.types";

const { Title, Text } = Typography;

const STATUS_OPTIONS: { label: string; value: PostStatus }[] = [
  { label: "Borrador", value: "DRAFT" },
  { label: "Programado", value: "SCHEDULED" },
  { label: "Procesando", value: "PROCESSING" },
  { label: "Publicado", value: "PUBLISHED" },
  { label: "Fallido", value: "FAILED" },
  { label: "Cancelado", value: "CANCELED" },
];

function getStatusColor(status: PostStatus) {
  switch (status) {
    case "DRAFT":
      return "default";
    case "SCHEDULED":
      return "blue";
    case "PROCESSING":
      return "gold";
    case "PUBLISHED":
      return "green";
    case "FAILED":
      return "red";
    case "CANCELED":
      return "volcano";
    default:
      return "default";
  }
}

function getStatusLabel(status: PostStatus) {
  switch (status) {
    case "DRAFT":
      return "BORRADOR";
    case "SCHEDULED":
      return "PROGRAMADO";
    case "PROCESSING":
      return "PROCESANDO";
    case "PUBLISHED":
      return "PUBLICADO";
    case "FAILED":
      return "FALLIDO";
    case "CANCELED":
      return "CANCELADO";
    default:
      return status;
  }
}

function getTargetStatusColor(status: PostTargetItem["status"]) {
  switch (status) {
    case "PENDING":
      return "gold";
    case "SUCCESS":
      return "green";
    case "FAILED":
      return "red";
    case "CANCELED":
      return "volcano";
    default:
      return "default";
  }
}

function getTargetStatusLabel(status: PostTargetItem["status"]) {
  switch (status) {
    case "PENDING":
      return "PENDIENTE";
    case "SUCCESS":
      return "EXITOSO";
    case "FAILED":
      return "FALLIDO";
    case "CANCELED":
      return "CANCELADO";
    default:
      return status;
  }
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString();
}

function normalizePages(raw: unknown): PostPageOption[] {
  const map = new Map<number, PostPageOption>();

  const add = (id: unknown, name: unknown) => {
    if (typeof id !== "number") return;
    if (!Number.isFinite(id)) return;
    if (typeof name !== "string" || !name.trim()) return;

    if (!map.has(id)) {
      map.set(id, { id, name: name.trim() });
    }
  };

  const visit = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    if (!value || typeof value !== "object") return;

    const item = value as Record<string, unknown>;

    if (
      typeof item.socialPageId === "number" &&
      typeof item.pageName === "string"
    ) {
      add(item.socialPageId, item.pageName);
    }

    if (typeof item.id === "number" && typeof item.pageName === "string") {
      add(item.id, item.pageName);
    }

    if (Array.isArray(item.pages)) {
      item.pages.forEach((page) => {
        if (!page || typeof page !== "object") return;

        const pageObj = page as Record<string, unknown>;

        if (
          typeof pageObj.socialPageId === "number" &&
          typeof pageObj.pageName === "string"
        ) {
          add(pageObj.socialPageId, pageObj.pageName);
        }

        if (
          typeof pageObj.id === "number" &&
          typeof pageObj.pageName === "string"
        ) {
          add(pageObj.id, pageObj.pageName);
        }
      });
    }
  };

  visit(raw);

  return Array.from(map.values());
}

export function PostsPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [status, setStatus] = useState<PostStatus | undefined>(undefined);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [generatedPost, setGeneratedPost] =
    useState<GenerateFullPostResponse | null>(null);
  const [regeneratePayload, setRegeneratePayload] =
    useState<RegeneratePostRequest | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailPostId, setDetailPostId] = useState<number | null>(null);

  const { data, isLoading, isError, error, refetch } = usePosts({
    page,
    size,
    status,
  });

  const {
    data: socialPagesRaw,
    isLoading: isLoadingPages,
  } = useSocialPages();

  const pageOptions = useMemo(
    () => normalizePages(socialPagesRaw),
    [socialPagesRaw]
  );

  const selectedPost = useMemo(() => {
    if (!selectedPostId || !data?.items?.length) return null;
    return data.items.find((item) => item.id === selectedPostId) ?? null;
  }, [data, selectedPostId]);

  const detailPost = useMemo(() => {
    if (!detailPostId || !data?.items?.length) return null;
    return data.items.find((item) => item.id === detailPostId) ?? null;
  }, [data, detailPostId]);

  const handleOpenCreate = () => {
    setDrawerMode("create");
    setSelectedPostId(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (post: PostItem) => {
    setDrawerMode("edit");
    setSelectedPostId(post.id);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedPostId(null);
    setDrawerMode("create");
  };

  const handleSaved = async () => {
    await refetch();
  };

  const handleGenerated = async (
    result: GenerateFullPostResponse,
    payload: RegeneratePostRequest
  ) => {
    setGeneratedPost(result);
    setRegeneratePayload(payload);
    await refetch();
  };

  const handlePostUpdatedFromRegeneration = async (updatedPost: PostItem) => {
    setGeneratedPost((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        text: updatedPost.content,
        imageUrl: updatedPost.mediaUrl ?? prev.imageUrl,
        status: updatedPost.status,
        scheduledAt: updatedPost.scheduledAt ?? prev.scheduledAt,
      };
    });

    await refetch();
  };

  const handleOpenDetail = (post: PostItem) => {
    setDetailPostId(post.id);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setDetailPostId(null);
  };

  const columns: ColumnsType<PostItem> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 90,
      },
      {
        title: "Contenido",
        dataIndex: "content",
        key: "content",
        width: 340,
        render: (value: string) => (
          <div
            style={{
              maxWidth: 340,
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: 1.6,
            }}
          >
            <Text>
              {value.length > 180 ? `${value.slice(0, 180)}...` : value}
            </Text>
          </div>
        ),
      },
      {
        title: "Estado",
        dataIndex: "status",
        key: "status",
        width: 150,
        render: (statusValue: PostStatus) => (
          <Tag color={getStatusColor(statusValue)}>
            {getStatusLabel(statusValue)}
          </Tag>
        ),
      },
      {
        title: "Programado",
        dataIndex: "scheduledAt",
        key: "scheduledAt",
        width: 190,
        render: (value?: string | null) => formatDate(value),
      },
      {
        title: "Publicado",
        dataIndex: "publishedAt",
        key: "publishedAt",
        width: 190,
        render: (value?: string | null) => formatDate(value),
      },
      {
        title: "Páginas objetivo",
        dataIndex: "targets",
        key: "targets",
        width: 280,
        render: (targets: PostTargetItem[]) => (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {targets?.length ? (
              targets.map((target) => (
                <Space key={`${target.socialPageId}-${target.pageName}`} wrap>
                  <Text>{target.pageName}</Text>
                  <Tag color={getTargetStatusColor(target.status)}>
                    {getTargetStatusLabel(target.status)}
                  </Tag>
                </Space>
              ))
            ) : (
              <Text type="secondary">Sin páginas</Text>
            )}
          </div>
        ),
      },
      {
        title: "Acciones",
        key: "actions",
        width: 340,
        render: (_, record) => (
          <Space wrap>
            <Button onClick={() => handleOpenDetail(record)}>
              Ver detalle
            </Button>
            <PostActions post={record} onEdit={handleOpenEdit} />
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <Card>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div>
            <Title level={2} style={{ marginBottom: 4 }}>
              Publicaciones
            </Title>
            <Text type="secondary">
              Administra borradores, publicaciones programadas, publicadas y
              fallidas.
            </Text>
          </div>

          <Space wrap>
            <Button
              onClick={() => setAiDrawerOpen(true)}
              disabled={isLoadingPages || pageOptions.length === 0}
            >
              Generar con IA
            </Button>

            <Button type="primary" onClick={handleOpenCreate}>
              Nuevo post
            </Button>
          </Space>
        </div>

        <div>
          <Text strong>Filtrar por estado</Text>
          <br />
          <Select
            allowClear
            placeholder="Todos"
            style={{ width: 220, marginTop: 8 }}
            value={status}
            onChange={(value) => {
              setPage(0);
              setStatus(value);
            }}
            options={STATUS_OPTIONS}
          />
        </div>

        {generatedPost && regeneratePayload && (
          <AiPreviewCard
            post={generatedPost}
            regeneratePayload={regeneratePayload}
            onNewGenerate={() => {
              setGeneratedPost(null);
              setRegeneratePayload(null);
              setAiDrawerOpen(true);
            }}
            onEditPost={(postId) => {
              const postToEdit =
                data?.items?.find((item) => item.id === postId) ?? null;

              if (!postToEdit) return;

              setDrawerMode("edit");
              setSelectedPostId(postToEdit.id);
              setDrawerOpen(true);
            }}
            onOpenPost={(postId) => {
              const postToEdit =
                data?.items?.find((item) => item.id === postId) ?? null;

              if (!postToEdit) return;

              setDrawerMode("edit");
              setSelectedPostId(postToEdit.id);
              setDrawerOpen(true);
            }}
            onClosePreview={() => {
              setGeneratedPost(null);
              setRegeneratePayload(null);
            }}
            onPostUpdated={handlePostUpdatedFromRegeneration}
          />
        )}

        {isError && (
          <Alert
            type="error"
            showIcon
            message="No se pudo cargar las publicaciones"
            description={
              error instanceof Error
                ? error.message
                : "Ocurrió un error inesperado al consultar el backend."
            }
          />
        )}

        <Table<PostItem>
          rowKey="id"
          loading={isLoading}
          columns={columns}
          dataSource={data?.items ?? []}
          pagination={{
            current: (data?.page ?? page) + 1,
            pageSize: data?.size ?? size,
            total: data?.totalItems ?? 0,
            showSizeChanger: true,
            onChange: (nextPage, nextSize) => {
              setPage(nextPage - 1);
              setSize(nextSize);
            },
          }}
          scroll={{ x: 1400 }}
        />

        <PostFormDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          onSaved={handleSaved}
          pages={pageOptions}
          mode={drawerMode}
          post={selectedPost}
        />

        <AiGenerateDrawer
          open={aiDrawerOpen}
          onClose={() => setAiDrawerOpen(false)}
          onSuccess={handleGenerated}
          pages={pageOptions}
        />

                    <PostDetailDrawer
              open={detailOpen}
              onClose={handleCloseDetail}
              post={detailPost}
              onEdit={(post) => {
                setDetailOpen(false);
                setDetailPostId(null);
                handleOpenEdit(post);
              }}
              onRegenerateImage={(post) => {
                setDetailOpen(false);
                setDetailPostId(null);
                handleOpenEdit(post);
              }}
              onRegenerateText={(post) => {
                setDetailOpen(false);
                setDetailPostId(null);
                handleOpenEdit(post);
              }}
            />
        {!isLoadingPages && pageOptions.length === 0 && (
          <Alert
            type="warning"
            showIcon
            message="No se detectaron páginas internas para publicar"
            description="Verifica que useSocialPages esté trayendo los IDs internos de las páginas conectadas."
          />
        )}
      </div>
    </Card>
  );
}