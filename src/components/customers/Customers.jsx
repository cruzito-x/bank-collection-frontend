import {
  Breadcrumb,
  Button,
  Card,
  Form,
  Input,
  Layout,
  message,
  Popconfirm,
  Table,
  theme,
} from "antd";
import {
  BankOutlined,
  IdcardOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import EditCustomerModal from "../../utils/modals/customers/EditCustomerModal";
import { useForm } from "antd/es/form/Form";
import AccountsByCustomerModal from "../../utils/modals/customers/AccountsByCustomerModal";
import { useAuth } from "../../contexts/authContext/AuthContext";
import EmptyData from "../../utils/emptyData/EmptyData";
import {
  applyMaskIdentityDoc,
  applyMaskOnlyLetters,
} from "../../utils/masks/InputMasks";

const Customers = () => {
  const { authState } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCustomerEditModalOpen, setIsCustomerEditModalOpen] = useState(false);
  const [isAccountsByCustomerModalOpen, setIsAccountsByCustomerModalOpen] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const customerRef = useRef(null);
  const inputDUIRef = useRef(null);
  const [messageAlert, messageContext] = message.useMessage();
  const { Content } = Layout;
  const [form] = useForm();
  const token = authState.token;
  const user_id = authState.user_id;

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    document.title = "Banco Bambú | Clientes";
    getCustomers();
  }, []);

  useEffect(() => {
    if (inputDUIRef.current?.input) {
      applyMaskIdentityDoc(inputDUIRef.current.input);

      inputDUIRef.current.input.addEventListener("input", (event) => {
        form.setFieldsValue({ identity_doc: event.target.value });
      });
    }

    if (customerRef.current?.input) {
      applyMaskOnlyLetters(customerRef.current.input);

      customerRef.current.input.addEventListener("input", (event) => {
        form.setFieldsValue({ name: event.target.value });
      });
    }
  }, []);

  function hideIdentityDoc(identity_doc) {
    let identity_doc_numbers = identity_doc.split("-");
    if (identity_doc_numbers.length !== 2) return identity_doc;
    return "*".repeat(identity_doc_numbers[0].length) + "-*";
  }

  const getCustomers = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/customers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const customersData = await response.json();

      if (response.status === 200) {
        const customers = customersData.map((customer) => ({
          ...customer,
          identity_doc: hideIdentityDoc(customer.identity_doc),
          balance: "$" + customer.balance,
          actions: (
            <>
              <Button
                className="ant-btn-edit"
                type="primary"
                onClick={() => setIsCustomerEditModalOpen(true)}
              >
                Editar
              </Button>
              <Popconfirm
                title="Eliminar Cliente"
                description="¿Está Seguro de Eliminar este Registro?"
                onConfirm={() => deleteCustomer(customer)}
                okText="Sí"
                cancelText="No"
              >
                <Button className="ms-2 me-2" type="primary" danger>
                  Eliminar
                </Button>
              </Popconfirm>
              <Button
                type="primary"
                onClick={() => setIsAccountsByCustomerModalOpen(true)}
              >
                {" "}
                Ver Cuentas{" "}
              </Button>
            </>
          ),
        }));

        setCustomers(customers);
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authState");
        window.location.href = "/";
        return;
      } else {
        messageAlert.error(customersData.message);
      }
    } catch (error) {
      messageAlert.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (customer) => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/customers/delete-customer/${customer.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        }
      );

      const deletedCustomer = await response.json();

      if (response.status === 200) {
        messageAlert.success(deletedCustomer.message);
        getCustomers();
        setLoading(false);
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authState");
        window.location.href = "/";
        return;
      } else {
        messageAlert.error(deletedCustomer.message);
        getCustomers();
        setLoading(false);
      }
    } catch (error) {
      messageAlert.error("Error al Eliminar Cliente");
      setLoading(false);
    }
  };

  const searchCustomers = async (customer) => {
    if (
      (customer.name === undefined || customer.name === "") &&
      (customer.identity_doc === undefined || customer.identity_doc === "")
    ) {
      messageAlert.warning(
        "Por Favor, Introduzca al Menos un Criterio de Búsqueda"
      );
      getCustomers();
      return;
    } else {
      setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:3001/customers/search-customer?name=${
            customer.name ?? ""
          }&identity_doc=${customer.identity_doc ?? ""}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const customersData = await response.json();

        if (response.status === 200) {
          const customers = customersData.map((customer) => ({
            ...customer,
            identity_doc: hideIdentityDoc(customer.identity_doc),
            balance: "$" + customer.balance,
            actions: (
              <>
                <Button
                  className="ant-btn-edit"
                  type="primary"
                  onClick={() => setIsCustomerEditModalOpen(true)}
                >
                  Editar
                </Button>
                <Popconfirm
                  title="Eliminar Cliente"
                  description="¿Está Seguro de Eliminar este Registro?"
                  onConfirm={() => deleteCustomer(customer)}
                  okText="Sí"
                  cancelText="No"
                >
                  <Button className="ms-2 me-2" type="primary" danger>
                    Eliminar
                  </Button>
                </Popconfirm>
                <Button
                  type="primary"
                  onClick={() => setIsAccountsByCustomerModalOpen(true)}
                >
                  {" "}
                  Ver Cuentas{" "}
                </Button>
              </>
            ),
          }));

          setCustomers(customers);
        } else if (response.status === 400) {
          messageAlert.warning(customersData.message);
        } else if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("authState");
          window.location.href = "/";
          return;
        } else {
          messageAlert.error(customersData.message);
        }
      } catch (error) {
        messageAlert.error(
          "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
        );
      } finally {
        setLoading(false);
      }
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
      title: "Documento Único de Identidad",
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
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      align: "center",
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
                  <BankOutlined />
                  <span> Banco Bambú </span>
                </>
              ),
            },
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
          <div className="row ms-2 pt-3 pe-3 mb-2">
            <div className="col-12 text-start">
              <label className="fw-semibold text-black"> Buscar Por </label>
            </div>
          </div>
          <Form
            className="row ms-2 pe-3 align-items-center"
            layout="inline"
            form={form}
            onFinish={searchCustomers}
          >
            <div className="col-xxl-2 col-xl-3 col-md-2 col-sm-12 mb-3 d-flex align-items-center w-auto">
              <label className="me-2 fw-semibold text-black"> Nombre </label>
              <Form.Item name="name" initialValue="">
                <Input
                  ref={customerRef}
                  placeholder="Nombre de Cliente"
                  prefix={<UserOutlined />}
                  style={{
                    width: 183,
                  }}
                />
              </Form.Item>
            </div>
            <div className="col-xxl-2 col-xl-3 col-md-2 col-sm-12 mb-3 d-flex align-items-center">
              <label className="me-2 fw-semibold text-black"> DUI </label>
              <Form.Item name="identity_doc" initialValue="">
                <Input
                  ref={inputDUIRef}
                  maxLength={10}
                  placeholder="00000000-0"
                  prefix={<IdcardOutlined />}
                  style={{
                    width: 183,
                  }}
                />
              </Form.Item>
            </div>
            <div className="col-xxl-2 col-xl-3 col-md-12 col-sm-12 mb-3 d-lg-flex d-sm-block align-items-center w-sm-100">
              <Form.Item>
                <Button className="w-100" type="primary" htmlType="submit">
                  {" "}
                  Buscar{" "}
                </Button>
              </Form.Item>
            </div>
          </Form>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-12">
              {customers.length === 0 ? (
                <EmptyData />
              ) : (
                <Table
                  dataSource={customers}
                  columns={customersTableColumns}
                  onRow={(record) => ({
                    onClick: () => setSelectedCustomer(record),
                  })}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: false,
                    showTotal: (total) =>
                      `Total: ${total} cliente(s) registrado(s)`,
                    hideOnSinglePage: true,
                  }}
                  loading={loading}
                  scroll={{ x: "max-content" }}
                />
              )}
            </div>
          </div>
        </Card>

        <EditCustomerModal
          isOpen={isCustomerEditModalOpen}
          isClosed={() => setIsCustomerEditModalOpen(false)}
          selectedCustomer={selectedCustomer}
          setAlertMessage={messageAlert}
          getCustomers={getCustomers}
        />

        <AccountsByCustomerModal
          isOpen={isAccountsByCustomerModalOpen}
          isClosed={() => setIsAccountsByCustomerModalOpen(false)}
          selectedCustomer={selectedCustomer}
          setAlertMessage={messageAlert}
        />
      </div>
    </Content>
  );
};

export default Customers;
