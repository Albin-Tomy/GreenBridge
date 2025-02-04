import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
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
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    Tabs,
    Tab
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Header from '../../../components/Navbar';
import axios from 'axios';
import { format } from 'date-fns';

const NGODashboard = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchRequests();
    }, [filter, activeTab]);

    const fetchRequests = async () => {
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
                params: { status: filter !== 'all' ? filter : null }
            });
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
            const endpoint = activeTab === 0 ? 'food' : activeTab === 1 ? 'grocery' : 'book';
            await axios.put(
                `http://127.0.0.1:8000/api/v1/${endpoint}/request/${id}/update-status/`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            fetchRequests();
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
                return "Food Distribution Requests";
            case 1:
                return "Grocery Distribution Requests";
            case 2:
                return "Book Distribution Requests";
            default:
                return "Distribution Requests";
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

            <Box sx={{ 
                display: 'flex',
                pt: '84px', // Increased from 64px to 84px to add more space below navbar
                height: 'calc(100vh - 64px)',
                overflow: 'hidden'
            }}>
                <Drawer
                    variant="permanent"
                    sx={{
                        width: 240,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 240,
                            boxSizing: 'border-box',
                            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                            mt: '64px',
                            height: 'calc(100% - 64px)',
                            pt: 2 // Added padding top to the drawer content
                        },
                    }}
                >
                    <Box sx={{ width: 240 }}>
                        <Typography variant="h6" sx={{ p: 2 }}>Filter Status</Typography>
                        <Divider />
                        <List>
                            <ListItem 
                                button 
                                selected={filter === 'all'}
                                onClick={() => setFilter('all')}
                            >
                                <ListItemText primary="All Requests" />
                            </ListItem>
                            <ListItem 
                                button 
                                selected={filter === 'pending'}
                                onClick={() => setFilter('pending')}
                            >
                                <ListItemText primary="Pending" />
                            </ListItem>
                            <ListItem 
                                button 
                                selected={filter === 'approved'}
                                onClick={() => setFilter('approved')}
                            >
                                <ListItemText primary="Approved" />
                            </ListItem>
                            <ListItem 
                                button 
                                selected={filter === 'completed'}
                                onClick={() => setFilter('completed')}
                            >
                                <ListItemText primary="Completed" />
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 4, // Increased padding from 3 to 4
                        pt: 3, // Specific top padding
                        overflow: 'auto',
                        height: '100%',
                        width: { sm: `calc(100% - 240px)` }
                    }}
                >
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

                    <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
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
                                                    {getActionButtons(request)}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    )}
                </Box>
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
                    {selectedRequest && getActionButtons(selectedRequest)}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default NGODashboard; 