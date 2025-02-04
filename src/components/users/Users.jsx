import {
  Breadcrumb,
  Button,
  Card,
  Input,
  Layout,
  message,
  Popconfirm,
  Select,
  Table,
  theme,
} from "antd";
import { BankOutlined, CrownOutlined, UserOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext/AuthContext";
import EditUserModal from "../../utils/modals/users/EditUserModal";
import SetNewUserRoleModal from "../../utils/modals/users/SetNewUserRoleModal";

const Users = () => {
  const { authState } = useAuth();
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [showEditUserModalOpen, setShowEditUserModalOpen] = useState(false);
  const [showSetNewUserRoleModalOpen, setShowSetNewUserRoleModalOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageAlert, messageContext] = message.useMessage();

  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    document.title = "Banco Bambú | Usuarios";
    getRoles();
    getUsers();
  }, []);

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
      setUsers(usersRow);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching roles: ", error);
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
          },
          body: JSON.stringify(user),
        }
      );

      const updatedUser = await response.json();

      if (response.status === 200) {
        messageAlert.success(updatedUser.message);
        getUsers();
      } else {
        messageAlert.error(updatedUser.message);
      }
    } catch (error) {
      messageAlert.error("Hubo un Error al Intentar Eliminar al Usuario");
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
                prefix={<CrownOutlined />}
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
              />
            </div>
          </div>
        </Card>

        <EditUserModal
          isOpen={showEditUserModalOpen}
          isClosed={() => setShowEditUserModalOpen(false)}
          userData={selectedUser}
          setAlertMessage={messageAlert}
          getUsers={getUsers}
        />

        <SetNewUserRoleModal
          isOpen={showSetNewUserRoleModalOpen}
          isClosed={() => setShowSetNewUserRoleModalOpen(false)}
          userData={selectedUser}
          setAlertMessage={messageAlert}
          getUsers={getUsers}
          roles={roles}
        />
      </div>
    </Content>
  );
};

export default Users;
