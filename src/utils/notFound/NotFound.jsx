import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/dashboard");
  };

  return (
    <Result
      className="mt-5 pt-5"
      status="404"
      title="404"
      subTitle={
        <>
          <label className="fw-regular text-black">
            Lo Sentimos, la Página que Buscas no Existe
          </label>
        </>
      }
      extra={
        <>
          <Button type="primary" onClick={goToHome}>
            Volver Al Dashboard
          </Button>
          <br />
          <label
            className="fw-regular text-black mt-4"
            style={{ fontSize: "12px" }}
          >
            Banco Bambú &reg; <br /> {new Date().getFullYear()} All Rights
            Reserved.
          </label>
        </>
      }
    />
  );
};

export default NotFound;
