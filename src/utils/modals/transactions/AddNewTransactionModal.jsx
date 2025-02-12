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
import { PlusCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import InstantOrQueuedApprovedTransactionModal from "./InstantOrQueuedApprovedTransactionModal";
import { useAuth } from "../../../contexts/authContext/AuthContext";

const AddNewTransactionModal = ({
  isOpen,
  isClosed,
  transactionTypes,
  getTransactions,
  isSupervisor,
  setAlertMessage,
}) => {
  const { authState } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const [percentage, setPercentage] = useState(0);
  const [cancelTransaction, setCancelTransaction] = useState(false);
  const cancelTransactionRef = useRef(cancelTransaction);
  const [sendingTransaction, setSendingTransaction] = useState(false);
  const [form] = useForm();
  const [showReceiverAccount, setShowReceiverAccount] = useState(false);
  const [
    openInstantOrQueuedApprovedTransaction,
    setOpenInstantOrQueuedApprovedTransaction,
  ] = useState(false);
  const token = authState.token;
  const user_id = authState.user_id;

  useEffect(() => {
    getCustomers();
    getAllAccounts();
    setShowReceiverAccount(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setShowReceiverAccount(false);
      form.resetFields();
    }
  }, [isOpen]);

  const getCustomers = async () => {
    const response = await fetch("http://localhost:3001/customers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const customersData = await response.json();

    if (response.status === 200) {
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
    } else if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("authState");
      window.location.href = "/";
      return;
    } else {
      setAlertMessage.error(customersData.message);
    }
  };

  const getAccountsOnCustomerChange = (customer) => {
    form.setFieldsValue({ customer: customer });
    getAccountsByCustomer(customer);
  };

  const getAllAccounts = async () => {
    const response = await fetch("http://localhost:3001/accounts/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const accountsData = await response.json();

    if (response.status === 200) {
      const accounts = accountsData.map((account) => {
        return {
          value: account.account_number,
          label: account.account_number,
        };
      });

      setAllAccounts(accounts);
    } else if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("authState");
      window.location.href = "/";
      return;
    } else {
      setAlertMessage.error(accountsData.message);
    }
  };

  const getAccountsByCustomer = async (customerId = 0) => {
    const response = await fetch(
      `http://localhost:3001/accounts/accounts-by-customer/${customerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const accountsData = await response.json();

    if (response.status === 200) {
      const accounts = accountsData.map((account) => {
        return {
          value: account.account_number,
          label: account.account_number,
        };
      });

      setAccounts(accounts);
    } else if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("authState");
      window.location.href = "/";
      return;
    } else {
      setAlertMessage.error(accountsData.message);
    }
  };

  const instantApproveOrQueued = async (transaction) => {
    if (!isSupervisor) {
      if (transaction.amount >= 10000 && transaction.transaction_type === 2) {
        setOpenInstantOrQueuedApprovedTransaction(true);
      } else {
        await registerTransaction(transaction);
      }
    } else {
      await registerTransaction(transaction);
    }
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
            Authorization: `Bearer ${token}`,
            user_id: user_id,
          },
          body: JSON.stringify(transaction),
        }
      );

      const transactionData = await response.json();

      if (response.status === 200) {
        form.resetFields();
        isClosed();
        getTransactions();
        setAlertMessage.success(transactionData.message);
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authState");
        window.location.href = "/";
        return;
      } else {
        setAlertMessage.error(transactionData.message);
      }
    } catch (error) {
      setAlertMessage.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      setPercentage(0);
      setSendingTransaction(false);
      setCancelTransaction(false);
      cancelTransactionRef.current = false;
    }
  };

  const startTransactionProcess = (transaction) => {
    setPercentage(0);
    setCancelTransaction(false);
    cancelTransactionRef.current = false;
    setSendingTransaction(true);

    let progress = 0;
    const interval = setInterval(() => {
      if (cancelTransactionRef.current) {
        clearInterval(interval);
        setPercentage(0);
        setSendingTransaction(false);

        return;
      }

      progress += 2;
      setPercentage(progress);

      if (progress === 100) {
        clearInterval(interval);
        instantApproveOrQueued(transaction);
      }
    }, 100);
  };

  const cancelTransactionProcess = () => {
    setCancelTransaction(true);
    cancelTransactionRef.current = true;
    setPercentage(0);
    setSendingTransaction(false);
  };

  return (
    <>
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
              <label className="fs-6 text-black">Nueva Transacción</label>
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
        <div className={percentage >= 1 ? "d-block" : "d-none"}>
          <label className="fw-semibold mb-1" style={{ color: "var(--red)" }}>
            ¿Desea Cancelar la Transacción?
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
                className="fw-semibold ms-3 cursor-pointer"
                onClick={cancelTransactionProcess}
                style={{ color: "var(--red)" }}
              >
                Cancelar
              </label>
            </div>
          </Flex>
        </div>
        <Form
          form={form}
          // onFinish={instantApproveOrQueued}
          onFinish={startTransactionProcess}
          initialValues={{ transaction_type: 1 }}
          onValuesChange={(changedValues) => {
            if (changedValues.transaction_type !== undefined) {
              const selectedType = changedValues.transaction_type;
              setShowReceiverAccount(selectedType === 3);

              if (selectedType !== 3) {
                form.setFieldsValue({
                  receiver_account_number: form.getFieldValue(
                    "sender_account_number"
                  ),
                });
              }
            }

            if (changedValues.receiver_account_number !== undefined) {
              const selectedType = form.getFieldValue("transaction_type");

              if (selectedType !== 3) {
                form.setFieldsValue({
                  receiver_account_number: changedValues.sender_account_number,
                });
              }
            }
          }}
        >
          <label className="fw-semibold text-black">
            {" "}
            Tipo de Transacción{" "}
          </label>
          <Form.Item
            name="transaction_type"
            rules={[
              {
                required: true,
                message: "Por Favor, Seleccione un Tipo de Transacción",
              },
            ]}
          >
            <Select options={transactionTypes} />
          </Form.Item>

          <label className="fw-semibold text-black"> Remitente </label>
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
              onChange={getAccountsOnCustomerChange}
              showSearch
              placeholder="Introduzca un Número de Identificación"
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

          <label className="fw-semibold text-black">
            {" "}
            N.º Cuenta {showReceiverAccount ? "Origen" : ""}{" "}
          </label>
          <Form.Item
            name="sender_account_number"
            rules={[
              {
                required: true,
                message: "Por Favor, Introduzca un Número de Cuenta",
              },
            ]}
          >
            <Select
              options={accounts}
              onChange={(value) => {
                form.setFieldsValue({ sender_account_number: value });
              }}
              showSearch
              placeholder="Introduzca un Número de Cuenta"
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

          {showReceiverAccount && (
            <>
              <label className="fw-semibold text-black">
                {" "}
                N.º Cuenta Destino
              </label>
              <Form.Item
                name="receiver_account_number"
                rules={[
                  {
                    required: true,
                    message: "Por Favor, Introduzca un Número de Cuenta",
                  },
                ]}
              >
                <Select
                  options={allAccounts}
                  showSearch
                  placeholder="Introduzca un Número de Cuenta"
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
            </>
          )}

          <label className="fw-semibold text-black"> Monto </label>
          <Form.Item
            name="amount"
            rules={[
              {
                required: true,
                message: "Por Favor, Introduzca una Cantidad Mínima de $5",
              },
            ]}
          >
            <InputNumber
              prefix="$"
              min={5}
              max={100000}
              placeholder="0.00"
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          {showReceiverAccount && (
            <>
              <label className="fw-semibold text-black">
                {" "}
                Concepto{" "}
                <span className="text-primary" style={{ fontSize: "11px" }}>
                  {" "}
                  (Opcional){" "}
                </span>{" "}
              </label>
              <Form.Item
                name="concept"
                rules={[
                  {
                    message: "Por Favor, Introduzca un Concepto",
                    min: 5,
                    max: 255,
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  size="middle"
                  style={{ resize: "none" }}
                  placeholder="Concepto"
                />
              </Form.Item>
            </>
          )}

          <Form.Item className="text-end">
            <Button
              key="back"
              type="primary"
              danger
              onClick={isClosed}
              disabled={sendingTransaction ? true : false}
            >
              Cerrar
            </Button>
            <Button
              className="ms-2"
              type="primary"
              htmlType="submit"
              loading={sendingTransaction}
            >
              Realizar Transacción
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <InstantOrQueuedApprovedTransactionModal
        isOpen={openInstantOrQueuedApprovedTransaction}
        isClosed={() => {
          setOpenInstantOrQueuedApprovedTransaction(false);
        }}
        isSupervisor={isSupervisor}
        sendToQueue={registerTransaction}
        transaction={form.getFieldsValue(true)}
        setAlertMessage={setAlertMessage}
        getTransactions={getTransactions}
      />
    </>
  );
};

export default AddNewTransactionModal;
