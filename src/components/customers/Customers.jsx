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
      codigoDeCliente: "1234567890",
      nombreDeCliente: "John Doe",
      documentoDeIdentidad: "1234567890",
      emailDeCliente: "johndoe@example.com",
      numeroDeCuenta: "1234567890",
      saldoDeCuenta: 10000,
      accionesParaCliente: (
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

  const customersDataColumns = [
    {
      title: "Código de Cliente",
      dataIndex: "codigoDeCliente",
      key: "codigoCliente",
      align: "center",
    },
    {
      title: "Nombre de Cliente",
      dataIndex: "nombreDeCliente",
      key: "nombreCliente",
      align: "center",
    },
    {
      title: "Documento de Identidad",
      dataIndex: "documentoDeIdentidad",
      key: "documentoIdentidad",
      align: "center",
    },
    {
      title: "E-mail",
      dataIndex: "emailDeCliente",
      key: "emailCliente",
      align: "center",
    },
    {
      title: "Nº de Cuenta",
      dataIndex: "numeroDeCuenta",
      key: "numeroCuenta",
      align: "center",
    },
    {
      title: "Saldo",
      dataIndex: "saldoDeCuenta",
      key: "saldoCuenta",
      align: "center",
    },
    {
      title: "Acciones",
      dataIndex: "accionesParaCliente",
      key: "accionesCliente",
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
          </div>
        </Card>
      </div>
    </Content>
  );
};

export default Customers;
