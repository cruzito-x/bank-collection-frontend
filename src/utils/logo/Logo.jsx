import React from "react";

const Logo = () => {
  return (
    <div className="logo">
      <div className="logo-icon">
        <img
          src={`${process.env.PUBLIC_URL}/assets/img/logo_menu.png`}
          className="logo-img p-2"
          alt="Banco Bambú Logo"
        />
      </div>
    </div>
  );
};

export default Logo;
