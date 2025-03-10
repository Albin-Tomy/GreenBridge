import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Paper,
    CircularProgress,
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import axios from 'axios';

const SchoolSupplyRequestForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        supply_type: '',
        education_level: '',
        quantity: '',
        condition: '',
        pickup_address: '',
        contact_number: '',
        additional_notes: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const supplyTypes = [
        { value: 'notebooks', label: 'Notebooks' },
        { value: 'textbooks', label: 'Textbooks' },
        { value: 'stationery', label: 'Stationery' },
        { value: 'uniforms', label: 'Uniforms' },
        { value: 'bags', label: 'School Bags' },
        { value: 'others', label: 'Others' }
    ];

    const educationLevels = [
        { value: 'primary', label: 'Primary School' },
        { value: 'middle', label: 'Middle School' },
        { value: 'high', label: 'High School' },
        { value: 'higher_secondary', label: 'Higher Secondary' },
        { value: 'college', label: 'College' },
        { value: 'other', label: 'Other' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                'http://127.0.0.1:8000/api/v1/school-supplies/request/',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setSuccess(true);
            // Reset form
            setFormData({
                supply_type: '',
                education_level: '',
                quantity: '',
                condition: '',
                pickup_address: '',
                contact_number: '',
                additional_notes: ''
            });

            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom align="center">
                        School Supply Donation Request
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>Request submitted successfully!</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Supply Type</InputLabel>
                                    <Select
                                        name="supply_type"
                                        value={formData.supply_type}
                                        onChange={handleChange}
                                        label="Supply Type"
                                    >
                                        {supplyTypes.map((type) => (
                                            <MenuItem key={type.value} value={type.value}>
                                                {type.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Education Level</InputLabel>
                                    <Select
                                        name="education_level"
                                        value={formData.education_level}
                                        onChange={handleChange}
                                        label="Education Level"
                                    >
                                        {educationLevels.map((level) => (
                                            <MenuItem key={level.value} value={level.value}>
                                                {level.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Quantity"
                                    name="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Condition"
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleChange}
                                    placeholder="e.g., New, Good, Used but functional"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Pickup Address"
                                    name="pickup_address"
                                    multiline
                                    rows={2}
                                    value={formData.pickup_address}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Contact Number"
                                    name="contact_number"
                                    value={formData.contact_number}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Additional Notes"
                                    name="additional_notes"
                                    multiline
                                    rows={3}
                                    value={formData.additional_notes}
                                    onChange={handleChange}
                                    placeholder="Any additional information you'd like to provide"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Submit Request'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </>
    );
};

export default SchoolSupplyRequestForm; 