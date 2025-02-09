import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import { Card, Empty } from "antd";
import { useAuth } from "../../../contexts/authContext/AuthContext";

const DashboardCharts = ({
  datesRange,
  amountRangeFilter,
  transactionTypeFilter,
  refreshCharts,
}) => {
  const { authState } = useAuth();
  const [transactionsByDate, setTransactionsByDate] = useState([]);
  const [approvalAndRejectionRates, setApprovalAndRejectionRates] = useState(
    []
  );
  const [totalProcessedAmount, setTotalProcessedAmounts] = useState([]);
  const [paymentsByCollector, setPaymentsByCollector] = useState([]);
  const [
    paymentsByCollectorDenominations,
    setPaymentsByCollectorDenominations,
  ] = useState([]);
  const [customersWithTheMostMoneyPaid, setCustomersWithTheMostMoneyPaid] =
    useState([]);
  const token = authState.token;

  const getTransactionsByDateAndAmountRangeAndType = async (
    start = datesRange[0].format("YYYY-MM-DD"),
    end = datesRange[1].format("YYYY-MM-DD")
  ) => {
    const response = await fetch(
      `http://localhost:3001/dashboard/transactions-by-dates/${start}/${end}/${amountRangeFilter}/${transactionTypeFilter}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const transactionsByDateAndTypeData = await response.json();
    setTransactionsByDate(transactionsByDateAndTypeData);
  };

  const getApprovalAndRejectionRates = async (
    start = datesRange[0].format("YYYY-MM-DD"),
    end = datesRange[1].format("YYYY-MM-DD")
  ) => {
    const response = await fetch(
      `http://localhost:3001/dashboard/approval-and-rejection-rates/${start}/${end}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const approvalAndRejectionRatesData = await response.json();
    setApprovalAndRejectionRates(approvalAndRejectionRatesData);
  };

  const getProccessedAmountByTransactionsAndCollectorsPayments = async (
    start = datesRange[0].format("YYYY-MM-DD"),
    end = datesRange[1].format("YYYY-MM-DD")
  ) => {
    const response = await fetch(
      `http://localhost:3001/dashboard/processed-amount-by-transactions-and-collectors-payments/${start}/${end}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const totalProcessedAmountsData = await response.json();
    setTotalProcessedAmounts(totalProcessedAmountsData);
  };

  const getPaymentsByCollector = async () => {
    const response = await fetch(
      "http://localhost:3001/dashboard/payments-by-collector",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const customersWithTheMostMoneyPaidData = await response.json();
    setCustomersWithTheMostMoneyPaid(customersWithTheMostMoneyPaidData);
  };

  useEffect(() => {
    getTransactionsByDateAndAmountRangeAndType();
  }, [
    datesRange[0],
    datesRange[1],
    amountRangeFilter,
    transactionTypeFilter,
    refreshCharts,
  ]);

  useEffect(() => {
    getApprovalAndRejectionRates();
    getProccessedAmountByTransactionsAndCollectorsPayments();
  }, [datesRange[0], datesRange[1], refreshCharts]);

  useEffect(() => {
    getCustomersWithTheMostMoneyPaid();
    getPaymentsByCollector();
    getPaymentsByCollectorDenominations();
  }, [refreshCharts]);

  //Transactions by Date
  const barTransactionsByDateCanvasRef = useRef(null);
  const barTransactionsByDateChartInstance = useRef(null);

  //Approval And Rejection Rates
  const doughnutRatesCanvasRef = useRef(null);
  const doughnutRatesChartInstance = useRef(null);

  //Total ProccessedAmount
  const pieProccessedAmountCanvasRef = useRef(null);
  const pieProccessedAmountChartInstance = useRef(null);

  //Customers With The Most Money Paid
  const barCustomersWhitMostMoneyPaidRef = useRef(null);
  const barCustomersWhitMostMoneyPaidChartInstance = useRef(null);

  //Payments Collectors
  const doughnutPaymentsByCollectorCanvasRef = useRef(null);
  const doughnutPaymentsByCollectorChartInstance = useRef(null);

  //Payments Collectors - Denominations
  const doughnutPaymentsCollectorDenominationsCanvasRef = useRef(null);
  const doughnutPaymentsCollectorDenominationsChartInstance = useRef(null);

  const colors = [
    "#007bff", // Azul Intenso
    "#0056b3", // Azul Oscuro
    "#4c9aff", // Azul Claro
    "#9ecbff", // Azul Suave
    "#ffb41f", // Amarillo Dorado
    "#e9a41f", // Amarillo Mostaza
    "#ffd16f", // Amarillo Claro
    "#ffdf7b", // Amarillo Suave
    "#16bb69", // Verde Neón
    "#12a35a", // Verde Oscuro
    "#8cff99", // Verde Pastel
    "#99ffbd", // Verde Suave
    "#ff3131", // Rojo Brillante
    "#e60000", // Rojo Intenso
    "#ff7b7b", // Rojo Claro
    "#ff5a5a", // Rojo Coral
    "#1a2d3f", // Azul Oscuro
    "#142230", // Azul Noche Profunda
    "#2d4b66", // Azul Acero
    "#4c6f8f", // Azul Tempestad
    "#6f8eaf", // Azul Nebuloso
    "#00b0a6", // Verde Turquesa
    "#008f7f", // Verde Oscuro
    "#a6fffb", // Verde Aqua Claro
    "#a0d7cc", // Verde Menta Suave
    "#d9e9ff", // Azul Pálido
    "#a8c8ff", // Azul Pastel Claro
    "#6fafff", // Azul Cielo
    "#4a88ff", // Azul Eléctrico
    "#ff9f00", // Naranja Intenso
    "#ffb74d", // Naranja Pastel
    "#ff6e00", // Naranja Oscuro
    "#ffd47f", // Naranja Claro
    "#e1e1e1", // Gris Claro
    "#b0b0b0", // Gris Suave
    "#f2f2f2", // Gris Pálido
    "#d8d8d8", // Gris Claro Suave
    "#b8b8b8", // Gris Neutro
    "#c3c3c3", // Gris Claro Median
    "#9a9a9a", // Gris Medio
    "#9fa8da", // Azul Grisáceo
    "#6b7dff", // Azul Lavanda
    "#7f5fdb", // Púrpura Suave
    "#d6a9ff", // Lavanda Claro
    "#e3c5ff", // Lavanda Pastel
    "#add8e6", // Cian Claro
    "#b5e0d8", // Verde Claro Aqua
    "#d1f1f4", // Azul Hielo Claro
    "#b3e3f2", // Azul Suave Claro
    "#c1c1c1", // Gris Neutro Claro
    "#f9f9f9", // Blanco Suave
  ];

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
            backgroundColor: [colors[0], colors[12]],
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
                label: function (context) {
                  const index = context.dataIndex;
                  return `Transacciones ${status[index]}: ${context.raw}`;
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

    // Total ProccessedAmount
    if (totalProcessedAmount.length > 0) {
      const transaction_type = totalProcessedAmount.map(
        (proccessedAmount) => proccessedAmount.transaction_type
      );

      const totals = totalProcessedAmount.map(
        (proccessedAmount) => proccessedAmount.transaction_amount
      );

      const pieTotalProcessedAmountChart =
        pieProccessedAmountCanvasRef.current.getContext("2d");

      const pieTotalProcessedAmountData = {
        labels: transaction_type,
        datasets: [
          {
            data: totals,
            backgroundColor: [colors[0], colors[4], colors[8], colors[12]],
          },
        ],
      };

      const pieTotalProcessedAmountConfig = {
        type: "pie",
        data: pieTotalProcessedAmountData,
        options: {
          aspectRatio: 2,
          maintainAspectRatio: true,
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Montos Procesados por Tipo de Transacción",
              color: "#000000",
            },
            tooltip: {
              callbacks: {
                label: function (total, data) {
                  return "Total Procesado: $" + total.formattedValue;
                },
              },
            },
          },
          borderWidth: 0,
        },
      };

      pieProccessedAmountChartInstance.current = new Chart(
        pieTotalProcessedAmountChart,
        pieTotalProcessedAmountConfig
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
              text: "Top 5 - Clientes con Mayor Monto de Pagos a Colectores Procesados",
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

    return () => {
      if (barTransactionsByDateChartInstance.current) {
        barTransactionsByDateChartInstance.current.destroy();
      }

      if (doughnutRatesChartInstance.current) {
        doughnutRatesChartInstance.current.destroy();
      }

      if (pieProccessedAmountChartInstance.current) {
        pieProccessedAmountChartInstance.current.destroy();
      }

      if (barCustomersWhitMostMoneyPaidChartInstance.current) {
        barCustomersWhitMostMoneyPaidChartInstance.current.destroy();
      }

      if (doughnutPaymentsByCollectorChartInstance.current) {
        doughnutPaymentsByCollectorChartInstance.current.destroy();
      }

      if (doughnutPaymentsCollectorDenominationsChartInstance.current) {
        doughnutPaymentsCollectorDenominationsChartInstance.current.destroy();
      }
    };
  }, [
    transactionsByDate,
    approvalAndRejectionRates,
    customersWithTheMostMoneyPaid,
    paymentsByCollector,
    paymentsByCollectorDenominations,
  ]);

  return (
    <>
      <div className="row mb-2">
        <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12">
          <Card
            className={`mb-2 h-100 cursor-pointer ${
              transactionsByDate.length === 0
                ? "d-flex align-items-center justify-content-center"
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
            className={`mb-2 cursor-pointer ${
              approvalAndRejectionRates.length === 0
                ? "d-flex align-items-center justify-content-center"
                : ""
            }`}
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
          <Card
            className={`mb-2 cursor-pointer ${
              totalProcessedAmount.length === 0
                ? "d-flex align-items-center justify-content-center"
                : ""
            }`}
            bodyStyle={{ padding: 0 }}
          >
            {totalProcessedAmount.length === 0 ? (
              <Empty />
            ) : (
              <canvas
                className="ms-2 me-2 mb-2"
                ref={pieProccessedAmountCanvasRef}
              ></canvas>
            )}
          </Card>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-12 col-md-12 col-sm-12 text-start">
          <label className="fw-semibold fs-5 text-blackfw-semibold fs-5 text-black pt-3 pb-3 text-black">
            {" "}
            Clientes Destacados y Colectores
          </label>
        </div>
        <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 mb-2">
          <Card
            className={`mb-2 h-100 cursor-pointer ${
              customersWithTheMostMoneyPaid.length === 0
                ? "d-flex align-items-center justify-content-center"
                : ""
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
        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 mb-2">
          <Card
            className={`mb-2 cursor-pointer ${
              paymentsByCollector.length === 0
                ? "d-flex align-items-center justify-content-center"
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
            className={`cursor-pointer ${
              paymentsByCollectorDenominations.length === 0
                ? "d-flex align-items-center justify-content-center"
                : ""
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
    </>
  );
};

export default DashboardCharts;
