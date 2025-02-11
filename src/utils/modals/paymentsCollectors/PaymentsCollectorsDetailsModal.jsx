import { Button, Col, Divider, Image, Modal, Row } from "antd";
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
      maskClosable={false}
    >
      {paymentsCollectorsData && (
        <>
          <div ref={printRef} className="row">
            <div className="col-12 text-center">
              <Image
                className="w-75"
                src={`${process.env.PUBLIC_URL}/logo_details_3.png`}
                preview={false}
                alt="Banco Bambú Logo"
              />
            </div>
            <div className="col-12 mb-4 text-center">
              <h1 className="fw-bold text-black" style={{ fontSize: "60px" }}>
                {paymentsCollectorsData.amount}
              </h1>
              <label className="fw-semibold text-black"> Pago Exitoso </label>
              <br />
              <label style={{ color: "var(--gray)", fontSize: "13px" }}>
                Realizado: {paymentsCollectorsData.datetime}
              </label>
            </div>
            <Divider variant="dashed" style={{ borderColor: "var(--gray)" }} />
            <div className="col-12">
              <label className="fw-semibold text-black"> Código de Pago </label>
              <p> {paymentsCollectorsData.payment_id} </p>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black"> Pagado Por </label>
              <p>{paymentsCollectorsData.customer}</p>
            </div>
            <div className="col-12">
              <label className="fw-semibold text-black">
                {" "}
                Concepto de Pago{" "}
              </label>
              <p>
                {" "}
                Servicio de {paymentsCollectorsData.service} <br />{" "}
                <span style={{ color: "var(--gray)", fontSize: "12px" }}>
                  Proveedor: {paymentsCollectorsData.collector}
                </span>{" "}
              </p>
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
