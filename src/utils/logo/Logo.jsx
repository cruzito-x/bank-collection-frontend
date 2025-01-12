import React from 'react';
import LogoIcon from '../../assets/img/logo.png';

const Logo = () => {
  return (
    <div className='logo'>
      <div className="logo-icon">
      <img src={LogoIcon} className='logo-img' alt="logo" />
      </div>
    </div>
  );
}

export default Logo;