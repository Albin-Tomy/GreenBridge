import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LegalConsentForm from './LegalConsentForm';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';

const ServiceRequests = () => {
    const [showConsentForm, setShowConsentForm] = useState(false);
    const navigate = useNavigate();

    const handleFoodDistributionClick = () => {
        setShowConsentForm(true);
    };

    const handleConsentAgree = () => {
        setShowConsentForm(false);
        // Navigate to food distribution request form
        navigate('/food-distribution-request');
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Service Requests
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Food Distribution
                            </Typography>
                            <Typography color="text.secondary">
                                Request food distribution service
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={handleFoodDistributionClick}
                            >
                                Request Service
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                {/* Other service cards */}
            </Grid>

            {/* Legal Consent Form Dialog */}
            <LegalConsentForm
                open={showConsentForm}
                onClose={() => setShowConsentForm(false)}
                onAgree={handleConsentAgree}
            />
        </Box>
    );
};

export default ServiceRequests; 