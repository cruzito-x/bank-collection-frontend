import { Button, Col, Modal, Row } from "antd";
import { CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";

const TransactionDetailsModal = ({ isOpen, isClosed, transactionData }) => {
  useEffect(() => {}, [isOpen, transactionData]);

  return (
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
            <label className="fs-6 text-black">Detalles de Transacción</label>
          </Col>{" "}
        </Row>
      }
      centered
      width={450}
      open={isOpen}
      onCancel={isClosed}
      footer={null}
    >
      {transactionData && (
        <>
          <div className="row mt-4">
            <div className="col-12 mb-3 text-center">
              <h1 className="fw-bold" style={{ fontSize: "60px" }}>
                {transactionData.amount}
              </h1>
              <label className="fw-semibold text-black">
                {" "}
                <CheckCircleOutlined style={{ color: "var(--green)" }} />{" "}
                ¡Transferencia Exitosa!{" "}
              </label>{" "}
              <br />
              <label style={{ color: "var(--gray)", fontSize: "13px" }}>
                {transactionData.datetime}
              </label>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black">
                {" "}
                Código de Transacción{" "}
              </label>
              <p> {transactionData.id} </p>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black">
                {" "}
                Tipo de Transacción{" "}
              </label>
              <p> {transactionData.transaction_type} </p>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black"> Envíado Por </label>
              <p> {transactionData.customer} </p>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black">
                {" "}
                E-mail de Cliente{" "}
              </label>
              <p> {transactionData.customer_email} </p>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black"> Recibido Por </label>
              <p> {transactionData.receiver} </p>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black"> Concepto </label>
              <p> {transactionData.concept} </p>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black"> Autorizado Por </label>
              <p> {transactionData.authorized_by} </p>
            </div>
          </div>
          <div className="text-end">
            <Button type="primary" danger onClick={isClosed}>
              {" "}
              Cerrar{" "}
            </Button>
            <Button className="ms-2" type="primary">
              Imprimir PDF
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default TransactionDetailsModal;
