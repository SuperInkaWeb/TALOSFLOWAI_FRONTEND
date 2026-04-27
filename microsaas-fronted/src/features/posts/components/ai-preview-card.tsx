import { useMemo } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Image,
  Progress,
  Row,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import { useRegeneratePostImage } from "../hooks/use-regenerate-post-image";
import { useRegeneratePostText } from "../hooks/use-regenerate-post-text";
import type {
  GenerateFullPostResponse,
  RegeneratePostRequest,
} from "../../../types/ai.types";
import type { PostItem, PostStatus } from "../../../types/post.types";

const { Paragraph, Text, Title } = Typography;

type Props = {
  post: GenerateFullPostResponse;
  regeneratePayload: RegeneratePostRequest;
  onNewGenerate?: () => void;
  onEditPost?: (postId: number) => void;
  onOpenPost?: (postId: number) => void;
  onClosePreview?: () => void;
  onPostUpdated?: (post: PostItem) => void;
};

function formatStatusLabel(status: PostStatus) {
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

function prettifyScoreKey(key: string) {
  const labels: Record<string, string> = {
    total: "Total",
    headlineClarity: "Claridad del headline",
    visualBalance: "Balance visual",
    ctaStrength: "Fuerza del CTA",
    industryAlignment: "Alineación con industria",
    strategyAlignment: "Alineación con estrategia",
    textDensity: "Densidad de texto",
    notes: "Notas",
  };

  return labels[key] ?? key;
}

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getErrorMessage(error: unknown, fallback: string) {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response
  ) {
    const data = error.response.data as { message?: string; error?: string };
    return data?.message || data?.error || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function getTopAlert(status: PostStatus) {
  switch (status) {
    case "DRAFT":
      return {
        type: "success" as const,
        message: "Contenido generado correctamente",
        description:
          "Ya puedes revisarlo, regenerarlo, editarlo o abrir el post para continuar el flujo.",
      };
    case "SCHEDULED":
      return {
        type: "info" as const,
        message: "Contenido generado y programado",
        description:
          "El post ya tiene una fecha programada. Puedes revisarlo o ajustarlo.",
      };
    case "PROCESSING":
      return {
        type: "warning" as const,
        message: "Contenido en procesamiento",
        description:
          "La publicación todavía está en proceso. Revisa el estado en unos momentos.",
      };
    case "FAILED":
      return {
        type: "error" as const,
        message: "La generación o publicación tuvo problemas",
        description:
          "Puedes revisar el contenido, regenerarlo o abrir el post para corregirlo.",
      };
    case "PUBLISHED":
      return {
        type: "success" as const,
        message: "Contenido publicado",
        description:
          "El post ya fue publicado. Puedes revisar el resultado y los detalles.",
      };
    case "CANCELED":
      return {
        type: "warning" as const,
        message: "Contenido cancelado",
        description:
          "El post fue cancelado. Puedes abrirlo para revisar qué hacer después.",
      };
    default:
      return {
        type: "info" as const,
        message: "Resultado disponible",
        description: "Revisa el contenido generado.",
      };
  }
}

export function AiPreviewCard({
  post,
  regeneratePayload,
  onNewGenerate,
  onEditPost,
  onOpenPost,
  onClosePreview,
  onPostUpdated,
}: Props) {
  const [messageApi, contextHolder] = message.useMessage();
  const regenerateTextMutation = useRegeneratePostText();
  const regenerateImageMutation = useRegeneratePostImage();

  const isBusy =
    regenerateTextMutation.isPending || regenerateImageMutation.isPending;

  const hashtags = useMemo(() => post.copyBlocks?.hashtags ?? [], [post.copyBlocks]);

  const qualityEntries = useMemo(
    () => (post.qualityScore ? Object.entries(post.qualityScore) : []),
    [post.qualityScore]
  );

  const totalScore = useMemo(() => {
    const totalScoreRaw = post.qualityScore?.total;
    const value =
      typeof totalScoreRaw === "number"
        ? totalScoreRaw
        : Number(totalScoreRaw ?? 0);

    return clampPercent(value);
  }, [post.qualityScore]);

  const metricEntries = useMemo(
    () =>
      qualityEntries.filter(
        ([key, value]) =>
          key !== "total" &&
          key !== "notes" &&
          value !== null &&
          value !== undefined &&
          typeof value !== "string"
      ),
    [qualityEntries]
  );

  const notes = post.qualityScore?.notes;
  const status = post.status as PostStatus;
  const topAlert = getTopAlert(status);

  const handleRegenerateText = async () => {
    try {
      const updatedPost = await regenerateTextMutation.mutateAsync({
        postId: post.postId,
        data: regeneratePayload,
      });

      messageApi.success("Texto regenerado correctamente");
      onPostUpdated?.(updatedPost);
    } catch (error) {
      messageApi.error(getErrorMessage(error, "No se pudo regenerar el texto"));
    }
  };

  const handleRegenerateImage = async () => {
    try {
      const updatedPost = await regenerateImageMutation.mutateAsync({
        postId: post.postId,
        data: regeneratePayload,
      });

      messageApi.success("Imagen regenerada correctamente");
      onPostUpdated?.(updatedPost);
    } catch (error) {
      messageApi.error(getErrorMessage(error, "No se pudo regenerar la imagen"));
    }
  };

  return (
    <>
      {contextHolder}

      <Card
        style={{ borderRadius: 18, marginBottom: 24 }}
        styles={{ body: { padding: 24 } }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <div style={{ minWidth: 280, flex: 1 }}>
            <Title level={4} style={{ margin: 0 }}>
              Contenido generado con IA
            </Title>
            <Text
              type="secondary"
              style={{
                display: "block",
                marginTop: 4,
                lineHeight: 1.5,
                whiteSpace: "normal",
                wordBreak: "break-word",
              }}
            >
              Revisa el resultado antes de continuar con la edición o publicación.
            </Text>
          </div>

          <Space wrap>
            {onNewGenerate && (
              <Button onClick={onNewGenerate} disabled={isBusy}>
                Nueva generación
              </Button>
            )}

            <Button
              loading={regenerateTextMutation.isPending}
              onClick={handleRegenerateText}
              disabled={isBusy && !regenerateTextMutation.isPending}
            >
              Regenerar texto
            </Button>

            <Button
              loading={regenerateImageMutation.isPending}
              onClick={handleRegenerateImage}
              disabled={isBusy && !regenerateImageMutation.isPending}
            >
              Regenerar imagen
            </Button>

            {onEditPost && (
              <Button
                onClick={() => onEditPost(post.postId)}
                disabled={isBusy}
              >
                Editar post
              </Button>
            )}

            {onOpenPost && (
              <Button
                type="primary"
                onClick={() => onOpenPost(post.postId)}
                disabled={isBusy}
              >
                Ir al post
              </Button>
            )}

            {onClosePreview && (
              <Button type="text" onClick={onClosePreview} disabled={isBusy}>
                Cerrar
              </Button>
            )}
          </Space>
        </div>

        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Alert
            type={topAlert.type}
            showIcon
            message={topAlert.message}
            description={topAlert.description}
            style={{ borderRadius: 12 }}
          />

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card size="small" style={{ borderRadius: 14 }}>
                <Text type="secondary">Post ID</Text>
                <Title level={4} style={{ margin: "8px 0 0" }}>
                  {post.postId}
                </Title>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card size="small" style={{ borderRadius: 14 }}>
                <Text type="secondary">Estado</Text>
                <div style={{ marginTop: 8 }}>
                  <Tag color={getStatusColor(status)}>
                    {formatStatusLabel(status)}
                  </Tag>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card size="small" style={{ borderRadius: 14 }}>
                <Text type="secondary">Variantes</Text>
                <Title level={4} style={{ margin: "8px 0 0" }}>
                  {post.generatedVariants ?? 1}
                </Title>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card size="small" style={{ borderRadius: 14 }}>
                <Text type="secondary">Layout</Text>
                <div style={{ marginTop: 8 }}>
                  <Tag>{post.selectedLayout ?? "N/A"}</Tag>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} align="top">
            <Col xs={24} lg={14}>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                {post.copyBlocks?.headline && (
                  <div>
                    <Title level={5} style={{ marginBottom: 6 }}>
                      Headline
                    </Title>
                    <Paragraph style={{ marginBottom: 0 }}>
                      {post.copyBlocks.headline}
                    </Paragraph>
                  </div>
                )}

                {post.copyBlocks?.subheadline && (
                  <div>
                    <Title level={5} style={{ marginBottom: 6 }}>
                      Subheadline
                    </Title>
                    <Paragraph style={{ marginBottom: 0 }}>
                      {post.copyBlocks.subheadline}
                    </Paragraph>
                  </div>
                )}

                {post.copyBlocks?.valueProposition && (
                  <div>
                    <Title level={5} style={{ marginBottom: 6 }}>
                      Propuesta de valor
                    </Title>
                    <Paragraph style={{ marginBottom: 0 }}>
                      {post.copyBlocks.valueProposition}
                    </Paragraph>
                  </div>
                )}

                {post.copyBlocks?.cta && (
                  <div>
                    <Text strong>CTA</Text>
                    <div style={{ marginTop: 6 }}>
                      <Tag color="blue">{post.copyBlocks.cta}</Tag>
                    </div>
                  </div>
                )}

                {hashtags.length > 0 && (
                  <div>
                    <Text strong>Hashtags</Text>
                    <div style={{ marginTop: 8 }}>
                      <Space wrap>
                        {hashtags.map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </Space>
                    </div>
                  </div>
                )}

                <Collapse
                  items={[
                    post.copyBlocks?.caption
                      ? {
                          key: "caption",
                          label: "Ver caption completo",
                          children: (
                            <Paragraph
                              style={{
                                whiteSpace: "pre-line",
                                marginBottom: 0,
                              }}
                            >
                              {post.copyBlocks.caption}
                            </Paragraph>
                          ),
                        }
                      : {
                          key: "caption-empty",
                          label: "Caption",
                          children: (
                            <Text type="secondary">
                              No disponible para este resultado.
                            </Text>
                          ),
                        },
                  ]}
                />

                <Divider style={{ margin: "8px 0" }} />

                <Collapse
                  defaultActiveKey={["final-text"]}
                  items={[
                    {
                      key: "final-text",
                      label: "Texto final del post",
                      children: (
                        <Paragraph
                          style={{
                            whiteSpace: "pre-line",
                            marginBottom: 0,
                            lineHeight: 1.8,
                          }}
                        >
                          {post.text}
                        </Paragraph>
                      ),
                    },
                  ]}
                />
              </Space>
            </Col>

            <Col xs={24} lg={10}>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                {post.imageUrl && (
                  <div>
                    <Title level={5} style={{ marginBottom: 12 }}>
                      Imagen generada
                    </Title>
                    <Image
                      src={post.imageUrl}
                      alt="Imagen generada por IA"
                      style={{
                        width: "100%",
                        maxWidth: 420,
                        borderRadius: 18,
                      }}
                    />
                  </div>
                )}

                {post.qualityScore && (
                  <Card size="small" style={{ borderRadius: 14 }}>
                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                      <div>
                        <Text strong>Quality score total</Text>
                        <div style={{ marginTop: 12 }}>
                          <Progress percent={totalScore} status="active" />
                        </div>
                      </div>

                      <Collapse
                        items={[
                          {
                            key: "advanced-score",
                            label: "Ver métricas avanzadas",
                            children: (
                              <Space
                                direction="vertical"
                                size="middle"
                                style={{ width: "100%" }}
                              >
                                {metricEntries.length > 0 && (
                                  <div>
                                    <Text strong>Métricas</Text>
                                    <div style={{ marginTop: 12 }}>
                                      <Space wrap>
                                        {metricEntries.map(([key, value]) => (
                                          <Tag key={key}>
                                            {prettifyScoreKey(key)}: {String(value)}
                                          </Tag>
                                        ))}
                                      </Space>
                                    </div>
                                  </div>
                                )}

                                {notes && (
                                  <div>
                                    <Text strong>Notas</Text>
                                    <Paragraph
                                      style={{ marginTop: 8, marginBottom: 0 }}
                                    >
                                      {String(notes)}
                                    </Paragraph>
                                  </div>
                                )}
                              </Space>
                            ),
                          },
                        ]}
                      />
                    </Space>
                  </Card>
                )}
              </Space>
            </Col>
          </Row>
        </Space>
      </Card>
    </>
  );
}