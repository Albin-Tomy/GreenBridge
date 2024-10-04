import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    default_address: "",
    default_city: "",
    default_state: "",
    default_pincode: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/auth/profile/complete/")
      .then((response) => {
        setProfile(response.data.profile);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to load profile.");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    axios
      .post("http://localhost:8000/api/v1/auth/profile/complete/", profile)
      .then((response) => {
        setSuccess(true);
        navigate("/dashboard");
      })
      .catch((error) => {
        setError("Failed to update profile.");
      });
  };

  if (loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-header">Complete Your Profile</h2>
      {error && <div className="profile-error">{error}</div>}
      {success && <div className="profile-success">Profile updated successfully!</div>}
      <form className="profile-form" onSubmit={handleSubmit}>
        <input
          className="profile-input"
          type="text"
          name="first_name"
          placeholder="First Name"
          value={profile.first_name}
          onChange={handleChange}
        />
        <input
          className="profile-input"
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={profile.last_name}
          onChange={handleChange}
        />
        <input
          className="profile-input"
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={profile.phone}
          onChange={handleChange}
        />
        <input
          className="profile-input"
          type="text"
          name="default_address"
          placeholder="Address"
          value={profile.default_address}
          onChange={handleChange}
        />
        <input
          className="profile-input"
          type="text"
          name="default_city"
          placeholder="City"
          value={profile.default_city}
          onChange={handleChange}
        />
        <input
          className="profile-input"
          type="text"
          name="default_state"
          placeholder="State"
          value={profile.default_state}
          onChange={handleChange}
        />
        <input
          className="profile-input"
          type="text"
          name="default_pincode"
          placeholder="Pincode"
          value={profile.default_pincode}
          onChange={handleChange}
        />
        <button className="profile-submit" type="submit">Complete Profile</button>
      </form>
    </div>
  );
};

export default Profile;
