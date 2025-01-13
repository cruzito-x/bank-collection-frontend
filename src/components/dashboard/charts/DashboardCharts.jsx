import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { Card } from "antd";

const DashboardCharts = () => {
  const barTransactionsCanvasRef = useRef(null);
  const barTransactionsChartInstance = useRef(null);

  const doughnutTransactionsCanvasRef = useRef(null);
  const doughnutTransactionsChartInstance = useRef(null);

  const doughnutAmountCanvasRef = useRef(null);
  const doughnutAmountChartInstance = useRef(null);

  useEffect(() => {
    const barTransactionsChart =
      barTransactionsCanvasRef.current.getContext("2d");
    const doughnutTransactionsChart =
      doughnutTransactionsCanvasRef.current.getContext("2d");
    const doughnutAmountChart =
      doughnutAmountCanvasRef.current.getContext("2d");

    const barTransactionsData = {
      labels: [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
      ],
      datasets: [
        {
          data: [100, 150, 120, 180, 130, 140, 72],
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

    const barTransactionsConfig = {
      type: "bar",
      data: barTransactionsData,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Transacciones",
            color: "#000000",
          },
          legend: {
            display: false,
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

    const doughnutAmountData = {
      labels: ["Python", "JavaScript", "Java", "C++", "Data Structures"],
      datasets: [
        {
          data: [30, 20, 15, 10, 25],
          backgroundColor: [
            "#f59321",
            "#89cd3f",
            "#007bff",
            "#a10b42",
            "#ea3158",
          ],
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
            text: "Transacciones por Colector",
            color: "#000000",
          },
        },
        borderWidth: 0,
      },
    };

    const doughnutTransactionsData = {
      labels: ["Python", "JavaScript", "Java", "C++", "Data Structures"],
      datasets: [
        {
          data: [30, 20, 15, 10, 25, 17],
          backgroundColor: [
            "#1abc9c",
            "#273543",
            "#ffac00",
            "#a0aec0",
            "#007bff",
            "#e0212f",
          ],
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
            text: "Monto Procesado - Denominaciones",
            color: "#000000",
          },
        },
        borderWidth: 0,
      },
    };

    if (barTransactionsChartInstance.current) {
      barTransactionsChartInstance.current.destroy();
    }

    if (doughnutAmountChartInstance.current) {
      doughnutAmountChartInstance.current.destroy();
    }

    if (doughnutTransactionsChartInstance.current) {
      doughnutTransactionsChartInstance.current.destroy();
    }

    barTransactionsChartInstance.current = new Chart(
      barTransactionsChart,
      barTransactionsConfig
    );

    doughnutAmountChartInstance.current = new Chart(
      doughnutAmountChart,
      doughnutAmountConfig
    );

    doughnutTransactionsChartInstance.current = new Chart(
      doughnutTransactionsChart,
      doughnutTransactionsConfig
    );

    return () => {
      if (doughnutAmountChartInstance.current) {
        doughnutAmountChartInstance.current.destroy();
      }

      if (doughnutTransactionsChartInstance.current) {
        doughnutTransactionsChartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="row">
      <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12">
        <Card className="shadow mb-2">
          <canvas
            className="ms-3 me-3 mb-4"
            ref={barTransactionsCanvasRef}
            style={{ width: "100%" }}
          ></canvas>
        </Card>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
        <Card className="shadow">
          <canvas
            className="mb-2"
            ref={doughnutAmountCanvasRef}
            style={{ width: "100%" }}
          ></canvas>
        </Card>
        <Card className="shadow mt-2">
          <canvas
            className="mb-2"
            ref={doughnutTransactionsCanvasRef}
            style={{ width: "100%" }}
          ></canvas>
        </Card>
      </div>
    </div>
  );
};

export default DashboardCharts;
