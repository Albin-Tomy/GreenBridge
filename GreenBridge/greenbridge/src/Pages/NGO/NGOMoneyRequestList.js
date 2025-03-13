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
    Alert
} from '@mui/material';
import axios from 'axios';

const NGOMoneyRequestList = ({ isAdmin = false }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    const [transferReference, setTransferReference] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const endpoint = isAdmin 
                ? 'http://127.0.0.1:8000/api/v1/donations/ngo/money-request/all/'
                : 'http://127.0.0.1:8000/api/v1/donations/ngo/money-request/my-requests/';
            
            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [isAdmin]);

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
        setActionLoading(true);
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
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            fetchRequests();
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

    const handleAddUpdate = async () => {
        if (!updateMessage.trim()) return;

        setActionLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                `http://127.0.0.1:8000/api/v1/donations/ngo/money-request/${selectedRequest.id}/add-update/`,
                { message: updateMessage },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            fetchRequests();
            setUpdateMessage('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add update');
        } finally {
            setActionLoading(false);
        }
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
            <Typography variant="h5" gutterBottom>
                {isAdmin ? 'All Money Requests' : 'My Money Requests'}
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
                            <TableCell>Date</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Purpose</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell>
                                    {new Date(request.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>₹{request.amount}</TableCell>
                                <TableCell>{request.purpose_display}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={request.status_display}
                                        color={getStatusColor(request.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                            setSelectedRequest(request);
                                            setOpenDialog(true);
                                        }}
                                    >
                                        View Details
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
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1">Amount: ₹{selectedRequest.amount}</Typography>
                                <Typography variant="subtitle1">Purpose: {selectedRequest.purpose_display}</Typography>
                                <Typography variant="subtitle1">Status: {selectedRequest.status_display}</Typography>
                                <Typography variant="subtitle1">Description:</Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>{selectedRequest.description}</Typography>

                                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Bank Details</Typography>
                                <Typography variant="body2">Account Name: {selectedRequest.bank_account_name}</Typography>
                                <Typography variant="body2">Account Number: {selectedRequest.bank_account_number}</Typography>
                                <Typography variant="body2">Bank: {selectedRequest.bank_name}</Typography>
                                <Typography variant="body2">Branch: {selectedRequest.bank_branch}</Typography>
                                <Typography variant="body2">IFSC: {selectedRequest.ifsc_code}</Typography>

                                {selectedRequest.admin_notes && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle1">Admin Notes:</Typography>
                                        <Typography variant="body2">{selectedRequest.admin_notes}</Typography>
                                    </Box>
                                )}

                                {selectedRequest.updates?.length > 0 && (
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="h6">Updates</Typography>
                                        {selectedRequest.updates.map((update, index) => (
                                            <Paper key={index} sx={{ p: 2, mt: 1 }}>
                                                <Typography variant="body2">{update.message}</Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    By {update.created_by.name} on {new Date(update.created_at).toLocaleString()}
                                                </Typography>
                                            </Paper>
                                        ))}
                                    </Box>
                                )}

                                {isAdmin && selectedRequest.status !== 'transferred' && (
                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="h6">Update Status</Typography>
                                        <TextField
                                            fullWidth
                                            label="Admin Notes"
                                            multiline
                                            rows={2}
                                            value={adminNotes}
                                            onChange={(e) => setAdminNotes(e.target.value)}
                                            sx={{ mt: 1 }}
                                        />
                                        {selectedRequest.status === 'approved' && (
                                            <TextField
                                                fullWidth
                                                label="Transfer Reference"
                                                value={transferReference}
                                                onChange={(e) => setTransferReference(e.target.value)}
                                                sx={{ mt: 2 }}
                                            />
                                        )}
                                        <Box sx={{ mt: 2 }}>
                                            {selectedRequest.status === 'pending' && (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleStatusUpdate('approved')}
                                                        disabled={actionLoading}
                                                        sx={{ mr: 1 }}
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
                                                    disabled={actionLoading || !transferReference}
                                                >
                                                    Mark as Transferred
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>
                                )}

                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="h6">Add Update</Typography>
                                    <TextField
                                        fullWidth
                                        label="Message"
                                        multiline
                                        rows={2}
                                        value={updateMessage}
                                        onChange={(e) => setUpdateMessage(e.target.value)}
                                        sx={{ mt: 1 }}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleAddUpdate}
                                        disabled={actionLoading || !updateMessage.trim()}
                                        sx={{ mt: 1 }}
                                    >
                                        Add Update
                                    </Button>
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default NGOMoneyRequestList; 