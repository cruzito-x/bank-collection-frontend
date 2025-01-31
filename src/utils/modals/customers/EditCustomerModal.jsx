import { Button, Col, Form, Input, Modal, Row } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const EditCustomerModal = ({
  isOpen,
  isClosed,
  customerData,
  setAlertMessage,
}) => {
  const [sendingData, setSendingData] = useState(false);
  const [form] = Form.useForm();

  const updateCustomer = async (customer) => {
    setSendingData(true);

    try {
      const response = await fetch(
        `http://localhost:3001/customers/update-customer/${customerData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customer),
        }
      );

      const updatedCustomer = await response.json();

      if (response.status === 200) {
        setAlertMessage.success(updatedCustomer.message);
        isClosed();
      } else {
        setAlertMessage.error(updatedCustomer.message);
      }

      setSendingData(false);
    } catch (error) {
      console.error("Error al actualizar los datos del cliente: ", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({
        name: customerData.name,
        identity_doc: customerData.identity_doc,
        email: customerData.email,
      });
    }
  }, [isOpen, customerData, form]);

  return (
    <Modal
      title={
        <Row align="middle">
          {" "}
          <Col>
            {" "}
            <EditOutlined
              className="fs-6"
              style={{ marginRight: 8, color: "var(--blue)" }}
            />{" "}
          </Col>{" "}
          <Col>
            <label className="fs-6 text-black">Editar Datos de Cliente</label>
          </Col>{" "}
        </Row>
      }
      centered
      open={isOpen}
      width={450}
      onCancel={isClosed}
      footer={null}
    >
      {customerData && (
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
            initialValue={customerData.name}
          >
            <Input placeholder="Nombre de Cliente" />
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
            initialValue={customerData.identity_doc}
          >
            <Input placeholder="00000000-0" />
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
            initialValue={customerData.email}
          >
            <Input placeholder="email@gmail.com" />
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
              Guardar Cambios
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default EditCustomerModal;
