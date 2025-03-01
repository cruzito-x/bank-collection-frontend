import { Card, Dropdown, Menu } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";
import { useAuth } from "../../contexts/authContext/AuthContext";

const LogoutCard = ({ setAlertMessage, loading }) => {
  const { authState } = useAuth();
  const { user_id, username } = authState;

  const logout = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/login/logout/${user_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const logoutData = await response.json();

      if (response.status === 200) {
        localStorage.removeItem("authState");
        localStorage.clear();
        window.location.href = "/";
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authState");
        localStorage.clear();
        window.location.href = "/";
        return;
      } else {
        setAlertMessage.error(logoutData.message);
      }
    } catch (error) {
      setAlertMessage.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      localStorage.removeItem("authState");
      localStorage.clear();
    }
  };

  const item = [
    {
      key: "/logout",
      label: (
        <>
          <LogoutOutlined />
          <span className="text-black"> Salir</span>
        </>
      ),
      className: "text-black",
      onClick: logout,
    },
  ];

  const menu = <Menu items={item} />;

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Card
        loading={loading}
        hoverable
        className="d-flex p-2 align-items-center justify-content-center text-center cursor-pointer user-card w-100"
        bodyStyle={{ padding: 0 }}
      >
        <UserOutlined className="fs-1" />
        <div className="dashboard-user-card mt-1 w-100 rounded">
          <label
            className="fw-semibold text-white cursor-pointer p-2"
            style={{
              fontSize: "11px",
            }}
          >
            {username}
          </label>
        </div>
      </Card>
    </Dropdown>
  );
};

export default LogoutCard;
