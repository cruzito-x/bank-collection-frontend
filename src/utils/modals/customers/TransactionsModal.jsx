import { Button, Col, Modal, Row, Table } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import moment from "moment";

const TransactionsModal = ({
  isOpen,
  isClosed,
  customerData,
  setAlertMessage,
}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const transactionsByCustomer = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/transactions/transactions-by-customer/${customerData.id}`,
        {
          method: "GET",
        }
      );

      const transactionsData = await response.json();
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error al obtener las transacciones del cliente: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    transactionsByCustomer();
  }, [isOpen, customerData]);

  const transactionsColumns = [
    {
      title: "Enviado Por",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Recibido Por",
      dataIndex: "receiver",
      key: "receiver",
    },
    {
      title: "Tipo de Transacción",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Monto",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Autorizado Por",
      dataIndex: "authorized_by",
      key: "authorized_by",
    },
  ];

  return (
    <Modal
      title={
        <Row align="middle">
          {" "}
          <Col>
            {" "}
            <DollarCircleOutlined
              className="fs-6"
              style={{ marginRight: 8, color: "var(--green)" }}
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
            columns={transactionsColumns}
            dataSource={transactions}
            loading={loading}
          />
        </div>
        <div className="col-6">
          <label className="fw-semibold text-black">Saldo Actual: ${0}</label>
        </div>
        <div className="col-6">
          <div className="text-end">
            <Button type="primary" danger onClick={isClosed}>
              {" "}
              Cerrar{" "}
            </Button>
            <Button
              className="ms-2"
              type="primary"
              onClick={isClosed}
              style={{
                backgroundColor: "var(--green)",
              }}
            >
              Exportar CSV
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionsModal;
