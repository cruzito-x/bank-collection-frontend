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
  SolutionOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import PaymentsCollectorsChart from "./charts/PaymentsCollectorsCharts";
import { useAuth } from "../../contexts/authContext/AuthContext";
import moment from "moment";
import PaymentsCollectorsDetailsModal from "../../utils/modals/paymentsCollectors/PaymentsCollectorsDetailsModal";

const PaymentsCollectors = () => {
  const { authState } = useAuth();
  const [paymentsCollector, setPaymentsCollectors] = useState([]);
  const [
    isPaymentsCollectorsDetailsModalOpen,
    setIsPaymentsCollectorsDetailsModalOpen,
  ] = useState(false);
  const [selectedPaymentCollector, setSelectedPaymentCollector] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageAlert, messageContext] = message.useMessage();
  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    getPaymentsCollectors();
  }, []);

  const getPaymentsCollectors = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/payments-collectors",
        {
          method: "GET",
        }
      );

      const paymentscollectorsData = await response.json();
      if (paymentscollectorsData.length > 0) {
        const paymentsCollector = paymentscollectorsData.map(
          (paymentsCollector) => {
            return {
              ...paymentsCollector,
              amount: "$" + paymentsCollector.amount,
              datetime: moment(paymentsCollector.date_hour).format(
                "DD/MM/YYYY - HH:mm A"
              ),
              actions: (
                <>
                  <Button
                    type="primary"
                    onClick={showPaymentsCollectorsDetailsModal}
                  >
                    {" "}
                    Ver Detalles{" "}
                  </Button>
                </>
              ),
            };
          }
        );

        setPaymentsCollectors(paymentsCollector);
      }

      setLoading(false);
    } catch (error) {
      messageAlert.error("Error fetching collectors payments");
    }
  };

  const showPaymentsCollectorsDetailsModal = (collector) => {
    setIsPaymentsCollectorsDetailsModalOpen(true);
  };

  const paymentsCollectorsTableColumns = [
    {
      title: "Cliente",
      dataIndex: "customer",
      key: "customer",
      align: "center",
    },
    {
      title: "Colector",
      dataIndex: "collector",
      key: "collector",
      align: "center",
    },
    {
      title: "Monto Pagado",
      dataIndex: "amount",
      key: "amount",
      align: "center",
    },
    {
      title: "Fecha de Pago",
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
                  <WalletOutlined />
                  <span>Pagos a Colectores</span>
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
              <label className="me-2 fw-semibold text-black"> Nombre </label>
              <Input
                placeholder="Nombre de Colector"
                prefix={<SolutionOutlined />}
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
            <div className="col-md-8 col-sm-12">
              <Table
                dataSource={paymentsCollector}
                columns={paymentsCollectorsTableColumns}
                loading={loading}
                onRow={(record) => ({
                  onClick: () => setSelectedPaymentCollector(record),
                })}
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Total: ${total} pago(s) registrado(s)`,
                  hideOnSinglePage: true,
                }}
              />
            </div>
            <div className="col-md-4 col-sm-12 d-flex align-items-center">
              <PaymentsCollectorsChart />
            </div>
          </div>
        </Card>
        <PaymentsCollectorsDetailsModal
          isOpen={isPaymentsCollectorsDetailsModalOpen}
          isClosed={() => setIsPaymentsCollectorsDetailsModalOpen(false)}
          paymentsCollectorsData={selectedPaymentCollector}
        />
      </div>
    </Content>
  );
};

export default PaymentsCollectors;
