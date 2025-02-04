import { Button, Col, Form, Input, Modal, Row } from "antd";
import { EditOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";

const EditCollectorModal = ({
  isOpen,
  isClosed,
  selectedCollector,
  getCollectors,
  setAlertMessage,
}) => {
  const [sendingData, setSendingData] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({
        collector: selectedCollector.collector,
        description: selectedCollector.description,
      });
    }
  }, [isOpen]);

  const updateCollector = async (collectorData) => {
    setSendingData(true);

    console.log(collectorData);

    try {
      const response = await fetch(
        `http://localhost:3001/collectors/update-collector/${selectedCollector.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(collectorData),
        }
      );

      const updatedCollector = await response.json();
      if (response.status === 200) {
        isClosed();
        getCollectors();
        setAlertMessage.success(updatedCollector.message);
      } else {
        setAlertMessage.error(updatedCollector.message);
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
            <label className="fs-6 text-black">Editar Datos de Colector</label>
          </Col>
        </Row>
      }
      centered
      open={isOpen}
      width={500}
      onCancel={isClosed}
      footer={null}
    >
      {selectedCollector && (
        <Form form={form} onFinish={updateCollector}>
          <label className="fw-semibold text-black">Nombre de Colector</label>
          <Form.Item
            name="collector"
            rules={[
              {
                required: true,
                message: "Por favor, Introduzca un Nombre de Colector",
              },
            ]}
          >
            <Input placeholder="Nombre de Colector" />
          </Form.Item>
          <label className="fw-semibold text-black">
            Descripción del Colector
          </label>
          <Form.Item
            name="description"
            rules={[
              {
                required: true,
                message:
                  "Por Favor, Introduzca una Descripción Para el Colector",
              },
            ]}
          >
            <TextArea
              rows={4}
              size="middle"
              style={{ resize: "none" }}
              placeholder="Descripción del Colector"
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

export default EditCollectorModal;
