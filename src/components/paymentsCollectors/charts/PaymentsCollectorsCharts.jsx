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
            "#007bff", // Azul Intenso
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
