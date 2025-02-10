import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js";
import { useAuth } from "../../../contexts/authContext/AuthContext";
import moment from "moment";
import { Card, Empty } from "antd";

const PaymentsCollectorsCharts = ({ isOpen, dates }) => {
  const { authState } = useAuth();
  const [paymentsByCollectors, setPaymentsByCollectors] = useState([]);
  const [loadingPaymentsByCollectorsCard, setLoadingPaymentsByCollectorsCard] =
    useState(true);
  const paymentsByCollectorChartRef = useRef(null);
  const paymentsByCollectorChartInstance = useRef(null);
  const token = authState.token;

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

  const getPaymentsByCollectors = async () => {
    try {
      const startDay = moment(dates[0]).format("YYYY-MM-DD");
      const endDay = moment(dates[1]).format("YYYY-MM-DD");

      const response = await fetch(
        `http://localhost:3001/payments-collectors/payments-by-collector/${startDay}/${endDay}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const paymentsByCollectorsData = await response.json();
      setPaymentsByCollectors(paymentsByCollectorsData);
      setLoadingPaymentsByCollectorsCard(false);
    } catch (error) {}
  };

  useEffect(() => {
    if (isOpen && dates.length === 2) {
      getPaymentsByCollectors();
    }
  }, [isOpen, dates]);

  useEffect(() => {
    if (paymentsByCollectors.length === 0) return;

    const collectors = paymentsByCollectors.map(
      (paymentByCollector) => paymentByCollector.collector
    );

    const percentage = paymentsByCollectors.map(
      (paymentByCollector) => paymentByCollector.percentage
    );

    const piePaymentsByCollectorChart =
      paymentsByCollectorChartRef.current.getContext("2d");

    const piePaymentsByCollectorData = {
      labels: collectors,
      datasets: [
        {
          data: percentage,
          backgroundColor: colors,
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
            display: true,
            position: "left",
          },
          tooltip: {
            callbacks: {
              label: function (percentage, data) {
                return (
                  Math.round(percentage.formattedValue) +
                  "% del Total Procesado"
                );
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

  return (
    <Card loading={loadingPaymentsByCollectorsCard}>
      {paymentsByCollectors.length === 0 ? (
        <Empty />
      ) : (
        <canvas
          className="cursor-pointer"
          ref={paymentsByCollectorChartRef}
        ></canvas>
      )}
    </Card>
  );
};

export default PaymentsCollectorsCharts;
