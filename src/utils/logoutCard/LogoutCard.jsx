import { Card, Dropdown, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";

const LogoutCard = () => {
  const menu = (
    <Menu>
      <Menu.Item key="/logout">Cerrar Sesión</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Card
        className="text-center user-card ms-5 shadow"
        style={{ cursor: "pointer" }}
      >
        <UserOutlined className="fs-1 p-2" />
        <div className="dashboard-user-card mt-2">
          <h6 className="mt-2" style={{ fontSize: "14px" }}>
            David Cruz
          </h6>
        </div>
      </Card>
    </Dropdown>
  );
};

export default LogoutCard;
