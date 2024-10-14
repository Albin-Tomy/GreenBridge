import React from 'react';
import './ShgDashboard.css'; // Import the CSS for styling
import { FaHome, FaPlus, FaList, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';

const SHGDashboard = () => {

  const navigate = useNavigate();

  const goTostaff = () => {
    navigate('/staff');  // Navigate to the pending requests page
  };

  return (
    <div>
      <Navbar/>
    <div className="shg-dashboard-container">
      
      {/* Sidebar */}
      <nav className="shg-sidebar">
        <div className="shg-sidebar-header">
          <h2>SHG Dashboard</h2>
        </div>
        <ul className="shg-sidebar-menu">
          <li><a href="#"><FaHome className="shg-icon" /> Dashboard</a></li>
          <li><a href="#"><FaPlus className="shg-icon" /> Add Product</a></li>
          <li><a href="#"><FaList className="shg-icon" /> View Products</a></li>
          <li><a href="#"><FaShoppingCart className="shg-icon" /> Orders</a></li>
          <li><a href="#"><FaUser className="shg-icon" /> Profile</a></li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="shg-main-content">
        <header className="shg-dashboard-header">
          <h1>Welcome to the SHG Dashboard</h1>
        </header>

        <section className="shg-dashboard-section">
          <div className="shg-dashboard-card">
            <h3>Add New Product</h3>
            <p>Manage your products and inventory.</p>
            <button className="shg-btn" onClick={goTostaff}>Add Product</button>
          </div>
          <div className="shg-dashboard-card">
            <h3>Orders</h3>
            <p>View and manage customer orders.</p>
            <button className="shg-btn">View Orders</button>
          </div>
          <div className="shg-dashboard-card">
            <h3>Profile</h3>
            <p>Update your SHG profile and contact info.</p>
            <button className="shg-btn">Edit Profile</button>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

export default SHGDashboard;
