import React, { useState } from 'react';
import axios from 'axios';
import '../Shg/ShgRegistration.css';
import backgroundImage from '../../../assets/honey.jpg'; // Correct path to your image

const ShgRegistration = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        registration_number: ''
    });

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/shg/register/', formData);
            setMessage(response.data.message);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to submit registration. Please try again.');
            setMessage(null);
        }
    };

    return (
        <div 
            className="background-container"
            style={{
                backgroundImage: `url(${backgroundImage})`  // Only the background image is set in JS
            }}
        >
            <div className="registration-container">
                <h1 className="main-heading">Welcome to SHG Registration</h1>
                <h3 className="sub-heading">Empower your community by joining our Self-Help Group (SHG)</h3>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit} className="registration-form">
                    <h2 className="form-heading">Register Below</h2>

                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Registration Number</label>
                        <input
                            type="text"
                            name="registration_number"
                            value={formData.registration_number}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <button type="submit" className="submit-button">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default ShgRegistration;
