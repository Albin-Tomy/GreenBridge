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
    const [errors, setErrors] = useState({
        food_type: '',
        quantity: '',
        expiry_time: '',
        pickup_address: '',
        contact_number: '',
        additional_notes: ''
    });
    const [success, setSuccess] = useState('');
    const [generalError, setGeneralError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        
        // Add immediate validation for quantity
        if (name === 'quantity') {
            if (value <= 0) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    quantity: 'Quantity must be greater than 0'
                }));
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    quantity: ''
                }));
            }
        } else {
            // Clear error for other fields being edited
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;

        // Get current date and time
        const now = new Date();
        const expiryTime = new Date(formData.expiry_time);
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

        // Check if all fields are filled
        if (!formData.food_type.trim()) {
            tempErrors.food_type = 'Food type is required';
            isValid = false;
        }

        if (!formData.quantity) {
            tempErrors.quantity = 'Quantity is required';
            isValid = false;
        } else if (formData.quantity <= 0) {
            tempErrors.quantity = 'Quantity must be greater than 0';
            isValid = false;
        }

        if (!formData.expiry_time) {
            tempErrors.expiry_time = 'Best before time is required';
            isValid = false;
        } else if (expiryTime < now) {
            tempErrors.expiry_time = 'Best before time must be in the future';
            isValid = false;
        } else if (expiryTime > oneWeekFromNow) {
            tempErrors.expiry_time = 'Best before time must be within one week from now';
            isValid = false;
        }

        if (!formData.pickup_address) {
            tempErrors.pickup_address = 'Pickup address is required';
            isValid = false;
        } else if (formData.pickup_address.trim().length < 10) {
            tempErrors.pickup_address = 'Please provide a detailed pickup address (minimum 10 characters)';
            isValid = false;
        }

        if (!formData.contact_number) {
            tempErrors.contact_number = 'Contact number is required';
            isValid = false;
        } else {
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(formData.contact_number)) {
                tempErrors.contact_number = 'Please enter a valid 10-digit contact number';
                isValid = false;
            }
        }

        if (!formData.additional_notes.trim()) {
            tempErrors.additional_notes = 'Additional notes are required';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError('');
        setSuccess('');

        if (!validateForm()) {
            setGeneralError('Please fill in all required fields correctly');
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');

            if (!token) {
                setGeneralError('Please login to submit a request');
                return;
            }

            if (!userId) {
                setGeneralError('User information not found. Please login again.');
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
                setGeneralError(`Validation error: ${errorMessage}`);
            } else if (error.response?.status === 401) {
                setGeneralError('Authentication failed. Please login again.');
                setTimeout(() => navigate('/login'), 2000);
            } else if (error.response?.status === 403) {
                setGeneralError('You do not have permission to make this request.');
            } else {
                setGeneralError(error.response?.data?.message || 'Failed to submit food request. Please try again.');
            }
        }
    };

    return (
        <div>
            <Header />
            <div className="food-request-container">
                <h2>Food Redistribution Request</h2>
                <p className="form-instruction">All fields are mandatory. Best before time must be within one week.</p>
                <form onSubmit={handleSubmit} className="food-request-form">
                    {generalError && <div className="error-message">{generalError}</div>}
                    {success && <div className="success-message">{success}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="food_type">Food Type *</label>
                        <select
                            id="food_type"
                            name="food_type"
                            value={formData.food_type}
                            onChange={handleChange}
                            required
                            className={errors.food_type ? 'error-input' : ''}
                        >
                            <option value="">Select Food Type</option>
                            <option value="cooked">Cooked Food</option>
                            <option value="raw">Raw Food</option>
                            <option value="packaged">Packaged Food</option>
                            <option value="beverages">Beverages</option>
                        </select>
                        {errors.food_type && <div className="error-text">{errors.food_type}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantity">Quantity (in kg/liters) *</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            min="1"
                            className={errors.quantity ? 'error-input' : ''}
                        />
                        {errors.quantity && <div className="error-text">{errors.quantity}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="expiry_time">Best Before Time *</label>
                        <input
                            type="datetime-local"
                            id="expiry_time"
                            name="expiry_time"
                            value={formData.expiry_time}
                            onChange={handleChange}
                            required
                            min={new Date().toISOString().slice(0, 16)}
                            max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                            className={errors.expiry_time ? 'error-input' : ''}
                        />
                        {errors.expiry_time && <div className="error-text">{errors.expiry_time}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="pickup_address">Pickup Address *</label>
                        <textarea
                            id="pickup_address"
                            name="pickup_address"
                            value={formData.pickup_address}
                            onChange={handleChange}
                            required
                            placeholder="Enter detailed pickup address (minimum 10 characters)"
                            className={errors.pickup_address ? 'error-input' : ''}
                        />
                        {errors.pickup_address && <div className="error-text">{errors.pickup_address}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="contact_number">Contact Number *</label>
                        <input
                            type="tel"
                            id="contact_number"
                            name="contact_number"
                            value={formData.contact_number}
                            onChange={handleChange}
                            required
                            placeholder="Enter 10-digit contact number"
                            pattern="[0-9]{10}"
                            title="Please enter a valid 10-digit phone number"
                            className={errors.contact_number ? 'error-input' : ''}
                        />
                        {errors.contact_number && <div className="error-text">{errors.contact_number}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="additional_notes">Additional Notes *</label>
                        <textarea
                            id="additional_notes"
                            name="additional_notes"
                            value={formData.additional_notes}
                            onChange={handleChange}
                            required
                            placeholder="Enter any additional information about the food"
                            className={errors.additional_notes ? 'error-input' : ''}
                        />
                        {errors.additional_notes && <div className="error-text">{errors.additional_notes}</div>}
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