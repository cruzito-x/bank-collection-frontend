import { Button, Col, Form, Input, Modal, Row } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useAuth } from "../../../contexts/authContext/AuthContext";

const AddNewTransactionTypeModal = ({
  isOpen,
  isClosed,
  setAlertMessage,
  getTransactionsTypes,
}) => {
  const { authState } = useAuth();
  const [sendingData, setSendingData] = useState(false);
  const [form] = Form.useForm();
  const token = authState.token;
  const user_id = authState.user_id;

  const saveNewTransactionType = async (transactionType) => {
    setSendingData(true);

    try {
      const response = await fetch(
        "http://localhost:3001/transactions-types/save-new-transaction-type",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
          body: JSON.stringify(transactionType),
        }
      );

      const savedTransactionType = await response.json();

      if (response.status === 200) {
        setAlertMessage.success(savedTransactionType.message);
        isClosed();
        getTransactionsTypes();
        form.resetFields();
      } else {
        setAlertMessage.error(savedTransactionType.message);
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
            <label className="fs-6 text-black">Nuevo Tipo de Transacción</label>
          </Col>
        </Row>
      }
      centered
      width={400}
      open={isOpen}
      onCancel={isClosed}
      footer={null}
      maskClosable={false}
    >
      <Form form={form} onFinish={saveNewTransactionType}>
        <label className="fw-semibold text-black"> Tipo de Transacción </label>
        <Form.Item
          name="transactionType"
          rules={[
            {
              required: true,
              message: "Introduzca un Nombre para el Tipo de Transacción",
            },
          ]}
        >
          <Input placeholder="Tipo de Transacción" />
        </Form.Item>
        <Form.Item className="text-end">
          <Button
            key="back"
            type="primary"
            danger
            onClick={isClosed}
            disabled={sendingData ? true : false}
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

export default AddNewTransactionTypeModal;
