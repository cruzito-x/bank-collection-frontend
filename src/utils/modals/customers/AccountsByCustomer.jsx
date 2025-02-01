import { Button, Col, Modal, Row, Table } from "antd";
import { BookOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import moment from "moment";
import TransactionsModal from "./TransactionsModal";

const AccountsByCustomer = ({
  isOpen,
  isClosed,
  selectedCustomer,
  setAlertMessage,
}) => {
  const [accounts, setAccounts] = useState([]);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [selectedAccountNumber, setselectedAccountNumber] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && selectedCustomer?.id) {
      getAccountsByCustomer();
    }
  }, [isOpen, selectedCustomer]);

  const getAccountsByCustomer = async () => {
    if (!selectedCustomer?.id) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/customers/accounts-by-customer/${selectedCustomer.id}`
      );
      const accountsData = await response.json();
      setAccounts(
        accountsData.map((account) => ({
          ...account,
          balance: "$" + account.balance,
          datetime: moment(account.datetime).format("DD/MM/YYYY - hh:mm A"),
          actions: (
            <Button
              type="primary"
              onClick={() => setIsTransactionsModalOpen(true)}
            >
              Ver Transacciones
            </Button>
          ),
        }))
      );
    } catch (error) {
      setAlertMessage.error(
        "Error al Obtener las Cuentas del Cliente, ",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const accountsColumns = [
    {
      title: "No. de Cuenta",
      dataIndex: "account_number",
      key: "account_number",
      align: "center",
    },
    {
      title: "Propietario",
      dataIndex: "owner",
      key: "owner",
      align: "center",
    },
    {
      title: "Saldo",
      dataIndex: "balance",
      key: "balance",
      align: "center",
    },
    {
      title: "Creada el",
      dataIndex: "datetime",
      key: "datetime",
      align: "center",
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      align: "center",
    },
  ];

  return (
    <Modal
      title={
        <Row align="middle">
          {" "}
          <Col>
            {" "}
            <BookOutlined
              className="fs-6"
              style={{ marginRight: 8, color: "var(--blue)" }}
            />{" "}
          </Col>{" "}
          <Col>
            <label className="fs-6 text-black">Cuentas de Cliente</label>
          </Col>{" "}
        </Row>
      }
      centered
      open={isOpen}
      width={900}
      onCancel={isClosed}
      footer={null}
    >
      <div className="row">
        <div className="col-12 mb-3">
          <Table
            dataSource={accounts}
            columns={accountsColumns}
            loading={loading}
            onRow={(record) => ({
              onClick: () => setselectedAccountNumber(record),
            })}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `Total: ${total} cuenta(s)`,
              hideOnSinglePage: true,
            }}
          />
        </div>
        <div className="col-12">
          <div className="text-end">
            <Button type="primary" danger onClick={isClosed}>
              {" "}
              Cerrar{" "}
            </Button>
          </div>
        </div>
      </div>

      <TransactionsModal
        isOpen={isTransactionsModalOpen}
        isClosed={() => setIsTransactionsModalOpen(false)}
        selectedCustomerId={selectedCustomer?.id}
        selectedCustomerAccountNumber={selectedAccountNumber}
      />
    </Modal>
  );
};

export default AccountsByCustomer;
