import { Button, Card, Col, Modal, Row } from "antd";
import { DownloadOutlined, FileTextOutlined } from "@ant-design/icons";
import React from "react";
import moment from "moment";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

const getPeriods = () => {
  return {
    diary: `${moment().startOf("day").format("DD/MM/YYYY")} - ${moment()
      .endOf("day")
      .format("DD/MM/YYYY")}`,

    weekly: `${moment()
      .subtract(7, "days")
      .startOf("day")
      .format("DD/MM/YYYY")} - ${moment().endOf("day").format("DD/MM/YYYY")}`,

    monthly: `${moment()
      .subtract(1, "month")
      .startOf("day")
      .format("DD/MM/YYYY")} - ${moment().endOf("day").format("DD/MM/YYYY")}`,

    quarterly: `${moment()
      .subtract(3, "month")
      .startOf("day")
      .format("DD/MM/YYYY")} - ${moment().endOf("day").format("DD/MM/YYYY")}`,

    semiannual: `${moment()
      .subtract(6, "month")
      .startOf("day")
      .format("DD/MM/YYYY")} - ${moment().endOf("day").format("DD/MM/YYYY")}`,

    anual: `${moment()
      .subtract(1, "year")
      .startOf("day")
      .format("DD/MM/YYYY")} - ${moment().endOf("day").format("DD/MM/YYYY")}`,
  };
};

