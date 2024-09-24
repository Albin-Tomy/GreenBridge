import React, { useState } from 'react';
import './Navbar.css';  // Assuming you have the styles in Navbar.css

const Navbar = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  return (
    <header>
      <p className="Logo">Navbar</p>
      {/* Checkbox for toggling the menu */}
      <input 
        type="checkbox" 
        className="btn" 
        checked={isNavVisible} 
        onChange={toggleNav} 
      />
      {/* Navigation Menu */}
      <div className={`nav ${isNavVisible ? 'active' : ''}`}>
        <ol>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Contact</a></li>
        </ol>
      </div>
    </header>
  );
};

export default Navbar;
