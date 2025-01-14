import {
  Breadcrumb,
  Button,
  Card,
  Input,
  Layout,
  Select,
  Table,
  theme,
} from "antd";
import {
  DollarOutlined,
  IdcardOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React from "react";

const Customers = () => {
  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const customersDataSource = [
    {
      key: "1",
      id: "1234567890",
      customer: "John Doe",
      idDocument: "1234567890",
      email: "johndoe@example.com",
      accountNumber: "1234567890",
      balance: "$10000",
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

  const customersDataColumns = [
    {
      title: "Código de Cliente",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Nombre de Cliente",
      dataIndex: "customer",
      key: "customer",
      align: "center",
    },
    {
      title: "Documento de Identidad",
      dataIndex: "idDocument",
      key: "idDocument",
      align: "center",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Nº de Cuenta",
      dataIndex: "accountNumber",
      key: "accountNumber",
      align: "center",
    },
    {
      title: "Saldo",
      dataIndex: "balance",
      key: "balance",
      align: "center",
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      align: "center",
      width: '32%',
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
                  <TeamOutlined />
                  <span>Clientes</span>
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
                placeholder="Nombre de Cliente"
                prefix={<UserOutlined />}
                style={{
                  width: 183,
                }}
              />
            </div>
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <label className="me-2 fw-semibold">
                {" "}
                Documento de Identidad{" "}
              </label>
              <Input
                placeholder="00000000-0"
                prefix={<IdcardOutlined />}
                style={{
                  width: 183,
                }}
              />
            </div>
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <label className="me-2 fw-semibold">
                {" "}
                Saldo
              </label>
              <Select
                defaultValue={0}
                options={[
                  { value: 0, label: "Mayor a Menor" },
                  { value: 1, label: "Menor a Mayor" },
                ]}
                prefix={<DollarOutlined />}
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
                dataSource={customersDataSource}
                columns={customersDataColumns}
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Total: ${total} cliente(s)`,
                  hideOnSinglePage: true
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    </Content>
  );
};

export default Customers;