const ViewReportsModal = ({ isOpen, isClosed, setAlertMessage }) => {
  const periods = getPeriods();

  const generateReport = async (title, period) => {
    const dateRange = period.split(" - ");

    if (dateRange.length !== 2) {
      return;
    }

    const [startDate, endDate] = dateRange.map((date) =>
      moment(date, "DD/MM/YYYY").format("YYYY-MM-DD")
    );

    try {
      const response = await fetch(
        `http://localhost:3001/dashboard/reports-by-date/${startDate}/${endDate}`,
        { method: "GET" }
      );

      const reportData = await response.json();

      const docDefinition = {
        content: [
          { text: title, style: "header" },
          { text: `Periodo: ${period}`, style: "period" },

          { text: "\nResumen General", style: "subheader" },
          {
            text: "Una Visión General de las Actividades Durante el Periodo Especificado.",
          },

          { text: "\nTransacciones Detalladas", style: "subheader" },
          {
            table: {
              widths: ["auto", "*", "auto", "auto", "auto"],
              body: [
                ["Fecha", "Descripción", "Monto", "Tipo", "Autorizado"],
                ...reportData[0].map((transaction) => [
                  moment(transaction.datetime).format("DD/MM/YYYY"),
                  `${
                    transaction.transaction_type === "Deposito"
                      ? transaction.sender + " Deposito a la Cuenta"
                      : transaction.transaction_type === "Retiro"
                      ? transaction.sender + " Retiro de la Cuenta"
                      : transaction.transaction_type === "Transferencia"
                      ? transaction.sender + " Transfirió desde la cuenta: "
                      : ""
                  } ` +
                    transaction.sender_account +
                    `${
                      transaction.transaction_type === "Transferencia"
                        ? " a la Cuenta: " +
                          transaction.receiver_account +
                          " de " +
                          transaction.receiver
                        : ""
                    } `,
                  `$${transaction.amount}`,
                  transaction.transaction_type,
                  transaction.authorized_by,
                ]),
              ],
            },
            margin: [0, 10, 0, 10],
            layout: "lightHorizontalLines",
          },

          { text: "\nTotales por Tipo de Transacción", style: "subheader" },
          {
            table: {
              widths: ["*", "auto"],
              body: [
                ["Tipo de Transacción", "Total"],
                ...reportData[1].map((transaction_type) => [
                  transaction_type.transaction_type,
                  `$${transaction_type.amount}`,
                ]),
              ],
            },
            margin: [0, 10, 0, 10],
            layout: "lightHorizontalLines",
          },

          { text: "\nColectores con Mayores Ingresos", style: "subheader" },
          {
            text: "Lista de los Colectores con Mayor Índice de Pagos en el Período Especificado.",
          },
          {
            table: {
              widths: ["*", "auto"],
              body: [
                ["Colector", "Total"],
                ...reportData[2].map((collector) => [
                  collector.collector,
                  `$${collector.amount}`,
                ]),
              ],
            },
            margin: [0, 10, 0, 10],
            layout: "lightHorizontalLines",
          },

          { text: "\nServicios con Mayores Ingresos", style: "subheader" },
          {
            text: "Lista de los Servicios con Mayor Índice de Pagos en el Período Especificado.",
          },
          {
            table: {
              headerRows: 1,
              widths: ["*", "auto"],
              body: [
                ["Servicio", "Total"],
                ...reportData[3].map((service) => [
                  service.service_name + " (" + service.collector + ")",
                  `$${service.amount}`,
                ]),
              ],
            },
            margin: [0, 10, 0, 10],
            layout: "lightHorizontalLines",
          },
        ],

        footer: (currentPage, pageCount) => ({
          text: `Página ${currentPage} de ${pageCount}\n © ${new Date().getFullYear()} - Banco Bambú de El Salvador S.A®`,
          alignment: "center",
          margin: [0, 10],
          fontSize: 10,
          color: "#000000",
        }),

        styles: {
          header: {
            fontSize: 20,
            bold: true,
            color: "#000000",
            margin: [0, 0, 0, 10],
          },
          period: {
            fontSize: 11,
            color: "#1a2d3f",
          },
          subheader: {
            fontSize: 14,
            bold: true,
            color: "#000000",
            margin: [0, 10, 0, 5],
          },
          tableHeader: {
            color: "#ffffff",
            fontSize: 12,
            bold: false,
          },
          tableBody: {
            fontSize: 12,
            color: "#000000",
          },
        },

        pageMargins: [40, 60, 40, 60],
      };

      pdfMake.createPdf(docDefinition).download(`${title} - ${period}.pdf`);
    } catch (error) {
      setAlertMessage.error(
        "Ha Ocurrido Un Error Inesperado, Por Favor Intente en unos Instantes"
      );
    }
  };

  const reports = [
    { title: "Reporte Diario", period: periods.diary },
    { title: "Reporte Semanal", period: periods.weekly },
    { title: "Reporte Mensual", period: periods.monthly },
    { title: "Reporte Trimestral", period: periods.quarterly },
    { title: "Reporte Semestral", period: periods.semiannual },
    { title: "Reporte Anual", period: periods.anual },
  ];

  return (
    <Modal
      title={
        <Row align="middle">
          <Col>
            <FileTextOutlined
              style={{ marginRight: 8, color: "var(--blue)" }}
            />
          </Col>
          <Col>
            <label className="fs-6 text-black">Ver Reportes</label>
          </Col>
        </Row>
      }
      centered
      width={900}
      open={isOpen}
      onCancel={isClosed}
      footer={null}
    >
      {reports.map((report, index) => (
        <Card key={index} hoverable className="mb-2">
          <div className="row align-items-center">
            <div className="col-8">
              <label className="fw-semibold text-black">
                {report.title} <br />
                <span
                  className="fw-normal"
                  style={{ color: "var(--gray)", fontSize: "13px" }}
                >
                  Período: {report.period}
                </span>
              </label>
            </div>
            <div className="col-4 text-end">
              <Button
                type="primary"
                onClick={() => generateReport(report.title, report.period)}
              >
                <DownloadOutlined />
                Descargar PDF
              </Button>
            </div>
          </div>
        </Card>
      ))}
      <div className="text-end mt-3">
        <Button type="primary" onClick={isClosed}>
          Cerrar
        </Button>
      </div>
    </Modal>
  );
};

export default ViewReportsModal;
