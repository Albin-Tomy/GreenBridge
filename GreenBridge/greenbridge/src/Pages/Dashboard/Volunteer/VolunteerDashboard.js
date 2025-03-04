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
            setSelectedRequest(id);
            setOpenDialog(false);
            setShowQualityForm(true);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to process collection. Please try again.');
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
        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
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
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {activeTab === 0 && request.status === 'collected' && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                setSelectedForDistribution(request.id);
                                setShowDistributionForm(true);
                            }}
                        >
                            Plan Distribution
                        </Button>
                    )}
                    {activeTab === 0 && request.status === 'distribution_planned' && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => fetchDistributionDetails(request.id)}
                        >
                            View Distribution Plan
                        </Button>
                    )}
                    {activeTab === 0 && request.status === 'approved' && (
                        <>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<ErrorIcon />}
                                onClick={() => handleQualityIssue(request.id)}
                            >
                                Report Issue
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleMarkAsCollected(request.id)}
                            >
                                Collect
                            </Button>
                        </>
                    )}
                </Box>
            </Box>
        );
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
            </Box>
        </Box>
    );
};

export default VolunteerDashboard;