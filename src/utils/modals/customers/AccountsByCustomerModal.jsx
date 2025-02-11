import { Button, Col, Empty, Modal, Row, Table } from "antd";
import { BookOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import moment from "moment";
import TransactionsModal from "./TransactionsModal";
import { useAuth } from "../../../contexts/authContext/AuthContext";

const AccountsByCustomerModal = ({
  isOpen,
  isClosed,
  selectedCustomer,
  setAlertMessage,
}) => {
  const { authState } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [selectedAccountNumber, setselectedAccountNumber] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = authState.token;

  useEffect(() => {
    if (isOpen && selectedCustomer?.id) {
      getAccountsByCustomer();
    }
  }, [isOpen, selectedCustomer]);

  function hideAccountNumber(account_number) {
    let blocs = account_number.split(" ");

    return blocs
      .map((bloc, index) => (index < blocs.length - 1 ? "****" : bloc))
      .join(" ");
  }

  const getAccountsByCustomer = async () => {
    if (!selectedCustomer?.id) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/accounts/accounts-by-customer/${selectedCustomer.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const accountsData = await response.json();
      setAccounts(
        accountsData.map((account) => ({
          ...account,
          hidden_account_number: hideAccountNumber(account.account_number),
          account_type:
            account.account_type === "checking"
              ? "Cheques"
              : "Cuentas Corrientes",
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
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      setLoading(false);
    }
  };

  const accountsColumns = [
    {
      title: "N.º de Cuenta",
      dataIndex: "hidden_account_number",
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
          <Col>
            <BookOutlined
              className="fs-6"
              style={{ marginRight: 8, color: "var(--blue)" }}
            />
          </Col>
          <Col>
            <label className="fs-6 text-black">Cuentas de Cliente</label>
          </Col>
        </Row>
      }
      centered
      open={isOpen}
      width={900}
      onCancel={isClosed}
      footer={null}
      maskClosable={false}
    >
      <div className="row">
        <div className="col-12 mb-3">
          {accounts.length === 0 ? (
            <Empty className="p-5" description="No Hay Datos Disponibles" />
          ) : (
            <Table
              dataSource={accounts}
              columns={accountsColumns}
              onRow={(record) => ({
                onClick: () => setselectedAccountNumber(record),
              })}
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showTotal: (total) => `Total: ${total} cuenta(s)`,
                hideOnSinglePage: true,
              }}
              loading={loading}
              scroll={{ x: "max-content" }}
            />
          )}
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

export default AccountsByCustomerModal;
