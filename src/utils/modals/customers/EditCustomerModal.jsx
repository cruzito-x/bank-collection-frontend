import { Button, Col, Form, Input, Modal, Row } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../contexts/authContext/AuthContext";
import {
  applyMaskEmail,
  applyMaskIdentityDoc,
  applyMaskOnlyLetters,
} from "../../masks/InputMasks";

const EditCustomerModal = ({
  isOpen,
  isClosed,
  selectedCustomer,
  setAlertMessage,
  getCustomers,
}) => {
  const { authState } = useAuth();
  const [sendingData, setSendingData] = useState(false);
  const customerRef = useRef(null);
  const DUIRef = useRef(null);
  const EmailRef = useRef(null);
  const [form] = Form.useForm();
  const token = authState.token;
  const user_id = authState.user_id;

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({
        name: selectedCustomer.name,
        identity_doc: selectedCustomer.identity_doc,
        email: selectedCustomer.email,
      });
    }
  }, [isOpen, selectedCustomer, form]);

  useEffect(() => {
    if (customerRef.current?.input) {
      applyMaskOnlyLetters(customerRef.current.input);
    }

    if (DUIRef.current?.input) {
      applyMaskIdentityDoc(DUIRef.current.input);
    }

    if (EmailRef.current?.input) {
      applyMaskEmail(EmailRef.current.input);
    }
  }, []);

  const updateCustomer = async (customer) => {
    setSendingData(true);

    try {
      const response = await fetch(
        `http://localhost:3001/customers/update-customer/${selectedCustomer.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
          body: JSON.stringify(customer),
        }
      );

      const updatedCustomer = await response.json();

      if (response.status === 200) {
        setAlertMessage.success(updatedCustomer.message);
        isClosed();
        getCustomers();
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authState");
        window.location.href = "/";
        return;
      } else if (response.status === 409) {
        setAlertMessage.warning(updatedCustomer.message);
        setSendingData(false);
        return;
      } else {
        setAlertMessage.error(updatedCustomer.message);
      }

      setSendingData(false);
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
            <label className="fs-6 text-black">Editar Datos de Cliente</label>
          </Col>
        </Row>
      }
      centered
      open={isOpen}
      width={450}
      onCancel={isClosed}
      footer={null}
      maskClosable={false}
    >
      {selectedCustomer && (
        <Form form={form} onFinish={updateCustomer}>
          <label className="fw-semibold text-black"> Nombre de Cliente </label>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Por Favor, Introduzca un Nombre de Cliente",
              },
            ]}
            initialValue={selectedCustomer.name}
          >
            <Input ref={customerRef} placeholder="Nombre de Cliente" />
          </Form.Item>
          <label className="fw-semibold text-black">
            {" "}
            Documento de Identidad{" "}
          </label>
          <Form.Item
            name="identity_doc"
            rules={[
              {
                required: true,
                message:
                  "Por Favor, Introduzca un Documento de Identidad Válido",
              },
            ]}
            initialValue={selectedCustomer.identity_doc}
          >
            <Input ref={DUIRef} placeholder="00000000-0" readOnly />
          </Form.Item>
          <label className="fw-semibold text-black"> E-mail </label>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message:
                  "Por Favor, Introduzca una Dirección de Correo Electrónico",
              },
            ]}
            initialValue={selectedCustomer.email}
          >
            <Input ref={EmailRef} placeholder="email@mail.com" />
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
      )}
    </Modal>
  );
};

export default EditCustomerModal;
