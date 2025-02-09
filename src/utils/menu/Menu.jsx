import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import {
  LineChartOutlined,
  TeamOutlined,
  TransactionOutlined,
  CheckCircleOutlined,
  UserOutlined,
  LeftOutlined,
  RightOutlined,
  SolutionOutlined,
  AuditOutlined,
  LogoutOutlined,
  HistoryOutlined,
  BulbOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext/AuthContext";
import { useMediaQuery } from "react-responsive";

const MenuList = ({ darkTheme, collapsed, setCollapsed }) => {
  const { authState } = useAuth();
  const token = authState.token;
  const user_id = authState.user_id;
  const navigate = useNavigate();
  const isSupervisor = authState.isSupervisor;

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isDesktop = useMediaQuery({ query: "(min-width: 769px)" });

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    } else if (isDesktop) {
      setCollapsed(false);
    }
  }, [isMobile, isDesktop, setCollapsed]);

  const menuItems = [
    isSupervisor
      ? {
          key: "/dashboard",
          icon: <LineChartOutlined className="text-white" />,
          label: "Dashboard",
          className: "text-white",
        }
      : null,
    {
      key: "/customers",
      icon: <TeamOutlined className="text-white" />,
      label: "Clientes",
      className: "text-white",
    },
    isSupervisor
      ? {
          key: "/collectors-menu",
          icon: <SolutionOutlined className="text-white" />,
          label: "Colectores",
          className: "text-white",
          children: [
            {
              key: "/collectors",
              icon: <SolutionOutlined className="text-white" />,
              label: "Colectores",
              className: "text-white",
            },
            {
              key: "/services",
              icon: <BulbOutlined className="text-white" />,
              label: "Servicios",
              className: "text-white",
            },
          ],
        }
      : null,
    {
      key: "/payments-collectors",
      icon: <DollarCircleOutlined className="text-white" />,
      label: "Pagos a Colectores",
      className: "text-white",
    },
    {
      key: "/transactions-menu",
      icon: <TransactionOutlined className="text-white" />,
      label: "Transacciones",
      className: "text-white",
      children: [
        {
          key: "/transactions",
          icon: <TransactionOutlined className="text-white" />,
          label: "Transacciones",
          className: "text-white",
        },
        isSupervisor
          ? {
              key: "/transaction-types",
              icon: <AuditOutlined className="text-white" />,
              label: "Tipos de Transacciones",
              className: "text-white",
            }
          : null,
      ].filter(Boolean),
    },
    isSupervisor
      ? {
          key: "/approvals",
          icon: <CheckCircleOutlined className="text-white" />,
          label: "Aprobaciones",
          className: "text-white",
        }
      : null,
    isSupervisor
      ? {
          key: "/users",
          icon: <UserOutlined className="text-white" />,
          label: "Usuarios",
          className: "text-white",
        }
      : null,
    isSupervisor
      ? {
          key: "/audit",
          icon: <HistoryOutlined className="text-white" />,
          label: "Auditoría",
          className: "text-white",
        }
      : null,
    !isSupervisor
      ? {
          key: "/logout",
          icon: <LogoutOutlined className="text-white" />,
          label: "Salir",
          className: "text-white",
        }
      : null,

    !isMobile
      ? {
          key: "#",
          icon: collapsed ? (
            <RightOutlined className="text-white" />
          ) : (
            <LeftOutlined className="text-white" />
          ),
          label: collapsed ? "Abrir Menú" : "Cerrar Menú",
          className: "toggle",
          onClick: () => setCollapsed(!collapsed),
        }
      : null,
  ];

  const logout = async () => {
    const response = await fetch(
      `http://localhost:3001/login/logout/${user_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      window.location.href = "/";
      localStorage.clear();
    }
  };

  return (
    <>
      <Menu
        theme={darkTheme ? "dark" : "light"}
        style={{
          backgroundColor: darkTheme ? "var(--gray)" : "var(--gray)",
          color: darkTheme ? "#ffffff" : "var(--blue)",
        }}
        mode="inline"
        items={menuItems}
        className="menu-bar"
        onClick={({ key }) => {
          if (key === "/logout") {
            logout();
          } else {
            navigate(key);
          }
        }}
      />
    </>
  );
};

export default MenuList;
