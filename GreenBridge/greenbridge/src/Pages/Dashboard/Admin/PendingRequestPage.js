import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PendingRequest.css';

const PendingRequestsPage = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Function to fetch token from localStorage
  const getToken = () => {
    const token = localStorage.getItem('authToken'); // Ensure this matches the login component
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

        const response = await axios.get('http://localhost:8000/api/shg/pending/', {
          headers: {
            Authorization: `Bearer ${token}`  // Include the token in the request headers
          }
        });

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

  const handleApproval = async (id, action) => {
    try {
      const token = getToken();  // Get the auth token

      if (!token) {
        console.error('No token found. Cannot approve/reject request.');
        return;
      }

      const response = await axios.post('http://localhost:8000/api/shg/approve/', 
        { shg_id: id, action },
        {
          headers: {
            Authorization: `Bearer ${token}`  // Include the token in the request headers
          }
        }
      );

      alert(response.data.message);
      setPendingRequests(pendingRequests.filter(request => request.id !== id)); // Remove from list
    } catch (error) {
      console.error('Error approving/rejecting SHG:', error);
    }
  };

  return (
    <div>
      <h1>Pending SHG Requests</h1>
      {errorMessage && <p>{errorMessage}</p>}  {/* Display error message if exists */}
      {pendingRequests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Registration Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map(request => (
              <tr key={request.id}>
                <td>{request.name}</td>
                <td>{request.email}</td>
                <td>{request.registration_number}</td>
                <td>
                  <button onClick={() => handleApproval(request.id, 'approve')}>Approve</button>
                  <button onClick={() => handleApproval(request.id, 'reject')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingRequestsPage;
