import { Button, Col, Form, InputNumber, Modal, Row, Select } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import InstantOrQueuedApprovedTransaction from "./InstantOrQueuedApprovedTransaction";

const AddNewTransactionModal = ({
  isOpen,
  isClosed,
  transactionTypes,
  getTransactions,
  isSupervisor,
  setAlertMessage,
}) => {
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [accountBalance, setAccountBalance] = useState(0);
  const [allAccounts, setAllAccounts] = useState([]);
  const [sendingTransaction, setSendingTransaction] = useState(false);
  const [form] = useForm();
  const [showReceiverAccount, setShowReceiverAccount] = useState(true);
  const [
    openInstantOrQueuedApprovedTransaction,
    setOpenInstantOrQueuedApprovedTransaction,
  ] = useState(false);

  useEffect(() => {
    getCustomers();
    getAllAccounts();
    setShowReceiverAccount(false);
  }, []);

  const getCustomers = async () => {
    const response = await fetch("http://localhost:3001/customers");
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
  };

  const getAccountsOnCustomerChange = (customer) => {
    form.setFieldsValue({ customer: customer });
    getAccountsByCustomer(customer);
  };

  const getAllAccounts = async () => {
    const response = await fetch("http://localhost:3001/accounts/", {
      method: "GET",
    });
    const accountsData = await response.json();
    const accounts = accountsData.map((account) => {
      return {
        value: account.account_number,
        label: account.account_number,
      };
    });

    setAllAccounts(accounts);
  };

  const getAccountBalance = async (accountNumber) => {
    try {
      const response = await fetch(
        `http://localhost:3001/accounts/balance-by-account/${accountNumber}`,
        {
          method: "GET",
        }
      );
      const accountData = await response.json();

      if (response.status === 200) {
        setAccountBalance(accountData.balance);
      } else {
        setAlertMessage.error(accountData.message);
      }
    } catch (error) {
      setAlertMessage.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    }
  };

  useEffect(() => {
    const accountNumber = form.getFieldValue("sender_account_number");
    if (accountNumber) {
      getAccountBalance(accountNumber);
    }
  }, [form, form.getFieldValue("sender_account_number")]);

  const getAccountsByCustomer = async (customerId = 0) => {
    const response = await fetch(
      `http://localhost:3001/accounts/accounts-by-customer/${customerId}`,
      {
        method: "GET",
      }
    );
    const accountsData = await response.json();
    const accounts = accountsData.map((account) => {
      return {
        value: account.account_number,
        label: account.account_number,
      };
    });

    setAccounts(accounts);
  };

  const instantApproveOrQueued = async (transaction) => {
    if (
      transaction.transaction_type !== 1 &&
      transaction.amount > accountBalance
    ) {
      setAlertMessage.error("¡Saldo Insuficiente para Esta Transacción!");
      return;
    } else {
      if (!isSupervisor) {
        if (transaction.amount >= 10000 && transaction.transaction_type === 2) {
          setOpenInstantOrQueuedApprovedTransaction(true);
        } else {
          await registerTransaction(transaction);
        }
      } else {
        await registerTransaction(transaction);
      }
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
      } else {
        setAlertMessage.error(transactionData.message);
      }
    } catch (error) {
      setAlertMessage.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      setSendingTransaction(false);
    }
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
      >
        <Form
          form={form}
          onFinish={instantApproveOrQueued}
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
            No. Cuenta {showReceiverAccount ? "Origen" : ""}{" "}
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
                getAccountBalance(value);
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
                No. Cuenta Destino
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

      <InstantOrQueuedApprovedTransaction
        isOpen={openInstantOrQueuedApprovedTransaction}
        isClosed={() => setOpenInstantOrQueuedApprovedTransaction(false)}
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
