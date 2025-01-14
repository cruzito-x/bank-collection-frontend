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
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import "./styles/dashboard.css";
import DashboardCharts from "./charts/DashboardCharts";
import moment from "moment";
import LogoutCard from "../../utils/logoutCard/LogoutCard";

const Dashboard = ({ rangeFilter = () => {} }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
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

  const showPaymentsModal = () => {
    setOpen(true);
  };
  const hidePaymentsModal = () => {
    setOpen(false);
  };

  const registerPayments = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  return (
    <Content style={{ margin: "60px 16px" }}>
      <div
        style={{
          padding: 10,
          minHeight: "90vh",
          background: "none",
          borderRadius: borderRadiusLG,
        }}
      >
        <div className="row">
          <div className="col-11">
            <div className="row">
              <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12">
                <Card className="text-center shadow">
                  <h2 className="p-3 fw-semibold text-black"> 5 </h2>
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
                  <h2 className="p-3 fw-semibold text-black">250</h2>
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
                  <h2 className="p-3 fw-semibold text-black"> $1136 </h2>
                  <div className="dashboard-green-card">
                    <label className="fw-semibold p-2">
                      {" "}
                      Monto Total Procesado{" "}
                    </label>
                  </div>
                </Card>
              </div>
              <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12">
                <Card className="text-center shadow">
                  <h2 className="p-3 fw-semibold text-black">1</h2>
                  <div className="dashboard-red-card">
                    <label className="fw-semibold p-2"> Notificaciones </label>
                  </div>
                </Card>
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
              <h2 className="fw-semibold ms-3 text-black">
                {" "}
                Transacciones Recientes{" "}
              </h2>
            </div>
            <div className="col-md-6 col-sm-6 text-end pe-5">
              <Button type="primary" className="fw-semibold">
                {" "}
                Añadir Colector{" "}
              </Button>
              <Button
                type="primary"
                className="fw-semibold ms-2 me-2"
                onClick={showPaymentsModal}
              >
                {" "}
                Registrar Pago{" "}
              </Button>

              <Modal
                title={
                  <Row align="middle">
                    {" "}
                    <Col>
                      {" "}
                      <InfoCircleOutlined
                        className="fs-6"
                        style={{ marginRight: 8, color: "#007bff" }}
                      />{" "}
                    </Col>{" "}
                    <Col>
                      <label className="fs-6">Registrar Pago</label>
                    </Col>{" "}
                  </Row>
                }
                open={open}
                onOk={hidePaymentsModal}
                onCancel={hidePaymentsModal}
                footer={[
                  <Button
                    key="back"
                    type="primary"
                    danger
                    onClick={hidePaymentsModal}
                  >
                    Cancelar
                  </Button>,
                  <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={registerPayments}
                  >
                    Registrar Pago
                  </Button>,
                ]}
              >
                <div className="row mt-4">
                  <div className="col-12 mb-3">
                    <label
                      htmlFor="dashboard-customer-name"
                      className="fw-semibold text-black"
                    >
                      {" "}
                      Seleccionar Cliente{" "}
                    </label>
                    <Select
                      defaultValue="0"
                      id="dashboard-customer-name"
                      options={[
                        {
                          value: "0",
                          label: "Nombre Cliente - 0000 0000 0000 0000",
                        },
                      ]}
                      style={{
                        width: "100%",
                      }}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label
                      htmlFor="dashboard-collector-name"
                      className="fw-semibold text-black"
                    >
                      {" "}
                      Seleccionar Colector{" "}
                    </label>
                    <Select
                      defaultValue="0"
                      id="dashboard-collector-name"
                      options={[
                        {
                          value: "0",
                          label: "Nombre Colector",
                        },
                      ]}
                      style={{
                        width: "100%",
                      }}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label
                      htmlFor="dashboard-amount"
                      className="fw-semibold text-black"
                    >
                      {" "}
                      Monto a Depositar{" "}
                    </label>
                    <InputNumber
                      prefix="$"
                      min={5}
                      max={10000}
                      style={{
                        width: "100%",
                      }}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label
                      htmlFor="dashboard-amount"
                      className="fw-semibold text-black"
                    >
                      {" "}
                      Fecha y Hora{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="date-hour"
                      value={moment().format("DD/MM/YYYY HH:mm")}
                      disabled
                    />
                  </div>
                </div>
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
                    width: 160,
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
                  defaultValue="0"
                  style={{
                    width: 183,
                  }}
                  options={[
                    {
                      value: "0",
                      label: "Todos",
                    },
                    {
                      value: "1",
                      label: "Servicio de Agua",
                    },
                    {
                      value: "2",
                      label: "Servicio de Luz",
                    },
                    {
                      value: "3",
                      label: "Servicio de Internet",
                    },
                    {
                      value: "4",
                      label: "Universidad",
                    },
                  ]}
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
                  defaultValue="0"
                  style={{
                    width: 183,
                  }}
                  options={[
                    {
                      value: "0",
                      label: "Depositos",
                    },
                    {
                      value: "1",
                      label: "Retiros",
                    },
                  ]}
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
