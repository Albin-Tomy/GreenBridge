import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import './PendingRequest.css'; // Updated file name
import Header from '../../../components/Navbar';
import { IconButton } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

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

        const response = await axios.get('http://127.0.0.1:8000/api/shg/pending/', {
          headers: { Authorization: `Bearer ${token}` } // Pass token in headers
        });

        if (response.data) {
          console.log("Fetched Pending Requests:", response.data);  // Debugging line
          const requestsWithId = response.data.map((request, index) => ({
            ...request,
            id: request.email || index, // Ensure unique ID
          }));
          setPendingRequests(requestsWithId);  // Update state with pending requests
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

      const response = await axios.post('http://127.0.0.1:8000/api/shg/approve/', 
        { shg_email: email, action },
        { headers: { Authorization: `Bearer ${token}` } } // Pass token in headers
      );

      alert(response.data.message);
      setPendingRequests(pendingRequests.filter(request => request.email !== email)); // Remove from list
    } catch (error) {
      console.error('Error approving/rejecting SHG:', error);
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'registration_number', headerName: 'Registration Number', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleApproval(params.row.email, 'approve')}>
            <CheckIcon />
          </IconButton>
          <IconButton onClick={() => handleApproval(params.row.email, 'reject')}>
            <CancelIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header />
      <div className="pending-requests-page">
        <h1 className="pending-requests-title">Pending SHG Requests</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}  
        {pendingRequests.length === 0 ? (
          <p className="no-requests-message">No pending requests.</p>
        ) : (
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={pendingRequests}
              columns={columns}
              pageSize={5}
              autoHeight
              getRowId={(row) => row.id} // Unique row ID
              disableSelectionOnClick
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingRequestsPage;
