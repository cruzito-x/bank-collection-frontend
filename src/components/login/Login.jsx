import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, message, Image, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useAuth } from "../../contexts/authContext/AuthContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [messageAlert, messageContext] = message.useMessage();
  const navigate = useNavigate();
  const { setAuthState } = useAuth();

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
        });

        if (loggedUserData.isSupervisor) {
          navigate("/dashboard", { state: { userId: loggedUserData.user_id } });
        } else {
          navigate("/customers");
        }
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
        <div className="w-100 d-flex justify-content-center mb-3">
          <Image
            src={`${process.env.PUBLIC_URL}/logo.png`}
            preview={false}
            style={{
              width: "75px",
              height: "75px",
              borderRadius: "50%",
              marginTop: 25,
            }}
            alt="Logo del Sistema"
          />
        </div>
        <Form
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={loginUser}
          style={{ width: 350, padding: 20 }}
        >
          <label className="text-black"> Usuario </label>
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

          <label className="text-black"> Contraseña </label>
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
        </Form>
      </Card>
    </div>
  );
};

export default Login;
