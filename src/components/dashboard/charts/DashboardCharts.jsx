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
            "#3e9bff",
            "#6f99ff",
            "#b0cfff",
            "#d3e7ff",
            "#ff7b7b",
            "#ffb7b7",
            "#ffd3d3",
            "#41d17f",
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
      labels: ["Luz", "Agua", "Internet", "UTEC", "UNAB"],
      datasets: [
        {
          data: [30, 20, 15, 10, 25],
          backgroundColor: [
            "#3e9bff",
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
      labels: ["$50", "$20", "$5", "$1", "$0.25", "$0.10"],
      datasets: [
        {
          data: [30, 20, 15, 10, 25, 17],
          backgroundColor: [
            "#3e9bff",
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
