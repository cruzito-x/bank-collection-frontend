import {
  Breadcrumb,
  Button,
  Card,
  Input,
  Layout,
  message,
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
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext/AuthContext";

const Customers = () => {
  const { authState } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageAlert, messageContext] = message.useMessage();
  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    getCustomers();
  }, []);

  const getCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/customers", {
        method: "GET",
      });

      const customersData = await response.json();
      const customersRow = customersData.map((customer) => ({
        ...customer,
        balance: "$" + customer.balance,
        actions: (
          <>
            <Button
              className="edit-btn"
              type="primary"
              style={{
                backgroundColor: "var(--yellow)",
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
      }));

      setCustomers(customersRow);
      setLoading(false);
    } catch (error) {
      messageAlert.error("Error al Obtener los Datos de Clientes");
    }
  };

  const customersTableColumns = [
    {
      title: "Código de Cliente",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Nombre de Cliente",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Documento de Identidad",
      dataIndex: "identity_doc",
      key: "identity_doc",
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
      dataIndex: "account_number",
      key: "account_number",
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
      width: "33%",
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
                  <span> {authState.username} </span>
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
              <label className="fw-semibold text-black"> Buscar Por </label>
            </div>
          </div>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <label className="me-2 fw-semibold text-black"> Nombre </label>
              <Input
                placeholder="Nombre de Cliente"
                prefix={<UserOutlined />}
                style={{
                  width: 183,
                }}
              />
            </div>
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <label className="me-2 fw-semibold text-black">
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
              <label className="me-2 fw-semibold text-black"> Saldo</label>
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
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-12">
              <Table
                dataSource={customers}
                columns={customersTableColumns}
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Total: ${total} cliente(s)`,
                  hideOnSinglePage: true,
                }}
                scroll={{ y: 517 }}
              />
            </div>
          </div>
        </Card>
      </div>
    </Content>
  );
};

export default Customers;
