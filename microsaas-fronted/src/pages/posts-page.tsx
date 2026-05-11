import { useCallback, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  Empty,
  Grid,
  Input,
  Popconfirm,
  Segmented,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EyeOutlined,
  EditOutlined,
  SendOutlined,
  ReloadOutlined,
  StopOutlined,
  RollbackOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { usePosts } from "../features/posts/hooks/use-posts";
import {
  PostFormDrawer,
  type PostPageOption,
} from "../features/posts/components/post-form-drawer";
import { AiGenerateDrawer } from "../features/posts/components/ai-generate-drawer";
import { AiPreviewCard } from "../features/posts/components/ai-preview-card";
import { PostDetailDrawer } from "../features/posts/components/post-detail-drawer";
import { useSocialPages } from "../features/dashboard/hooks/use-social-pages";
import { postService } from "../services/post.service";

import type {
  PostItem,
  PostStatus,
  PostTargetItem,
} from "../types/post.types";
import type {
  GenerateFullPostResponse,
  RegeneratePostRequest,
} from "../types/ai.types";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

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

  return date.toLocaleString("es-EC");
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

function PostActionIcons({
  post,
  onDetail,
  onEdit,
  onRefresh,
  compact = false,
}: {
  post: PostItem;
  onDetail: (post: PostItem) => void;
  onEdit: (post: PostItem) => void;
  onRefresh: () => Promise<void>;
  compact?: boolean;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      action,
      postId,
    }: {
      action: "publish" | "cancel" | "retry" | "restore";
      postId: number;
    }) => {
      if (action === "publish") return postService.publishPost(postId);
      if (action === "cancel") return postService.cancelPost(postId);
      if (action === "retry") return postService.retryPost(postId);
      return postService.restorePost(postId);
    },
    onSuccess: async () => {
      message.success("Acción realizada correctamente.");
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await onRefresh();
    },
    onError: (err) => {
      message.error(
        err instanceof Error
          ? err.message
          : "No se pudo realizar la acción."
      );
    },
  });

  const canEdit = post.status === "DRAFT" || post.status === "SCHEDULED";
  const canPublish = post.status === "DRAFT";
  const canCancel =
    post.status === "DRAFT" ||
    post.status === "SCHEDULED" ||
    post.status === "PROCESSING";
  const canRetry = post.status === "FAILED";
  const canRestore = post.status === "CANCELED";

  return (
    <Space
      size={compact ? 2 : 4}
      style={{
        display: "flex",
        flexWrap: "nowrap",
        justifyContent: "flex-end",
        width: "100%",
      }}
    >
      <Tooltip title="Ver detalle">
        <Button
          type="text"
          shape="circle"
          size={compact ? "small" : "middle"}
          icon={<EyeOutlined />}
          onClick={() => onDetail(post)}
        />
      </Tooltip>

      {canEdit && (
        <Tooltip title="Editar">
          <Button
            type="text"
            shape="circle"
            size={compact ? "small" : "middle"}
            icon={<EditOutlined />}
            onClick={() => onEdit(post)}
          />
        </Tooltip>
      )}

      {canPublish && (
        <Tooltip title="Publicar">
          <Popconfirm
            title="¿Publicar este post?"
            okText="Sí, publicar"
            cancelText="No"
            onConfirm={() =>
              mutation.mutate({ action: "publish", postId: post.id })
            }
          >
            <Button
              type="text"
              shape="circle"
              size={compact ? "small" : "middle"}
              loading={mutation.isPending}
              icon={<SendOutlined />}
              style={{ color: "#52c41a" }}
            />
          </Popconfirm>
        </Tooltip>
      )}

      {canRetry && (
        <Tooltip title="Reintentar">
          <Button
            type="text"
            shape="circle"
            size={compact ? "small" : "middle"}
            loading={mutation.isPending}
            icon={<ReloadOutlined />}
            style={{ color: "#1677ff" }}
            onClick={() => mutation.mutate({ action: "retry", postId: post.id })}
          />
        </Tooltip>
      )}

      {canRestore && (
        <Tooltip title="Restaurar">
          <Button
            type="text"
            shape="circle"
            size={compact ? "small" : "middle"}
            loading={mutation.isPending}
            icon={<RollbackOutlined />}
            style={{ color: "#1677ff" }}
            onClick={() =>
              mutation.mutate({ action: "restore", postId: post.id })
            }
          />
        </Tooltip>
      )}

      {canCancel && (
        <Tooltip title="Cancelar">
          <Popconfirm
            title="¿Cancelar este post?"
            okText="Sí, cancelar"
            cancelText="No"
            onConfirm={() =>
              mutation.mutate({ action: "cancel", postId: post.id })
            }
          >
            <Button
              type="text"
              shape="circle"
              size={compact ? "small" : "middle"}
              loading={mutation.isPending}
              icon={<StopOutlined />}
              danger
            />
          </Popconfirm>
        </Tooltip>
      )}
    </Space>
  );
}

