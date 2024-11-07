import React, { useState, useEffect } from 'react';
import { FaHome, FaCog, FaUser, FaEnvelope, FaClipboardList, FaRecycle, FaUsers } from 'react-icons/fa';
// import './Sidebar.css'; // Place the CSS code in a separate file to reuse the same styles

const Sidebar = () => {
  const [isSidebarLocked, setIsSidebarLocked] = useState(false);
  const [sidebarPosition, setSidebarPosition] = useState('-200px');

  useEffect(() => {
    // Event listener to show sidebar when the mouse is near the left edge
    const handleMouseMove = (event) => {
      if (event.clientX <= 20 && !isSidebarLocked) {
        setSidebarPosition('0');
      } else if (!isSidebarLocked) {
        setSidebarPosition('-200px');
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isSidebarLocked]);

  // Lock sidebar visibility on mouse enter and unlock on mouse leave
  const handleMouseEnter = () => {
    setIsSidebarLocked(true);
    setSidebarPosition('0');
  };

  const handleMouseLeave = () => {
    setIsSidebarLocked(false);
    setSidebarPosition('-200px');
  };

  return (
    <div>
      {/* Sidebar */}
      <div
        className="sidebar"
        style={{ left: sidebarPosition }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <a href="#home">
          <div className="icon-container"><FaHome /></div>
          <span>Home</span>
        </a>
        <a href="#services">
          <div className="icon-container"><FaCog /></div>
          <span>Services</span>
        </a>
        <a href="#about">
          <div className="icon-container"><FaUser /></div>
          <span>About</span>
        </a>
        <a href="#contact">
          <div className="icon-container"><FaEnvelope /></div>
          <span>Contact</span>
        </a>
        <a href="#staff">
          <div className="icon-container"><FaUsers /></div>
          <span>Staff</span>
        </a>
        <a href="#orders">
          <div className="icon-container"><FaClipboardList /></div>
          <span>Orders</span>
        </a>
        <a href="#waste">
          <div className="icon-container"><FaRecycle /></div>
          <span>Waste</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
