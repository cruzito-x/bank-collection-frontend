import { Button, Col, Form, Input, InputNumber, Modal, Row } from "antd";
import { EditOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { useAuth } from "../../../contexts/authContext/AuthContext";
import { applyMaskOnlyLetters } from "../../masks/InputMasks";

const EditServiceModal = ({
  isOpen,
  isClosed,
  selectedService,
  getServices,
  setAlertMessage,
}) => {
  const { authState } = useAuth();
  const [sendingData, setSendingData] = useState(false);
  const collectorRef = useRef(null);
  const serviceRef = useRef(null);
  const serviceDescriptionRef = useRef(null);
  const [form] = Form.useForm();
  const token = authState.token;
  const user_id = authState.user_id;

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({
        collector: selectedService.collector,
        service: selectedService.service,
        price: selectedService.price,
        description: selectedService.description,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (collectorRef.current?.input) {
      applyMaskOnlyLetters(collectorRef.current.input);
    }

    if (serviceRef.current?.input) {
      applyMaskOnlyLetters(serviceRef.current.input);
    }

    if (serviceDescriptionRef.current?.input) {
      applyMaskOnlyLetters(serviceDescriptionRef.current.input);
    }
  }, []);

  const updateService = async (serviceData) => {
    setSendingData(true);

    try {
      const response = await fetch(
        `http://localhost:3001/services/update-service/${selectedService.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
          body: JSON.stringify(serviceData),
        }
      );

      const updatedService = await response.json();
      if (response.status === 200) {
        isClosed();
        getServices();
        setAlertMessage.success(updatedService.message);
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authState");
        window.location.href = "/";
        return;
      } else if (response.status === 409) {
        setAlertMessage.warning(updatedService.message);
        setSendingData(false);
        return;
      } else {
        setAlertMessage.error(updatedService.message);
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
            <EditOutlined
              className="fs-6"
              style={{ marginRight: 8, color: "var(--blue)" }}
            />
          </Col>
          <Col>
            <label className="fs-6 text-black">Editar Datos de Servicio</label>
          </Col>
        </Row>
      }
      centered
      open={isOpen}
      width={500}
      onCancel={isClosed}
      footer={null}
      maskClosable={false}
    >
      {selectedService && (
        <Form form={form} onFinish={updateService}>
          <label className="fw-semibold text-black">
            Colector Asociado<span style={{ color: "var(--red)" }}>*</span>
          </label>
          <Form.Item
            name="collector"
            rules={[
              {
                required: true,
                message: "Por favor, Introduzca un Nombre de Colector",
              },
            ]}
          >
            <Input
              ref={collectorRef}
              placeholder="Nombre de Colector"
              readOnly
            />
          </Form.Item>
          <label className="fw-semibold text-black">
            Nombre de Servicio<span style={{ color: "var(--red)" }}>*</span>
          </label>
          <Form.Item
            name="service"
            rules={[
              {
                required: true,
                message: "Por favor, Introduzca un Nombre de Servicio",
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
                required: true,
                message: "Por favor, Introduzca un Precio de Servicio",
              },
            ]}
          >
            <InputNumber
              className="w-100"
              prefix="$"
              min={5}
              max={10000}
              placeholder="Precio de Servicio"
            />
          </Form.Item>
          <label className="fw-semibold text-black">
            Descripción del Servicio
            <span style={{ color: "var(--red)" }}>*</span>
          </label>
          <Form.Item
            name="description"
            rules={[
              {
                required: true,
                message:
                  "Por Favor, Introduzca una Descripción Para el Servicio",
                min: 5,
                max: 255,
              },
            ]}
          >
            <TextArea
              ref={serviceDescriptionRef}
              rows={4}
              size="middle"
              style={{ resize: "none" }}
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
              disabled={sendingData}
            >
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

export default EditServiceModal;
