import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext/AuthContext";

const NotFound = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const token = authState.token;
  const isSupervisor = authState.isSupervisor;

  const goToHome = () => {
    if (token) {
      navigate(isSupervisor ? "/dashboard" : "/customers");
    } else {
      navigate("/");
    }
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle={
        <label className="fw-regular text-black">
          Lo Sentimos, la Página que Buscas no Existe
        </label>
      }
      extra={
        <>
          <div>
            <Button type="primary" onClick={goToHome}>
              Volver
            </Button>
          </div>{" "}
          <br />
          <div>
            <label
              className="fw-regular text-black"
              style={{ fontSize: "12px" }}
            >
              &copy;{new Date().getFullYear()} Banco Bambú de El Salvador, S.A
              de C.V.&reg; <br />
              Desarrollado por cruzito-x - Todos los Derechos Reservados.
            </label>
          </div>
        </>
      }
      style={{
        height: "75vh",
        display: "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "align-items": "center",
      }}
    />
  );
};

export default NotFound;
