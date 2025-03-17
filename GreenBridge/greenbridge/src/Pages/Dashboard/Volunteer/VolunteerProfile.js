import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import './VolunteerProfile.css';

const VolunteerProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showQuitConfirm, setShowQuitConfirm] = useState(false);
    const [quitReason, setQuitReason] = useState('');
    
    const [formData, setFormData] = useState({
        interested_services: '',
        availability: '',
        additional_skills: '',
        experience: '',
        preferred_location: ''
    });

    const token = localStorage.getItem('authToken');

    useEffect(() => {
        fetchVolunteerProfile();
    }, []);

    const fetchVolunteerProfile = async () => {
        try {
            const response = await axios.get(
                'http://127.0.0.1:8000/api/v1/volunteer/profile/',
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
            setLoading(false);
        } catch (error) {
            setError('Error fetching volunteer profile');
            setLoading(false);
            if (error.response?.status === 404) {
                navigate('/volunteer/register');
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await axios.put(
                'http://127.0.0.1:8000/api/v1/volunteer/update/',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setProfile(response.data);
            setMessage('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            setError('Error updating profile');
        }
    };

    const handleQuit = async () => {
        try {
            await axios.post(
                'http://127.0.0.1:8000/api/v1/volunteer/quit/',
                { reason: quitReason },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            setMessage('Successfully quit volunteering');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            setError('Error quitting volunteer service');
        }
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className="volunteer-profile-container">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="volunteer-profile-container">
                <h2>Volunteer Profile</h2>
                
                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                {!isEditing ? (
                    <div className="profile-view">
                        <div className="profile-field">
                            <label>Interested Services:</label>
                            <span>{serviceOptions.find(opt => opt.value === profile.interested_services)?.label}</span>
                        </div>
                        <div className="profile-field">
                            <label>Availability:</label>
                            <span>{availabilityOptions.find(opt => opt.value === profile.availability)?.label}</span>
                        </div>
                        <div className="profile-field">
                            <label>Additional Skills:</label>
                            <span>{profile.additional_skills || 'Not specified'}</span>
                        </div>
                        <div className="profile-field">
                            <label>Experience:</label>
                            <span>{profile.experience || 'Not specified'}</span>
                        </div>
                        <div className="profile-field">
                            <label>Preferred Location:</label>
                            <span>{profile.preferred_location || 'Not specified'}</span>
                        </div>
                        
                        <div className="profile-actions">
                            <button id="edit-profile-btn" onClick={() => setIsEditing(true)} className="edit-btn">
                                Edit Profile
                            </button>
                            <button id="quit-volunteer-btn" onClick={() => setShowQuitConfirm(true)} className="quit-btn">
                                Quit Volunteering
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleUpdate} className="profile-form">
                        <div className="form-group">
                            <label>Interested Services:</label>
                            <select
                                id="interested-services-select"
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
                                id="availability-select"
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
                                id="additional-skills-input"
                                name="additional_skills"
                                value={formData.additional_skills}
                                onChange={handleChange}
                                placeholder="List any relevant skills..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Experience:</label>
                            <textarea
                                id="experience-input"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="Describe your relevant experience..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Preferred Location:</label>
                            <input
                                id="preferred-location-input"
                                type="text"
                                name="preferred_location"
                                value={formData.preferred_location}
                                onChange={handleChange}
                                placeholder="Enter your preferred working location"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" id="save-profile-btn" className="save-btn">
                                Save Changes
                            </button>
                            <button type="button" id="cancel-edit-btn" onClick={() => setIsEditing(false)} className="cancel-btn">
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {showQuitConfirm && (
                    <div className="quit-confirmation">
                        <h3>Are you sure you want to quit volunteering?</h3>
                        <textarea
                            value={quitReason}
                            onChange={(e) => setQuitReason(e.target.value)}
                            placeholder="Please provide a reason for quitting (optional)"
                        />
                        <div className="quit-actions">
                            <button onClick={handleQuit} className="confirm-quit-btn">
                                Confirm Quit
                            </button>
                            <button onClick={() => setShowQuitConfirm(false)} className="cancel-btn">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VolunteerProfile; 