import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js";

const PaymentsCollectorsCharts = () => {
  const [paymentsByCollectors, setPaymentsByCollectors] = useState([]);
  const paymentsByCollectorChartRef = useRef(null);
  const paymentsByCollectorChartInstance = useRef(null);

  const getPaymentsByCollectors = async () => {
    const response = await fetch(
      "http://localhost:3001/payments-collectors/payments-by-collector",
      {
        method: "GET",
      }
    );

    const paymentsByCollectorsData = await response.json();
    console.log(paymentsByCollectorsData);
    setPaymentsByCollectors(paymentsByCollectorsData);
  };

  useEffect(() => {
    getPaymentsByCollectors();
  }, []);

  useEffect(() => {
    if (paymentsByCollectors.length === 0) return;

    const services = paymentsByCollectors.map(
      (paymentByCollector) => paymentByCollector.service
    );

    const percentage = paymentsByCollectors.map(
      (paymentByCollector) => paymentByCollector.percentage
    );

    const piePaymentsByCollectorChart =
      paymentsByCollectorChartRef.current.getContext("2d");

    const piePaymentsByCollectorData = {
      labels: services,
      datasets: [
        {
          data: percentage,
          backgroundColor: [
            "#007bff",
            "#6f99ff",
            "#b0cfff",
            "#d3e7ff",
            "#ff7b7b",
            "#ffb7b7",
            "#ffd3d3",
            "#7bffb5",
            "#b7ffd1",
            "#d3ffe3",
            "#ffdc7b",
            "#ffe6b7",
            "#fff3d3",
            "#7bdcff",
            "#b7e9ff",
            "#d3f3ff",
            "#c17bff",
            "#d9b7ff",
            "#eed3ff",
            "#7bffd6",
            "#b7ffe3",
          ],
        },
      ],
    };

    const piePaymentsByCollectorConfig = {
      type: "pie",
      data: piePaymentsByCollectorData,
      options: {
        aspectRatio: 2,
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: "Pagos Obtenidos por Colector",
            color: "#000000",
          },
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (percentage, data) {
                return Math.round(percentage.formattedValue) + "% de los Pagos";
              },
            },
          },
        },
        borderWidth: 0,
      },
    };

    if (paymentsByCollectorChartInstance.current) {
      paymentsByCollectorChartInstance.current.destroy();
    }

    paymentsByCollectorChartInstance.current = new Chart(
      piePaymentsByCollectorChart,
      piePaymentsByCollectorConfig
    );

    return () => {
      if (paymentsByCollectorChartInstance.current) {
        paymentsByCollectorChartInstance.current.destroy();
      }
    };
  }, [paymentsByCollectors]);

  return <canvas ref={paymentsByCollectorChartRef}></canvas>;
};

export default PaymentsCollectorsCharts;
