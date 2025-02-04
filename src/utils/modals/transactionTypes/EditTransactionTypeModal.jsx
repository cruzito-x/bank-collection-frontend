import { Button, Col, Form, Input, Modal, Row } from "antd";
import { EditOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";

const EditTransactionTypeModal = ({
  isOpen,
  isClosed,
  setAlertMessage,
  selectedTransactionType,
  getTransactionsTypes,
}) => {
  const [sendingData, setSendingData] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      transactionType: selectedTransactionType.transaction_type,
    });
  }, [isOpen, selectedTransactionType, form]);

  const updateTransactionType = async (transactionType) => {
    setSendingData(true);

    try {
      const response = await fetch(
        `http://localhost:3001/transactions-types/update-transaction-type/${selectedTransactionType.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transactionType),
        }
      );

      const updatedTransactionType = await response.json();

      if (response.status === 200) {
        setAlertMessage.success(updatedTransactionType.message);
        setSendingData(false);
        isClosed();
        getTransactionsTypes();
        form.resetFields();
      } else {
        setAlertMessage.error(updatedTransactionType.message);
        setSendingData(false);
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
            <label className="fs-6 text-black">
              Editar Tipo de Transacción
            </label>
          </Col>
        </Row>
      }
      centered
      width={400}
      open={isOpen}
      onCancel={isClosed}
      footer={null}
    >
      <Form form={form} onFinish={updateTransactionType}>
        <label className="fw-semibold text-black"> Tipo de Transacción </label>
        <Form.Item
          name="transactionType"
          rules={[
            {
              required: true,
              message: "Introduzca un Nombre para el Tipo de Transacción",
            },
          ]}
          initialValue={selectedTransactionType.transaction_type}
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
            Guardar Cambios
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTransactionTypeModal;
