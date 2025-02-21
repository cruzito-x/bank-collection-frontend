import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import NotFound from "../../utils/notFound/NotFound";
import { Content, Footer } from "antd/es/layout/layout";
import Dashboard from "../dashboard/Dashboard";
import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import Header from "../../utils/header/Header";
import MenuList from "../../utils/menu/Menu";
import Logo from "../../utils/logo/Logo";
import "./styles/sidebar.css";
import Customers from "../customers/Customers";
import Collectors from "../collectors/Collectors";
import PaymentsCollectors from "../paymentsCollectors/PaymentsCollectors";
import Transactions from "../transactions/Transactions";
import TransactionTypes from "../transactionTypes/TransactionTypes";
import Approvals from "../approvals/Approvals";
import Users from "../users/Users";
import Audit from "../audit/Audit";
import { useAuth } from "../../contexts/authContext/AuthContext";
import Services from "../services/Services";

const Sidebar = () => {
  const darkTheme = true;
  const { authState } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (authState.username && location.pathname === "/") {
      navigate("/dashboard");
    } else if (!authState.username && location.pathname !== "/") {
      navigate("/");
    }
  }, [authState.username, location.pathname]);

  const navigate = (path) => {
    window.location.href = path;
  };

  const layoutStyle = {
    marginLeft: collapsed ? 80 : 200,
    transition: "all .25s ease-in-out",
    backgroundColor: "#eef1f7",
  };

  const routes = authState.isSupervisor
    ? [
        "/dashboard",
        "/customers",
        "/collectors",
        "/services",
        "/payments-collectors",
        "/transactions",
        "/transaction-types",
        "/approvals",
        "/users",
        "/audit",
      ]
    : ["/customers", "/payments-collectors", "/transactions"];

  const renderedRoutes = routes.includes(location.pathname);

  if (!renderedRoutes) {
    return (
      <Routes>
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  return (
    <Layout hasSider>
      <Sider
        collapsed={collapsed}
        collapsible
        trigger={null}
        className={`sidebar overflow-auto`}
        style={{
          height: "100vh",
          position: "fixed",
          backgroundColor: "var(--gray)",
        }}
      >
        <Logo />
        <Routes>
          <Route
            path="/*"
            element={
              <MenuList
                darkTheme={darkTheme}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
              />
            }
          />
        </Routes>
      </Sider>
      <Layout style={layoutStyle}>
        {location.pathname !== "/dashboard" && <Header />}
        <Content
          style={{
            margin:
              location.pathname !== "/dashboard" ? "24px 0 0" : "-40px 0 0",
            overflow: "initial",
          }}
        >
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/collectors" element={<Collectors />} />
            <Route path="/services" element={<Services />} />
            <Route
              path="/payments-collectors"
              element={<PaymentsCollectors />}
            />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transaction-types" element={<TransactionTypes />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/users" element={<Users />} />
            <Route path="/audit" element={<Audit />} />
          </Routes>
          <Footer
            className="text-center text-black"
            style={{
              background: "transparent",
              marginTop: "-55px",
              width: "100%",
              fontSize: "12.5px",
            }}
          >
            &copy; {new Date().getFullYear()} Banco Bambú de El Salvador, S.A.
            de C.V.&reg; <br />
            Desarrollado por David Cruz - Todos los Derechos Reservados.
          </Footer>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
