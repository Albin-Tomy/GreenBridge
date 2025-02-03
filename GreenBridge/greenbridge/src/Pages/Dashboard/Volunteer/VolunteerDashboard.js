import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Grid,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Card,
    CardContent,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Header from '../../../components/Navbar';
import axios from 'axios';
import { format } from 'date-fns';

const VolunteerDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetchApprovedRequests();
    }, []);

    const fetchApprovedRequests = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://127.0.0.1:8000/api/v1/food/all/', {
                headers: { Authorization: `Bearer ${token}` },
                params: { status: 'approved' }
            });
            setRequests(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching food requests:', error);
            setLoading(false);
        }
    };

    const handleMarkAsCollected = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(
                `http://127.0.0.1:8000/api/v1/food/request/${id}/update-status/`,
                { status: 'collected' },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            fetchApprovedRequests();
            setOpenDialog(false);
        } catch (error) {
            console.error('Error updating request status:', error);
        }
    };

    const getStatusChip = (status) => {
        return <Chip label="APPROVED" color="success" size="small" />;
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box sx={{ 
                position: 'fixed',
                width: '100%',
                top: 0,
                zIndex: (theme) => theme.zIndex.drawer + 1
            }}>
                <Header />
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 4,
                    pt: '120px',
                    overflow: 'auto',
                    height: '100%',
                    width: '100%',
                    maxWidth: '1500px',
                    margin: '0 auto',
                    px: { xs: 2, sm: 4, md: 6 }
                }}
            >
                <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ 
                        mb: 4,
                        fontWeight: 'bold',
                        color: (theme) => theme.palette.primary.main 
                    }}
                >
                    Available Food Pickup Requests
                </Typography>
                
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {requests.length === 0 ? (
                            <Grid item xs={12}>
                                <Paper sx={{ p: 3, textAlign: 'center' }}>
                                    <Typography>No approved requests available</Typography>
                                </Paper>
                            </Grid>
                        ) : (
                            requests.map((request) => (
                                <Grid item xs={12} sm={6} md={4} key={request.id}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Typography variant="h6" component="div">
                                                    Request #{request.id}
                                                </Typography>
                                                {getStatusChip(request.status)}
                                            </Box>
                                            
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <RestaurantIcon sx={{ mr: 1 }} />
                                                <Typography>
                                                    {request.food_type.charAt(0).toUpperCase() + request.food_type.slice(1)} - {request.quantity} kg/L
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <LocationOnIcon sx={{ mr: 1 }} />
                                                <Typography noWrap>
                                                    {request.pickup_address}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <AccessTimeIcon sx={{ mr: 1 }} />
                                                <Typography>
                                                    Best Before: {format(new Date(request.expiry_time), 'dd/MM/yyyy HH:mm')}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<VisibilityIcon />}
                                                    onClick={() => {
                                                        setSelectedRequest(request);
                                                        setOpenDialog(true);
                                                    }}
                                                    size="small"
                                                >
                                                    View Details
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => handleMarkAsCollected(request.id)}
                                                    size="small"
                                                >
                                                    Mark as Collected
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        )}
                    </Grid>
                )}
            </Box>

            {/* Details Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Request Details</DialogTitle>
                <DialogContent>
                    {selectedRequest && (
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Request #{selectedRequest.id}
                            </Typography>
                            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                <Typography><strong>Donor:</strong> {selectedRequest.user.name || selectedRequest.user.email}</Typography>
                                <Typography><strong>Status:</strong> {getStatusChip(selectedRequest.status)}</Typography>
                                <Typography><strong>Food Type:</strong> {selectedRequest.food_type}</Typography>
                                <Typography><strong>Quantity:</strong> {selectedRequest.quantity} kg/L</Typography>
                                <Typography><strong>Best Before:</strong> {format(new Date(selectedRequest.expiry_time), 'dd/MM/yyyy HH:mm')}</Typography>
                                <Typography><strong>Contact:</strong> {selectedRequest.contact_number}</Typography>
                                <Typography sx={{ gridColumn: 'span 2' }}><strong>Pickup Address:</strong> {selectedRequest.pickup_address}</Typography>
                                {selectedRequest.additional_notes && (
                                    <Typography sx={{ gridColumn: 'span 2' }}><strong>Additional Notes:</strong> {selectedRequest.additional_notes}</Typography>
                                )}
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                    {selectedRequest && (
                        <Button 
                            variant="contained" 
                            color="success"
                            onClick={() => handleMarkAsCollected(selectedRequest.id)}
                        >
                            Mark as Collected
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VolunteerDashboard; 