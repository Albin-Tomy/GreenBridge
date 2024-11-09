import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PendingRequest.css'; // Updated file name
import Header from '../../../components/Navbar';

const PendingRequestsPage = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Function to fetch token from localStorage
  const getToken = () => {
    const token = localStorage.getItem('authToken'); 
    console.log("Retrieved Token:", token);  // Debugging line
    return token;
  };

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = getToken();  // Get the auth token
        if (!token) {
          console.error('No token found. Redirecting to login.');
          window.location.href = '/login';  // Redirect to login if no token found
          return;
        }

        const response = await axios.get('https://green-bridge.onrender.com/api/shg/pending/');

        if (response.data) {
          console.log("Fetched Pending Requests:", response.data);  // Debugging line
          setPendingRequests(response.data);  // Update state with pending requests
        }
      } catch (error) {
        console.error('Error fetching pending requests:', error);
        setErrorMessage('Failed to fetch pending requests.');  // Display error message
      }
    };

    fetchPendingRequests();
  }, []);

  const handleApproval = async (email, action) => {
    try {
      const token = getToken();  // Get the auth token

      if (!token) {
        console.error('No token found. Cannot approve/reject request.');
        return;
      }

      const response = await axios.post('https://green-bridge.onrender.com/api/shg/approve/', 
        { shg_email: email, action }
      );

      alert(response.data.message);
      setPendingRequests(pendingRequests.filter(request => request.email !== email)); // Remove from list
    } catch (error) {
      console.error('Error approving/rejecting SHG:', error);
    }
  };

  return (
    <div>
      < Header/>
    <div className="pending-requests-page">
      <h1 className="pending-requests-title">Pending SHG Requests</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}  
      {pendingRequests.length === 0 ? (
        <p className="no-requests-message">No pending requests.</p>
      ) : (
        <table className="pending-requests-table">
          <thead>
            <tr className="table-header">
              <th>Name</th>
              <th>Email</th>
              <th>Registration Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map(request => (
              <tr key={request.id} className="table-row">
                <td>{request.name}</td>
                <td>{request.email}</td>
                <td>{request.registration_number}</td>
                <td>
                  <button 
                    className="action-button approve-button"
                    onClick={() => handleApproval(request.email, 'approve')}>
                    Approve
                  </button>
                  <button 
                    className="action-button reject-button"
                    onClick={() => handleApproval(request.email, 'reject')}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
};

export default PendingRequestsPage;
