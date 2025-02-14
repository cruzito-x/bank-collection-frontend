import { Button, Col, Form, Input, InputNumber, Modal, Row } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { useAuth } from "../../../contexts/authContext/AuthContext";

const AddNewCollectorModal = ({ isOpen, isClosed, setAlertMessage }) => {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const token = authState.token;
  const user_id = authState.user_id;

  const saveNewCollector = async (collector) => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/collectors/save-collector",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
          body: JSON.stringify(collector),
        }
      );

      const savedCollector = await response.json();

      if (response.status === 200) {
        setAlertMessage.success(savedCollector.message);
        form.resetFields();
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authState");
        window.location.href = "/";
        return;
      } else if (response.status === 409) {
        setAlertMessage.warning(savedCollector.message);
        setLoading(false);
        return;
      } else {
        setAlertMessage.error(savedCollector.message);
      }
    } catch (error) {
      setAlertMessage.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      setLoading(false);
      isClosed();
    }
  };

  useEffect(() => {
    if (isOpen) {
      form.resetFields();
    }
  }, [isOpen]);

  return (
    <Modal
      title={
        <Row align="middle">
          <Col>
            <PlusCircleOutlined
              className="fs-6"
              style={{ marginRight: 8, color: "var(--blue)" }}
            />
          </Col>
          <Col>
            <label className="fs-6 text-black">Añadir Nuevo Colector</label>
          </Col>
        </Row>
      }
      centered
      width={550}
      open={isOpen}
      onCancel={isClosed}
      footer={null}
      maskClosable={false}
    >
      <Form form={form} onFinish={saveNewCollector}>
        <label className="fw-semibold text-black"> Nombre de Colector </label>
        <Form.Item
          name="collector_name"
          rules={[
            {
              required: true,
              message: "Por Favor, Introduzca un Nombre de Colector",
            },
          ]}
        >
          <Input placeholder="Nombre de Colector" />
        </Form.Item>
        <label className="fw-semibold text-black">
          {" "}
          Descripción del Colector{" "}
        </label>
        <Form.Item
          name="collector_description"
          rules={[
            {
              required: true,
              message: "Por Favor, Introduzca una Descripción Para el Colector",
            },
          ]}
        >
          <TextArea
            rows={4}
            size="middle"
            style={{
              resize: "none",
            }}
            placeholder="Descripción del Colector"
            maxLength={255}
            showCount
          />
        </Form.Item>
        <label className="fw-semibold text-black"> Servicio </label>
        <Form.Item
          name="service_name"
          rules={[
            {
              required: true,
              message: "Por Favor, Introduzca un Nombre de Servicio",
            },
          ]}
        >
          <Input placeholder="Nombre de Servicio" />
        </Form.Item>
        <label className="fw-semibold text-black">Precio de Servicio</label>
        <Form.Item
          name="price"
          rules={[
            {
              required: false,
              message: "Por Favor, Introduzca un Precio Para el Servicio",
            },
          ]}
        >
          <InputNumber
            className="w-100"
            prefix="$"
            min={0}
            max={10000}
            placeholder="0.00"
          />
        </Form.Item>
        <label className="fw-semibold text-black">
          {" "}
          Descripción del Servicio{" "}
        </label>
        <Form.Item
          name="service_description"
          rules={[
            {
              required: true,
              message: "Por Favor, Introduzca una Descripción Para el Servicio",
              min: 5,
              max: 255,
            },
          ]}
        >
          <TextArea
            rows={4}
            size="middle"
            style={{
              resize: "none",
            }}
            placeholder="Descripción del Servicio"
            maxLength={255}
            showCount
          />
        </Form.Item>
        <Form.Item className="text-end">
          <Button
            type="primary"
            danger
            onClick={isClosed}
            disabled={loading ? true : false}
          >
            Cerrar
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

export default AddNewCollectorModal;
