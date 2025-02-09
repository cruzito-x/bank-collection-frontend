import {
  Button,
  Card,
  Layout,
  Select,
  Space,
  theme,
  message,
  Popconfirm,
} from "antd";
import {
  BellOutlined,
  DollarOutlined,
  FileTextOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import "./styles/dashboard.css";
import DashboardCharts from "../../utils/charts/dashboard/DashboardCharts";
import moment from "moment";
import LogoutCard from "../../utils/logoutCard/LogoutCard";
import AddNewCollectorModal from "../../utils/modals/dashboard/AddNewCollectorModal";
import NotificationsModal from "../../utils/modals/dashboard/NotificationsModal";
import PaymentsCollectorsModal from "../../utils/modals/dashboard/PaymentsCollectorsModal";
import { useCollectorsData } from "../../contexts/collectorsDataContext/CollectorsDataContext";
import ViewReportsModal from "../../utils/modals/dashboard/ViewReportsModal";
import { useAuth } from "../../contexts/authContext/AuthContext";

const Dashboard = () => {
  const { authState } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [totalPayments, setTotalPayments] = useState([]);
  const [totalProcessedAmounts, setTotalProcessedAmounts] = useState([]);
  const [isCollectorModalOpen, setIsCollectorModalOpen] = useState(false);
  const [isRegisterPaymentOpen, setIsRegisterPaymentOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [
    latestCollectorAndCollectorPayment,
    setLatestCollectorAndCollectorPayment,
  ] = useState([]);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);
  const [messageAlert, messageContext] = message.useMessage();
  const { collectors, getCollectors } = useCollectorsData();
  const [dates, setDates] = useState([
    moment().startOf("day"),
    moment().endOf("day"),
  ]);
  const [amountRangeFilter, setAmountRangeFilter] = useState(1);
  const [transactionTypeFilter, setTransactionTypeFilter] = useState(1);
  const [refreshCharts, setRefreshCharts] = useState(false);
  const token = authState.token;
  const user_id = authState.user_id;

  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const datesFilter = (filter) => {
    let range;

    switch (filter) {
      case "today":
        range = [moment().startOf("day"), moment().endOf("day")];
        break;
      case "lastWeek":
        range = [
          moment().subtract(7, "days").startOf("day"),
          moment().endOf("day"),
        ];
        break;
      case "lastMonth":
        range = [
          moment().subtract(1, "month").startOf("day"),
          moment().endOf("day"),
        ];
        break;
      case "lastQuarter":
        range = [
          moment().subtract(3, "month").startOf("day"),
          moment().endOf("day"),
        ];
        break;
      case "lastSemester":
        range = [
          moment().subtract(6, "month").startOf("day"),
          moment().endOf("day"),
        ];
        break;
      case "lastYear":
        range = [
          moment().subtract(1, "year").startOf("day"),
          moment().endOf("day"),
        ];
        break;
      default:
        range = "today";
    }
    setDates(range);
  };

  const amountRangeFilters = (filter) => {
    setAmountRangeFilter(filter);
  };

  const transactionTypeFilters = (filter) => {
    setTransactionTypeFilter(filter);
  };

  useEffect(() => {
    document.title = "Banco Bambú | Dashboard";

    const fetchData = async () => {
      await getLatestCollectorAndCollectorPayment();
      await getNotifications();
    };

    fetchData();

    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getCollectors();
    getTransactionTypes();
    getTotalPayments();
    getTotalProcessedAmounts();
  }, []);

  useEffect(() => {}, [
    latestCollectorAndCollectorPayment,
    collectors,
    transactionTypes,
    totalPayments,
    notifications,
  ]);

  useEffect(() => {
    if (latestCollectorAndCollectorPayment.length === 0) return;
    if (collectors.length === 0) return;
    if (totalPayments.length === 0) return;
    if (totalProcessedAmounts.length === 0) return;
    if (notifications.length === 0) return;
  }, [
    latestCollectorAndCollectorPayment,
    collectors,
    totalPayments,
    totalProcessedAmounts,
    notifications,
  ]);

  const getLatestCollectorAndCollectorPayment = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/dashboard/get-latest-collector-and-collector-payment-data",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const latestCollectorAndCollectorPaymentData = await response.json();
      setLatestCollectorAndCollectorPayment(
        latestCollectorAndCollectorPaymentData[0]
      );
    } catch (error) {
      messageAlert.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    }
  };

  const getNotifications = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/approvals/notifications",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const notificationsData = await response.json();
      const notifications = notificationsData.map((notification) => {
        return {
          ...notification,
          amount: "$" + notification.amount,
          datetime: moment(notification.datetime).format(
            "DD/MM/YYYY - hh:mm A"
          ),
          actions: (
            <>
              <Popconfirm
                title="¿Desea Rechazar Esta Transacción?"
                onConfirm={() => {
                  updateTransactionStatus(
                    notification.approval_id,
                    notification.transaction_id,
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
                    notification.approval_id,
                    notification.transaction_id,
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
      setNotifications(notifications);
    } catch (error) {
      messageAlert.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
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
        getNotifications();
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

  const getTotalPayments = async () => {
    const response = await fetch("http://localhost:3001/payments-collectors", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const totalPaymentsData = await response.json();
    setTotalPayments(totalPaymentsData);
  };

  const getTotalProcessedAmounts = async () => {
    const response = await fetch(
      "http://localhost:3001/payments-collectors/total-payments-amount",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const totalProcessedAmountsData = await response.json();
    setTotalProcessedAmounts(totalProcessedAmountsData[0].amount);
  };

  const getTransactionTypes = async () => {
    const response = await fetch("http://localhost:3001/transactions-types", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const transactionTypesData = await response.json();
    const transactionTypes = transactionTypesData.map((transactionType) => {
      return {
        value: transactionType.id,
        label: transactionType.transaction_type,
      };
    });

    setTransactionTypes(transactionTypes);
  };

  return (
    <Content style={{ margin: "31px 16px" }}>
      {messageContext}
      <div
        style={{
          padding: "24px 0 0 0",
          minHeight: "90vh",
          borderRadius: borderRadiusLG,
        }}
      >
        <div className="row justify-content-center">
          <div className="col-11">
            <div className="row">
              <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4">
                <Card>
                  <label className="fw-semibold text-start p-1">
                    <SolutionOutlined
                      className="me-1"
                      style={{
                        color: "var(--blue)",
                      }}
                    />
                    Colectores Registrados
                  </label>
                  <h1 className="fw-semibold text-black text-center pt-3 pb-3">
                    {collectors.length || 0}
                  </h1>
                  <div className="dashboard-blue-card text-center w-100 rounded">
                    <label className="fw-semibold text-white p-3">
                      Reciente:{" "}
                      {latestCollectorAndCollectorPayment.most_recent_collector}
                    </label>
                  </div>
                </Card>
              </div>
              <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4">
                <Card>
                  <label className="fw-semibold text-start p-1">
                    <FileTextOutlined
                      className="me-1"
                      style={{
                        color: "var(--yellow)",
                      }}
                    />
                    Total de Pagos Realizados
                  </label>
                  <h1 className="fw-semibold text-black text-center pt-3 pb-3">
                    {totalPayments.length || 0}
                  </h1>
                  <div className="dashboard-yellow-card text-center w-100 rounded">
                    <label className="fw-semibold text-white p-3">
                      Reciente:{" "}
                      {latestCollectorAndCollectorPayment.payed_service}
                    </label>
                  </div>
                </Card>
              </div>
              <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4">
                <Card>
                  <label className="fw-semibold text-start p-1">
                    <DollarOutlined
                      className="me-1"
                      style={{
                        color: "var(--green)",
                      }}
                    />
                    Total de Pagos Procesados
                  </label>
                  <h1 className="fw-semibold text-black text-center pt-3 pb-3">
                    ${totalProcessedAmounts || 0}
                  </h1>
                  <div className="dashboard-green-card text-center w-100 rounded">
                    <label className="fw-semibold text-white p-3">
                      Reciente: {latestCollectorAndCollectorPayment.collector} -
                      ${latestCollectorAndCollectorPayment.amount}
                    </label>
                  </div>
                </Card>
              </div>
              <div className="col-xxl-3 col-lg-3 col-md-6 col-sm-12 mb-4">
                <Card
                  hoverable
                  className="cursor-pointer"
                  onClick={() => setIsNotificationsModalOpen(true)}
                >
                  <label className="fw-semibold text-start p-1">
                    <BellOutlined
                      className="me-1"
                      style={{
                        color: "var(--red)",
                      }}
                    />
                    Notificaciones Pendientes
                  </label>
                  <h1 className="fw-semibold text-black text-center pt-3 pb-3">
                    {notifications.length || 0}
                  </h1>
                  <div className="dashboard-red-card text-center w-100 rounded">
                    <label className="fw-semibold text-white cursor-pointer p-3">
                      Reciente:{" "}
                      {
                        latestCollectorAndCollectorPayment.latest_approved_transaction
                      }
                    </label>
                  </div>
                </Card>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end col-md-1 col-sm-12 mb-4">
            <LogoutCard setAlertMessage={messageAlert} />
          </div>
        </div>

        <Card className="mb-5">
          <div className="row ms-2">
            <div className="col-xl-6 col-md-8 col-sm-12 text-start">
              <label className="fw-semibold fs-5 text-black mb-2 mt-2 text-black">
                Transacciones Recientes
              </label>
            </div>
            <div className="col-xl-6 col-md-4 col-sm-12 d-flex justify-content-end pe-5">
              <div className="row">
                <div className="col-xxl-4 col-lg-7 col-md-7 col-sm-12 mb-2 mt-2 w-auto">
                  <Button
                    type="primary"
                    onClick={() => setIsCollectorModalOpen(true)}
                  >
                    Añadir Colector
                  </Button>
                </div>
                <div className="col-xxl-2 col-lg-2 col-md-2 col-sm-12 mb-2 mt-2 w-auto">
                  <Button
                    type="primary"
                    onClick={() => setIsRegisterPaymentOpen(true)}
                  >
                    Pagar a Colector
                  </Button>
                </div>
                <div className="col-xxl-2 col-lg-2 col-md-2 col-sm-12 mb-2 mt-2 w-auto">
                  <Button
                    type="primary"
                    onClick={() => setIsReportsModalOpen(true)}
                  >
                    Ver Reportes
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="row ms-2">
            <label className="fw-semibold text-black mb-1"> Filtrar por </label>
            <div className="col-xxl-4 col-lg-7 col-md-7 col-sm-12 w-auto">
              <label className="fw-semibold text-black me-2"> Fecha </label>
              <Space wrap>
                <Select
                  className="mb-2"
                  defaultValue="today"
                  style={{
                    width: 183,
                  }}
                  onChange={datesFilter}
                  options={[
                    {
                      value: "today",
                      label: "Hoy",
                    },
                    {
                      value: "lastWeek",
                      label: "Última Semana",
                    },
                    {
                      value: "lastMonth",
                      label: "Último Mes",
                    },
                    {
                      value: "lastQuarter",
                      label: "Últimos 3 Meses",
                    },
                    {
                      value: "lastSemester",
                      label: "Últimos 6 Meses",
                    },
                    {
                      value: "lastYear",
                      label: "Último Año",
                    },
                  ]}
                />
              </Space>
            </div>
            <div className="col-xxl-2 col-lg-2 col-md-2 col-sm-12 w-auto">
              <label className="fw-semibold text-black me-2"> Monto </label>
              <Space wrap>
                <Select
                  className="mb-2"
                  defaultValue={1}
                  style={{
                    width: 183,
                  }}
                  onChange={amountRangeFilters}
                  options={[
                    {
                      value: 1,
                      label: "$1 - $100",
                    },
                    {
                      value: 2,
                      label: "$100 - $500",
                    },
                    {
                      value: 3,
                      label: "$500 - $1000",
                    },
                    {
                      value: 4,
                      label: "$1000 - $2000",
                    },
                    {
                      value: 5,
                      label: "$2000 - $5000",
                    },
                    {
                      value: 6,
                      label: "$5000 en Adelante",
                    },
                  ]}
                />
              </Space>
            </div>
            <div className="col-xxl-2 col-lg-2 col-md-2 col-sm-12 w-auto">
              <label className="fw-semibold text-black me-2"> Tipo </label>
              <Space wrap>
                <Select
                  className="mb-2"
                  defaultValue={1}
                  style={{
                    width: 183,
                  }}
                  onChange={transactionTypeFilters}
                  options={transactionTypes}
                />
              </Space>
            </div>
          </div>

          <div className="row mb-4 ms-2">
            <DashboardCharts
              datesRange={dates}
              amountRangeFilter={amountRangeFilter}
              transactionTypeFilter={transactionTypeFilter}
              refreshCharts={refreshCharts}
            />
          </div>
        </Card>

        <NotificationsModal
          isOpen={isNotificationsModalOpen}
          isClosed={() => setIsNotificationsModalOpen(false)}
          notificationsData={notifications}
          setAlertMessage={messageAlert}
        />

        <AddNewCollectorModal
          isOpen={isCollectorModalOpen}
          isClosed={() => setIsCollectorModalOpen(false)}
          setAlertMessage={messageAlert}
        />

        <PaymentsCollectorsModal
          isOpen={isRegisterPaymentOpen}
          isClosed={() => {
            setIsRegisterPaymentOpen(false);
            setRefreshCharts((previous) => !previous);
          }}
          collectors={collectors}
          setAlertMessage={messageAlert}
          currentPath={window.location.pathname}
        />

        <ViewReportsModal
          isOpen={isReportsModalOpen}
          isClosed={() => setIsReportsModalOpen(false)}
          setAlertMessage={messageAlert}
        />
      </div>
    </Content>
  );
};

export default Dashboard;
