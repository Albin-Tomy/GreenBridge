import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import './DashboardLayout.css'; // Add CSS for styling the layout
import Header from '../../../components/Header';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current route

  const handleNavigation = (path) => {
    navigate(path); // Programmatically navigate to the desired path
  };

  return (
    <div className="dashboard">
      <Header /> {/* Header component */}

      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <table className="sidebar-menu">
            <tbody>
              <tr>
                <td>
                  <button
                    onClick={() => handleNavigation('/dashboard/profile')}
                    className={location.pathname === '/dashboard/profile' ? 'sidebar-button active' : 'sidebar-button'}
                  >
                    User Profile
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <button
                    onClick={() => handleNavigation('/dashboard/settings')}
                    className={location.pathname === '/dashboard/settings' ? 'sidebar-button active' : 'sidebar-button'}
                  >
                    Settings
                  </button>
                </td>
              </tr>
              {/* Add more buttons as needed */}
            </tbody>
          </table>
        </aside>

        <main className="dashboard-main">
          <Outlet /> {/* Renders child routes */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
