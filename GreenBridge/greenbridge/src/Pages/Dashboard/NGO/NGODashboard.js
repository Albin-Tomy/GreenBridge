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
    ListItemButton,
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
import AssignmentIcon from '@mui/icons-material/Assignment';
import Header from '../../../components/Navbar';
import axios from 'axios';
import { format } from 'date-fns';

const drawerWidth = 240;

const QualityReportDialog = ({ open, onClose, report }) => {
    if (!report) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Quality Report Details</DialogTitle>
            <DialogContent>
                <Box sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography><strong>Issue Type:</strong> {report.issue_type}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography><strong>Status:</strong> {report.status}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography><strong>Description:</strong> {report.description}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography><strong>Temperature:</strong> {report.temperature}°C</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Quality Checks</Typography>
                            <Grid container spacing={1}>
                                {[
                                    { label: 'Packaging Integrity', value: report.packaging_integrity },
                                    { label: 'Labeling Accuracy', value: report.labeling_accuracy },
                                    { label: 'Allergen Check', value: report.allergen_check },
                                    { label: 'Hygiene Check', value: report.hygiene_check },
                                    { label: 'Visual Inspection', value: report.visual_inspection },
                                    { label: 'Smell Test', value: report.smell_test },
                                    { label: 'Expiration Check', value: report.expiration_check },
                                ].map((check, index) => (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Chip
                                                size="small"
                                                color={check.value ? "success" : "error"}
                                                label={check.label}
                                                sx={{ mr: 1 }}
                                            />
                                            {check.value ? "Pass" : "Fail"}
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                        {report.storage_condition && (
                            <Grid item xs={12}>
                                <Typography><strong>Storage Condition:</strong> {report.storage_condition}</Typography>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

const NGODashboard = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [filter, setFilter] = useState('all');
    const [qualityReport, setQualityReport] = useState(null);
    const [showQualityReport, setShowQualityReport] = useState(false);

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

    const fetchQualityReport = async (requestId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(
                `http://127.0.0.1:8000/api/v1/food/request/${requestId}/quality-report/view/`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setQualityReport(response.data);
            setShowQualityReport(true);
        } catch (error) {
            console.error('Error fetching quality report:', error);
            alert('No quality report found for this request');
        }
    };

    const statusActions = {
        pending: [
            { label: 'Approve', action: 'approved', color: 'primary' },
            { label: 'Cancel', action: 'cancelled', color: 'error' }
        ],
        approved: [
            { label: 'Cancel', action: 'cancelled', color: 'error' }
        ],
        collected: [
            { label: 'Mark Distributed', action: 'distributed', color: 'success' }
        ],
        quality_issue: [
            { label: 'Review Complete', action: 'approved', color: 'primary' },
            { label: 'Cancel Request', action: 'cancelled', color: 'error' }
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
        const isFoodRequest = activeTab === 0;
        
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',  // Stack buttons vertically
                gap: 1,
                mt: 2  // Add margin top for spacing
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    width: '100%'  // Full width for first row
                }}>
                    <Button
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => {
                            setSelectedRequest(request);
                            setOpenDialog(true);
                        }}
                        size="small"
                        fullWidth  // Make button take full width
                    >
                        View Details
                    </Button>
                    {isFoodRequest && (request.status === 'collected' || request.status === 'quality_issue') && (
                        <Button
                            variant="outlined"
                            startIcon={<AssignmentIcon />}
                            onClick={() => fetchQualityReport(request.id)}
                            size="small"
                            fullWidth
                        >
                            View Quality Report
                        </Button>
                    )}
                </Box>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    gap: 1,
                    width: '100%'
                }}>
                    {actions?.map((action, index) => (
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
            <Box sx={{ 
                position: 'fixed',
                width: '100%',
                top: 0,
                zIndex: (theme) => theme.zIndex.drawer + 1
            }}>
                <Header />
            </Box>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        mt: '64px',  // Match header height
                        pt: 0,  // Remove top padding
                        backgroundColor: (theme) => theme.palette.background.default,
                        borderRight: '1px solid',
                        borderColor: 'divider'
                    },
                }}
            >
                <Box sx={{ px: 2, py: 2 }}>  <br></br>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Filter by Status
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                        {filterButtons.map((btn) => (
                            <ListItem 
                                key={btn.value}
                                disablePadding
                                sx={{ mb: 1 }}
                            >
                                <ListItemButton
                                    selected={filter === btn.value}
                                    onClick={() => setFilter(btn.value)}
                                    sx={{
                                        borderRadius: 1,
                                        '&.Mui-selected': {
                                            backgroundColor: (theme) => theme.palette.primary.light,
                                            color: (theme) => theme.palette.primary.contrastText,
                                        },
                                        '&:hover': {
                                            backgroundColor: (theme) => theme.palette.primary.lighter,
                                        }
                                    }}
                                >
                                    <ListItemText 
                                        primary={btn.label}
                                        primaryTypographyProps={{
                                            color: filter === btn.value ? 'inherit' : 'textPrimary'
                                        }}
                                    />
                                    <Chip 
                                        size="small"
                                        label={requests.filter(r => 
                                            btn.value === 'all' ? true : r.status === btn.value
                                        ).length}
                                        color={filter === btn.value ? 'primary' : 'default'}
                                        sx={{ ml: 1 }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <Box sx={{ 
                display: 'flex',
                pt: '84px',
                height: 'calc(100vh - 64px)',
                overflow: 'hidden',
                ml: `${drawerWidth}px`
            }}>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 4,
                        overflow: 'auto',
                        height: '100%',
                        width: '100%'
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

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h4" gutterBottom>
                            {getRequestTypeTitle()}
                        </Typography>
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
                                        <Card>
                                            <CardContent sx={{ pb: 1 }}>  
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography variant="h6">
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
                                            </CardContent>
                                            
                                            <Box sx={{ px: 2, pb: 2 }}>  
                                                {getActionButtons(request)}
                                            </Box>
                                        </Card>
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    )}
                </Box>
            </Box>

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
                    {selectedRequest && activeTab === 0 && // Only show for food requests
                     (selectedRequest.status === 'collected' || selectedRequest.status === 'quality_issue') && (
                        <Button
                            variant="outlined"
                            startIcon={<AssignmentIcon />}
                            onClick={() => fetchQualityReport(selectedRequest.id)}
                        >
                            View Quality Report
                        </Button>
                    )}
                    {selectedRequest && getActionButtons(selectedRequest)}
                </DialogActions>
            </Dialog>

            {activeTab === 0 && (
                <QualityReportDialog
                    open={showQualityReport}
                    onClose={() => setShowQualityReport(false)}
                    report={qualityReport}
                />
            )}
        </Box>
    );
};

export default NGODashboard; 