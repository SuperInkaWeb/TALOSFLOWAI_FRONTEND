import { Card, Typography } from "antd";

const { Title, Paragraph, Text } = Typography;

export default function TermsOfServicePage() {
  return (
    <Card style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <Title>Condiciones del servicio</Title>

      <Paragraph>
        <Text strong>Fecha de entrada en vigor:</Text> abril de 2026
      </Paragraph>

      <Paragraph>
        Al acceder o utilizar TalosFlow AI, usted acepta estar sujeto a estos
        Términos de Servicio.
      </Paragraph>

      <Title level={4}>1. Uso del servicio</Title>

      <Paragraph>
        Para utilizar este servicio, debe tener al menos 18 años. Usted acepta
        utilizar TalosFlow AI únicamente con fines lícitos y de conformidad con
        estos términos.
      </Paragraph>

      <Paragraph>
        La plataforma permite generar contenido, gestionar branding, conectar
        cuentas sociales y programar o publicar contenido en redes sociales.
      </Paragraph>

      <Title level={4}>2. Responsabilidad de la cuenta</Title>

      <Paragraph>
        Usted es responsable de mantener la confidencialidad de su cuenta,
        credenciales y accesos asociados.
      </Paragraph>

      <Paragraph>
        Toda actividad realizada desde su cuenta, incluyendo publicaciones en
        redes sociales conectadas, es responsabilidad del usuario.
      </Paragraph>

      <Title level={4}>3. Uso aceptable</Title>

      <Paragraph>
        No debe utilizar TalosFlow AI para generar o publicar contenido ilegal,
        engañoso, ofensivo o que infrinja derechos de terceros.
      </Paragraph>

      <Paragraph>
        Nos reservamos el derecho de limitar, suspender o cancelar cuentas que
        incumplan estas normas o hagan uso indebido de la plataforma.
      </Paragraph>

      <Title level={4}>4. Integraciones externas</Title>

      <Paragraph>
        TalosFlow AI se integra con servicios de terceros como Meta (Facebook e
        Instagram). El uso de dichas integraciones también está sujeto a las
        políticas de esas plataformas.
      </Paragraph>

      <Title level={4}>5. Limitación de responsabilidad</Title>

      <Paragraph>
        TalosFlow AI se proporciona "tal cual". No garantizamos que el servicio
        esté libre de errores o interrupciones.
      </Paragraph>

      <Paragraph>
        No nos hacemos responsables de daños directos o indirectos derivados del
        uso o la imposibilidad de uso del servicio.
      </Paragraph>

      <Title level={4}>6. Cambios en los términos</Title>

      <Paragraph>
        Podemos actualizar estos términos ocasionalmente. El uso continuado del
        servicio después de dichos cambios implica la aceptación de los mismos.
      </Paragraph>

      <Title level={4}>7. Contacto</Title>

      <Paragraph>
        Para cualquier consulta relacionada con estos términos, puede
        contactarnos en:
      </Paragraph>

      <Paragraph>
        <Text strong>Correo electrónico:</Text> contacto@talosflow.ai
      </Paragraph>

      <Paragraph>
        Al utilizar TalosFlow AI, usted acepta estas Condiciones del servicio.
      </Paragraph>
    </Card>
  );
}