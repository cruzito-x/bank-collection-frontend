import { Button, Card, Layout, Select, Space, theme } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import "./styles/dashboard.css";
import DashboardCharts from "./charts/DashboardCharts";

const Dashboard = () => {
  const { Content } = Layout;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <Content style={{ margin: "60px 16px" }}>
      <div
        style={{
          padding: 24,
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
            <Card className="text-center user-card ms-5 shadow">
              <UserOutlined className="fs-1 p-2" />
              <div className="dashboard-user-card mt-2">
                <h6 className="mt-2" style={{ fontSize: "14px" }}>
                  {" "}
                  David Cruz{" "}
                </h6>
              </div>
            </Card>
          </div>
        </div>

        <Card className="mt-5 pt-4 shadow">
          <div className="row mb-4">
            <div className="col-md-8 col-sm-12 text-start">
              <h2 className="fw-semibold ms-4 text-black">
                {" "}
                Transacciones Recientes{" "}
              </h2>
            </div>
            <div className="col-md-4 col-sm-12 text-end pe-5">
              <Button type="primary"> Añadir Colector </Button>
              <Button type="primary" className="ms-2 me-2">
                {" "}
                Registrar Pago{" "}
              </Button>
              <Button type="primary"> Ver Reportes </Button>
            </div>
          </div>
          <div className="row ms-2">
            <div className="col-12 text-start">
              <label htmlFor="" className="fw-semibold text-black">
                {" "}
                Ordenar por{" "}
              </label>
              <div className="row mb-4">
                <div className="col-md-4 col-sm-12">
                  <label
                    htmlFor="dashboard-year"
                    className="fw-semibold text-black"
                  >
                    {" "}
                    Año{" "}
                  </label>
                  <Space wrap>
                    <Select
                      className="ms-2"
                      defaultValue="0"
                      style={{
                        width: 240,
                      }}
                      onChange={handleChange}
                      options={[
                        {
                          value: "0",
                          label: "2025",
                        },
                        {
                          value: "1",
                          label: "2024",
                        },
                        {
                          value: "2",
                          label: "2023",
                        },
                        {
                          value: "3",
                          label: "2022",
                        },
                        {
                          value: "4",
                          label: "2021",
                        },
                        {
                          value: "5",
                          label: "2020",
                        },
                      ]}
                    />
                  </Space>
                </div>
                <div className="col-md-4 col-sm-12">
                  <label htmlFor="" className="fw-semibold text-black">
                    {" "}
                    Monto{" "}
                  </label>
                  <Space wrap>
                    <Select
                      className="ms-2"
                      defaultValue="0"
                      style={{
                        width: 240,
                      }}
                      onChange={handleChange}
                      options={[
                        {
                          value: "0",
                          label: "$1 - $99",
                        },
                        {
                          value: "1",
                          label: "$100 - $500",
                        },
                        {
                          value: "2",
                          label: "$501 - $999",
                        },
                        {
                          value: "3",
                          label: "$1000 - $2000",
                        },
                        {
                          value: "4",
                          label: "$2001 - $4999",
                        },
                        {
                          value: "5",
                          label: "Mayor a $5000",
                        },
                      ]}
                    />
                  </Space>
                </div>
                <div className="col-md-4 col-sm-12">
                  <label htmlFor="" className="fw-semibold text-black">
                    {" "}
                    Colector{" "}
                  </label>
                  <Space wrap>
                    <Select
                      className="ms-2"
                      defaultValue="0"
                      style={{
                        width: 240,
                      }}
                      onChange={handleChange}
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
              </div>
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
