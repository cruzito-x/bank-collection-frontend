import { Button, Col, Modal, Row, Tag } from "antd";
import {
  ContainerOutlined,
  InfoCircleOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import React, { useEffect, useRef } from "react";

const ApprovalTransactionDetails = ({ isOpen, isClosed, approvalData }) => {
  const printRef = useRef(null);

  useEffect(() => {}, [isOpen, approvalData]);

  const printDetails = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    } else {
      console.error("printRef.current is undefined");
    }
  };

  return (
    <Modal
      title={
        <Row align="middle">
          <Col>
            <InfoCircleOutlined
              className="fs-6"
              style={{ marginRight: 8, color: "var(--blue)" }}
            />
          </Col>
          <Col>
            <label className="fs-6 text-black">Detalles de Aprobación</label>
          </Col>
        </Row>
      }
      centered
      width={450}
      open={isOpen}
      onCancel={isClosed}
      footer={null}
    >
      {approvalData && (
        <>
          <div ref={printRef} className="row mt-4">
            <div className="col-12 mb-3 text-center">
              <h1 className="fw-bold text-black" style={{ fontSize: "60px" }}>
                {approvalData.amount}
              </h1>
              <label className="fw-semibold text-black">
                Detalle de Transacción
              </label>{" "}
              <br />
              <label style={{ color: "var(--gray)", fontSize: "13px" }}>
                Realizado: {approvalData.datetime} <br />
                Autorizado: {approvalData.authorized_at}
              </label>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black">
                {" "}
                Código de Aprobación{" "}
              </label>
              <p> {approvalData.approval_id} </p>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black">
                {" "}
                Código de Transacción{" "}
              </label>
              <p> {approvalData.transaction_id} </p>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black">
                {" "}
                Tipo de Transacción{" "}
              </label>
              <p>
                <Tag
                  color={`${
                    approvalData.transaction_type === "Deposito"
                      ? "success"
                      : approvalData.transaction_type === "Retiro"
                      ? "error"
                      : "processing"
                  }`}
                >
                  {" "}
                  {approvalData.transaction_type}{" "}
                </Tag>
              </p>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black"> Remitente </label>
              <p> {approvalData.sender_name} </p>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black">
                {" "}
                E-mail de Remitente{" "}
              </label>
              <p> {approvalData.sender_email} </p>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black"> Destinatario </label>
              <p> {approvalData.receiver_name} </p>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black">
                {" "}
                E-mail de Destinatario{" "}
              </label>
              <p> {approvalData.receiver_email} </p>
            </div>
            {approvalData.concept !== null ||
              (approvalData.concept === "" && (
                <div className="col-12">
                  <label className="fw-semibold text-black"> Concepto </label>
                  <p> {approvalData.concept} </p>
                </div>
              ))}
            <div className="col-12">
              <label className="fw-semibold text-black"> Realizado Por </label>
              <p> {approvalData.realized_by} </p>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black"> Autorizado Por </label>
              <p> {approvalData.authorized_by} </p>
            </div>
          </div>
          <div className="text-end">
            <Button type="primary" danger onClick={isClosed}>
              {" "}
              Cerrar{" "}
            </Button>
            <Button className="ms-2" type="primary" onClick={printDetails}>
              <PrinterOutlined />
              Imprimir
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ApprovalTransactionDetails;
