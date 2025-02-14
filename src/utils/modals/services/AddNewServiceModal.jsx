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
  const [services, setServices] = useState([
    { service: "", description: "", price: 0 },
  ]);
  const [sendingData, setSendingData] = useState(false);
  const [form] = Form.useForm();
  const token = authState.token;
  const user_id = authState.user_id;

  useEffect(() => {
    getCollectors();
  }, []);

  useEffect(() => {
    if (isClosed) {
      form.resetFields();
      setServices([{ service: "", description: "", price: 0 }]);
    }
  }, [isClosed]);

  const addOtherService = () => {
    setServices([...services, { service: "", description: "", price: 0 }]);
  };

  const removeExtraServices = (index) => {
    const newServices = services.filter((_, n) => n !== index);
    setServices(newServices);
  };

  const onChangeServiceName = (index, field, value) => {
    const newServices = [...services];
    newServices[index][field] = value;
    setServices(newServices);
  };

  const saveNewServices = async () => {
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
          body: JSON.stringify({
            collector: form.getFieldValue("collector"),
            services,
          }),
        }
      );

      const savedService = await response.json();

      if (response.status === 200) {
        setAlertMessage.success(savedService.message);
        form.resetFields();
        setServices([{ service: "", description: "", price: 0 }]);
        isClosed();
        getServices();
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authState");
        window.location.href = "/";
        return;
      } else if (response.status === 409) {
        setAlertMessage.warning(savedService.message);
        setSendingData(false);
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
      <Form form={form} onFinish={saveNewServices}>
        <label className="fw-semibold text-black">Seleccionar Colector</label>
        <Form.Item
          className="mb-3"
          name="collector"
          rules={[{ required: true, message: "Seleccione un colector" }]}
        >
          <Select
            className="w-100"
            options={collectors}
            showSearch
            placeholder="Buscar Colector"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            disabled={sendingData}
          />
        </Form.Item>

        {services.map((service, index) => (
          <div key={index} className="mb-3">
            <label className="fw-semibold text-black">
              Nombre del Servicio
            </label>
            <Form.Item
              name={["services", index, "service"]}
              rules={[
                {
                  required: true,
                  message: "Introduzca un nombre para el servicio",
                },
              ]}
            >
              <Input
                value={service.service}
                onChange={(event) =>
                  onChangeServiceName(index, "service", event.target.value)
                }
                placeholder="Nombre del Servicio"
              />
            </Form.Item>

            <label className="fw-semibold text-black">Costo del Servicio</label>
            <Form.Item
              name={["services", index, "price"]}
              rules={[
                {
                  required: false,
                  message: "Introduzca un Precio Para el Servicio",
                },
              ]}
            >
              <InputNumber
                prefix="$"
                className="w-100"
                min={0}
                max={100000}
                placeholder="0.00"
                value={service.price}
                onChange={(value) => onChangeServiceName(index, "price", value)}
              />
            </Form.Item>

            <label className="fw-semibold text-black">
              Descripción del Servicio
            </label>
            <Form.Item
              name={["services", index, "description"]}
              rules={[
                {
                  required: true,
                  message: "Introduzca una descripción para el servicio",
                  min: 5,
                  max: 255,
                },
              ]}
            >
              <TextArea
                rows={4}
                style={{ resize: "none" }}
                placeholder="Descripción del Servicio"
                value={service.description}
                onChange={(event) =>
                  onChangeServiceName(index, "description", event.target.value)
                }
                maxLength={255}
                showCount
              />
            </Form.Item>

            {index > 0 && (
              <div className="text-start">
                <Button
                  danger
                  type="primary"
                  onClick={() => removeExtraServices(index)}
                >
                  Eliminar Servicio
                </Button>

                {index === services.length - 1 && (
                  <Button
                    className="ms-2 mb-3"
                    type="primary"
                    onClick={addOtherService}
                  >
                    Agregar Otro Servicio
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}

        {services.length <= 1 && (
          <Button className="mb-3" type="primary" onClick={addOtherService}>
            Agregar Otro Servicio
          </Button>
        )}

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
