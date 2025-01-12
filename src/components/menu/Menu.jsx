import React from "react";
import { Menu, theme } from "antd";
import {
  ProductOutlined,
  
  LeftOutlined,
  RightOutlined,
  UserOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  UnorderedListOutlined,
  TransactionOutlined,
  DatabaseOutlined,
  WalletOutlined,
  TeamOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const MenuList = ({ darkTheme, collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const isSupervisor = true;

  return (
    <Menu
      theme={darkTheme ? "dark" : "light"}
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
        <Menu.Item key="/dashboard" icon={<ProductOutlined />}>
          Dashboard
        </Menu.Item>
      )}
      {isSupervisor && (
        <Menu.Item key="/customers" icon={<TeamOutlined />}>
          Clientes
        </Menu.Item>
      )}
      <Menu.Item key="/collectors" icon={<BulbOutlined />}>
        Colectores
      </Menu.Item>
      <Menu.Item key="/collectors-payments" icon={<WalletOutlined />}>
        Pagos a Colectores
      </Menu.Item>

      <>
        <Menu.SubMenu
          title="Transacciones"
          icon={<TransactionOutlined />}
        >
          <Menu.Item key="/transactions" icon={<DollarOutlined />}>
            Transacciones
          </Menu.Item>
          <Menu.Item key="/transactions-types" icon={<UnorderedListOutlined />}>
            Tipos de Transacciones
          </Menu.Item>
        </Menu.SubMenu>
      </>
      {isSupervisor && (
        <Menu.Item key="/approvals" icon={<CheckCircleOutlined/>}>
          Aprobaciones
        </Menu.Item>
      )}

      {isSupervisor && (
        <Menu.Item key="/users" icon={<UserOutlined />}>
          Usuarios
        </Menu.Item>
      )}
      {isSupervisor && (
        <Menu.Item key="/audit" icon={<DatabaseOutlined />}>
          Auditoría
        </Menu.Item>
      )}
      <Menu.Item
        key={"#"}
        icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        className="toggle"
      >
        Cerrar Menú
      </Menu.Item>
    </Menu>
  );
};

export default MenuList;
