import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/Header';
import './VolunteerProfile.css';

const VolunteerProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        interested_services: '',
        availability: '',
        additional_skills: '',
        experience: '',
        preferred_location: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const token = localStorage.getItem('authToken');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(
                'http://127.0.0.1:8000/api/volunteer/profile/',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setProfile(response.data);
            setFormData({
                interested_services: response.data.interested_services,
                availability: response.data.availability,
                additional_skills: response.data.additional_skills || '',
                experience: response.data.experience || '',
                preferred_location: response.data.preferred_location || ''
            });
        } catch (error) {
            setError('Error fetching profile');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                'http://127.0.0.1:8000/api/volunteer/update/',
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setMessage('Profile updated successfully');
            setIsEditing(false);
            fetchProfile();
        } catch (error) {
            setError('Error updating profile');
        }
    };

    const handleQuit = async () => {
        if (window.confirm('Are you sure you want to quit volunteering? This action cannot be undone.')) {
            try {
                await axios.post(
                    'http://127.0.0.1:8000/api/volunteer/quit/',
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                navigate('/dashboard');
            } catch (error) {
                setError('Error quitting volunteer service');
            }
        }
    };

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

    return (
        <div>
            <Header />
            <div className="volunteer-profile-container">
                <h2 className="profile-title">Volunteer Profile</h2>

                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                {profile && (
                    <div className="profile-content">
                        <div className="user-info">
                            <h3>Personal Information</h3>
                            <p><strong>Name:</strong> {profile.user_details?.first_name} {profile.user_details?.last_name}</p>
                            <p><strong>Phone:</strong> {profile.user_details?.phone}</p>
                            <p><strong>Address:</strong> {profile.user_details?.address}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="volunteer-form">
                            <div className="form-group">
                                <label>Interested Services:</label>
                                <select
                                    name="interested_services"
                                    value={formData.interested_services}
                                    onChange={handleChange}
                                    disabled={!isEditing}
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
                                    disabled={!isEditing}
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
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="form-group">
                                <label>Experience:</label>
                                <textarea
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="form-group">
                                <label>Preferred Location:</label>
                                <input
                                    type="text"
                                    name="preferred_location"
                                    value={formData.preferred_location}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="button-group">
                                {!isEditing ? (
                                    <button 
                                        type="button" 
                                        onClick={() => setIsEditing(true)}
                                        className="edit-btn"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button type="submit" className="save-btn">
                                            Save Changes
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setIsEditing(false)}
                                            className="cancel-btn"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>

                        <div className="action-buttons">
                            <Link to="/volunteer/blockchain" className="view-blockchain-btn">
                                View Blockchain History
                            </Link>
                            <button onClick={handleQuit} className="quit-btn">
                                Quit Volunteering
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VolunteerProfile; 