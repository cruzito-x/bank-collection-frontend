import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Input,
  Layout,
  Modal,
  Row,
  Table,
  theme,
} from "antd";
import {
  InfoCircleOutlined,
  PlusCircleOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import TextArea from "antd/es/input/TextArea";

const Collectors = () => {
  const [isCollectorModalOpen, setIsCollectorModalOpen] = useState(false);
  
  const { TextArea } = Input;
  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const showAddCollectorModal = () => {
    setIsCollectorModalOpen(true);
  };

  const closeAddCollectorModal = () => {
    setIsCollectorModalOpen(false);
  };

  const CollectorsDataSource = [
    {
      key: "1",
      id: "1234567890",
      service: "John Doe",
      actions: (
        <>
          <Button
            className="edit-btn"
            type="primary"
            style={{
              backgroundColor: "#ffac00",
              // hover: "#ffc654"
            }}
          >
            Editar
          </Button>
          <Button className="ms-2 me-2" type="primary" danger>
            Eliminar
          </Button>
          <Button type="primary"> Transacciones </Button>
        </>
      ),
    },
  ];

  const CollectorsDataColumns = [
    {
      title: "Código de Servicio",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Servicio",
      dataIndex: "service",
      key: "service",
      align: "center",
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      align: "center",
    },
  ];

  return (
    <Content style={{ margin: "31px 16px" }}>
      <div
        style={{
          paddingTop: 24,
          minHeight: "90vh",
          background: "none",
          borderRadius: borderRadiusLG,
        }}
      >
        <Breadcrumb
          items={[
            {
              title: (
                <>
                  <UserOutlined />
                  <span>Usuario</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <SolutionOutlined />
                  <span>Colectores</span>
                </>
              ),
            },
          ]}
        />

        <Card className="mt-3">
          <div className="row ms-2 pt-3 mb-2">
            <div className="col-12 text-start">
              <label className="fw-semibold"> Buscar Por </label>
            </div>
          </div>
          <div className="row ms-2 mb-3">
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <label className="me-2 fw-semibold"> Nombre </label>
              <Input
                placeholder="Nombre de Colector"
                prefix={<SolutionOutlined />}
                style={{
                  width: 183,
                }}
              />
            </div>
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <Button type="primary"> Buscar </Button>
            </div>
            <div className="col-xxl-9 col-xl-7 col-sm-12 d-flex justify-content-end">
              <Button type="primary" onClick={showAddCollectorModal}>
                <PlusCircleOutlined /> Añadir nuevo{" "}
              </Button>
              <Modal
                title={
                  <Row align="middle">
                    {" "}
                    <Col>
                      {" "}
                      <InfoCircleOutlined
                        className="fs-6"
                        style={{ marginRight: 8, color: "var(--blue)" }}
                      />{" "}
                    </Col>{" "}
                    <Col>
                      <label className="fs-6">Añadir Nuevo Colector</label>
                    </Col>{" "}
                  </Row>
                }
                centered
                width={450}
                open={isCollectorModalOpen}
                onCancel={closeAddCollectorModal}
                footer={[
                  <Button
                    key="submit"
                    type="primary"
                    onClick={closeAddCollectorModal}
                  >
                    Cerrar
                  </Button>
                ]}
              >
                <div className="row mt-4">
                  <div className="col-12 mb-3">
                    <label className="fw-semibold"> Nombre del Colector </label>
                    <Input placeholder="Nombre del Colector"/>
                  </div>
                  <div className="col-12">
                    <label className="fw-semibold"> Descripción </label>
                    <TextArea rows={7} />;
                  </div>
                </div>
              </Modal>
            </div>
          </div>
          <div className="row ms-1 mb-3 pe-3">
            <div className="col-12">
              <Table
                dataSource={CollectorsDataSource}
                columns={CollectorsDataColumns}
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Total: ${total} colector(es)`,
                  hideOnSinglePage: true,
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    </Content>
  );
};

export default Collectors;
