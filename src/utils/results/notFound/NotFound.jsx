import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext/AuthContext";
import moment from "moment";

const NotFound = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const token = authState.token;
  const isSupervisor = authState.isSupervisor;
  const timestamp = moment();
  const hour = timestamp.hour();
  const minutes = timestamp.minute();

  const isInBusinessHours =
    hour > 8 && (hour < 18 || (hour === 18 && minutes < 30));

  const goToHome = () => {
    if (token && isInBusinessHours) {
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
                Desarrollado por David Cruz - Todos los Derechos Reservados. -
                Todos los Derechos Reservados.
              </label>
            </div>
          </>
        }
      />
    </div>
  );
};

export default NotFound;
