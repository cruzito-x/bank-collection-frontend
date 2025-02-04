import { Card, Dropdown, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import { useAuth } from "../../contexts/authContext/AuthContext";

const LogoutCard = () => {
  const { authState } = useAuth();

  const logout = () => {
    window.location.href = "/";
    localStorage.clear();
  };

  const item = [
    {
      key: "/logout",
      label: "Cerrar Sesión",
      className: "text-black",
      onClick: logout,
    },
  ];

  const menu = <Menu items={item} />;

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Card
        hoverable
        className="d-flex align-items-center justify-content-center text-center user-card w-100"
        style={{ cursor: "pointer" }}
        bodyStyle={{ padding: 0 }}
      >
        <UserOutlined className="fs-1" />
        <div className="dashboard-user-card mt-1 w-100 rounded">
          <label className="fw-semibold text-white p-2">
            {authState.username}
          </label>
        </div>
      </Card>
    </Dropdown>
  );
};

export default LogoutCard;
