import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import NotFound from "../../utils/notFound/NotFound";
import { Content, Footer } from "antd/es/layout/layout";
import Dashboard from "../dashboard/Dashboard";
import {Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import LayoutHeader from "../../utils/layoutHeader/layoutHeader";
import Menu from '../menu/Menu';
import Logo from "../../utils/logo/Logo";
import './styles/sidebar.css';

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
        <Routes path="/*" element={<NotFound />} />
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
              <Menu
                darkTheme={darkTheme}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
              />
            }
          />
        </Routes>
      </Sider>
      <Layout style={layoutStyle}>
        <LayoutHeader />
        <Content style={{ margin: "24px 0 0", overflow: "initial" }}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          </Routes>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          &copy; cruzito-x - {new Date().getFullYear()} All rights reserved.
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
