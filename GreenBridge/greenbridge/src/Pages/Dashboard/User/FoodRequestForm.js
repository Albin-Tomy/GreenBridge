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

    const foodTypes = [
        { value: 'cooked', label: 'Cooked Food' },
        { value: 'raw', label: 'Raw Food' },
        { value: 'packaged', label: 'Packaged Food' },
        { value: 'beverages', label: 'Beverages' },
        { value: 'other', label: 'Other' }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                'http://127.0.0.1:8000/api/v1/food/request/',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setSuccess('Food redistribution request submitted successfully!');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to submit request');
        }
    };

    return (
        <div>
            <Header />
            <div className="food-request-container">
                <h2>Food Redistribution Request</h2>
                <form onSubmit={handleSubmit} className="food-request-form">
                    <div className="form-group">
                        <label>Food Type</label>
                        <select
                            name="food_type"
                            value={formData.food_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Food Type</option>
                            {foodTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Quantity</label>
                        <input
                            type="text"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="e.g., 5 kg, 3 boxes"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Collection Before (Date & Time)</label>
                        <input
                            type="datetime-local"
                            name="expiry_time"
                            value={formData.expiry_time}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Pickup Address</label>
                        <textarea
                            name="pickup_address"
                            value={formData.pickup_address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Contact Number</label>
                        <input
                            type="tel"
                            name="contact_number"
                            value={formData.contact_number}
                            onChange={handleChange}
                            pattern="[0-9]{10}"
                            placeholder="10-digit mobile number"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Additional Notes</label>
                        <textarea
                            name="additional_notes"
                            value={formData.additional_notes}
                            onChange={handleChange}
                            placeholder="Any special instructions or details"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

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