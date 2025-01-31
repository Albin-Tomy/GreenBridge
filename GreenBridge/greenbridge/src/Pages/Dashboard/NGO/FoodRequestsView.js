import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    IconButton,
    Chip,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Card,
    CardContent,
    Grid,
    CircularProgress
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Header from '../../../components/Navbar';
import axios from 'axios';
import { format } from 'date-fns';
import './FoodRequestsView.css';

const FoodRequestsView = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchFoodRequests();
    }, [filter]);

    const fetchFoodRequests = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://127.0.0.1:8000/api/v1/food/all/', {
                headers: { Authorization: `Bearer ${token}` },
                params: { status: filter !== 'all' ? filter : null }
            });
            setRequests(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching food requests:', error);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(
                `http://127.0.0.1:8000/api/v1/food/request/${id}/update-status/`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            fetchFoodRequests();
            setOpenDialog(false);
        } catch (error) {
            console.error('Error updating request status:', error);
        }
    };

    const statusActions = {
        pending: [
            { label: 'Approve', action: 'approved', color: 'primary' },
            { label: 'Cancel', action: 'cancelled', color: 'error' }
        ],
        approved: [
            { label: 'Mark Collected', action: 'collected', color: 'success' },
            { label: 'Cancel', action: 'cancelled', color: 'error' }
        ],
        collected: [
            { label: 'Mark Distributed', action: 'distributed', color: 'success' }
        ]
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            pending: { color: 'warning', label: 'PENDING' },
            approved: { color: 'success', label: 'APPROVED' },
            collected: { color: 'info', label: 'COLLECTED' },
            distributed: { color: 'primary', label: 'DISTRIBUTED' },
            cancelled: { color: 'error', label: 'CANCELLED' }
        };

        const config = statusConfig[status.toLowerCase()] || { color: 'default', label: status.toUpperCase() };
        return <Chip label={config.label} color={config.color} size="small" />;
    };

    const getActionButtons = (request) => {
        const actions = statusActions[request.status];
        if (!actions) return null;

        return (
            <Box sx={{ display: 'flex', gap: 1 }}>
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        variant={action.color === 'error' ? 'outlined' : 'contained'}
                        color={action.color}
                        onClick={() => handleStatusUpdate(request.id, action.action)}
                        size="small"
                    >
                        {action.label}
                    </Button>
                ))}
            </Box>
        );
    };

    const filterButtons = [
        { value: 'all', label: 'All' },
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'collected', label: 'Collected' },
        { value: 'distributed', label: 'Distributed' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Container maxWidth="xl" sx={{ mt: 12, mb: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5">
                            Food Redistribution Requests
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {filterButtons.map((btn) => (
                                <Button
                                    key={btn.value}
                                    onClick={() => setFilter(btn.value)}
                                    variant={filter === btn.value ? 'contained' : 'outlined'}
                                    size="small"
                                >
                                    {btn.label}
                                </Button>
                            ))}
                        </Box>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {requests.length === 0 ? (
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography>No requests found</Typography>
                                    </Paper>
                                </Grid>
                            ) : (
                                requests.map((request) => (
                                    <Grid item xs={12} sm={6} md={4} key={request.id}>
                                        <Card className="request-card">
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
                                                    {getActionButtons(request)}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    )}
                </Paper>
            </Container>

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
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FoodRequestsView; 