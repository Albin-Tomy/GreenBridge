import React, { useState } from 'react';
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
    Alert
} from '@mui/material';
import axios from 'axios';

const QualityReportForm = ({ open, onClose, requestId, onSubmitSuccess }) => {
    const [formData, setFormData] = useState({
        issue_type: '',
        description: '',
        temperature: null,
        packaging_integrity: true,
        labeling_accuracy: true,
        allergen_check: true,
        hygiene_check: true,
        weight_check: null,
        visual_inspection: true,
        smell_test: true,
        expiration_check: true,
        storage_condition: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                `http://127.0.0.1:8000/api/v1/food/request/${requestId}/quality-report/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setSuccess(true);
            onSubmitSuccess();
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit quality report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Submit Food Quality Report</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>Quality report submitted successfully!</Alert>}

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Issue Type</InputLabel>
                                <Select
                                    name="issue_type"
                                    value={formData.issue_type}
                                    onChange={handleChange}
                                    label="Issue Type"
                                    required
                                >
                                    <MenuItem value="good">Good Quality</MenuItem>
                                    <MenuItem value="expired">Food Expired</MenuItem>
                                    <MenuItem value="contaminated">Food Contaminated</MenuItem>
                                    <MenuItem value="spoiled">Food Spoiled</MenuItem>
                                    <MenuItem value="packaging_damaged">Packaging Damaged</MenuItem>
                                    <MenuItem value="temperature_issue">Temperature Control Issue</MenuItem>
                                    <MenuItem value="other">Other Issue</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="description"
                                label="Description"
                                value={formData.description}
                                onChange={handleChange}
                                multiline
                                rows={4}
                                required
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
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Submit Report'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default QualityReportForm;