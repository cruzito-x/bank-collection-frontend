import {
  Breadcrumb,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Layout,
  message,
  Select,
  Table,
  Tag,
  theme,
} from "antd";
import {
  NumberOutlined,
  TransactionOutlined,
  UserOutlined,
  PlusCircleOutlined,
  BankOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext/AuthContext";
import moment from "moment";
import TransactionDetailsModal from "../../utils/modals/transactions/TransactionDetailsModal";
import AddNewTransactionModal from "../../utils/modals/transactions/AddNewTransactionModal";
import { useForm } from "antd/es/form/Form";
import EmptyData from "../../utils/emptyData/EmptyData";

const Transactions = () => {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(null);
  const [transactionsTypes, setTransactionTypes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] =
    useState(false);
  const [isTransactionDetailsModalOpen, setIsTransactionDetailsModalOpen] =
    useState(false);
  const [messageAlert, messageContext] = message.useMessage();
  const { Content } = Layout;
  const [form] = useForm();
  const token = authState.token;

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    document.title = "Banco Bambú | Transacciones";
    getTransactionsTypes();
    getTransactions();
  }, []);

  const getTransactionsTypes = async () => {
    try {
      const response = await fetch("http://localhost:3001/transactions-types", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const typesData = await response.json();

      if (response.status === 200) {
        typesData.unshift({ id: 0, transaction_type: "Todos" });

        const transactionsTypes = typesData.map((transactionType) => {
          return {
            value: transactionType.id,
            label: transactionType.transaction_type,
          };
        });

        setTransactionTypes(transactionsTypes);
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authState");
        window.location.href = "/";
        return;
      } else {
        messageAlert.error(typesData.message);
      }
    } catch (error) {
      messageAlert.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    }
  };

  const getTransactions = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/transactions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const transactionsData = await response.json();

      if (response.status === 200) {
        const transactions = transactionsData.map((transaction) => {
          return {
            ...transaction,
            amount: "$" + transaction.amount,
            status: (
              <>
                <Tag
                  color={`${
                    transaction.status === 1
                      ? "warning"
                      : transaction.status === 2
                      ? "success"
                      : "error"
                  }`}
                >
                  {transaction.status === 1
                    ? "En Proceso"
                    : transaction.status === 2
                    ? "Aprobado"
                    : "Denegado"}
                </Tag>
              </>
            ),
            datetime: moment(transaction.datetime).format(
              "DD/MM/YYYY - hh:mm A"
            ),
            actions: (
              <>
                <Button
                  type="primary"
                  onClick={() => setIsTransactionDetailsModalOpen(true)}
                  disabled={
                    transaction.status === 1 || transaction.status === 3
                      ? true
                      : false
                  }
                >
                  {" "}
                  Ver Detalles{" "}
                </Button>
              </>
            ),
          };
        });

        setTransactions(transactions);
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authState");
        window.location.href = "/";
        return;
      } else {
        messageAlert.error(transactionsData.message);
      }
    } catch (error) {
      messageAlert.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      setLoading(false);
    }
  };

  const searchTransactions = async (transaction) => {
    if (
      (transaction.transaction_id === undefined ||
        transaction.transaction_id === "") &&
      (transaction.realized_by === undefined ||
        transaction.realized_by === "") &&
      (transaction.transaction_type === undefined ||
        transaction.transaction_type === "" || transaction.transaction_type === 0) &&
      (transaction.date === undefined || transaction.date === "")
    ) {
      messageAlert.warning(
        "Por Favor, Introduzca al Menos un Criterio de Búsqueda"
      );
      getTransactions();
      return;
    } else {
      setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:3001/transactions/search-transactions?transaction_id=${
            transaction.transaction_id ?? ""
          }&realized_by=${transaction.realized_by ?? ""}&transaction_type=${
            transaction.transaction_type ?? ""
          }&date=${transaction.date ?? ""}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const transactionsData = await response.json();

        if (response.status === 200) {
          const transactions = transactionsData.map((transaction) => {
            return {
              ...transaction,
              amount: "$" + transaction.amount,
              status: (
                <>
                  <Tag
                    color={`${
                      transaction.status === 1
                        ? "warning"
                        : transaction.status === 2
                        ? "success"
                        : "error"
                    }`}
                  >
                    {transaction.status === 1
                      ? "En Proceso"
                      : transaction.status === 2
                      ? "Aprobado"
                      : "Denegado"}
                  </Tag>
                </>
              ),
              datetime: moment(transaction.datetime).format(
                "DD/MM/YYYY - hh:mm A"
              ),
              actions: (
                <>
                  <Button
                    type="primary"
                    onClick={() => setIsTransactionDetailsModalOpen(true)}
                    disabled={
                      transaction.status === 1 || transaction.status === 3
                        ? true
                        : false
                    }
                  >
                    {" "}
                    Ver Detalles{" "}
                  </Button>
                </>
              ),
            };
          });

          setTransactions(transactions);
        } else if (response.status === 400) {
          messageAlert.warning(transactionsData.message);
        } else if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("authState");
          window.location.href = "/";
          return;
        } else {
          messageAlert.error(transactionsData.message);
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

  const transactionsTableColumns = [
    {
      title: "Código de Transacción",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Cliente",
      dataIndex: "customer",
      key: "customer",
      align: "center",
    },
    {
      title: "Tipo de Transacción",
      dataIndex: "transaction_type",
      key: "transaction_type",
      align: "center",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
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
                  <TransactionOutlined />
                  <span>Transacciones</span>
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
            <div className="col-xxl-10 col-xl-9 col-md-12 col-sm-12">
              <Form
                className="row"
                layout="inline"
                form={form}
                onFinish={searchTransactions}
              >
                <div className="col-xxl-2 col-xl-3 col-md-12 col-sm-12 mb-3 d-flex align-items-center w-auto">
                  <label className="me-2 fw-semibold text-black">Código</label>
                  <Form.Item name="transaction_id" initialValue="">
                    <Input
                      placeholder="TSC000000"
                      prefix={<NumberOutlined />}
                      style={{ width: 183 }}
                    />
                  </Form.Item>
                </div>
                <div className="col-xxl-2 col-xl-3 col-md-12 col-sm-12 mb-3 d-flex align-items-center w-auto">
                  <label className="me-2 fw-semibold text-black">Cajero</label>
                  <Form.Item name="realized_by" initialValue="">
                    <Input
                      placeholder="Nombre de Usuario"
                      prefix={<UserOutlined />}
                      style={{ width: 183 }}
                    />
                  </Form.Item>
                </div>
                <div className="col-xxl-2 col-xl-3 col-md-12 col-sm-12 mb-3 d-flex align-items-center w-auto">
                  <label className="me-2 fw-semibold text-black">Tipo</label>
                  <Form.Item name="transaction_type" initialValue={0}>
                    <Select
                      defaultValue={0}
                      style={{ width: 183 }}
                      options={transactionsTypes}
                    />
                  </Form.Item>
                </div>
                <div className="col-xxl-2 col-xl-3 col-md-12 col-sm-12 mb-3 d-flex align-items-center w-auto">
                  <label className="me-2 fw-semibold text-black">Fecha</label>
                  <Form.Item name="date" initialValue="">
                    <DatePicker
                      className="cusor-pointer"
                      value={date}
                      onChange={(date) => setDate(date)}
                      format="DD/MM/YYYY"
                      placeholder="00/00/0000"
                      style={{ width: 183 }}
                    />
                  </Form.Item>
                </div>
                <div className="col-xxl-2 col-xl-3 col-md-12 col-sm-12 mb-3 d-lg-flex d-sm-block align-items-center w-sm-100">
                  <Form.Item>
                    <Button className="w-100" type="primary" htmlType="submit">
                      Buscar
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
            <div className="col-xxl-2 col-xl-3 col-md-12 col-sm-12 mb-3 text-end">
              <Button
                className="w-100"
                type="primary"
                onClick={() => setIsNewTransactionModalOpen(true)}
              >
                <PlusCircleOutlined /> Nueva Transacción
              </Button>
            </div>
          </div>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-12">
              {transactions.length === 0 ? (
                <EmptyData />
              ) : (
                <Table
                  dataSource={transactions}
                  columns={transactionsTableColumns}
                  onRow={(record) => ({
                    onClick: () => setSelectedTransaction(record),
                  })}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: false,
                    showTotal: (total) =>
                      `Total: ${total} transferencia(s) registrada(s)`,
                    hideOnSinglePage: true,
                  }}
                  loading={loading}
                  scroll={{ x: "max-content" }}
                />
              )}
            </div>
          </div>
        </Card>

        <AddNewTransactionModal
          isOpen={isNewTransactionModalOpen}
          isClosed={() => {
            setIsNewTransactionModalOpen(false);
          }}
          transactionTypes={transactionsTypes}
          getTransactions={getTransactions}
          isSupervisor={authState.isSupervisor}
          setAlertMessage={messageAlert}
        />

        <TransactionDetailsModal
          isOpen={isTransactionDetailsModalOpen}
          isClosed={() => setIsTransactionDetailsModalOpen(false)}
          transactionData={selectedTransaction}
        />
      </div>
    </Content>
  );
};

export default Transactions;
