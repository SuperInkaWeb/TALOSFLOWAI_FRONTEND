import type { CSSProperties } from "react";
import { Grid, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useState } from "react";
import {
  Layout,
  Typography,
  Button,
  Space,
  Row,
  Col,
  Card,
  Tag,
  Divider,
  Collapse,
} from "antd";
import {
  RocketOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  CheckCircleOutlined,
  PictureOutlined,
  ScheduleOutlined,
  TeamOutlined,
  ShopOutlined,
  ClusterOutlined,
  DeploymentUnitOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  CustomerServiceOutlined,
  AppstoreOutlined,
  BgColorsOutlined,
  SendOutlined,
  LinkOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "../app/store/auth.store";

const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;
const { Title, Paragraph, Text } = Typography;

const HEADER_HEIGHT = 78;

const sectionBaseStyle: CSSProperties = {
  padding: "110px 24px",
  maxWidth: 1280,
  margin: "0 auto",
  width: "100%",
  scrollMarginTop: HEADER_HEIGHT + 24,
  position: "relative",
  zIndex: 2,
};

const glassCardStyle: CSSProperties = {
  height: "100%",
  borderRadius: 24,
  background: "rgba(10, 16, 34, 0.68)",
  border: "1px solid rgba(120, 140, 255, 0.18)",
  color: "white",
  boxShadow:
    "0 10px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.03)",
  backdropFilter: "blur(14px)",
};

const miniMetricStyle: CSSProperties = {
  borderRadius: 18,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: 18,
};

function DecorativeBackground() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 15% 20%, rgba(56,189,248,0.16), transparent 22%), radial-gradient(circle at 80% 15%, rgba(124,58,237,0.18), transparent 24%), radial-gradient(circle at 50% 60%, rgba(22,119,255,0.10), transparent 28%), linear-gradient(180deg, #020617 0%, #030b1c 45%, #020617 100%)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(circle at center, black 30%, transparent 85%)",
          zIndex: 0,
          opacity: 0.25,
        }}
      />
    </>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isTablet = screens.md && !screens.lg;
  const isLaptop = screens.lg && !screens.xl;

  const responsiveSectionStyle: CSSProperties = {
    ...sectionBaseStyle,
    padding: isMobile ? "64px 16px" : isTablet ? "82px 22px" : "110px 24px",
    scrollMarginTop: isMobile ? 72 : HEADER_HEIGHT + 24,
  };

  const heroSectionStyle: CSSProperties = {
    ...responsiveSectionStyle,
    paddingTop: isMobile ? 56 : isTablet ? 84 : 120,
    paddingBottom: isMobile ? 64 : isTablet ? 76 : 90,
  };

  const heroTitleStyle: CSSProperties = {
    color: "white",
    margin: 0,
    fontSize: isMobile ? 34 : isTablet ? 44 : isLaptop ? 52 : 58,
    lineHeight: isMobile ? 1.12 : 1.02,
    letterSpacing: isMobile ? "-0.7px" : "-1.4px",
    maxWidth: 720,
  };

  const sectionTitleStyle: CSSProperties = {
    color: "white",
    marginBottom: 12,
    fontSize: isMobile ? 28 : isTablet ? 34 : undefined,
    lineHeight: 1.15,
  };

  const sectionParagraphStyle: CSSProperties = {
    color: "#aebbd1",
    maxWidth: 780,
    margin: "0 auto",
    fontSize: isMobile ? 15 : 18,
    lineHeight: 1.75,
  };

  const ctaBoxStyle: CSSProperties = {
    maxWidth: 1150,
    margin: "0 auto",
    borderRadius: isMobile ? 22 : 30,
    padding: isMobile ? 24 : isTablet ? 38 : 52,
    background:
      "linear-gradient(135deg, rgba(22,119,255,0.22), rgba(124,58,237,0.22))",
    border: "1px solid rgba(255,255,255,0.10)",
    textAlign: "center",
    boxShadow: "0 24px 70px rgba(0,0,0,0.28)",
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "#020617",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <DecorativeBackground />
      <Header
        style={{
          height: HEADER_HEIGHT,
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(2, 6, 23, 0.72)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: isMobile ? "0 16px" : "0 24px",
          backdropFilter: "blur(16px)",
        }}
      >
        <Space size="middle" align="center">
          <img
            src="/taloslogo.png"
            alt="TalosFlow AI"
            style={{
              width: isMobile ? 38 : 44,
              height: isMobile ? 38 : 44,
              objectFit: "contain",
              borderRadius: 12,
              flexShrink: 0,
            }}
          />

          <div>
            <Title
              level={isMobile ? 5 : 4}
              style={{
                color: "white",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              TalosFlow AI
            </Title>

            {!isMobile && (
              <Text style={{ color: "#7dd3fc", fontSize: 12 }}>
                Intelligent Content Engine
              </Text>
            )}
          </div>
        </Space>

        {isMobile ? (
          <>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
              style={{ color: "white" }}
            />

            <Drawer
              placement="right"
              open={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
              styles={{
                header: {
                  background: "#020617",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                },
                body: {
                  background: "#020617",
                },
              }}
            >
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                {[
                  ["#beneficios", "Beneficios"],
                  ["#como-funciona", "Flujo"],
                  ["#quienes-somos", "Nosotros"],
                  ["#servicios", "Servicios"],
                  ["#planes", "Planes"],
                  ["#faq", "FAQ"],
                ].map(([href, label]) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      color: "white",
                      fontSize: 16,
                      textDecoration: "none",
                    }}
                  >
                    {label}
                  </a>
                ))}

                <Button block onClick={() => navigate("/auth/login")}>
                  Iniciar sesión
                </Button>

                <Button
                  type="primary"
                  block
                  onClick={() => navigate("/auth/signup")}
                >
                  Activar TalosFlow
                </Button>
              </Space>
            </Drawer>
          </>
        ) : (
          <Space size="large">
            <a href="#beneficios">Beneficios</a>
            <a href="#como-funciona">Flujo</a>
            <a href="#quienes-somos">Nosotros</a>
            <a href="#servicios">Servicios</a>
            <a href="#planes">Planes</a>
            <a href="#faq">FAQ</a>

            <Button
              onClick={() => navigate("/auth/login")}
              style={{
                borderRadius: 999,
              }}
            >
              Iniciar sesión
            </Button>
          </Space>
        )}
      </Header>

      <Content style={{ position: "relative", zIndex: 1 }}>
        <section style={heroSectionStyle}>
          <Row gutter={[42, 42]} align="middle">
            <Col xs={24} lg={12}>
              <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
              >
                <Space wrap>
                  <Tag
                    style={{
                      borderRadius: 999,
                      padding: "6px 14px",
                      fontSize: 13,
                      margin: 0,
                      background: "rgba(56,189,248,0.14)",
                      borderColor: "rgba(56,189,248,0.24)",
                      color: "#7dd3fc",
                    }}
                  >
                    IA generativa
                  </Tag>
                  <Tag
                    style={{
                      borderRadius: 999,
                      padding: "6px 14px",
                      fontSize: 13,
                      margin: 0,
                      background: "rgba(124,58,237,0.14)",
                      borderColor: "rgba(124,58,237,0.24)",
                      color: "#c4b5fd",
                    }}
                  >
                    Publicación automática
                  </Tag>
                </Space>

                <div>
                  <Title style={heroTitleStyle}>
                    Tu motor de contenido{" "}
                    <span
                      style={{
                        background:
                          "linear-gradient(90deg, #ffffff 0%, #7dd3fc 40%, #a78bfa 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      futurista
                    </span>{" "}
                    para automatizar marca, creatividad y publicación
                  </Title>
                </div>

                <Paragraph
                  style={{
                    color: "#b8c4dc",
                    fontSize: isMobile ? 16 : 19,
                    lineHeight: 1.75,
                    marginBottom: 0,
                    maxWidth: 650,
                  }}
                >
                  TalosFlow AI convierte ideas en copy, visuales y publicaciones
                  listas para ejecutarse. Automatiza tu flujo y mantén tu
                  identidad visual con una operación más rápida, precisa y
                  profesional.
                </Paragraph>

                <Space
                  size="middle"
                  wrap
                  style={{ width: isMobile ? "100%" : undefined }}
                >
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate("/auth/signup")}
                    style={{
                      height: 48,
                      width: isMobile ? "100%" : undefined,
                      paddingInline: 24,
                      borderRadius: 999,
                      background: "linear-gradient(90deg, #1677ff, #7c3aed)",
                      border: "none",
                      boxShadow: "0 10px 28px rgba(124,58,237,0.28)",
                    }}
                  >
                    Activar plataforma
                  </Button>

                  <Button
                    size="large"
                    onClick={() => navigate("/auth/login")}
                    style={{
                      height: 48,
                      width: isMobile ? "100%" : undefined,
                      paddingInline: 24,
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.12)",
                      color: "white",
                    }}
                  >
                    Entrar al panel
                  </Button>
                </Space>

                <Row gutter={[12, 12]}>
                  <Col xs={24} sm={12}>
                    <div style={miniMetricStyle}>
                      <Text style={{ color: "#7dd3fc", fontSize: 12 }}>
                        OUTPUT
                      </Text>
                      <Title
                        level={3}
                        style={{ color: "white", margin: "6px 0 0" }}
                      >
                        Copy + visual
                      </Title>
                    </div>
                  </Col>
                  <Col xs={24} sm={12}>
                    <div style={miniMetricStyle}>
                      <Text style={{ color: "#a78bfa", fontSize: 12 }}>
                        CONTROL
                      </Text>
                      <Title
                        level={3}
                        style={{ color: "white", margin: "6px 0 0" }}
                      >
                        Todo centralizado
                      </Title>
                    </div>
                  </Col>
                </Row>
              </Space>
            </Col>

            <Col xs={24} lg={12}>
              <div
                style={{
                  position: "relative",
                  borderRadius: isMobile ? 22 : 30,
                  padding: isMobile ? 12 : 22,
                  background: "rgba(8,12,28,0.68)",
                  border: "1px solid rgba(125,211,252,0.14)",
                  boxShadow:
                    "0 30px 90px rgba(0,0,0,0.42), 0 0 80px rgba(56,189,248,0.08)",
                  backdropFilter: "blur(18px)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -80,
                    right: -60,
                    width: 220,
                    height: 220,
                    background:
                      "radial-gradient(circle, rgba(124,58,237,0.28), transparent 70%)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: -70,
                    left: -40,
                    width: 220,
                    height: 220,
                    background:
                      "radial-gradient(circle, rgba(56,189,248,0.22), transparent 70%)",
                    pointerEvents: "none",
                  }}
                />

                <div
                  style={{
                    borderRadius: 22,
                    overflow: "hidden",
                    background: "linear-gradient(180deg, #091120, #0b1730)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 18px",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <Space>
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 999,
                          background: "#ff5f57",
                        }}
                      />
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 999,
                          background: "#febc2e",
                        }}
                      />
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 999,
                          background: "#28c840",
                        }}
                      />
                    </Space>

                    <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                      TalosFlow Neural Workspace
                    </Text>
                  </div>

                  <div style={{ padding: isMobile ? 12 : 20 }}>
                    <Row gutter={[16, 16]}>
                      <Col span={24}>
                        <Card
                          bordered={false}
                          style={{
                            borderRadius: 18,
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <Text style={{ color: "#8ea3c0" }}>
                            Input estratégico
                          </Text>
                          <Title
                            level={5}
                            style={{
                              color: "white",
                              marginTop: 8,
                              marginBottom: 0,
                            }}
                          >
                            Lanzamiento de campaña para captar leads premium en
                            redes
                          </Title>
                        </Card>
                      </Col>

                      <Col xs={24} sm={12}>
                        <Card
                          bordered={false}
                          style={{
                            borderRadius: 18,
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            height: "100%",
                          }}
                        >
                          <Text style={{ color: "#8ea3c0" }}>
                            Módulo Copy AI
                          </Text>
                          <Paragraph
                            style={{
                              color: "white",
                              marginTop: 8,
                              marginBottom: 0,
                              lineHeight: 1.6,
                            }}
                          >
                            Hook, propuesta de valor, CTA y hashtags listos para
                            conversión.
                          </Paragraph>
                        </Card>
                      </Col>

                      <Col xs={24} sm={12}>
                        <Card
                          bordered={false}
                          style={{
                            borderRadius: 18,
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            height: "100%",
                          }}
                        >
                          <Text style={{ color: "#8ea3c0" }}>
                            Módulo Visual AI
                          </Text>
                          <Paragraph
                            style={{
                              color: "white",
                              marginTop: 8,
                              marginBottom: 0,
                              lineHeight: 1.6,
                            }}
                          >
                            Creativo alineado al branding, tono de campaña y
                            calidad premium.
                          </Paragraph>
                        </Card>
                      </Col>

                      <Col span={24}>
                        <Card
                          bordered={false}
                          style={{
                            borderRadius: 18,
                            background:
                              "linear-gradient(135deg, rgba(22,119,255,0.18), rgba(124,58,237,0.22))",
                            border: "1px solid rgba(255,255,255,0.10)",
                          }}
                        >
                          <Row gutter={[12, 12]}>
                            <Col xs={24} sm={12}>
                              <Space direction="vertical" size={2}>
                                <Text style={{ color: "#d8e3f8" }}>Estado</Text>
                                <Title
                                  level={4}
                                  style={{ color: "white", margin: 0 }}
                                >
                                  Ready to Publish
                                </Title>
                              </Space>
                            </Col>
                            <Col xs={24} sm={12}>
                              <Space direction="vertical" size={2}>
                                <Text style={{ color: "#d8e3f8" }}>
                                  Pipeline
                                </Text>
                                <Text style={{ color: "white" }}>
                                  Idea → Copy → Visual → Programación →
                                  Publicación
                                </Text>
                              </Space>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </section>

        <section id="beneficios" style={responsiveSectionStyle}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Tag
              style={{
                marginBottom: 16,
                borderRadius: 999,
                padding: "6px 14px",
                background: "rgba(56,189,248,0.12)",
                color: "#7dd3fc",
                borderColor: "rgba(56,189,248,0.22)",
              }}
            >
              CORE SYSTEM
            </Tag>
            <Title style={sectionTitleStyle}>
              Arquitectura pensada para velocidad, consistencia y escala
            </Title>
            <Paragraph style={sectionParagraphStyle}>
              TalosFlow AI no solo genera contenido. Orquesta un sistema
              completo de creación, branding y publicación para operar con
              precisión.
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12} lg={6}>
              <Card bordered={false} style={glassCardStyle}>
                <RocketOutlined style={{ fontSize: 32, color: "#7dd3fc" }} />
                <Title level={4} style={{ color: "white", marginTop: 16 }}>
                  Velocidad operativa
                </Title>
                <Text style={{ color: "#b6c2d9" }}>
                  Reduce drásticamente el tiempo entre estrategia, creación y
                  salida al mercado.
                </Text>
              </Card>
            </Col>

            <Col xs={24} md={12} lg={6}>
              <Card bordered={false} style={glassCardStyle}>
                <PictureOutlined style={{ fontSize: 32, color: "#93c5fd" }} />
                <Title level={4} style={{ color: "white", marginTop: 16 }}>
                  Branding coherente
                </Title>
                <Text style={{ color: "#b6c2d9" }}>
                  Mantén una identidad visual fuerte en cada publicación,
                  campaña y pieza.
                </Text>
              </Card>
            </Col>

            <Col xs={24} md={12} lg={6}>
              <Card bordered={false} style={glassCardStyle}>
                <ThunderboltOutlined
                  style={{ fontSize: 32, color: "#c4b5fd" }}
                />
                <Title level={4} style={{ color: "white", marginTop: 16 }}>
                  IA orientada a conversión
                </Title>
                <Text style={{ color: "#b6c2d9" }}>
                  Genera contenido diseñado para captar atención, posicionar y
                  vender mejor.
                </Text>
              </Card>
            </Col>

            <Col xs={24} md={12} lg={6}>
              <Card bordered={false} style={glassCardStyle}>
                <TeamOutlined style={{ fontSize: 32, color: "#7dd3fc" }} />
                <Title level={4} style={{ color: "white", marginTop: 16 }}>
                  Escala multi-tenant
                </Title>
                <Text style={{ color: "#b6c2d9" }}>
                  Funciona para marcas, equipos y agencias que operan con
                  múltiples clientes.
                </Text>
              </Card>
            </Col>
          </Row>
        </section>

        <section id="como-funciona" style={responsiveSectionStyle}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Tag
              style={{
                marginBottom: 16,
                borderRadius: 999,
                padding: "6px 14px",
                background: "rgba(124,58,237,0.12)",
                color: "#c4b5fd",
                borderColor: "rgba(124,58,237,0.22)",
              }}
            >
              TALOSFLOW PIPELINE
            </Tag>
            <Title style={sectionTitleStyle}>
              Un flujo inteligente desde la idea hasta la publicación
            </Title>
            <Paragraph style={sectionParagraphStyle}>
              Tu operación de contenido se convierte en un sistema continuo,
              predecible y profesional.
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card bordered={false} style={glassCardStyle}>
                <CheckCircleOutlined
                  style={{ fontSize: 30, color: "#7dd3fc" }}
                />
                <Title level={4} style={{ color: "white", marginTop: 16 }}>
                  1. Configura tu núcleo de marca
                </Title>
                <Text style={{ color: "#b6c2d9" }}>
                  Logo, colores, CTA, contacto y presencia social para que la IA
                  trabaje con contexto real.
                </Text>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card bordered={false} style={glassCardStyle}>
                <ApiOutlined style={{ fontSize: 30, color: "#c4b5fd" }} />
                <Title level={4} style={{ color: "white", marginTop: 16 }}>
                  2. Activa el motor generativo
                </Title>
                <Text style={{ color: "#b6c2d9" }}>
                  Crea copy y visuales alineados a campaña, tono, objetivo y
                  estructura de conversión.
                </Text>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card bordered={false} style={glassCardStyle}>
                <ScheduleOutlined style={{ fontSize: 30, color: "#93c5fd" }} />
                <Title level={4} style={{ color: "white", marginTop: 16 }}>
                  3. Programa y ejecuta
                </Title>
                <Text style={{ color: "#b6c2d9" }}>
                  Controla publicaciones, automatiza la salida y mantén todo el
                  flujo bajo un mismo panel.
                </Text>
              </Card>
            </Col>
          </Row>
        </section>

        <section id="quienes-somos" style={responsiveSectionStyle}>
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} lg={10}>
              <Tag
                style={{
                  marginBottom: 16,
                  borderRadius: 999,
                  padding: "6px 14px",
                  background: "rgba(22,119,255,0.12)",
                  color: "#93c5fd",
                  borderColor: "rgba(22,119,255,0.22)",
                }}
              >
                QUIÉNES SOMOS
              </Tag>

              <Title style={{ color: "white", marginBottom: 16 }}>
                Somos una plataforma construida para transformar contenido en
                una operación inteligente
              </Title>

              <Paragraph
                style={{
                  color: "#b8c4dc",
                  fontSize: 18,
                  lineHeight: 1.8,
                  marginBottom: 16,
                }}
              >
                TalosFlow AI nace para convertir procesos manuales y
                fragmentados en un sistema centralizado, rápido y escalable.
                Unimos automatización, branding e inteligencia artificial para
                que marcas, equipos y agencias publiquen mejor con menos
                fricción.
              </Paragraph>

              <Paragraph
                style={{
                  color: "#aebbd1",
                  fontSize: 16,
                  lineHeight: 1.8,
                  marginBottom: 0,
                }}
              >
                Nuestra visión es que crear, coordinar y publicar contenido deje
                de ser una tarea pesada y se convierta en un flujo operativo
                claro, potente y consistente.
              </Paragraph>
            </Col>

            <Col xs={24} lg={14}>
              <Row gutter={[20, 20]}>
                <Col xs={24} sm={12}>
                  <Card bordered={false} style={glassCardStyle}>
                    <RiseOutlined style={{ fontSize: 30, color: "#7dd3fc" }} />
                    <Title level={4} style={{ color: "white", marginTop: 16 }}>
                      Misión
                    </Title>
                    <Text style={{ color: "#b6c2d9" }}>
                      Ayudar a las marcas a producir y publicar contenido con
                      más velocidad, coherencia visual y capacidad operativa.
                    </Text>
                  </Card>
                </Col>

                <Col xs={24} sm={12}>
                  <Card bordered={false} style={glassCardStyle}>
                    <SafetyCertificateOutlined
                      style={{ fontSize: 30, color: "#c4b5fd" }}
                    />
                    <Title level={4} style={{ color: "white", marginTop: 16 }}>
                      Visión
                    </Title>
                    <Text style={{ color: "#b6c2d9" }}>
                      Convertirnos en el sistema de referencia para automatizar
                      contenido, branding y publicación a escala.
                    </Text>
                  </Card>
                </Col>

                <Col xs={24}>
                  <Card bordered={false} style={glassCardStyle}>
                    <GlobalOutlined
                      style={{ fontSize: 30, color: "#93c5fd" }}
                    />
                    <Title level={4} style={{ color: "white", marginTop: 16 }}>
                      Enfoque
                    </Title>
                    <Text style={{ color: "#b6c2d9" }}>
                      Producto, automatización y ejecución real. TalosFlow AI
                      está diseñado para resolver el trabajo operativo del
                      contenido, no solo para verse bien.
                    </Text>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </section>

        <section id="servicios" style={responsiveSectionStyle}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Tag
              style={{
                marginBottom: 16,
                borderRadius: 999,
                padding: "6px 14px",
                background: "rgba(124,58,237,0.12)",
                color: "#c4b5fd",
                borderColor: "rgba(124,58,237,0.22)",
              }}
            >
              SERVICIOS / CAPACIDADES
            </Tag>
            <Title style={sectionTitleStyle}>
              Lo que puedes activar dentro de TalosFlow AI
            </Title>
            <Paragraph style={sectionParagraphStyle}>
              Más que funciones aisladas, TalosFlow AI ofrece capacidades
              integradas para operar contenido con estructura profesional.
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12} lg={8}>
              <Card bordered={false} style={glassCardStyle}>
                <AppstoreOutlined style={{ fontSize: 30, color: "#7dd3fc" }} />
                <Title level={4} style={{ color: "white", marginTop: 16 }}>
                  Copy con IA
                </Title>
                <Text style={{ color: "#b6c2d9" }}>
                  Generación de textos, hooks, CTAs y estructura de mensajes
                  orientados a conversión.
                </Text>
              </Card>
            </Col>

            <Col xs={24} md={12} lg={8}>
              <Card bordered={false} style={glassCardStyle}>
                <BgColorsOutlined style={{ fontSize: 30, color: "#c4b5fd" }} />
                <Title level={4} style={{ color: "white", marginTop: 16 }}>
                  Branding aplicado
                </Title>
                <Text style={{ color: "#b6c2d9" }}>
                  Uso de logo, colores, identidad visual y coherencia de marca
                  en cada pieza generada.
                </Text>
              </Card>
            </Col>

            <Col xs={24} md={12} lg={8}>
              <Card bordered={false} style={glassCardStyle}>
                <SendOutlined style={{ fontSize: 30, color: "#93c5fd" }} />
                <Title level={4} style={{ color: "white", marginTop: 16 }}>
                  Programación y publicación
                </Title>
                <Text style={{ color: "#b6c2d9" }}>
                  Centraliza salidas, programa publicaciones y ejecuta desde una
                  sola plataforma.
                </Text>
              </Card>
            </Col>

            <Col xs={24} md={12} lg={8}>
              <Card bordered={false} style={glassCardStyle}>
                <LinkOutlined style={{ fontSize: 30, color: "#7dd3fc" }} />
                <Title level={4} style={{ color: "white", marginTop: 16 }}>
                  Gestión multi-cuenta
                </Title>
                <Text style={{ color: "#b6c2d9" }}>
                  Opera múltiples cuentas y estructuras de contenido con mayor
                  orden y control.
                </Text>
              </Card>
            </Col>

            <Col xs={24} md={12} lg={8}>
              <Card bordered={false} style={glassCardStyle}>
                <TeamOutlined style={{ fontSize: 30, color: "#c4b5fd" }} />
                <Title level={4} style={{ color: "white", marginTop: 16 }}>
                  Escalabilidad por planes
                </Title>
                <Text style={{ color: "#b6c2d9" }}>
                  Crece con capacidades, límites y estructura adaptadas a tu
                  nivel operativo.
                </Text>
              </Card>
            </Col>

            <Col xs={24} md={12} lg={8}>
              <Card bordered={false} style={glassCardStyle}>
                <CustomerServiceOutlined
                  style={{ fontSize: 30, color: "#93c5fd" }}
                />
                <Title level={4} style={{ color: "white", marginTop: 16 }}>
                  Control y administración
                </Title>
                <Text style={{ color: "#b6c2d9" }}>
                  Panel, seguridad, monitoreo y control general para operar con
                  una base más sólida.
                </Text>
              </Card>
            </Col>
          </Row>
        </section>

        <section style={responsiveSectionStyle}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Tag
              style={{
                marginBottom: 16,
                borderRadius: 999,
                padding: "6px 14px",
                background: "rgba(22,119,255,0.12)",
                color: "#93c5fd",
                borderColor: "rgba(22,119,255,0.22)",
              }}
            >
              BUILT FOR
            </Tag>
            <Title style={sectionTitleStyle}>
              Diseñado para operaciones que necesitan velocidad y control
            </Title>
            <Paragraph style={sectionParagraphStyle}>
              TalosFlow AI encaja donde el volumen, la calidad y la consistencia
              ya no pueden depender de procesos manuales.
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card bordered={false} style={glassCardStyle}>
                <ShopOutlined style={{ fontSize: 30, color: "#7dd3fc" }} />
                <Title level={4} style={{ color: "white", marginTop: 16 }}>
                  Marcas en crecimiento
                </Title>
                <Text style={{ color: "#b6c2d9" }}>
                  Para negocios que necesitan publicar mejor, más rápido y con
                  una identidad sólida.
                </Text>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card bordered={false} style={glassCardStyle}>
                <ClusterOutlined style={{ fontSize: 30, color: "#c4b5fd" }} />
                <Title level={4} style={{ color: "white", marginTop: 16 }}>
                  Equipos de marketing
                </Title>
                <Text style={{ color: "#b6c2d9" }}>
                  Para operaciones internas que necesitan centralizar el flujo
                  creativo y operativo.
                </Text>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card bordered={false} style={glassCardStyle}>
                <DeploymentUnitOutlined
                  style={{ fontSize: 30, color: "#93c5fd" }}
                />
                <Title level={4} style={{ color: "white", marginTop: 16 }}>
                  Agencias multi-cliente
                </Title>
                <Text style={{ color: "#b6c2d9" }}>
                  Para estructuras que trabajan con múltiples marcas, campañas y
                  necesidades de escala.
                </Text>
              </Card>
            </Col>
          </Row>
        </section>

        <section id="planes" style={responsiveSectionStyle}>
          <div style={{ marginBottom: 34 }}>
            <Tag
              style={{
                marginBottom: 16,
                borderRadius: 999,
                padding: "6px 14px",
                background: "rgba(22,119,255,0.12)",
                color: "#93c5fd",
                borderColor: "rgba(22,119,255,0.22)",
              }}
            >
              PLANES DISPONIBLES
            </Tag>

            <Title style={{ color: "white", marginBottom: 8 }}>
              Elige el plan ideal para tu operación
            </Title>

            <Paragraph
              style={{ color: "#aebbd1", fontSize: 16, marginBottom: 0 }}
            >
              Los planes se cargan desde backend y el usuario puede elegir
              cualquiera directamente según sus necesidades.
            </Paragraph>
          </div>

          <Row gutter={[18, 18]}>
            {[
              {
                name: "FREE",
                price: "$0,00",
                period: "/ monthly",
                badge: "",
                badgeColor: "",
                features: [
                  "10 posts por período",
                  "5 generaciones IA",
                  "10 imágenes",
                  "1 cuenta social",
                  "1 admin",
                  "0 editores",
                ],
                button: "Seleccionar",
                highlight: false,
              },
              {
                name: "BASIC",
                price: "$19,99",
                period: "/ monthly",
                badge: "7 días de prueba",
                badgeColor: "#00e5ff",
                features: [
                  "50 posts por período",
                  "30 generaciones IA",
                  "50 imágenes",
                  "2 cuentas sociales",
                  "1 admin",
                  "2 editores",
                  "Programación de publicaciones",
                  "7 días de prueba",
                ],
                button: "Elegir plan",
                highlight: false,
              },
              {
                name: "PLUS",
                price: "$49,99",
                period: "/ monthly",
                badge: "Popular",
                badgeColor: "#1677ff",
                features: [
                  "300 posts por período",
                  "200 generaciones IA",
                  "200 imágenes",
                  "10 cuentas sociales",
                  "2 admins",
                  "5 editores",
                  "Programación de publicaciones",
                  "Multicuenta / multipágina",
                  "IA premium",
                  "Imágenes premium",
                  "Flujo de aprobación",
                  "7 días de prueba",
                ],
                button: "Elegir plan",
                highlight: true,
              },
              {
                name: "PRO",
                price: "$99,99",
                period: "/ monthly",
                badge: "Actual",
                badgeColor: "#52c41a",
                features: [
                  "1000 posts por período",
                  "1000 generaciones IA",
                  "1000 imágenes",
                  "25 cuentas sociales",
                  "5 admins",
                  "15 editores",
                  "Programación de publicaciones",
                  "Multicuenta / multipágina",
                  "IA premium",
                  "Imágenes premium",
                  "A/B testing",
                  "Flujo de aprobación",
                  "7 días de prueba",
                ],
                button: "Plan actual",
                highlight: false,
                disabled: true,
              },
            ].map((plan) => (
              <Col xs={24} md={12} xl={6} key={plan.name}>
                <Card
                  bordered={false}
                  style={{
                    height: "100%",
                    borderRadius: 14,
                    background: "rgba(18, 18, 18, 0.92)",
                    border: plan.highlight
                      ? "1px solid rgba(84, 112, 255, 0.65)"
                      : "1px solid rgba(255,255,255,0.10)",
                    color: "white",
                    boxShadow: plan.highlight
                      ? "0 0 0 1px rgba(84,112,255,0.25), 0 20px 50px rgba(0,0,0,0.35)"
                      : "0 10px 35px rgba(0,0,0,0.24)",
                  }}
                >
                  <Space
                    direction="vertical"
                    size={14}
                    style={{ width: "100%" }}
                  >
                    <Space>
                      <Title level={4} style={{ color: "white", margin: 0 }}>
                        {plan.name}
                      </Title>

                      {plan.badge && (
                        <Tag
                          style={{
                            margin: 0,
                            borderRadius: 6,
                            color: plan.badgeColor,
                            background: `${plan.badgeColor}1A`,
                            borderColor: `${plan.badgeColor}33`,
                          }}
                        >
                          {plan.badge}
                        </Tag>
                      )}
                    </Space>

                    <div>
                      <Title level={2} style={{ color: "white", margin: 0 }}>
                        {plan.price}
                      </Title>
                      <Text style={{ color: "#aebbd1" }}>{plan.period}</Text>
                    </div>

                    {plan.name !== "FREE" && plan.badge !== "Popular" && (
                      <Tag
                        style={{
                          width: "fit-content",
                          borderRadius: 6,
                          color: "#00e5ff",
                          background: "rgba(0,229,255,0.12)",
                          borderColor: "rgba(0,229,255,0.18)",
                        }}
                      >
                        7 días de prueba
                      </Tag>
                    )}

                    <Divider
                      style={{ borderColor: "rgba(255,255,255,0.10)" }}
                    />

                    <Space
                      direction="vertical"
                      size={12}
                      style={{ width: "100%" }}
                    >
                      {plan.features.map((feature) => (
                        <Text key={feature} style={{ color: "white" }}>
                          ✓ {feature}
                        </Text>
                      ))}
                    </Space>

                    <Divider
                      style={{ borderColor: "rgba(255,255,255,0.10)" }}
                    />

                    <Button
                      block
                      disabled={plan.disabled}
                      onClick={() => navigate("/auth/signup")}
                      style={{
                        height: 40,
                        borderRadius: 10,
                        background: plan.disabled
                          ? "rgba(255,255,255,0.08)"
                          : "#5b5ce2",
                        borderColor: plan.disabled
                          ? "rgba(255,255,255,0.12)"
                          : "#5b5ce2",
                        color: plan.disabled ? "#8c8c8c" : "white",
                      }}
                    >
                      {plan.button}
                    </Button>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        <section id="faq" style={responsiveSectionStyle}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <Tag
              style={{
                marginBottom: 16,
                borderRadius: 999,
                padding: "6px 14px",
                background: "rgba(56,189,248,0.12)",
                color: "#7dd3fc",
                borderColor: "rgba(56,189,248,0.22)",
              }}
            >
              FAQ
            </Tag>
            <Title style={sectionTitleStyle}>Preguntas frecuentes</Title>
            <Paragraph style={sectionParagraphStyle}>
              Respuestas rápidas para entender cómo funciona TalosFlow AI y cómo
              puede encajar en tu operación.
            </Paragraph>
          </div>

          <div
            style={{
              maxWidth: 980,
              margin: "0 auto",
              borderRadius: 24,
              background: "rgba(10, 16, 34, 0.68)",
              border: "1px solid rgba(120, 140, 255, 0.18)",
              boxShadow:
                "0 10px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.03)",
              backdropFilter: "blur(14px)",
              padding: 12,
            }}
          >
            <Collapse
              ghost
              size="large"
              items={[
                {
                  key: "1",
                  label: (
                    <span style={{ color: "white", fontWeight: 600 }}>
                      ¿TalosFlow AI publica automáticamente en redes sociales?
                    </span>
                  ),
                  children: (
                    <Text style={{ color: "#b6c2d9", lineHeight: 1.8 }}>
                      Sí. TalosFlow AI está diseñado para ayudarte a generar
                      contenido, centralizarlo y programarlo o publicarlo desde
                      un mismo flujo operativo.
                    </Text>
                  ),
                },
                {
                  key: "2",
                  label: (
                    <span style={{ color: "white", fontWeight: 600 }}>
                      ¿Puedo usar mi logo, colores y branding?
                    </span>
                  ),
                  children: (
                    <Text style={{ color: "#b6c2d9", lineHeight: 1.8 }}>
                      Sí. La plataforma permite configurar identidad visual para
                      que el contenido generado mantenga coherencia con tu
                      marca.
                    </Text>
                  ),
                },
                {
                  key: "3",
                  label: (
                    <span style={{ color: "white", fontWeight: 600 }}>
                      ¿Sirve para agencias o múltiples clientes?
                    </span>
                  ),
                  children: (
                    <Text style={{ color: "#b6c2d9", lineHeight: 1.8 }}>
                      Sí. TalosFlow AI está pensado para negocios, equipos y
                      agencias que necesitan más orden, escalabilidad y control
                      sobre varias operaciones.
                    </Text>
                  ),
                },
                {
                  key: "4",
                  label: (
                    <span style={{ color: "white", fontWeight: 600 }}>
                      ¿Necesito conocimientos técnicos para usarlo?
                    </span>
                  ),
                  children: (
                    <Text style={{ color: "#b6c2d9", lineHeight: 1.8 }}>
                      No. La experiencia está pensada para que puedas configurar
                      tu marca, generar contenido y operar la plataforma de
                      forma directa y guiada.
                    </Text>
                  ),
                },
                {
                  key: "5",
                  label: (
                    <span style={{ color: "white", fontWeight: 600 }}>
                      ¿Puedo cambiar de plan después?
                    </span>
                  ),
                  children: (
                    <Text style={{ color: "#b6c2d9", lineHeight: 1.8 }}>
                      Sí. Puedes empezar con un nivel inicial y escalar a medida
                      que aumenten tus necesidades de contenido, automatización
                      y cuentas sociales.
                    </Text>
                  ),
                },
                {
                  key: "6",
                  label: (
                    <span style={{ color: "white", fontWeight: 600 }}>
                      ¿Qué resuelve TalosFlow AI frente a hacerlo manualmente?
                    </span>
                  ),
                  children: (
                    <Text style={{ color: "#b6c2d9", lineHeight: 1.8 }}>
                      Reduce fricción, acelera el tiempo de producción, mejora
                      consistencia visual y te permite operar el contenido como
                      un sistema, no como tareas aisladas.
                    </Text>
                  ),
                },
              ]}
            />
          </div>
        </section>

        <section
          style={{
            padding: isMobile ? "0 16px 64px" : "0 24px 100px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={ctaBoxStyle}>
            <Title style={{ color: "white", marginTop: 0, marginBottom: 12 }}>
              Activa el flujo. Escala tu marca. Publica con inteligencia.
            </Title>
            <Paragraph
              style={{
                color: "#e2eaf7",
                fontSize: 18,
                maxWidth: 780,
                margin: "0 auto 24px",
                lineHeight: 1.8,
              }}
            >
              TalosFlow AI convierte tu proceso de contenido en una máquina
              operativa mucho más rápida, coherente y potente.
            </Paragraph>

            <Space
              wrap
              style={{
                width: isMobile ? "100%" : undefined,
                justifyContent: "center",
              }}
            >
              <Button
                type="primary"
                size="large"
                onClick={() => navigate("/auth/signup")}
                style={{
                  height: 48,
                  paddingInline: 24,
                  borderRadius: 999,
                  background: "linear-gradient(90deg, #1677ff, #7c3aed)",
                  border: "none",
                }}
              >
                Crear cuenta gratis
              </Button>
              <Button
                size="large"
                onClick={() => navigate("/auth/login")}
                style={{
                  height: 48,
                  paddingInline: 24,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  borderColor: "rgba(255,255,255,0.14)",
                  color: "white",
                }}
              >
                Ya tengo acceso
              </Button>
            </Space>
          </div>
        </section>
      </Content>

      <Footer
        style={{
          background: "#050a15",
          color: "#91a3bf",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          position: "relative",
          zIndex: 2,
          padding: isMobile ? "40px 16px 24px" : "56px 24px 28px",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Space direction="vertical" size={14}>
                <Space size="middle">
                  <img
                    src="/taloslogo.png"
                    alt="TalosFlow AI"
                    style={{
                      width: 42,
                      height: 42,
                      objectFit: "contain",
                      borderRadius: 12,
                    }}
                  />
                  <div>
                    <Title level={4} style={{ color: "white", margin: 0 }}>
                      TalosFlow AI
                    </Title>
                    <Text style={{ color: "#7dd3fc", fontSize: 12 }}>
                      Intelligent Content Engine
                    </Text>
                  </div>
                </Space>

                <Text style={{ color: "#aebbd1", lineHeight: 1.8 }}>
                  Plataforma para automatizar contenido, branding y publicación
                  con una operación más rápida, coherente y escalable.
                </Text>
              </Space>
            </Col>

            <Col xs={24} sm={8} md={5}>
              <Space direction="vertical" size={10}>
                <Text strong style={{ color: "white" }}>
                  Producto
                </Text>
                <a
                  href="#beneficios"
                  style={{ color: "#aebbd1", textDecoration: "none" }}
                >
                  Beneficios
                </a>
                <a
                  href="#como-funciona"
                  style={{ color: "#aebbd1", textDecoration: "none" }}
                >
                  Flujo
                </a>
                <a
                  href="#planes"
                  style={{ color: "#aebbd1", textDecoration: "none" }}
                >
                  Planes
                </a>
                <a
                  href="#faq"
                  style={{ color: "#aebbd1", textDecoration: "none" }}
                >
                  FAQ
                </a>
              </Space>
            </Col>

            <Col xs={24} sm={8} md={5}>
              <Space direction="vertical" size={10}>
                <Text strong style={{ color: "white" }}>
                  Empresa
                </Text>
                <a
                  href="#quienes-somos"
                  style={{ color: "#aebbd1", textDecoration: "none" }}
                >
                  Quiénes somos
                </a>
                <a
                  href="#servicios"
                  style={{ color: "#aebbd1", textDecoration: "none" }}
                >
                  Servicios
                </a>
                <a
                  href="#planes"
                  style={{ color: "#aebbd1", textDecoration: "none" }}
                >
                  Escalabilidad
                </a>
              </Space>
            </Col>

            <Col xs={24} sm={8} md={6}>
              <Space direction="vertical" size={10}>
                <Text strong style={{ color: "white" }}>
                  Acceso
                </Text>
                <button
                  onClick={() => navigate("/auth/login")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#aebbd1",
                    padding: 0,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => navigate("/auth/signup")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#aebbd1",
                    padding: 0,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  Crear cuenta
                </button>
                <Text style={{ color: "#aebbd1" }}>contacto@talosflow.ai</Text>
              </Space>
            </Col>
          </Row>

          <Divider
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              margin: "32px 0 20px",
            }}
          />

          <Row justify="space-between" gutter={[16, 16]}>
            <Col>
              <Text style={{ color: "#91a3bf" }}>
                TalosFlow AI © {new Date().getFullYear()} · Inteligencia para
                automatizar contenido, branding y publicación
              </Text>
            </Col>
            <Col>
              <Space size="large" wrap>
                <a
                  href="/terms-of-service"
                  style={{ color: "#91a3bf", textDecoration: "none" }}
                >
                  Términos
                </a>

                <a
                  href="/privacy-policy"
                  style={{ color: "#91a3bf", textDecoration: "none" }}
                >
                  Privacidad
                </a>

                <a
                  href="/data-deletion"
                  style={{ color: "#91a3bf", textDecoration: "none" }}
                >
                  Eliminación de datos
                </a>

                <a
                  href="mailto:contacto@talosflow.ai"
                  style={{ color: "#91a3bf", textDecoration: "none" }}
                >
                  Soporte
                </a>
              </Space>
            </Col>
          </Row>
        </div>
      </Footer>
    </Layout>
  );
}
