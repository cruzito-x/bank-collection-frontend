import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, message, Image, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "./styles/login.css";
import { useAuth } from "../../contexts/authContext/AuthContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [messageAlert, messageContext] = message.useMessage();
  const navigate = useNavigate();
  const { setAuthState } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.status === 200) {
        messageAlert.success(data.message);
        setAuthState({
          isSupervisor: data.isSupervisor,
          user_id: data.user_id,
          username: data.username,
        });

        if (data.isSupervisor) {
          navigate("/dashboard");
        } else {
          navigate("/customers");
        }
      } else {
        if (response.status === 401 || response.status === 500) {
          messageAlert.error(data.message);
        }
      }
    } catch (error) {
      messageAlert.error(
        "Ha Ocurrido un Error Inesperado, Por Favor Intente de Nuevo"
      );
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      {messageContext}
      <Card>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: "15px",
          }}
        >
          <Image
            src={`${process.env.PUBLIC_URL}/logo.png`}
            preview={false}
            style={{
              width: "75px",
              height: "75px",
              borderRadius: "50%",
              marginTop: 20,
            }}
            alt="Logo del Sistema"
          />
        </div>
        <Form
          layout={"vertical"}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          style={{ width: 300, padding: 20 }}
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
