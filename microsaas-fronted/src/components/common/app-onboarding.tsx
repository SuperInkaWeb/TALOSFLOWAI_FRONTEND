import { Button, Card, Space, Steps, Typography } from "antd";

const { Title, Paragraph, Text } = Typography;

type AppOnboardingProps = {
  open: boolean;
  onClose: () => void;
  onGoBranding: () => void;
  onGoSocialAccounts: () => void;
  onGoAi: () => void;
};

export function AppOnboarding({
  open,
  onClose,
  onGoBranding,
  onGoSocialAccounts,
  onGoAi,
}: AppOnboardingProps) {
  if (!open) return null;

  return (
    <Card
      style={{
        borderRadius: 20,
        marginBottom: 24,
      }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Title level={3} style={{ marginBottom: 8 }}>
            Bienvenido a TalosFlow AI
          </Title>
          <Paragraph style={{ marginBottom: 0 }}>
            Te recomiendo completar estos pasos para empezar a generar y publicar contenido.
          </Paragraph>
        </div>

        <Steps
          direction="vertical"
          items={[
            {
              title: "Configura tu marca",
              description: "Sube logo, colores y datos principales de tu negocio.",
            },
            {
              title: "Conecta tus redes sociales",
              description: "Vincula tus páginas para poder publicar desde la plataforma.",
            },
            {
              title: "Genera tu primer post con IA",
              description: "Crea texto e imagen y publícalo desde el panel.",
            },
          ]}
        />

        <Space wrap>
          <Button type="primary" onClick={onGoBranding}>
            Ir a Branding
          </Button>
          <Button onClick={onGoSocialAccounts}>
            Ir a Redes Sociales
          </Button>
          <Button onClick={onGoAi}>
            Ir a IA
          </Button>
          <Button type="text" onClick={onClose}>
            Ocultar guía
          </Button>
        </Space>

        <Text type="secondary">
          Esta guía se guarda localmente en tu navegador.
        </Text>
      </Space>
    </Card>
  );
}