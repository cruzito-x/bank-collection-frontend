import { Button, Col, Form, Input, Modal, Row } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useState } from "react";

const EditCustomerModal = ({ isOpen }) => {
  const [sendingData, setSendingData] = useState(false);
  const closeEditCustomerModal = () => {
    isOpen = false;
  };

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
      onCancel={closeEditCustomerModal}
      footer={null}
    >
      <Form>
        <label className="fw-semibold text-black"> Nombre de Cliente </label>
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Por Favor, Introduzca un Nombre de Cliente",
            },
          ]}
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
              message: "Por Favor, Introduzca un Documento de Identidad Válido",
            },
          ]}
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
        >
          <Input placeholder="email@gmail.com" />
        </Form.Item>

        <Form.Item className="text-end">
          <Button type="primary" danger onClick={closeEditCustomerModal}>
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

export default EditCustomerModal;
