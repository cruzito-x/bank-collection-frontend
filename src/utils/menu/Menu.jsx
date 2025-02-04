import React from "react";
import { Menu } from "antd";
import {
  LineChartOutlined,
  TeamOutlined,
  WalletOutlined,
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
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext/AuthContext";
import { Footer } from "antd/es/layout/layout";

const MenuList = ({ darkTheme, collapsed, setCollapsed }) => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const isSupervisor = authState.isSupervisor;

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
      icon: <WalletOutlined className="text-white" />,
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
          label: "Cerrar Sesión",
          className: "text-white",
        }
      : null,
    {
      key: "#",
      icon: collapsed ? (
        <RightOutlined className="text-white" />
      ) : (
        <LeftOutlined className="text-white" />
      ),
      label: collapsed ? "Abrir Menú" : "Cerrar Menú",
      className: "toggle",
      onClick: () => setCollapsed(!collapsed),
    },
  ];

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
            window.location.href = "/";
          } else {
            navigate(key);
          }
        }}
      />

      {!collapsed && (
        <Footer
          className="text-center text-white ps-3 pe-3"
          style={{
            background: "var(--gray)",
            position: "relative",
            marginTop: "-88px",
            width: "100%",
            fontSize: ".84rem",
          }}
        >
          &copy; {new Date().getFullYear()} cruzito-x <br /> All Rights
          Reserved.
        </Footer>
      )}
    </>
  );
};

export default MenuList;
