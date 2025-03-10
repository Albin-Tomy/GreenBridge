import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    Chip,
    Stack
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const BENEFICIARY_TYPES = [
    'school',
    'ngo',
    'community_center',
    'individual_students',
    'orphanage',
    'other'
];

const GRADE_LEVELS = [
    'Primary 1-4',
    'Primary 5-7',
    'Secondary 1-2',
    'Secondary 3-4',
    'Secondary 5-6',
    'College'
];

const SchoolSuppliesDistributionPlan = ({ suppliesRequest, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        distribution_date: null,
        distribution_location: '',
        beneficiary_type: '',
        beneficiary_name: '',
        beneficiary_contact: '',
        number_of_students: '',
        grade_levels: [],
        notes: '',
        status: 'planned'
    });

    const handleGradeLevelToggle = (grade) => {
        const currentGrades = formData.grade_levels || [];
        const newGrades = currentGrades.includes(grade)
            ? currentGrades.filter(g => g !== grade)
            : [...currentGrades, grade];
        
        setFormData({
            ...formData,
            grade_levels: newGrades
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error creating school supplies distribution plan:', error);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Create School Supplies Distribution Plan
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
                            label="Number of Students"
                            value={formData.number_of_students}
                            onChange={(e) => setFormData({
                                ...formData,
                                number_of_students: e.target.value
                            })}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Grade Levels
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {GRADE_LEVELS.map((grade) => (
                                <Chip
                                    key={grade}
                                    label={grade}
                                    onClick={() => handleGradeLevelToggle(grade)}
                                    color={formData.grade_levels?.includes(grade) ? "primary" : "default"}
                                    sx={{ m: 0.5 }}
                                />
                            ))}
                        </Stack>
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

export default SchoolSuppliesDistributionPlan; 