import {
  Button,
  Card,
  Layout,
  Select,
  Space,
  DatePicker,
  theme,
  Modal,
  Row,
  Col,
  InputNumber,
  Form,
  Table,
  message,
} from "antd";
import { InfoCircleOutlined, WarningOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import "./styles/dashboard.css";
import DashboardCharts from "./charts/DashboardCharts";
import moment from "moment";
import LogoutCard from "../../utils/logoutCard/LogoutCard";
import AddCollectorModal from "../../utils/modals/AddCollectorModal";

const Dashboard = ({ rangeFilter = () => {} }) => {
  const [customers, setCustomers] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [services, setServices] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [totalPayments, setTotalPayments] = useState([]);
  const [totalProcessedAmounts, setTotalProcessedAmounts] = useState([]);
  const [isCollectorModalOpen, setIsCollectorModalOpen] = useState(false);
  const [openRegisterPayment, setOpenRegisterPayment] = useState(false);
  const [sendingDataLoading, setSendingDataLoading] = useState(false);
  const [openNotificationsModal, setOpenNotificationsModal] = useState(false);
  const [messageAlert, messageContext] = message.useMessage();
  const [form] = Form.useForm();
  const [dates, setDates] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);

  const { Content } = Layout;
  const { RangePicker } = DatePicker;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const quickFilter = (type) => {
    let range;
    switch (type) {
      case "today":
        range = [moment().startOf("day"), moment().endOf("day")];
        break;
      case "lastWeek":
        range = [
          moment().subtract(7, "days").startOf("day"),
          moment().endOf("day"),
        ];
        break;
      case "lastMonth":
        range = [
          moment().subtract(1, "month").startOf("day"),
          moment().endOf("day"),
        ];
        break;
      case "lastQuarter":
        range = [
          moment().subtract(3, "month").startOf("day"),
          moment().endOf("day"),
        ];
        break;
      case "lastSemester":
        range = [
          moment().subtract(6, "month").startOf("day"),
          moment().endOf("day"),
        ];
        break;
      case "lastYear":
        range = [
          moment().subtract(12, "month").startOf("day"),
          moment().endOf("day"),
        ];
        break;
      default:
        range = [moment().startOf("day"), moment().endOf("day")];
    }
    setDates(range);
    rangeFilter(range);
  };

  const showAddCollectorModal = () => {
    setIsCollectorModalOpen(true);
  };

  const closeAddCollectorModal = () => {
    setIsCollectorModalOpen(false);
  };

  const showPaymentsModal = () => {
    setOpenRegisterPayment(true);
  };

  const closePaymentsModal = () => {
    setOpenRegisterPayment(false);
  };

  const showNotificationsModal = () => {
    setOpenNotificationsModal(true);
  };

  const closeNotificacionsModal = () => {
    setOpenNotificationsModal(false);
  };

  useEffect(() => {
    getCustomers();
    getCollectors();
    getServicesByCollector();
    getTransactionTypes();
    getTotalPayments();
    getTotalProcessedAmounts();
  }, []);

  useEffect(() => {
    if (collectors.length === 0) return;
    if (totalPayments.length === 0) return;
    if (totalProcessedAmounts.length === 0) return;
  }, [collectors, totalPayments, totalProcessedAmounts]);

  const getCustomers = async () => {
    try {
      const response = await fetch("http://localhost:3001/customers", {
        method: "GET",
      });

      const customersData = await response.json();
      const customers = customersData.map((customer) => {
        return {
          value: customer.id,
          label: customer.name + " - " + customer.account_number,
        };
      });

      setCustomers(customers);
    } catch (error) {}
  };

  const getCollectors = async () => {
    const response = await fetch("http://localhost:3001/collectors", {
      method: "GET",
    });

    const collectorsData = await response.json();
    const collectors = collectorsData.map((collector) => {
      return {
        value: collector.id,
        label: collector.collector,
      };
    });

    setCollectors(collectors);
  };

  const getServicesByCollector = async (collectorId = 0) => {
    const response = await fetch(
      `http://localhost:3001/services/services-by-collector/${collectorId}`,
      {
        method: "GET",
      }
    );

    const servicesData = await response.json();
    const services = servicesData.map((service) => {
      return {
        value: service.id,
        label: service.service_name,
        price: service.price,
      };
    });

    setServices(services);
  };

  const getServiceOnCollectorsChange = (value) => {
    form.setFieldsValue({ collector_id: value });
    getServicesByCollector(value);
  };

  const getTotalPayments = async () => {
    const response = await fetch("http://localhost:3001/payments-collectors", {
      method: "GET",
    });

    const totalPaymentsData = await response.json();
    setTotalPayments(totalPaymentsData);
  };

  const getTotalProcessedAmounts = async () => {
    const response = await fetch(
      "http://localhost:3001/payments-collectors/total-payments-amount",
      {
        method: "GET",
      }
    );

    const totalProcessedAmountsData = await response.json();
    setTotalProcessedAmounts(totalProcessedAmountsData[0].amount);
  };

  const getTransactionTypes = async () => {
    const response = await fetch("http://localhost:3001/transactions-types", {
      method: "GET",
    });

    const transactionTypesData = await response.json();
    const transactionTypes = transactionTypesData.map((transactionType) => {
      return {
        value: transactionType.id,
        label: transactionType.transaction_type,
      };
    });

    setTransactionTypes(transactionTypes);
  };

  const registerPayments = async (payment) => {
    setSendingDataLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/payments-collectors/save-new-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payment),
        }
      );

      const registeredPayment = await response.json();

      if (response.status === 200) {
        messageAlert.success(registeredPayment.message);
        form.resetFields();
        getCollectors();
        getTotalPayments();
        getTotalProcessedAmounts();
        closePaymentsModal();
      } else {
        messageAlert.error(registeredPayment.message);
      }

      setSendingDataLoading(false);
    } catch (error) {
      messageAlert.error("Error al Registrar el Pago. Intente de Nuevo");
      setSendingDataLoading(false);
    }
  };

  return (
    <Content style={{ margin: "62px 16px" }}>
      {messageContext}
      <div
        style={{
          padding: "24px 0 24px 0",
          minHeight: "90vh",
          borderRadius: borderRadiusLG,
        }}
      >
        <div className="row">
          <div className="col-11">
            <div className="row">
              <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12">
                <Card className="text-center shadow">
                  <h2 className="p-3 fw-semibold text-black">
                    {" "}
                    {collectors.length || 0}{" "}
                  </h2>
                  <div className="dashboard-blue-card">
                    <label className="fw-semibold p-2">
                      {" "}
                      Colectores Registrados{" "}
                    </label>
                  </div>
                </Card>
              </div>
              <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12">
                <Card className="text-center shadow">
                  <h2 className="p-3 fw-semibold text-black">
                    {" "}
                    {totalPayments.length || 0}{" "}
                  </h2>
                  <div className="dashboard-yellow-card">
                    <label className="fw-semibold p-2">
                      {" "}
                      Total de Pagos Realizados{" "}
                    </label>
                  </div>
                </Card>
              </div>
              <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12">
                <Card className="text-center shadow">
                  <h2 className="p-3 fw-semibold text-black">
                    {" "}
                    ${totalProcessedAmounts || 0}{" "}
                  </h2>
                  <div className="dashboard-green-card">
                    <label className="fw-semibold p-2">
                      {" "}
                      Monto Total Procesado{" "}
                    </label>
                  </div>
                </Card>
              </div>
              <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12">
                <Card
                  className="text-center shadow"
                  onClick={showNotificationsModal}
                  style={{ cursor: "pointer" }}
                >
                  <h2 className="p-3 fw-semibold text-black"> {0 || 0} </h2>
                  <div className="dashboard-red-card">
                    <label className="fw-semibold p-2"> Notificaciones </label>
                  </div>
                </Card>

                <Modal
                  title={
                    <Row align="middle">
                      {" "}
                      <Col>
                        {" "}
                        <WarningOutlined
                          className="fs-6"
                          style={{ marginRight: 8, color: "var(--yellow)" }}
                        />{" "}
                      </Col>{" "}
                      <Col>
                        <label className="fs-6">
                          Notificaciones Pendientes
                        </label>
                      </Col>{" "}
                    </Row>
                  }
                  centered
                  width={650}
                  open={openNotificationsModal}
                  onOk={closeNotificacionsModal}
                  onCancel={closeNotificacionsModal}
                  footer={null}
                >
                  <Form>
                    <Table
                      dataSource={customers}
                      columns={[]}
                      pagination={10}
                    />
                  </Form>
                </Modal>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end col-1">
            <LogoutCard />
          </div>
        </div>

        <Card className="mt-4 pt-4 shadow">
          <div className="row">
            <div className="col-md-6 col-sm-6 text-start">
              <h2 className="fw-semibold text-black ms-3 text-black">
                {" "}
                Transacciones Recientes{" "}
              </h2>
            </div>
            <div className="col-md-6 col-sm-6 text-end pe-5">
              <Button
                type="primary"
                className="fw-semibold"
                onClick={showAddCollectorModal}
              >
                {" "}
                Añadir Colector{" "}
              </Button>

              <AddCollectorModal
                openModal={isCollectorModalOpen}
                closeModal={closeAddCollectorModal}
              />

              <Button
                type="primary"
                className="fw-semibold ms-2 me-2"
                onClick={showPaymentsModal}
              >
                {" "}
                Pagar Servicio{" "}
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
                      <label className="fs-6">Pagar Servicio</label>
                    </Col>{" "}
                  </Row>
                }
                centered
                width={450}
                open={openRegisterPayment}
                onOk={closePaymentsModal}
                onCancel={closePaymentsModal}
                footer={null}
              >
                <Form form={form} onFinish={registerPayments}>
                  <Form.Item
                    name="customer_id"
                    rules={[
                      {
                        required: true,
                        message: "Por Favor, Seleccione un Cliente",
                      },
                    ]}
                  >
                    <label className="fw-semibold text-black">
                      {" "}
                      Seleccionar Cliente{" "}
                    </label>
                    <Select
                      options={customers}
                      onChange={(value) => {
                        form.setFieldsValue({ customer_id: value });
                      }}
                      showSearch
                      placeholder="Buscar Cliente"
                      optionFilterProp="label"
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      style={{
                        width: "100%",
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="collector_id"
                    rules={[
                      {
                        required: true,
                        message: "Por Favor, Seleccione un Colector",
                      },
                    ]}
                  >
                    <label className="fw-semibold text-black">
                      {" "}
                      Seleccionar Colector{" "}
                    </label>
                    <Select
                      options={collectors}
                      onChange={getServiceOnCollectorsChange}
                      showSearch
                      placeholder="Buscar Colector"
                      optionFilterProp="label"
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      style={{
                        width: "100%",
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="service_id"
                    rules={[
                      {
                        required: true,
                        message: "Por Favor, Seleccione un Servicio",
                      },
                    ]}
                  >
                    <label className="fw-semibold text-black">
                      {" "}
                      Seleccionar Servicio{" "}
                    </label>
                    <Select
                      options={services}
                      onChange={(value) => {
                        form.setFieldsValue({ service_id: value });
                      }}
                      showSearch
                      placeholder="Buscar Servicio"
                      optionFilterProp="label"
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      style={{
                        width: "100%",
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="amount"
                    rules={[
                      {
                        required: true,
                        message:
                          "Por Favor, Introduzca una Cantidad Entre $5 y $10000",
                      },
                    ]}
                  >
                    <label className="fw-semibold text-black">
                      {" "}
                      Monto a Depositar{" "}
                    </label>
                    <InputNumber
                      prefix="$"
                      min={5}
                      max={10000}
                      placeholder="0.00"
                      // value={services[0]?.price > 0 ? services[0].price : ""}
                      onChange={(value) => {
                        form.setFieldsValue({ amount: value });
                      }}
                      style={{
                        width: "100%",
                      }}
                    />
                  </Form.Item>
                  <label
                    htmlFor="dashboard-amount"
                    className="fw-semibold text-black"
                  >
                    {" "}
                    Fecha y Hora{" "}
                  </label>
                  <Form.Item>
                    <input
                      type="text"
                      className="form-control"
                      value={moment().format("DD/MM/YYYY hh:mm a")}
                      readOnly
                    />
                  </Form.Item>
                  <Form.Item className="text-end">
                    <Button
                      key="back"
                      type="primary"
                      danger
                      onClick={closePaymentsModal}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="ms-2"
                      type="primary"
                      htmlType="submit"
                      loading={sendingDataLoading}
                    >
                      Pagar
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>

              <Button type="primary" className="fw-semibold">
                {" "}
                Ver Reportes{" "}
              </Button>
            </div>
          </div>
          <div className="row ms-2 mb-4">
            <label className="fw-semibold text-black mb-1"> Filtrar por </label>
            <div className="col-xxl-4 col-lg-7 col-md-7 col-sm-12 w-auto">
              <label
                htmlFor="dashboard-date"
                className="fw-semibold text-black me-2"
              >
                {" "}
                Fecha{" "}
              </label>
              <Space wrap id="dashboard-date">
                <RangePicker
                  value={dates}
                  onChange={(dates) => setDates(dates)}
                  format="DD-MM-YYYY"
                  placeholder={["Inicio", "Fin"]}
                  style={{
                    width: 220,
                  }}
                />
                <Select
                  defaultValue="today"
                  style={{
                    width: 183,
                  }}
                  onChange={quickFilter}
                  options={[
                    {
                      value: "today",
                      label: "Hoy",
                    },
                    {
                      value: "lastWeek",
                      label: "Última Semana",
                    },
                    {
                      value: "lastMonth",
                      label: "Último Mes",
                    },
                    {
                      value: "lastQuarter",
                      label: "Últimos 3 Meses",
                    },
                    {
                      value: "lastSemester",
                      label: "Últimos 6 Meses",
                    },
                    {
                      value: "lastYear",
                      label: "Último Año",
                    },
                  ]}
                />
              </Space>
            </div>
            <div className="col-xxl-2 col-lg-2 col-md-2 col-sm-12 w-auto">
              <label htmlFor="" className="fw-semibold text-black me-2">
                {" "}
                Monto{" "}
              </label>
              <Space wrap>
                <Select
                  defaultValue="0"
                  style={{
                    width: 183,
                  }}
                  options={[
                    {
                      value: "0",
                      label: "$1 - $99",
                    },
                    {
                      value: "1",
                      label: "$100 - $499",
                    },
                    {
                      value: "2",
                      label: "$500 - $999",
                    },
                    {
                      value: "3",
                      label: "$1000 - $1999",
                    },
                    {
                      value: "4",
                      label: "$2000 - $4999",
                    },
                    {
                      value: "5",
                      label: "Mayor a $5000",
                    },
                  ]}
                />
              </Space>
            </div>
            <div className="col-xxl-2 col-lg-2 col-md-2 col-sm-12 w-auto">
              <label htmlFor="" className="fw-semibold text-black me-2">
                {" "}
                Colector{" "}
              </label>
              <Space wrap>
                <Select
                  defaultValue={1}
                  style={{
                    width: 183,
                  }}
                  options={collectors}
                />
              </Space>
            </div>
            <div className="col-xxl-2 col-lg-2 col-md-2 col-sm-12 w-auto">
              <label htmlFor="" className="fw-semibold text-black me-2">
                {" "}
                Tipo{" "}
              </label>
              <Space wrap>
                <Select
                  defaultValue={1}
                  style={{
                    width: 183,
                  }}
                  options={transactionTypes}
                />
              </Space>
            </div>
          </div>

          <div className="row mb-4 me-2 ms-2">
            <DashboardCharts />
          </div>
        </Card>
      </div>
    </Content>
  );
};

export default Dashboard;
