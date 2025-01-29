import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import './CommonRequest.css';

const CommonRequestForm = () => {
    const navigate = useNavigate();
    const [requestType, setRequestType] = useState('');

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
            navigate('/food-request');
        } else if (type === 'waste') {
            navigate('/request');
        }
    };

    return (
        <div>
            <Header />
            <div className="common-request-container">
                <h2>Select Request Type</h2>
                <div className="request-type-cards">
                    <div 
                        className={`request-card ${requestType === 'food' ? 'selected' : ''}`}
                        onClick={() => handleRequestTypeChange('food')}
                    >
                        <h3>Food Redistribution</h3>
                        <p>Request pickup for excess food to be redistributed to those in need</p>
                        <ul>
                            <li>Cooked Food</li>
                            <li>Raw Food</li>
                            <li>Packaged Food</li>
                            <li>Beverages</li>
                        </ul>
                    </div>

                    <div 
                        className={`request-card ${requestType === 'waste' ? 'selected' : ''}`}
                        onClick={() => handleRequestTypeChange('waste')}
                    >
                        <h3>Waste Collection</h3>
                        <p>Request pickup for various types of waste</p>
                        <ul>
                            <li>Recyclable Waste</li>
                            <li>Organic Waste</li>
                            <li>Electronic Waste</li>
                            <li>Other Waste</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommonRequestForm; 