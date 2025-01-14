import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js";

const CollectorsPaymentsChart = () => {
  const paymentsByCollectorChartRef = useRef(null);
  const paymentsByCollectorChartInstance = useRef(null);

  useEffect(() => {
    const piePaymentsByCollectorChart =
      paymentsByCollectorChartRef.current.getContext("2d");

    const piePaymentsByCollectorData = {
      labels: [
        "Collector 1",
        "Collector 2",
        "Collector 3",
        "Collector 4",
        "Collector 5",
      ],
      datasets: [
        {
          data: ["20", "40", "50", "60", "70", "80"],
          backgroundColor: [
            "#007bff",
            "#2A5C79",
            "#1d7c4a",
            "#FFB733",
            "#05b0ff",
            "#FF3333",
            "#8281D8",
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
  }, []);

  return <canvas ref={paymentsByCollectorChartRef}></canvas>;
};

export default CollectorsPaymentsChart;
