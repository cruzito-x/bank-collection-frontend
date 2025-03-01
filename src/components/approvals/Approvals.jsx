import {
  Breadcrumb,
  Button,
  Card,
  Form,
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
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/authContext/AuthContext";
import moment from "moment";
import ApprovalTransactionDetails from "../../utils/modals/approvals/ApprovalTransactionDetails";
import { useForm } from "antd/es/form/Form";
import EmptyData from "../../utils/emptyData/EmptyData";
import {
  applyMaskAlphaNumeric,
  applyMaskOnlyLetters,
} from "../../utils/masks/InputMasks";

const Approvals = () => {
  const { authState } = useAuth();
  const [approvals, setApprovals] = useState([]);
  const [isTransactionDetailsModalOpen, setIsTransactionDetailsModalOpen] =
    useState(false);
  const [selectedApproval, setSelectedApproval] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const transactionIdRef = useRef(null);
  const authorizerRef = useRef(null);
  const [messageAlert, messageContext] = message.useMessage();
  const { Content } = Layout;
  const [form] = useForm();
  const token = authState.token;
  const user_id = authState.user_id;

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    document.title = "Banco Bambú | Aprobaciones";
    getApprovals();
  }, []);

  useEffect(() => {
    if (transactionIdRef.current?.input) {
      applyMaskAlphaNumeric(transactionIdRef.current.input);

      transactionIdRef.current.input.addEventListener("input", (event) => {
        form.setFieldsValue({ transaction_id: event.target.value });
      });
    }

    if (authorizerRef.current?.input) {
      applyMaskOnlyLetters(authorizerRef.current.input);

      authorizerRef.current.input.addEventListener("input", (event) => {
        form.setFieldsValue({ authorizer: event.target.value });
      });
    }
  }, []);

  const getApprovals = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/approvals", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const approvalsData = await response.json();

      if (response.status === 200) {
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
                        user_id
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
                        user_id
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
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authState");
        window.location.href = "/";
        return;
      } else {
        messageAlert.error(approvalsData.message);
      }
    } catch (error) {
      messageAlert.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      setLoading(false);
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
        messageAlert.success(transactionStatus.message);
        getApprovals();
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authState");
        window.location.href = "/";
        return;
      } else {
        messageAlert.error(transactionStatus.message);
      }
    } catch (error) {
      messageAlert.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const searchApproval = async (approval) => {
    if (
      (approval.transaction_id === undefined ||
        approval.transaction_id === "") &&
      (approval.authorizer === undefined || approval.authorizer === "")
    ) {
      messageAlert.warning(
        "Por Favor, Introduzca al Menos un Criterio de Búsqueda"
      );
      getApprovals();
      return;
    } else {
      setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:3001/approvals/search-approval?transaction_id=${
            approval.transaction_id ?? ""
          }&authorized_by=${approval.authorizer ?? ""}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const approvalsData = await response.json();

        if (response.status === 200) {
          const approvals = approvalsData.map((approval) => {
            return {
              ...approval,
              amount: "$" + approval.amount,
              authorized_by:
                approval.authorized_by === null
                  ? "En Espera de Aprobación"
                  : approval.authorized_by,
              datetime: moment(approval.datetime).format(
                "DD/MM/YYYY - hh:mm A"
              ),
              authorized_at:
                approval.authorized_at === null
                  ? "0000/00/00 - 00:00"
                  : moment(approval.authorized_at).format(
                      "DD/MM/YYYY - hh:mm A"
                    ),
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
                          user_id
                        );
                      }}
                      okText="Sí"
                      cancelText="No"
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
                          user_id
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
        } else if (response.status === 400) {
          messageAlert.warning(approvalsData.message);
        } else if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("authState");
          window.location.href = "/";
          return;
        } else {
          messageAlert.error(approvalsData.message);
        }
      } catch (error) {
        messageAlert.error(
          "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
        );
      } finally {
        setLoading(false);
      }
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
          <div className="row ms-2 pt-3 pe-3 mb-2">
            <div className="col-12 text-start">
              <label className="fw-semibold text-black"> Buscar Por </label>
            </div>
          </div>
          <Form
            className="row ms-2 pe-3 align-items-center"
            layout="inline"
            form={form}
            onFinish={searchApproval}
          >
            <div className="col-xxl-2 col-xl-3 col-md-2 col-sm-12 mb-3 d-flex align-items-center w-auto">
              <label className="me-2 fw-semibold text-black"> Código </label>
              <Form.Item name="transaction_id" initialValue="">
                <Input
                  ref={transactionIdRef}
                  placeholder="TSC000000"
                  prefix={<NumberOutlined />}
                  style={{
                    width: 183,
                  }}
                />
              </Form.Item>
            </div>
            <div className="col-xxl-2 col-xl-3 col-md-2 col-sm-12 mb-3 d-flex align-items-center w-auto">
              <label className="me-2 fw-semibold text-black"> Autorizador </label>
              <Form.Item name="authorizer">
                <Input
                  ref={authorizerRef}
                  placeholder="Nombre de Supervisor"
                  prefix={<UserOutlined />}
                  style={{
                    width: 183,
                  }}
                />
              </Form.Item>
            </div>
            <div className="col-xxl-2 col-xl-3 col-md-12 col-sm-12 mb-3 d-lg-flex d-sm-block align-items-center w-sm-100">
              <Form.Item>
                <Button className="w-100" type="primary" htmlType="submit">
                  {" "}
                  Buscar{" "}
                </Button>
              </Form.Item>
            </div>
          </Form>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-12">
              {approvals.length === 0 ? (
                <EmptyData />
              ) : (
                <Table
                  dataSource={approvals}
                  columns={approvalsTableColumns}
                  onRow={(record) => ({
                    onClick: () => setSelectedApproval(record),
                  })}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: false,
                    showTotal: (total) =>
                      `Total: ${total} transacción(es) aprobada(s) y/o rechazada(s)`,
                    hideOnSinglePage: true,
                  }}
                  loading={loading}
                  scroll={{ x: "max-content" }}
                />
              )}
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
