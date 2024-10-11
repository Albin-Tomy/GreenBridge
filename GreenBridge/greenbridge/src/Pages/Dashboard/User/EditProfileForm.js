import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../components/Forms/forms.css"; // Ensure you have appropriate styles for your form

const EditProfileForm = ({ onCancel, isEdit }) => {
  const [profileData, setProfileData] = useState(null); // Initial state is null
  const [errorMessage, setErrorMessage] = useState("");

  // Function to fetch token from localStorage
  const getToken = () => {
    const token = localStorage.getItem("authToken");
    console.log("Retrieved Token:", token); // Debugging line
    return token;
  };

  // Fetch existing profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = getToken();
      if (!token) {
        console.error("No token found. Redirecting to login.");
        window.location.href = "/login"; // Redirect to login if no token found
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/v1/auth/user_profiles/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          console.log("Fetched Profile Data:", response.data);
          setProfileData(response.data); // Set profile data
          console.log("User ID:", response.data.user_id); // Print user_id
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setErrorMessage("Failed to fetch profile data."); // Display error message
      }
    };

    fetchProfileData();
  }, []);

  // Update input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // Cancel handler
  const handleOnCancel = () => {
    setProfileData(null);
    onCancel();
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
        alert("User not authenticated");
        return;
    }

    // Assuming profileData includes the id from the fetched profile
    const userId = profileData._id; // Make sure profileData has an id field
    if (!userId) {
        alert("User ID is missing.");
        return;
    }

    try {
        const response = await axios.put(
            `http://localhost:8000/api/v1/auth/user_profiles/update/${userId}`, // Correctly formatted URL
            profileData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        alert("Profile updated successfully!");
        console.log("Profile updated successfully:", response.data);
        window.location.reload(); // Reload to show updated profile
    } catch (error) {
        console.error("Error updating profile:", error.response.data);
        setErrorMessage("Failed to update profile."); // Display error message
    }
};

  // Loading state
  if (!profileData) {
    return <p>Loading profile data...</p>; // Show loading state
  }

  return (
    <div className="form-container">
      <h3>Edit Profile</h3>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div className="formhead">
            <span>Profile Details</span>
          </div>

          <label>First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            className="form-input"
            value={profileData.first_name}
            onChange={handleInputChange}
            required
          />

          <label>Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            className="form-input"
            value={profileData.last_name}
            onChange={handleInputChange}
            required
          />

          <label>Phone Number</label>
          <input
            type="text"
            id="phone"
            name="phone"
            className="form-input"
            value={profileData.phone}
            onChange={handleInputChange}
            required
          />

          <label>Address</label>
          <input
            type="text"
            id="default_address"
            name="default_address"
            className="form-input"
            value={profileData.default_address}
            onChange={handleInputChange}
            required
          />

          <label>City</label>
          <input
            type="text"
            id="default_city"
            name="default_city"
            className="form-input"
            value={profileData.default_city}
            onChange={handleInputChange}
            required
          />

          <label>State</label>
          <input
            type="text"
            id="default_state"
            name="default_state"
            className="form-input"
            value={profileData.default_state}
            onChange={handleInputChange}
            required
          />

          <label>Pincode</label>
          <input
            type="text"
            id="default_pincode"
            name="default_pincode"
            className="form-input"
            value={profileData.default_pincode}
            onChange={handleInputChange}
            required
          />

          <div className="form-actions">
            <button type="submit" className="save-btn">
              {isEdit ? "Update Profile" : "Save Profile"}
            </button>
            <button type="button" className="cancel-btn" onClick={handleOnCancel}>
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default EditProfileForm;
