import React, { useState } from "react";
import { Button, Card, Form, Image, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Logo from "../../assets/img/logo.png";
import "./styles/login.css";

const Login = () => {
  const [loading, setLoading] = useState(false);

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
            style={{ width: "75px", height: "75px", borderRadius: "50%" }}
            alt="Logo del Sistema"
          />
        </div>
        <Form
          name="loginForm"
          layout={"vertical"}
          initialValues={{ remember: true }}
          style={{ width: 300 }}
        >
          <Form.Item
            label="Usuario:"
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
            label="Contraseña:"
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
