import { Button, Col, Modal, Row, Select, Space, Table } from "antd";
import { DollarCircleOutlined, FileExcelOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import moment from "moment";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useAuth } from "../../../contexts/authContext/AuthContext";
import EmptyData from "../../emptyData/EmptyData";

const PaymentsDetailsModal = ({
  isOpen,
  isClosed,
  selectedCollector,
  setAlertMessage,
}) => {
  const { authState } = useAuth();
  const [payments, setPayments] = useState([]);
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

  const getPaymentsDetails = async () => {
    setLoading(true);

    try {
      const startDay = moment(dates[0]).format("YYYY-MM-DD");
      const endDay = moment(dates[1]).format("YYYY-MM-DD");

      const response = await fetch(
        `http://localhost:3001/collectors/view-payments-collector-details/${selectedCollector.id}/${startDay}/${endDay}`,
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
  }, [isOpen, selectedCollector, dates[0], dates[1]]);

  const paymentsDetailsColumns = [
    {
      title: "Colector",
      dataIndex: "collector",
      key: "collector",
      align: "center",
    },
    {
      title: "Servicio",
      dataIndex: "service",
      key: "service",
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

  const exportToExcel = () => {
    const headers = payments.map((payment) => ({
      Colector: payment.collector,
      Servicio: payment.service,
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
        selectedCollector.collector +
        " - " +
        moment(new Date()).format("DD-MM-YYYY")
      )
        .replace(/[\\/:?*[\]]/g, "")
        .slice(0, 31)}`
    );

    const xlsxName = `${
      moment(new Date()).format("YYYYMMDDHHmmss") +
      "_Pagos Realizados a " +
      selectedCollector.collector
    }.xlsx`;

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const paymentsCollectorsData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(paymentsCollectorsData, xlsxName);
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
            <label className="fs-6 text-black">
              Pagos Recibidos por Colector
            </label>
          </Col>
        </Row>
      }
      centered
      open={isOpen}
      width={1350}
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
          {payments.length === 0 ? (
            <EmptyData />
          ) : (
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
          )}
        </div>
        <div className="col-12">
          <div className="text-end">
            <Button type="primary" danger onClick={isClosed}>
              {" "}
              Cerrar{" "}
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
