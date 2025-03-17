import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const BENEFICIARY_TYPES = [
    'Orphanage',
    'Old Age Home',
    'Homeless Shelter',
    'Community Center',
    'Other'
];

const DistributionPlan = ({ foodRequest, foodRequestId, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        distribution_date: null,
        distribution_location: '',
        beneficiary_type: '',
        beneficiary_name: '',
        beneficiary_contact: '',
        estimated_beneficiaries: '',
        notes: '',
    });

    const resetForm = () => {
        setFormData({
            distribution_date: null,
            distribution_location: '',
            beneficiary_type: '',
            beneficiary_name: '',
            beneficiary_contact: '',
            estimated_beneficiaries: '',
            notes: '',
        });
        
        if (onClose) {
            onClose();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prepare the data for submission
        const submissionData = {
            ...formData,
            food_request_id: foodRequestId || (foodRequest && foodRequest.id),
            distribution_date: formData.distribution_date ? formData.distribution_date.toISOString() : null,
        };
        
        console.log('Submitting distribution plan data:', submissionData);
        
        try {
            await onSubmit(submissionData);
            // Reset form after successful submission
            resetForm();
        } catch (error) {
            console.error('Error in distribution plan submission:', error);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Create Distribution Plan
                </Typography>
                
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <DateTimePicker
                            label="Distribution Date & Time"
                            value={formData.distribution_date}
                            onChange={(newValue) => setFormData({
                                ...formData,
                                distribution_date: newValue
                            })}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Distribution Location"
                            value={formData.distribution_location}
                            onChange={(e) => setFormData({
                                ...formData,
                                distribution_location: e.target.value
                            })}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            select
                            label="Beneficiary Type"
                            value={formData.beneficiary_type}
                            onChange={(e) => setFormData({
                                ...formData,
                                beneficiary_type: e.target.value
                            })}
                            fullWidth
                            required
                        >
                            {BENEFICIARY_TYPES.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Beneficiary Name"
                            value={formData.beneficiary_name}
                            onChange={(e) => setFormData({
                                ...formData,
                                beneficiary_name: e.target.value
                            })}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Beneficiary Contact"
                            value={formData.beneficiary_contact}
                            onChange={(e) => setFormData({
                                ...formData,
                                beneficiary_contact: e.target.value
                            })}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            type="number"
                            label="Estimated Beneficiaries"
                            value={formData.estimated_beneficiaries}
                            onChange={(e) => setFormData({
                                ...formData,
                                estimated_beneficiaries: e.target.value
                            })}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Additional Notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({
                                ...formData,
                                notes: e.target.value
                            })}
                            multiline
                            rows={4}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            fullWidth
                        >
                            Create Distribution Plan
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </LocalizationProvider>
    );
};

export default DistributionPlan; 