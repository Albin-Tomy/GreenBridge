import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    People as PeopleIcon,
    Store as StoreIcon,
    MonetizationOn as MoneyIcon,
    LocalShipping as ShippingIcon,
    Business as BusinessIcon,
    Dashboard as DashboardIcon,
    Link as LinkIcon
} from '@mui/icons-material';

const AdminLanding = () => {
    const navigate = useNavigate();

    const managementCards = [
        {
            title: 'Dashboard',
            description: 'View overall statistics and metrics',
            icon: <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            path: '/admin/dashboard',
            color: '#1976d2'
        },
        {
            title: 'Blockchain Explorer',
            description: 'Monitor donation and volunteer blockchain records',
            icon: <LinkIcon sx={{ fontSize: 40, color: 'primary.dark' }} />,
            path: '/volunteer/blockchain',
            color: '#0D47A1'
        },
        {
            title: 'NGO Management',
            description: 'Manage NGO registrations and approvals',
            icon: <BusinessIcon sx={{ fontSize: 40, color: 'success.main' }} />,
            path: '/admin/ngo',
            color: '#2e7d32'
        },
        {
            title: 'Product Management',
            description: 'Manage products and inventory',
            icon: <StoreIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
            path: '/admin/admin',
            color: '#9c27b0'
        },
        {
            title: 'Money Requests',
            description: 'Handle NGO money requests',
            icon: <MoneyIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
            path: '/admin/dashboard',
            color: '#ed6c02'
        },
        {
            title: 'Orders & Distribution',
            description: 'Manage orders and distribution',
            icon: <ShippingIcon sx={{ fontSize: 40, color: 'info.main' }} />,
            path: '/admin/order',
            color: '#0288d1'
        },
        {
            title: 'SHG Management',
            description: 'Manage SHG registrations and approvals',
            icon: <PeopleIcon sx={{ fontSize: 40, color: 'error.main' }} />,
            path: '/admin/pending-requests',
            color: '#d32f2f'
        }
    ];

    return (
        <Box sx={{ 
            minHeight: '100vh',
            backgroundColor: 'background.default',
            pt: 8 // Add padding top to account for the header
        }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
                    Admin Control Panel
                </Typography>

                <Grid container spacing={3}>
                    {managementCards.map((card, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        mb: 2 
                                    }}>
                                        {card.icon}
                                    </Box>
                                    <Typography 
                                        gutterBottom 
                                        variant="h5" 
                                        component="h2" 
                                        align="center"
                                    >
                                        {card.title}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        align="center"
                                    >
                                        {card.description}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                                    <Button 
                                        variant="contained" 
                                        onClick={() => navigate(card.path)}
                                        sx={{ 
                                            backgroundColor: card.color,
                                            '&:hover': {
                                                backgroundColor: card.color,
                                                opacity: 0.9
                                            }
                                        }}
                                    >
                                        Manage
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default AdminLanding; 