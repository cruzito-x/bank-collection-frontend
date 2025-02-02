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
  BankOutlined,
  CheckCircleOutlined,
  NumberOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext/AuthContext";
import moment from "moment";
import ApprovalTransactionDetails from "../../utils/modals/approvals/ApprovalTransactionDetails";

const Approvals = () => {
  const { authState } = useAuth();
  const [approvals, setApprovals] = useState([]);
  const [isTransactionDetailsModalOpen, setIsTransactionDetailsModalOpen] =
    useState(false);
  const [selectedApproval, setSelectedApproval] = useState([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [messageAlert, messageContext] = message.useMessage();
  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    document.title = "Banco Bambú | Aprobaciones";
    getApprovals();
  }, []);

  const getApprovals = async () => {
    const response = await fetch("http://localhost:3001/approvals", {
      method: "GET",
    });

    const approvalsData = await response.json();
    const approvals = approvalsData.map((approval) => {
      return {
        ...approval,
        amount: "$" + approval.amount,
        authorized_by:
          approval.authorized_by === null
            ? "En Espera de Aprobación"
            : approval.authorized_by,
        datetime: moment(approval.datetime).format("DD/MM/YYYY - hh:mm A"),
        authorized_at:
          approval.authorized_at === null
            ? "0000/00/00 - 00:00"
            : moment(approval.authorized_at).format("DD/MM/YYYY - hh:mm A"),
        actions:
          approval.authorized_by != null ? (
            <>
              <Button
                type="primary"
                onClick={() => setIsTransactionDetailsModalOpen(true)}
              >
                Ver Detalles
              </Button>
            </>
          ) : (
            <>
              <Popconfirm
                title="¿Desea Rechazar Esta Transacción?"
                onConfirm={() => {
                  updateTransactionStatus(
                    approval.approval_id,
                    approval.transaction_id,
                    0,
                    1
                  );
                }}
                okText="Sí"
                cancelText="No"
                okButtonProps={{
                  loading: updatingStatus,
                }}
                cancelButtonProps={{
                  loading: updatingStatus,
                }}
              >
                <Button type="primary" danger loading={updatingStatus}>
                  Rechazar
                </Button>
              </Popconfirm>
              <Button
                className="ms-2"
                type="primary"
                onClick={() =>
                  updateTransactionStatus(
                    approval.approval_id,
                    approval.transaction_id,
                    1,
                    1
                  )
                }
                loading={updatingStatus}
              >
                Aprobar
              </Button>
            </>
          ),
      };
    });

    setApprovals(approvals);
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
          },
        }
      );

      const transactionStatus = await response.json();

      if (response.status === 200) {
        messageAlert.success(transactionStatus.message);
        setUpdatingStatus(false);
        getApprovals();
      } else {
        messageAlert.error(transactionStatus.message);
        setUpdatingStatus(false);
      }
    } catch (error) {
      messageAlert.error("Error al actualizar el estado de la transacción.");
      setUpdatingStatus(false);
    }
  };

  const approvalsTableColumns = [
    {
      title: "Código de Aprobación",
      dataIndex: "approval_id",
      key: "approval_id",
      align: "center",
    },
    {
      title: "Código de Transacción Asociada",
      dataIndex: "transaction_id",
      key: "transaction_id",
      align: "center",
    },
    {
      title: "Autorizado por",
      dataIndex: "authorized_by",
      key: "authorized_by",
      align: "center",
    },
    {
      title: "Fecha y Hora",
      dataIndex: "authorized_at",
      key: "authorized_at",
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
                  <CheckCircleOutlined />
                  <span>Aprobaciones</span>
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
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <label className="me-2 fw-semibold text-black">
                {" "}
                Código de Transacción{" "}
              </label>
              <Input
                placeholder="00001"
                prefix={<NumberOutlined />}
                style={{
                  width: 183,
                }}
              />
            </div>
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <label className="me-2 fw-semibold text-black"> Nombre </label>
              <Input
                placeholder="Nombre de Usuario"
                prefix={<UserOutlined />}
                style={{
                  width: 183,
                }}
              />
            </div>
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <Button type="primary"> Buscar </Button>
            </div>
          </div>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-12">
              <Table
                dataSource={approvals}
                columns={approvalsTableColumns}
                onRow={(record) => ({
                  onClick: () => setSelectedApproval(record),
                })}
                pagination={{
                  pageSize: 10,
                  showTotal: (total) =>
                    `Total: ${total} Transacción(es) Aprobada(s)`,
                  hideOnSinglePage: true,
                }}
              />
            </div>
          </div>
        </Card>

        <ApprovalTransactionDetails
          isOpen={isTransactionDetailsModalOpen}
          isClosed={() => setIsTransactionDetailsModalOpen(false)}
          approvalData={selectedApproval}
        />
      </div>
    </Content>
  );
};

export default Approvals;
