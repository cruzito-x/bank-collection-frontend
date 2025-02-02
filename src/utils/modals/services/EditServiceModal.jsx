import { Button, Col, Form, Input, InputNumber, Modal, Row } from "antd";
import { EditOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";

const EditServiceModal = ({
  isOpen,
  isClosed,
  selectedService,
  getServices,
  setAlertMessage,
}) => {
  const [sendingData, setSendingData] = useState(false);
  const [form] = Form.useForm();

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

  const updateService = async (serviceData) => {
    setSendingData(true);

    try {
      const response = await fetch(
        `http://localhost:3001/services/update-service/${selectedService.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serviceData),
        }
      );

      const updatedService = await response.json();
      if (response.status === 200) {
        isClosed();
        getServices();
        setAlertMessage.success(updatedService.message);
      } else {
        setAlertMessage.error(updatedService.message);
      }
    } catch (error) {
      setAlertMessage.error(
        "Hubo un Error al Actualizar los Datos del Servicio"
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
    >
      {selectedService && (
        <Form form={form} onFinish={updateService}>
          <label className="fw-semibold text-black">Colector Asociado</label>
          <Form.Item
            name="collector"
            rules={[
              {
                required: true,
                message: "Por favor, Introduzca un Nombre de Colector",
              },
            ]}
          >
            <Input placeholder="Nombre de Colector" readOnly />
          </Form.Item>
          <label className="fw-semibold text-black">Nombre de Servicio</label>
          <Form.Item
            name="service"
            rules={[
              {
                required: true,
                message: "Por favor, Introduzca un Nombre de Servicio",
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
              rows={4}
              size="middle"
              style={{ resize: "none" }}
              placeholder="Descripción del Servicio"
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
              Guardar Cambios
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default EditServiceModal;
