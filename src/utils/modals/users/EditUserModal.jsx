import { Button, Col, Form, Input, Modal, Row } from "antd";
import {
  EditOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/authContext/AuthContext";

const EditUserModal = ({
  isOpen,
  isClosed,
  userData,
  setAlertMessage,
  getUsers,
}) => {
  const { authState } = useAuth();
  const [sendingData, setSendingData] = useState(false);
  const [form] = Form.useForm();
  const token = authState.token;
  const user_id = authState.user_id;

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({
        username: userData.username,
        email: userData.email,
        password: userData.password,
      });
    }
  }, [isOpen, userData, form]);

  const updateUser = async (user) => {
    setSendingData(true);

    try {
      const response = await fetch(
        `http://localhost:3001/users/update-user/${userData.id}`,
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

      const updatedUser = await response.json();

      if (response.status === 200) {
        setAlertMessage.success(updatedUser.message);
        getUsers();
        isClosed();
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authState");
        window.location.href = "/";
        return;
      } else if (response.status === 409) {
        setAlertMessage.warning(updatedUser.message);
        setSendingData(false);
        return;
      } else {
        setAlertMessage.error(updatedUser.message);
      }
    } catch (error) {
      setAlertMessage.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    }
  };

  return (
    <Modal
      title={
        <Row align="middle">
          <Col>
            <EditOutlined
              className="fs-6"
              style={{ marginRight: 8, color: "var(--blue)" }}
            />
          </Col>
          <Col>
            <label className="fs-6 text-black">
              Editar Información de Usuario
            </label>
          </Col>
        </Row>
      }
      centered
      width={450}
      open={isOpen}
      onCancel={isClosed}
      footer={null}
      maskClosable={false}
    >
      <Form form={form} onFinish={updateUser}>
        <label className="fw-semibold text-black"> Nombre de Usuario </label>
        <Form.Item
          name="username"
          rules={[
            {
              message: "Por Favor Introduzca un Nombre de Usuario",
            },
          ]}
          initialValue={userData.username}
        >
          <Input placeholder="Nombre de Usuario" />
        </Form.Item>
        <label className="fw-semibold text-black"> E-mail </label>
        <Form.Item
          name="email"
          rules={[{ message: "Por Favor Introduzca un E-mail" }]}
          initialValue={userData.email}
        >
          <Input type="email" placeholder="E-mail" />
        </Form.Item>
        <label className="fw-semibold text-black"> Nueva Contraseña </label>
        <Form.Item
          name="new_password"
          rules={[{ message: "Por Favor Introduzca una Contraseña" }]}
          initialValue={userData.password}
        >
          <Input.Password
            placeholder="Contraseña"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
        <label className="fw-semibold text-black"> Rol </label>
        <Form.Item
          name="role"
          rules={[{ message: "Por Favor Seleccione un Rol" }]}
          initialValue={userData.role}
        >
          <Input placeholder="Rol" disabled readOnly />
        </Form.Item>
        <Form.Item className="text-end">
          <Button type="primary" danger onClick={isClosed}>
            Cerrar
          </Button>
          <Button
            className="ms-2"
            type="primary"
            htmlType="submit"
            loading={sendingData}
          >
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
