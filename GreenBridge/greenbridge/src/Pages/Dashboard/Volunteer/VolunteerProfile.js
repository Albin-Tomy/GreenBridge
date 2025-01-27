import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './VolunteerProfile.css';

const VolunteerProfile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        interested_services: '',
        availability: '',
        additional_skills: '',
        experience: '',
        preferred_location: ''
    });

    const token = localStorage.getItem('authToken');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(
                'http://127.0.0.1:8000/api/volunteer/dashboard/',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setProfile(response.data);
            setFormData({
                interested_services: response.data.interested_services,
                availability: response.data.availability,
                additional_skills: response.data.additional_skills,
                experience: response.data.experience,
                preferred_location: response.data.preferred_location
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleQuit = async () => {
        if (window.confirm('Are you sure you want to quit volunteering?')) {
            try {
                await axios.post(
                    'http://127.0.0.1:8000/api/volunteer/quit/',
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                window.location.href = '/dashboard';
            } catch (error) {
                console.error('Error quitting:', error);
            }
        }
    };

    return (
        <div className="volunteer-profile">
            <div className="profile-header">
                <h2>Volunteer Profile</h2>
                <button onClick={handleQuit} className="quit-btn">
                    Quit Volunteering
                </button>
            </div>

            {profile && (
                <div className="profile-content">
                    <div className="user-info">
                        <h3>Personal Information</h3>
                        <p><strong>Name:</strong> {profile.user_details?.first_name} {profile.user_details?.last_name}</p>
                        <p><strong>Email:</strong> {profile.user_details?.email}</p>
                        <p><strong>Phone:</strong> {profile.user_details?.phone}</p>
                    </div>

                    <div className="volunteer-info">
                        <h3>Volunteering Details</h3>
                        <p><strong>Status:</strong> {profile.status}</p>
                        <p><strong>Interested Services:</strong> {profile.interested_services}</p>
                        <p><strong>Availability:</strong> {profile.availability}</p>
                        <p><strong>Additional Skills:</strong> {profile.additional_skills}</p>
                        <p><strong>Experience:</strong> {profile.experience}</p>
                        <p><strong>Preferred Location:</strong> {profile.preferred_location}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolunteerProfile; 