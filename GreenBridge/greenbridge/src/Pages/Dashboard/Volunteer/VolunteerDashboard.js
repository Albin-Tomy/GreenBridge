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
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent
} from '@mui/lab';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import ErrorIcon from '@mui/icons-material/Error';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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

const ActivityHistory = ({ activities }) => {
    const [filterType, setFilterType] = useState('all'); // all, collected, distributed
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const getActivityIcon = (type) => {
        switch(type) {
            case 'food':
                return <RestaurantIcon />;
            case 'grocery':
                return <ShoppingBasketIcon />;
            case 'book':
                return <MenuBookIcon />;
            case 'school_supplies':
                return <SchoolIcon />;
            default:
                return <HistoryIcon />;
        }
    };

    const getActivityColor = (action) => {
        switch(action) {
            case 'collected':
                return 'primary';
            case 'distributed':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'grey';
        }
    };

    const filteredActivities = activities.filter(activity => 
        filterType === 'all' || activity.action === filterType
    );

    const handleActivityClick = (activity) => {
        setSelectedActivity(activity);
        setShowDetails(true);
    };

    return (
        <Box>
            {/* Filter Controls */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button 
                    variant={filterType === 'all' ? 'contained' : 'outlined'}
                    onClick={() => setFilterType('all')}
                >
                    All Activities
                </Button>
                <Button 
                    variant={filterType === 'collected' ? 'contained' : 'outlined'}
                    onClick={() => setFilterType('collected')}
                    startIcon={<VisibilityIcon />}
                >
                    Collected Requests
                </Button>
                <Button 
                    variant={filterType === 'distributed' ? 'contained' : 'outlined'}
                    onClick={() => setFilterType('distributed')}
                    startIcon={<CheckCircleIcon />}
                >
                    Distributed Requests
                </Button>
            </Box>

            {/* Activity Timeline */}
            <Timeline position="alternate">
                {filteredActivities.map((activity, index) => (
                    <TimelineItem key={index}>
                        <TimelineOppositeContent color="text.secondary">
                            {new Date(activity.timestamp * 1000).toLocaleString()}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot color={getActivityColor(activity.action)}>
                                {getActivityIcon(activity.details.type)}
                            </TimelineDot>
                            {index < activities.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                            <Paper 
                                elevation={3} 
                                sx={{ 
                                    p: 2, 
                                    bgcolor: 'background.paper',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        bgcolor: 'action.hover'
                                    }
                                }}
                                onClick={() => handleActivityClick(activity)}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6" component="h3">
                                        {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
                                    </Typography>
                                    <Chip 
                                        label={activity.status.toUpperCase()}
                                        color={getActivityColor(activity.action)}
                                        size="small"
                                    />
                                </Box>
                                <Typography>
                                    {activity.details.type.charAt(0).toUpperCase() + activity.details.type.slice(1)} Request #{activity.details.request_id}
                                </Typography>
                                {activity.details.description && (
                                    <Typography variant="body2" color="text.secondary">
                                        {activity.details.description}
                                    </Typography>
                                )}
                            </Paper>
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>

            {/* Activity Details Dialog */}
            <Dialog
                open={showDetails}
                onClose={() => setShowDetails(false)}
                maxWidth="sm"
                fullWidth
            >
                {selectedActivity && (
                    <>
                        <DialogTitle>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {getActivityIcon(selectedActivity.details.type)}
                                {selectedActivity.details.type.charAt(0).toUpperCase() + 
                                 selectedActivity.details.type.slice(1)} Request Details
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Request ID:</strong> #{selectedActivity.details.request_id}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Action:</strong> {selectedActivity.action.charAt(0).toUpperCase() + 
                                    selectedActivity.action.slice(1)}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Status:</strong> {selectedActivity.status}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Date:</strong> {new Date(selectedActivity.timestamp * 1000).toLocaleString()}
                                </Typography>
                                {selectedActivity.details.description && (
                                    <Typography variant="subtitle1" gutterBottom>
                                        <strong>Description:</strong> {selectedActivity.details.description}
                                    </Typography>
                                )}
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setShowDetails(false)}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

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
    const [isCancellationFlow, setIsCancellationFlow] = useState(false);
    const [activities, setActivities] = useState([]);
    const [showActivities, setShowActivities] = useState(false);
    const [loadingActivities, setLoadingActivities] = useState(false);

    useEffect(() => {
        fetchApprovedRequests();
        fetchVolunteerActivities();
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
            
            const response = await axios.get(`https://greenbridgeserver.onrender.com/api/v1/${endpoint}/`, {
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

    const fetchVolunteerActivities = async () => {
        try {
            setLoadingActivities(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.get(
                'https://greenbridgeserver.onrender.com/api/v1/volunteer/activities/',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setActivities(response.data);
        } catch (error) {
            console.error('Error fetching volunteer activities:', error);
            setError('Failed to fetch activity history');
        } finally {
            setLoadingActivities(false);
        }
    };

    // Function to initialize the quality form with default "good" report data
    const initializeQualityFormForCollection = (requestId) => {
        setSelectedRequest(requestId);
        setIsCancellationFlow(false);
        setShowQualityForm(true);
    };

    // Function to initialize quality form for cancellation
    const initializeQualityFormForCancellation = (requestId) => {
        setSelectedRequest(requestId);
        setIsCancellationFlow(true);
        setShowQualityForm(true);
    };

    const handleMarkAsCollected = async (id) => {
        // For food items (activeTab === 0), show quality report first
        if (activeTab === 0) {
            initializeQualityFormForCollection(id);
            return;
        }
        
        // For non-food items, proceed with the original logic
        try {
            const token = localStorage.getItem('authToken');
            let requestType;
            switch(activeTab) {
                case 0:
                    requestType = 'food';
                    break;
                case 1:
                    requestType = 'grocery';
                    break;
                case 2:
                    requestType = 'book';
                    break;
                case 3:
                    requestType = 'school-supplies';
                    break;
                default:
                    requestType = 'food';
            }
            
            // First mark the request as collected in the volunteer activity system
            await axios.put(
                `https://greenbridgeserver.onrender.com/api/v1/volunteer/request/${id}/${requestType}/collect/`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Then update the request status
            await axios.put(
                `https://greenbridgeserver.onrender.com/api/v1/${requestType}/request/${id}/update-status/`,
                { status: 'collected' },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            fetchApprovedRequests();
            fetchVolunteerActivities();
        } catch (error) {
            console.error('Error marking request as collected:', error);
            setError('Failed to mark request as collected');
        }
    };

    const handleCancelRequest = async (id) => {
        // For food items, require quality report before cancelling
        if (activeTab === 0) {
            initializeQualityFormForCancellation(id);
            return;
        }
        
        // For non-food items, show a confirmation dialog
        if (window.confirm('Are you sure you want to cancel this request?')) {
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
                    `https://greenbridgeserver.onrender.com/api/v1/${endpoint}/request/${id}/update-status/`,
                    { status: 'cancelled' },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                fetchApprovedRequests();
            } catch (error) {
                console.error('Error cancelling request:', error);
                setError('Failed to cancel request. Please try again later.');
            }
        }
    };

    const handleQualityReportSubmit = async (reportData) => {
        try {
            setLoading(true);
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
                `https://greenbridgeserver.onrender.com/api/v1/${endpoint}/request/${selectedRequest}/quality-report/`,
                reportData,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Determine status based on flow and quality issues
            let newStatus;
            
            if (isCancellationFlow) {
                // In cancellation flow, always cancel
                newStatus = 'cancelled';
            } else {
                // In collection flow, check for severe quality issues
                const hasSevereIssue = reportData.issue_type === 'contaminated' || 
                                      reportData.issue_type === 'expired' ||
                                      reportData.issue_type === 'spoiled';
                
                newStatus = hasSevereIssue ? 'cancelled' : 'collected';
            }
            
            // Then update status based on flow and quality report
            await axios.put(
                `https://greenbridgeserver.onrender.com/api/v1/${endpoint}/request/${selectedRequest}/update-status/`,
                { status: newStatus },
                {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
                }
            );
            
            setShowQualityForm(false);
            fetchApprovedRequests();
            setError(null);
            
            // Show appropriate message based on the outcome
            if (isCancellationFlow) {
                alert('Quality report submitted. Request has been cancelled.');
            } else if (newStatus === 'cancelled') {
                alert('Quality report submitted. Request has been cancelled due to severe quality issues.');
            } else {
                alert('Quality report submitted and food marked as collected successfully!');
            }
            
            // Reset the cancellation flow flag
            setIsCancellationFlow(false);
        } catch (error) {
            console.error('Error updating status:', error);
            setError('Failed to update status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleQualityIssue = (requestId) => {
        setSelectedRequest(requestId);
        setShowQualityForm(true);
    };

    const handleCreateDistribution = async (formData) => {
        try {
            // Verify that we have a valid ID before proceeding
            if (!selectedForDistribution) {
                setError('No food request selected for distribution plan');
                return;
            }

            const token = localStorage.getItem('authToken');
            console.log(`Creating distribution plan for food request ID: ${selectedForDistribution}`);
            
            // Prepare the distribution data
            const distributionData = {
                ...formData,
                food_request_id: selectedForDistribution,
                status: 'planned'  // Explicitly set the status to 'planned' as expected by the backend
            };
            
            console.log('Distribution plan data to be sent:', distributionData);
            
            // First create the distribution plan
            const distributionResponse = await axios.post(
                `https://greenbridgeserver.onrender.com/api/v1/food/request/${selectedForDistribution}/distribution/`,
                distributionData,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('Distribution plan created:', distributionResponse.data);

            // Then update the food request status
            await axios.put(
                `https://greenbridgeserver.onrender.com/api/v1/food/request/${selectedForDistribution}/update-status/`,
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
            
            if (errorMessage === 'Invalid status value') {
                alert('The system accepted your plan but reported an error. Please refresh the page to see your plan.');
            } else {
                alert('Failed to create distribution plan: ' + errorMessage + '. Please try again.');
            }
        }
    };

    const fetchDistributionDetails = async (requestId) => {
        try {
            const token = localStorage.getItem('authToken');
            
            // Get the distribution plan using the new endpoint
            const planResponse = await axios.get(
                `https://greenbridgeserver.onrender.com/api/v1/food/request/${requestId}/distribution/get/`,
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

    const handleDistributionStatusUpdate = async (newStatus, distributionId, requestId, requestType) => {
        try {
            const token = localStorage.getItem('authToken');
            
            // Update distribution status
            await axios.put(
                `https://greenbridgeserver.onrender.com/api/v1/${requestType}/distribution/${distributionId}/update-status/`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // If distribution is completed, update both the request status and volunteer activity
            if (newStatus === 'completed') {
                // Record the distribution in volunteer activity
                await axios.put(
                    `https://greenbridgeserver.onrender.com/api/v1/volunteer/request/${requestId}/${requestType}/distribute/`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                // Update request status
                await axios.put(
                    `https://greenbridgeserver.onrender.com/api/v1/${requestType}/request/${requestId}/update-status/`,
                    { 
                        status: 'distributed',
                        distribution_id: distributionId
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
            }
            
            // Refresh the data
            fetchApprovedRequests();
            fetchVolunteerActivities();
            setError(null);
        } catch (error) {
            console.error('Error updating distribution status:', error);
            setError('Failed to update distribution status');
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
                `https://greenbridgeserver.onrender.com/api/v1/grocery/request/${requestId}/distribution/get/`,
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
                `https://greenbridgeserver.onrender.com/api/v1/grocery/distribution/${selectedGroceryDistribution.id}/update-status/`,
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
                    `https://greenbridgeserver.onrender.com/api/v1/grocery/request/${selectedGroceryDistribution.grocery_request}/update-status/`,
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
                `https://greenbridgeserver.onrender.com/api/v1/school-supplies/request/${selectedRequest.id}/distribution/`,
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
                `https://greenbridgeserver.onrender.com/api/v1/school-supplies/request/${requestId}/distribution/get/`,
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
                `https://greenbridgeserver.onrender.com/api/v1/school-supplies/distribution/${selectedSchoolSuppliesDistribution.id}/update-status/`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            if (newStatus === 'completed') {
                await axios.put(
                    `https://greenbridgeserver.onrender.com/api/v1/school-supplies/distribution/${selectedSchoolSuppliesDistribution.id}/complete/`,
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
                `https://greenbridgeserver.onrender.com/api/v1/book/request/${selectedRequest.id}/distribution/`,
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
                `https://greenbridgeserver.onrender.com/api/v1/book/request/${requestId}/distribution/get/`,
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
                `https://greenbridgeserver.onrender.com/api/v1/book/distribution/${selectedBookDistribution.id}/update-status/`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            if (newStatus === 'completed') {
                await axios.put(
                    `https://greenbridgeserver.onrender.com/api/v1/book/distribution/${selectedBookDistribution.id}/complete/`,
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
                        {request.status === 'approved' && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                    A food quality report is required before collection or cancellation.
                                </Typography>
                            </Alert>
                        )}
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {activeTab === 0 && (
                            <Box sx={{ mb: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <ErrorIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    Quality report required
                                </Typography>
                            </Box>
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => {
                                // Show dialog for food with quality report or directly mark collected for other types
                                if (activeTab === 0) {
                                    initializeQualityFormForCollection(request.id);
                                } else {
                                    handleMarkAsCollected(request.id);
                                }
                            }}
                        >
                            {activeTab === 0 ? 'Collect & Report Quality' : 'Mark as Collected'}
                        </Button>
                        
                        <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            onClick={() => handleCancelRequest(request.id)}
                        >
                            Cancel Request
                        </Button>
                    </Box>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Volunteer Dashboard
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<HistoryIcon />}
                        onClick={() => setShowActivities(true)}
                    >
                        View Activity History
                    </Button>
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

                {/* Activity History Dialog */}
                <Dialog
                    open={showActivities}
                    onClose={() => setShowActivities(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <HistoryIcon sx={{ mr: 1 }} />
                            Your Activity History
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        {loadingActivities ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : activities.length > 0 ? (
                            <ActivityHistory activities={activities} />
                        ) : (
                            <Typography sx={{ textAlign: 'center', py: 3 }}>
                                No activities recorded yet.
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowActivities(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

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
                    {activeTab === 0 && selectedRequest && selectedRequest.status === 'approved' && (
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                                setOpenDialog(false);
                                initializeQualityFormForCollection(selectedRequest.id);
                            }}
                        >
                            Collect & Report Quality
                        </Button>
                    )}
                    {activeTab !== 0 && selectedRequest && selectedRequest.status === 'approved' && (
                        <Button 
                            variant="contained" 
                            color="success"
                            onClick={() => handleMarkAsCollected(selectedRequest.id)}
                        >
                            Mark as Collected
                        </Button>
                    )}
                    
                    {selectedRequest && selectedRequest.status === 'approved' && (
                        <Button 
                            variant="outlined" 
                            color="error"
                            onClick={() => handleCancelRequest(selectedRequest.id)}
                        >
                            Cancel Request
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

                {/* Quality Report Form */}
                {activeTab === 0 && (
                <QualityReportForm
                    open={showQualityForm}
                    onClose={() => {
                        setShowQualityForm(false);
                        setIsCancellationFlow(false);
                    }}
                    requestId={selectedRequest}
                    isCancellation={isCancellationFlow}
                    onSubmitSuccess={(reportData) => {
                        handleQualityReportSubmit(reportData);
                    }}
                />
                )}

                {/* Add Distribution Plan Form Dialog */}
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
                                    onSubmit={(data) => {
                                        console.log("DistributionPlan submit callback with data:", data);
                                        return handleCreateDistribution(data);
                                    }}
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

                {/* Add Distribution Details Dialog */}
                <DistributionDetails
                    open={showDistributionDetails}
                    onClose={() => setShowDistributionDetails(false)}
                    distribution={selectedDistribution}
                    onStatusUpdate={(newStatus) => handleDistributionStatusUpdate(newStatus, selectedDistribution.id, selectedDistribution.food_request, 'food')}
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
                    onStatusUpdate={(newStatus) => handleDistributionStatusUpdate(newStatus, selectedGroceryDistribution.id, selectedGroceryDistribution.grocery_request, 'grocery')}
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
                    onStatusUpdate={(newStatus) => handleDistributionStatusUpdate(newStatus, selectedSchoolSuppliesDistribution.id, selectedSchoolSuppliesDistribution.school_supplies_request, 'school-supplies')}
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
                    onStatusUpdate={(newStatus) => handleDistributionStatusUpdate(newStatus, selectedBookDistribution.id, selectedBookDistribution.book_request, 'book')}
                />
            </Box>
        </Box>
    );
};

export default VolunteerDashboard;