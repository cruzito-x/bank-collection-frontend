import {
  Button,
  Col,
  Flex,
  Form,
  InputNumber,
  Modal,
  Progress,
  Row,
  Select,
} from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { useCollectorsData } from "../../../contexts/collectorsDataContext/CollectorsDataContext";

const PaymentsCollectorsModal = ({
  isOpen,
  isClosed,
  setAlertMessage,
  currentPath,
  getPaymentsCollectors,
}) => {
  const [percentage, setPercentage] = useState(0);
  const [cancelPayment, setCancelPayment] = useState(false);
  const cancelPaymentRef = useRef(cancelPayment);
  const [sendingDataLoading, setSendingDataLoading] = useState(false);
  const { collectors, getCollectors } = useCollectorsData();
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [form] = useForm();

  useEffect(() => {
    if (isOpen) {
      form.resetFields();
    }
  }, [isOpen]);

  useEffect(() => {
    getCollectors();
    getCustomers();
  }, []);

  useEffect(() => {
    cancelPaymentRef.current = cancelPayment;
  }, [cancelPayment]);

  const getCustomers = async () => {
    try {
      const response = await fetch("http://localhost:3001/customers", {
        method: "GET",
      });

      const customersData = await response.json();
      const uniqueCustomer = new Map();

      customersData.forEach((customer) => {
        if (!uniqueCustomer.has(customer.id)) {
          uniqueCustomer.set(customer.id, {
            label: `${customer.name} ${customer.identity_doc}`,
            value: customer.id,
          });
        }
      });

      const customers = Array.from(uniqueCustomer.values());

      setCustomers(customers);
    } catch (error) {
      setAlertMessage.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    }
  };

  const getServiceOnCollectorsChange = (value) => {
    form.setFieldsValue({ collector_id: value });
    getServicesByCollector(value);
  };

  const getServicesByCollector = async (collectorId = 0) => {
    const response = await fetch(
      `http://localhost:3001/services/services-by-collector/${collectorId}`,
      {
        method: "GET",
      }
    );

    const servicesData = await response.json();
    const services = servicesData.map((service) => {
      return {
        value: service.id,
        label: service.service_name,
        price: service.price,
      };
    });

    setServices(services);
  };

  const startRegisterProgress = (paymentData) => {
    setPercentage(0);
    setCancelPayment(false);
    cancelPaymentRef.current = false;
    setSendingDataLoading(true);

    let progress = 0;
    const interval = setInterval(() => {
      if (cancelPaymentRef.current) {
        clearInterval(interval);
        setPercentage(0);
        setSendingDataLoading(false);

        return;
      }

      progress += 2;
      setPercentage(progress);

      if (progress === 100) {
        clearInterval(interval);
        registerPayment(paymentData);
      }
    }, 100);
  };

  const cancelRegisterPayment = () => {
    setCancelPayment(true);
    cancelPaymentRef.current = true;
    setPercentage(0);
    setSendingDataLoading(false);
  };

  const registerPayment = async (payment) => {
    if (cancelPayment.current) return;

    try {
      const response = await fetch(
        "http://localhost:3001/payments-collectors/save-new-payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payment),
        }
      );

      const registeredPayment = await response.json();

      if (response.status === 200) {
        setAlertMessage.success(registeredPayment.message);
        isClosed();

        if (currentPath === "/payments-collectors") {
          getPaymentsCollectors();
        }

        if (currentPath === "/dashboard") {
        }
      } else {
        setAlertMessage.error(registeredPayment.message);
      }
    } catch (error) {
      setAlertMessage.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      setPercentage(0);
      setSendingDataLoading(false);
      setCancelPayment(false);
      cancelPaymentRef.current = false;
    }
  };

  return (
    <Modal
      title={
        <Row align="middle">
          <Col>
            <DollarCircleOutlined
              className="fs-6"
              style={{ marginRight: 8, color: "var(--blue)" }}
            />
          </Col>
          <Col>
            <label className="fs-6 text-black">Nuevo Pago a Colector</label>
          </Col>
        </Row>
      }
      centered
      width={450}
      open={isOpen}
      onOk={isClosed}
      onCancel={isClosed}
      footer={null}
    >
      <div className={percentage >= 1 ? "d-block" : "d-none"}>
        <label className="fw-semibold mb-1 text-danger">
          {" "}
          ¿Desea Cancelar el Pago?{" "}
        </label>
        <Flex className="mb-2" vertical gap="small">
          <div className="d-flex">
            <Progress
              percent={percentage}
              type="line"
              status="active"
              showInfo={false}
            />
            <label
              className="fw-semibold ms-3 text-danger cursor-pointer"
              onClick={cancelRegisterPayment}
            >
              Cancelar
            </label>
          </div>
        </Flex>
      </div>
      <Form form={form} onFinish={startRegisterProgress}>
        <label className="fw-semibold text-black"> Seleccionar Cliente </label>
        <Form.Item
          name="customer_id"
          rules={[
            {
              required: true,
              message: "Por Favor, Seleccione un Cliente",
            },
          ]}
        >
          <Select
            options={customers}
            onChange={(value) => {
              form.setFieldsValue({ customer_id: value });
            }}
            showSearch
            placeholder="Buscar Cliente"
            disabled={sendingDataLoading ? true : false}
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
        <label className="fw-semibold text-black"> Seleccionar Colector </label>
        <Form.Item
          name="collector_id"
          rules={[
            {
              required: true,
              message: "Por Favor, Seleccione un Colector",
            },
          ]}
        >
          <Select
            options={collectors}
            onChange={getServiceOnCollectorsChange}
            showSearch
            placeholder="Buscar Colector"
            disabled={sendingDataLoading ? true : false}
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
        <label className="fw-semibold text-black"> Seleccionar Servicio </label>
        <Form.Item
          name="service_id"
          rules={[
            {
              required: true,
              message: "Por Favor, Seleccione un Servicio",
            },
          ]}
        >
          <Select
            options={services}
            onChange={(value) => {
              const selectedService = services.find(
                (service) => service.value === value
              );

              form.setFieldsValue({
                service_id: value,
                amount: selectedService?.price || 0,
              });
            }}
            showSearch
            placeholder="Buscar Servicio"
            disabled={sendingDataLoading}
            optionFilterProp="label"
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
        <label className="fw-semibold text-black"> Monto </label>
        <Form.Item
          name="amount"
          rules={[
            {
              required: true,
              message: "Por Favor, Introduzca una Cantidad Mínima de $5.00",
            },
          ]}
        >
          <InputNumber
            prefix="$"
            min={5}
            max={10000}
            placeholder="0.00"
            disabled={sendingDataLoading ? true : false}
            value={form.getFieldValue("amount")}
            onChange={(value) => {
              form.setFieldsValue({ amount: value });
            }}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
        <label className="fw-semibold text-black"> Fecha y Hora </label>
        <Form.Item>
          <input
            type="text"
            className="form-control"
            value={moment().format("DD/MM/YYYY - hh:mm A")}
            disabled={sendingDataLoading ? true : false}
            readOnly
          />
        </Form.Item>
        <Form.Item className="text-end">
          <Button
            key="back"
            type="primary"
            danger
            onClick={isClosed}
            disabled={sendingDataLoading ? true : false}
          >
            Cerrar
          </Button>
          <Button
            className="ms-2"
            type="primary"
            htmlType="submit"
            loading={sendingDataLoading}
          >
            Registrar Pago
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PaymentsCollectorsModal;
