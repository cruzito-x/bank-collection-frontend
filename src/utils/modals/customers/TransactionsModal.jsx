import { Button, Col, Empty, Modal, Row, Select, Space, Table } from "antd";
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
  const [dates, setDates] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);
  const token = authState.token;

  const datesFilter = (filter) => {
    let range;

    switch (filter) {
      case "today":
        range = [moment().startOf("day"), moment().endOf("day")];
        break;
      case "lastWeek":
        range = [
          moment().subtract(7, "days").startOf("day"),
          moment().endOf("day"),
        ];
        break;
      case "lastMonth":
        range = [
          moment().subtract(1, "month").startOf("day"),
          moment().endOf("day"),
        ];
        break;
      case "lastQuarter":
        range = [
          moment().subtract(3, "months").startOf("day"),
          moment().endOf("day"),
        ];
        break;
      case "lastSemester":
        range = [
          moment().subtract(6, "months").startOf("day"),
          moment().endOf("day"),
        ];
        break;
      case "lastYear":
        range = [
          moment().subtract(1, "year").startOf("day"),
          moment().endOf("day"),
        ];
        break;
      default:
        range = [moment().startOf("day"), moment().endOf("day")];
    }

    setDates(range);
  };

  const transactionsByCustomer = async () => {
    setLoading(true);

    try {
      const startDay = moment(dates[0]).format("YYYY-MM-DD");
      const endDay = moment(dates[1]).format("YYYY-MM-DD");

      const response = await fetch(
        `http://localhost:3001/transactions/transactions-by-customer/${selectedCustomerId}/account/${selectedCustomerAccountNumber.account_number}/${startDay}/${endDay}`,
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
  }, [
    isOpen,
    selectedCustomerId,
    selectedCustomerAccountNumber,
    dates[0],
    dates[1],
  ]);

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
    const headers = transactions.map((transaction) => ({
      "Código de Transacción": transaction.transaction_id,
      "Enviado Por": transaction.customer,
      "Recibido Por": transaction.receiver,
      "Tipo de Transacción": transaction.transaction_type,
      "Cuenta Origen": transaction.sender_account,
      Monto: transaction.amount,
      "Cuenta Destino": transaction.receiver_account,
      "Fecha y Hora": transaction.datetime,
      "Autorizado Por": transaction.authorized_by,
    }));

    const worksheet = XLSX.utils.json_to_sheet(headers);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `${("Transacciones - " + transactions[0].customer)
        .replace(/[\\/:?*[\]]/g, "")
        .slice(0, 31)}`
    );

    const xlsxName = `${
      moment(new Date()).format("YYYYMMDDHHmmss") +
      "_Transacciones de " +
      transactions[0].customer +
      "_" +
      moment(dates[0]).format("YYYY-MM-DD") +
      "_" +
      moment(dates[1]).format("YYYY-MM-DD")
    }.xlsx`;

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const transactionsData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(transactionsData, xlsxName);
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
      maskClosable={false}
    >
      <div className="row">
        <div className="col-12 w-auto">
          <label className="fw-semibold text-black me-2"> Fecha </label>
          <Space wrap>
            <Select
              className="mb-2"
              defaultValue="today"
              style={{
                width: 183,
              }}
              onChange={datesFilter}
              options={[
                {
                  value: "today",
                  label: "Hoy",
                },
                {
                  value: "lastWeek",
                  label: "Última Semana",
                },
                {
                  value: "lastMonth",
                  label: "Último Mes",
                },
                {
                  value: "lastQuarter",
                  label: "Últimos 3 Meses",
                },
                {
                  value: "lastSemester",
                  label: "Últimos 6 Meses",
                },
                {
                  value: "lastYear",
                  label: "Último Año",
                },
              ]}
            />
          </Space>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mb-3">
          {transactions.length === 0 ? (
            <Empty className="p-5" description="No Hay Datos Disponibles" />
          ) : (
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
          )}
        </div>
        <div className="col-12">
          <div className="text-end">
            <Button type="primary" danger onClick={isClosed}>
              {" "}
              Cerrar{" "}
            </Button>
            <Button
              className="ms-2"
              type="primary"
              onClick={exportToExcel}
              disabled={transactions.length === 0 ? true : false}
            >
              <FileExcelOutlined />
              Descargar Excel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionsModal;