function PostMobileCard({
  post,
  onDetail,
  onEdit,
  onRefresh,
}: {
  post: PostItem;
  onDetail: (post: PostItem) => void;
  onEdit: (post: PostItem) => void;
  onRefresh: () => Promise<void>;
}) {
  return (
    <Card
      size="small"
      style={{
        width: "100%",
        borderRadius: 14,
      }}
      styles={{
        body: {
          padding: 14,
        },
      }}
    >
      <Space direction="vertical" size={10} style={{ width: "100%" }}>
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <Text strong>#{post.id}</Text>
          <Tag color={getStatusColor(post.status)} style={{ marginInlineEnd: 0 }}>
            {getStatusLabel(post.status)}
          </Tag>
        </Space>

        <Paragraph
          style={{ marginBottom: 0 }}
          ellipsis={{ rows: 4, expandable: true, symbol: "ver más" }}
        >
          {post.content}
        </Paragraph>

        <Space direction="vertical" size={2} style={{ width: "100%" }}>
          <Text type="secondary">Programado: {formatDate(post.scheduledAt)}</Text>
          <Text type="secondary">Publicado: {formatDate(post.publishedAt)}</Text>
        </Space>

        <div>
          <Text type="secondary">Páginas objetivo:</Text>

          <div style={{ marginTop: 6 }}>
            {post.targets?.length ? (
              <Space wrap size={[4, 6]}>
                {post.targets.map((target) => (
                  <Tag
                    key={`${target.socialPageId}-${target.pageName}`}
                    color={getTargetStatusColor(target.status)}
                    style={{ marginInlineEnd: 0 }}
                  >
                    {target.pageName} - {getTargetStatusLabel(target.status)}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Text type="secondary">Sin páginas</Text>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 4,
          }}
        >
          <PostActionIcons
            post={post}
            onDetail={onDetail}
            onEdit={onEdit}
            onRefresh={onRefresh}
            compact
          />
        </div>
      </Space>
    </Card>
  );
}

export function PostsPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg;
  const isSmallMobile = !screens.sm;

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [status, setStatus] = useState<PostStatus | undefined>(undefined);
  const [search, setSearch] = useState("");

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

  const { data: socialPagesRaw, isLoading: isLoadingPages } = useSocialPages();

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

  const handleOpenCreate = useCallback(() => {
    setDrawerMode("create");
    setSelectedPostId(null);
    setDrawerOpen(true);
  }, []);

  const handleOpenEdit = useCallback((post: PostItem) => {
    setDrawerMode("edit");
    setSelectedPostId(post.id);
    setDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelectedPostId(null);
    setDrawerMode("create");
  }, []);

  const handleSaved = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleGenerated = useCallback(
    async (result: GenerateFullPostResponse, payload: RegeneratePostRequest) => {
      setGeneratedPost(result);
      setRegeneratePayload(payload);
      await refetch();
    },
    [refetch]
  );

  const handlePostUpdatedFromRegeneration = useCallback(
    async (updatedPost: PostItem) => {
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
    },
    [refetch]
  );

  const handleOpenDetail = useCallback((post: PostItem) => {
    setDetailPostId(post.id);
    setDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailOpen(false);
    setDetailPostId(null);
  }, []);

  const handleOpenPostById = useCallback(
    (postId: number) => {
      const postToEdit = data?.items?.find((item) => item.id === postId) ?? null;

      if (!postToEdit) {
        message.warning("No se encontró el post en la lista actual.");
        return;
      }

      setDrawerMode("edit");
      setSelectedPostId(postToEdit.id);
      setDrawerOpen(true);
    },
    [data]
  );

  const rawPosts = data?.items ?? [];

  const posts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return rawPosts;

    return rawPosts.filter((post) => {
      const content = post.content?.toLowerCase() ?? "";
      const statusText = getStatusLabel(post.status).toLowerCase();

      const targetText =
        post.targets
          ?.map((target) => `${target.pageName} ${target.status}`)
          .join(" ")
          .toLowerCase() ?? "";

      return (
        content.includes(normalizedSearch) ||
        statusText.includes(normalizedSearch) ||
        targetText.includes(normalizedSearch) ||
        String(post.id).includes(normalizedSearch)
      );
    });
  }, [rawPosts, search]);

  const columns: ColumnsType<PostItem> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 70,
      },
      {
        title: "Contenido",
        dataIndex: "content",
        key: "content",
        render: (value: string) => (
          <Paragraph
            style={{ marginBottom: 0, maxWidth: 460 }}
            ellipsis={{ rows: 3 }}
          >
            {value}
          </Paragraph>
        ),
      },
      {
        title: "Estado",
        dataIndex: "status",
        key: "status",
        width: 140,
        render: (statusValue: PostStatus) => (
          <Tag color={getStatusColor(statusValue)}>
            {getStatusLabel(statusValue)}
          </Tag>
        ),
      },
      {
        title: "Fecha",
        key: "date",
        width: 190,
        render: (_, record) => (
          <Space direction="vertical" size={2}>
            <Text type="secondary">
              Programado: {formatDate(record.scheduledAt)}
            </Text>
            <Text type="secondary">
              Publicado: {formatDate(record.publishedAt)}
            </Text>
          </Space>
        ),
      },
      {
        title: "Páginas",
        dataIndex: "targets",
        key: "targets",
        width: 240,
        render: (targets: PostTargetItem[]) => (
          <Space wrap size={[4, 6]}>
            {targets?.length ? (
              targets.map((target) => (
                <Tag
                  key={`${target.socialPageId}-${target.pageName}`}
                  color={getTargetStatusColor(target.status)}
                  style={{ marginInlineEnd: 0 }}
                >
                  {target.pageName}
                </Tag>
              ))
            ) : (
              <Text type="secondary">Sin páginas</Text>
            )}
          </Space>
        ),
      },
      {
        title: "Acciones",
        key: "actions",
        width: 190,
        align: "right",
        render: (_, record) => (
          <PostActionIcons
            post={record}
            onDetail={handleOpenDetail}
            onEdit={handleOpenEdit}
            onRefresh={handleSaved}
          />
        ),
      },
    ],
    [handleOpenDetail, handleOpenEdit, handleSaved]
  );

  return (
    <Card
      style={{ width: "100%" }}
      styles={{
        body: {
          padding: isMobile ? 14 : 24,
        },
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 18 : 24,
          width: "100%",
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <Title
              level={2}
              style={{
                marginBottom: 4,
                fontSize: isMobile ? 24 : 30,
              }}
            >
              Publicaciones
            </Title>
            <Text type="secondary">
              Administra borradores, publicaciones programadas, publicadas y
              fallidas.
            </Text>
          </div>

          <Space
            wrap
            style={{
              width: isSmallMobile ? "100%" : undefined,
              justifyContent: isSmallMobile ? "space-between" : "flex-end",
            }}
          >
            <Button
              onClick={() => setAiDrawerOpen(true)}
              disabled={isLoadingPages || pageOptions.length === 0}
              style={{ flex: isSmallMobile ? 1 : undefined }}
            >
              Generar con IA
            </Button>

            <Button
              type="primary"
              onClick={handleOpenCreate}
              disabled={isLoadingPages || pageOptions.length === 0}
              style={{ flex: isSmallMobile ? 1 : undefined }}
            >
              Nuevo post
            </Button>
          </Space>
        </div>

        <Card
          size="small"
          style={{
            borderRadius: 16,
            background: "#fafafa",
          }}
        >
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <Space
              wrap
              style={{
                width: "100%",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="Buscar por contenido, página, estado o ID..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                style={{
                  width: isMobile ? "100%" : 360,
                }}
              />

              <Space wrap style={{ width: isMobile ? "100%" : undefined }}>
                <Select
                  allowClear
                  placeholder="Estado"
                  style={{ width: isMobile ? "100%" : 220 }}
                  value={status}
                  onChange={(value) => {
                    setPage(0);
                    setStatus(value);
                  }}
                  options={STATUS_OPTIONS}
                />

                <Button
                  onClick={() => {
                    setSearch("");
                    setStatus(undefined);
                    setPage(0);
                  }}
                >
                  Limpiar filtros
                </Button>
              </Space>
            </Space>

            <Segmented
              block={isMobile}
              value={status ?? "ALL"}
              onChange={(value) => {
                setPage(0);
                setStatus(value === "ALL" ? undefined : (value as PostStatus));
              }}
              options={[
                { label: "Todos", value: "ALL" },
                { label: "Borradores", value: "DRAFT" },
                { label: "Programados", value: "SCHEDULED" },
                { label: "Publicados", value: "PUBLISHED" },
                { label: "Fallidos", value: "FAILED" },
                { label: "Cancelados", value: "CANCELED" },
              ]}
              style={{
                overflowX: "auto",
              }}
            />

            <Text type="secondary">
              Mostrando {posts.length} publicación{posts.length === 1 ? "" : "es"}
              {search.trim() ? " según la búsqueda actual." : "."}
            </Text>
          </Space>
        </Card>

        {generatedPost && regeneratePayload && (
          <AiPreviewCard
            post={generatedPost}
            regeneratePayload={regeneratePayload}
            onNewGenerate={() => {
              setGeneratedPost(null);
              setRegeneratePayload(null);
              setAiDrawerOpen(true);
            }}
            onEditPost={handleOpenPostById}
            onOpenPost={handleOpenPostById}
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

        {isMobile ? (
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostMobileCard
                  key={post.id}
                  post={post}
                  onDetail={handleOpenDetail}
                  onEdit={handleOpenEdit}
                  onRefresh={handleSaved}
                />
              ))
            ) : (
              <Empty
                description={
                  search || status
                    ? "No se encontraron publicaciones con los filtros aplicados."
                    : "Todavía no hay publicaciones creadas."
                }
              />
            )}

            {posts.length > 0 && (
              <Space
                wrap
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <Button
                  disabled={page <= 0 || isLoading}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  style={{ flex: isSmallMobile ? 1 : undefined }}
                >
                  Anterior
                </Button>

                <Text
                  style={{
                    width: isSmallMobile ? "100%" : undefined,
                    textAlign: "center",
                    order: isSmallMobile ? -1 : undefined,
                  }}
                >
                  Página {(data?.page ?? page) + 1} de {data?.totalPages ?? 1}
                </Text>

                <Button
                  disabled={
                    isLoading ||
                    (data?.totalPages ? page + 1 >= data.totalPages : true)
                  }
                  onClick={() => setPage((prev) => prev + 1)}
                  style={{ flex: isSmallMobile ? 1 : undefined }}
                >
                  Siguiente
                </Button>
              </Space>
            )}
          </Space>
        ) : (
          <Table<PostItem>
            rowKey="id"
            loading={isLoading}
            columns={columns}
            dataSource={posts}
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
          />
        )}

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