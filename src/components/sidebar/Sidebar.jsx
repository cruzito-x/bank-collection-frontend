import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import NotFound from "../../utils/notFound/NotFound";
import { Content, Footer } from "antd/es/layout/layout";
import Dashboard from "../dashboard/Dashboard";
import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import LayoutHeader from "../../utils/layoutHeader/layoutHeader";
import MenuList from "../menu/Menu";
import Logo from "../../utils/logo/Logo";
import "./styles/sidebar.css";
import Customers from "../customers/Customers";
import Collectors from "../collectors/Collectors";
import CollectorsPayments from "../collectorsPayments/CollectorsPayments";

const Sidebar = () => {
  const [darkTheme, setDarkTheme] = useState(true);
  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const username = "David Cruz";
    if (username && location.pathname === "/") {
      navigate("/dashboard");
    } else if (!username && location.pathname !== "/") {
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

  const isSupervisor = true;

  const routes = isSupervisor
    ? [
        "/dashboard",
        "/customers",
        "/collectors",
        "/collectors-payments",
        "/transactions",
        "/transactions-types",
        "/approvals",
        "/users",
        "/audit",
      ]
    : ["/customers", "/collectors-payments", "/transactions"];

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
        className="sidebar"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          backgroundColor: "#273543",
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
      </Sider>
      <Layout style={layoutStyle}>
        {location.pathname !== "/dashboard" && <LayoutHeader />}
        <Content style={{ margin: location.pathname !== "/dashboard" ? "24px 0 0" : "-40px 0 0", overflow: "initial" }}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/collectors" element={<Collectors />} />
            <Route path="/collectors-payments" element={<CollectorsPayments />} />
          </Routes>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            background: "#eef1f7",
            marginTop: "-60px",
          }}
        >
          &copy; cruzito-x - {new Date().getFullYear()} All rights reserved.
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
