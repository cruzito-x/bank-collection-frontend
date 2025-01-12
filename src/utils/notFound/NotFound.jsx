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
      subTitle="Lo sentimos, la página que buscas no existe"
      extra={
        <Button type="primary" onClick={goToHome}>
          Volver
        </Button>
      }
    />
  );
};

export default NotFound;
