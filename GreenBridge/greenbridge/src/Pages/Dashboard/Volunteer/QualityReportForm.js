import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Grid,
    CircularProgress,
    Alert,
    FormHelperText
} from '@mui/material';
import axios from 'axios';

const QualityReportForm = ({ open, onClose, requestId, onSubmitSuccess, isCancellation = false }) => {
    const [formData, setFormData] = useState({
        issue_type: isCancellation ? 'other' : 'good',  // Default to 'other' for cancellation
        description: '',
        temperature: '',
        packaging_integrity: true,
        labeling_accuracy: true,
        allergen_check: true,
        hygiene_check: true,
        weight_check: '',
        visual_inspection: true,
        smell_test: true,
        expiration_check: true,
        storage_condition: ''
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Reset form when dialog opens with a new request or when isCancellation changes
    useEffect(() => {
        if (open && requestId) {
            resetForm();
        }
    }, [open, requestId, isCancellation]);

    const validateForm = () => {
        const newErrors = {};
        
        // Validate issue type
        if (!formData.issue_type) {
            newErrors.issue_type = 'Please select an issue type';
        }
        
        // Description is always required for cancellation
        if (isCancellation && !formData.description.trim()) {
            newErrors.description = 'Please provide a detailed reason for cancellation';
        }
        // If issue type is not 'good', description is required
        else if (formData.issue_type !== 'good' && !formData.description.trim()) {
            newErrors.description = 'Please provide a detailed description of the issue';
        }
        
        // If issue type is 'temperature_issue', temperature is required
        if (formData.issue_type === 'temperature_issue' && !formData.temperature) {
            newErrors.temperature = 'Temperature is required for temperature issues';
        }
        
        // Validate temperature format if provided
        if (formData.temperature && (isNaN(formData.temperature) || formData.temperature < -50 || formData.temperature > 100)) {
            newErrors.temperature = 'Please enter a valid temperature between -50°C and 100°C';
        }
        
        // Validate weight if provided
        if (formData.weight_check && (isNaN(formData.weight_check) || formData.weight_check <= 0)) {
            newErrors.weight_check = 'Please enter a valid weight value greater than 0';
        }
        
        // If multiple quality checks are failing, require description
        const failingChecks = [
            formData.packaging_integrity,
            formData.labeling_accuracy,
            formData.allergen_check,
            formData.hygiene_check,
            formData.visual_inspection,
            formData.smell_test,
            formData.expiration_check
        ].filter(check => !check).length;
        
        if (failingChecks > 0 && !formData.description.trim()) {
            newErrors.description = 'Description is required when quality checks are failing';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Clear field-specific error when changed
        setErrors(prev => ({
            ...prev,
            [name]: undefined
        }));
        
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        
        // Special validation for issue type changes
        if (name === 'issue_type' && value === 'good') {
            // Auto-select all quality checks as passed for "Good Quality"
            setFormData(prev => ({
                ...prev,
                issue_type: value,
                packaging_integrity: true,
                labeling_accuracy: true,
                allergen_check: true,
                hygiene_check: true,
                visual_inspection: true,
                smell_test: true,
                expiration_check: true
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form before submission
        if (!validateForm()) {
            setError('Please correct the errors in the form');
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            await onSubmitSuccess(formData);  // Pass the form data to parent
            setSuccess(true);
            setTimeout(() => {
                resetForm();
                onClose();
            }, 1000);
        } catch (error) {
            console.error('Error submitting quality report:', error);
            setError(error.response?.data?.error || 'Failed to submit quality report');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            issue_type: isCancellation ? 'other' : 'good',
            description: '',
            temperature: '',
            packaging_integrity: true,
            labeling_accuracy: true,
            allergen_check: true,
            hygiene_check: true,
            weight_check: '',
            visual_inspection: true,
            smell_test: true,
            expiration_check: true,
            storage_condition: ''
        });
        setErrors({});
        setError(null);
        setSuccess(false);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {isCancellation ? 'Reason for Cancellation' : 'Submit Food Quality Report'}
                {requestId && <Typography variant="subtitle2" color="text.secondary">
                    for Request #{requestId}
                </Typography>}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>Quality report submitted successfully!</Alert>}
                    
                    {isCancellation && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                Before cancelling this food request, please provide a detailed reason and complete the quality assessment.
                            </Typography>
                        </Alert>
                    )}

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors.issue_type}>
                                <InputLabel>Issue Type *</InputLabel>
                                <Select
                                    name="issue_type"
                                    value={formData.issue_type}
                                    onChange={handleChange}
                                    label="Issue Type *"
                                    required
                                >
                                    {!isCancellation && <MenuItem value="good">Good Quality</MenuItem>}
                                    <MenuItem value="expired">Food Expired</MenuItem>
                                    <MenuItem value="contaminated">Food Contaminated</MenuItem>
                                    <MenuItem value="spoiled">Food Spoiled</MenuItem>
                                    <MenuItem value="packaging_damaged">Packaging Damaged</MenuItem>
                                    <MenuItem value="temperature_issue">Temperature Control Issue</MenuItem>
                                    <MenuItem value="other">Other Issue</MenuItem>
                                </Select>
                                {errors.issue_type && <FormHelperText>{errors.issue_type}</FormHelperText>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="description"
                                label={isCancellation ? "Reason for Cancellation" : "Description"}
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={4}
                                required={isCancellation || formData.issue_type !== 'good'}
                                error={!!errors.description}
                                helperText={errors.description || (isCancellation ? 'Required - explain why this request is being cancelled' : formData.issue_type !== 'good' ? 'Required for non-good quality reports' : '')}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name="temperature"
                                label="Temperature (Celsius)"
                                type="number"
                                value={formData.temperature}
                                onChange={handleChange}
                                required={formData.issue_type === 'temperature_issue'}
                                error={!!errors.temperature}
                                helperText={errors.temperature}
                                InputProps={{ 
                                    inputProps: { min: -50, max: 100 }
                                }}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name="weight_check"
                                label="Weight (kg)"
                                type="number"
                                value={formData.weight_check}
                                onChange={handleChange}
                                error={!!errors.weight_check}
                                helperText={errors.weight_check}
                                InputProps={{ 
                                    inputProps: { min: 0 }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="storage_condition"
                                label="Storage Condition"
                                value={formData.storage_condition}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Food Quality Checks:
                            </Typography>
                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="packaging_integrity"
                                                checked={formData.packaging_integrity}
                                                onChange={handleChange}
                                            />
                                        }
                                        label="Packaging Integrity"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="labeling_accuracy"
                                                checked={formData.labeling_accuracy}
                                                onChange={handleChange}
                                            />
                                        }
                                        label="Labeling Accuracy"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="allergen_check"
                                                checked={formData.allergen_check}
                                                onChange={handleChange}
                                            />
                                        }
                                        label="Allergen Check"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="hygiene_check"
                                                checked={formData.hygiene_check}
                                                onChange={handleChange}
                                            />
                                        }
                                        label="Hygiene Check"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="visual_inspection"
                                                checked={formData.visual_inspection}
                                                onChange={handleChange}
                                            />
                                        }
                                        label="Visual Inspection"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="smell_test"
                                                checked={formData.smell_test}
                                                onChange={handleChange}
                                            />
                                        }
                                        label="Smell Test"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="expiration_check"
                                                checked={formData.expiration_check}
                                                onChange={handleChange}
                                            />
                                        }
                                        label="Expiration Check"
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color={isCancellation ? "error" : "primary"}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : isCancellation ? 'Cancel Request' : 'Submit Report'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default QualityReportForm;