import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, message, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useAuth } from "../../contexts/authContext/AuthContext";
import Logo from "../../utils/logo/Logo";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [messageAlert, messageContext] = message.useMessage();
  const navigate = useNavigate();
  const { setAuthState, authState } = useAuth();
  const token = authState.token;
  const isSupervisor = authState.isSupervisor;

  useEffect(() => {
    if (token) {
      navigate(isSupervisor ? "/dashboard" : "/customers");
    }
  }, [navigate]);

  const loginUser = async (user) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const loggedUserData = await response.json();

      if (response.status === 200) {
        messageAlert.success(loggedUserData.message);
        setAuthState({
          isSupervisor: loggedUserData.isSupervisor,
          user_id: loggedUserData.user_id,
          username: loggedUserData.username,
          token: loggedUserData.token,
        });

        navigate(loggedUserData.isSupervisor ? "/dashboard" : "/customers");
      } else if (response.status === 400) {
        messageAlert.warning(loggedUserData.message);
      } else {
        messageAlert.error(loggedUserData.message);
      }
    } catch (error) {
      messageAlert.error(
        "Ha Ocurrido un Error Inesperado, Intente en unos Instantes"
      );
    }
    setLoading(false);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      {messageContext}
      <Card>
        <div className="w-100 text-center mb-3">
          <Logo/>
          <br />
          <label className="fw-semibold mt-2" style={{ color: "var(--blue)" }}>
            Banco Bambú de El Salvador, S.A de C.V.&reg;
          </label>
        </div>
        <Form
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={loginUser}
          style={{ width: 350, padding: 20 }}
        >
          <label className="fw-semibold text-black"> Usuario </label>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Por Favor Introduzca su Usuario",
              },
            ]}
          >
            <Input placeholder="Usuario" />
          </Form.Item>

          <label className="fw-semibold text-black"> Contraseña </label>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Por Favor Introduzca su Contraseña" },
            ]}
          >
            <Input.Password
              placeholder="Contraseña"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%" }}
            >
              Iniciar Sesión
            </Button>
          </Form.Item>

          <label
            className="text-black w-100 text-center"
            style={{ fontSize: "12.5px" }}
          >
            &copy; {new Date().getFullYear()} - Desarrollado por <br />
            cruzito-x
          </label>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
