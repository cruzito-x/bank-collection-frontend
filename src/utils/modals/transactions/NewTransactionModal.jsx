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
import React from "react";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";

const NewTransactionModal = ({ isOpen, isClosed, transactionTypes }) => {
  const [form] = useForm();

  const registerTransaction = async (transaction) => {};

  return (
    <Modal
      title={
        <Row align="middle">
          {" "}
          <Col>
            {" "}
            <PlusCircleOutlined
              className="fs-6"
              style={{ marginRight: 8, color: "var(--blue)" }}
            />{" "}
          </Col>{" "}
          <Col>
            <label className="fs-6 text-black">Nueva Transacción</label>
          </Col>{" "}
        </Row>
      }
      centered
      width={450}
      open={isOpen}
      onCancel={isClosed}
      footer={null}
    >
      <Form form={form} onFinish={registerTransaction}>
        <label className="fw-semibold text-black"> Tipo de Transacción </label>
        <Form.Item
          name="transaction_type"
          rules={[
            {
              required: true,
              message: "Por Favor, Seleccione un Tipo de Transacción",
            },
          ]}
        >
          <Select defaultValue={1} options={transactionTypes} />
        </Form.Item>
        <label className="fw-semibold text-black"> Cliente </label>
        <Form.Item
          name="customer"
          rules={[
            {
              required: true,
              message: "Por Favor, Introduzca un Número de Identificación",
              min: 5,
              max: 10000,
            },
          ]}
        >
          <Select
            // options={services}
            onChange={(value) => {
              form.setFieldsValue({ service_id: value });
            }}
            showSearch
            placeholder="Introduzca un Número de Identificación"
            // disabled={sendingDataLoading ? true : false}
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
        <label className="fw-semibold text-black"> Cuenta </label>
        <Form.Item
          name="customer"
          rules={[
            {
              required: true,
              message: "Por Favor, Introduzca un Número de Cuenta",
              min: 5,
              max: 10000,
            },
          ]}
        >
          <Select
            // options={services}
            onChange={(value) => {
              form.setFieldsValue({ service_id: value });
            }}
            showSearch
            placeholder="Introduzca un Número de Cuenta"
            // disabled={sendingDataLoading ? true : false}
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
        <label className="fw-semibold text-black"> Monto </label>
        <Form.Item
          name="amount"
          rules={[
            {
              required: true,
              message: "Por Favor, Introduzca un Monto Mínimo de $5",
              min: 5,
              max: 10000,
            },
          ]}
        >
          <InputNumber
            prefix="$"
            min={5}
            max={10000}
            placeholder="0.00"
            onChange={(value) => {
              form.setFieldsValue({ amount: value });
            }}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
        <label className="fw-semibold text-black"> Concepto </label>
        <Form.Item
          name="concept"
          rules={[
            {
              required: true,
              message: "Por Favor, Introduzca un Concepto",
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
            placeholder="Concepto"
          />
        </Form.Item>
        <Form.Item className="text-end">
          <Button type="primary" htmlType="submit">
            Realizar Transferencia
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewTransactionModal;
