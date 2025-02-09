import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { UserSwitchOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/authContext/AuthContext";

const SetNewUserRoleModal = ({
  isOpen,
  isClosed,
  userData,
  setAlertMessage,
  getUsers,
  roles,
}) => {
  const { authState } = useAuth();
  const [sendingData, setSendingData] = useState(false);
  const [form] = Form.useForm();
  const token = authState.token;
  const user_id = authState.user_id;

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({
        role: userData.role,
      });
    }
  }, [isOpen, userData, form]);

  const updateUserRole = async (user) => {
    setSendingData(true);

    try {
      const response = await fetch(
        `http://localhost:3001/users/update-user-role/${userData.id}`,
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
        isClosed();
        form.resetFields();
        getUsers();
      } else {
        setAlertMessage.error(updatedUser.message);
      }
    } catch (error) {
      setAlertMessage.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      setSendingData(false);
    }
  };

  return (
    <Modal
      title={
        <Row align="middle">
          <Col>
            <UserSwitchOutlined
              className="fs-6"
              style={{ marginRight: 8, color: "var(--blue)" }}
            />
          </Col>
          <Col>
            <label className="fs-6 text-black">Asignar Nuevo Rol</label>
          </Col>
        </Row>
      }
      centered
      open={isOpen}
      width={400}
      onCancel={isClosed}
      footer={null}
      maskClosable={false}
    >
      <Form form={form} onFinish={updateUserRole}>
        <label className="fw-semibold text-black"> Rol Actual </label>
        <Form.Item name="role">
          <Input readOnly />
        </Form.Item>
        <label className="fw-semibold text-black">
          {" "}
          Seleccionar Nuevo Rol{" "}
        </label>
        <Form.Item name="newRole" initialValue={1}>
          <Select defaultValue={1} options={roles} />
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

export default SetNewUserRoleModal;
