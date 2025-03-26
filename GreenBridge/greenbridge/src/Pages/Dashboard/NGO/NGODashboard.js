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
import SchoolIcon from '@mui/icons-material/School';
import MoneyIcon from '@mui/icons-material/Money';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Header from '../../../components/Navbar';
import axios from 'axios';
import { format } from 'date-fns';
import NGODistributionDetails from '../../Distribution/NGODistributionDetails';
import NGOMoneyRequestForm from '../../NGO/NGOMoneyRequestForm';
import NGOMoneyRequestList from '../../NGO/NGOMoneyRequestList';
import NGOProfile from './NGOProfile';
import DistributionPlan from '../../Distribution/DistributionPlan';
import GroceryDistributionPlan from '../../Distribution/GroceryDistributionPlan';
import BookDistributionPlan from '../../Distribution/BookDistributionPlan';
import SchoolSuppliesDistributionPlan from '../../Distribution/SchoolSuppliesDistributionPlan';

const drawerWidth = 240;

const QualityReportDialog = ({ open, onClose, report }) => {
    if (!report) return null;

    // Format issue type for display
    const formatIssueType = (type) => {
        if (!type) return 'Unknown';
        // Convert snake_case to Title Case
        return type.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Determine status color
    const getStatusColor = (status) => {
        switch(status) {
            case 'good':
                return 'success';
            case 'expired':
            case 'contaminated':
            case 'spoiled':
                return 'error';
            case 'temperature_issue':
            case 'packaging_damaged':
                return 'warning';
            default:
                return 'default';
        }
    };

    // Determine if cancellation was due to quality issue
    const isCancellationDueToQuality = report.issue_type === 'contaminated' || 
                                       report.issue_type === 'expired' || 
                                       report.issue_type === 'spoiled';

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Food Quality Report
                {report.request_id && <Typography variant="subtitle2" color="text.secondary">
                    for Request #{report.request_id}
                </Typography>}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ p: 2 }}>
                    {/* Display a warning banner if the report led to cancellation */}
                    {isCancellationDueToQuality && (
                        <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
                            <Typography variant="subtitle1">
                                This request was cancelled due to quality issues
                            </Typography>
                        </Paper>
                    )}
                    
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography><strong>Issue Type:</strong> <Chip 
                                label={formatIssueType(report.issue_type)} 
                                color={getStatusColor(report.issue_type)}
                                size="small"
                                sx={{ ml: 1 }}
                            /></Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography><strong>Reported On:</strong> {new Date(report.created_at).toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography><strong>Description:</strong></Typography>
                            <Paper sx={{ p: 2, bgcolor: 'background.default', mt: 1 }}>
                                <Typography variant="body2">{report.description || 'No description provided'}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography><strong>Temperature:</strong> {report.temperature ? `${report.temperature}°C` : 'Not measured'}</Typography>
                        </Grid>
                        {report.weight_check && (
                            <Grid item xs={12} sm={6}>
                                <Typography><strong>Weight Check:</strong> {report.weight_check} kg</Typography>
                            </Grid>
                        )}
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
    const [showDistributionDetails, setShowDistributionDetails] = useState(false);
    const [selectedDistribution, setSelectedDistribution] = useState(null);
    const [error, setError] = useState(null);
    const [showMoneyRequestForm, setShowMoneyRequestForm] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showDistributionForm, setShowDistributionForm] = useState(false);
    const [showGroceryDistributionForm, setShowGroceryDistributionForm] = useState(false);
    const [showBookDistributionPlan, setShowBookDistributionPlan] = useState(false);
    const [showSchoolSuppliesDistributionPlan, setShowSchoolSuppliesDistributionPlan] = useState(false);
    const [selectedForDistribution, setSelectedForDistribution] = useState(null);

    useEffect(() => {
        if (activeTab !== 4) {
            fetchRequests();
        }
    }, [filter, activeTab]);

    const checkAndHandleExpiredRequests = (requests, activeTab) => {
        const currentDate = new Date();
        return requests.map(request => {
            // Handle food requests
            if (activeTab === 0 && request.expiry_time) {
                const expiryDate = new Date(request.expiry_time);
                if (currentDate > expiryDate && request.status !== 'cancelled' && request.status !== 'distributed') {
                    handleExpiredRequest(request.id, 'food');
                    return { ...request, status: 'cancelled' };
                }
            }
            // Handle grocery requests
            else if (activeTab === 1 && request.expiry_date) {
                const expiryDate = new Date(request.expiry_date);
                if (currentDate > expiryDate && request.status !== 'cancelled' && request.status !== 'distributed') {
                    handleExpiredRequest(request.id, 'grocery');
                    return { ...request, status: 'cancelled' };
                }
            }
            return request;
        });
    };

    const handleExpiredRequest = async (requestId, type) => {
        try {
            const token = localStorage.getItem('authToken');
            const endpoint = type === 'food' ? 'food' : 'grocery';
            
            await axios.put(
                `https://greenbridgeserver.onrender.com/api/v1/${endpoint}/request/${requestId}/update-status/`,
                { status: 'cancelled' },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
        } catch (error) {
            console.error(`Error updating expired ${type} request:`, error);
        }
    };

    const fetchRequests = async () => {
        if (activeTab === 4) return;
        
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
                case 3:
                    endpoint = 'school-supplies';
                    break;
                default:
                    endpoint = 'food';
            }
            
            const response = await axios.get(`https://greenbridgeserver.onrender.com/api/v1/${endpoint}/all/`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { status: filter !== 'all' ? filter : null }
            });

            // Check for expired requests if food or grocery tab is active
            if (activeTab === 0 || activeTab === 1) {
                const updatedRequests = checkAndHandleExpiredRequests(response.data, activeTab);
                setRequests(updatedRequests);
            } else {
                setRequests(response.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching requests:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkExpiryInterval = setInterval(() => {
            if ((activeTab === 0 || activeTab === 1) && requests.length > 0) {
                const updatedRequests = checkAndHandleExpiredRequests(requests, activeTab);
                if (JSON.stringify(updatedRequests) !== JSON.stringify(requests)) {
                    setRequests(updatedRequests);
                }
            }
        }, 60000); // Check every minute

        return () => clearInterval(checkExpiryInterval);
    }, [activeTab, requests]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('authToken');
            const endpoint = activeTab === 0 ? 'food' : activeTab === 1 ? 'grocery' : activeTab === 2 ? 'book' : 'school-supplies';
            await axios.put(
                `https://greenbridgeserver.onrender.com/api/v1/${endpoint}/request/${id}/update-status/`,
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
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.get(
                `https://greenbridgeserver.onrender.com/api/v1/food/request/${requestId}/quality-report/view/`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            if (response.data) {
                setQualityReport(response.data);
                setShowQualityReport(true);
            } else {
                setError('No quality report found for this request');
            }
        } catch (error) {
            console.error('Error fetching quality report:', error);
            if (error.response?.status === 404) {
                setError('No quality report available for this request');
            } else {
                setError(error.response?.data?.message || 'Failed to fetch quality report');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchDistributionDetails = async (requestId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(
                `https://greenbridgeserver.onrender.com/api/v1/food/request/${requestId}/distribution/completed/`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            if (response.data) {
                setSelectedDistribution(response.data);
                setShowDistributionDetails(true);
            }
        } catch (error) {
            console.error('Error fetching distribution details:', error);
            setError('Failed to fetch distribution details');
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

    const handleCreateDistribution = async (formData) => {
        try {
            if (!selectedForDistribution) {
                setError('No request selected for distribution plan');
                return;
            }

            const token = localStorage.getItem('authToken');
            
            // Prepare the distribution data
            const distributionData = {
                ...formData,
                food_request_id: selectedForDistribution,
                status: 'planned'
            };
            
            // Create the distribution plan
            await axios.post(
                `https://greenbridgeserver.onrender.com/api/v1/food/request/${selectedForDistribution}/distribution/`,
                distributionData,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Update the request status
            await axios.put(
                `https://greenbridgeserver.onrender.com/api/v1/food/request/${selectedForDistribution}/update-status/`,
                { 
                    status: 'distribution_planned'
                },
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setShowDistributionForm(false);
            fetchRequests();
            alert('Distribution plan created successfully!');
        } catch (error) {
            console.error('Error creating distribution plan:', error);
            setError('Failed to create distribution plan: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleCreateGroceryDistribution = async (formData) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                `https://greenbridgeserver.onrender.com/api/v1/grocery/request/${selectedForDistribution}/distribution/`,
                {
                    ...formData,
                    status: 'planned'
                },
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            await axios.put(
                `https://greenbridgeserver.onrender.com/api/v1/grocery/request/${selectedForDistribution}/update-status/`,
                { 
                    status: 'distribution_planned'
                },
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setShowGroceryDistributionForm(false);
            fetchRequests();
            alert('Grocery distribution plan created successfully!');
        } catch (error) {
            console.error('Error creating grocery distribution plan:', error);
            setError('Failed to create grocery distribution plan: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleCreateBookDistribution = async (formData) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                `https://greenbridgeserver.onrender.com/api/v1/book/request/${selectedForDistribution}/distribution/`,
                {
                    ...formData,
                    status: 'planned'
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            await axios.put(
                `https://greenbridgeserver.onrender.com/api/v1/book/request/${selectedForDistribution}/update-status/`,
                { 
                    status: 'distribution_planned'
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setShowBookDistributionPlan(false);
            fetchRequests();
            alert('Book distribution plan created successfully!');
        } catch (error) {
            console.error('Error creating book distribution plan:', error);
            setError('Failed to create book distribution plan');
        }
    };

    const handleCreateSchoolSuppliesDistribution = async (formData) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                `https://greenbridgeserver.onrender.com/api/v1/school-supplies/request/${selectedForDistribution}/distribution/`,
                {
                    ...formData,
                    status: 'planned'
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            await axios.put(
                `https://greenbridgeserver.onrender.com/api/v1/school-supplies/request/${selectedForDistribution}/update-status/`,
                { 
                    status: 'distribution_planned'
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setShowSchoolSuppliesDistributionPlan(false);
            fetchRequests();
            alert('School supplies distribution plan created successfully!');
        } catch (error) {
            console.error('Error creating school supplies distribution plan:', error);
            setError('Failed to create school supplies distribution plan');
        }
    };

    const getActionButtons = (request) => {
        const actions = statusActions[request.status] || [];
        const isFoodRequest = activeTab === 0;
        
        return (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2, flexWrap: 'wrap' }}>
                <Button
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => {
                        setSelectedRequest(request);
                        setOpenDialog(true);
                    }}
                >
                    Details
                </Button>

                {request.status === 'collected' && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setSelectedForDistribution(request.id);
                            switch(activeTab) {
                                case 0:
                                    setShowDistributionForm(true);
                                    break;
                                case 1:
                                    setShowGroceryDistributionForm(true);
                                    break;
                                case 2:
                                    setShowBookDistributionPlan(true);
                                    break;
                                case 3:
                                    setShowSchoolSuppliesDistributionPlan(true);
                                    break;
                                default:
                                    break;
                            }
                        }}
                    >
                        Create Distribution Plan
                    </Button>
                )}

                {request.status === 'distributed' && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => fetchDistributionDetails(request.id)}
                    >
                        View Distribution Details
                    </Button>
                )}

                {isFoodRequest && 
                 (request.status === 'collected' || request.status === 'quality_issue' || 
                  request.status === 'distributed' || request.status === 'cancelled') && (
                    <Button
                        variant="outlined"
                        startIcon={<AssignmentIcon />}
                        color="secondary"
                        onClick={() => fetchQualityReport(request.id)}
                    >
                        View Quality Report
                    </Button>
                )}

                {actions.map((action, index) => (
                    <Button
                        key={index}
                        variant="contained"
                        color={action.color}
                        onClick={() => handleStatusUpdate(request.id, action.action)}
                    >
                        {action.label}
                    </Button>
                ))}
            </Box>
        );
    };

    const renderRequestDetails = (request) => {
        if (!request) return null;

        const isExpiringSoon = (expiryDate) => {
            const now = new Date();
            const expiry = new Date(expiryDate);
            const hoursRemaining = (expiry - now) / (1000 * 60 * 60);
            return hoursRemaining > 0 && hoursRemaining < 24;
        };

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
                            <Typography color={isExpiringSoon(request.expiry_time) ? 'error' : 'textPrimary'}>
                                Best Before: {format(new Date(request.expiry_time), 'dd/MM/yyyy HH:mm')}
                                {isExpiringSoon(request.expiry_time) && (
                                    <Chip 
                                        label="Expiring Soon" 
                                        color="error" 
                                        size="small" 
                                        sx={{ ml: 1 }}
                                    />
                                )}
                            </Typography>
                        </Box>
                        {(request.status === 'collected' || request.status === 'quality_issue' || 
                          request.status === 'distributed' || request.status === 'cancelled') && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <AssignmentIcon sx={{ mr: 1 }} color="primary" />
                                <Typography variant="body2" color="primary">
                                    Quality report available
                                    {request.status === 'cancelled' && (
                                        <Chip
                                            label="Possible quality issue"
                                            color="error"
                                            size="small"
                                            sx={{ ml: 1 }}
                                        />
                                    )}
                                </Typography>
                            </Box>
                        )}
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
                            <Typography color={isExpiringSoon(request.expiry_date) ? 'error' : 'textPrimary'}>
                                Expiry Date: {format(new Date(request.expiry_date), 'dd/MM/yyyy')}
                                {isExpiringSoon(request.expiry_date) && (
                                    <Chip 
                                        label="Expiring Soon" 
                                        color="error" 
                                        size="small" 
                                        sx={{ ml: 1 }}
                                    />
                                )}
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

            case 3: // School Supplies
                return request.supply_type ? (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <SchoolIcon sx={{ mr: 1 }} />
                            <Typography>
                                {request.supply_type.charAt(0).toUpperCase() + request.supply_type.slice(1)} - {request.quantity} items
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" color="textSecondary">
                                Education Level: {request.education_level.replace('_', ' ').charAt(0).toUpperCase() + request.education_level.slice(1)}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" color="textSecondary">
                                Condition: {request.condition}
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
                return 'Food Distribution Requests';
            case 1:
                return 'Grocery Distribution Requests';
            case 2:
                return 'Book Distribution Requests';
            case 3:
                return 'School Supplies Requests';
            default:
                return 'Requests';
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

    const renderContent = () => {
        if (showProfile) {
            return <NGOProfile />;
        }

        if (activeTab === 4) {
            return (
                <Box>
                    {showMoneyRequestForm ? (
                        <Box>
                            <Button 
                                variant="outlined" 
                                onClick={() => setShowMoneyRequestForm(false)}
                                sx={{ mb: 3 }}
                            >
                                Back to Requests
                            </Button>
                            <NGOMoneyRequestForm />
                        </Box>
                    ) : (
                        <Box>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={() => setShowMoneyRequestForm(true)}
                                sx={{ mb: 3 }}
                            >
                                New Money Request
                            </Button>
                            <NGOMoneyRequestList isAdmin={false} />
                        </Box>
                    )}
                </Box>
            );
        }

        return (
            <>
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
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Typography variant="h6">
                                                    Request #{request.id}
                                                </Typography>
                                                {getStatusChip(request.status)}
                                            </Box>
                                            {renderRequestDetails(request)}
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <LocationOnIcon sx={{ mr: 1 }} />
                                                <Typography noWrap>
                                                    {request.pickup_address}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<VisibilityIcon />}
                                                    onClick={() => {
                                                        setSelectedRequest(request);
                                                        setOpenDialog(true);
                                                    }}
                                                >
                                                    Details
                                                </Button>
                                                {request.status === 'distributed' && (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => fetchDistributionDetails(request.id)}
                                                    >
                                                        View Distribution
                                                    </Button>
                                                )}
                                                {activeTab === 0 && 
                                                 (request.status === 'collected' || request.status === 'quality_issue' || 
                                                  request.status === 'distributed' || request.status === 'cancelled') && (
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<AssignmentIcon />}
                                                        color="secondary"
                                                        onClick={() => fetchQualityReport(request.id)}
                                                        size="small"
                                                    >
                                                        Quality Report
                                                    </Button>
                                                )}
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        )}
                    </Grid>
                )}
            </>
        );
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

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        mt: '64px',
                        pt: 0,
                        backgroundColor: (theme) => theme.palette.background.default,
                        borderRight: '1px solid',
                        borderColor: 'divider'
                    },
                }}
            >
                <Box sx={{ px: 2, py: 2 }}>
                    <List>
                        <ListItem disablePadding sx={{ mb: 2 }}>
                            <ListItemButton
                                onClick={() => {
                                    setShowProfile(true);
                                    setActiveTab(-1);
                                }}
                                selected={showProfile}
                                sx={{
                                    borderRadius: 1,
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.light',
                                        color: 'primary.contrastText',
                                    }
                                }}
                            >
                                <AccountCircleIcon sx={{ mr: 2 }} />
                                <ListItemText primary="NGO Profile" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Filter by Status
                    </Typography>
                    {activeTab !== 4 && !showProfile && (
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
                    )}
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
                    {!showProfile && (
                        <Tabs 
                            value={activeTab} 
                            onChange={(e, newValue) => {
                                setActiveTab(newValue);
                                setFilter('all');
                                setShowProfile(false);
                            }}
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
                            <Tab 
                                icon={<SchoolIcon />} 
                                label="School Supplies" 
                                iconPosition="start"
                            />
                            <Tab 
                                icon={<MoneyIcon />} 
                                label="Money Requests" 
                                iconPosition="start"
                            />
                        </Tabs>
                    )}

                    {!showProfile && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h4" gutterBottom>
                                {activeTab === 4 ? 'Money Requests' : getRequestTypeTitle()}
                            </Typography>
                        </Box>
                    )}
                    
                    {renderContent()}
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
                    {selectedRequest && activeTab === 0 &&
                     (selectedRequest.status === 'collected' || selectedRequest.status === 'quality_issue' || 
                      selectedRequest.status === 'distributed' || selectedRequest.status === 'cancelled') && (
                        <Button
                            variant="outlined"
                            startIcon={<AssignmentIcon />}
                            color="secondary"
                            onClick={() => fetchQualityReport(selectedRequest.id)}
                        >
                            View Quality Report
                        </Button>
                    )}
                    {selectedRequest && selectedRequest.status === 'distributed' && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => fetchDistributionDetails(selectedRequest.id)}
                        >
                            View Distribution Details
                        </Button>
                    )}
                    {selectedRequest && getActionButtons(selectedRequest)}
                </DialogActions>
            </Dialog>

            <QualityReportDialog
                open={showQualityReport}
                onClose={() => setShowQualityReport(false)}
                report={qualityReport}
            />

            <NGODistributionDetails
                open={showDistributionDetails}
                onClose={() => setShowDistributionDetails(false)}
                distribution={selectedDistribution}
            />

            <Dialog
                open={showDistributionForm}
                onClose={() => setShowDistributionForm(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Create Food Distribution Plan</DialogTitle>
                <DialogContent>
                    {selectedForDistribution ? (
                        <>
                            <Typography variant="subtitle1" gutterBottom>
                                Creating distribution plan for Food Request #{selectedForDistribution}
                            </Typography>
                            <DistributionPlan
                                foodRequestId={selectedForDistribution}
                                onSubmit={handleCreateDistribution}
                                onClose={() => setShowDistributionForm(false)}
                            />
                        </>
                    ) : (
                        <Typography color="error">
                            Error: No food request selected. Please try again.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDistributionForm(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={showGroceryDistributionForm}
                onClose={() => setShowGroceryDistributionForm(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Create Grocery Distribution Plan</DialogTitle>
                <DialogContent>
                    <GroceryDistributionPlan
                        groceryRequest={selectedForDistribution}
                        onSubmit={handleCreateGroceryDistribution}
                        onClose={() => setShowGroceryDistributionForm(false)}
                    />
                </DialogContent>
            </Dialog>

            {showBookDistributionPlan && selectedForDistribution && (
                <Dialog 
                    open={showBookDistributionPlan} 
                    onClose={() => setShowBookDistributionPlan(false)} 
                    maxWidth="md" 
                    fullWidth
                >
                    <DialogTitle>Create Book Distribution Plan</DialogTitle>
                    <DialogContent>
                        <BookDistributionPlan
                            bookRequest={selectedForDistribution}
                            onSubmit={handleCreateBookDistribution}
                            onClose={() => setShowBookDistributionPlan(false)}
                        />
                    </DialogContent>
                </Dialog>
            )}

            {showSchoolSuppliesDistributionPlan && selectedForDistribution && (
                <Dialog 
                    open={showSchoolSuppliesDistributionPlan} 
                    onClose={() => setShowSchoolSuppliesDistributionPlan(false)} 
                    maxWidth="md" 
                    fullWidth
                >
                    <DialogTitle>Create School Supplies Distribution Plan</DialogTitle>
                    <DialogContent>
                        <SchoolSuppliesDistributionPlan
                            suppliesRequest={selectedForDistribution}
                            onSubmit={handleCreateSchoolSuppliesDistribution}
                            onClose={() => setShowSchoolSuppliesDistributionPlan(false)}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </Box>
    );
};

export default NGODashboard; 