import {
  Breadcrumb,
  Button,
  Card,
  Form,
  Input,
  Layout,
  message,
  Popconfirm,
  Select,
  Table,
  theme,
} from "antd";
import { BankOutlined, CrownOutlined, UserOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/authContext/AuthContext";
import EditUserModal from "../../utils/modals/users/EditUserModal";
import SetNewUserRoleModal from "../../utils/modals/users/SetNewUserRoleModal";
import { useForm } from "antd/es/form/Form";
import EmptyData from "../../utils/emptyData/EmptyData";
import { applyMaskOnlyLetters } from "../../utils/masks/InputMasks";

const Users = () => {
  const { authState } = useAuth();
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [showEditUserModalOpen, setShowEditUserModalOpen] = useState(false);
  const [showSetNewUserRoleModalOpen, setShowSetNewUserRoleModalOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const userRef = useRef(null);
  const [messageAlert, messageContext] = message.useMessage();
  const { Content } = Layout;
  const [form] = useForm();
  const token = authState.token;
  const user_id = authState.user_id;

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    document.title = "Banco Bambú | Usuarios";

    getRoles();
    getUsers();
  }, []);

  useEffect(() => {
    if (userRef.current?.input) {
      applyMaskOnlyLetters(userRef.current.input);

      userRef.current.input.addEventListener("input", (event) => {
        form.setFieldsValue({ username: event.target.value });
      });
    }
  }, []);

  const getRoles = async () => {
    try {
      const response = await fetch("http://localhost:3001/users/roles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setRoles(data);
    } catch (error) {
      messageAlert.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    }
  };

  const getUsers = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const usersData = await response.json();

      if (response.status === 200) {
        const users = usersData.map((user) => ({
          ...user,
          actions: (
            <>
              <Button
                className="ant-btn-edit"
                type="primary"
                onClick={() => setShowEditUserModalOpen(true)}
              >
                Editar
              </Button>
              <Popconfirm
                title="Eliminar Usuario"
                description="¿Está seguro de Eliminar este Registro?"
                onConfirm={() => deleteUser(user)}
                okText="Sí"
                cancelText="No"
              >
                <Button className="ms-2 me-2" type="primary" danger>
                  Eliminar
                </Button>
              </Popconfirm>
              <Button
                type="primary"
                onClick={() => setShowSetNewUserRoleModalOpen(true)}
              >
                {" "}
                Asignar Rol{" "}
              </Button>
            </>
          ),
        }));

        setUsers(users);
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authState");
        window.location.href = "/";
        return;
      } else {
        messageAlert.error(usersData.message);
      }
    } catch (error) {
      messageAlert.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (user) => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/users/delete-user/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
          body: JSON.stringify(user),
        }
      );

      const deletedUser = await response.json();

      if (response.status === 200) {
        messageAlert.success(deletedUser.message);
        getUsers();
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authState");
        window.location.href = "/";
        return;
      } else {
        messageAlert.error(deletedUser.message);
      }
    } catch (error) {
      messageAlert.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    }
  };

  const searchUser = async (user) => {
    if (
      (user.username === undefined || user.username === "") &&
      (user.role === undefined || user.role === "")
    ) {
      messageAlert.warning(
        "Por Favor, Introduzca al Menos un Criterio de Búsqueda"
      );
      getUsers();
      return;
    } else {
      setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:3001/users/search-user?username=${
            user.username ?? ""
          }&role=${user.role ?? ""}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const usersData = await response.json();

        if (response.status === 200) {
          const users = usersData.map((user) => ({
            ...user,
            actions: (
              <>
                <Button
                  className="ant-btn-edit"
                  type="primary"
                  onClick={() => setShowEditUserModalOpen(true)}
                >
                  Editar
                </Button>
                <Popconfirm
                  title="Eliminar Usuario"
                  description="¿Está seguro de Eliminar este Registro?"
                  onConfirm={() => deleteUser(user)}
                  okText="Sí"
                  cancelText="No"
                >
                  <Button className="ms-2 me-2" type="primary" danger>
                    Eliminar
                  </Button>
                </Popconfirm>
                <Button
                  type="primary"
                  onClick={() => setShowSetNewUserRoleModalOpen(true)}
                >
                  {" "}
                  Asignar Rol{" "}
                </Button>
              </>
            ),
          }));

          setUsers(users);
        } else if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("authState");
          window.location.href = "/";
          return;
        } else {
          messageAlert.error(usersData.message);
        }
      } catch (error) {
        messageAlert.error(
          "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
        );
      } finally {
        setLoading(false);
      }
    }
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
                  <BankOutlined />
                  <span> Banco Bambú </span>
                </>
              ),
            },
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
          <div className="row ms-2 pt-3 pe-3 mb-2">
            <div className="col-12 text-start">
              <label className="fw-semibold text-black"> Buscar Por </label>
            </div>
          </div>
          <Form
            className="row ms-2 pe-3 align-items-center"
            layout="inline"
            form={form}
            onFinish={searchUser}
          >
            <div className="col-xxl-2 col-xl-3 col-md-2 col-sm-12 mb-3 d-flex align-items-center w-auto">
              <label className="me-2 fw-semibold text-black"> Usuario </label>
              <Form.Item name="username" initialValue="">
                <Input
                  ref={userRef}
                  placeholder="Nombre de Usuario"
                  prefix={<UserOutlined />}
                  style={{
                    width: 183,
                  }}
                />
              </Form.Item>
            </div>
            <div className="col-xxl-2 col-xl-3 col-md-2 col-sm-12 mb-3 d-flex align-items-center w-auto">
              <label className="me-2 fw-semibold text-black"> Rol </label>
              <Form.Item name="role" initialValue={1}>
                <Select
                  defaultValue={1}
                  prefix={<CrownOutlined />}
                  style={{
                    width: 183,
                  }}
                  options={roles}
                />
              </Form.Item>
            </div>
            <div className="col-xxl-2 col-xl-3 col-md-12 col-sm-12 mb-3 d-lg-flex d-sm-block align-items-center w-sm-100">
              <Form.Item>
                <Button className="w-100" type="primary" htmlType="submit">
                  {" "}
                  Buscar{" "}
                </Button>
              </Form.Item>
            </div>
          </Form>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-12">
              {users.length === 0 ? (
                <EmptyData />
              ) : (
                <Table
                  dataSource={users}
                  columns={usersTableColumns}
                  onRow={(record) => ({
                    onClick: () => setSelectedUser(record),
                  })}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: false,
                    showTotal: (total) =>
                      `Total: ${total} usuario(s) registrado(s)`,
                    hideOnSinglePage: true,
                  }}
                  loading={loading}
                  scroll={{ x: "max-content" }}
                />
              )}
            </div>
          </div>
        </Card>

        <EditUserModal
          isOpen={showEditUserModalOpen}
          isClosed={() => setShowEditUserModalOpen(false)}
          userData={selectedUser}
          getUsers={getUsers}
          setAlertMessage={messageAlert}
        />

        <SetNewUserRoleModal
          isOpen={showSetNewUserRoleModalOpen}
          isClosed={() => setShowSetNewUserRoleModalOpen(false)}
          userData={selectedUser}
          getUsers={getUsers}
          roles={roles}
          setAlertMessage={messageAlert}
        />
      </div>
    </Content>
  );
};

export default Users;
