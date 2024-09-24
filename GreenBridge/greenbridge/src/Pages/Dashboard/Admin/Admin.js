import React from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  const goToPendingRequests = () => {
    navigate('/admin/pending-requests');  // Navigate to the pending requests page
  };

  const goToAllSHGs = () => {
    navigate('/admin/view-all-shgs');  // Navigate to the page showing all SHGs
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome, Admin</h1>
      <button style={styles.button} onClick={goToPendingRequests}>View Pending Requests</button>
      <button style={styles.button} onClick={goToAllSHGs}>View All SHGs</button>
    </div>
  );
};

const styles = {
  button: {
    margin: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default Admin;
