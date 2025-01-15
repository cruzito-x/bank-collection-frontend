import {
  Breadcrumb,
  Button,
  Card,
  Input,
  Layout,
  message,
  Modal,
  Table,
  theme,
} from "antd";
import {
  SolutionOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import React from "react";
import CollectorsPaymentsChart from "./charts/CollectorsPaymentsChart";

const CollectorsPayments = () => {
  const [messageAlert, messageContext] = message.useMessage();
  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const CollectorsPaymentsDataSource = [
    {
      key: "1",
      customer: "Jhon Doe",
      collector: "Universidad - UTEC",
      amount: "$143",
      datetime: "2025-01-02",
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
    },
    {
      key: "1",
      customer: "Jhon Doe",
      collector: "Universidad - UTEC",
      amount: "$143",
      datetime: "2025-01-02",
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
    },
    {
      key: "1",
      customer: "Jhon Doe",
      collector: "Universidad - UTEC",
      amount: "$143",
      datetime: "2025-01-02",
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
    },
    {
      key: "1",
      customer: "Jhon Doe",
      collector: "Universidad - UTEC",
      amount: "$143",
      datetime: "2025-01-02",
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
    },
    {
      key: "1",
      customer: "Jhon Doe",
      collector: "Universidad - UTEC",
      amount: "$143",
      datetime: "2025-01-02",
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
    },
    {
      key: "1",
      customer: "Jhon Doe",
      collector: "Universidad - UTEC",
      amount: "$143",
      datetime: "2025-01-02",
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
    },
    {
      key: "1",
      customer: "Jhon Doe",
      collector: "Universidad - UTEC",
      amount: "$143",
      datetime: "2025-01-02",
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
    },
    {
      key: "1",
      customer: "Jhon Doe",
      collector: "Universidad - UTEC",
      amount: "$143",
      datetime: "2025-01-02",
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
    },
    {
      key: "1",
      customer: "Jhon Doe",
      collector: "Universidad - UTEC",
      amount: "$143",
      datetime: "2025-01-02",
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
    },
    {
      key: "1",
      customer: "Jhon Doe",
      collector: "Universidad - UTEC",
      amount: "$143",
      datetime: "2025-01-02",
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
    },
    {
      key: "1",
      customer: "Jhon Doe",
      collector: "Universidad - UTEC",
      amount: "$143",
      datetime: "2025-01-02",
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
    },
  ];

  const CollectorsPaymentsDataColumns = [
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
      title: "Fecha de Pago",
      dataIndex: "datetime",
      key: "datetime",
      align: "center",
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      align: "center",
      width: "32%",
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
                  <UserOutlined />
                  <span>Usuario</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <WalletOutlined />
                  <span>Pagos a Colectores</span>
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
          </div>
          <div className="row ms-1 mb-3 pe-3">
            <div className="col-md-8 col-sm-12">
              <Table
                dataSource={CollectorsPaymentsDataSource}
                columns={CollectorsPaymentsDataColumns}
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Total: ${total} pago(s) registrado(s)`,
                  hideOnSinglePage: true,
                }}
                scroll={{ y: 545 }}
              />
            </div>
            <div className="col-md-4 col-sm-12 d-flex align-items-center">
              <CollectorsPaymentsChart />
            </div>
          </div>
        </Card>
      </div>
    </Content>
  );
};

export default CollectorsPayments;
