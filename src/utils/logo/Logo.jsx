import React from "react";

const Logo = () => {
  return (
    <div className="logo">
      <div className="logo-icon">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} className="logo-img" alt="logo" />
      </div>
    </div>
  );
};

export default Logo;