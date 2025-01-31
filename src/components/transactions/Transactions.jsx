import {
  Breadcrumb,
  Button,
  Card,
  DatePicker,
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
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext/AuthContext";
import moment from "moment";
import TransactionDetailsModal from "../../utils/modals/transactions/TransactionDetailsModal";
import NewTransactionModal from "../../utils/modals/transactions/NewTransactionModal";

const Transactions = () => {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [transactionsTypes, setTransactionTypes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] =
    useState(false);
  const [isTransactionDetailsModalOpen, setIsTransactionDetailsModalOpen] =
    useState(false);
  const [messageAlert, messageContext] = message.useMessage();
  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
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
    } catch (error) {}
  };

  const getTransactions = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/transactions", {
        method: "GET",
      });

      const transactionsData = await response.json();
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
                    ? "green"
                    : "red"
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
          datetime: moment(transaction.datetime).format("DD/MM/YYYY - hh:mm A"),
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

      setLoading(false);
      setTransactions(transactions);
    } catch (error) {}
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
          ]}
        />

        <Card className="mt-3">
          <div className="row ms-2 pt-3 mb-2">
            <div className="col-12 text-start">
              <label className="fw-semibold text-black"> Buscar Por </label>
            </div>
          </div>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-xxl-2 col-xl-2 col-sm-12 w-auto">
              <label className="me-2 fw-semibold text-black">
                {" "}
                Código de Transacción{" "}
              </label>
              <Input
                placeholder="0000"
                prefix={<NumberOutlined />}
                style={{
                  width: 183,
                }}
              />
            </div>
            <div className="col-xxl-2 col-xl-2 col-sm-12 w-auto">
              <label className="me-2 fw-semibold text-black">
                {" "}
                Nombre de Autorizador{" "}
              </label>
              <Input
                placeholder="Nombre de Autorizador"
                prefix={<UserOutlined />}
                style={{
                  width: 183,
                }}
              />
            </div>
            <div className="col-xxl-2 col-xl-2 col-sm-12 w-auto">
              <label className="me-2 fw-semibold text-black"> Tipo </label>
              <Select
                defaultValue={1}
                prefix={<TransactionOutlined />}
                style={{
                  width: 183,
                }}
                options={transactionsTypes}
              />
            </div>
            <div className="col-xxl-2 col-xl-2 col-sm-12 w-auto">
              <label className="me-2 fw-semibold text-black"> Fecha </label>
              <DatePicker
                // value={date}
                // onChange={(date) => setDate(date)}
                format="DD/MM/YYYY"
                placeholder="00/00/0000"
                style={{
                  width: 183,
                }}
              />
            </div>

            <div className="col-xxl-2 col-xl-2 col-sm-12 w-auto">
              <Button type="primary"> Buscar </Button>
            </div>
            <div className="col-xxl-2 col-xl-2 col-sm-12 text-end">
              <Button
                type="primary"
                onClick={() => setIsNewTransactionModalOpen(true)}
              >
                <PlusCircleOutlined /> Nueva Transacción{" "}
              </Button>
            </div>
          </div>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-12">
              <Table
                dataSource={transactions}
                columns={transactionsTableColumns}
                loading={loading}
                onRow={(record) => ({
                  onClick: () => setSelectedTransaction(record),
                })}
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Total: ${total} transferencia(s)`,
                  hideOnSinglePage: true,
                }}
              />
            </div>
          </div>
          <NewTransactionModal
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
        </Card>
      </div>
    </Content>
  );
};

export default Transactions;
