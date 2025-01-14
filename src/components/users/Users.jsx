import {
  Breadcrumb,
  Button,
  Card,
  Input,
  Layout,
  Select,
  Table,
  theme,
} from "antd";
import {
  UserOutlined,
} from "@ant-design/icons";
import React from "react";

const Users = () => {
  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const CollectorsDataSource = [
    {
      key: "1",
      user: "David Cruz",
      email: "dcruzer92@gmail.com",
      role: "Supervisor",
      actions: (
        <>
          <Button
            className="edit-btn"
            type="primary"
            style={{
              backgroundColor: "#ffac00",
              // hover: "#ffc654"
            }}
          >
            Editar
          </Button>
          <Button className="ms-2 me-2" type="primary" danger>
            Eliminar
          </Button>
          <Button type="primary"> Asignar Rol </Button>
        </>
      ),
    },
  ];

  const CollectorsDataColumns = [
    {
      title: "Usuario",
      dataIndex: "user",
      key: "user",
      align: "center",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      align: "center",
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      align: "center"
    },
  ];

  return (
    <Content style={{ margin: "31px 16px" }}>
      <div
        style={{
          paddingTop: 24,
          minHeight: "90vh",
          background: "none",
          borderRadius: borderRadiusLG,
        }}
      >
        <Breadcrumb
          items={[
            {
              title: (
                <>
                  <UserOutlined />
                  <span>Usuario</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <UserOutlined />
                  <span>Usuarios</span>
                </>
              ),
            },
          ]}
        />

        <Card className="mt-3">
          <div className="row ms-2 pt-3 mb-2">
            <div className="col-12 text-start">
              <label className="fw-semibold">
                {" "}
                Buscar Por{" "}
              </label>
            </div>
          </div>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <label className="me-2 fw-semibold">
                {" "}
                Nombre{" "}
              </label>
              <Input
                placeholder="Nombre de Usuario"
                prefix={<UserOutlined />}
                style={{
                  width: 183,
                }}
              />
            </div>
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <label className="me-2 fw-semibold">
                {" "}
                Rol{" "}
              </label>
              <Select
                  defaultValue="Supervisor"
                  prefix={<UserOutlined />}
                  style={{
                    width: 183,
                  }}
                  // onChange={quickFilter}
                  options={[
                    {
                      value: 0,
                      label: "Supervisor",
                    },
                    {
                      value: 1,
                      label: "Cajero",
                    },
                  ]}
                />
            </div>
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <Button type="primary"> Buscar </Button>
            </div>
          </div>
          <div className="row ms-1 mb-3 pe-3">
            <div className="col-12">
              <Table
                dataSource={CollectorsDataSource}
                columns={CollectorsDataColumns}
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Total: ${total} colector(es)`,
                  hideOnSinglePage: true
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    </Content>
  );
};

export default Users;
