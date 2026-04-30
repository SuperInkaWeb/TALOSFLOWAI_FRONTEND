import { Card, Typography } from "antd";

const { Title, Paragraph, Text } = Typography;

export default function DataDeletionPage() {
  return (
    <Card style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <Title>Eliminación de datos de usuario</Title>

      <Paragraph>
        En TalosFlow AI respetamos el derecho de los usuarios a eliminar sus
        datos personales y la información asociada a sus cuentas.
      </Paragraph>

      <Title level={4}>¿Qué datos se pueden eliminar?</Title>

      <Paragraph>
        Puede solicitar la eliminación de:
      </Paragraph>

      <Paragraph>
        • Datos de cuenta (nombre, correo electrónico)
      </Paragraph>

      <Paragraph>
        • Información de su organización
      </Paragraph>

      <Paragraph>
        • Cuentas sociales conectadas (Meta, Facebook, Instagram)
      </Paragraph>

      <Paragraph>
        • Contenido generado dentro de la plataforma
      </Paragraph>

      <Title level={4}>Cómo solicitar la eliminación</Title>

      <Paragraph>
        Para solicitar la eliminación de sus datos, envíe un correo electrónico
        con la siguiente información:
      </Paragraph>

      <Paragraph>
        • Correo registrado en la plataforma
      </Paragraph>

      <Paragraph>
        • Nombre de la organización (si aplica)
      </Paragraph>

      <Paragraph>
        • Motivo de la solicitud (opcional)
      </Paragraph>

      <Paragraph>
        <Text strong>Correo de contacto:</Text> contacto@talosflow.ai
      </Paragraph>

      <Title level={4}>Proceso de eliminación</Title>

      <Paragraph>
        Una vez recibida la solicitud:
      </Paragraph>

      <Paragraph>
        • Validaremos la identidad del solicitante
      </Paragraph>

      <Paragraph>
        • Eliminaremos los datos asociados de forma segura
      </Paragraph>

      <Paragraph>
        • Revocaremos accesos a servicios externos conectados
      </Paragraph>

      <Paragraph>
        El proceso puede tardar hasta 7 días hábiles.
      </Paragraph>

      <Title level={4}>Eliminación automática</Title>

      <Paragraph>
        También puede eliminar sus datos directamente eliminando su cuenta desde
        el panel de configuración (si esta opción está disponible en su plan).
      </Paragraph>

      <Title level={4}>Importante</Title>

      <Paragraph>
        Algunos datos pueden conservarse temporalmente cuando sea necesario para
        cumplir obligaciones legales o resolver disputas.
      </Paragraph>

      <Paragraph>
        Para cualquier duda adicional, puede contactarnos en:
      </Paragraph>

      <Paragraph>
        <Text strong>Correo electrónico:</Text> contacto@talosflow.ai
      </Paragraph>
    </Card>
  );
}