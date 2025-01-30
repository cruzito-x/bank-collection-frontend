import { Col, Modal, Row, Table } from "antd";
import { TransactionOutlined } from "@ant-design/icons";
import React from "react";

const NotificationsModal = ({ isOpen, isClose, notificationsData }) => {
  const notificationColumns = [
    {
      title: "Código de Aprobación",
      dataIndex: "approval_id",
      key: "approval_id",
      align: "center",
    },
    {
      title: "Código de Transacción",
      dataIndex: "transaction_id",
      key: "transaction_id",
      align: "center",
    },
    {
      title: "Remitente",
      dataIndex: "sender_name",
      key: "sender_name",
      align: "center",
    },
    {
      title: "Receptor",
      dataIndex: "receiver_name",
      key: "receiver_name",
      align: "center",
    },
    {
      title: "Monto",
      dataIndex: "amount",
      key: "amount",
      align: "center",
    },
    {
      title: "Fecha",
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
          {" "}
          <Col>
            {" "}
            <TransactionOutlined
              className="fs-6"
              style={{ marginRight: 8, color: "var(--blue)" }}
            />{" "}
          </Col>{" "}
          <Col>
            <label className="fs-6">Transacciones por Aprobar</label>
          </Col>{" "}
        </Row>
      }
      centered
      width={1350}
      open={isOpen}
      onOk={isClose}
      onCancel={isClose}
      footer={null}
    >
      <Table
        dataSource={notificationsData}
        columns={notificationColumns}
        pagination={10}
      />
    </Modal>
  );
};

export default NotificationsModal;
