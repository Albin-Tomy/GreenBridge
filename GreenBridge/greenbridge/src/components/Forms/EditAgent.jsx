import React, { useState ,useEffect} from "react";
import "./forms.css";
import axios from "axios";
import {formatDateForInput} from "../../Pages/Dashboard/Shg/helper";

const EditStaffForm = ({ staffDetails, onCancel, onConfirm }) => {

    const [staffData, setStaffData] = useState({
        user_id:"",
        first_name: "",
        last_name: "",
        phone: "",
        designation: "no",
        hire_date: "no",
        salary: "no",
      });
  const [errors, setErrors] = useState({});
  console.log("staffDetails--=",staffDetails)

  useEffect(() => {
    setStaffData({
      user_id:staffDetails?.user_id || "",
      first_name: staffDetails.first_name || "",
      last_name:  staffDetails.last_name || "",
      hire_date: formatDateForInput(staffDetails.hire_date) || "",
      phone: staffDetails.phone,
      designation: staffDetails.designation ,
      salary: staffDetails.salary 
    });
  }, [staffDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaffData({ ...staffData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!staffData.first_name) newErrors.first_name = "First name is required.";
    if (!staffData.last_name) newErrors.last_name = "Last name is required.";
    if (!staffData.phone) newErrors.phone = "Phone number is required.";
    if (!staffData.designation) newErrors.designation = "Designation is required.";
    if (!staffData.hire_date) newErrors.hire_date = "Hire date is required.";
    if (!staffData.salary || isNaN(staffData.salary)) newErrors.salary = "Valid salary is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      // Call the API to update staff (assuming staffDetails has staffId)
      await axios.put(`http://127.0.0.1:8000/api/v1/staffs/update/${staffDetails.staff_id}/`, staffData);
      alert("Staff updated successfully!");
      onConfirm();
      onCancel();
    } catch (error) {
      console.error("Error updating staff:", error.response.data);
    }
  };

  return (
    <div className="form-container">
      <h3>Edit Staff Details</h3>
      <form onSubmit={handleSubmit}>
        <div className="head">
          <span>Staff Details</span>
        </div>

        <label htmlFor="user_id">User ID</label>
        <input
          type="text"
          id="user_id"
          name="user_id"
          value={staffData.user_id}
          readOnly
        />

        <label htmlFor="first_name">First Name</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={staffData.first_name}
          onChange={handleInputChange}
        />
        {errors.first_name && <p className="error">{errors.first_name}</p>}

        <label htmlFor="last_name">Last Name</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={staffData.last_name}
          onChange={handleInputChange}
        />
        {errors.last_name && <p className="error">{errors.last_name}</p>}

        <label htmlFor="phone">Phone</label>
        <input
          type="number"
          id="phone"
          name="phone"
          value={staffData.phone}
          onChange={handleInputChange}
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        <label htmlFor="designation">Designation</label>
        <input
          type="text"
          id="designation"
          name="designation"
          value={staffData.designation}
          onChange={handleInputChange}
        />
        {errors.designation && <p className="error">{errors.designation}</p>}

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
        {errors.hire_date && <p className="error">{errors.hire_date}</p>}

        <label htmlFor="salary">Salary</label>
        <input
          type="text"
          id="salary"
          name="salary"
          value={staffData.salary}
          onChange={handleInputChange}
        />
        {errors.salary && <p className="error">{errors.salary}</p>}

        <div className="form-actions">
          <button type="submit" className="save-btn">
            Update Staff
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStaffForm;