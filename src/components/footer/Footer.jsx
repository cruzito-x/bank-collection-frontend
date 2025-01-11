import React, { useEffect } from 'react';
import $ from 'jquery';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  useEffect(() => {
    $('#year').text(currentYear);
  }, []);

  return (
    <div className="text-center mt-5 pt-5">
      <footer className='fs-6'> <a className='text-decoration-none text-black' href="https://github.com/cruzito-x">&copy; cruzito.x</a> - All Rights Reserved <span id="year"></span> </footer>
    </div>
  )
}

export default Footer