import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  message,
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
import React, { useEffect, useState } from "react";

const Collectors = () => {
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    getCollectors();
  }, []);

  const getCollectors = async () => {
    try {
      const response = await fetch("http://localhost:3001/collectors", {
        method: "GET",
      });

      const data = await response.json();
      const collectorsRow = data.map((collector) => ({
        ...collector,
        actions: (
          <>
            <Button
              className="edit-btn"
              type="primary"
              style={{
                backgroundColor: "var(--yellow)",
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
      }));

      setCollectors(collectorsRow);
    } catch (error) {}
  };

  const saveNewCollector = async (collector) => {
    setLoading(true);

    try {
      const newCollector = await fetch(
        "http://localhost:3001/collectors/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(collector),
        }
      );
      const data = await newCollector.json();

      if (data.status === 200) {
        setLoading(false);
        message.success(data.message);
        closeAddCollectorModal();
        getCollectors();
      } else {
        if (data.status === 500 || data.status === 400) {
          message.error(data.message);
        }
      }
    } catch (error) {}
  };

  const CollectorsTableColumns = [
    {
      title: "Código de Servicio",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Servicio",
      dataIndex: "service_name",
      key: "service_name",
      align: "center",
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
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
                footer={[]}
              >
                <Form onFinish={saveNewCollector}>
                  <div className="row mt-4">
                    <div className="col-12">
                      <label className="fw-semibold">
                        {" "}
                        Nombre del Colector{" "}
                      </label>
                      <Form.Item
                        name="service_name"
                        rules={[
                          {
                            required: true,
                            message:
                              "Por Favor, Introduzca un Nombre de Servicio",
                          },
                        ]}
                      >
                        <Input placeholder="Nombre del Colector" />
                      </Form.Item>
                    </div>
                    <div className="col-12">
                      <label className="fw-semibold"> Descripción </label>
                      <Form.Item
                        name="description"
                        rules={[
                          {
                            required: true,
                            message:
                              "Por Favor, Introduzca una Descripción de Servicio",
                          },
                        ]}
                      >
                        <TextArea
                          rows={8}
                          size="middle"
                          style={{
                            resize: "none",
                          }}
                          placeholder="Descripción del Servicio"
                        />
                      </Form.Item>
                    </div>
                    <div className="col-12 text-end">
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          loading={loading}
                        >
                          Guardar
                        </Button>
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              </Modal>
            </div>
          </div>
          <div className="row ms-1 mb-3 pe-3">
            <div className="col-12">
              <Table
                dataSource={collectors}
                columns={CollectorsTableColumns}
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
