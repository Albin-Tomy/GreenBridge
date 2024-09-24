import React, { useState } from 'react';
import axios from 'axios';

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
            setError(null);  // Clear any previous errors
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to submit registration. Please try again.');
            setMessage(null);  // Clear any previous success message
        }
    };

    return (
        <div>
            <h2>SHG Registration</h2>
            {message && <p style={{color: 'green'}}>{message}</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Registration Number</label>
                    <input
                        type="text"
                        name="registration_number"
                        value={formData.registration_number}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ShgRegistration;
