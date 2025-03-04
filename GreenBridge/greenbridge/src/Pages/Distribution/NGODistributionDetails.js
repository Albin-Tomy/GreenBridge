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

const NGODistributionDetails = ({ open, onClose, distribution }) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const formatDate = (dateString) => {
        try {
            if (!dateString) return 'Not set';
            const date = parseISO(dateString);
            return format(date, 'PPpp');
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date';
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                Distribution Details
                <Chip 
                    label="COMPLETED"
                    color="success"
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
                            <Typography variant="subtitle1">Actual Beneficiaries</Typography>
                            <Typography>{distribution?.actual_beneficiaries || 'Not recorded'}</Typography>
                        </Grid>

                        {distribution?.food_condition_on_delivery && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">Food Condition on Delivery</Typography>
                                <Typography>{distribution.food_condition_on_delivery}</Typography>
                            </Grid>
                        )}

                        {distribution?.notes && (
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">Notes</Typography>
                                <Typography>{distribution.notes}</Typography>
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
            </DialogActions>
        </Dialog>
    );
};

export default NGODistributionDetails; 