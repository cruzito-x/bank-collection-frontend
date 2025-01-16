import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Input,
  Layout,
  message,
  Modal,
  Row,
  Table,
  theme,
} from "antd";
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { useAuth } from "../../contexts/authContext/AuthContext";

const Approvals = () => {
  const { authState } = useAuth();
  const [isTransactionDetailsModalOpen, setIsTransactionDetailsModalOpen] =
    useState(false);
  const [messageAlert, messageContext] = message.useMessage();
  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const showTransactionDetails = () => {
    setIsTransactionDetailsModalOpen(true);
  };

  const closeTransactionDetails = () => {
    setIsTransactionDetailsModalOpen(false);
  };

  const CollectorsDataSource = [
    {
      key: "1",
      approvalCode: "1234567890",
      transactionCode: "0987654321",
      authorizedBy: "David Cruz",
      datetime: "2025-01-02 a las 10:30 am",
      actions: (
        <>
          <Button type="primary" onClick={showTransactionDetails}>
            {" "}
            Detalles{" "}
          </Button>
          <Modal
            title={
              <Row align="middle">
                {" "}
                <Col>
                  {" "}
                  <InfoCircleOutlined
                    className="fs-6"
                    style={{ marginRight: 8, color: "var(--blue)" }}
                  />{" "}
                </Col>{" "}
                <Col>
                  <label className="fs-6">Detalles de Transacción</label>
                </Col>{" "}
              </Row>
            }
            centered
            width={450}
            open={isTransactionDetailsModalOpen}
            onCancel={closeTransactionDetails}
            footer={[
              <Button
                key="submit"
                type="primary"
                onClick={closeTransactionDetails}
              >
                Cerrar
              </Button>,
            ]}
          >
            <div className="row mt-4">
              <div className="col-12 mb-3 text-center">
                <h1 className="fw-bold" style={{ fontSize: "60px" }}>
                  {" "}
                  $70{" "}
                </h1>
                <label className="fw-semibold">
                  {" "}
                  <CheckCircleOutlined style={{ color: "var(--green)" }} />{" "}
                  ¡Transferencia Exitosa!{" "}
                </label>
              </div>
              <div className="col-12">
                <label className="fw-semibold"> Cliente Emisor </label>
                <p> Juan Caballo 🐴 </p>
              </div>
              <div className="col-12">
                <label className="fw-semibold">
                  {" "}
                  E-mail de Cliente Emisor{" "}
                </label>
                <p>
                  {" "}
                  juancaballodeverdadsoyyoiranomaspueswarelinchar@gmail.com{" "}
                </p>
              </div>
              <div className="col-12">
                <label className="fw-semibold"> Receptor </label>
                <p> Jorgito 🫦 </p>
              </div>
              <div className="col-12 mb-3">
                <label className="fw-semibold"> Concepto </label>
                <p>
                  {" "}
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea,
                  exercitationem incidunt voluptatibus ipsa hic, odio adipisci
                  quod, magnam veniam nesciunt reprehenderit! Perferendis ullam
                  error, sapiente labore eaque rerum dignissimos rem?{" "}
                </p>
              </div>
            </div>
          </Modal>
        </>
      ),
    },
  ];

  const approvalsTableColumns = [
    {
      title: "Código de Aprobación",
      dataIndex: "approvalCode",
      key: "approvalCode",
      align: "center",
    },
    {
      title: "Código de Transacción Asociada",
      dataIndex: "transactionCode",
      key: "transactionCode",
      align: "center",
    },
    {
      title: "Autorizado por",
      dataIndex: "authorizedBy",
      key: "authorizedBy",
      align: "center",
    },
    {
      title: "Fecha y Hora",
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
              <label className="fw-semibold"> Buscar Por </label>
            </div>
          </div>
          <div className="row ms-2 mb-3 pe-3">
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <label className="me-2 fw-semibold">
                {" "}
                Código de Transacción{" "}
              </label>
              <Input
                placeholder="00001"
                prefix={<InfoCircleOutlined />}
                style={{
                  width: 183,
                }}
              />
            </div>
            <div className="col-xxl-3 col-xl-4 col-sm-12 w-auto">
              <label className="me-2 fw-semibold"> Nombre </label>
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
          <div className="row ms-1 mb-3 pe-3">
            <div className="col-12">
              <Table
                dataSource={CollectorsDataSource}
                columns={approvalsTableColumns}
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

export default Approvals;
