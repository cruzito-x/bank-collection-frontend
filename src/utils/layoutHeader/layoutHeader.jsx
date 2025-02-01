import React from "react";
import { Layout } from "antd";

const LayoutHeader = () => {
  const { Header } = Layout;

  return (
    <Header
      style={{
        padding: 0,
        backgroundColor: "var(--gray)",
        marginTop: 0,
        marginLeft: 0,
        position: "fixed",
        width: "100%",
        zIndex: "1",
      }}
    >
      <div className="row d-flex align-items-center">
        <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <label className="fw-semibold fs-6 text-white ms-3">
            Banco Bambú &reg; | Sistema de Cobros
          </label>
        </div>
      </div>
    </Header>
  );
};

export default LayoutHeader;
