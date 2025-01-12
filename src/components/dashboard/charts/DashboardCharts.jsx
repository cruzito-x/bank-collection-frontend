import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const DashboardCharts = () => {
  const doughnutCanvasRef = useRef(null);
  const doughnutChartInstance = useRef(null);

  const barCanvasRef = useRef(null);
  const barChartInstance = useRef(null);

  useEffect(() => {
    const doughnutChart = doughnutCanvasRef.current.getContext("2d");
    const barChart = barCanvasRef.current.getContext("2d");

    const barData = {
      labels: ["Python", "JavaScript", "Java", "C++", "Data Structures"],
      datasets: [
        {
          data: [30, 20, 15, 10, 25],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4CAF50",
            "#9C27B0",
          ],
        },
      ],
    };

    const barConfig = {
      type: "bar",
      data: barData,
      options: {
        plugins: {
          title: {
            display: true,
            text: "Transacciones por Colector",
          },
        },
      },
    };

    const doughnutData = {
      labels: ["Python", "JavaScript", "Java", "C++", "Data Structures"],
      datasets: [
        {
          data: [30, 20, 15, 10, 25],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4CAF50",
            "#9C27B0",
          ],
        },
      ],
    };

    const doughnutConfig = {
      type: "doughnut",
      data: doughnutData,
      options: {
        plugins: {
          title: {
            display: true,
            text: "Monto Procesado - Denominaciones",
          },
        },
      },
    };

    if (barChartInstance.current) {
      barChartInstance.current.destroy();
    }

    if (doughnutChartInstance.current) {
      doughnutChartInstance.current.destroy();
    }

    barChartInstance.current = new Chart(barChart, barConfig);
    doughnutChartInstance.current = new Chart(doughnutChart, doughnutConfig);

    return () => {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }

      if (doughnutChartInstance.current) {
        doughnutChartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <>
      <div className="col-xl-8 col-lg-8 col-md-6 col-sm-12">
        <canvas id="bar-data" ref={barCanvasRef} width="100" height="50"></canvas>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <canvas id="doughnut-data" ref={doughnutCanvasRef} width="150" height="150"></canvas>
      </div>
    </>
  );
};

export default DashboardCharts;
