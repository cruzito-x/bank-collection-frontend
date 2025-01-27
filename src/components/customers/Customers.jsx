import {
  Breadcrumb,
  Button,
  Card,
  Form,
  Input,
  Layout,
  message,
  Popconfirm,
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
import EditCustomerModal from "../../utils/modals/customers/EditCustomerModal";
import { useForm } from "antd/es/form/Form";
import TransactionsModal from "../../utils/modals/customers/TransactionsModal";

const Customers = () => {
  const { authState } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [messageAlert, messageContext] = message.useMessage();
  const { Content } = Layout;
  const [form] = useForm();
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    getCustomers();
  }, []);

  const deleteCustomer = async (customer) => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/customers/delete-customer/${customer.id}`,
        {
          method: "PUT",
        }
      );

      const deletedCustomer = await response.json();

      if (response.status === 200) {
        messageAlert.success(deletedCustomer.message);
        setCustomers(
          customers.filter((customer) => customer.id !== deletedCustomer.id)
        );
      } else {
        messageAlert.error("Error al Eliminar Cliente");
      }
    } catch (error) {
      messageAlert.error("Error al Eliminar Cliente");
    }
  };

  const showEditCustomerModal = () => {
    setIsCustomerModalOpen(true);
  };

  const showTransactionsModal = () => {
    setIsTransactionsModalOpen(true);
  };

  const getCustomers = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/customers", {
        method: "GET",
      });

      const customersData = await response.json();
      const customers = customersData.map((customer) => ({
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
              onClick={showEditCustomerModal}
            >
              Editar
            </Button>
            <Popconfirm
              title="Eliminar Registro"
              description="¿Está Seguro de Eliminar este Registro?"
              onConfirm={() => deleteCustomer(customer)}
              onCancel={() => {}}
              okText="Sí"
              cancelText="No"
              okButtonProps={{
                loading: loading,
              }}
            >
              <Button className="ms-2 me-2" type="primary" danger>
                Eliminar
              </Button>
            </Popconfirm>
            <Button type="primary" onClick={showTransactionsModal}>
              {" "}
              Transacciones{" "}
            </Button>
          </>
        ),
      }));

      setCustomers(customers);
      setLoading(false);
    } catch (error) {
      messageAlert.error("Error al Obtener los Datos de Clientes");
    }
  };

  const searchCustomers = async (customer) => {
    setLoading(true);

    console.log(customer);

    try {
      const response = await fetch(
        `http://localhost:3001/customers/search-customer?name=${customer.name}&identity_doc=${customer.identity_doc}&balance=${balance}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const customersData = await response.json();
      const customers = customersData.map((customer) => ({
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
              onClick={showEditCustomerModal}
            >
              Editar
            </Button>
            <Popconfirm
              title="Eliminar Registro"
              description="¿Está Seguro de Eliminar este Registro?"
              onConfirm={() => deleteCustomer(customer)}
              onCancel={() => {}}
              okText="Sí"
              cancelText="No"
              okButtonProps={{
                loading: loading,
              }}
            >
              <Button className="ms-2 me-2" type="primary" danger>
                Eliminar
              </Button>
            </Popconfirm>
            <Button type="primary" onClick={showTransactionsModal}>
              {" "}
              Transacciones{" "}
            </Button>
          </>
        ),
      }));

      setCustomers(customers);
      setLoading(false);
    } catch (error) {
      messageAlert.error("Error al Obtener los Datos de Clientes");
      setLoading(false);
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
          height: "90vh",
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
            <Form layout="inline" form={form} onFinish={searchCustomers}>
              <label className="me-2 fw-semibold text-black d-flex align-items-center">
                {" "}
                Nombre{" "}
              </label>
              <Form.Item
                className="col-xxl-3 col-xl-4 col-sm-12 w-auto"
                name="name"
              >
                <Input
                  placeholder="Nombre de Cliente"
                  prefix={<UserOutlined />}
                  style={{
                    width: 183,
                  }}
                />
              </Form.Item>
              <label className="me-2 fw-semibold text-black d-flex align-items-center">
                {" "}
                Documento de Identidad{" "}
              </label>
              <Form.Item
                className="col-xxl-3 col-xl-4 col-sm-12 w-auto"
                name="identity_doc"
              >
                <Input
                  placeholder="00000000-0"
                  prefix={<IdcardOutlined />}
                  style={{
                    width: 183,
                  }}
                />
              </Form.Item>
              <label className="me-2 fw-semibold text-black d-flex align-items-center">
                {" "}
                Saldo
              </label>
              <Form.Item
                className="col-xxl-3 col-xl-4 col-sm-12 w-auto"
                name="balance"
              >
                <Select
                  onChange={(value) => setBalance(value)}
                  options={[
                    { value: 0, label: "Mayor a Menor" },
                    { value: 1, label: "Menor a Mayor" },
                  ]}
                  prefix={<DollarOutlined />}
                  style={{
                    width: 183,
                  }}
                />
              </Form.Item>
              <Form.Item className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
                <Button type="primary" htmlType="submit">
                  {" "}
                  Buscar{" "}
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-12">
              <Table
                dataSource={customers}
                columns={customersTableColumns}
                loading={loading}
                onRow={(record) => ({
                  onClick: () => setSelectedCustomer(record),
                })}
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Total: ${total} cliente(s)`,
                  hideOnSinglePage: true,
                }}
              />
            </div>
          </div>
        </Card>
        <EditCustomerModal
          isOpen={isCustomerModalOpen}
          isClosed={() => setIsCustomerModalOpen(false)}
          customerData={selectedCustomer}
          setAlertMessage={messageAlert}
        />

        <TransactionsModal
          isOpen={isTransactionsModalOpen}
          isClosed={() => setIsTransactionsModalOpen(false)}
          customerData={selectedCustomer}
          setAlertMessage={messageAlert}
        />
      </div>
    </Content>
  );
};

export default Customers;
