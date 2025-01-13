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
    },
  ];

  return (
    <Content style={{ margin: "31px 16px" }}>
      <div
        style={{
          padding: 24,
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
              <label htmlFor="" className="fw-semibold">
                {" "}
                Buscar Por{" "}
              </label>
            </div>
          </div>
          <div className="row ms-1 mb-3 pe-3">
            <div className="col-md-3 col-sm-12">
              <label htmlFor="" className="fw-semibold">
                {" "}
                Nombre{" "}
              </label>
              <Input
                className="ms-2"
                placeholder="Nombre de Cliente"
                prefix={<UserOutlined />}
                style={{
                  width: "285px",
                }}
              />
            </div>
            <div className="col-md-3 col-sm-12">
              <label htmlFor="" className="fw-semibold">
                {" "}
                Documento{" "}
              </label>
              <Input
                className="ms-2"
                placeholder="Documento de Identidad"
                prefix={<IdcardOutlined />}
                style={{
                  width: "285px",
                }}
              />
            </div>
            <div className="col-md-3 col-sm-12">
              <label htmlFor="" className="fw-semibold">
                {" "}
                Balance
              </label>
              <Select
              className="ms-2"
                defaultValue={0}
                options={[
                  { value: 0, label: "Mayor a Menor" },
                  { value: 1, label: "Menor a Mayor" },
                ]}
                prefix={<DollarOutlined />}
                style={{
                  width: "285px",
                }}
              />
            </div>
            <div className="col-md-3 col-sm-12">
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
                  pageSizeOptions: ["5", "10", "20", "50"],
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
