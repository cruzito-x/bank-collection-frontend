import { Button, Col, Form, Input, Modal, Popconfirm, Row } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/authContext/AuthContext";

const InstantOrQueuedApprovedTransactionModal = ({
  isOpen,
  isClosed,
  setAlertMessage,
  sendToQueue,
  transaction,
  getTransactions,
}) => {
  const { authState } = useAuth();
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [userId, setUserId] = useState([]);
  const [latestApproval, setLatestApproval] = useState([]);
  const [isApproved, setIsApproved] = useState(0);
  const [form] = Form.useForm();
  const token = authState.token;
  const user_id = authState.user_id;

  useEffect(() => {}, [transaction]);

  useEffect(() => {
    if (isClosed) {
      form.resetFields();
    }
  }, [isClosed]);

  const sendSupervisorPin = async (supervisor) => {
    try {
      const response = await fetch(
        `http://localhost:3001/transactions/user-by-pin/${supervisor.pin}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const supervisorData = await response.json();

      if (response.status === 200) {
        setUserId(supervisorData);

        await sendToQueue(transaction);
        isClosed();
        setUpdatingStatus(false);

        const approvalsResponse = await fetch(
          "http://localhost:3001/approvals/latest-approval",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const approvalsData = await approvalsResponse.json();

        if (approvalsResponse.status === 200) {
          setLatestApproval(approvalsData);

          if (approvalsData.length > 0 && supervisorData.length > 0) {
            try {
              await updateTransactionStatus(
                approvalsData[0].approval_id,
                approvalsData[0].transaction_id,
                isApproved,
                supervisorData[0].id
              );
            } catch (error) {
              setAlertMessage.error(
                "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
              );
            } finally {
              setUpdatingStatus(false);
            }
          } else {
            setAlertMessage.error(
              "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
            );
          }
        } else if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("authState");
          window.location.href = "/";
          return;
        } else {
          setAlertMessage.error(approvalsData.message);
        }
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authState");
        window.location.href = "/";
        return;
      } else {
        setAlertMessage.error(supervisorData.message);
      }
    } catch (error) {
      setAlertMessage.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      form.resetFields();
      setUpdatingStatus(false);
    }
  };

  const updateTransactionStatus = async (
    approvalId,
    transactionId,
    isApproved,
    authorizer
  ) => {
    setUpdatingStatus(true);

    try {
      const response = await fetch(
        `http://localhost:3001/approvals/approve-or-reject-transaction/${approvalId}/transaction/${transactionId}/approved/${isApproved}/authorized-by/${authorizer}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
        }
      );

      const transactionStatus = await response.json();

      if (response.status === 200) {
        setAlertMessage.success(transactionStatus.message);
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authState");
        window.location.href = "/";
        return;
      } else {
        setAlertMessage.error(transactionStatus.message);
      }
      setUpdatingStatus(false);
    } catch (error) {
      setAlertMessage.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      setUpdatingStatus(false);
      await getTransactions();
    }
  };

  return (
    <Modal
      title={
        <Row align="middle">
          <Col>
            <WarningOutlined
              className="fs-6"
              style={{ marginRight: 8, color: "var(--blue)" }}
            />
          </Col>
          <Col>
            <label className="fs-6 text-black">
              Esta Acción Requiere Permisos
            </label>
          </Col>
        </Row>
      }
      centered
      width={450}
      open={isOpen}
      onCancel={isClosed}
      footer={null}
      maskClosable={false}
    >
      <p>
        Para continuar con esta transacción, es necesaria la aprobación de un
        supervisor.
      </p>
      <p className="alert alert-primary">
        En Caso de <strong className="text-primary">NO</strong> Disponer de un
        Supervisor, Deberá Enviar la Transacción a Cola en Espera de su
        Aprobación.
      </p>

      <Form form={form} onFinish={sendSupervisorPin}>
        <label className="fw-semibold text-black">
          {" "}
          Clave de Aprobación{" "}
          <span className="text-primary" style={{ fontSize: "11px" }}>
            {" "}
            (Supervisor){" "}
          </span>
        </label>
        <Form.Item
          name="pin"
          rules={[
            { required: true, message: "Introduzca una Clave de Aprobación" },
          ]}
        >
          <Input.Password
            placeholder="Clave de Aprobación"
            iconRender={() => null}
          />
        </Form.Item>
        <Form.Item className="text-end">
          <Popconfirm
            title="¿Desea Rechazar Esta Transacción?"
            onConfirm={() => {
              setIsApproved(0);
              form.submit();
            }}
            okText="Sí"
            cancelText="No"
          >
            <Button type="primary" danger>
              Rechazar
            </Button>
          </Popconfirm>
          <Button
            type="primary"
            className="ant-btn-edit ms-2 me-2"
            onClick={() => {
              sendToQueue(transaction);
              isClosed();
            }}
          >
            Envíar a Cola
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setIsApproved(1);
              form.submit();
            }}
          >
            Aprobar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InstantOrQueuedApprovedTransactionModal;
