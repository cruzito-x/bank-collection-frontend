import { Button, Col, Divider, Modal, Row, Tag } from "antd";
import { FileTextOutlined, PrinterOutlined } from "@ant-design/icons";
import React, { useEffect, useRef } from "react";

const TransactionDetailsModal = ({ isOpen, isClosed, transactionData }) => {
  const printRef = useRef(null);

  useEffect(() => {}, [isOpen, transactionData]);

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
            <FileTextOutlined
              className="fs-6"
              style={{ marginRight: 8, color: "var(--blue)" }}
            />
          </Col>
          <Col>
            <label className="fs-6 text-black">Detalles de Transacción</label>
          </Col>
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
          <div ref={printRef} className="row mt-4">
            <div className="col-12 mb-4 text-center">
              <h1 className="fw-bold text-black" style={{ fontSize: "60px" }}>
                {transactionData.amount}
              </h1>
              <label className="fw-semibold text-black">
                Transacción Exitosa
              </label>{" "}
              <br />
              <label style={{ color: "var(--gray)", fontSize: "13px" }}>
                Realizada: {transactionData.datetime}
              </label>
            </div>
            <Divider variant="dashed" style={{ borderColor: "var(--gray)" }} />
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
              <p>
                <Tag
                  color={`${
                    transactionData.transaction_type === "Deposito"
                      ? "success"
                      : transactionData.transaction_type === "Retiro"
                      ? "error"
                      : "processing"
                  }`}
                >
                  {" "}
                  {transactionData.transaction_type}{" "}
                </Tag>
              </p>
            </div>
            {transactionData.sender_account !==
              transactionData.receiver_account &&
              transactionData.sender_account !== null && (
                <div className="col-12">
                  <label className="fw-semibold text-black">
                    Cuenta{" "}
                    {transactionData.receiver_account !== null &&
                    transactionData.sender_account !==
                      transactionData.receiver_account
                      ? "Remitente"
                      : "Destino"}
                  </label>
                  <p>
                    {" "}
                    {transactionData.sender_account +
                      ", " +
                      transactionData.customer}{" "}
                    <br />
                    <span
                      style={{
                        color: "var(--gray)",
                        fontSize: "12px",
                      }}
                    >
                      {transactionData.customer_email}
                    </span>{" "}
                  </p>
                </div>
              )}
            {transactionData.receiver_account && (
              <div className="col-12">
                <label className="fw-semibold text-black">
                  {" "}
                  Cuenta Destino{" "}
                </label>
                <p>
                  {" "}
                  {transactionData.receiver_account +
                    ", " +
                    transactionData.receiver}{" "}
                  <br />
                  <span
                    style={{
                      color: "var(--gray)",
                      fontSize: "12px",
                    }}
                  >
                    {transactionData.receiver_email}
                  </span>{" "}
                </p>
              </div>
            )}
            {transactionData.transaction_type === "Transferencia" &&
              transactionData.concept === "" &&
              transactionData.concept === null && (
                <div className="col-12">
                  <label className="fw-semibold text-black"> Concepto </label>
                  <p>{transactionData.concept}</p>
                </div>
              )}
            <div className="col-12">
              <label className="fw-semibold text-black"> Realizado Por </label>
              <p> {transactionData.realized_by} </p>
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

export default TransactionDetailsModal;
