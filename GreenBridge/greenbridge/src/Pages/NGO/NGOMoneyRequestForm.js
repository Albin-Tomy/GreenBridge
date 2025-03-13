import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    MenuItem,
    Typography,
    Paper,
    Grid,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    FormHelperText
} from '@mui/material';
import axios from 'axios';

const NGOMoneyRequestForm = () => {
    const [formData, setFormData] = useState({
        amount: '',
        purpose: '',
        description: '',
        bank_account_name: '',
        bank_account_number: '',
        bank_name: '',
        bank_branch: '',
        ifsc_code: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const PURPOSE_CHOICES = [
        { value: 'operational_costs', label: 'Operational Costs' },
        { value: 'emergency_relief', label: 'Emergency Relief' },
        { value: 'project_funding', label: 'Project Funding' },
        { value: 'infrastructure', label: 'Infrastructure Development' },
        { value: 'education_program', label: 'Education Program' },
        { value: 'healthcare_program', label: 'Healthcare Program' },
        { value: 'food_distribution', label: 'Food Distribution Program' },
        { value: 'other', label: 'Other' }
    ];

    const validateForm = () => {
        const newErrors = {};

        // Amount validation
        if (!formData.amount) {
            newErrors.amount = 'Amount is required';
        } else if (isNaN(formData.amount)) {
            newErrors.amount = 'Amount must be a number';
        } else if (parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
        } else if (parseFloat(formData.amount) > 1000000) {
            newErrors.amount = 'Amount cannot exceed ₹10,00,000';
        }

        // Purpose validation
        if (!formData.purpose) {
            newErrors.purpose = 'Purpose is required';
        }

        // Description validation
        if (!formData.description) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length < 50) {
            newErrors.description = 'Description must be at least 50 characters';
        } else if (formData.description.length > 1000) {
            newErrors.description = 'Description cannot exceed 1000 characters';
        }

        // Bank account name validation
        if (!formData.bank_account_name) {
            newErrors.bank_account_name = 'Account holder name is required';
        } else if (formData.bank_account_name.length < 3) {
            newErrors.bank_account_name = 'Account holder name must be at least 3 characters';
        }

        // Bank account number validation
        if (!formData.bank_account_number) {
            newErrors.bank_account_number = 'Account number is required';
        } else if (!/^\d{9,18}$/.test(formData.bank_account_number)) {
            newErrors.bank_account_number = 'Enter a valid account number (9-18 digits)';
        }

        // Bank name validation
        if (!formData.bank_name) {
            newErrors.bank_name = 'Bank name is required';
        } else if (formData.bank_name.length < 3) {
            newErrors.bank_name = 'Bank name must be at least 3 characters';
        }

        // Branch name validation
        if (!formData.bank_branch) {
            newErrors.bank_branch = 'Branch name is required';
        }

        // IFSC code validation
        if (!formData.ifsc_code) {
            newErrors.ifsc_code = 'IFSC code is required';
        } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc_code)) {
            newErrors.ifsc_code = 'Enter a valid IFSC code (e.g., HDFC0123456)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                'http://127.0.0.1:8000/api/v1/donations/ngo/money-request/create/',
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setSuccess(true);
            setFormData({
                amount: '',
                purpose: '',
                description: '',
                bank_account_name: '',
                bank_account_number: '',
                bank_name: '',
                bank_branch: '',
                ifsc_code: '',
            });
            setErrors({});
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Request Funds
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Money request submitted successfully!
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Amount (₹)"
                                name="amount"
                                type="number"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                error={!!errors.amount}
                                helperText={errors.amount}
                                inputProps={{ 
                                    min: 0,
                                    max: 1000000,
                                    step: "0.01"
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required error={!!errors.purpose}>
                                <InputLabel>Purpose</InputLabel>
                                <Select
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    label="Purpose"
                                >
                                    {PURPOSE_CHOICES.map((purpose) => (
                                        <MenuItem key={purpose.value} value={purpose.value}>
                                            {purpose.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.purpose && (
                                    <FormHelperText>{errors.purpose}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                required
                                error={!!errors.description}
                                helperText={errors.description || 'Minimum 50 characters required'}
                                inputProps={{
                                    maxLength: 1000
                                }}
                            />
                            <Typography variant="caption" color="textSecondary">
                                {formData.description.length}/1000 characters
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Bank Details
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Account Holder Name"
                                name="bank_account_name"
                                value={formData.bank_account_name}
                                onChange={handleChange}
                                required
                                error={!!errors.bank_account_name}
                                helperText={errors.bank_account_name}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Account Number"
                                name="bank_account_number"
                                value={formData.bank_account_number}
                                onChange={handleChange}
                                required
                                error={!!errors.bank_account_number}
                                helperText={errors.bank_account_number}
                                inputProps={{
                                    maxLength: 18
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Bank Name"
                                name="bank_name"
                                value={formData.bank_name}
                                onChange={handleChange}
                                required
                                error={!!errors.bank_name}
                                helperText={errors.bank_name}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Branch Name"
                                name="bank_branch"
                                value={formData.bank_branch}
                                onChange={handleChange}
                                required
                                error={!!errors.bank_branch}
                                helperText={errors.bank_branch}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="IFSC Code"
                                name="ifsc_code"
                                value={formData.ifsc_code}
                                onChange={(e) => {
                                    const value = e.target.value.toUpperCase();
                                    handleChange({ target: { name: 'ifsc_code', value } });
                                }}
                                required
                                error={!!errors.ifsc_code}
                                helperText={errors.ifsc_code || 'Format: ABCD0123456'}
                                inputProps={{
                                    maxLength: 11,
                                    style: { textTransform: 'uppercase' }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                sx={{ mt: 2 }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Submit Request'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default NGOMoneyRequestForm; 