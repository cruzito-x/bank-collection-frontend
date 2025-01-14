import { Breadcrumb, Button, Card, Input, Layout, Table, theme } from "antd";
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React from "react";

const Approvals = () => {
  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const CollectorsDataSource = [
    {
      key: "1",
      approvalCode: "1234567890",
      transactionCode: "0987654321",
      authorizedBy: "David Cruz",
      datetime: "2025-01-02 a las 10:30 am",
      actions: (
        <>
          <Button type="primary"> Detalles </Button>
        </>
      ),
    },
  ];

  const CollectorsDataColumns = [
    {
      title: "Código de Aprobación",
      dataIndex: "approvalCode",
      key: "approvalCode",
      align: "center",
    },
    {
      title: "Código de Transacción Asociada",
      dataIndex: "transactionCode",
      key: "transactionCode",
      align: "center",
    },
    {
      title: "Autorizado por",
      dataIndex: "authorizedBy",
      key: "authorizedBy",
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
                  <CheckCircleOutlined />
                  <span>Aprobaciones</span>
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
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <label className="me-2 fw-semibold">
                {" "}
                Código de Transacción{" "}
              </label>
              <Input
                placeholder="00001"
                prefix={<InfoCircleOutlined />}
                style={{
                  width: 183,
                }}
              />
            </div>
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <label className="me-2 fw-semibold"> Nombre </label>
              <Input
                placeholder="Nombre de Usuario"
                prefix={<UserOutlined />}
                style={{
                  width: 183,
                }}
              />
            </div>
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <Button type="primary"> Buscar </Button>
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

export default Approvals;
