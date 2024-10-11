import React from 'react';
import './AdminDashboard.css'; // Importing the responsive CSS
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';

const AdminDashboard = () => {

    const navigate = useNavigate();

  const goToPendingRequests = () => {
    navigate('/admin/pending-requests');  // Navigate to the pending requests page
  };

  const goToAllSHGs = () => {
    navigate('/admin/view-all-shgs');  // Navigate to the page showing all SHGs
  };

  return (
    <div>
      <Header/>
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Dashboard</h2>
        </div>
        <table className="sidebar-menu">
          <tbody>
            <tr>
              <td>SHG Registrations</td>
            </tr>
            <tr>
              <td>Pending Requests</td>
            </tr>
            <tr>
              <td>Approved Requests</td>
            </tr>
            <tr>
              <td>Reports</td>
            </tr>
            <tr>
              <td>Settings</td>
            </tr>
          </tbody>
        </table>
      </aside>

      <div className="main-content">
        <header className="admin-header">
          <h1>Welcome, Admin</h1>
        </header>

        <section className="content-section">
          <div className="functionality">
            <h3>Approve SHG Registrations</h3>
            <button  onClick={goToAllSHGs}>View All SHGs</button>
          </div>

          <div className="functionality">
            <h3>Pending Requests</h3>
            <button onClick={goToPendingRequests}>View Pending Requests</button>
          </div>

          <div className="functionality">
            <h3>Reports</h3>
            <button>View Sales Reports</button>
            <button>View Performance Reports</button>
          </div>

          <div className="functionality">
            <h3>Settings</h3>
            <button>Manage Settings</button>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

export default AdminDashboard;
