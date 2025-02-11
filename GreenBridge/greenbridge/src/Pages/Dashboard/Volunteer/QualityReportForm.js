import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

const QualityReportForm = ({ open, onClose, requestId, onSubmitSuccess }) => {
    const [formData, setFormData] = useState({
        issue_type: '',
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
        storage_condition: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(`http://127.0.0.1:8000/api/v1/request/${requestId}/submit-quality-report/`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            onSubmitSuccess();
            onClose();
        } catch (error) {
            console.error('Error submitting quality report:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Submit Quality Report</DialogTitle>
            <DialogContent>
                {/* <TextField
                    name="issue_type"
                    label="Issue Type"
                    fullWidth
                    value={formData.issue_type}
                    onChange={handleChange}
                /> */}
                <TextField
                    name="description"
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                />
                <TextField
                    name="temperature"
                    label="Temperature (°C)"
                    type="number"
                    fullWidth
                    value={formData.temperature}
                    onChange={handleChange}
                />
                {/* Add more fields as necessary */}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Submit</Button>
            </DialogActions>
        </Dialog>
    );
};

export default QualityReportForm;