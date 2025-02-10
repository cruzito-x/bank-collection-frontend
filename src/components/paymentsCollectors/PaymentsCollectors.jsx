import {
  Breadcrumb,
  Button,
  Card,
  Form,
  Input,
  Layout,
  message,
  Table,
  theme,
} from "antd";
import {
  BankOutlined,
  DollarCircleOutlined,
  PlusCircleOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext/AuthContext";
import moment from "moment";
import PaymentsCollectorsDetailsModal from "../../utils/modals/paymentsCollectors/PaymentsCollectorsDetailsModal";
import PaymentsCollectorsModal from "../../utils/modals/dashboard/PaymentsCollectorsModal";
import { useForm } from "antd/es/form/Form";
import PaymentsCollectorsChartModal from "../../utils/modals/paymentsCollectors/PaymentsCollectorsChartModal";

const PaymentsCollectors = () => {
  const { authState } = useAuth();
  const [paymentsCollector, setPaymentsCollectors] = useState([]);
  const [
    isPaymentsCollectorsDetailsModalOpen,
    setIsPaymentsCollectorsDetailsModalOpen,
  ] = useState(false);
  const [selectedPaymentCollector, setSelectedPaymentCollector] = useState([]);
  const [openRegisterPayment, setOpenRegisterPayment] = useState(false);
  const [viewCollectorsPaymentsModal, setViewCollectorsPaymentsModal] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [messageAlert, messageContext] = message.useMessage();
  const { Content } = Layout;
  const [form] = useForm();
  const token = authState.token;

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    document.title = "Banco Bambú | Pagos a Colectores";
    getPaymentsCollectors();
  }, []);

  const getPaymentsCollectors = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/payments-collectors",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const paymentscollectorsData = await response.json();

      if (response.status === 200) {
        const paymentsCollector = paymentscollectorsData.map(
          (paymentsCollector) => {
            return {
              ...paymentsCollector,
              amount: "$" + paymentsCollector.amount,
              datetime: moment(paymentsCollector.datetime).format(
                "DD/MM/YYYY - hh:mm A"
              ),
              actions: (
                <>
                  <Button
                    type="primary"
                    onClick={() =>
                      setIsPaymentsCollectorsDetailsModalOpen(true)
                    }
                  >
                    {" "}
                    Ver Detalles{" "}
                  </Button>
                </>
              ),
            };
          }
        );

        setPaymentsCollectors(paymentsCollector);
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      } else {
        messageAlert.error(paymentscollectorsData.message);
      }
    } catch (error) {
      messageAlert.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      setLoading(false);
    }
  };

  const searchPaymentsCollector = async (collector) => {
    if (collector.collector === undefined || collector.collector === "") {
      messageAlert.warning(
        "Por Favor, Introduzca al Menos un Criterio de Búsqueda"
      );
      getPaymentsCollectors();
      return;
    } else {
      setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:3001/payments-collectors/search-payments-collectors?collector=${
            collector.collector ?? ""
          }`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const paymentscollectorsData = await response.json();

        if (response.status === 200) {
          const paymentsCollector = paymentscollectorsData.map(
            (paymentsCollector) => {
              return {
                ...paymentsCollector,
                amount: "$" + paymentsCollector.amount,
                datetime: moment(paymentsCollector.datetime).format(
                  "DD/MM/YYYY - hh:mm A"
                ),
                actions: (
                  <>
                    <Button
                      type="primary"
                      onClick={() =>
                        setIsPaymentsCollectorsDetailsModalOpen(true)
                      }
                    >
                      {" "}
                      Ver Detalles{" "}
                    </Button>
                  </>
                ),
              };
            }
          );

          setPaymentsCollectors(paymentsCollector);
        } else if (response.status === 400) {
          messageAlert.warning(paymentscollectorsData.message);
        } else if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          window.location.href = "/";
          return;
        } else {
          messageAlert.error(paymentscollectorsData.message);
        }
      } catch (error) {
        messageAlert.error(
          "Ha Ocurrido Un Error Inesperado, Intente en unos Instantes"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const paymentsCollectorsTableColumns = [
    {
      title: "Cliente",
      dataIndex: "customer",
      key: "customer",
      align: "center",
    },
    {
      title: "Colector",
      dataIndex: "collector",
      key: "collector",
      align: "center",
    },
    {
      title: "Monto Pagado",
      dataIndex: "amount",
      key: "amount",
      align: "center",
    },
    {
      title: "Fecha y Hora",
      dataIndex: "datetime",
      key: "datetime",
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
                  <DollarCircleOutlined />
                  <span>Pagos a Colectores</span>
                </>
              ),
            },
          ]}
        />

        <Card className="mt-3">
          <div className="row ms-2 pt-3 pe-3 mb-2">
            <div className="col-12 text-start">
              <label className="fw-semibold text-black"> Buscar Por </label>
            </div>
          </div>
          <div className="row ms-2 pe-3 align-items-center">
            <div className="col-xxl-8 col-xl-6 col-md-12 col-sm-12">
              <Form
                className="row"
                layout="inline"
                form={form}
                onFinish={searchPaymentsCollector}
              >
                <div className="col-xxl-2 col-xl-3 col-md-12 col-sm-12 mb-3 d-flex align-items-center w-auto">
                  <label className="me-2 fw-semibold text-black">
                    {" "}
                    Nombre{" "}
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
                </div>
                <div className="col-xxl-2 col-xl-3 col-md-12 col-sm-12 mb-3 d-lg-flex d-sm-block align-items-center w-sm-100">
                  <Form.Item>
                    <Button className="w-100" type="primary" htmlType="submit">
                      {" "}
                      Buscar{" "}
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
            <div className="col-xxl-2 col-xl-3 col-md-12 col-sm-12 mb-3 text-end">
              <Button
                className="w-100"
                type="primary"
                onClick={() => setViewCollectorsPaymentsModal(true)}
              >
                Ver Pagos de Colectores{" "}
              </Button>
            </div>
            <div className="col-xxl-2 col-xl-3 col-md-12 col-sm-12 mb-3 text-end pe-3">
              <Button
                className="w-100"
                type="primary"
                onClick={() => setOpenRegisterPayment(true)}
              >
                <PlusCircleOutlined /> Nuevo Pago a Colector{" "}
              </Button>
            </div>
          </div>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-12">
              <Table
                dataSource={paymentsCollector}
                columns={paymentsCollectorsTableColumns}
                onRow={(record) => ({
                  onClick: () => setSelectedPaymentCollector(record),
                })}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                  showTotal: (total) => `Total: ${total} pago(s) registrado(s)`,
                  hideOnSinglePage: true,
                }}
                loading={loading}
                scroll={{ x: "max-content" }}
              />
            </div>
          </div>
        </Card>

        <PaymentsCollectorsModal
          isOpen={openRegisterPayment}
          isClosed={() => setOpenRegisterPayment(false)}
          currentPath={window.location.pathname}
          getPaymentsCollectors={getPaymentsCollectors}
          setAlertMessage={messageAlert}
        />

        <PaymentsCollectorsChartModal
          isOpen={viewCollectorsPaymentsModal}
          isClosed={() => setViewCollectorsPaymentsModal(false)}
        />

        <PaymentsCollectorsDetailsModal
          isOpen={isPaymentsCollectorsDetailsModalOpen}
          isClosed={() => setIsPaymentsCollectorsDetailsModalOpen(false)}
          paymentsCollectorsData={selectedPaymentCollector}
          setAlertMessage={messageAlert}
        />
      </div>
    </Content>
  );
};

export default PaymentsCollectors;
