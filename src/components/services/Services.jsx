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
  BulbOutlined,
  PlusCircleOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext/AuthContext";
import PaymentsDetailsModal from "../../utils/modals/services/PaymentsDetailsModal";
import EditServiceModal from "../../utils/modals/services/EditServiceModal";
import AddNewServiceModal from "../../utils/modals/services/AddNewServiceModal";
import { useForm } from "antd/es/form/Form";

const Services = () => {
  const [services, setServices] = useState([]);
  const [isServicePaymentsModalOpen, setIsServicePaymentsModalOpen] =
    useState(false);
  const [isServiceEditModalOpen, setIsServiceEditModalOpen] = useState(false);
  const [isPaymentsDetailsModalOpen, setIsPaymentsDetailsModalOpen] =
    useState(false);
  const [selectedService, setSelectedService] = useState([]);
  const [loading, setLoading] = useState(false);
  const { authState } = useAuth();
  const [messageAlert, messageContext] = message.useMessage();
  const { Content } = Layout;
  const [form] = useForm();
  const token = authState.token;

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    document.title = "Banco Bambú | Colectores - Servicios";
    getServices();
  }, []);

  const getServices = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/services", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const servicesData = await response.json();

      if (response.status === 200) {
        const services = servicesData.map((service) => ({
          ...service,
          actions: (
            <>
              <Button
                className="ant-btn-edit"
                type="primary"
                onClick={() => setIsServiceEditModalOpen(true)}
              >
                Editar
              </Button>
              <Popconfirm
                title="Eliminar Colector"
                description="¿Está seguro de Eliminar este Registro?"
                onConfirm={() => deleteService(service)}
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

        setServices(services);
      } else {
        messageAlert.error(servicesData.message);
      }
    } catch (error) {
      messageAlert.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (service) => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/services/delete-service/${service.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const deletedService = await response.json();

      if (response.status === 200) {
        messageAlert.success(deletedService.message);
        getServices();
      } else {
        messageAlert.error(deletedService.message);
      }
    } catch (error) {
      messageAlert.error("Error al Eliminar Colector");
    }
  };

  const searchService = async (service) => {
    if (
      (service.collector === undefined || service.collector === "") &&
      (service.service === undefined || service.service === "")
    ) {
      messageAlert.warning(
        "Por Favor, Introduzca al Menos un Criterio de Búsqueda"
      );
      getServices();
      return;
    } else {
      setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:3001/services/search-service?collector=${
            service.collector ?? ""
          }&service=${service.service ?? ""}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const servicesData = await response.json();

        if (response.status === 200) {
          const services = servicesData.map((service) => ({
            ...service,
            actions: (
              <>
                <Button
                  className="ant-btn-edit"
                  type="primary"
                  onClick={() => setIsServiceEditModalOpen(true)}
                >
                  Editar
                </Button>
                <Popconfirm
                  title="Eliminar Colector"
                  description="¿Está seguro de Eliminar este Registro?"
                  onConfirm={() => deleteService(service)}
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

          setServices(services);
        } else if (response.status === 400) {
          messageAlert.warning(servicesData.message);
        } else {
          messageAlert.error(servicesData.message);
        }
      } catch (error) {
        messageAlert.error(
          "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const servicesTableColumns = [
    {
      title: "Servicio",
      dataIndex: "service",
      key: "service",
      align: "center",
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      title: "Colector",
      dataIndex: "collector",
      key: "collector",
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
                  <BulbOutlined />
                  <span>Servicios</span>
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
                onFinish={searchService}
              >
                <label className="me-2 fw-semibold text-black">
                  {" "}
                  Colector{" "}
                </label>
                <Form.Item name="collector" initialValue="">
                  <Input
                    placeholder="Nombre de Colector"
                    prefix={<SolutionOutlined />}
                    style={{
                      width: 183,
                    }}
                  />
                </Form.Item>
                <label className="me-2 fw-semibold text-black">
                  {" "}
                  Servicio{" "}
                </label>
                <Form.Item name="service" initialValue="">
                  <Input
                    placeholder="Nombre de Servicio"
                    prefix={<BulbOutlined />}
                    style={{
                      width: 183,
                    }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {" "}
                    Buscar{" "}
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div className="col-xxl-7 col-xl-4 col-sm-12 ms-2 text-end">
              <Button
                type="primary"
                onClick={() => setIsServicePaymentsModalOpen(true)}
              >
                <PlusCircleOutlined /> Nuevo Servicio{" "}
              </Button>
            </div>
          </div>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-12">
              <Table
                dataSource={services}
                columns={servicesTableColumns}
                onRow={(record) => ({
                  onClick: () => setSelectedService(record),
                })}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                  showTotal: (total) =>
                    `Total: ${total} servicio(s) registrado(s)`,
                  hideOnSinglePage: true,
                }}
                loading={loading}
                scroll={{ x: "max-content" }}
              />
            </div>
          </div>
        </Card>

        <AddNewServiceModal
          isOpen={isServicePaymentsModalOpen}
          isClosed={() => setIsServicePaymentsModalOpen(false)}
          setAlertMessage={messageAlert}
        />

        <EditServiceModal
          isOpen={isServiceEditModalOpen}
          isClosed={() => setIsServiceEditModalOpen(false)}
          selectedService={selectedService}
          getServices={getServices}
          setAlertMessage={messageAlert}
        />

        <PaymentsDetailsModal
          isOpen={isPaymentsDetailsModalOpen}
          isClosed={() => setIsPaymentsDetailsModalOpen(false)}
          selectedService={selectedService}
        />
      </div>
    </Content>
  );
};

export default Services;
