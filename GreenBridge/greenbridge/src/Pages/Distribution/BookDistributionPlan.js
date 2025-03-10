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
    'school',
    'library',
    'community_center',
    'individual_students',
    'ngo',
    'other'
];

const BookDistributionPlan = ({ bookRequest, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        distribution_date: null,
        distribution_location: '',
        beneficiary_type: '',
        beneficiary_name: '',
        beneficiary_contact: '',
        number_of_beneficiaries: '',
        education_level: '',
        subject_preferences: '',
        notes: '',
        status: 'planned'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error creating book distribution plan:', error);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Create Book Distribution Plan
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
                                    {type.replace('_', ' ').charAt(0).toUpperCase() + type.slice(1)}
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
                            label="Number of Beneficiaries"
                            value={formData.number_of_beneficiaries}
                            onChange={(e) => setFormData({
                                ...formData,
                                number_of_beneficiaries: e.target.value
                            })}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Education Level"
                            value={formData.education_level}
                            onChange={(e) => setFormData({
                                ...formData,
                                education_level: e.target.value
                            })}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Subject Preferences"
                            value={formData.subject_preferences}
                            onChange={(e) => setFormData({
                                ...formData,
                                subject_preferences: e.target.value
                            })}
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="Enter subject preferences or requirements"
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

export default BookDistributionPlan; 