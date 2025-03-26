import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import Header from '../../../components/Header';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
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
  const [isEditable, setIsEditable] = useState(true); // Set to true by default for incomplete profiles
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    let isMounted = true;  // Add mounted flag

    const fetchProfile = async () => {
      if (!userId || !token) return;  // Add guard clause
      
      try {
        const response = await axios.get(`https://greenbridgeserver.onrender.com/api/v1/auth/user_profiles/${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (isMounted) {  // Only update state if component is mounted
          setProfile(response.data);
          const isComplete = response.data.is_profile_completed;
          setIsProfileComplete(isComplete);
          setIsEditable(!isComplete);
          setLoading(false);
        }
      } catch (error) {
        if (!isMounted) return;  // Don't update state if unmounted
        
        if (error.response && error.response.status === 404) {
          setIsEditable(true);
          if (user?.email) {
            setProfile(prev => ({ ...prev, email: user.email }));
          }
        } else {
          console.error('Error fetching profile:', error);
          setError('Error fetching profile.');
        }
        setLoading(false);
      }
    };

    fetchProfile();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [userId, token]); // Only depend on userId and token

  const validateName = (name) => /^[A-Za-z]+$/.test(name); // Ensure the name contains only letters
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone); // Ensure the phone number is a 10-digit number
  const validatePincode = (pincode) => {
    const pincodeStr = pincode.toString();
    return /^[0-9]{6}$/.test(pincodeStr);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const countryOptions = {
    India: [
      'Andhra Pradesh',
      'Arunachal Pradesh',
      'Assam',
      'Bihar',
      'Chhattisgarh',
      'Goa',
      'Gujarat',
      'Haryana',
      'Himachal Pradesh',
      'Jharkhand',
      'Karnataka',
      'Kerala',
      'Madhya Pradesh',
      'Maharashtra',
      'Manipur',
      'Meghalaya',
      'Mizoram',
      'Nagaland',
      'Odisha',
      'Punjab',
      'Rajasthan',
      'Sikkim',
      'Tamil Nadu',
      'Telangana',
      'Tripura',
      'Uttar Pradesh',
      'Uttarakhand',
      'West Bengal',
      'Andaman and Nicobar Islands',
      'Chandigarh',
      'Dadra and Nagar Haveli and Daman and Diu',
      'Lakshadweep',
      'Delhi',
      'Puducherry',
    ]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');

    // Validation checks
    if (!validateName(profile.first_name)) {
      setError('First name must contain only letters.');
      return;
    }
    if (!validateName(profile.last_name)) {
      setError('Last name must contain only letters.');
      return;
    }
    if (!validatePhone(profile.phone)) {
      setError('Phone number must be a valid 10-digit number.');
      return;
    }
    if (!validatePincode(profile.default_pincode)) {
      setError('Pincode must be a valid 6-digit number.');
      return;
    }

    try {
      const response = await axios.put(
        `https://greenbridgeserver.onrender.com/api/v1/auth/user_profiles/update/${userId}/`,
        {
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          default_address: profile.default_address,
          default_city: profile.default_city,
          default_state: profile.default_state,
          default_pincode: profile.default_pincode.toString() // Convert to string
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccessMessage('Profile updated successfully!');
      setIsProfileComplete(true);
      setIsEditable(false);

      // Redirect based on user role after profile completion
      if (user) {
        if (user.is_superuser) {
          navigate('/admin/admin');
        } else if (user.is_shg) {
          navigate('/shg');
        } else if (user.is_ngo) {
          navigate('/ngo/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error);
      setError(error.response?.data?.error || 'Error updating profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="profile-page">
        <h2 className="profile-heading">
          {!isProfileComplete ? 'Complete Your Profile' : 'User Profile'}
        </h2>
        {!isProfileComplete && (
          <p className="profile-message">
            Please complete your profile information to continue
          </p>
        )}
        
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
              <select
                name="default_state"
                value={profile.default_state}
                onChange={handleInputChange}
                required
                className="profile-input"
              >
                <option value="">Select State</option>
                {countryOptions.India.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
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

        {!isProfileComplete ? (
          <button type="submit" onClick={handleSubmit} className="save-btn">
            Complete Profile
          </button>
        ) : (
          <>
            <button type="button" onClick={() => setIsEditable(!isEditable)} className="edit-btn">
              {isEditable ? 'Cancel' : 'Edit Profile'}
            </button>
            {isEditable && (
              <button type="submit" onClick={handleSubmit} className="save-btn">
                Update Profile
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
