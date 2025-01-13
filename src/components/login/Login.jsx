import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, message, Image, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Logo from "../../assets/img/logo.png";
import "./styles/login.css";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  localStorage.clear();

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
        message.success(data.message);
        localStorage.setItem("cod_user", data.id);
        localStorage.setItem("username", values.username);
        localStorage.setItem("role", data.role);
        navigate("/dashboard");
      } else {
        if (response.status === 401 || response.status === 500) {
          message.error(data.message);
        }
      }
    } catch (error) {
      message.error("Ha ocurrido un error inesperado, por favor intente de nuevo");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
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
            src={Logo}
            preview={false}
            style={{ width: "75px", height: "75px", borderRadius: "50%", marginTop: 20 }}
            alt="Logo del Sistema"
          />
        </div>
        <Form
          name="loginForm"
          layout={"vertical"}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          style={{ width: 300, padding: 20 }}
        >
          <Form.Item
            label="Usuario"
            name="username"
            rules={[
              {
                message: "Por favor introduzca su usuario",
              },
            ]}
          >
            <Input placeholder="Usuario" />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ message: "Por favor introduzca su contraseña" }]}
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
