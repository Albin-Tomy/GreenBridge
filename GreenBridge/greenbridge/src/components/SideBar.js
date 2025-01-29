import React, { useState, useEffect } from 'react';
import { FaHome, FaCog,FaBox, FaUser, FaEnvelope, FaClipboardList, FaRecycle, FaUsers } from 'react-icons/fa';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import './bar.css'; // Place the CSS code in a separate file to reuse the same styles
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
    navigate('/admin/order');
  }
  const gotoShg=()=>{
    navigate('/allsh');
  }

  const gotoProducts=()=>
  {
    navigate('/admin/admin');
  }

  const gotoRequests=()=>{
    navigate('/admin/pending-requests');
  }

  const userMenuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />
    },
    {
      title: "Service Request",
      path: "/service-request",
      icon: <AddCircleOutlineIcon />
    },
    {
      title: "Profile",
      path: "/profile",
      icon: <FaUser />
    },
    {
      title: "All SHG",
      path: "/allsh",
      icon: <FaUsers />
    },
    {
      title: "Orders",
      path: "/admin/order",
      icon: <FaClipboardList />
    },
    {
      title: "Products",
      path: "/admin/admin",
      icon: <FaBox />
    },
    {
      title: "Pending Requests",
      path: "/admin/pending-requests",
      icon: <FaUser />
    }
  ];

  return (
    <div>
      {/* Sidebar */}
      <div
        className="sidebar"
        style={{ left: sidebarPosition }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {userMenuItems.map((item, index) => (
          <a key={index} href={item.path}>
            <div className="icon-container">
              {item.icon}
            </div>
            <span>{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
