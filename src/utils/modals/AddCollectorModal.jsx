import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";

const AddCollectorModal = ({ openModal, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageAlert, messageContext] = message.useMessage();

  const saveNewCollector = async (collector) => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/collectors/save-collector",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(collector),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        messageAlert.success(data.message);
        closeModal();
        form.resetFields();
      } else {
        messageAlert.error(data.message);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openModal) {
      form.resetFields();
    }
  }, [openModal]);

  return (
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
            <label className="fs-6">Añadir Nuevo Colector</label>
          </Col>{" "}
        </Row>
      }
      centered
      width={450}
      open={openModal}
      onCancel={closeModal}
      footer={null}
    >
      {messageContext}
      <Form form={form} onFinish={saveNewCollector}>
        <label className="fw-semibold"> Nombre de Colector </label>
        <Form.Item
          name="service_name"
          rules={[
            {
              required: true,
              message: "Por Favor, Introduzca un Nombre de Colector",
            },
          ]}
        >
          <Input placeholder="Nombre de Colector" />
        </Form.Item>
        <label className="fw-semibold"> Descripción del Servicio </label>
        <Form.Item
          name="description"
          rules={[
            {
              required: true,
              message: "Por Favor, Introduzca una Descripción Para el Servicio",
            },
          ]}
        >
          <TextArea
            rows={8}
            size="middle"
            style={{
              resize: "none",
            }}
            placeholder="Descripción del Servicio"
          />
        </Form.Item>
        <Form.Item className="text-end">
          <Button type="primary" danger onClick={closeModal}>
            Cancelar
          </Button>
          <Button
            className="ms-2"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCollectorModal;
