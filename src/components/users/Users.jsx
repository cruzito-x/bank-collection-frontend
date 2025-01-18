import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  message,
  Modal,
  Row,
  Select,
  Table,
  theme,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  InfoCircleOutlined,
  KeyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext/AuthContext";

const Users = () => {
  const { authState } = useAuth();
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageAlert, messageContext] = message.useMessage();

  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    getRoles();
    getUsers();
  }, []);

  const showEditUserModal = () => {
    setEditUserModalOpen(true);
  };

  const closeEditUserModal = () => {
    setEditUserModalOpen(false);
  };

  const getRoles = async () => {
    try {
      const response = await fetch("http://localhost:3001/users/roles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles: ", error);
    }
  };

  const getUsers = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      const usersRow = data.map((user) => ({
        ...user,
        actions: (
          <>
            <Button
              className="edit-btn"
              type="primary"
              style={{
                backgroundColor: "var(--yellow)",
              }}
              onClick={showEditUserModal}
            >
              Editar
            </Button>
            <Button className="ms-2 me-2" type="primary" danger>
              Eliminar
            </Button>
            <Button type="primary"> Asignar Rol </Button>
          </>
        ),
      }));
      setUsers(usersRow);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching roles: ", error);
    }
  };

  const updateUserInfo = async (user) => {
    setLoading(true);

    try {
    } catch (error) {
      console.error("Error al actualizar la información del usuario: ", error);
    }

    setLoading(false);
  };

  const usersTableColumns = [
    {
      title: "Usuario",
      dataIndex: "username",
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
      align: "center",
    },
  ];

  return (
    <Content style={{ margin: "31px 16px" }}>
      {messageContext}
      <div
        style={{
          padding: "24px 0 24px 0",
          minHeight: "90vh",

          borderRadius: borderRadiusLG,
        }}
      >
        <Breadcrumb
          items={[
            {
              title: (
                <>
                  <UserOutlined />
                  <span> {authState.username} </span>
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
              <label className="fw-semibold text-black"> Buscar Por </label>
            </div>
          </div>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <label className="me-2 fw-semibold text-black"> Nombre </label>
              <Input
                placeholder="Nombre de Usuario"
                prefix={<UserOutlined />}
                style={{
                  width: 183,
                }}
              />
            </div>
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <label className="me-2 fw-semibold text-black"> Rol </label>
              <Select
                defaultValue="Supervisor"
                prefix={<KeyOutlined />}
                style={{
                  width: 183,
                }}
                // onChange={quickFilter}
                options={roles}
              />
            </div>
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <Button type="primary"> Buscar </Button>
            </div>
          </div>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-12">
              <Table
                dataSource={users}
                columns={usersTableColumns}
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Total: ${total} colector(es)`,
                  hideOnSinglePage: true,
                }}
              />
              <Modal
                title={
                  <Row align="middle">
                    {" "}
                    <Col>
                      {" "}
                      <InfoCircleOutlined
                        className="fs-6"
                        style={{ marginRight: 8, color: "var(--blue)" }}
                      />{" "}
                    </Col>{" "}
                    <Col>
                      <label className="fs-6">
                        Editar Información de Usuario
                      </label>
                    </Col>{" "}
                  </Row>
                }
                centered
                width={450}
                open={editUserModalOpen}
                onCancel={closeEditUserModal}
                footer={[
                  <Button
                    key="submit"
                    type="primary"
                    onClick={closeEditUserModal}
                    loading={loading}
                  >
                    Guardar Cambios
                  </Button>,
                ]}
              >
                <Form layout={"vertical"} onFinish={updateUserInfo}>
                  <div className="row mt-4">
                    <div className="col-12">
                      <label className="fw-semibold text-black"> Nombre de Usuario </label>
                      <Form.Item
                        name="username"
                        rules={[
                          {
                            message:
                              "Por Favor Introduzca un Nombre de Usuario",
                          },
                        ]}
                      >
                        <Input placeholder="Nombre de Usuario" />
                      </Form.Item>
                    </div>
                    <div className="col-12">
                      <label className="fw-semibold text-black"> E-mail </label>
                      <Form.Item
                        name="email"
                        rules={[{ message: "Por Favor Introduzca un E-mail" }]}
                      >
                        <Input type="email" placeholder="E-mail" />
                      </Form.Item>
                    </div>
                    <div className="col-12">
                      <label className="fw-semibold text-black"> Contraseña </label>
                      <Form.Item
                        name="password"
                        rules={[
                          { message: "Por Favor Introduzca una Contraseña" },
                        ]}
                      >
                        <Input.Password
                          placeholder="Contraseña"
                          iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                          }
                        />
                      </Form.Item>
                    </div>
                    <div className="col-12 mb-3"></div>
                  </div>
                </Form>
              </Modal>
            </div>
          </div>
        </Card>
      </div>
    </Content>
  );
};

export default Users;
