import { Button, Col, Modal, Row, Table } from "antd";
import { DollarCircleOutlined, FileExcelOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import moment from "moment";
import { useAuth } from "../../../contexts/authContext/AuthContext";

const PaymentsDetailsModal = ({
  isOpen,
  isClosed,
  selectedService,
  setAlertMessage,
}) => {
  const { authState } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = authState.token;

  const getPaymentsDetails = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/services/view-payments-by-service-details/${selectedService.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
      title: "Monto Pagado",
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

  const exportToExcel = () => {
    const headers = payments.map((payment) => ({
      Servicio: payment.service,
      Colector: payment.collector,
      Monto: payment.amount,
      "Pagado Por": payment.payed_by,
      "Registrado Por": payment.registered_by,
      "Fecha y Hora": payment.datetime,
    }));

    const worksheet = XLSX.utils.json_to_sheet(headers);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `${(
        selectedService.collector +
        "_" +
        selectedService.service +
        "_" +
        moment(new Date()).format("DD-MM-YYYY")
      )
        .replace(/[\\/:?*[\]]/g, "")
        .slice(0, 31)}`
    );

    const xlsxName = `${
      moment(new Date()).format("YYYYMMDDHHmmss") +
      "_Pagos de " +
      selectedService.service +
      "_" +
      selectedService.collector
    }.xlsx`;

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const paymentsServicesData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(paymentsServicesData, xlsxName);
  };

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
              Cerrar
            </Button>
            <Button className="ms-2" type="primary" onClick={exportToExcel}>
              <FileExcelOutlined />
              Descargar Excel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentsDetailsModal;
