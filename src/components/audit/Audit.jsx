import {
  Breadcrumb,
  Button,
  Card,
  DatePicker,
  Input,
  Layout,
  message,
  Table,
  theme,
} from "antd";
import { BankOutlined, HistoryOutlined, UserOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useAuth } from "../../contexts/authContext/AuthContext";

const Audit = () => {
  const { authState } = useAuth();
  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageAlert, messageContext] = message.useMessage();

  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  useEffect(() => {
    document.title = "Banco Bambú | Auditoría";
    getAudits();
  }, []);

  const getAudits = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/audit", {
        method: "GET",
      });

      const audits = await response.json();
      const auditsRow = audits.map((audit) => {
        return {
          ...audit,
          datetime: moment(audit.datetime).format("DD/MM/YYYY - HH:mm A"),
        };
      });
      setAudit(auditsRow);
      setLoading(false);
    } catch (error) {}
  };

  const auditTableColumns = [
    {
      title: "Usuario",
      dataIndex: "username",
      key: "username",
      align: "center",
    },
    {
      title: "Acción",
      dataIndex: "action",
      key: "action",
      align: "center",
    },
    {
      title: "Detalles de la Acción",
      dataIndex: "details",
      key: "details",
      align: "center",
    },
    {
      title: "Fecha y Hora",
      dataIndex: "datetime",
      key: "datetime",
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
                  <HistoryOutlined />
                  <span>Auditoría</span>
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
                placeholder="Nombre de Usuario"
                prefix={<UserOutlined />}
                style={{
                  width: 183,
                }}
              />
            </div>
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <label className="me-2 fw-semibold text-black"> Fecha </label>
              <DatePicker
                onChange={onChange}
                placeholder="Seleccionar fecha"
                style={{ width: 183, cursor: "pointer" }}
              />
            </div>
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <Button type="primary"> Buscar </Button>
            </div>
          </div>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-12">
              <Table
                loading={loading}
                dataSource={audit}
                columns={auditTableColumns}
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Total: ${total} registro(s)`,
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

export default Audit;
