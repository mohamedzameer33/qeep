import React from 'react';
import '../App.css';

const Header = ({ setIsAuthenticated }) => {
const handleLogout = () => {
    window.location.href = "/";
    alert("Logged out successfully!");
  };

  return (
    <div className='qeep'>
      <img style={{height:"40px"}} src="https://bamstechnologies.org/qeep--/images/logo.webp" alt="Logo" />
      {/* <button
        onClick={handleLogout}
        className='spinbtn'
        style={{ position: 'absolute', left: '1450px' }}
      >
        Logout
      </button> */}
    </div>
  );
};

export default Header;
