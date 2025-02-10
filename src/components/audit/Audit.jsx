import {
  Breadcrumb,
  Button,
  Card,
  DatePicker,
  Form,
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
import { useForm } from "antd/es/form/Form";

const Audit = () => {
  const { authState } = useAuth();
  const [audit, setAudit] = useState([]);
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageAlert, messageContext] = message.useMessage();
  const { Content } = Layout;
  const [form] = useForm();
  const token = authState.token;

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    document.title = "Banco Bambú | Auditoría";
    getAudits();
  }, []);

  const getAudits = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/audit", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const auditData = await response.json();

      if (response.status === 200) {
        const audit = auditData.map((audit) => {
          return {
            ...audit,
            datetime: moment(audit.datetime).format("DD/MM/YYYY - hh:mm A"),
          };
        });

        setAudit(audit);
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      } else {
        messageAlert.error(auditData.message);
      }
    } catch (error) {
      messageAlert.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      setLoading(false);
    }
  };

  const searchAudit = async (audit) => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/audit/search-audit?username=${
          audit.username ?? ""
        }&date=${audit.date ?? ""}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const auditData = await response.json();

      if (response.status === 200) {
        const audit = auditData.map((audit) => {
          return {
            ...audit,
            datetime: moment(audit.datetime).format("DD/MM/YYYY - hh:mm A"),
          };
        });

        setAudit(audit);
      } else if (response.status === 400) {
        messageAlert.error(auditData.message);
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      } else {
        messageAlert.error(auditData.message);
      }
    } catch (error) {
      messageAlert.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    } finally {
      setLoading(false);
    }
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
      title: "Datos de Acceso",
      dataIndex: "client_details",
      key: "client_details",
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
              <Form
                layout="inline"
                form={form}
                className="align-items-center"
                onFinish={searchAudit}
              >
                <label className="me-2 fw-semibold text-black"> Usuario </label>
                <Form.Item name="username" initialValue="">
                  <Input
                    placeholder="Nombre de Usuario"
                    prefix={<UserOutlined />}
                    style={{
                      width: 183,
                    }}
                  />
                </Form.Item>
                <label className="me-2 fw-semibold text-black"> Fecha </label>
                <Form.Item name="date" initialValue="">
                  <DatePicker
                    className="cursor-pointer"
                    value={date}
                    onChange={(date) => setDate(date)}
                    format="DD/MM/YYYY"
                    placeholder="00/00/0000"
                    style={{ width: 183 }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {" "}
                    Buscar{" "}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-12">
              <Table
                dataSource={audit}
                columns={auditTableColumns}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                  showTotal: (total) => `Total: ${total} registro(s)`,
                  hideOnSinglePage: true,
                }}
                loading={loading}
                scroll={{ x: "max-content" }}
              />
            </div>
          </div>
        </Card>
      </div>
    </Content>
  );
};

export default Audit;
