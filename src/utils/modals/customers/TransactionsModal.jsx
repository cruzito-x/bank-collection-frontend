import { Button, Col, Modal, Row, Table } from "antd";
import { FileExcelOutlined, TransactionOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import moment from "moment";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useAuth } from "../../../contexts/authContext/AuthContext";

const TransactionsModal = ({
  isOpen,
  isClosed,
  selectedCustomerId,
  selectedCustomerAccountNumber,
  setAlertMessage,
}) => {
  const { authState } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = authState.token;

  const transactionsByCustomer = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/transactions/transactions-by-customer/${selectedCustomerId}/account/${selectedCustomerAccountNumber.account_number}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const transactionsData = await response.json();
      const transactions = transactionsData.map((transaction) => ({
        ...transaction,
        amount: "$" + transaction.amount,
        receiver_account: !transaction.receiver_account
          ? transaction.sender_account
          : transaction.receiver_account,
        datetime: moment(transaction.datetime).format("DD/MM/YYYY - hh:mm A"),
      }));

      setTransactions(transactions);
    } catch (error) {
      setAlertMessage.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    transactionsByCustomer();
  }, [isOpen, selectedCustomerId, selectedCustomerAccountNumber]);

  const transactionsColumns = [
    {
      title: "Código de Transacción",
      dataIndex: "transaction_id",
      key: "transaction_id",
      align: "center",
    },
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
      title: "Cuenta Origen",
      dataIndex: "sender_account",
      key: "sender_account",
      align: "center",
    },
    {
      title: "Monto",
      dataIndex: "amount",
      key: "amount",
      align: "center",
    },
    {
      title: "Cuenta Destino",
      dataIndex: "receiver_account",
      key: "receiver_account",
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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `Transacciones - ${transactions[0].customer}`
    );

    const fileName = `${moment(new Date()).format(
      "YYYYMMDDHHmmss"
    )} - Transacciones de ${selectedCustomerAccountNumber.account_number}.xlsx`;

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(data, fileName);
  };

  return (
    <Modal
      title={
        <Row align="middle">
          <Col>
            <TransactionOutlined
              className="fs-6"
              style={{ marginRight: 8, color: "var(--blue)" }}
            />
          </Col>
          <Col>
            <label className="fs-6 text-black">Transacciones Realizadas</label>
          </Col>
        </Row>
      }
      centered
      open={isOpen}
      width={1800}
      onCancel={isClosed}
      footer={null}
    >
      <div className="row">
        <div className="col-12 mb-3">
          <Table
            dataSource={transactions}
            columns={transactionsColumns}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showTotal: (total) => `Total: ${total} transacción(es)`,
              hideOnSinglePage: true,
            }}
            loading={loading}
            scroll={{ x: "max-content" }}
          />
        </div>
        <div className="col-12">
          <div className="text-end">
            <Button type="primary" danger onClick={isClosed}>
              {" "}
              Cerrar{" "}
            </Button>
            <Button className="ms-2" type="primary" onClick={exportToExcel}>
              <FileExcelOutlined />
              Exportar a Excel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionsModal;
