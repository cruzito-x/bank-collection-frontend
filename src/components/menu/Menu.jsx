import React from "react";
import { Menu, theme } from "antd";
import {
  LineChartOutlined,
  TeamOutlined,
  BulbOutlined,
  WalletOutlined,
  TransactionOutlined,
  UnorderedListOutlined,
  CheckCircleOutlined,
  UserOutlined,
  DatabaseOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const MenuList = ({ darkTheme, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const isSupervisor = true;

  const colorByTheme = {
    color: darkTheme ? "#ffffff" : "007bff",
  };

  return (
    <Menu
      theme={darkTheme ? "dark" : "light"}
      style={{
        backgroundColor: darkTheme ? "#273543" : "",
        color: darkTheme ? "#ffffff" : "#007bff",
      }}
      mode="inline"
      className="menu-bar"
      onClick={({ key }) => {
        if (key === "/sign-out") {
          window.location.href = "/";
        } else {
          navigate(key);
        }
      }}
    >
      {isSupervisor && (
        <Menu.Item
          key="/dashboard"
          icon={<LineChartOutlined style={colorByTheme} />}
        >
          <span style={colorByTheme}> Dashboard </span>
        </Menu.Item>
      )}
      {isSupervisor && (
        <Menu.Item
          key="/customers"
          icon={<TeamOutlined style={colorByTheme} />}
        >
          <span style={colorByTheme}> Clientes </span>
        </Menu.Item>
      )}
      <Menu.Item key="/collectors" icon={<BulbOutlined style={colorByTheme} />}>
        <span style={colorByTheme}> Colectores </span>
      </Menu.Item>
      <Menu.Item
        key="/collectors-payments"
        icon={<WalletOutlined style={colorByTheme} />}
      >
        <span style={colorByTheme}> Pagos a Colectores </span>
      </Menu.Item>
      <>
        <Menu.SubMenu
          title="Transacciones"
          icon={<TransactionOutlined style={colorByTheme} />}
          style={{colorByTheme}}
        >
          <Menu.Item
            key="/transactions"
            icon={<TransactionOutlined style={colorByTheme} />}
          >
            <span style={colorByTheme}> Transacciones </span>
          </Menu.Item>
          <Menu.Item
            key="/transactions-types"
            icon={<UnorderedListOutlined style={colorByTheme} />}
          >
            <span style={colorByTheme}> Tipos de Transacciones </span>
          </Menu.Item>
        </Menu.SubMenu>
      </>
      {isSupervisor && (
        <Menu.Item
          key="/approvals"
          icon={<CheckCircleOutlined style={colorByTheme} />}
        >
          <span style={colorByTheme}> Aprobaciones </span>
        </Menu.Item>
      )}

      {isSupervisor && (
        <Menu.Item key="/users" icon={<UserOutlined style={colorByTheme} />}>
          <span style={colorByTheme}> Usuarios </span>
        </Menu.Item>
      )}
      {isSupervisor && (
        <Menu.Item
          key="/audit"
          icon={<DatabaseOutlined style={colorByTheme} />}
        >
          <span style={colorByTheme}> Auditoría </span>
        </Menu.Item>
      )}
      <Menu.Item
        key={"#"}
        icon={
          collapsed ? (
            <RightOutlined style={colorByTheme} />
          ) : (
            <LeftOutlined style={colorByTheme} />
          )
        }
        onClick={() => setCollapsed(!collapsed)}
        className="toggle"
      >
        <span style={colorByTheme}>
          {" "}
          {collapsed ? "Abrir Menú" : "Cerrar Menú"}{" "}
        </span>
      </Menu.Item>
    </Menu>
  );
};

export default MenuList;
