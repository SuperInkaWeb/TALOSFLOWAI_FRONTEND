import { Card, Col, Row, Statistic } from "antd";
import type { DashboardSummary } from "../../../types/dashboard.types";

type Props = {
  data: DashboardSummary;
};

export function DashboardKpiCards({ data }: Props) {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic title="Total posts" value={data.totalPosts} />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic title="Publicados" value={data.publishedPosts} />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic title="Borradores" value={data.draftPosts} />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic title="Páginas conectadas" value={data.totalPages} />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic title="Fallidos" value={data.failedPosts} />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic title="Programados" value={data.scheduledPosts} />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic title="IA usada" value={data.aiUsed} suffix={`/ ${data.aiLimit}`} />
        </Card>
      </Col>

      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic title="Tasa de éxito" value={data.successRate} suffix="%" />
        </Card>
      </Col>
    </Row>
  );
}