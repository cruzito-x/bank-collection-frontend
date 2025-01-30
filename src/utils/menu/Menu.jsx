import React from "react";
import { Menu } from "antd";
import {
  LineChartOutlined,
  TeamOutlined,
  WalletOutlined,
  TransactionOutlined,
  CheckCircleOutlined,
  UserOutlined,
  DatabaseOutlined,
  LeftOutlined,
  RightOutlined,
  SolutionOutlined,
  AuditOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext/AuthContext";
import { Footer } from "antd/es/layout/layout";

const MenuList = ({ darkTheme, collapsed, setCollapsed }) => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const isSupervisor = authState.isSupervisor;

  const colorByTheme = {
    color: darkTheme ? "#ffffff" : "007bff",
  };

  const menuItems = [
    isSupervisor
      ? {
          key: "/dashboard",
          icon: <LineChartOutlined style={colorByTheme} />,
          label: "Dashboard",
          style: { colorByTheme },
        }
      : null,
    {
      key: "/customers",
      icon: <TeamOutlined style={colorByTheme} />,
      label: "Clientes",
      style: { colorByTheme },
    },
    isSupervisor
      ? {
          key: "/collectors",
          icon: <SolutionOutlined style={colorByTheme} />,
          label: "Colectores",
          style: { colorByTheme },
        }
      : null,
    {
      key: "/payments-collectors",
      icon: <WalletOutlined style={colorByTheme} />,
      label: "Pagos a Colectores",
      style: { colorByTheme },
    },
    {
      key: "/transactions-menu",
      icon: <TransactionOutlined style={colorByTheme} />,
      label: "Transacciones",
      style: { colorByTheme },
      children: [
        {
          key: "/transactions",
          icon: <TransactionOutlined style={colorByTheme} />,
          label: "Transacciones",
          style: { colorByTheme },
        },
        isSupervisor
          ? {
              key: "/transaction-types",
              icon: <AuditOutlined style={colorByTheme} />,
              label: "Tipos de Transacciones",
              style: { colorByTheme },
            }
          : null,
      ].filter(Boolean),
    },
    isSupervisor
      ? {
          key: "/approvals",
          icon: <CheckCircleOutlined style={colorByTheme} />,
          label: "Aprobaciones",
          style: { colorByTheme },
        }
      : null,
    isSupervisor
      ? {
          key: "/users",
          icon: <UserOutlined style={colorByTheme} />,
          label: "Usuarios",
          style: { colorByTheme },
        }
      : null,
    isSupervisor
      ? {
          key: "/audit",
          icon: <DatabaseOutlined style={colorByTheme} />,
          label: "Auditoría",
          style: { colorByTheme },
        }
      : null,
    !isSupervisor
      ? {
          key: "/logout",
          icon: <LogoutOutlined style={colorByTheme} />,
          label: "Cerrar Sesión",
          style: { colorByTheme },
        }
      : null,
    {
      key: "#",
      icon: collapsed ? (
        <RightOutlined style={colorByTheme} />
      ) : (
        <LeftOutlined style={colorByTheme} />
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
          className="text-center text-white p-4"
          style={{
            background: "transparent",
            position: "absolute",
            bottom: 0,
            width: "100%",
          }}
        >
          &copy; cruzito-x - {new Date().getFullYear()} <br /> All Rights
          Reserved.
        </Footer>
      )}
    </>
  );
};

export default MenuList;
