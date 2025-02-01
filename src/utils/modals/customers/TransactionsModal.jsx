import { Button, Col, Modal, Row, Table, Tag } from "antd";
import { TransactionOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { CSVLink } from "react-csv";

const TransactionsModal = ({ isOpen, isClosed, selectedCustomer }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const transactionsByCustomer = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/transactions/transactions-by-customer/${selectedCustomer.id}/account/${selectedCustomer.account_number}`,
        {
          method: "GET",
        }
      );

      const transactionsData = await response.json();
      const transactions = transactionsData.map((transaction) => ({
        ...transaction,
        transaction_type: (
          <>
            <Tag
              color={
                transaction.transaction_type === "Deposito"
                  ? "green"
                  : transaction.transaction_type === "Retiro"
                  ? "red"
                  : "blue"
              }
            >
              {transaction.transaction_type}
            </Tag>
          </>
        ),
        amount: "$" + transaction.amount,
        datetime: moment(transaction.datetime).format("DD/MM/YYYY - hh:mm A"),
      }));

      setTransactions(transactions);
    } catch (error) {
      console.error("Error al obtener las transacciones del cliente: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    transactionsByCustomer();
  }, [isOpen, selectedCustomer]);

  const transactionsColumns = [
    {
      title: "Enviado Por",
      dataIndex: "customer",
      key: "customer",
      align: "center",
    },
    {
      title: "Recibido Por",
      dataIndex: "receiver",
      key: "receiver",
      align: "center",
    },
    {
      title: "Tipo de Transacción",
      dataIndex: "transaction_type",
      key: "transaction_type",
      align: "center",
    },
    {
      title: "Monto",
      dataIndex: "amount",
      key: "amount",
      align: "center",
    },
    {
      title: "Fecha y Hora",
      dataIndex: "datetime",
      key: "datetime",
      align: "center",
    },
    {
      title: "Autorizado Por",
      dataIndex: "authorized_by",
      key: "authorized_by",
      align: "center",
    },
  ];

  const transactionsHeader = [
    { label: "#", key: "id" },
    { label: "Cliente", key: "customer" },
    { label: "Tipo de Transacción", key: "transaction_type" },
    { label: "Monto", key: "amount" },
    { label: "Fecha y Hora", key: "datetime" },
    { label: "Autorizado Por", key: "authorized_by" },
  ];

  return (
    <Modal
      title={
        <Row align="middle">
          {" "}
          <Col>
            {" "}
            <TransactionOutlined
              className="fs-6"
              style={{ marginRight: 8, color: "var(--blue)" }}
            />{" "}
          </Col>{" "}
          <Col>
            <label className="fs-6 text-black">Transacciones Realizadas</label>
          </Col>{" "}
        </Row>
      }
      centered
      open={isOpen}
      width={900}
      onCancel={isClosed}
      footer={null}
    >
      <div className="row">
        <div className="col-12 mb-3">
          <Table
            dataSource={transactions}
            columns={transactionsColumns}
            loading={loading}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Total: ${total} transacción(es)`,
              hideOnSinglePage: true,
            }}
          />
        </div>
        <div className="col-12">
          <div className="text-end">
            <Button type="primary" danger onClick={isClosed}>
              {" "}
              Cerrar{" "}
            </Button>

            <CSVLink
              filename={`${moment(new Date()).format(
                "YYYYMMDDHHmmss"
              )} - Transactions.csv`}
              headers={transactionsHeader}
              data={transactions}
            >
              <Button className="ms-2" type="primary">
                Exportar CSV
              </Button>
            </CSVLink>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionsModal;
