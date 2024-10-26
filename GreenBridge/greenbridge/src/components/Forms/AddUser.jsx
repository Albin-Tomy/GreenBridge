
import React, { useState } from "react";
import "./forms.css";
import axios from "axios";
import { formatDateForInput } from "../../Pages/Dashboard/Shg/helper";

const AddUserForm = ({ onCancel, onConfirm }) => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    dateJoined: "",
    isStaff: "no",
    isActive: "no",
    isSuperUser:"no",
    isProfileCompleted: "no",
    lastLogin: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!userData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Email address is invalid.";
    }

    // Password validation
    if (!userData.password) {
      newErrors.password = "Password is required.";
    } else if (userData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // Radio button validation
    if (userData.isStaff === "") {
      newErrors.isStaff = "Please select whether the user is staff.";
    }
    if (userData.isActive === "") {
      newErrors.isActive = "Please select whether the user is active.";
    }
    if (userData.isProfileCompleted === "") {
      newErrors.isProfileCompleted =
        "Please select whether the profile is completed.";
    }
    if (userData.isSuperUser === "") {
        newErrors.isSuperUser =
          "Please select whether the user has Admin privilege.";
      }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const processedData = {
        ...userData,
        isStaff: userData.isStaff === "yes",
        isActive: userData.isActive === "yes",
        isSuperUser:userData.isSuperUser === "yes",
        isProfileCompleted: userData.isProfileCompleted === "yes",
      };

      const formData = new FormData();
      Object.keys(processedData).forEach((key) => {
        formData.append(key, processedData[key]);
      });

      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

    axios
      .post("http://127.0.0.1:8000/api/v1/auth/add-new-user/", formData)
      .then((res) => {
        alert("User Added!");
        onCancel()
        onConfirm()
      })
      .catch((err) => {
        if (err.response) {
          const errorMessage =
            err.response.data.message || "User with the email already exists.";
          alert(errorMessage);
        } else {
          alert("Network error. Please try again later.");
        }
      });
  };

  return (
    <div className="form-container">
      <h3>Add New User</h3>
      <form onSubmit={handleSubmit}>
        <div className="head">
          <span>User Details</span>
        </div>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={userData.password}
          onChange={handleInputChange}
        />
        {errors.password && <span className="error">{errors.password}</span>}

        <label htmlFor="dateJoined">Date Joined</label>
        <input
          type="date"
          id="dateJoined"
          name="dateJoined"
          value={userData.dateJoined}
          onChange={handleInputChange}
        />
        {errors.dateJoined && (
          <span className="error">{errors.dateJoined}</span>
        )}

        <div className="radio-group">
          <label>
            <b>Is Staff</b>
          </label>
          <div className="options">
            <input
              type="radio"
              id="staff_yes"
              name="isStaff"
              value="yes"
              checked={userData.isStaff === "yes"}
              onChange={handleInputChange}
            />
            <label htmlFor="staff_yes">Yes</label>

            <input
              type="radio"
              id="staff_no"
              name="isStaff"
              value="no"
              checked={userData.isStaff === "no"}
              onChange={handleInputChange}
            />
            <label htmlFor="staff_no">No</label>
          </div>
        </div>

        <div className="radio-group">
          <label>
            <b>Is Active</b>
          </label>
          <div className="options">
            <input
              type="radio"
              id="active_yes"
              name="isActive"
              value="yes"
              checked={userData.isActive === "yes"}
              onChange={handleInputChange}
            />
            <label htmlFor="active_yes">Yes</label>

            <input
              type="radio"
              id="active_no"
              name="isActive"
              value="no"
              checked={userData.isActive === "no"}
              onChange={handleInputChange}
            />
            <label htmlFor="active_no">No</label>
          </div>
        </div>

        <div className="radio-group">
          <label>
            <b>Is Profile Completed</b>
          </label>
          <div className="options">
            <input
              type="radio"
              id="profile_yes"
              name="isProfileCompleted"
              value="yes"
              checked={userData.isProfileCompleted === "yes"}
              onChange={handleInputChange}
            />
            <label htmlFor="profile_yes">Yes</label>

            <input
              type="radio"
              id="profile_no"
              name="isProfileCompleted"
              value="no"
              checked={userData.isProfileCompleted === "no"}
              onChange={handleInputChange}
            />
            <label htmlFor="profile_no">No</label>
          </div>
        </div>

        <div className="radio-group">
          <label>
            <b>Is Admin</b>
          </label>
          <div className="options">
            <input
              type="radio"
              id="admin_yes"
              name="isSuperUser"
              value="yes"
              checked={userData.isSuperUser === "yes"}
              onChange={handleInputChange}
            />
            <label htmlFor="admin_yes">Yes</label>

            <input
              type="radio"
              id="admin_no"
              name="isSuperUser"
              value="no"
              checked={userData.isSuperUser === "no"}
              onChange={handleInputChange}
            />
            <label htmlFor="admin_no">No</label>
          </div>
        </div>

        <label htmlFor="lastLogin">Last Login</label>
        <input
          type="date"
          id="lastLogin"
          name="lastLogin"
          value={userData.lastLogin}
          onChange={handleInputChange}
        />
        {errors.lastLogin && <span className="error">{errors.lastLogin}</span>}

        <div className="form-actions">
          <button type="submit" className="save-btn">
            Save User
          </button>
          <button type="reset" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
