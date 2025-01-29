import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/Header';
import './FoodRequest.css';

const FoodRequestForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        food_type: '',
        quantity: '',
        expiry_time: '',
        pickup_address: '',
        contact_number: '',
        additional_notes: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');

            if (!token) {
                setError('Please login to submit a request');
                return;
            }

            if (!userId) {
                setError('User information not found. Please login again.');
                return;
            }

            // Format the data according to API expectations
            const requestData = {
                user: userId,
                food_type: formData.food_type,
                quantity: parseInt(formData.quantity),
                expiry_time: formData.expiry_time,
                pickup_address: formData.pickup_address,
                contact_number: formData.contact_number,
                additional_notes: formData.additional_notes || ''
            };

            console.log('Sending request with data:', requestData);
            console.log('Using token:', token);

            const response = await axios.post(
                'http://127.0.0.1:8000/api/v1/food/request/',
                requestData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Response:', response);

            if (response.status === 201) {
                setSuccess('Food request submitted successfully!');
                setTimeout(() => {
                    navigate('/service-request');
                }, 2000);
            }
        } catch (error) {
            console.error('Full error object:', error);
            console.error('Error response data:', error.response?.data);
            console.error('Error status:', error.response?.status);
            
            if (error.response?.status === 400) {
                const errorMessage = typeof error.response.data === 'object' 
                    ? Object.entries(error.response.data).map(([key, value]) => `${key}: ${value}`).join(', ')
                    : JSON.stringify(error.response.data);
                setError(`Validation error: ${errorMessage}`);
            } else if (error.response?.status === 401) {
                setError('Authentication failed. Please login again.');
                setTimeout(() => navigate('/login'), 2000);
            } else if (error.response?.status === 403) {
                setError('You do not have permission to make this request.');
            } else {
                setError(error.response?.data?.message || 'Failed to submit food request. Please try again.');
            }
        }
    };

    return (
        <div>
            <Header />
            <div className="food-request-container">
                <h2>Food Redistribution Request</h2>
                <form onSubmit={handleSubmit} className="food-request-form">
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="food_type">Food Type</label>
                        <select
                            id="food_type"
                            name="food_type"
                            value={formData.food_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Food Type</option>
                            <option value="cooked">Cooked Food</option>
                            <option value="raw">Raw Food</option>
                            <option value="packaged">Packaged Food</option>
                            <option value="beverages">Beverages</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantity">Quantity (in kg/liters)</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            min="1"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="expiry_time">Best Before Time</label>
                        <input
                            type="datetime-local"
                            id="expiry_time"
                            name="expiry_time"
                            value={formData.expiry_time}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="pickup_address">Pickup Address</label>
                        <textarea
                            id="pickup_address"
                            name="pickup_address"
                            value={formData.pickup_address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contact_number">Contact Number</label>
                        <input
                            type="tel"
                            id="contact_number"
                            name="contact_number"
                            value={formData.contact_number}
                            onChange={handleChange}
                            required
                            pattern="[0-9]{10}"
                            title="Please enter a valid 10-digit phone number"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="additional_notes">Additional Notes</label>
                        <textarea
                            id="additional_notes"
                            name="additional_notes"
                            value={formData.additional_notes}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="button-group">
                        <button type="submit" className="submit-btn">
                            Submit Request
                        </button>
                        <button 
                            type="button" 
                            onClick={() => navigate('/service-request')}
                            className="back-btn"
                        >
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FoodRequestForm; 