import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext/AuthContext";

const ServerOffline = () => {
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Result
        status="warning"
        title="El Servidor está Fuera de Línea"
        subTitle={
          <label className="fw-regular text-black">
            Lamentamos los Inconvenientes. Por Favor, Intente Nuevamente en unos
            Instantes.
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
                Desarrollado por David Cruz - Todos los Derechos Reservados.
              </label>
            </div>
          </>
        }
      />
    </div>
  );
};

export default ServerOffline;
