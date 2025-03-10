import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import SchoolIcon from '@mui/icons-material/School';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DeleteIcon from '@mui/icons-material/Delete';
import LegalConsentForm from '../Volunteer/LegalConsentForm';
import './CommonRequest.css';

const CommonRequestForm = () => {
    const navigate = useNavigate();
    const [requestType, setRequestType] = useState('');
    const [showConsentForm, setShowConsentForm] = useState(false);

    // Check if user is logged in
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleRequestTypeChange = (type) => {
        setRequestType(type);
        if (type === 'food') {
            // Show consent form first for food requests
            setShowConsentForm(true);
        } else {
            // For other types, navigate directly
            navigateToForm(type);
        }
    };

    const navigateToForm = (type) => {
        switch(type) {
            case 'food':
                navigate('/food-request');
                break;
            case 'grocery':
                navigate('/grocery-request');
                break;
            case 'book':
                navigate('/book-request');
                break;
            case 'school':
                navigate('/school-request');
                break;
            case 'money':
                navigate('/donate-money');
                break;
            case 'waste':
                navigate('/request');
                break;
            default:
                break;
        }
    };

    const handleConsentAgree = () => {
        setShowConsentForm(false);
        navigateToForm('food');
    };

    const requestCards = [
        {
            type: 'food',
            icon: <RestaurantIcon sx={{ fontSize: 40 }}/>,
            title: 'Food Redistribution',
            description: 'Request pickup for excess food to be redistributed to those in need',
            items: ['Cooked Food', 'Raw Food', 'Packaged Food', 'Beverages']
        },
        {
            type: 'grocery',
            icon: <ShoppingBasketIcon sx={{ fontSize: 40 }}/>,
            title: 'Grocery Distribution',
            description: 'Request pickup for grocery items to be distributed',
            items: ['Grains & Cereals', 'Pulses & Lentils', 'Spices & Condiments', 'Cooking Oils']
        },
        {
            type: 'book',
            icon: <MenuBookIcon sx={{ fontSize: 40 }}/>,
            title: 'Book Distribution',
            description: 'Request pickup for educational books and materials',
            items: ['School Textbooks', 'College Textbooks', 'Reference Books', 'Study Materials']
        },
        {
            type: 'school',
            icon: <SchoolIcon sx={{ fontSize: 40 }}/>,
            title: 'School Supplies',
            description: 'Donate school supplies to support education',
            items: ['Stationery', 'Bags', 'Uniforms', 'Educational Tools']
        },
        {
            type: 'money',
            icon: <MonetizationOnIcon sx={{ fontSize: 40 }}/>,
            title: 'Donate Money',
            description: 'Make a monetary contribution to support our cause',
            items: ['One-time Donation', 'Monthly Support', 'Project Specific', 'Emergency Fund']
        },
        {
            type: 'waste',
            icon: <DeleteIcon sx={{ fontSize: 40 }}/>,
            title: 'Waste Collection',
            description: 'Request pickup for various types of waste',
            items: ['Recyclable Waste', 'Organic Waste', 'Electronic Waste', 'Other Waste']
        }
    ];

    return (
        <div>
            <Header />
            <div className="common-request-container">
                <h2>Select Request Type</h2>
                <div className="request-type-cards">
                    {requestCards.map((card) => (
                        <div 
                            key={card.type}
                            className={`request-card ${requestType === card.type ? 'selected' : ''}`}
                            onClick={() => handleRequestTypeChange(card.type)}
                        >
                            <div className="card-icon">{card.icon}</div>
                            <h3>{card.title}</h3>
                            <p>{card.description}</p>
                            <ul>
                                {card.items.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Legal Consent Form Dialog */}
                <LegalConsentForm
                    open={showConsentForm}
                    onClose={() => setShowConsentForm(false)}
                    onAgree={handleConsentAgree}
                />
            </div>
        </div>
    );
};

export default CommonRequestForm; 