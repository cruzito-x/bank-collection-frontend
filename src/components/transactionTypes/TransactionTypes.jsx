import {
  Breadcrumb,
  Button,
  Card,
  Input,
  Layout,
  message,
  Popconfirm,
  Table,
  theme,
} from "antd";
import {
  AuditOutlined,
  BankOutlined,
  PlusCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext/AuthContext";
import AddNewTransactionTypeModal from "../../utils/modals/transactionTypes/AddNewTransactionTypeModal";
import EditTransactionTypeModal from "../../utils/modals/transactionTypes/EditTransactionTypeModal";

const TransactionTypes = () => {
  const { authState } = useAuth();
  const [transactionsTypes, setTransactionsTypes] = useState([]);
  const [isNewTransactionTypeModalOpen, setIsNewTransactionTypeModalOpen] =
    useState(false);
  const [isEditTransactionTypeModalOpen, setIsEditTransactionTypeModalOpen] =
    useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingData, setSendingData] = useState(false);
  const [messageAlert, messageContext] = message.useMessage();
  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    document.title = "Banco Bambú | Tipos de Transacciones";
    getTransactionsTypes();
  }, []);

  const getTransactionsTypes = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/transactions-types", {
        method: "GET",
      });

      const transactionsTypesData = await response.json();
      const transactionsTypes = transactionsTypesData.map((transactionType) => {
        return {
          ...transactionType,
          actions: (
            <>
              <Button
                className="edit-btn"
                type="primary"
                style={{
                  backgroundColor: "var(--yellow)",
                }}
                onClick={() => setIsEditTransactionTypeModalOpen(true)}
              >
                Editar
              </Button>
              <Popconfirm
                title="Eliminar Tipo de Transacción"
                description="¿Está Seguro de Eliminar este Registro?"
                onConfirm={() => deleteTransactionType(transactionType)}
                okText="Sí"
                cancelText="No"
              >
                <Button className="ms-2 me-2" type="primary" danger>
                  Eliminar
                </Button>
              </Popconfirm>
            </>
          ),
        };
      });

      setTransactionsTypes(transactionsTypes);
      setLoading(false);
    } catch (error) {}
  };

  const deleteTransactionType = async (transactionType) => {
    setSendingData(true);

    try {
      const response = await fetch(
        `http://localhost:3001/transactions-types/delete-transaction-type/${transactionType.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transactionType),
        }
      );

      const deletedTransactionType = await response.json();

      if (response.status === 200) {
        messageAlert.success(deletedTransactionType.message);
        setSendingData(false);
        getTransactionsTypes();
      } else {
        messageAlert.error(deletedTransactionType.message);
        setSendingData(false);
      }
    } catch (error) {
      messageAlert.error("Error al Actualizar el Tipo de Transacción");
      setSendingData(false);
    }
  };

  const transactionsTypesTableColumns = [
    {
      title: "Tipo de Transacción",
      dataIndex: "transaction_type",
      key: "transaction_type",
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
    <Content style={{ margin: "31px 16px" }}>
      {messageContext}
      <div
        style={{
          padding: "24px 0 24px 0",
          minHeight: "90vh",
          borderRadius: borderRadiusLG,
        }}
      >
        <Breadcrumb
          items={[
            {
              title: (
                <>
                  <BankOutlined />
                  <span> Banco Bambú </span>
                </>
              ),
            },
            {
              title: (
                <>
                  <UserOutlined />
                  <span> {authState.username} </span>
                </>
              ),
            },
            {
              title: (
                <>
                  <AuditOutlined />
                  <span> Tipos de Transacción </span>
                </>
              ),
            },
          ]}
        />

        <Card className="mt-3">
          <div className="row ms-2 pt-3 mb-2">
            <div className="col-12 text-start">
              <label className="fw-semibold text-black"> Buscar Por </label>
            </div>
          </div>
          <div className="row ms-2 mb-3">
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <label className="me-2 fw-semibold text-black"> Nombre </label>
              <Input
                placeholder="Tipo de Transacción"
                prefix={<AuditOutlined />}
                style={{
                  width: 183,
                }}
              />
            </div>
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <Button type="primary"> Buscar </Button>
            </div>
            <div className="col-xxl-9 col-xl-7 col-sm-12 d-flex justify-content-end">
              <Button
                type="primary"
                onClick={() => setIsNewTransactionTypeModalOpen(true)}
              >
                <PlusCircleOutlined /> Añadir nuevo{" "}
              </Button>
            </div>
          </div>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-12">
              <Table
                dataSource={transactionsTypes}
                columns={transactionsTypesTableColumns}
                loading={loading}
                onRow={(record) => ({
                  onClick: () => setSelectedTransactionType(record),
                })}
                pagination={{
                  pageSize: 10,
                  showTotal: (total) =>
                    `Total: ${total} tipo(s) de transacción(es)`,
                  hideOnSinglePage: true,
                }}
              />
            </div>
          </div>
        </Card>
        <AddNewTransactionTypeModal
          isOpen={isNewTransactionTypeModalOpen}
          isClosed={() => setIsNewTransactionTypeModalOpen(false)}
          setAlertMessage={messageAlert}
          getTransactionsTypes={getTransactionsTypes}
        />
        <EditTransactionTypeModal
          isOpen={isEditTransactionTypeModalOpen}
          isClosed={() => setIsEditTransactionTypeModalOpen(false)}
          setAlertMessage={messageAlert}
          selectedTransactionType={selectedTransactionType}
          getTransactionsTypes={getTransactionsTypes}
        />
      </div>
    </Content>
  );
};

export default TransactionTypes;
