import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    Typography,
    Collapse
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Restaurant as FoodIcon,
    School as SchoolIcon,
    MenuBook as BookIcon,
    ShoppingBasket as GroceryIcon,
    VerifiedUser as ApprovalIcon,
    Group as UsersIcon,
    ExpandLess,
    ExpandMore,
    Assessment as AnalyticsIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const AdminSidebar = ({ activeSection, setActiveSection, expandedMenu, setExpandedMenu }) => {
    const handleMenuClick = (menu) => {
        if (expandedMenu === menu) {
            setExpandedMenu('');
        } else {
            setExpandedMenu(menu);
        }
    };

    const menuItems = [
        {
            title: 'Dashboard',
            icon: <DashboardIcon />,
            value: 'dashboard'
        },
        {
            title: 'Requests',
            icon: <PeopleIcon />,
            value: 'requests',
            subItems: [
                { title: 'Food Requests', icon: <FoodIcon />, value: 'food-requests' },
                { title: 'School Supplies', icon: <SchoolIcon />, value: 'school-supplies' },
                { title: 'Book Donations', icon: <BookIcon />, value: 'book-requests' },
                { title: 'Grocery Donations', icon: <GroceryIcon />, value: 'grocery-requests' }
            ]
        },
        {
            title: 'NGO Management',
            icon: <ApprovalIcon />,
            value: 'ngo',
            subItems: [
                { title: 'Pending NGOs', value: 'pending-ngos' },
                { title: 'Approved NGOs', value: 'approved-ngos' }
            ]
        },
        {
            title: 'User Management',
            icon: <UsersIcon />,
            value: 'users'
        }
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    mt: '64px',
                    backgroundColor: (theme) => theme.palette.background.default,
                    borderRight: '1px solid',
                    borderColor: 'divider'
                },
            }}
        >
            <Box sx={{ overflow: 'auto', mt: 2 }}>
                <List>
                    {menuItems.map((item) => (
                        <React.Fragment key={item.value}>
                            <ListItem 
                                button 
                                onClick={() => item.subItems ? handleMenuClick(item.value) : setActiveSection(item.value)}
                                selected={activeSection === item.value}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.title} />
                                {item.subItems && (expandedMenu === item.value ? <ExpandLess /> : <ExpandMore />)}
                            </ListItem>
                            
                            {item.subItems && (
                                <Collapse in={expandedMenu === item.value} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.subItems.map((subItem) => (
                                            <ListItem
                                                key={subItem.value}
                                                button
                                                sx={{ pl: 4 }}
                                                onClick={() => setActiveSection(subItem.value)}
                                                selected={activeSection === subItem.value}
                                            >
                                                {subItem.icon && <ListItemIcon>{subItem.icon}</ListItemIcon>}
                                                <ListItemText primary={subItem.title} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default AdminSidebar; 