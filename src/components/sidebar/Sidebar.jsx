import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import NotFound from "../../utils/notFound/NotFound";
import { Content, Footer } from "antd/es/layout/layout";
import Dashboard from "../dashboard/Dashboard";
import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import LayoutHeader from "../../utils/layoutHeader/LayoutHeader";
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

const Sidebar = () => {
  const [darkTheme, setDarkTheme] = useState(true);
  const { authState } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (authState.username && location.pathname === "/") {
      navigate("/dashboard");
    } else if (!authState.username && location.pathname !== "/") {
      navigate("/");
    }
  }, [location.pathname]);

  const navigate = (path) => {
    window.location.href = path;
  };

  const layoutStyle = {
    marginLeft: collapsed ? 80 : 200,
    transition: "all .25s ease-in-out",
    backgroundColor: "#eef1f7",
  };

  const isSupervisor = authState.isSupervisor;

  const routes = isSupervisor
    ? [
        "/dashboard",
        "/customers",
        "/collectors",
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
        className={`sidebar ${collapsed ? "overflow-hidden" : "overflow-auto"}`}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          backgroundColor: "var(--gray)",
          left: 0,
          top: 0,
          bottom: 0,
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
        <Footer
          className={`text-center text-white p-4 ${collapsed ? "d-none" : ""}`}
          style={{
            background: "transparent",
            marginTop: "-100px",
          }}
        >
          &copy; cruzito-x - {new Date().getFullYear()} <br /> All Rights
          Reserved.
        </Footer>
      </Sider>
      <Layout style={layoutStyle}>
        {location.pathname !== "/dashboard" && <LayoutHeader />}
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
        </Content>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
