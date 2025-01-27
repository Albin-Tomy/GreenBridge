import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
// import './VolunteerDashboard.css';

const VolunteerDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="volunteer-dashboard">
            <Header />
            <div className="dashboard-container">
                <div className="sidebar">
                    <div className="sidebar-menu">
                        <button onClick={() => navigate('/volunteer/profile')}>
                            My Profile
                        </button>
                        <button onClick={() => navigate('/volunteer/notifications')}>
                            Service Requests
                        </button>
                        <button onClick={() => navigate('/volunteer/activities')}>
                            My Activities
                        </button>
                        <button onClick={() => navigate('/volunteer/settings')}>
                            Settings
                        </button>
                    </div>
                </div>
                <div className="main-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default VolunteerDashboard; 