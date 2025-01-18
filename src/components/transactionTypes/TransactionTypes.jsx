import {
  Breadcrumb,
  Button,
  Card,
  Input,
  Layout,
  message,
  Table,
  theme,
} from "antd";
import {
  AuditOutlined,
  PlusCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext/AuthContext";

const TransactionTypes = () => {
  const { authState } = useAuth();
  const [transactionsTypes, setTransactionsTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageAlert, messageContext] = message.useMessage();
  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    getTransactionsTypes();
  }, []);

  const getTransactionsTypes = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/transactions-types", {
        method: "GET",
      });

      const transactionsTypesData = await response.json();

      const transactions = transactionsTypesData.map((transactionType) => {
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
              >
                Editar
              </Button>
              <Button className="ms-2 me-2" type="primary" danger>
                Eliminar
              </Button>
            </>
          ),
        };
      });

      setTransactionsTypes(transactions);
      setLoading(false);
    } catch (error) {}
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
              <Button type="primary">
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
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Total: ${total} colector(es)`,
                  hideOnSinglePage: true,
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    </Content>
  );
};

export default TransactionTypes;
