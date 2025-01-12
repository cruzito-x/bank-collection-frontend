import React from "react";
import { Layout, Typography, Row, Col } from "antd";

const LayoutHeader = () => {
  const { Header } = Layout;
  const { Title } = Typography;

  return (
    <Header
      style={{
        padding: 0,
        background: "#a0aec0",
        marginTop: 0,
        marginLeft: 0,
        position: "fixed",
        width: "100%",
        zIndex: "1",
      }}
    >
      <Row style={{ width: "100%", alignItems: "center" }}>
        <Col xs={24} sm={24} md={18} lg={18} xl={18} className="mt-3">
          <Title level={4} style={{ marginLeft: "15px", color: "#ffffff"}}>
            Sistema de Cobros Bancarios
          </Title>
        </Col>
      </Row>
    </Header>
  );
};

export default LayoutHeader;