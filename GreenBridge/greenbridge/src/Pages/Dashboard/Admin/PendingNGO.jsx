import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import './PendingRequest.css';
import Header from '../../../components/Navbar';
import { IconButton } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import Sidebar from '../../../components/SideBar';

const PendingNGOPage = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    const token = localStorage.getItem('authToken');
    return token;
  };

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = getToken();
        if (!token) {
          setErrorMessage('Authentication required');
          window.location.href = '/login';
          return;
        }

        const config = {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const response = await axios.get(
          'http://127.0.0.1:8000/api/ngo/pending/',
          config
        );

        if (response.data) {
          console.log("Fetched Pending NGO Requests:", response.data);
          const requestsWithId = response.data.map((request) => ({
            ...request,
            id: request.id || request.email,
          }));
          setPendingRequests(requestsWithId);
        }
      } catch (error) {
        console.error('Error fetching pending NGO requests:', error);
        setErrorMessage(
          error.response?.data?.error || 
          'Failed to fetch pending NGO requests. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleApproval = async (email, action) => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage('Authentication required');
        return;
      }

      const config = {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.post(
        'http://127.0.0.1:8000/api/ngo/approve/',
        { ngo_email: email, action },
        config
      );

      alert(response.data.message);
      setPendingRequests(pendingRequests.filter(request => request.email !== email));
    } catch (error) {
      console.error('Error approving/rejecting NGO:', error);
      alert(error.response?.data?.error || 'Failed to process request');
    }
  };

  const columns = [
    { field: 'name', headerName: 'NGO Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'registration_number', headerName: 'Registration Number', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton 
            onClick={() => handleApproval(params.row.email, 'approve')}
            color="primary"
            title="Approve"
          >
            <CheckIcon />
          </IconButton>
          <IconButton 
            onClick={() => handleApproval(params.row.email, 'reject')}
            color="error"
            title="Reject"
          >
            <CancelIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div>
        <Header />
        <Sidebar />
        <div className="pending-requests-page">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Sidebar />
      <div className="pending-requests-page">
        <h1 className="pending-requests-title">Pending NGO Requests</h1>
        {errorMessage && (
          <p className="error-message" style={{ color: 'red' }}>
            {errorMessage}
          </p>
        )}
        {pendingRequests.length === 0 && !errorMessage ? (
          <p className="no-requests-message">No pending requests.</p>
        ) : (
          <div style={{ height: 400, width: '100%', padding: '20px' }}>
            <DataGrid
              rows={pendingRequests}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              autoHeight
              getRowId={(row) => row.id}
              disableSelectionOnClick
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingNGOPage; 