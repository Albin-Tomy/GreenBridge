
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./forms.css";

const AddStaffForm = ({ onCancel,onConfirm }) => {
  const [staffData, setStaffData] = useState({
    user_id: "",
    first_name: "",
    last_name: "",
    phone: "",
    designation: "",
    hire_date: "",
    salary: "",
    is_active: true,
  });

  const [newUserData, setNewUserData] = useState({
    email: "",
    password: "",
  });

  const [userSelection, setUserSelection] = useState("new");
  const [existingUsers, setExistingUsers] = useState([]);
  const [newUser,setNewUser] = useState()

  useEffect(() => {
    const fetchExistingUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/v1/auth/users/");
        setExistingUsers(response.data);
      } catch (error) {
        console.error("Error fetching existing users:", error);
      }
    };

    fetchExistingUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaffData({ ...staffData, [name]: value });
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  const handleUserSelectionChange = (e) => {
    setUserSelection(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let userId;

    if (userSelection === "existing") {
      userId = staffData.user_id;
    } else {
      if (!newUserData.email || !newUserData.password) {
        alert("Email and password are required for new user creation.");
        return;
      }
    }

    const formData = new FormData();
    Object.keys(staffData).forEach((key) => {
      formData.append(key, staffData[key]);
    });

    if (userSelection === "new") {
      const newFormData = new FormData()
      newFormData.append("email", newUserData.email);
      newFormData.append("password", newUserData.password);
      await axios.post("http://127.0.0.1:8000/api/v1/auth/add-new-user/", newFormData)
      .then((res) => {
        console.log("user---",res.data)
        console.log("res.data.id",res.data.id)
        setNewUser(res.data)
        formData.append("user_id", res.data.id);

      })

    } else {
      formData.append("user_id", userId);
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/v1/staffs/create/", formData);
      alert("Staff added successfully!");
      onCancel()
      onConfirm()
    } catch (error) {
      console.error("Error adding staff:", error.response.data);
    }
  };

  return (
    <div className="form-container">
      <h3>Add New Staff</h3>
      <form onSubmit={handleSubmit}>
        <div className="head">
          <span>Staff Details</span>
        </div>

        <label>
          <input
            type="radio"
            value="new"
            checked={userSelection === "new"}
            onChange={handleUserSelectionChange}
          />
          Add New User
        </label>
        <label>
          <input
            type="radio"
            value="existing"
            checked={userSelection === "existing"}
            onChange={handleUserSelectionChange}
          />
          Select Existing User
        </label>

        {userSelection === "new" ? (
          <>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={newUserData.email}
              onChange={handleNewUserChange}
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={newUserData.password}
              onChange={handleNewUserChange}
            />
          </>
        ) : (
          <>
            <label htmlFor="user_id">Existing Users</label>
            <select
              id="user_id"
              name="user_id"
              value={staffData.user_id}
              onChange={handleInputChange}
            >
              <option value="">Select an existing user</option>
              {existingUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email} {/* Display the email or any other relevant info */}
                </option>
              ))}
            </select>
          </>
        )}

        <label htmlFor="first_name">First Name</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={staffData.first_name}
          onChange={handleInputChange}
        />

        <label htmlFor="last_name">Last Name</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={staffData.last_name}
          onChange={handleInputChange}
        />

        <label htmlFor="phone">Phone</label>
        <input
          type="number"
          id="phone"
          name="phone"
          value={staffData.phone}
          onChange={handleInputChange}
        />

        <label htmlFor="designation">Designation</label>
        <input
          type="text"
          id="designation"
          name="designation"
          value={staffData.designation}
          onChange={handleInputChange}
        />

        <label htmlFor="status">Status</label>
        <select
          id="is_active"
          name="is_active"
          value={staffData.is_active}
          onChange={(e) =>
            handleInputChange({
              target: { name: "is_active", value: e.target.value === "true" },
            })
          }
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <label htmlFor="hire_date">Hire Date</label>
        <input
          type="date"
          id="hire_date"
          name="hire_date"
          value={staffData.hire_date}
          onChange={handleInputChange}
        />

        <label htmlFor="salary">Salary</label>
        <input
          type="text"
          id="salary"
          name="salary"
          value={staffData.salary}
          onChange={handleInputChange}
        />

        <div className="form-actions">
          <button type="submit" className="save-btn">
            Save Staff
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStaffForm;
