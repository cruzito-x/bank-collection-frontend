import {
  Breadcrumb,
  Button,
  Card,
  Form,
  Input,
  Layout,
  message,
  Popconfirm,
  Table,
  theme,
} from "antd";
import {
  BankOutlined,
  PlusCircleOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext/AuthContext";
import AddNewCollectorModal from "../../utils/modals/dashboard/AddNewCollectorModal";
import PaymentsDetailsModal from "../../utils/modals/collectors/PaymentsDetailsModal";
import EditCollectorModal from "../../utils/modals/collectors/EditCollectorModal";
import { useForm } from "antd/es/form/Form";

const Collectors = () => {
  const [collectors, setCollectors] = useState([]);
  const [isCollectorPaymentsModalOpen, setIsCollectorPaymentsModalOpen] =
    useState(false);
  const [isCollectorEditModalOpen, setIsCollectorEditModalOpen] =
    useState(false);
  const [isPaymentsDetailsModalOpen, setIsPaymentsDetailsModalOpen] =
    useState(false);
  const [selectedCollector, setSelectedCollector] = useState([]);
  const [loading, setLoading] = useState(false);
  const { authState } = useAuth();
  const [messageAlert, messageContext] = message.useMessage();
  const { Content } = Layout;
  const [form] = useForm();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    document.title = "Banco Bambú | Colectores";
    getCollectors();
  }, []);

  const getCollectors = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/collectors", {
        method: "GET",
      });

      const collectorsData = await response.json();

      if (response.status === 200) {
        const collectors = collectorsData.map((collector) => ({
          ...collector,
          actions: (
            <>
              <Button
                className="ant-btn-edit"
                type="primary"
                onClick={() => setIsCollectorEditModalOpen(true)}
              >
                Editar
              </Button>
              <Popconfirm
                title="Eliminar Colector"
                description="¿Está seguro de Eliminar este Registro?"
                onConfirm={() => deleteCollector(collector)}
                okText="Sí"
                cancelText="No"
              >
                <Button className="ms-2 me-2" type="primary" danger>
                  Eliminar
                </Button>
              </Popconfirm>
              <Button
                type="primary"
                onClick={() => setIsPaymentsDetailsModalOpen(true)}
              >
                {" "}
                Ver Pagos{" "}
              </Button>
            </>
          ),
        }));

        setCollectors(collectors);
      } else {
        messageAlert.error(collectorsData.message);
      }
    } catch (error) {
      messageAlert.error("Error al Obtener Colectores");
    } finally {
      setLoading(false);
    }
  };

  const deleteCollector = async (collector) => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/collectors/delete-collector/${collector.id}`,
        {
          method: "PUT",
        }
      );

      const deletedCollector = await response.json();

      if (response.status === 200) {
        messageAlert.success(deletedCollector.message);
        getCollectors();
      } else {
        messageAlert.error(deletedCollector.message);
      }
    } catch (error) {
      messageAlert.error("Error al Eliminar Colector");
    }
  };

  const searchCollector = async (collector) => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/collectors/search-collector?collector=${
          collector.collector ?? ""
        }`,
        {
          method: "GET",
        }
      );

      const collectorsData = await response.json();

      if (response.status === 200) {
        const collectors = collectorsData.map((collector) => ({
          ...collector,
          actions: (
            <>
              <Button
                className="ant-btn-edit"
                type="primary"
                onClick={() => setIsCollectorEditModalOpen(true)}
              >
                Editar
              </Button>
              <Popconfirm
                title="Eliminar Colector"
                description="¿Está seguro de Eliminar este Registro?"
                onConfirm={() => deleteCollector(collector)}
                okText="Sí"
                cancelText="No"
              >
                <Button className="ms-2 me-2" type="primary" danger>
                  Eliminar
                </Button>
              </Popconfirm>
              <Button
                type="primary"
                onClick={() => setIsPaymentsDetailsModalOpen(true)}
              >
                {" "}
                Ver Pagos{" "}
              </Button>
            </>
          ),
        }));

        setCollectors(collectors);
      } else {
        messageAlert.error(collectorsData.message);
      }
    } catch (error) {
      messageAlert.error("Error al Buscar Colector");
    } finally {
      setLoading(false);
    }
  };

  const collectorsTableColumns = [
    {
      title: "Colector",
      dataIndex: "collector",
      key: "collector",
      align: "center",
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      title: "Servicios",
      dataIndex: "services_names",
      key: "services_names",
      align: "center",
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      align: "center",
      width: "33%",
    },
  ];

  return (
    <Content style={{ margin: "31px 16px" }}>
      {messageContext}
      <div
        style={{
          padding: "24px 0 24px 0",
          minHeight: "90vh",
          borderRadius: borderRadiusLG,
        }}
      >
        <Breadcrumb
          items={[
            {
              title: (
                <>
                  <BankOutlined />
                  <span> Banco Bambú </span>
                </>
              ),
            },
            {
              title: (
                <>
                  <UserOutlined />
                  <span> {authState.username} </span>
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
              <label className="fw-semibold text-black"> Buscar Por </label>
            </div>
          </div>
          <div className="row ms-2 mb-3">
            <div className="col-xxl-3 col-xl-3 col-sm-12 w-auto">
              <Form
                layout="inline"
                form={form}
                className="align-items-center"
                onFinish={searchCollector}
              >
                <label className="me-2 fw-semibold text-black"> Nombre </label>
                <Form.Item name="collector">
                  <Input
                    placeholder="Nombre de Colector"
                    prefix={<SolutionOutlined />}
                    style={{
                      width: 183,
                    }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Buscar
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div className="col-xxl-9 col-xl-9 col-sm-12 text-end">
              <Button
                type="primary"
                onClick={() => setIsCollectorPaymentsModalOpen(true)}
              >
                <PlusCircleOutlined /> Nuevo Colector{" "}
              </Button>
            </div>
          </div>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-12">
              <Table
                dataSource={collectors}
                columns={collectorsTableColumns}
                loading={loading}
                onRow={(record) => ({
                  onClick: () => setSelectedCollector(record),
                })}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                  showTotal: (total) =>
                    `Total: ${total} colector(es) regisrado(s)`,
                  hideOnSinglePage: true,
                }}
              />
            </div>
          </div>
        </Card>
        <AddNewCollectorModal
          isOpen={isCollectorPaymentsModalOpen}
          isClosed={() => setIsCollectorPaymentsModalOpen(false)}
        />

        <EditCollectorModal
          isOpen={isCollectorEditModalOpen}
          isClosed={() => setIsCollectorEditModalOpen(false)}
          selectedCollector={selectedCollector}
          getCollectors={getCollectors}
          setAlertMessage={messageAlert}
        />

        <PaymentsDetailsModal
          isOpen={isPaymentsDetailsModalOpen}
          isClosed={() => setIsPaymentsDetailsModalOpen(false)}
          selectedCollector={selectedCollector}
        />
      </div>
    </Content>
  );
};

export default Collectors;
