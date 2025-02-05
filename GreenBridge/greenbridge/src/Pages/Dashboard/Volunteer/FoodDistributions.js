import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Chip,
    CircularProgress
} from '@mui/material';
import Header from '../../../components/Header';
import './FoodDistributions.css';

const FoodDistributions = () => {
    const [distributions, setDistributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        fetchDistributions();
    }, []);

    const fetchDistributions = async () => {
        try {
            const response = await axios.get(
                'http://127.0.0.1:8000/api/v1/volunteer/distributions/',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setDistributions(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching distributions:', error);
            setLoading(false);
        }
    };

    const handleReportQuality = (distributionId) => {
        navigate(`/volunteer/quality-report/${distributionId}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Header />
            <Box sx={{ p: 3, mt: 8 }}>
                <Typography variant="h4" gutterBottom>
                    Food Distributions
                </Typography>
                <Grid container spacing={3}>
                    {distributions.map((distribution) => (
                        <Grid item xs={12} md={6} lg={4} key={distribution.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Distribution #{distribution.id}
                                    </Typography>
                                    <Box sx={{ mb: 2 }}>
                                        <Chip 
                                            label={distribution.status}
                                            color={distribution.status === 'completed' ? 'success' : 'primary'}
                                        />
                                    </Box>
                                    <Typography>
                                        <strong>Food Type:</strong> {distribution.food_type}
                                    </Typography>
                                    <Typography>
                                        <strong>Quantity:</strong> {distribution.quantity}
                                    </Typography>
                                    <Typography>
                                        <strong>Location:</strong> {distribution.pickup_location}
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleReportQuality(distribution.id)}
                                            fullWidth
                                        >
                                            Report Quality Issue
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default FoodDistributions; 