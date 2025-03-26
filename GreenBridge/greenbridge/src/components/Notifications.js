import React, { useState, useEffect } from 'react';
import {
    Badge,
    IconButton,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    Typography,
    Box
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('https://greenbridgeserver.onrender.com/api/notifications/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data);
            setUnreadCount(response.data.filter(n => !n.read).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`https://greenbridgeserver.onrender.com/api/notifications/${notificationId}/read/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    return (
        <Box>
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: 400,
                        width: '300px',
                    },
                }}
            >
                {notifications.length === 0 ? (
                    <MenuItem>
                        <Typography>No notifications</Typography>
                    </MenuItem>
                ) : (
                    <List>
                        {notifications.map((notification) => (
                            <ListItem 
                                key={notification.id}
                                onClick={() => markAsRead(notification.id)}
                                sx={{
                                    backgroundColor: notification.read ? 'transparent' : '#f0f7ff',
                                    '&:hover': {
                                        backgroundColor: '#e3f2fd',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={notification.title}
                                    secondary={
                                        <>
                                            <Typography variant="body2" color="text.secondary">
                                                {notification.message}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(notification.created_at).toLocaleString()}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Menu>
        </Box>
    );
};

export default Notifications; 