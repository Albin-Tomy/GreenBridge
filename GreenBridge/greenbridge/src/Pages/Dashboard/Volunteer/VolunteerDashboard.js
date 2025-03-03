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
import VolunteerPoints from './VolunteerPoints';
import QualityReportForm from './QualityReportForm';

const VolunteerDashboard = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [showQualityForm, setShowQualityForm] = useState(false);
    const [error, setError] = useState(null);

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
                headers: { Authorization: `Bearer ${token}` },
                params: { status: 'approved' }
            });

            const approvedRequests = response.data.filter(request => request.status === 'approved');
            setRequests(approvedRequests);
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
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            fetchApprovedRequests();
            setOpenDialog(false);
        } catch (error) {
            console.error('Error updating status:', error);
            setError('Failed to update status. Please try again.');
        }
    };

    const handleQualityIssue = (requestId) => {
        setSelectedRequest(requestId);
        setShowQualityForm(true);
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
                    {activeTab === 0 && (
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<ErrorIcon />}
                            onClick={() => handleQualityIssue(request.id)}
                        >
                            Report Issue
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleMarkAsCollected(request.id)}
                    >
                        Collect
                    </Button>
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />

            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                <Box sx={{ mb: 4 }}>
                    <VolunteerPoints />
                </Box>

                <Tabs 
                    value={activeTab} 
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{ mb: 3 }}
                >
                    <Tab icon={<RestaurantIcon />} label="Food" />
                    <Tab icon={<ShoppingBasketIcon />} label="Grocery" />
                    <Tab icon={<MenuBookIcon />} label="Books" />
                    <Tab icon={<SchoolIcon />} label="School Supplies" />
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
                                                <Chip label="APPROVED" color="success" size="small" />
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
                        onSubmitSuccess={() => {
                            setShowQualityForm(false);
                            fetchApprovedRequests();
                        }}
                    />
                )}
            </Box>
        </Box>
    );
};

export default VolunteerDashboard;