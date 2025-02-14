import React, { useEffect } from "react";
import { useMediaQuery } from "react-responsive";

const Logo = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isTablet = useMediaQuery({
    query: "(min-width:769px) and (max-width: 1024px)",
  });
  const isDesktop = useMediaQuery({ query: "(min-width: 769px)" });

  useEffect(() => {}, [isMobile, isTablet, isDesktop]);
  return (
    <div className="logo">
      <div className="logo-icon">
        <img
          src={`${process.env.PUBLIC_URL}/assets/img/logo/main_logo.png`}
          className={`logo-img ${isDesktop ? "p-2" : "p-3"}`}
          alt="Banco Bambú Logo"
        />
      </div>
    </div>
  );
};

export default Logo;
