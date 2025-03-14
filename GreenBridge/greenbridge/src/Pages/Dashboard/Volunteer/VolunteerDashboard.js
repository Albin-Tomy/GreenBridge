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
    Tab,
    Alert
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import ErrorIcon from '@mui/icons-material/Error';
import Header from '../../../components/Header';
import axios from 'axios';
import { format } from 'date-fns';
import QualityReportForm from './QualityReportForm';
import DistributionPlan from '../../Distribution/DistributionPlan';
import DistributionDetails from '../../Distribution/DistributionDetails';
import GroceryDistributionPlan from '../../Distribution/GroceryDistributionPlan';
import GroceryDistributionDetails from '../../Distribution/GroceryDistributionDetails';
import SchoolSuppliesDistributionPlan from '../../Distribution/SchoolSuppliesDistributionPlan';
import SchoolSuppliesDistributionDetails from '../../Distribution/SchoolSuppliesDistributionDetails';
import BookDistributionPlan from '../../Distribution/BookDistributionPlan';
import BookDistributionDetails from '../../Distribution/BookDistributionDetails';

const VolunteerDashboard = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [showQualityForm, setShowQualityForm] = useState(false);
    const [error, setError] = useState(null);
    const [showDistributionForm, setShowDistributionForm] = useState(false);
    const [selectedForDistribution, setSelectedForDistribution] = useState(null);
    const [showDistributionDetails, setShowDistributionDetails] = useState(false);
    const [selectedDistribution, setSelectedDistribution] = useState(null);
    const [showGroceryDistributionForm, setShowGroceryDistributionForm] = useState(false);
    const [showGroceryDistributionDetails, setShowGroceryDistributionDetails] = useState(false);
    const [selectedGroceryDistribution, setSelectedGroceryDistribution] = useState(null);
    const [showSchoolSuppliesDistributionPlan, setShowSchoolSuppliesDistributionPlan] = useState(false);
    const [showSchoolSuppliesDistributionDetails, setShowSchoolSuppliesDistributionDetails] = useState(false);
    const [selectedSchoolSuppliesDistribution, setSelectedSchoolSuppliesDistribution] = useState(null);
    const [showBookDistributionPlan, setShowBookDistributionPlan] = useState(false);
    const [showBookDistributionDetails, setShowBookDistributionDetails] = useState(false);
    const [selectedBookDistribution, setSelectedBookDistribution] = useState(null);

    useEffect(() => {
        fetchApprovedRequests();
    }, [activeTab]);

    const fetchApprovedRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('authToken');
            let endpoint;
            
            switch(activeTab) {
                case 0: // Food
                    endpoint = 'food/all';
                    break;
                case 1: // Grocery
                    endpoint = 'grocery/all';
                    break;
                case 2: // Books
                    endpoint = 'book/all';
                    break;
                case 3: // School Supplies
                    endpoint = 'school-supplies/all';
                    break;
                default:
                    endpoint = 'food/all';
            }
            
            const response = await axios.get(`http://127.0.0.1:8000/api/v1/${endpoint}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Filter for approved, collected, and distribution_planned requests
            const filteredRequests = response.data.filter(request => 
                ['approved', 'collected', 'distribution_planned'].includes(request.status)
            );
            setRequests(filteredRequests);
                } catch (error) {
            console.error('Error fetching requests:', error);
            setError('Failed to fetch requests. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsCollected = async (id) => {
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
            
            await axios.put(
                `http://127.0.0.1:8000/api/v1/${endpoint}/request/${id}/update-status/`,
                { status: 'collected' },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            fetchApprovedRequests();
        } catch (error) {
            console.error('Error marking request as collected:', error);
        }
    };

    const handleQualityReportSubmit = async (reportData) => {
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
            
            // First submit quality report
            await axios.post(
                `http://127.0.0.1:8000/api/v1/${endpoint}/request/${selectedRequest}/quality-report/`,
                reportData,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Then update status to collected
            await axios.put(
                `http://127.0.0.1:8000/api/v1/${endpoint}/request/${selectedRequest}/update-status/`,
                { status: 'collected' },
                {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
                }
            );
            
            setShowQualityForm(false);
            fetchApprovedRequests();
        } catch (error) {
            console.error('Error updating status:', error);
            setError('Failed to update status. Please try again.');
        }
    };

    const handleQualityIssue = (requestId) => {
        setSelectedRequest(requestId);
        setShowQualityForm(true);
    };

    const handleCreateDistribution = async (formData) => {
        try {
            const token = localStorage.getItem('authToken');
            // First create the distribution plan with status 'planned'
            await axios.post(
                `http://127.0.0.1:8000/api/v1/food/request/${selectedForDistribution}/distribution/`,
                {
                    ...formData,
                    status: 'planned'  // Explicitly set the initial status
                },
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Then update the food request status
            await axios.put(
                `http://127.0.0.1:8000/api/v1/food/request/${selectedForDistribution}/update-status/`,
                { 
                    status: 'distribution_planned'  // Use consistent status value
                },
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setShowDistributionForm(false);
        fetchApprovedRequests();
            setError(null);
            alert('Distribution plan created successfully!');
        } catch (error) {
            console.error('Error creating distribution plan:', error);
            const errorMessage = error.response?.data?.error || error.message;
            setError('Failed to create distribution plan: ' + errorMessage);
        }
    };

    const fetchDistributionDetails = async (requestId) => {
        try {
            const token = localStorage.getItem('authToken');
            
            // Get the distribution plan using the new endpoint
            const planResponse = await axios.get(
                `http://127.0.0.1:8000/api/v1/food/request/${requestId}/distribution/get/`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            if (planResponse.data) {
                setSelectedDistribution(planResponse.data);
                setShowDistributionDetails(true);
                setError(null);
            } else {
                setError('No distribution plan found for this request');
            }
        } catch (error) {
            console.error('Error fetching distribution details:', error);
            const errorMessage = error.response?.data?.error || 'Failed to fetch distribution details';
            setError(errorMessage);
        }
    };

    const handleDistributionStatusUpdate = async (newStatus) => {
        try {
            const token = localStorage.getItem('authToken');
            
            // First update the distribution plan status
            await axios.put(
                `http://127.0.0.1:8000/api/v1/food/distribution/${selectedDistribution.id}/update-status/`,
                { status: newStatus },
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // If distribution is completed, update the food request status
            if (newStatus === 'completed') {
                await axios.put(
                    `http://127.0.0.1:8000/api/v1/food/request/${selectedDistribution.food_request}/update-status/`,
                    { 
                        status: 'distributed',
                        distribution_id: selectedDistribution.id  // Pass the distribution ID
                    },
                    {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            }
            
            // Refresh the details
            await fetchDistributionDetails(selectedDistribution.food_request);
            fetchApprovedRequests();
            setError(null);
        } catch (error) {
            console.error('Error updating distribution status:', error);
            const errorMessage = error.response?.data?.error || error.message;
            setError('Failed to update distribution status: ' + errorMessage);
        }
    };

    const handleCreateGroceryDistribution = async (formData) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                `http://127.0.0.1:8000/api/v1/grocery/request/${selectedForDistribution}/distribution/`,
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
                `http://127.0.0.1:8000/api/v1/grocery/request/${selectedForDistribution}/update-status/`,
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
            fetchApprovedRequests();
            setError(null);
            alert('Grocery distribution plan created successfully!');
        } catch (error) {
            console.error('Error creating grocery distribution plan:', error);
            const errorMessage = error.response?.data?.error || error.message;
            setError('Failed to create grocery distribution plan: ' + errorMessage);
        }
    };

    const fetchGroceryDistributionDetails = async (requestId) => {
        try {
            const token = localStorage.getItem('authToken');
            const planResponse = await axios.get(
                `http://127.0.0.1:8000/api/v1/grocery/request/${requestId}/distribution/get/`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            if (planResponse.data) {
                setSelectedGroceryDistribution(planResponse.data);
                setShowGroceryDistributionDetails(true);
                setError(null);
            } else {
                setError('No grocery distribution plan found for this request');
            }
        } catch (error) {
            console.error('Error fetching grocery distribution details:', error);
            const errorMessage = error.response?.data?.error || 'Failed to fetch distribution details';
            setError(errorMessage);
        }
    };

    const handleGroceryDistributionStatusUpdate = async (newStatus) => {
        try {
            const token = localStorage.getItem('authToken');
            
            await axios.put(
                `http://127.0.0.1:8000/api/v1/grocery/distribution/${selectedGroceryDistribution.id}/update-status/`,
                { status: newStatus },
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (newStatus === 'completed') {
                await axios.put(
                    `http://127.0.0.1:8000/api/v1/grocery/request/${selectedGroceryDistribution.grocery_request}/update-status/`,
                    { 
                        status: 'distributed',
                        distribution_id: selectedGroceryDistribution.id
                    },
                    {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            }
            
            await fetchGroceryDistributionDetails(selectedGroceryDistribution.grocery_request);
            fetchApprovedRequests();
            setError(null);
        } catch (error) {
            console.error('Error updating grocery distribution status:', error);
            const errorMessage = error.response?.data?.error || error.message;
            setError('Failed to update distribution status: ' + errorMessage);
        }
    };

    const handleCreateSchoolSuppliesDistribution = async (formData) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                `http://127.0.0.1:8000/api/v1/school-supplies/request/${selectedRequest.id}/distribution/`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setShowSchoolSuppliesDistributionPlan(false);
            fetchApprovedRequests();
        } catch (error) {
            console.error('Error creating school supplies distribution plan:', error);
        }
    };

    const fetchSchoolSuppliesDistributionDetails = async (requestId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(
                `http://127.0.0.1:8000/api/v1/school-supplies/request/${requestId}/distribution/get/`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            if (response.data) {
                setSelectedSchoolSuppliesDistribution(response.data);
                setShowSchoolSuppliesDistributionDetails(true);
            }
        } catch (error) {
            console.error('Error fetching school supplies distribution details:', error);
            setError('Failed to fetch distribution details');
        }
    };

    const handleSchoolSuppliesDistributionStatusUpdate = async (newStatus) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(
                `http://127.0.0.1:8000/api/v1/school-supplies/distribution/${selectedSchoolSuppliesDistribution.id}/update-status/`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            if (newStatus === 'completed') {
                await axios.put(
                    `http://127.0.0.1:8000/api/v1/school-supplies/distribution/${selectedSchoolSuppliesDistribution.id}/complete/`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
            }
            
            setShowSchoolSuppliesDistributionDetails(false);
            fetchApprovedRequests();
        } catch (error) {
            console.error('Error updating school supplies distribution status:', error);
        }
    };

    const handleCreateBookDistribution = async (formData) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                `http://127.0.0.1:8000/api/v1/book/request/${selectedRequest.id}/distribution/`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setShowBookDistributionPlan(false);
            fetchApprovedRequests();
        } catch (error) {
            console.error('Error creating book distribution plan:', error);
            setError('Failed to create book distribution plan');
        }
    };

    const fetchBookDistributionDetails = async (requestId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(
                `http://127.0.0.1:8000/api/v1/book/request/${requestId}/distribution/get/`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            if (response.data) {
                setSelectedBookDistribution(response.data);
                setShowBookDistributionDetails(true);
            }
        } catch (error) {
            console.error('Error fetching book distribution details:', error);
            setError('Failed to fetch distribution details');
        }
    };

    const handleBookDistributionStatusUpdate = async (newStatus) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(
                `http://127.0.0.1:8000/api/v1/book/distribution/${selectedBookDistribution.id}/update-status/`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            if (newStatus === 'completed') {
                await axios.put(
                    `http://127.0.0.1:8000/api/v1/book/distribution/${selectedBookDistribution.id}/complete/`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
            }
            
            setShowBookDistributionDetails(false);
            fetchApprovedRequests();
        } catch (error) {
            console.error('Error updating book distribution status:', error);
            setError('Failed to update distribution status');
        }
    };

    const renderRequestDetails = (request) => {
        if (!request) return null;

        // Helper function to safely format date
        const formatDate = (dateString, formatPattern = 'dd/MM/yyyy HH:mm') => {
            try {
                if (!dateString) return 'Not specified';
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return 'Invalid date';
                return format(date, formatPattern);
            } catch (error) {
                console.error('Date formatting error:', error);
                return 'Invalid date';
            }
        };

        switch(activeTab) {
            case 0: // Food
                return (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <RestaurantIcon sx={{ mr: 1 }} />
                            <Typography>
                                {request.food_type} - {request.quantity || 'N/A'}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <AccessTimeIcon sx={{ mr: 1 }} />
                            <Typography>
                                Expires: {formatDate(request.expiry_time)}
                            </Typography>
                        </Box>
                    </>
                );

            case 1: // Grocery
                return (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <ShoppingBasketIcon sx={{ mr: 1 }} />
                            <Typography>
                                {request.grocery_type} - {request.quantity || 'N/A'}
                            </Typography>
                        </Box>
                        {request.expiry_date && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <AccessTimeIcon sx={{ mr: 1 }} />
                            <Typography>
                                    Expires: {formatDate(request.expiry_date, 'dd/MM/yyyy')}
                            </Typography>
                        </Box>
                        )}
                    </>
                );

            case 2: // Books
                return (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <MenuBookIcon sx={{ mr: 1 }} />
                            <Typography>
                                {request.book_type} - {request.quantity || 'N/A'} books
                            </Typography>
                        </Box>
                        {request.subject && (
                            <Typography variant="body2" color="textSecondary">
                                Subject: {request.subject}
                            </Typography>
                        )}
                    </>
                );

            case 3: // School Supplies
                return (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <SchoolIcon sx={{ mr: 1 }} />
                            <Typography>
                                {request.supply_type} - {request.quantity || 'N/A'} items
                            </Typography>
                        </Box>
                        {request.grade_level && (
                            <Typography variant="body2" color="textSecondary">
                                Grade Level: {request.grade_level}
                            </Typography>
                        )}
                    </>
                );

            default:
                return null;
        }
    };

    const getRequestTypeTitle = () => {
        switch(activeTab) {
            case 0:
                return "Food Collection Requests";
            case 1:
                return "Grocery Collection Requests";
            case 2:
                return "Book Collection Requests";
            case 3:
                return "School Supplies Collection Requests";
            default:
                return "Collection Requests";
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'approved':
                return 'success';
            case 'collected':
                return 'primary';
            case 'distribution_planned':
                return 'secondary';
            default:
                return 'default';
        }
    };

    const renderActionButtons = (request) => {
        if (!request) return null;

        switch (request.status) {
            case 'approved':
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleMarkAsCollected(request.id)}
                    >
                        Mark as Collected
                    </Button>
                );
            case 'collected':
                let distributionComponent;
                switch(activeTab) {
                    case 0:
                        distributionComponent = (
                            <DistributionPlan
                                foodRequest={request}
                                onSubmit={handleCreateDistribution}
                                onClose={() => setShowDistributionForm(false)}
                            />
                        );
                        break;
                    case 1:
                        distributionComponent = (
                            <GroceryDistributionPlan
                                groceryRequest={request}
                                onSubmit={handleCreateGroceryDistribution}
                                onClose={() => setShowGroceryDistributionForm(false)}
                            />
                        );
                        break;
                    case 2:
                        distributionComponent = (
                            <BookDistributionPlan
                                bookRequest={request}
                                onSubmit={handleCreateBookDistribution}
                                onClose={() => setShowBookDistributionPlan(false)}
                            />
                        );
                        break;
                    case 3:
                        distributionComponent = (
                            <SchoolSuppliesDistributionPlan
                                suppliesRequest={request}
                                onSubmit={handleCreateSchoolSuppliesDistribution}
                                onClose={() => setShowSchoolSuppliesDistributionPlan(false)}
                            />
                        );
                        break;
                    default:
                        distributionComponent = null;
                }
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setSelectedRequest(request);
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
                );
            case 'distribution_planned':
            case 'distributed':
                return (
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            switch(activeTab) {
                                case 0:
                                    fetchDistributionDetails(request.id);
                                    break;
                                case 1:
                                    fetchGroceryDistributionDetails(request.id);
                                    break;
                                case 2:
                                    fetchBookDistributionDetails(request.id);
                                    break;
                                case 3:
                                    fetchSchoolSuppliesDistributionDetails(request.id);
                                    break;
                                default:
                                    break;
                            }
                        }}
                    >
                        View Distribution Details
                    </Button>
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />

            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
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
                    <Tab 
                        icon={<SchoolIcon />} 
                        label="School Supplies" 
                        iconPosition="start"
                    />
                </Tabs>

                <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                    {getRequestTypeTitle()}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}
                
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
                                            {/* Request Header */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                <Typography variant="h6">
                                                    Request #{request.id}
                                                </Typography>
                                                <Chip 
                                                    label={request.status.toUpperCase()} 
                                                    color={getStatusColor(request.status)} 
                                                    size="small" 
                                                />
                                            </Box>
                                            
                                            {/* Request Details */}
                                            {renderRequestDetails(request)}

                                            {/* Location */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                <LocationOnIcon sx={{ mr: 1 }} />
                                                <Typography noWrap>
                                                    {request.pickup_address}
                                                </Typography>
                                            </Box>

                                            {/* Action Buttons */}
                                            {renderActionButtons(request)}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        )}
                    </Grid>
                )}

            {/* Details Dialog */}
                <Dialog 
                    open={openDialog} 
                    onClose={() => setOpenDialog(false)}
                    maxWidth="md"
                    fullWidth
                >
                <DialogTitle>Request Details</DialogTitle>
                <DialogContent>
                    {selectedRequest && (
                        <Box sx={{ p: 2 }}>
                                {renderRequestDetails(selectedRequest)}
                                <Typography sx={{ mt: 2 }}>
                                    <strong>Contact:</strong> {selectedRequest.contact_number}
                                </Typography>
                                <Typography sx={{ mt: 1 }}>
                                    <strong>Address:</strong> {selectedRequest.pickup_address}
                                </Typography>
                                {selectedRequest.additional_notes && (
                                    <Typography sx={{ mt: 1 }}>
                                        <strong>Notes:</strong> {selectedRequest.additional_notes}
                                    </Typography>
                                )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                        {activeTab === 0 && (
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                            setOpenDialog(false);
                            handleQualityIssue(selectedRequest.id);
                        }}
                    >
                                Report Issue
                    </Button>
                        )}
                    <Button 
                        variant="contained" 
                        color="success"
                        onClick={() => handleMarkAsCollected(selectedRequest.id)}
                    >
                        Mark as Collected
                    </Button>
                </DialogActions>
            </Dialog>

                {/* Quality Report Form */}
                {activeTab === 0 && (
            <QualityReportForm
                open={showQualityForm}
                onClose={() => setShowQualityForm(false)}
                requestId={selectedRequest}
                        onSubmitSuccess={(reportData) => handleQualityReportSubmit(reportData)}
                    />
                )}

                {/* Add Distribution Plan Form Dialog */}
                <Dialog
                    open={showDistributionForm}
                    onClose={() => setShowDistributionForm(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogContent>
                        <DistributionPlan
                            foodRequest={selectedForDistribution}
                            onSubmit={handleCreateDistribution}
                            onClose={() => setShowDistributionForm(false)}
                        />
                    </DialogContent>
                </Dialog>

                {/* Add Distribution Details Dialog */}
                <DistributionDetails
                    open={showDistributionDetails}
                    onClose={() => setShowDistributionDetails(false)}
                    distribution={selectedDistribution}
                    onStatusUpdate={handleDistributionStatusUpdate}
                />

                {/* Add Grocery Distribution Plan Form Dialog */}
                <Dialog
                    open={showGroceryDistributionForm}
                    onClose={() => setShowGroceryDistributionForm(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogContent>
                        <GroceryDistributionPlan
                            groceryRequest={selectedForDistribution}
                            onSubmit={handleCreateGroceryDistribution}
                            onClose={() => setShowGroceryDistributionForm(false)}
                        />
                    </DialogContent>
                </Dialog>

                {/* Add Grocery Distribution Details Dialog */}
                <GroceryDistributionDetails
                    open={showGroceryDistributionDetails}
                    onClose={() => setShowGroceryDistributionDetails(false)}
                    distribution={selectedGroceryDistribution}
                    onStatusUpdate={handleGroceryDistributionStatusUpdate}
                />

                {showSchoolSuppliesDistributionPlan && selectedRequest && (
                    <Dialog open={showSchoolSuppliesDistributionPlan} onClose={() => setShowSchoolSuppliesDistributionPlan(false)} maxWidth="md" fullWidth>
                        <SchoolSuppliesDistributionPlan
                            suppliesRequest={selectedRequest}
                            onSubmit={handleCreateSchoolSuppliesDistribution}
                            onClose={() => setShowSchoolSuppliesDistributionPlan(false)}
                        />
                    </Dialog>
                )}

                <SchoolSuppliesDistributionDetails
                    open={showSchoolSuppliesDistributionDetails}
                    onClose={() => setShowSchoolSuppliesDistributionDetails(false)}
                    distribution={selectedSchoolSuppliesDistribution}
                    onStatusUpdate={handleSchoolSuppliesDistributionStatusUpdate}
                />

                {/* Add Book Distribution Plan Dialog */}
                {showBookDistributionPlan && selectedRequest && (
                    <Dialog open={showBookDistributionPlan} onClose={() => setShowBookDistributionPlan(false)} maxWidth="md" fullWidth>
                        <BookDistributionPlan
                            bookRequest={selectedRequest}
                            onSubmit={handleCreateBookDistribution}
                            onClose={() => setShowBookDistributionPlan(false)}
                        />
                    </Dialog>
                )}

                {/* Add Book Distribution Details Dialog */}
                <BookDistributionDetails
                    open={showBookDistributionDetails}
                    onClose={() => setShowBookDistributionDetails(false)}
                    distribution={selectedBookDistribution}
                    onStatusUpdate={handleBookDistributionStatusUpdate}
                />
            </Box>
        </Box>
    );
};

export default VolunteerDashboard;