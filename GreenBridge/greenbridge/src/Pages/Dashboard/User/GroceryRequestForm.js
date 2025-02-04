import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/Header';
import './GroceryRequest.css';

const GroceryRequestForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        grocery_type: '',
        quantity: '',
        expiry_date: '',
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

            const requestData = {
                user: userId,
                grocery_type: formData.grocery_type,
                quantity: parseInt(formData.quantity),
                expiry_date: formData.expiry_date,
                pickup_address: formData.pickup_address,
                contact_number: formData.contact_number,
                additional_notes: formData.additional_notes || ''
            };

            const response = await axios.post(
                'http://127.0.0.1:8000/api/v1/grocery/request/',
                requestData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201) {
                setSuccess('Grocery request submitted successfully!');
                setTimeout(() => {
                    navigate('/service-request');
                }, 2000);
            }
        } catch (error) {
            console.error('Error details:', error);
            if (error.response?.status === 401) {
                setError('Authentication failed. Please login again.');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(error.response?.data?.message || 'Failed to submit request. Please try again.');
            }
        }
    };

    return (
        <div>
            <Header />
            <div className="grocery-request-container">
                <h2>Grocery Distribution Request</h2>
                <form onSubmit={handleSubmit} className="grocery-request-form">
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="grocery_type">Grocery Type</label>
                        <select
                            id="grocery_type"
                            name="grocery_type"
                            value={formData.grocery_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Grocery Type</option>
                            <option value="grains">Grains & Cereals</option>
                            <option value="pulses">Pulses & Lentils</option>
                            <option value="spices">Spices & Condiments</option>
                            <option value="oils">Cooking Oils</option>
                            <option value="dry_fruits">Dry Fruits & Nuts</option>
                            <option value="others">Others</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantity">Quantity (in kg)</label>
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
                        <label htmlFor="expiry_date">Expiry Date</label>
                        <input
                            type="date"
                            id="expiry_date"
                            name="expiry_date"
                            value={formData.expiry_date}
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

export default GroceryRequestForm; 