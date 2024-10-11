import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'; // Ensure you have CSS for styling the profile page

const UserProfile = () => {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    default_address: '',
    default_city: '',
    default_state: '',
    default_pincode: ''
  });
  const [isEditable, setIsEditable] = useState(false); // Toggle between view and edit mode
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const [successMessage, setSuccessMessage] = useState('');

  const userId = localStorage.getItem('userId'); // Retrieve user ID from localStorage
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/auth/user_profiles/${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfile(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('Profile not found, ready to create one.');
        } else {
          console.error('Error fetching profile:', error);
          setError('Error fetching profile.');
        }
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchProfile();
  }, [userId, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditable(!isEditable); // Toggle edit mode
    setError(''); // Reset error message when toggling
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(''); // Reset success message
    try {
      const response = await axios.put(`http://localhost:8000/api/v1/auth/user_profiles/update/${userId}/`, profile, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuccessMessage('Profile updated successfully!'); // Show success message
      setIsEditable(false); // Disable edit mode after saving
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Profile does not exist, create a new one
        try {
          await axios.post(`http://localhost:8000/api/v1/auth/user_profiles/`, {
            user: userId,
            ...profile
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setSuccessMessage('Profile created successfully!'); // Show success message for creation
        } catch (creationError) {
          console.error('Error creating profile:', creationError);
          setError('Error creating profile.'); // Show error for creation failure
        }
      } else {
        console.error('Error updating profile:', error);
        setError('Error updating profile.'); // Show error for update failure
      }
    }
  };

  if (loading) return <p>Loading...</p>; // Show loading message while fetching

  return (
    <div className="profile-page">
      <h2 className="profile-heading">User Profile</h2>
      <div className="profile-details">
        <p className="profile-item">
          <strong>First Name:</strong> 
          {isEditable ? (
            <input
              type="text"
              name="first_name"
              value={profile.first_name}
              onChange={handleInputChange}
              required
              className="profile-input"
            />
          ) : (
            <span className="profile-value">{profile.first_name}</span>
          )}
        </p>
        
        <p className="profile-item">
          <strong>Last Name:</strong> 
          {isEditable ? (
            <input
              type="text"
              name="last_name"
              value={profile.last_name}
              onChange={handleInputChange}
              required
              className="profile-input"
            />
          ) : (
            <span className="profile-value">{profile.last_name}</span>
          )}
        </p>

        <p className="profile-item">
          <strong>Email:</strong> 
          <span className="profile-value">{profile.email}</span>
        </p>

        <p className="profile-item">
          <strong>Phone:</strong> 
          {isEditable ? (
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
              required
              className="profile-input"
            />
          ) : (
            <span className="profile-value">{profile.phone}</span>
          )}
        </p>

        <p className="profile-item">
          <strong>Address:</strong> 
          {isEditable ? (
            <input
              type="text"
              name="default_address"
              value={profile.default_address}
              onChange={handleInputChange}
              required
              className="profile-input"
            />
          ) : (
            <span className="profile-value">{profile.default_address}</span>
          )}
        </p>

        <p className="profile-item">
          <strong>City:</strong> 
          {isEditable ? (
            <input
              type="text"
              name="default_city"
              value={profile.default_city}
              onChange={handleInputChange}
              required
              className="profile-input"
            />
          ) : (
            <span className="profile-value">{profile.default_city}</span>
          )}
        </p>

        <p className="profile-item">
          <strong>State:</strong> 
          {isEditable ? (
            <input
              type="text"
              name="default_state"
              value={profile.default_state}
              onChange={handleInputChange}
              required
              className="profile-input"
            />
          ) : (
            <span className="profile-value">{profile.default_state}</span>
          )}
        </p>

        <p className="profile-item">
          <strong>Pincode:</strong> 
          {isEditable ? (
            <input
              type="text"
              name="default_pincode"
              value={profile.default_pincode}
              onChange={handleInputChange}
              required
              className="profile-input"
            />
          ) : (
            <span className="profile-value">{profile.default_pincode}</span>
          )}
        </p>
      </div>

      {error && <p className="form-error">{error}</p>}
      {successMessage && <p className="form-success">{successMessage}</p>}

      <button type="button" onClick={handleEditToggle} className="edit-btn">
        {isEditable ? 'Cancel' : 'Edit Profile'}
      </button>

      {isEditable && (
        <button type="submit" onClick={handleSubmit} className="save-btn">Update Profile</button>
      )}
    </div>
  );
};

export default UserProfile;
