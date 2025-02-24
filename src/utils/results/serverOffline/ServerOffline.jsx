import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext/AuthContext";
import moment from "moment";
import { useServerStatus } from "../../../contexts/serverStatusContext/ServerStatusContext";

const ServerOffline = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { serverStatus } = useServerStatus();
  const token = authState.token;
  const isSupervisor = authState.isSupervisor;

  const timestamp = moment();
  const hour = timestamp.hour();
  const minutes = timestamp.minute();

  const goToHome = () => {
    if (token) {
      navigate(isSupervisor ? "/dashboard" : "/customers");
    } else {
      navigate("/");
    }
  };

  const isInBusinessHours =
    (hour >= 8 && hour < 18) || (hour === 18 && minutes < 30);

    const subTitle = isInBusinessHours
    ? !serverStatus
      ? "Lamentamos los Inconvenientes. Por Favor, Intente Nuevamente en unos Instantes."
      : ""
    : !serverStatus
    ? "El Acceso al Sistema está Restringido Fuera del Horario Laboral"
    : "El Acceso al Sistema está Restringido Fuera del Horario Laboral";

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
        title={isInBusinessHours ? "El Servidor está Fuera de Línea" : "El Servidor está Fuera de Línea"}
        subTitle={
          <label className="fw-regular text-black">{subTitle}</label>
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
