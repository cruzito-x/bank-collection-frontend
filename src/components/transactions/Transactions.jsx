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
      });

      const typesData = await response.json();
      const transactionsTypes = typesData.map((transactionType) => {
        return {
          value: transactionType.id,
          label: transactionType.transaction_type,
        };
      });

      setTransactionTypes(transactionsTypes);
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
        transaction.transaction_type === "") &&
      (transaction.date === undefined || transaction.date === "")
    ) {
      messageAlert.warning("Introduzca al Menos un Criterio de Búsqueda");
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
          <div className="row ms-2 pt-3 mb-2">
            <div className="col-12 text-start">
              <label className="fw-semibold text-black"> Buscar Por </label>
            </div>
          </div>
          <div className="row ms-2 mb-3 pe-3">
            <Form
              layout="inline"
              className="align-items-center"
              form={form}
              onFinish={searchTransactions}
            >
              <label className="me-2 fw-semibold text-black">
                {" "}
                Código de Transacción{" "}
              </label>
              <Form.Item
                className="col-xxl-2 col-xl-2 col-sm-12 w-auto"
                name="transaction_id"
                initialValue=""
              >
                <Input
                  placeholder="TSC000000"
                  prefix={<NumberOutlined />}
                  style={{
                    width: 183,
                  }}
                />
              </Form.Item>
              <label className="me-2 fw-semibold text-black">
                {" "}
                Realizado Por{" "}
              </label>
              <Form.Item
                className="col-xxl-2 col-xl-2 col-sm-12 w-auto"
                name="realized_by"
                initialValue=""
              >
                <Input
                  placeholder="Nombre de Usuario"
                  prefix={<UserOutlined />}
                  style={{
                    width: 183,
                  }}
                />
              </Form.Item>
              <label className="me-2 fw-semibold text-black"> Tipo </label>
              <Form.Item
                className="col-xxl-2 col-xl-2 col-sm-12 w-auto"
                name="transaction_type"
                initialValue={1}
              >
                <Select
                  defaultValue={1}
                  prefix={<TransactionOutlined />}
                  style={{
                    width: 183,
                  }}
                  options={transactionsTypes}
                />
              </Form.Item>
              <label className="me-2 fw-semibold text-black"> Fecha </label>
              <Form.Item
                className="col-xxl-2 col-xl-2 col-sm-12 w-auto"
                name="date"
                initialValue=""
              >
                <DatePicker
                  className="cusor-pointer"
                  value={date}
                  onChange={(date) => setDate(date)}
                  format="DD/MM/YYYY"
                  placeholder="00/00/0000"
                  style={{
                    width: 183,
                  }}
                />
              </Form.Item>

              <Form.Item className="col-xxl-2 col-xl-2 col-sm-12 w-auto">
                <Button type="primary" htmlType="submmit">
                  {" "}
                  Buscar{" "}
                </Button>
              </Form.Item>
              <div className="col-xxl-2 col-xl-2 col-sm-12 ms-5 text-end">
                <Button
                  type="primary"
                  onClick={() => setIsNewTransactionModalOpen(true)}
                >
                  <PlusCircleOutlined /> Nueva Transacción{" "}
                </Button>
              </div>
            </Form>
          </div>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-12">
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
              />
            </div>
          </div>
        </Card>

        <AddNewTransactionModal
          isOpen={isNewTransactionModalOpen}
          isClosed={() => setIsNewTransactionModalOpen(false)}
          transactionTypes={transactionsTypes}
          getTransactions={getTransactions}
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
