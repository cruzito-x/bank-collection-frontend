import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import { Card, Carousel, Empty } from "antd";

const DashboardCharts = ({
  datesRange,
  amountRangeFilter,
  transactionTypeFilter,
}) => {
  const [transactionsByDate, setTransactionsByDate] = useState([]);
  const [transactionsByCollector, setTransactionsByCollector] = useState([]);
  const [transactionsByDenomination, setTransactionsByDenomination] = useState(
    []
  );
  const [customersWithTheMostMoneyPaid, setCustomersWithTheMostMoneyPaid] =
    useState([]);
  const [approvalAndRejectionRates, setApprovalAndRejectionRates] = useState(
    []
  );

  const barTransactionsCanvasRef = useRef(null);
  const barTransactionsChartInstance = useRef(null);

  const doughnutTransactionsCanvasRef = useRef(null);
  const doughnutTransactionsChartInstance = useRef(null);

  const doughnutAmountCanvasRef = useRef(null);
  const doughnutAmountChartInstance = useRef(null);

  const barCustomersWhitMostMoneyPaidRef = useRef(null);
  const barCustomersWhitMostMoneyPaidChartInstance = useRef(null);

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

  const getTransactionsByCollector = async () => {
    const response = await fetch(
      "http://localhost:3001/dashboard/transactions-by-collector",
      {
        method: "GET",
      }
    );

    const transactionsByCollectorData = await response.json();
    setTransactionsByCollector(transactionsByCollectorData);
  };

  const getTransactionsByDenomination = async () => {
    const response = await fetch(
      "http://localhost:3001/dashboard/transactions-by-denomination",
      {
        method: "GET",
      }
    );

    const transactionsByDenominationData = await response.json();
    setTransactionsByDenomination(transactionsByDenominationData);
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
    getTransactionsByCollector();
    getTransactionsByDenomination();
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

      const barTransactionsChart =
        barTransactionsCanvasRef.current.getContext("2d");

      const barTransactionsData = {
        labels: dates,
        datasets: [
          {
            data: totalsByDates,
            backgroundColor: colors,
          },
        ],
      };

      const barTransactionsConfig = {
        type: "bar",
        data: barTransactionsData,
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
                        ? "Retirdo"
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

      barTransactionsChartInstance.current = new Chart(
        barTransactionsChart,
        barTransactionsConfig
      );
    }

    // Transactions by Collector
    if (transactionsByCollector.length > 0) {
      const collectors = transactionsByCollector.map(
        (transactionByCollector) => transactionByCollector.collector
      );

      const totals = transactionsByCollector.map(
        (transactionByCollector) =>
          transactionByCollector.transactionsByCollector
      );

      const doughnutAmountChart =
        doughnutAmountCanvasRef.current.getContext("2d");

      const doughnutAmountData = {
        labels: collectors,
        datasets: [
          {
            data: totals,
            backgroundColor: colors,
          },
        ],
      };

      const doughnutAmountConfig = {
        type: "doughnut",
        data: doughnutAmountData,
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

      doughnutAmountChartInstance.current = new Chart(
        doughnutAmountChart,
        doughnutAmountConfig
      );
    }

    // Transactions by Denominations
    if (transactionsByDenomination.length > 0) {
      const denominations = transactionsByDenomination.map(
        (transactionByDenomination) => transactionByDenomination.denomination
      );

      const totalByDenomination = transactionsByDenomination.map(
        (transactionByDenomination) => transactionByDenomination.total
      );

      const doughnutTransactionsChart =
        doughnutTransactionsCanvasRef.current.getContext("2d");

      const doughnutTransactionsData = {
        labels: denominations,
        datasets: [
          {
            data: totalByDenomination,
            backgroundColor: colors,
          },
        ],
      };

      const doughnutTransactionsConfig = {
        type: "doughnut",
        data: doughnutTransactionsData,
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

      doughnutTransactionsChartInstance.current = new Chart(
        doughnutTransactionsChart,
        doughnutTransactionsConfig
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
        doughnutTransactionsCanvasRef.current.getContext("2d");

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
              text: "Ranking - Top 5 Clientes con más Pagos",
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

      barCustomersWhitMostMoneyPaidChartInstance.current = new Chart(
        barCustomersWhitMostMoneyPaidChart,
        barCustomersWhitMostMoneyPaidConfig
      );
    }

    // Approval and Rejection Rates
    if (approvalAndRejectionRates.length > 0) {
      const approvals = approvalAndRejectionRates.map(
        (rate) => rate.approved_transactions
      );

      const rejected = approvalAndRejectionRates.map(
        (rate) => rate.rejected_transactions
      );

      const doughnutRatesChart =
        doughnutRatesCanvasRef.current.getContext("2d");

      const doughnutRatesData = {
        labels: ["Aprobadas", "Rechazadas"],
        datasets: [
          {
            data: [approvals, rejected],
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
                  return "Total: " + total.formattedValue;
                },
              },
            },
          },
          borderWidth: 0,
        },
      };

      doughnutRatesChartInstance.current = new Chart(
        doughnutRatesChart,
        doughnutRatesConfig
      );
    }

    return () => {
      if (barTransactionsChartInstance.current) {
        barTransactionsChartInstance.current.destroy();
      }

      if (doughnutAmountChartInstance.current) {
        doughnutAmountChartInstance.current.destroy();
      }

      if (doughnutTransactionsChartInstance.current) {
        doughnutTransactionsChartInstance.current.destroy();
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
    transactionsByCollector,
    transactionsByDenomination,
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
                ref={barTransactionsCanvasRef}
              ></canvas>
            )}
          </Card>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
          <Card
            className={`mb-2 ${
              transactionsByCollector.length === 0
                ? "d-flex justify-content-center align-items-center h-100"
                : ""
            }`}
            bodyStyle={{ padding: 0 }}
          >
            {transactionsByCollector.length === 0 ? (
              <Empty />
            ) : (
              <canvas className="mb-2" ref={doughnutAmountCanvasRef}></canvas>
            )}
          </Card>
          <Card
            className={`${transactionsByDenomination.length === 0 ? "" : ""}`}
            bodyStyle={{ padding: 0 }}
          >
            {transactionsByDenomination.length === 0 ? (
              <Empty />
            ) : (
              <Carousel arrows infinite={false} dotPosition="bottom">
                <div>
                  <canvas
                    className="mb-2"
                    ref={doughnutTransactionsCanvasRef}
                  ></canvas>
                </div>
                <div></div>
              </Carousel>
            )}
          </Card>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-7">
          <Card
            className={`${
              customersWithTheMostMoneyPaid.length === 0 ? "" : ""
            }`}
            bodyStyle={{ padding: 0 }}
          >
            {customersWithTheMostMoneyPaid.length === 0 ? (
              <Empty />
            ) : (
              <div>
                <canvas
                  className="mb-2"
                  ref={barCustomersWhitMostMoneyPaidRef}
                ></canvas>
              </div>
            )}
          </Card>
        </div>
        <div className="col-xl-5">
          <Card
            className={`${approvalAndRejectionRates.length === 0 ? "" : ""}`}
            bodyStyle={{ padding: 0 }}
          >
            {approvalAndRejectionRates.length === 0 ? (
              <Empty />
            ) : (
              <div>
                <canvas className="mb-2" ref={doughnutRatesCanvasRef}></canvas>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default DashboardCharts;
