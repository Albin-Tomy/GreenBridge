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
    Assessment as AnalyticsIcon,
    Business as NGOIcon,
    Money as MoneyIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const AdminSidebar = ({ activeSection, setActiveSection, expandedMenu, setExpandedMenu }) => {
    const handleMenuClick = (menu) => {
        if (menu === expandedMenu) {
            setExpandedMenu('');
        } else {
            setExpandedMenu(menu);
        }
    };

    const menuItems = [
        {
            text: 'Dashboard',
            icon: <DashboardIcon />,
            value: 'dashboard'
        },
        {
            text: 'Requests',
            icon: <FoodIcon />,
            value: 'requests',
            subItems: [
                { text: 'Food Requests', value: 'food-requests', icon: <FoodIcon /> },
                { text: 'School Supplies', value: 'school-supplies', icon: <SchoolIcon /> },
                { text: 'Book Requests', value: 'book-requests', icon: <BookIcon /> },
                { text: 'Grocery Requests', value: 'grocery-requests', icon: <GroceryIcon /> }
            ]
        },
        {
            text: 'Money Requests',
            icon: <MoneyIcon />,
            value: 'money-requests'
        },
        {
            text: 'NGO Management',
            icon: <NGOIcon />,
            value: 'ngo-management',
            subItems: [
                { text: 'Pending NGOs', value: 'pending-ngos' },
                { text: 'Approved NGOs', value: 'approved-ngos' }
            ]
        },
        {
            text: 'User Management',
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
                                onClick={() => {
                                    if (item.subItems) {
                                        handleMenuClick(item.value);
                                    } else {
                                        setActiveSection(item.value);
                                        setExpandedMenu('');
                                    }
                                }}
                                selected={!item.subItems && activeSection === item.value}
                                sx={{
                                    bgcolor: !item.subItems && activeSection === item.value ? 'action.selected' : 'transparent'
                                }}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                                {item.subItems && (expandedMenu === item.value ? <ExpandLess /> : <ExpandMore />)}
                            </ListItem>
                            {item.subItems && (
                                <Collapse in={expandedMenu === item.value} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.subItems.map((subItem) => (
                                            <ListItem
                                                button
                                                key={subItem.value}
                                                sx={{ pl: 4 }}
                                                onClick={() => {
                                                    setActiveSection(subItem.value);
                                                }}
                                                selected={activeSection === subItem.value}
                                            >
                                                {subItem.icon && <ListItemIcon>{subItem.icon}</ListItemIcon>}
                                                <ListItemText primary={subItem.text} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default AdminSidebar; 