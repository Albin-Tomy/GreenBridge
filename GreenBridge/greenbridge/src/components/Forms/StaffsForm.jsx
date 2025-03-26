import React, { useState } from 'react';
import axios from 'axios';
import './forms.css';

const AddStaffForm = ({onCancel}) => {
  const [staffData, setStaffData] = useState({
    user_id: '',
    first_name: '',
    last_name: '',
    phone: '',
    designation: '',
    hire_date: '',
    salary: '',

  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaffData({ ...staffData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Staff data:', staffData);
    const formData = new FormData();
    Object.keys(staffData).forEach((key) => {
      formData.append(key, staffData[key]);
    });
    axios.post("https://greenbridgeserver.onrender.com/api/v1/staffs/create/",formData)
    .then((res)=>{
      alert("staffData Added !")
      window.location.reload()

    })
    .catch((err)=>{
      console.log(err)
    })
  };

  return (
    <div className="form-container">
      <h3>Add New Staff</h3>
      <form onSubmit={handleSubmit}>
        <div className="heads">
          <span>Staff Details</span>
        </div>

        <label htmlFor="user_id">User</label>
        <input
          type="text"
          id="user_id"
          name="user_id"
          value={staffData.user_id}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="first_name">First Name</label>
        <input
          type="text"
          id="first_name"
          name="first_name"
          value={staffData.first_name}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="last_name">Last Name</label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={staffData.last_name}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="phone">Phone</label>
        <input
          type="number"
          id="phone"
          name="phone"
          value={staffData.phone}
          onChange={handleInputChange}
          required
        />

<label htmlFor="hire_date">Designation</label>
        <input
          type="text"
          id="designation"
          name="designation"
          value={staffData.designation}
          onChange={handleInputChange}
          required
        />

        {/* <label htmlFor="designation">Order Status</label>
        <select
          id="designation"
          name="designation"
          value={staffData.designation}
          onChange={handleInputChange}
        >
          <option value="1">Order Placed</option>
          <option value="2">Pending</option>
          <option value="3">Dispatched</option>
          <option value="4">Delivered</option>
          <option value="5">Canceled</option>
        </select> */}

        <label htmlFor="hire_date">Hire Date</label>
        <input
          type="date"
          id="hire_date"
          name="hire_date"
          value={staffData.hire_date}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="salary">Salary</label>
        <input
          type="text"
          id="salary"
          name="salary"
          value={staffData.salary}
          onChange={handleInputChange}
          required
        />

        {/* <label htmlFor="totalAmount">Total Amount</label>
        <input
          type="text"
          id="totalAmount"
          name="totalAmount"
          value={staffData.totalAmount}
          onChange={handleInputChange}
          required
        /> */}

        <div className="form-actions">
          <button type="submit" className="save-btn">Save Staff</button>
          <button type="reset" className="cancel-btn" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddStaffForm;