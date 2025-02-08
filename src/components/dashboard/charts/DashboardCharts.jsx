import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import { Card, Carousel, Empty } from "antd";

const DashboardCharts = ({
  datesRange,
  amountRangeFilter,
  transactionTypeFilter,
}) => {
  const [transactionsByDate, setTransactionsByDate] = useState([]);
  const [paymentsByCollector, setPaymentsByCollector] = useState([]);
  const [
    paymentsByCollectorDenominations,
    setPaymentsByCollectorDenominations,
  ] = useState([]);
  const [customersWithTheMostMoneyPaid, setCustomersWithTheMostMoneyPaid] =
    useState([]);
  const [approvalAndRejectionRates, setApprovalAndRejectionRates] = useState(
    []
  );

  //Transactions by Date
  const barTransactionsByDateCanvasRef = useRef(null);
  const barTransactionsByDateChartInstance = useRef(null);

  //Payments Collectors
  const doughnutPaymentsByCollectorCanvasRef = useRef(null);
  const doughnutPaymentsByCollectorChartInstance = useRef(null);

  //Payments Collectors - Denominations
  const doughnutPaymentsCollectorDenominationsCanvasRef = useRef(null);
  const doughnutPaymentsCollectorDenominationsChartInstance = useRef(null);

  //Customers With The Most Money Paid
  const barCustomersWhitMostMoneyPaidRef = useRef(null);
  const barCustomersWhitMostMoneyPaidChartInstance = useRef(null);

  //Approval And Rejection Rates
  const doughnutRatesCanvasRef = useRef(null);
  const doughnutRatesChartInstance = useRef(null);

  const colors = [
    "#3e9bff", // Azul Intenso
    "#6f99ff", // Azul Pastel
    "#b0cfff", // Azul Claro
    "#d3e7ff", // Azul Hielo
    "#ff7b7b", // Rojo Sandía
    "#ffb7b7", // Rosa Salmón
    "#ffd3d3", // Rosa Pálido
    "#7bffb5", // Verde Menta
    "#b7ffd1", // Verde Neón
    "#d3ffe3", // Verde Claro
    "#ffdc7b", // Amarillo Dorado
    "#ffe6b7", // Amarillo Suave
    "#fff3d3", // Amarillo Pálido
    "#7bdcff", // Cian Vibrante
    "#b7e9ff", // Cian Claro
    "#d3f3ff", // Cian Suave
    "#c17bff", // Púrpura Brillante
    "#d9b7ff", // Púrpura Pastel
    "#eed3ff", // Lavanda Claro
    "#7bffd6", // Turquesa Claro
    "#b7ffe3", // Turquesa Suave
  ];

  const getTransactionsByDateAndAmountRangeAndType = async (
    start = datesRange[0].format("YYYY-MM-DD"),
    end = datesRange[1].format("YYYY-MM-DD")
  ) => {
    const response = await fetch(
      `http://localhost:3001/dashboard/transactions-by-dates/${start}/${end}/${amountRangeFilter}/${transactionTypeFilter}`,
      {
        method: "GET",
      }
    );

    const transactionsByDateAndTypeData = await response.json();
    setTransactionsByDate(transactionsByDateAndTypeData);
  };

  const getPaymentsByCollector = async () => {
    const response = await fetch(
      "http://localhost:3001/dashboard/payments-by-collector",
      {
        method: "GET",
      }
    );

    const paymentsByCollectorData = await response.json();
    setPaymentsByCollector(paymentsByCollectorData);
  };

  const getPaymentsByCollectorDenominations = async () => {
    const response = await fetch(
      "http://localhost:3001/dashboard/payments-by-collector-denominations",
      {
        method: "GET",
      }
    );

    const paymentsByCollectorDenominationsData = await response.json();
    setPaymentsByCollectorDenominations(paymentsByCollectorDenominationsData);
  };

  const getCustomersWithTheMostMoneyPaid = async () => {
    const response = await fetch(
      "http://localhost:3001/dashboard/customers-with-the-most-money-paid",
      {
        method: "GET",
      }
    );

    const customersWithTheMostMoneyPaidData = await response.json();
    setCustomersWithTheMostMoneyPaid(customersWithTheMostMoneyPaidData);
  };

  const getApprovalAndRejectionRates = async () => {
    const response = await fetch(
      "http://localhost:3001/dashboard/approval-and-rejection-rates",
      {
        method: "GET",
      }
    );

    const approvalAndRejectionRatesData = await response.json();
    setApprovalAndRejectionRates(approvalAndRejectionRatesData);
  };

  useEffect(() => {
    getTransactionsByDateAndAmountRangeAndType();
  }, [datesRange[0], datesRange[1], amountRangeFilter, transactionTypeFilter]);

  useEffect(() => {
    getPaymentsByCollector();
    getPaymentsByCollectorDenominations();
    getCustomersWithTheMostMoneyPaid();
    getApprovalAndRejectionRates();
  }, []);

  useEffect(() => {
    // Transactions
    if (transactionsByDate.length > 0) {
      const dates = transactionsByDate.map(
        (transactionByDate) => transactionByDate.label
      );

      const totalsByDates = transactionsByDate.map(
        (transactionByDate) => transactionByDate.totalAmount
      );

      const barTransactionsByDateChart =
        barTransactionsByDateCanvasRef.current.getContext("2d");

      const barTransactionsByDateData = {
        labels: dates,
        datasets: [
          {
            data: totalsByDates,
            backgroundColor: colors,
          },
        ],
      };

      const barTransactionsByDateConfig = {
        type: "bar",
        data: barTransactionsByDateData,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text:
                transactionTypeFilter === 1
                  ? "Depositos"
                  : transactionTypeFilter === 2
                  ? "Retiros"
                  : transactionTypeFilter === 3
                  ? "Transacciones"
                  : "",
              color: "#000000",
            },
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (total, data) {
                  return (
                    `Total ${
                      transactionTypeFilter === 1
                        ? "Depositado"
                        : transactionTypeFilter === 2
                        ? "Retirado"
                        : transactionTypeFilter === 3
                        ? "Transferido"
                        : ""
                    } $` + total.formattedValue
                  );
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              grid: {
                display: false,
              },
            },
          },
        },
      };

      barTransactionsByDateChartInstance.current = new Chart(
        barTransactionsByDateChart,
        barTransactionsByDateConfig
      );
    }

    // Payments by Collector
    if (paymentsByCollector.length > 0) {
      const collectors = paymentsByCollector.map(
        (paymentByCollector) => paymentByCollector.collector
      );

      const totals = paymentsByCollector.map(
        (paymentByCollector) => paymentByCollector.transactionsByCollector
      );

      const doughnutPaymentsByCollectorChart =
        doughnutPaymentsByCollectorCanvasRef.current.getContext("2d");

      const doughnutPaymentsByCollectorData = {
        labels: collectors,
        datasets: [
          {
            data: totals,
            backgroundColor: colors,
          },
        ],
      };

      const doughnutPaymentsByCollectorConfig = {
        type: "doughnut",
        data: doughnutPaymentsByCollectorData,
        options: {
          aspectRatio: 2,
          maintainAspectRatio: true,
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Pagos por Colector",
              color: "#000000",
            },
            tooltip: {
              callbacks: {
                label: function (total, data) {
                  return "Total de Pago(s): " + total.formattedValue;
                },
              },
            },
          },
          borderWidth: 0,
        },
      };

      doughnutPaymentsByCollectorChartInstance.current = new Chart(
        doughnutPaymentsByCollectorChart,
        doughnutPaymentsByCollectorConfig
      );
    }

    // Payments by Collectors - Denominations
    if (paymentsByCollectorDenominations.length > 0) {
      const denominations = paymentsByCollectorDenominations.map(
        (denomination) => denomination.denomination
      );

      const totalByDenomination = paymentsByCollectorDenominations.map(
        (denomination) => denomination.total
      );

      const doughnutPaymentsByCollectorDenominationsChart =
        doughnutPaymentsCollectorDenominationsCanvasRef.current.getContext(
          "2d"
        );

      const doughnutPaymentsByCollectorDenominationsData = {
        labels: denominations,
        datasets: [
          {
            data: totalByDenomination,
            backgroundColor: colors,
          },
        ],
      };

      const doughnutPaymentsByCollectorDenominationsConfig = {
        type: "doughnut",
        data: doughnutPaymentsByCollectorDenominationsData,
        options: {
          aspectRatio: 2,
          maintainAspectRatio: true,
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Pagos a Colectores - Denominaciones",
              color: "#000000",
              margin: {
                bottom: 20,
              },
            },
            legend: {
              position: "left",
              labels: {
                boxWidth: 20,
                padding: 10,
              },
            },
            tooltip: {
              callbacks: {
                label: function (total, data) {
                  return "Cantidad: " + total.formattedValue;
                },
              },
            },
          },
          borderWidth: 0,
        },
      };

      doughnutPaymentsCollectorDenominationsChartInstance.current = new Chart(
        doughnutPaymentsByCollectorDenominationsChart,
        doughnutPaymentsByCollectorDenominationsConfig
      );
    }

    // Customers With The Most Money Paid
    if (customersWithTheMostMoneyPaid.length > 0) {
      const customers = customersWithTheMostMoneyPaid.map(
        (customer) => customer.customer
      );

      const amounts = customersWithTheMostMoneyPaid.map(
        (customer) => customer.amount
      );

      const barCustomersWhitMostMoneyPaidChart =
        barCustomersWhitMostMoneyPaidRef.current.getContext("2d");

      const barbarCustomersWhitMostMoneyPaidData = {
        labels: customers,
        datasets: [
          {
            data: amounts,
            backgroundColor: colors,
          },
        ],
      };

      const barCustomersWhitMostMoneyPaidConfig = {
        type: "bar",
        data: barbarCustomersWhitMostMoneyPaidData,
        options: {
          aspectRatio: 2,
          maintainAspectRatio: true,
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Top 5 Clientes con Mayor Monto de Pagos Procesados",
              color: "#000000",
              margin: {
                bottom: 20,
              },
            },
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (total, data) {
                  return (
                    "Monto Total Cancelado en Pagos: $" + total.formattedValue
                  );
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              grid: {
                display: false,
              },
            },
          },
        },
      };

      barCustomersWhitMostMoneyPaidChartInstance.current = new Chart(
        barCustomersWhitMostMoneyPaidChart,
        barCustomersWhitMostMoneyPaidConfig
      );
    }

    // Approval and Rejection Rates
    if (approvalAndRejectionRates.length > 0) {
      const status = approvalAndRejectionRates.map(
        (rate) => rate.transaction_type
      );

      const approvedOrRejected = approvalAndRejectionRates.map(
        (rate) => rate.total_transactions
      );

      const doughnutRatesChart =
        doughnutRatesCanvasRef.current.getContext("2d");

      const doughnutRatesData = {
        labels: status,
        datasets: [
          {
            data: approvedOrRejected,
            backgroundColor: [colors[0], colors[4]],
          },
        ],
      };

      const doughnutRatesConfig = {
        type: "bar",
        data: doughnutRatesData,
        options: {
          indexAxis: "y",
          aspectRatio: 2,
          maintainAspectRatio: true,
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Tasa de Aprobaciones y Rechazos - Transacciones",
              color: "#000000",
            },
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (total, data) {
                  return (
                    `Total de Transacciones ${status[0]}: ` +
                    total.formattedValue
                  );
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              grid: {
                display: false,
              },
            },
          },
        },
      };

      doughnutRatesChartInstance.current = new Chart(
        doughnutRatesChart,
        doughnutRatesConfig
      );
    }

    return () => {
      if (barTransactionsByDateChartInstance.current) {
        barTransactionsByDateChartInstance.current.destroy();
      }

      if (doughnutPaymentsByCollectorChartInstance.current) {
        doughnutPaymentsByCollectorChartInstance.current.destroy();
      }

      if (doughnutPaymentsCollectorDenominationsChartInstance.current) {
        doughnutPaymentsCollectorDenominationsChartInstance.current.destroy();
      }

      if (barCustomersWhitMostMoneyPaidChartInstance.current) {
        barCustomersWhitMostMoneyPaidChartInstance.current.destroy();
      }

      if (doughnutRatesChartInstance.current) {
        doughnutRatesChartInstance.current.destroy();
      }
    };
  }, [
    transactionsByDate,
    paymentsByCollector,
    paymentsByCollectorDenominations,
    customersWithTheMostMoneyPaid,
    approvalAndRejectionRates,
  ]);

  return (
    <>
      <div className="row mb-2">
        <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 mb-1">
          <Card
            className={`mb-2 ${
              transactionsByDate.length === 0
                ? "d-flex justify-content-center align-items-center h-100"
                : ""
            }`}
            bodyStyle={{ padding: 0 }}
          >
            {transactionsByDate.length === 0 ? (
              <Empty />
            ) : (
              <canvas
                className="ms-3 me-3 mb-4"
                ref={barTransactionsByDateCanvasRef}
              ></canvas>
            )}
          </Card>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
          <Card
            className={`mb-2 ${
              paymentsByCollector.length === 0
                ? "d-flex justify-content-center align-items-center h-100"
                : ""
            }`}
            bodyStyle={{ padding: 0 }}
          >
            {paymentsByCollector.length === 0 ? (
              <Empty />
            ) : (
              <canvas
                className="mb-2"
                ref={doughnutPaymentsByCollectorCanvasRef}
              ></canvas>
            )}
          </Card>
          <Card
            className={`${
              paymentsByCollectorDenominations.length === 0 ? "" : ""
            }`}
            bodyStyle={{ padding: 0 }}
          >
            {paymentsByCollectorDenominations.length === 0 ? (
              <Empty />
            ) : (
              <canvas
                className="mb-2"
                ref={doughnutPaymentsCollectorDenominationsCanvasRef}
              ></canvas>
            )}
          </Card>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-6 col-md-8 col-sm-12 text-start">
          <label className="fw-semibold fs-5 text-blackfw-semibold fs-5 text-black mb-2 mt-2 text-black">
            {" "}
            Transacciones y Clientes Destacados{" "}
          </label>
        </div>
        <div className="col-xl-7 col-md-7 col-sm-12">
          <Card
            className={`${
              customersWithTheMostMoneyPaid.length === 0 ? "" : ""
            }`}
            bodyStyle={{ padding: 0 }}
          >
            {customersWithTheMostMoneyPaid.length === 0 ? (
              <Empty />
            ) : (
              <canvas
                className="ms-2 me-2 mb-2"
                ref={barCustomersWhitMostMoneyPaidRef}
              ></canvas>
            )}
          </Card>
        </div>
        <div className="col-xl-5 col-md-5 col-sm-12">
          <Card
            className={`${approvalAndRejectionRates.length === 0 ? "" : ""}`}
            bodyStyle={{ padding: 0 }}
          >
            {approvalAndRejectionRates.length === 0 ? (
              <Empty />
            ) : (
              <canvas
                className="ms-2 me-2 mb-2"
                ref={doughnutRatesCanvasRef}
              ></canvas>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default DashboardCharts;
