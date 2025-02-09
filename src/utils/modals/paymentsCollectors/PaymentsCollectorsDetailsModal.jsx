import { Button, Col, Modal, Row } from "antd";
import { FileTextOutlined, PrinterOutlined } from "@ant-design/icons";
import React, { useEffect, useRef } from "react";

const PaymentsCollectorsDetailsModal = ({
  isOpen,
  isClosed,
  paymentsCollectorsData,
}) => {
  const printRef = useRef();
  useEffect(() => {}, [isOpen, paymentsCollectorsData]);

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
            <label className="fs-6 text-black">
              Detalles de Pago a Colector
            </label>
          </Col>
        </Row>
      }
      centered
      open={isOpen}
      width={450}
      onCancel={isClosed}
      footer={null}
    >
      {paymentsCollectorsData && (
        <>
          <div ref={printRef} className="row mt-4">
            <div className="col-12 mb-3 text-center">
              <h1 className="fw-bold text-black" style={{ fontSize: "60px" }}>
                {paymentsCollectorsData.amount}
              </h1>
              <label className="fw-semibold text-black"> Pago Exitoso </label>
              <br />
              <label style={{ color: "var(--gray)", fontSize: "13px" }}>
                Realizado: {paymentsCollectorsData.datetime}
              </label>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black"> Código de Pago </label>
              <p> {paymentsCollectorsData.payment_id} </p>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black"> Cancelado Por </label>
              <p>{paymentsCollectorsData.customer}</p>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black"> Colector </label>
              <p>{paymentsCollectorsData.collector}</p>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black"> Concepto </label>
              <p> Pago por {paymentsCollectorsData.service} </p>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black"> Registrado Por </label>
              <p> {paymentsCollectorsData.registered_by} </p>
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

export default PaymentsCollectorsDetailsModal;
