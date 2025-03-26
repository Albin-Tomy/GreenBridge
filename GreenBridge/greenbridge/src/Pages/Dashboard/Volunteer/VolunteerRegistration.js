import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import './VolunteerRegistration.css';

const VolunteerRegistration = () => {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [formData, setFormData] = useState({
        interested_services: 'community_service',
        availability: 'flexible',
        additional_skills: '',
        experience: '',
        preferred_location: '',
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(
                    `https://greenbridgeserver.onrender.com/api/v1/auth/user_profiles/${userId}/`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setUserProfile(response.data);
                setLoading(false);
            } catch (error) {
                setError('Please complete your profile before registering as a volunteer');
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId, token]);

    const serviceOptions = [
        { value: 'waste_collection', label: 'Waste Collection' },
        { value: 'shg_training', label: 'SHG Training' },
        { value: 'product_marketing', label: 'Product Marketing' },
        { value: 'community_service', label: 'Community Service' },
        { value: 'environmental', label: 'Environmental Activities' }
    ];

    const availabilityOptions = [
        { value: 'weekdays', label: 'Weekdays' },
        { value: 'weekends', label: 'Weekends' },
        { value: 'both', label: 'Both' },
        { value: 'flexible', label: 'Flexible' }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post(
                'https://greenbridgeserver.onrender.com/api/v1/volunteer/register/',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setMessage(response.data.message);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.response?.data?.error || 'Registration failed. Please try again.');
        }
    };

    const renderProfileInfo = () => {
        if (userProfile) {
            return (
                <div className="profile-info">
                    <h3>Your Profile Information</h3>
                    <p><strong>Name:</strong> {userProfile.first_name} {userProfile.last_name}</p>
                    <p><strong>Phone:</strong> {userProfile.phone}</p>
                    <p><strong>Address:</strong> {userProfile.default_address}</p>
                    <p><strong>City:</strong> {userProfile.default_city}</p>
                    <p><strong>State:</strong> {userProfile.default_state}</p>
                    <p><strong>Pincode:</strong> {userProfile.default_pincode}</p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className="volunteer-registration-container">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div>
                <Header />
                <div className="volunteer-registration-container">
                    <div className="error-message">
                        {error}
                        <button onClick={() => navigate('/profile')} className="profile-btn">
                            Complete Profile
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="volunteer-registration-container">
                <h2>Volunteer Registration</h2>
                
                {renderProfileInfo()}

                <form onSubmit={handleSubmit} className="volunteer-form">
                    <div className="form-group">
                        <label>Interested Services:</label>
                        <select
                            name="interested_services"
                            value={formData.interested_services}
                            onChange={handleChange}
                            required
                        >
                            {serviceOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Availability:</label>
                        <select
                            name="availability"
                            value={formData.availability}
                            onChange={handleChange}
                            required
                        >
                            {availabilityOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Additional Skills:</label>
                        <textarea
                            name="additional_skills"
                            value={formData.additional_skills}
                            onChange={handleChange}
                            placeholder="List any relevant skills..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Experience:</label>
                        <textarea
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="Describe your relevant experience..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Preferred Location:</label>
                        <input
                            type="text"
                            name="preferred_location"
                            value={formData.preferred_location}
                            onChange={handleChange}
                            placeholder="Enter your preferred working location"
                        />
                    </div>

                    {message && <div className="success-message">{message}</div>}
                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" id="submit" className="submit-btn">
                        Register as Volunteer
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VolunteerRegistration; 