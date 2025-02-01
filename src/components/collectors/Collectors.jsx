import {
  Breadcrumb,
  Button,
  Card,
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

const Collectors = () => {
  const [collectors, setCollectors] = useState([]);
  const [isCollectorModalOpen, setIsCollectorModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { authState } = useAuth();
  const [messageAlert, messageContext] = message.useMessage();
  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    getCollectors();
  }, []);

  const getCollectors = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/collectors", {
        method: "GET",
      });

      const collectorsData = await response.json();
      const collectors = collectorsData.map((collector) => ({
        ...collector,
        actions: (
          <>
            <Button
              className="edit-btn"
              type="primary"
              style={{
                backgroundColor: "var(--yellow)",
              }}
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
            <Button type="primary"> Ver Pagos </Button>
          </>
        ),
      }));

      setCollectors(collectors);
      setLoading(false);
    } catch (error) {
      messageAlert.error("Error fetching collectors");
    }
  };

  const deleteCollector = async (collector) => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/collectors/delete-customer/${collector.id}`,
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
      messageAlert.error("Error al Eliminar Cliente");
    }
  };

  const collectorsTableColumns = [
    {
      title: "Código de Servicio",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
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
          ]}
        />

        <Card className="mt-3">
          <div className="row ms-2 pt-3 mb-2">
            <div className="col-12 text-start">
              <label className="fw-semibold text-black"> Buscar Por </label>
            </div>
          </div>
          <div className="row ms-2 mb-3">
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <label className="me-2 fw-semibold text-black"> Nombre </label>
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
              <Button
                type="primary"
                onClick={() => setIsCollectorModalOpen(true)}
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
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Total: ${total} colector(es)`,
                  hideOnSinglePage: true,
                }}
              />
            </div>
          </div>
        </Card>
        <AddNewCollectorModal
          openModal={isCollectorModalOpen}
          closeModal={() => setIsCollectorModalOpen(false)}
        />
      </div>
    </Content>
  );
};

export default Collectors;
