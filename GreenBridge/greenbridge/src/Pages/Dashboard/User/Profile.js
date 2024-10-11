import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Profile.css"; // Ensure you have appropriate styles for your profile

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Create a navigate function

  // Function to fetch token from localStorage
  const getToken = () => {
    const token = localStorage.getItem("authToken");
    console.log("Retrieved Token:", token); // Debugging line
    return token;
  };

  // Fetch profile data when component mounts
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
        } else {
          // If no profile data is found, redirect to edit profile
          navigate("/edit-profile"); // Use navigate to go to edit profile
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setErrorMessage("Failed to fetch profile data."); // Display error message
      }
    };

    fetchProfileData();
  }, [navigate]); // Include navigate in dependency array

  if (!profileData) {
    return <p>Loading profile data...</p>; // Show loading state
  }

  return (
    <div className="profile-container">
      <h3>User Profile</h3>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="profile-details">
        <p><strong>First Name:</strong> {profileData.first_name}</p>
        <p><strong>Last Name:</strong> {profileData.last_name}</p>
        <p><strong>Phone Number:</strong> {profileData.phone}</p>
        <p><strong>Address:</strong> {profileData.default_address}</p>
        <p><strong>City:</strong> {profileData.default_city}</p>
        <p><strong>State:</strong> {profileData.default_state}</p>
        <p><strong>Pincode:</strong> {profileData.default_pincode}</p>
      </div>
      <button onClick={() => navigate("/edit-profile")} className="edit-profile-button">Edit Profile</button>
    </div>
  );
};

export default Profile;
