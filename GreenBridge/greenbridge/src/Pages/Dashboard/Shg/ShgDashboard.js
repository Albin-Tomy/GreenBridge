import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using React Router for navigation
import './ShgDashboard.css'; // Importing the responsive CSS

const ShgDashboard = () => {
  return (
    <div className="shg-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>SHG Dashboard</h2>
        </div>
        <ul className="sidebar-menu">
          <li><Link to="/add-product">Add Product</Link></li>
          <li><Link to="/update-product">Update Product</Link></li>
          <li><Link to="/delete-product">Delete Product</Link></li>
          <li><Link to="/update-stock">Update Stock</Link></li>
          <li><Link to="/update-profile">Update Profile</Link></li>
        </ul>
      </aside>

      <div className="main-content">
        <header className="shg-header">
          <h1>Welcome to Your Dashboard</h1>
        </header>

        <section className="content-section">
          <p>Select an option from the sidebar to manage your products or update your profile.</p>
        </section>
      </div>
    </div>
  );
};

export default ShgDashboard;
