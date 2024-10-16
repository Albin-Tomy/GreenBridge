import React from 'react';
import './AdminDashboard.css'; // Importing the responsive CSS
import Header from '../../../components/Navbar';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const goToPendingRequests = () => {
    navigate('/admin/pending-requests'); // Navigate to the pending requests page
  };

  const goToAllSHGs = () => {
    navigate('/admin/view-all-shgs'); // Navigate to the page showing all SHGs
  };

  const goToProducts = () => {
    navigate('/admin/admin'); // Navigate to the products page
  };
 // Use the hook to programmatically navigate
  const location = useLocation(); // Get current location

  const handleNavigation = (path) => {
    navigate(path); // Programmatically navigate to the desired path
  };

  return (
    <div className="admin-dashboard-page">
      <Header />
      <div className="admin-dashboard">
        {/* <aside className="admin-sidebar">
          <table className="admin-sidebar-menu">
            <tbody>
              <tr className="admin-sidebar-item">
                <td>SHG Registrations</td>
              </tr>
              <tr className="admin-sidebar-item">
                <td>Pending Requests</td>
              </tr>
              <tr className="admin-sidebar-item">
                <td>Approved Requests</td>
              </tr>
              <tr className="admin-sidebar-item">
                <td>Reports</td>
              </tr>
              <tr className="admin-sidebar-item">
                <td>Settings</td>
              </tr>
            </tbody>
          </table>
        </aside> */}
        <aside className="admin-sidebar">
          <table className="admin-sidebar-menu">
            <tbody>
              <tr
                onClick={() => handleNavigation('admin/view-all-shgs')}
                className={location.pathname === 'admin/view-all-shgs' ? 'active' : ''}
              >
                <td>SHG Registrations</td>
              </tr>
              <tr
                onClick={() => handleNavigation('/dashboard/pending-requests')}
                className={location.pathname === '/dashboard/pending-requests' ? 'active' : ''}
              >
                <td>Pending Requests</td>
              </tr>
              <tr
                onClick={() => handleNavigation('/dashboard/approved-requests')}
                className={location.pathname === '/dashboard/approved-requests' ? 'active' : ''}
              >
                <td>Approved Requests</td>
              </tr>
              <tr
                onClick={() => handleNavigation('/admin/admin')}
                className={location.pathname === '/admin/admin' ? 'active' : ''}
              >
                <td>Products</td>
              </tr>
              <button
                onClick={() => handleNavigation('/dashboard/settings')}
                className={location.pathname === '/dashboard/settings' ? 'active' : ''}
              >
                <td>Settings</td>
                </button>
            </tbody>
          </table>
        </aside>

        <div className="admin-main-content">

          <main className="dashboard-mains">
          <Outlet /> {/* This will render the child routes */}
        </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
