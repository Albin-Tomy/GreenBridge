import React, { useState, useEffect } from 'react';
import { FaHome,FaBox, FaCog, FaUser, FaEnvelope, FaClipboardList, FaRecycle, FaUsers } from 'react-icons/fa';
import '../../../components/bar.css'; // Place the CSS code in a separate file to reuse the same styles
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isSidebarLocked, setIsSidebarLocked] = useState(false);
  const [sidebarPosition, setSidebarPosition] = useState('-200px');
  const navigate=useNavigate();


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

  const gotoOrders = ()=>{
    navigate('/stafforder');
  }
  const gotoShgWaste=()=>{
    navigate('/shgwaste');
  }

  const gotoProducts=()=>
  {
    navigate('/shg');
  }

  const gotoRequests=()=>{
    navigate('/shgrequest');
  }

  return (
    <div>
      {/* Sidebar */}
      <div
        className="sidebar"
        style={{ left: sidebarPosition }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        
        <a href="#services">
          <div className="icon-container" onClick={gotoProducts}><FaBox /></div>
          <span>Products</span>
        </a>
        
        <a href="#staff">
          <div className="icon-container"><FaUsers /></div>
          <span>User Requests</span>
        </a>
        <a href="#orders">
          <div className="icon-container" onClick={gotoOrders}><FaClipboardList /></div>
          <span>Orders</span>
        </a>
        <a href="#waste">
          <div className="icon-container" onClick={gotoShgWaste}><FaRecycle /></div>
          <span>Waste</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
