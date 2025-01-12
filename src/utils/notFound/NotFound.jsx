import React from "react";
import { Button, Result } from "antd";
const NotFound = () => (
  <Result
    status="404"
    title="404"
    subTitle="Lo sentimos, la página que buscas no existe"
    extra={<Button type="primary" onClick={{
      pathname: "/",
      state: { from: window.location.pathname }
    }}>Volver</Button>}
  />
);
export default NotFound;
