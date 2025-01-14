import {
  Breadcrumb,
  Button,
  Card,
  Input,
  Layout,
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
  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const CollectorsPaymentsDataSource = [
    {
      key: "1",
      customer: "Jhon Doe",
      collector: "Universidad - UTEC",
      amountPaid: "$143",
      paymentDate: "2025-01-02",
      actionsToCollectorPayments: (
        <>
          <Button
            className="edit-btn"
            type="primary"
            style={{
              backgroundColor: "#ffac00",
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
      dataIndex: "amountPaid",
      key: "amountPaid",
      align: "center",
    },
    {
      title: "Fecha de Pago",
      dataIndex: "paymentDate",
      key: "paymentDate",
      align: "center",
    },
    {
      title: "Acciones",
      dataIndex: "actionsToCollectorPayments",
      key: "collectorPaymentsActions",
      align: "center",
    },
  ];

  return (
    <Content style={{ margin: "31px 16px" }}>
      <div
        style={{
          paddingTop: 24,
          minHeight: "85vh",
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
              <label className="fw-semibold">
                {" "}
                Buscar Por{" "}
              </label>
            </div>
          </div>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <label className="me-2 fw-semibold">
                {" "}
                Nombre{" "}
              </label>
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
                  showSizeChanger: true,
                  showTotal: (total) => `Total: ${total} cliente(s)`,
                  showQuickJumper: true,
                  onShowSizeChange: (current, size) => {
                    console.log(current, size);
                  },
                  onChange: (current, pageSize) => {
                    console.log(current, pageSize);
                  },
                }}
              />
            </div>
            <div className="col-md-4 col-sm-12">
              <CollectorsPaymentsChart />
            </div>
          </div>
        </Card>
      </div>
    </Content>
  );
};

export default CollectorsPayments;
