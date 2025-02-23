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
  AuditOutlined,
  BankOutlined,
  PlusCircleOutlined,
  TransactionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/authContext/AuthContext";
import AddNewTransactionTypeModal from "../../utils/modals/transactionTypes/AddNewTransactionTypeModal";
import EditTransactionTypeModal from "../../utils/modals/transactionTypes/EditTransactionTypeModal";
import { useForm } from "antd/es/form/Form";
import EmptyData from "../../utils/emptyData/EmptyData";
import { applyMaskOnlyLetters } from "../../utils/masks/InputMasks";

const TransactionTypes = () => {
  const { authState } = useAuth();
  const [transactionsTypes, setTransactionsTypes] = useState([]);
  const [isNewTransactionTypeModalOpen, setIsNewTransactionTypeModalOpen] =
    useState(false);
  const [isEditTransactionTypeModalOpen, setIsEditTransactionTypeModalOpen] =
    useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingData, setSendingData] = useState(false);
  const transactionTypeRef = useRef(null);
  const [messageAlert, messageContext] = message.useMessage();
  const { Content } = Layout;
  const [form] = useForm();
  const token = authState.token;
  const user_id = authState.user_id;

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    document.title = "Banco Bambú | Tipos de Transacciones";
    getTransactionsTypes();
  }, []);

  useEffect(() => {
    if (transactionTypeRef.current?.input) {
      applyMaskOnlyLetters(transactionTypeRef.current.input);

      transactionTypeRef.current.input.addEventListener("input", (event) => {
        form.setFieldsValue({ transaction_type: event.target.value });
      });
    }
  }, []);

  const getTransactionsTypes = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/transactions-types", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const transactionsTypesData = await response.json();

      if (response.status === 200) {
        const transactionsTypes = transactionsTypesData.map(
          (transactionType) => {
            return {
              ...transactionType,
              actions: (
                <>
                  <Button
                    className="ant-btn-edit"
                    type="primary"
                    onClick={() => setIsEditTransactionTypeModalOpen(true)}
                  >
                    Editar
                  </Button>
                  <Popconfirm
                    title="Eliminar Tipo de Transacción"
                    description="¿Está Seguro de Eliminar este Registro?"
                    onConfirm={() => deleteTransactionType(transactionType)}
                    okText="Sí"
                    cancelText="No"
                  >
                    <Button className="ms-2 me-2" type="primary" danger>
                      Eliminar
                    </Button>
                  </Popconfirm>
                </>
              ),
            };
          }
        );

        setTransactionsTypes(transactionsTypes);
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authState");
        window.location.href = "/";
        return;
      } else {
        messageAlert.error(transactionsTypesData.message);
      }
    } catch (error) {
      messageAlert.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteTransactionType = async (transactionType) => {
    setSendingData(true);

    try {
      const response = await fetch(
        `http://localhost:3001/transactions-types/delete-transaction-type/${transactionType.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
          body: JSON.stringify(transactionType),
        }
      );

      const deletedTransactionType = await response.json();

      if (response.status === 200) {
        messageAlert.success(deletedTransactionType.message);
        setSendingData(false);
        getTransactionsTypes();
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authState");
        window.location.href = "/";
        return;
      } else {
        messageAlert.error(deletedTransactionType.message);
        setSendingData(false);
      }
    } catch (error) {
      messageAlert.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
      setSendingData(false);
    }
  };

  const searchTransactionType = async (transactionType) => {
    if (
      transactionType.transaction_type === undefined ||
      transactionType.transaction_type === ""
    ) {
      messageAlert.warning(
        "Por Favor, Introduzca al Menos un Criterio de Búsqueda"
      );
      getTransactionsTypes();
      return;
    } else {
      setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:3001/transactions-types/search-transaction-type?transaction_type=${
            transactionType.transaction_type ?? ""
          }`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const transactionsTypesData = await response.json();

        if (response.status === 200) {
          const transactionsTypes = transactionsTypesData.map(
            (transactionType) => {
              return {
                ...transactionType,
                actions: (
                  <>
                    <Button
                      className="ant-btn-edit"
                      type="primary"
                      onClick={() => setIsEditTransactionTypeModalOpen(true)}
                    >
                      Editar
                    </Button>
                    <Popconfirm
                      title="Eliminar Tipo de Transacción"
                      description="¿Está Seguro de Eliminar este Registro?"
                      onConfirm={() => deleteTransactionType(transactionType)}
                      okText="Sí"
                      cancelText="No"
                    >
                      <Button className="ms-2 me-2" type="primary" danger>
                        Eliminar
                      </Button>
                    </Popconfirm>
                  </>
                ),
              };
            }
          );

          setTransactionsTypes(transactionsTypes);
        } else if (response.status === 400) {
          messageAlert.warning(transactionsTypesData.message);
        } else if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("authState");
          window.location.href = "/";
          return;
        } else {
          messageAlert.error(transactionsTypesData.message);
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

  const transactionsTypesTableColumns = [
    {
      title: "Tipo de Transacción",
      dataIndex: "transaction_type",
      key: "transaction_type",
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
                  <TransactionOutlined />
                  <span>Transacciones</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <AuditOutlined />
                  <span> Tipos de Transacción </span>
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
          <div className="row ms-2 pe-3 align-items-center">
            <div className="col-xxl-10 col-xl-9 col-md-12">
              <Form
                className="row"
                layout="inline"
                form={form}
                onFinish={searchTransactionType}
              >
                <div className="col-xxl-2 col-xl-3 col-md-12 col-sm-12 mb-3 d-flex align-items-center w-auto">
                  <label className="me-2 fw-semibold text-black"> Tipo </label>
                  <Form.Item name="transaction_type" initialValue="">
                    <Input
                      ref={transactionTypeRef}
                      placeholder="Tipo de Transacción"
                      prefix={<AuditOutlined />}
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
            </div>
            <div className="col-xxl-2 col-xl-3 col-md-12 col-sm-12 mb-3 d-lg-flex d-sm-block align-items-center w-sm-100 pe-3">
              <Button
                className="w-100"
                type="primary"
                onClick={() => setIsNewTransactionTypeModalOpen(true)}
              >
                <PlusCircleOutlined /> Nuevo Tipo de Transacción
              </Button>
            </div>
          </div>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-12">
              {transactionsTypes.length === 0 ? (
                <EmptyData />
              ) : (
                <Table
                  dataSource={transactionsTypes}
                  columns={transactionsTypesTableColumns}
                  onRow={(record) => ({
                    onClick: () => setSelectedTransactionType(record),
                  })}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: false,
                    showTotal: (total) =>
                      `Total: ${total} tipo(s) de transacción(es)`,
                    hideOnSinglePage: true,
                  }}
                  loading={loading}
                  scroll={{ x: "max-content" }}
                />
              )}
            </div>
          </div>
        </Card>

        <AddNewTransactionTypeModal
          isOpen={isNewTransactionTypeModalOpen}
          isClosed={() => setIsNewTransactionTypeModalOpen(false)}
          getTransactionsTypes={getTransactionsTypes}
          setAlertMessage={messageAlert}
          scroll={{ x: "max-content" }}
        />

        <EditTransactionTypeModal
          isOpen={isEditTransactionTypeModalOpen}
          isClosed={() => setIsEditTransactionTypeModalOpen(false)}
          selectedTransactionType={selectedTransactionType}
          getTransactionsTypes={getTransactionsTypes}
          setAlertMessage={messageAlert}
        />
      </div>
    </Content>
  );
};

export default TransactionTypes;
