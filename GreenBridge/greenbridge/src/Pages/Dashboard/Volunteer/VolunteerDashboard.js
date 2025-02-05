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
    Tabs,
    Tab
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Header from '../../../components/Header';
import axios from 'axios';
import { format } from 'date-fns';
import VolunteerPoints from './VolunteerPoints';

const VolunteerDashboard = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetchApprovedRequests();
    }, [activeTab]);

    const fetchApprovedRequests = async () => {
        try {
            const token = localStorage.getItem('authToken');
            let endpoint;
            switch(activeTab) {
                case 0:
                    endpoint = 'food';
                    break;
                case 1:
                    endpoint = 'grocery';
                    break;
                case 2:
                    endpoint = 'book';
                    break;
                default:
                    endpoint = 'food';
            }
            
            const response = await axios.get(`http://127.0.0.1:8000/api/v1/${endpoint}/all/`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { status: 'approved' }
            });
            setRequests(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching requests:', error);
            setLoading(false);
        }
    };

    const handleMarkAsCollected = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            const endpoint = activeTab === 0 ? 'food' : activeTab === 1 ? 'grocery' : 'book';
            
            const url = `http://127.0.0.1:8000/api/v1/${endpoint}/request/${id}/update-status/`;
            const data = { status: 'collected' };
            
            console.log('Making request to:', url);
            console.log('With data:', data);
            
            const response = await axios.put(url, data, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Response:', response.data);
            fetchApprovedRequests();
            setOpenDialog(false);
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            alert('Error updating request status. Please try again.');
        }
    };

    const getStatusChip = () => {
        return <Chip label="APPROVED" color="success" size="small" />;
    };

    const renderRequestDetails = (request) => {
        if (!request) return null;

        switch(activeTab) {
            case 0: // Food
                return request.food_type ? (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <RestaurantIcon sx={{ mr: 1 }} />
                            <Typography>
                                {request.food_type.charAt(0).toUpperCase() + request.food_type.slice(1)} - {request.quantity} kg/L
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <AccessTimeIcon sx={{ mr: 1 }} />
                            <Typography>
                                Best Before: {format(new Date(request.expiry_time), 'dd/MM/yyyy HH:mm')}
                            </Typography>
                        </Box>
                    </>
                ) : null;

            case 1: // Grocery
                return request.grocery_type ? (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <ShoppingBasketIcon sx={{ mr: 1 }} />
                            <Typography>
                                {request.grocery_type.charAt(0).toUpperCase() + request.grocery_type.slice(1)} - {request.quantity} kg
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <AccessTimeIcon sx={{ mr: 1 }} />
                            <Typography>
                                Expiry Date: {format(new Date(request.expiry_date), 'dd/MM/yyyy')}
                            </Typography>
                        </Box>
                    </>
                ) : null;

            case 2: // Book
                return request.book_type ? (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <MenuBookIcon sx={{ mr: 1 }} />
                            <Typography>
                                {request.book_type.charAt(0).toUpperCase() + request.book_type.slice(1)} - {request.quantity} books
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography>
                                Subject: {request.subject} ({request.education_level})
                            </Typography>
                        </Box>
                    </>
                ) : null;

            default:
                return null;
        }
    };

    const getRequestTypeTitle = () => {
        switch(activeTab) {
            case 0:
                return "Food Pickup Requests";
            case 1:
                return "Grocery Pickup Requests";
            case 2:
                return "Book Pickup Requests";
            default:
                return "Pickup Requests";
        }
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
                <Box sx={{ mb: 4 }}>
                    <VolunteerPoints />
                </Box>

                <Tabs 
                    value={activeTab} 
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{ mb: 3 }}
                >
                    <Tab 
                        icon={<RestaurantIcon />} 
                        label="Food Requests" 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<ShoppingBasketIcon />} 
                        label="Grocery Requests" 
                        iconPosition="start"
                    />
                    <Tab 
                        icon={<MenuBookIcon />} 
                        label="Book Requests" 
                        iconPosition="start"
                    />
                </Tabs>

                <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ 
                        mb: 4,
                        fontWeight: 'bold',
                        color: (theme) => theme.palette.primary.main 
                    }}
                >
                    {getRequestTypeTitle()}
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
                                                <Typography variant="h6">
                                                    Request #{request.id}
                                                </Typography>
                                                {getStatusChip()}
                                            </Box>
                                            
                                            {renderRequestDetails(request)}

                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <LocationOnIcon sx={{ mr: 1 }} />
                                                <Typography noWrap>
                                                    {request.pickup_address}
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
                                <Typography><strong>Status:</strong> {getStatusChip()}</Typography>
                                {renderRequestDetails(selectedRequest)}
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
                    <Button 
                        variant="contained" 
                        color="success"
                        onClick={() => handleMarkAsCollected(selectedRequest.id)}
                    >
                        Mark as Collected
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VolunteerDashboard; 