import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip
} from '@mui/material';
import axios from 'axios';

const VolunteerPoints = () => {
    const [pointsData, setPointsData] = useState({
        totalPoints: 0,
        level: 1,
        nextLevelPoints: 100,
        recentActivities: []
    });

    useEffect(() => {
        fetchPointsData();
    }, []);

    const fetchPointsData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('https://greenbridgeserver.onrender.com/api/volunteer/points/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPointsData(response.data);
        } catch (error) {
            console.error('Error fetching points data:', error);
        }
    };

    const calculateProgress = () => {
        const pointsForCurrentLevel = pointsData.nextLevelPoints - 100;
        const progress = ((pointsData.totalPoints - pointsForCurrentLevel) / 
                         (pointsData.nextLevelPoints - pointsForCurrentLevel)) * 100;
        return Math.min(progress, 100);
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Volunteer Progress
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" sx={{ mr: 2 }}>
                            {pointsData.totalPoints}
                        </Typography>
                        <Typography color="text.secondary">
                            points
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Level {pointsData.level}
                        </Typography>
                        <LinearProgress 
                            variant="determinate" 
                            value={calculateProgress()} 
                            sx={{ height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            {pointsData.nextLevelPoints - pointsData.totalPoints} points to next level
                        </Typography>
                    </Box>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        Recent Activities
                    </Typography>
                    <List>
                        {pointsData.recentActivities.map((activity, index) => (
                            <React.Fragment key={activity.id}>
                                <ListItem>
                                    <ListItemText
                                        primary={activity.description}
                                        secondary={new Date(activity.date).toLocaleDateString()}
                                    />
                                    <Chip 
                                        label={`+${activity.points} pts`}
                                        color="primary"
                                        size="small"
                                    />
                                </ListItem>
                                {index < pointsData.recentActivities.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
};

export default VolunteerPoints; 