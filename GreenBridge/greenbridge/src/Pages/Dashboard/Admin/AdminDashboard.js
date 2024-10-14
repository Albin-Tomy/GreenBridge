import React from 'react';
import './AdminDashboard.css'; // Importing the responsive CSS
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Navbar';

const AdminDashboard = () => {

    const navigate = useNavigate();

  const goToPendingRequests = () => {
    navigate('/admin/pending-requests');  // Navigate to the pending requests page
  };

  const goToAllSHGs = () => {
    navigate('/admin/view-all-shgs');  // Navigate to the page showing all SHGs
  };
  const goToProducts = () => {
    navigate('/admin/admin');  // Navigate to the pending requests page
  };

  return (
    <div>
      <Header/>
      <div className="sidebar-header">
          <h2>Admin Dashboard</h2>
        </div>
    <div className="admin-dashboard">
      <aside className="sidebar">
        
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


        <section className="content-section">
          <div className="functionality">
            <h3>SHG Registrations</h3>
            <button  onClick={goToAllSHGs}>View All SHGs</button>
          </div>

          <div className="functionality">
            <h3>Pending Requests</h3>
            <button onClick={goToPendingRequests}>View Pending Requests</button>
          </div>

          <div className="functionality">
            <h3>Products</h3>

            <button  onClick={goToProducts}>View ProductsPage</button>
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
