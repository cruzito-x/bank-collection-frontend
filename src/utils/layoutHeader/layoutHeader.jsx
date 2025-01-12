// /src/components/LayoutHeader.jsx
import React from "react";
import { Layout, Typography, theme, Row, Col } from "antd";

const LayoutHeader = () => {
  const { Header } = Layout;
  const { Title } = Typography;

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
        marginTop: "-15px",
        marginLeft: 0,
        position: "fixed",
        width: "100%",
        zIndex: "1",
      }}
    >
      <Row style={{ width: "100%", alignItems: "center" }}>
        <Col xs={24} sm={24} md={18} lg={18} xl={18}>
          <Title level={4} style={{ marginLeft: "15px" }}>
            Sistema de Cobros Bancarios
          </Title>
        </Col>
      </Row>
    </Header>
  );
};

export default LayoutHeader;