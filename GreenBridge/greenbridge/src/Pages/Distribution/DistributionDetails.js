import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Chip,
    Alert,
    CircularProgress
} from '@mui/material';
import { format, parseISO } from 'date-fns';

const DistributionDetails = ({ open, onClose, distribution, onStatusUpdate }) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const getStatusColor = (status) => {
        switch(status) {
            case 'planned':
                return 'info';
            case 'in_progress':
                return 'warning';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString) => {
        try {
            if (!dateString) return 'Not set';
            // Parse the ISO string to a Date object
            const date = parseISO(dateString);
            return format(date, 'PPpp');
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    const handleStartDistribution = () => {
        onStatusUpdate('in_progress');
    };

    const handleCompleteDistribution = () => {
        onStatusUpdate('completed');
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Distribution Plan Details
                {distribution?.status && (
                    <Chip 
                        label={distribution.status.toUpperCase()} 
                        color={getStatusColor(distribution.status)}
                        size="small"
                        sx={{ ml: 2 }}
                    />
                )}
            </DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : distribution ? (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">Distribution Date & Time</Typography>
                            <Typography>
                                {formatDate(distribution?.distribution_date)}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1">Location</Typography>
                            <Typography>{distribution?.distribution_location || 'Not specified'}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">Beneficiary Type</Typography>
                            <Typography>{distribution?.beneficiary_type || 'Not specified'}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">Beneficiary Name</Typography>
                            <Typography>{distribution?.beneficiary_name || 'Not specified'}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">Contact</Typography>
                            <Typography>{distribution?.beneficiary_contact || 'Not specified'}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">Estimated Beneficiaries</Typography>
                            <Typography>{distribution?.estimated_beneficiaries || 'Not specified'}</Typography>
                        </Grid>

                        {distribution?.notes && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">Notes</Typography>
                                <Typography>{distribution?.notes}</Typography>
                            </Grid>
                        )}
                    </Grid>
                ) : (
                    <Typography color="text.secondary">
                        No distribution details available
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                {distribution?.status === 'planned' && (
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={handleStartDistribution}
                    >
                        Start Distribution
                    </Button>
                )}
                {distribution?.status === 'in_progress' && (
                    <Button 
                        variant="contained" 
                        color="success"
                        onClick={handleCompleteDistribution}
                    >
                        Complete Distribution
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default DistributionDetails; 