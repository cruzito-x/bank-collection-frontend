import { Button, Col, Form, Input, Modal, Row } from "antd";
import { EditOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../contexts/authContext/AuthContext";
import { applyMaskOnlyLetters } from "../../masks/InputMasks";

const EditTransactionTypeModal = ({
  isOpen,
  isClosed,
  setAlertMessage,
  selectedTransactionType,
  getTransactionsTypes,
}) => {
  const { authState } = useAuth();
  const [sendingData, setSendingData] = useState(false);
  const transactionTypeRef = useRef(null);
  const [form] = Form.useForm();
  const token = authState.token;
  const user_id = authState.user_id;

  useEffect(() => {
    form.setFieldsValue({
      transactionType: selectedTransactionType.transaction_type,
    });
  }, [isOpen, selectedTransactionType, form]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (transactionTypeRef.current?.input) {
          applyMaskOnlyLetters(transactionTypeRef.current.input);
        }
      }, 100);

      transactionTypeRef.current.input.addEventListener("input", (event) => {
        form.setFieldsValue({ transaction_type: event.target.value });
      });
    }
  }, [isOpen]);

  const updateTransactionType = async (transactionType) => {
    setSendingData(true);

    try {
      const response = await fetch(
        `http://localhost:3001/transactions-types/update-transaction-type/${selectedTransactionType.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            user_id: user_id,
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
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authState");
        window.location.href = "/";
        return;
      } else if (response.status === 409) {
        setAlertMessage.warning(updatedTransactionType.message);
        setSendingData(false);
        return;
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
      maskClosable={false}
    >
      <Form form={form} onFinish={updateTransactionType}>
        <label className="fw-semibold text-black">
          {" "}
          Tipo de Transacción<span style={{ color: "var(--red)" }}>*</span>
        </label>
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
          <Input ref={transactionTypeRef} placeholder="Tipo de Transacción" />
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

export default EditTransactionTypeModal;
