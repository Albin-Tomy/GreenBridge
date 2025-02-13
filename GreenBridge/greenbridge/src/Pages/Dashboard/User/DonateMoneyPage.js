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
    Card,
    CardContent,
    Grid,
    Alert,
    CircularProgress
} from '@mui/material';
import Header from '../../../components/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://127.0.0.1:8000';

const DonateMoneyPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        donation_type: 'one-time',
        purpose: 'general'
    });

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        // Check authentication
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
        }

        return () => {
            document.body.removeChild(script);
        };
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleDonation = async () => {
        if (!formData.amount || formData.amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                `${BASE_URL}/api/v1/donations/create/`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.order_id) {
                const options = {
                    key: process.env.REACT_APP_RAZORPAY_API_KEY,
                    amount: formData.amount * 100,
                    currency: 'INR',
                    name: 'GreenBridge',
                    description: `${formData.donation_type} donation for ${formData.purpose}`,
                    order_id: response.data.order_id,
                    handler: async function(response) {
                        try {
                            const token = localStorage.getItem('authToken');
                            await axios.post(
                                `${BASE_URL}/api/v1/donations/verify/`,
                                {
                                    payment_id: response.razorpay_payment_id,
                                    order_id: response.razorpay_order_id,
                                    signature: response.razorpay_signature
                                },
                                {
                                    headers: {
                                        'Authorization': `Bearer ${token}`,
                                        'Content-Type': 'application/json'
                                    }
                                }
                            );

                            toast.success('Thank you for your donation!');
                            setTimeout(() => {
                                navigate('/dashboard');
                            }, 2000);
                        } catch (error) {
                            toast.error('Payment verification failed. Please contact support.');
                        }
                    },
                    prefill: {
                        name: localStorage.getItem('userName'),
                        email: localStorage.getItem('userEmail'),
                    },
                    theme: {
                        color: '#4CAF50'
                    }
                };

                const razorpayInstance = new window.Razorpay(options);
                razorpayInstance.open();
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to process donation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <ToastContainer position="top-center" />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Make a Donation
                                </Typography>

                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Donation Type</InputLabel>
                                    <Select
                                        name="donation_type"
                                        value={formData.donation_type}
                                        onChange={handleChange}
                                        label="Donation Type"
                                    >
                                        <MenuItem value="one-time">One-time Donation</MenuItem>
                                        <MenuItem value="monthly">Monthly Support</MenuItem>
                                        <MenuItem value="project">Project Specific</MenuItem>
                                        <MenuItem value="emergency">Emergency Fund</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Purpose</InputLabel>
                                    <Select
                                        name="purpose"
                                        value={formData.purpose}
                                        onChange={handleChange}
                                        label="Purpose"
                                    >
                                        <MenuItem value="general">General Fund</MenuItem>
                                        <MenuItem value="education">Education Support</MenuItem>
                                        <MenuItem value="food">Food Distribution</MenuItem>
                                        <MenuItem value="emergency">Emergency Relief</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Amount (₹)"
                                    name="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                    inputProps={{ min: 1 }}
                                />

                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleDonation}
                                    disabled={loading}
                                    size="large"
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Proceed to Donate'}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Why Donate?
                                </Typography>
                                <Typography paragraph>
                                    Your donation helps us continue our mission of supporting communities
                                    through sustainable initiatives and environmental protection.
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    Impact of Your Donation
                                </Typography>
                                <Box component="ul" sx={{ pl: 2 }}>
                                    <Typography component="li">Support education initiatives</Typography>
                                    <Typography component="li">Fund food distribution programs</Typography>
                                    <Typography component="li">Enable waste management projects</Typography>
                                    <Typography component="li">Help communities in need</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default DonateMoneyPage; 