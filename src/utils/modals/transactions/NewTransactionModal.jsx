import {
  Button,
  Col,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";

const NewTransactionModal = ({
  isOpen,
  isClosed,
  transactionTypes,
  setAlertMessage,
}) => {
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [sendingTransaction, setSendingTransaction] = useState(false);
  const [form] = useForm();

  const getCustomers = async () => {
    const response = await fetch(
      "http://localhost:3001/transactions/customers"
    );
    const customersData = await response.json();

    const names = customersData.map((customer) => ({
      label: customer.name + " " + customer.identity_doc,
      value: customer.id,
    }));

    const account_numbers = customersData.map((customer) => ({
      label: customer.account_number + " " + customer.name,
      value: customer.account_number,
    }));

    setCustomers(names);
    setAccounts(account_numbers);
  };

  const registerTransaction = async (transaction) => {
    setSendingTransaction(true);

    try {
      const response = await fetch(
        "http://localhost:3001/transactions/save-new-transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transaction),
        }
      );

      const transactionData = await response.json();

      if (response.status === 200) {
        setSendingTransaction(false);
        form.resetFields();
        isClosed();
        setAlertMessage.success(transactionData.message);
      } else {
        setSendingTransaction(false);
        setAlertMessage.error(transactionData.message);
      }
    } catch (error) {
      setSendingTransaction(false);
      setAlertMessage.error(error);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

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
            },
          ]}
        >
          <Select
            options={customers}
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
          name="account_number"
          rules={[
            {
              required: true,
              message: "Por Favor, Introduzca un Número de Cuenta",
            },
          ]}
        >
          <Select
            options={accounts}
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
            },
          ]}
        >
          <InputNumber
            prefix="$"
            min={5}
            max={100000}
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
          <Button type="primary" htmlType="submit" loading={sendingTransaction}>
            Realizar Transferencia
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewTransactionModal;
