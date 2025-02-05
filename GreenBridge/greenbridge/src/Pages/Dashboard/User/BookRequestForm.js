import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/Header';
import './BookRequest.css';

const BookRequestForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        book_type: '',
        education_level: '',
        subject: '',
        quantity: '',
        condition: '',
        pickup_address: '',
        contact_number: '',
        additional_notes: ''
    });
    const [errors, setErrors] = useState({
        book_type: '',
        education_level: '',
        subject: '',
        quantity: '',
        condition: '',
        pickup_address: '',
        contact_number: '',
        additional_notes: ''
    });
    const [generalError, setGeneralError] = useState('');
    const [success, setSuccess] = useState('');

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
        if (formData.book_type.trim() === '') {
            setErrors(prevErrors => ({
                ...prevErrors,
                book_type: 'Please select a book type'
            }));
            return false;
        }

        if (formData.education_level.trim() === '') {
            setErrors(prevErrors => ({
                ...prevErrors,
                education_level: 'Please select an education level'
            }));
            return false;
        }

        if (formData.subject.trim().length < 2) {
            setErrors(prevErrors => ({
                ...prevErrors,
                subject: 'Please enter a valid subject'
            }));
            return false;
        }

        if (formData.quantity <= 0) {
            setErrors(prevErrors => ({
                ...prevErrors,
                quantity: 'Quantity must be greater than 0'
            }));
            return false;
        }

        if (formData.condition.trim().length < 3) {
            setErrors(prevErrors => ({
                ...prevErrors,
                condition: 'Please specify the book condition'
            }));
            return false;
        }

        if (formData.pickup_address.trim().length < 10) {
            setErrors(prevErrors => ({
                ...prevErrors,
                pickup_address: 'Please provide a detailed pickup address (minimum 10 characters)'
            }));
            return false;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.contact_number)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                contact_number: 'Please enter a valid 10-digit contact number'
            }));
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError('');
        setErrors({});
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');

            if (!token) {
                setGeneralError('Please login to submit a request');
                return;
            }

            const requestData = {
                user: userId,
                book_type: formData.book_type,
                education_level: formData.education_level,
                subject: formData.subject,
                quantity: parseInt(formData.quantity),
                condition: formData.condition,
                pickup_address: formData.pickup_address,
                contact_number: formData.contact_number,
                additional_notes: formData.additional_notes || ''
            };

            const response = await axios.post(
                'http://127.0.0.1:8000/api/v1/book/request/',
                requestData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201) {
                setSuccess('Book request submitted successfully!');
                setTimeout(() => {
                    navigate('/service-request');
                }, 2000);
            }
        } catch (error) {
            console.error('Error details:', error);
            if (error.response?.status === 401) {
                setGeneralError('Authentication failed. Please login again.');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setGeneralError(error.response?.data?.message || 'Failed to submit request. Please try again.');
            }
        }
    };

    return (
        <div>
            <Header />
            <div className="book-request-container">
                <h2>Book Distribution Request</h2>
                <form onSubmit={handleSubmit} className="book-request-form">
                    {generalError && <div className="error-message">{generalError}</div>}
                    {success && <div className="success-message">{success}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="book_type">Book Type</label>
                        <select
                            id="book_type"
                            name="book_type"
                            value={formData.book_type}
                            onChange={handleChange}
                            required
                            className={errors.book_type ? 'error-input' : ''}
                        >
                            <option value="">Select Book Type</option>
                            <option value="school">School Textbooks</option>
                            <option value="college">College Textbooks</option>
                            <option value="reference">Reference Books</option>
                            <option value="study_materials">Study Materials</option>
                            <option value="others">Others</option>
                        </select>
                        {errors.book_type && <div className="error-text">{errors.book_type}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="education_level">Education Level</label>
                        <select
                            id="education_level"
                            name="education_level"
                            value={formData.education_level}
                            onChange={handleChange}
                            required
                            className={errors.education_level ? 'error-input' : ''}
                        >
                            <option value="">Select Education Level</option>
                            <option value="primary">Primary School</option>
                            <option value="secondary">Secondary School</option>
                            <option value="higher_secondary">Higher Secondary</option>
                            <option value="undergraduate">Undergraduate</option>
                            <option value="postgraduate">Postgraduate</option>
                            <option value="others">Others</option>
                        </select>
                        {errors.education_level && <div className="error-text">{errors.education_level}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className={errors.subject ? 'error-input' : ''}
                        />
                        {errors.subject && <div className="error-text">{errors.subject}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="quantity">Quantity</label>
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
                        <label htmlFor="condition">Book Condition</label>
                        <input
                            type="text"
                            id="condition"
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                            required
                            placeholder="e.g., New, Good, Fair"
                            className={errors.condition ? 'error-input' : ''}
                        />
                        {errors.condition && <div className="error-text">{errors.condition}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="pickup_address">Pickup Address</label>
                        <textarea
                            id="pickup_address"
                            name="pickup_address"
                            value={formData.pickup_address}
                            onChange={handleChange}
                            required
                            className={errors.pickup_address ? 'error-input' : ''}
                        />
                        {errors.pickup_address && <div className="error-text">{errors.pickup_address}</div>}
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
                            className={errors.contact_number ? 'error-input' : ''}
                        />
                        {errors.contact_number && <div className="error-text">{errors.contact_number}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="additional_notes">Additional Notes</label>
                        <textarea
                            id="additional_notes"
                            name="additional_notes"
                            value={formData.additional_notes}
                            onChange={handleChange}
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

export default BookRequestForm; 