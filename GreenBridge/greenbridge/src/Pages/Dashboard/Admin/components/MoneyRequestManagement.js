import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Alert,
    Grid
} from '@mui/material';
import axios from 'axios';
import { Download as DownloadIcon } from '@mui/icons-material';

const MoneyRequestManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    const [transferReference, setTransferReference] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [ngoProfile, setNgoProfile] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(
                'http://127.0.0.1:8000/api/v1/donations/ngo/money-request/all/',
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('Money requests:', response.data); // Debug log
            
            // Log the first NGO structure if available
            if (response.data && response.data.length > 0 && response.data[0].ngo) {
                console.log('NGO data structure:', response.data[0].ngo);
            }
            
            setRequests(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch money requests:', err);
            setError('Failed to fetch money requests');
            setLoading(false);
        }
    };

    const fetchRequestDetails = async (requestId) => {
        try {
            const token = localStorage.getItem('authToken');
            
            // Fetch money request details
            const requestResponse = await axios.get(
                `http://127.0.0.1:8000/api/v1/donations/ngo/money-request/${requestId}/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Fetch NGO profile details using the NGO's email from the request
            const ngoProfileResponse = await axios.get(
                `http://127.0.0.1:8000/api/v1/ngo/profile/${requestResponse.data.ngo.email}/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSelectedRequest(requestResponse.data);
            setNgoProfile(ngoProfileResponse.data);
            setOpenDialog(true);
            setAdminNotes(requestResponse.data.admin_notes || '');
        } catch (err) {
            console.error('Failed to fetch request details:', err);
            setError('Failed to fetch complete request details');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'warning',
            approved: 'info',
            rejected: 'error',
            transferred: 'success',
            cancelled: 'default'
        };
        return colors[status] || 'default';
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!adminNotes.trim() && (newStatus === 'approved' || newStatus === 'rejected')) {
            setError('Please provide admin notes explaining your decision');
            return;
        }

        if (newStatus === 'transferred' && !transferReference.trim()) {
            setError('Please provide transfer reference number');
            return;
        }

        setActionLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('authToken');
            const data = {
                status: newStatus,
                admin_notes: adminNotes
            };

            if (newStatus === 'transferred') {
                data.transfer_reference = transferReference;
            }

            await axios.put(
                `http://127.0.0.1:8000/api/v1/donations/ngo/money-request/${selectedRequest.id}/update-status/`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await fetchRequests();
            setOpenDialog(false);
            setSelectedRequest(null);
            setAdminNotes('');
            setTransferReference('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update status');
        } finally {
            setActionLoading(false);
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const handleDocumentDownload = (documentUrl, documentName) => {
        if (!documentUrl) {
            setError('Document URL is missing or invalid');
            return;
        }
        
        // Check if the URL is already absolute
        let fullUrl = documentUrl;
        if (!documentUrl.startsWith('http')) {
            // Add backend base URL if the path is relative
            fullUrl = `http://127.0.0.1:8000${documentUrl}`;
        }
        
        console.log('Downloading from:', fullUrl);
        
        // Use fetch API to download the file without navigating away
        fetch(fullUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
                }
                return response.blob();
            })
            .then(blob => {
                // Create a blob URL and trigger download
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = documentName;
                document.body.appendChild(link);
                link.click();
                
                // Clean up
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            })
            .catch(error => {
                console.error('Download error:', error);
                setError(`Failed to download document: ${error.message}`);
            });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                NGO Money Requests
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>NGO Name</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Purpose</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell>
                                    {request.ngo?.name || 
                                     (request.ngo && typeof request.ngo === 'object' ? 
                                      request.ngo.username || request.ngo.email || 'Unknown NGO' : 'N/A')}
                                </TableCell>
                                <TableCell>{formatAmount(request.amount)}</TableCell>
                                <TableCell>{request.purpose_display || request.purpose}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={request.status_display || request.status}
                                        color={getStatusColor(request.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {new Date(request.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                            fetchRequestDetails(request.id);
                                        }}
                                    >
                                        Manage
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
            >
                {selectedRequest && (
                    <>
                        <DialogTitle>
                            Money Request Details
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ p: 2 }}>
                                <Grid container spacing={2}>
                                    {/* Basic Request Details */}
                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>Request Details</Typography>
                                        <Paper sx={{ p: 2, mb: 2 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography><strong>Amount:</strong> {formatAmount(selectedRequest.amount)}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography><strong>Purpose:</strong> {selectedRequest.purpose_display || selectedRequest.purpose}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography><strong>Status:</strong> {selectedRequest.status_display || selectedRequest.status}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography><strong>Date:</strong> {new Date(selectedRequest.created_at).toLocaleDateString()}</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography><strong>Description:</strong></Typography>
                                                    <Typography variant="body2">{selectedRequest.description}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>

                                    {/* NGO Details */}
                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>NGO Details</Typography>
                                        <Paper sx={{ p: 2, mb: 2 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography><strong>NGO Name:</strong> {
                                                        ngoProfile?.ngo_name || 
                                                        selectedRequest?.ngo?.name || 
                                                        (selectedRequest?.ngo && typeof selectedRequest.ngo === 'object' ? 
                                                            selectedRequest.ngo.username || selectedRequest.ngo.email : 'N/A')
                                                    }</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography><strong>Registration Number:</strong> {ngoProfile?.registration_number || 'N/A'}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography><strong>Contact Person:</strong> {ngoProfile?.contact_person || 'N/A'}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography><strong>Contact Phone:</strong> {ngoProfile?.contact_phone || 'N/A'}</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography><strong>Address:</strong> {ngoProfile?.address || 'N/A'}</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography><strong>Description:</strong> {ngoProfile?.description || 'N/A'}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>

                                    {/* Bank Details */}
                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>Bank Details</Typography>
                                        <Paper sx={{ p: 2, mb: 2 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography><strong>Account Name:</strong> {ngoProfile?.bank_account_name || 'N/A'}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography><strong>Account Number:</strong> {ngoProfile?.bank_account_number || 'N/A'}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography><strong>Bank Name:</strong> {ngoProfile?.bank_name || 'N/A'}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography><strong>Bank Branch:</strong> {ngoProfile?.bank_branch || 'N/A'}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography><strong>IFSC Code:</strong> {ngoProfile?.ifsc_code || 'N/A'}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>

                                    {/* Required Documents */}
                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>Required Documents</Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <Paper sx={{ p: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography><strong>Necessity Certificate</strong></Typography>
                                                    {selectedRequest.necessity_certificate_url ? (
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<DownloadIcon />}
                                                            onClick={() => handleDocumentDownload(
                                                                selectedRequest.necessity_certificate_url,
                                                                `necessity_certificate_${selectedRequest.id}.pdf`
                                                            )}
                                                        >
                                                            Download
                                                        </Button>
                                                    ) : (
                                                        <Typography color="text.secondary">No file available</Typography>
                                                    )}
                                                </Box>
                                            </Paper>

                                            <Paper sx={{ p: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography><strong>Budget Document</strong></Typography>
                                                    {selectedRequest.budget_document_url ? (
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<DownloadIcon />}
                                                            onClick={() => handleDocumentDownload(
                                                                selectedRequest.budget_document_url,
                                                                `budget_document_${selectedRequest.id}.pdf`
                                                            )}
                                                        >
                                                            Download
                                                        </Button>
                                                    ) : (
                                                        <Typography color="text.secondary">No file available</Typography>
                                                    )}
                                                </Box>
                                            </Paper>

                                                    {selectedRequest.project_proposal_url && (
                                                        <Paper sx={{ p: 2 }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Typography><strong>Project Proposal</strong></Typography>
                                                                <Button
                                                                    variant="outlined"
                                                                    startIcon={<DownloadIcon />}
                                                                    onClick={() => handleDocumentDownload(
                                                                        selectedRequest.project_proposal_url,
                                                                        `project_proposal_${selectedRequest.id}.pdf`
                                                                    )}
                                                                >
                                                                    Download
                                                                </Button>
                                                            </Box>
                                                        </Paper>
                                                    )}

                                                    {selectedRequest.additional_documents_url && (
                                                        <Paper sx={{ p: 2 }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Typography><strong>Additional Documents</strong></Typography>
                                                                <Button
                                                                    variant="outlined"
                                                                    startIcon={<DownloadIcon />}
                                                                    onClick={() => handleDocumentDownload(
                                                                        selectedRequest.additional_documents_url,
                                                                        `additional_documents_${selectedRequest.id}.pdf`
                                                                    )}
                                                                >
                                                                    Download
                                                                </Button>
                                                            </Box>
                                                        </Paper>
                                                    )}
                                        </Box>
                                    </Grid>

                                    {/* Admin Notes and Transfer Reference */}
                                    {selectedRequest.status === 'pending' && (
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Admin Notes"
                                                multiline
                                                rows={3}
                                                value={adminNotes}
                                                onChange={(e) => setAdminNotes(e.target.value)}
                                                sx={{ mt: 2 }}
                                                required
                                            />
                                        </Grid>
                                    )}

                                    {selectedRequest.status === 'approved' && (
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Transfer Reference Number"
                                                value={transferReference}
                                                onChange={(e) => setTransferReference(e.target.value)}
                                                sx={{ mt: 2 }}
                                                required
                                            />
                                        </Grid>
                                    )}

                                    {selectedRequest.admin_notes && (
                                        <Grid item xs={12}>
                                            <Typography variant="h6" sx={{ mt: 2 }}>Previous Admin Notes</Typography>
                                            <Typography variant="body2">{selectedRequest.admin_notes}</Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)}>Close</Button>
                            {selectedRequest.status === 'pending' && (
                                <>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleStatusUpdate('approved')}
                                        disabled={actionLoading}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleStatusUpdate('rejected')}
                                        disabled={actionLoading}
                                    >
                                        Reject
                                    </Button>
                                </>
                            )}
                            {selectedRequest.status === 'approved' && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleStatusUpdate('transferred')}
                                    disabled={actionLoading || !transferReference.trim()}
                                >
                                    Mark as Transferred
                                </Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default MoneyRequestManagement; 