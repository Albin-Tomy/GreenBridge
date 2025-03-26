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

const NGOManagement = ({ type }) => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNGOs();
  }, [type]);

  const fetchNGOs = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const endpoint = type === 'pending-ngos' ? 'pending' : 'all';
      const response = await axios.get(
        `https://greenbridgeserver.onrender.com/api/ngo/${endpoint}/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNgos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching NGOs:', error);
      setLoading(false);
    }
  };

  const handleNGOAction = async (id, action) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        'https://greenbridgeserver.onrender.com/api/ngo/approve/',
        { ngo_id: id, action },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchNGOs();
    } catch (error) {
      console.error('Error handling NGO action:', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {type === 'pending-ngos' ? 'Pending NGO Applications' : 'Approved NGOs'}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Registration Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ngos.map((ngo) => (
              <TableRow key={ngo.id}>
                <TableCell>{ngo.name}</TableCell>
                <TableCell>{ngo.email}</TableCell>
                <TableCell>{ngo.registration_number}</TableCell>
                <TableCell>
                  <Chip 
                    label={ngo.status}
                    color={ngo.status === 'approved' ? 'success' : 'warning'}
                  />
                </TableCell>
                <TableCell>
                  {type === 'pending-ngos' ? (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleNGOAction(ngo.id, 'approve')}
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleNGOAction(ngo.id, 'reject')}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleNGOAction(ngo.id, 'deactivate')}
                    >
                      Deactivate
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default NGOManagement; 