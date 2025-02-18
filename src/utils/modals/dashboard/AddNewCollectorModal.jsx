import { Button, Col, Form, Input, InputNumber, Modal, Row } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { useAuth } from "../../../contexts/authContext/AuthContext";
import {
  applyMaskOnlyLetters,
  applyMaskOnlyNumbersWithDecimal,
} from "../../masks/InputMasks";

const AddNewCollectorModal = ({ isOpen, isClosed, setAlertMessage }) => {
  const { authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const collectorRef = useRef(null);
  const collectorDescriptionRef = useRef(null);
  const serviceRef = useRef(null);
  const servicePriceRef = useRef(null);
  const serviceDescriptionRef = useRef(null);
  const [form] = Form.useForm();
  const token = authState.token;
  const user_id = authState.user_id;

  useEffect(() => {
    if (isOpen) {
      form.resetFields();
    }
  }, [isOpen]);

  useEffect(() => {
    if (collectorRef.current?.input) {
      applyMaskOnlyLetters(collectorRef.current.input);
    }

    if (collectorDescriptionRef.current?.input) {
      applyMaskOnlyLetters(collectorDescriptionRef.current.input);
    }

    if (serviceRef.current?.input) {
      applyMaskOnlyLetters(serviceRef.current.input);
    }

    if (servicePriceRef.current?.input) {
      applyMaskOnlyNumbersWithDecimal(servicePriceRef.current.input);
    }

    if (serviceDescriptionRef.current?.input) {
      applyMaskOnlyLetters(serviceDescriptionRef.current.input);
    }
  }, []);

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
        <label className="fw-semibold text-black">
          {" "}
          Nombre de Colector<span style={{ color: "var(--red)" }}>*</span>{" "}
        </label>
        <Form.Item
          name="collector_name"
          rules={[
            {
              required: true,
              message: "Por Favor, Introduzca un Nombre de Colector",
            },
          ]}
        >
          <Input ref={collectorRef} placeholder="Nombre de Colector" />
        </Form.Item>
        <label className="fw-semibold text-black">
          {" "}
          Descripción del Colector<span style={{ color: "var(--red)" }}>*</span>
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
            ref={collectorDescriptionRef}
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
        <label className="fw-semibold text-black">
          {" "}
          Servicio<span style={{ color: "var(--red)" }}>*</span>{" "}
        </label>
        <Form.Item
          name="service_name"
          rules={[
            {
              required: true,
              message: "Por Favor, Introduzca un Nombre de Servicio",
            },
          ]}
        >
          <Input ref={serviceRef} placeholder="Nombre de Servicio" />
        </Form.Item>
        <label className="fw-semibold text-black">
          Costo del Servicio<span style={{ color: "var(--red)" }}>*</span>
        </label>
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
            ref={servicePriceRef}
            className="w-100"
            prefix="$"
            min={0}
            max={10000}
            placeholder="0.00"
          />
        </Form.Item>
        <label className="fw-semibold text-black">
          {" "}
          Descripción del Servicio<span style={{ color: "var(--red)" }}>*</span>
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
            ref={serviceDescriptionRef}
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
