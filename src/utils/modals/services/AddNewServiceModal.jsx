import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { useCollectorsData } from "../../../contexts/collectorsDataContext/CollectorsDataContext";
import { useAuth } from "../../../contexts/authContext/AuthContext";

const AddNewServiceModal = ({
  isOpen,
  isClosed,
  getServices,
  setAlertMessage,
}) => {
  const { authState } = useAuth();
  const { collectors, getCollectors } = useCollectorsData();
  const [sendingData, setSendingData] = useState(false);
  const [form] = Form.useForm();
  const token = authState.token;
  const user_id = authState.user_id;

  useEffect(() => {
    getCollectors();
  }, []);

  const saveNewService = async (service) => {
    setSendingData(true);

    try {
      const response = await fetch(
        "http://localhost:3001/services/save-service",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
          body: JSON.stringify(service),
        }
      );

      const savedService = await response.json();

      if (response.status === 200) {
        setAlertMessage.success(savedService.message);
        form.resetFields();
        setSendingData(false);
        isClosed();
        getServices();
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      } else {
        setAlertMessage.error(savedService.message);
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
            <PlusCircleOutlined
              className="fs-6"
              style={{ marginRight: 8, color: "var(--blue)" }}
            />
          </Col>
          <Col>
            <label className="fs-6 text-black">Añadir Nuevo Servicio</label>
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
      <Form form={form} onFinish={saveNewService}>
        <label className="fw-semibold text-black"> Seleccionar Colector </label>
        <Form.Item
          name="collector"
          rules={[
            {
              required: true,
              message: "Por Favor, Seleccione un Colector",
            },
          ]}
        >
          <Select
            options={collectors}
            showSearch
            placeholder="Buscar Colector"
            disabled={sendingData}
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
        <label className="fw-semibold text-black"> Nombre de Servicio </label>
        <Form.Item
          name="service"
          rules={[
            {
              required: true,
              message: "Por Favor, Introduzca un Nombre de Servicio",
            },
          ]}
        >
          <Input placeholder="Nombre del Servicio" />
        </Form.Item>
        <label className="fw-semibold text-black"> Costo de Servicio </label>
        <Form.Item
          name="price"
          rules={[
            {
              required: true,
              message: "Por Favor, Introduzca un Costo de Servicio",
            },
          ]}
        >
          <InputNumber
            prefix="$"
            className="w-100"
            min={0}
            max={100000}
            placeholder="Precio del Servicio"
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
    </Modal>
  );
};

export default AddNewServiceModal;
