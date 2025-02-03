import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import Header from '../../../components/Header';
import { FaUser, FaHandsHelping, FaUserShield, FaClipboardList } from 'react-icons/fa';
import './UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const isActive = (path) => {
    return location.pathname === path ? 'nav-item active' : 'nav-item';
  };

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <div className="sidebar">
          <div className="sidebar-header">
            <h3>User Dashboard</h3>
          </div>
          <nav className="sidebar-nav">
            <button 
              onClick={() => navigate('/user/profile')} 
              className={isActive('/user/profile')}
            >
              <FaUser style={{ marginRight: '10px' }} /> Edit Profile
            </button>
            <button 
              onClick={() => navigate('/user/volunteer-registration')} 
              className={isActive('/user/volunteer-registration')}
            >
              <FaHandsHelping style={{ marginRight: '10px' }} /> Register as Volunteer
            </button>
            <button 
              onClick={() => navigate('/user/volunteer-profile')} 
              className={isActive('/user/volunteer-profile')}
            >
              <FaUserShield style={{ marginRight: '10px' }} /> Volunteer Profile
            </button>
            <button 
              onClick={() => navigate('/user/requests')} 
              className={isActive('/user/requests')}
            >
              <FaClipboardList style={{ marginRight: '10px' }} /> My Requests
            </button>
          </nav>
        </div>
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 