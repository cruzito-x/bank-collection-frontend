import { Button, Card, Layout, Select, Space, DatePicker, theme } from "antd";
import React, { useState } from "react";
import "./styles/dashboard.css";
import DashboardCharts from "./charts/DashboardCharts";
import moment from "moment";
import LogoutCard from "../../utils/logoutCard/LogoutCard";

const Dashboard = ({ rangeFilter = () => {} }) => {
  const { Content } = Layout;
  const { RangePicker } = DatePicker;

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const [dates, setDates] = useState([]);

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
      default:
        range = [];
    }
    setDates(range);
    rangeFilter(range);
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
        <div className="d-flex">
          <div className="w-100">
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12">
                <Card className="text-center shadow">
                  <h1 className="p-3 fw-semibold text-black"> 5 </h1>
                  <div className="dashboard-blue-card">
                    <h6 className="p-2"> Colectores Registrados </h6>
                  </div>
                </Card>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12">
                <Card className="text-center shadow">
                  <h1 className="p-3 fw-semibold text-black">250</h1>
                  <div className="dashboard-yellow-card">
                    <h6 className="p-2"> Total de Pagos Realizados </h6>
                  </div>
                </Card>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12">
                <Card className="text-center shadow">
                  <h1 className="p-3 fw-semibold text-black"> $1136 </h1>
                  <div className="dashboard-green-card">
                    <h6 className="p-2"> Monto Total Procesado </h6>
                  </div>
                </Card>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12">
                <Card className="text-center shadow">
                  <h1 className="p-3 fw-semibold text-black">1</h1>
                  <div className="dashboard-red-card">
                    <h6 className="p-2"> Notificaciones </h6>
                  </div>
                </Card>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end">
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
              <Button type="primary" className="fw-semibold ms-2 me-2">
                {" "}
                Registrar Pago{" "}
              </Button>
              <Button type="primary" className="fw-semibold">
                {" "}
                Ver Reportes{" "}
              </Button>
            </div>
          </div>
          <div className="row ms-2 mb-4">
            <label className="fw-semibold text-black mb-1"> Filtrar por </label>
            <div className="col-md-5 col-sm-12">
              <label
                htmlFor="dashboard-year"
                className="fw-semibold text-black"
              >
                {" "}
                Fecha{" "}
              </label>
              <Space wrap>
                <RangePicker
                  className="ms-2"
                  value={dates}
                  onChange={(dates) => setDates(dates)}
                  format="DD-MM-YYYY"
                  placeholder={["Inicio", "Fin"]}
                  style={{
                    width: 220,
                  }}
                />
                <Button
                  className="fw-semibold"
                  type="primary"
                  onClick={() => quickFilter("today")}
                >
                  Hoy
                </Button>
                <Button
                  className="fw-semibold"
                  type="primary"
                  onClick={() => quickFilter("lastWeek")}
                >
                  Última Semana
                </Button>
                <Button
                  className="fw-semibold"
                  type="primary"
                  onClick={() => quickFilter("lastMonth")}
                >
                  Último Mes
                </Button>
              </Space>
            </div>
            <div className="col-md-2 col-sm-12">
              <label htmlFor="" className="fw-semibold text-black">
                {" "}
                Monto{" "}
              </label>
              <Space wrap>
                <Select
                  className="ms-2"
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
            <div className="col-md-2 col-sm-12">
              <label htmlFor="" className="fw-semibold text-black">
                {" "}
                Colector{" "}
              </label>
              <Space wrap>
                <Select
                  className="ms-2"
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
            <div className="col-md-2 col-sm-12">
              <label htmlFor="" className="fw-semibold text-black">
                {" "}
                Tipo{" "}
              </label>
              <Space wrap>
                <Select
                  className="ms-2"
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
