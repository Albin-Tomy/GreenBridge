import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Chip,
    Grid,
    CircularProgress,
    Alert,
} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';

const getStatusColor = (status) => {
    switch (status) {
        case 'planned':
            return 'primary';
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
        return format(new Date(dateString), 'PPpp');
    } catch (error) {
        return 'Invalid Date';
    }
};

const BookDistributionDetails = ({
    open,
    onClose,
    distribution,
    onStartDistribution,
    onCompleteDistribution,
}) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleStartDistribution = async () => {
        setError('');
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.put(
                `https://greenbridgeserver.onrender.com/api/v1/book/distribution/${distribution.id}/start/`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            if (response.data && response.data.status === 'in_progress') {
                if (onStartDistribution) {
                    await onStartDistribution();
                }
            }
        } catch (error) {
            console.error('Error starting distribution:', error);
            setError(error.response?.data?.error || 'Failed to start distribution. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteDistribution = async () => {
        setError('');
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.put(
                `https://greenbridgeserver.onrender.com/api/v1/book/distribution/${distribution.id}/complete/`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            if (response.data && response.data.message) {
                if (onCompleteDistribution) {
                    await onCompleteDistribution();
                }
            }
        } catch (error) {
            console.error('Error completing distribution:', error);
            setError(error.response?.data?.error || 'Failed to complete distribution. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!distribution) {
        return null;
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Book Distribution Details
                <Chip
                    label={distribution.status}
                    color={getStatusColor(distribution.status)}
                    size="small"
                    sx={{ ml: 2 }}
                />
            </DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Distribution Date
                        </Typography>
                        <Typography variant="body1">
                            {formatDate(distribution.distribution_date)}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Location
                        </Typography>
                        <Typography variant="body1">
                            {distribution.distribution_location}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Beneficiary Type
                        </Typography>
                        <Typography variant="body1">
                            {distribution.beneficiary_type}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Beneficiary Name
                        </Typography>
                        <Typography variant="body1">
                            {distribution.beneficiary_name}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Contact
                        </Typography>
                        <Typography variant="body1">
                            {distribution.beneficiary_contact}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Number of Beneficiaries
                        </Typography>
                        <Typography variant="body1">
                            {distribution.number_of_beneficiaries}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Education Level
                        </Typography>
                        <Typography variant="body1">
                            {distribution.education_level}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Subject Preferences
                        </Typography>
                        <Typography variant="body1">
                            {distribution.subject_preferences || 'Not specified'}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Additional Notes
                        </Typography>
                        <Typography variant="body1">
                            {distribution.notes || 'No additional notes'}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
                    {distribution.status === 'planned' && (
                        <Button
                            onClick={handleStartDistribution}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Start Distribution'}
                        </Button>
                    )}
                    {distribution.status === 'in_progress' && (
                        <Button
                            onClick={handleCompleteDistribution}
                            variant="contained"
                            color="success"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Complete Distribution'}
                        </Button>
                    )}
                    <Button onClick={onClose} color="inherit">
                        Close
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default BookDistributionDetails; 