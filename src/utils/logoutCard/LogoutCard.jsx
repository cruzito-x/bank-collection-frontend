import { Card, Dropdown, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";

const LogoutCard = () => {
  const logout = () => {
    window.location.href = "/";
    localStorage.clear();
  };

  const menu = (
    <Menu>
      <Menu.Item onClick={logout}>Cerrar Sesión</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Card
        hoverable
        className="text-center user-card"
        style={{ cursor: "pointer" }}
      >
        <UserOutlined className="fs-1" />
        <div className="dashboard-user-card mt-1 text-center rounded">
          <label className="fw-semibold text-white p-2">Perfil</label>
        </div>
      </Card>
    </Dropdown>
  );
};

export default LogoutCard;
