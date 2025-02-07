import { Card, Dropdown, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import { useAuth } from "../../contexts/authContext/AuthContext";

const LogoutCard = ({ setAlertMessage }) => {
  const { authState } = useAuth();

  const logout = async () => {
    const response = await fetch(
      `http://localhost:3001/login/logout/${authState.user_id}`,
      {
        method: "GET",
      }
    );

    const logoutData = await response.json();

    if (response.status === 200) {
      window.location.href = "/";
      localStorage.clear();
    } else {
      setAlertMessage.error(logoutData.message);
    }
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
        className="d-flex align-items-center justify-content-center text-center cursor-pointer user-card w-100"
        bodyStyle={{ padding: 0 }}
      >
        <UserOutlined className="fs-1" />
        <div className="dashboard-user-card mt-1 w-100 rounded">
          <label className="fw-semibold text-white cursor-pointer p-2">
            {authState.username}
          </label>
        </div>
      </Card>
    </Dropdown>
  );
};

export default LogoutCard;
