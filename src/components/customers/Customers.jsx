import { Breadcrumb, Button, Card, Input, Layout, theme } from "antd";
import { ExpandAltOutlined, IdcardOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";

const Customers = () => {
  const { Content } = Layout;
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  return (
    <Content style={{ margin: "31px 16px" }}>
      <div
        style={{
          padding: 24,
          minHeight: "90vh",
          background: "none",
          borderRadius: borderRadiusLG,
        }}
      >
        <Breadcrumb
          items={[
            {
              title: (
                <>
                  <UserOutlined />
                  <span>Usuario</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <TeamOutlined />
                  <span>Clientes</span>
                </>
              ),
            },
          ]}
        />

        <Card>
          <div className="row ms-2 pt-3 mb-2">
            <div className="col-12 text-start">
              <label htmlFor="" className="fw-semibold">
                {" "}
                Buscar Por{" "}
              </label>
            </div>
          </div>
          <div className="row ms-1 mb-3 pe-3">
            <div className="col-md-3 col-sm-12">
              <Input
                placeholder="Nombre de Cliente"
                prefix={<UserOutlined />}
              />
            </div>
            <div className="col-md-3 col-sm-12">
              <Input
                placeholder="Documento de Identidad"
                prefix={<IdcardOutlined />}
              />
            </div>
            <div className="col-md-3 col-sm-12">
              <Input
                placeholder="Balance"
                prefix={<ExpandAltOutlined />}
              />
            </div>
            <div className="col-md-3 col-sm-12">
              <Button type="primary"> Buscar </Button>
            </div>
          </div>
        </Card>
      </div>
    </Content>
  );
};

export default Customers;
