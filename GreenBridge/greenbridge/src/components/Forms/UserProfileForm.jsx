import React, { useState } from 'react';
import './forms.css';

const AddUserProfileForm = () => {
  const [profileData, setProfileData] = useState({
    user: '',
    firstName: '',
    secondName: '',
    phone: '',
    defaultAddress: '',
    defaultCity: '',
    defaultState: '',
    defaultPincode: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Profile data:', profileData);
  };

  return (
    <div className="form-container">
      <h3>Add New User Profile</h3>
      <form onSubmit={handleSubmit}>
        <div className="heads">
          <span>User Profile Details</span>
        </div>

        <label htmlFor="user">User</label>
        <input
          type="text"
          id="user"
          name="user"
          value={profileData.user}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={profileData.firstName}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="secondName">Second Name</label>
        <input
          type="text"
          id="secondName"
          name="secondName"
          value={profileData.secondName}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="phone">Phone</label>
        <input
          type="number"
          id="phone"
          name="phone"
          value={profileData.phone}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="defaultAddress">Default Address</label>
        <input
          type="text"
          id="defaultAddress"
          name="defaultAddress"
          value={profileData.defaultAddress}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="defaultCity">Default City</label>
        <input
          type="text"
          id="defaultCity"
          name="defaultCity"
          value={profileData.defaultCity}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="defaultState">Default State</label>
        <input
          type="text"
          id="defaultState"
          name="defaultState"
          value={profileData.defaultState}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="defaultPincode">Default Pincode</label>
        <input
          type="text"
          id="defaultPincode"
          name="defaultPincode"
          value={profileData.defaultPincode}
          onChange={handleInputChange}
          required
        />

        <div className="form-actions">
          <button type="submit" className="save-btn">Save User Profile</button>
          <button type="reset" className="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddUserProfileForm;