import {
  Breadcrumb,
  Button,
  Card,
  Input,
  Layout,
  message,
  Select,
  Table,
  theme,
} from "antd";
import { BankOutlined, KeyOutlined, UserOutlined } from "@ant-design/icons";
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
              className="edit-btn"
              type="primary"
              style={{
                backgroundColor: "var(--yellow)",
              }}
              onClick={() => setShowEditUserModalOpen(true)}
            >
              Editar
            </Button>
            <Button className="ms-2 me-2" type="primary" danger>
              Eliminar
            </Button>
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
                onRow={(record) => ({
                  onClick: () => setSelectedUser(record),
                })}
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Total: ${total} colector(es)`,
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
