import { Button, Col, Modal, Row, Table } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import moment from "moment";

const PaymentsDetailsModal = ({
  isOpen,
  isClosed,
  selectedService,
  setAlertMessage,
}) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPaymentsDetails = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/services/view-payments-by-service-details/${selectedService.id}`,
        {
          method: "GET",
        }
      );

      const paymentsDetailsData = await response.json();
      const payments = paymentsDetailsData.map((payment) => ({
        ...payment,
        amount: "$" + payment.amount,
        datetime: moment(payment.datetime).format("DD/MM/YYYY - hh:mm A"),
      }));

      setPayments(payments);
    } catch (error) {
      setAlertMessage.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPaymentsDetails();
  }, [isOpen, selectedService]);

  const paymentsDetailsColumns = [
    {
      title: "Servicio",
      dataIndex: "service",
      key: "service",
      align: "center",
    },
    {
      title: "Colector",
      dataIndex: "collector",
      key: "collector",
      align: "center",
    },
    {
      title: "Monto",
      dataIndex: "amount",
      key: "amount",
      align: "center",
    },
    {
      title: "Pagado Por",
      dataIndex: "payed_by",
      key: "payed_by",
      align: "center",
    },
    {
      title: "Registrado Por",
      dataIndex: "registered_by",
      key: "registered_by",
      align: "center",
    },
    {
      title: "Fecha y Hora",
      dataIndex: "datetime",
      key: "datetime",
      align: "center",
    },
  ];

  const paymentsDetailsHeader = [
    { label: "Servicio", key: "service" },
    { label: "Colector", key: "collector" },
    { label: "Monto", key: "amount" },
    { label: "Pagado Por", key: "payed_by" },
    { label: "Registrado Por", key: "registered_by" },
    { label: "Fecha y Hora", key: "datetime" },
  ];

  return (
    <Modal
      title={
        <Row align="middle">
          <Col>
            <DollarCircleOutlined
              className="fs-6"
              style={{ marginRight: 8, color: "var(--blue)" }}
            />
          </Col>
          <Col>
            <label className="fs-6 text-black">Pagos por Servicio</label>
          </Col>
        </Row>
      }
      centered
      open={isOpen}
      width={1350}
      onCancel={isClosed}
      footer={null}
    >
      <div className="row">
        <div className="col-12 mb-3">
          <Table
            dataSource={payments}
            columns={paymentsDetailsColumns}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showTotal: (total) => `Total: ${total} Pago(s) Registrado(s)`,
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
              )} - Pagos de ${
                selectedService.service + "_" + selectedService.collector
              }.csv`}
              headers={paymentsDetailsHeader}
              data={payments}
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

export default PaymentsDetailsModal;
