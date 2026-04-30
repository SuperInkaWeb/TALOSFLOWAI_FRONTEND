import { Card, Typography } from "antd";

const { Title, Paragraph, Text } = Typography;

export default function PrivacyPolicyPage() {
  return (
    <Card style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <Title>Política de privacidad</Title>

      <Paragraph>
        <Text strong>Fecha de entrada en vigor:</Text> abril de 2026
      </Paragraph>

      <Paragraph>
        TalosFlow AI se compromete a proteger su privacidad. Esta Política de
        Privacidad describe cómo recopilamos, usamos y protegemos su información
        cuando utiliza nuestros servicios.
      </Paragraph>

      <Title level={4}>1. Información que recopilamos</Title>

      <Paragraph>Podemos recopilar los siguientes tipos de datos:</Paragraph>

      <Paragraph>
        <Text strong>Datos de la cuenta:</Text> información como su nombre,
        correo electrónico, organización y credenciales de inicio de sesión
        proporcionadas durante el registro.
      </Paragraph>

      <Paragraph>
        <Text strong>Tokens de redes sociales:</Text> tokens de acceso de
        servicios de terceros, como Meta, Facebook e Instagram, para habilitar
        funciones de conexión, programación y publicación de contenido.
      </Paragraph>

      <Paragraph>
        <Text strong>Datos de uso:</Text> información sobre cómo utiliza nuestra
        aplicación para mejorar su funcionalidad, seguridad y experiencia de
        usuario.
      </Paragraph>

      <Title level={4}>2. Cómo utilizamos sus datos</Title>

      <Paragraph>Utilizamos su información para:</Paragraph>

      <Paragraph>
        Proporcionar y gestionar la plataforma TalosFlow AI.
      </Paragraph>

      <Paragraph>
        Permitir la creación, programación y publicación de contenido en redes
        sociales a través de cuentas conectadas.
      </Paragraph>

      <Paragraph>
        Gestionar cuentas, organizaciones, planes, límites de uso y acceso a la
        plataforma.
      </Paragraph>

      <Paragraph>
        Contactarle para informarle sobre actualizaciones, soporte técnico o
        asuntos relacionados con el servicio.
      </Paragraph>

      <Paragraph>Cumplir con obligaciones legales aplicables.</Paragraph>

      <Title level={4}>3. Compartir su información</Title>

      <Paragraph>
        No vendemos sus datos personales. Solo compartimos información cuando sea
        necesario en los siguientes casos:
      </Paragraph>

      <Paragraph>
        Para proporcionar los servicios solicitados explícitamente por el
        usuario, por ejemplo, interacciones con APIs de redes sociales.
      </Paragraph>

      <Paragraph>
        Con proveedores necesarios para operar la plataforma, como servicios de
        alojamiento, almacenamiento, pagos o procesamiento técnico.
      </Paragraph>

      <Paragraph>
        Cuando sea requerido por autoridades competentes conforme a la ley.
      </Paragraph>

      <Title level={4}>4. Seguridad de los datos</Title>

      <Paragraph>
        Adoptamos medidas razonables para proteger sus datos, incluyendo
        controles de acceso, autenticación, aislamiento por organización y buenas
        prácticas de seguridad. Sin embargo, ningún método de transmisión por
        Internet o almacenamiento electrónico es 100% seguro.
      </Paragraph>

      <Title level={4}>5. Servicios de terceros</Title>

      <Paragraph>
        TalosFlow AI puede integrarse con plataformas de terceros como Meta,
        Facebook, Instagram y otros servicios relacionados. Al conectar estos
        servicios, también pueden aplicarse sus respectivas políticas de
        privacidad.
      </Paragraph>

      <Title level={4}>6. Sus derechos</Title>

      <Paragraph>Usted puede solicitar:</Paragraph>

      <Paragraph>Acceder, actualizar o eliminar su información personal.</Paragraph>

      <Paragraph>
        Revocar el acceso a cuentas sociales conectadas en cualquier momento.
      </Paragraph>

      <Paragraph>
        Solicitar la eliminación de datos asociados a su cuenta u organización.
      </Paragraph>

      <Title level={4}>7. Contáctenos</Title>

      <Paragraph>
        Si tiene alguna pregunta o inquietud sobre esta Política de Privacidad,
        puede contactarnos en:
      </Paragraph>

      <Paragraph>
        <Text strong>Correo electrónico:</Text> contacto@talosflow.ai
      </Paragraph>

      <Paragraph>
        <Text strong>Sitio web:</Text> https://talosflow.ai
      </Paragraph>

      <Paragraph>
        Al utilizar TalosFlow AI, usted acepta esta Política de Privacidad.
      </Paragraph>
    </Card>
  );
}