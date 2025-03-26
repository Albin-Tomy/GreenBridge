import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';

const RequestsManagement = ({ type }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRequestTypeTitle = () => {
    switch(type) {
      case 'food-requests':
        return 'Food Requests';
      case 'school-supplies':
        return 'School Supplies Requests';
      case 'book-requests':
        return 'Book Donation Requests';
      case 'grocery-requests':
        return 'Grocery Requests';
      default:
        return 'Requests';
    }
  };

  const getEndpoint = () => {
    switch(type) {
      case 'food-requests':
        return 'food/all/';
      case 'school-supplies':
        return 'school-supplies/all/';
      case 'book-requests':
        return 'book/all/';
      case 'grocery-requests':
        return 'grocery/all/';
      default:
        return '';
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [type]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        `http://127.0.0.1:8000/api/v1/${getEndpoint()}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        `http://127.0.0.1:8000/api/v1/${getEndpoint()}${id}/update-status/`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchRequests();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {getRequestTypeTitle()}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Requester</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.user_email}</TableCell>
                <TableCell>
                  <Chip 
                    label={request.status}
                    color={
                      request.status === 'pending' ? 'warning' :
                      request.status === 'approved' ? 'success' :
                      request.status === 'completed' ? 'primary' : 'default'
                    }
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(request.created_at), 'dd/MM/yyyy HH:mm')}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleStatusUpdate(request.id, 'approved')}
                    disabled={request.status !== 'pending'}
                    sx={{ mr: 1 }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleStatusUpdate(request.id, 'rejected')}
                    disabled={request.status === 'completed'}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RequestsManagement; 