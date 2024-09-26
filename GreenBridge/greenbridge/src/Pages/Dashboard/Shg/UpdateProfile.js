import React, { useState } from 'react';
import './UpdateProfile.css'; // Import the CSS for the form

const UpdateProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    profileImage: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = (e) => {
    setProfile({ ...profile, profileImage: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic to handle the form submission (e.g., API call)
    console.log(profile);
  };

  return (
    <div className="update-profile">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            name="name" 
            value={profile.name} 
            onChange={handleInputChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            value={profile.email} 
            onChange={handleInputChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Contact</label>
          <input 
            type="text" 
            name="contact" 
            value={profile.contact} 
            onChange={handleInputChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea 
            name="address" 
            value={profile.address} 
            onChange={handleInputChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Profile Image</label>
          <input 
            type="file" 
            onChange={handleImageChange} 
            accept="image/*"
          />
        </div>

        <button type="submit" className="btn-submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
