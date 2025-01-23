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
    <Dropdown menu={menu} trigger={["click"]}>
      <Card
        hoverable
        className="text-center user-card ms-5 shadow"
        style={{ cursor: "pointer" }}
      >
        <UserOutlined className="fs-1 ps-3 pe-3 pt-3 pb-2" />
        <div className="dashboard-user-card">
          <label className="fw-semibold">Perfil</label>
        </div>
      </Card>
    </Dropdown>
  );
};

export default LogoutCard;
