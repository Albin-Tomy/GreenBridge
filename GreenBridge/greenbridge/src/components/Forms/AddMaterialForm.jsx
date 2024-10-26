import React, { useState } from 'react';
import axios from "axios";
import './forms.css';

const AddMadeofForm = ({ onCancel, onConfirm }) => {
  const [madeOfData, setMadeOfData] = useState({
    name: '',
    description: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMadeOfData({ ...madeOfData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = { name: '', description: '' };
    let isValid = true;

    if (!madeOfData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!madeOfData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    Object.keys(madeOfData).forEach((key) => {
      formData.append(key, madeOfData[key]);
    });

    axios
      .post("http://127.0.0.1:8000/api/v1/products/madeof-create/", formData)
      .then((res) => {
        alert("Made Of Added!");
        onConfirm(); 
        onCancel();  
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="form-container">
      <h3>Add New Made Of</h3>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div className="head">
            <span>Made Of Details</span>
          </div>
          
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={madeOfData.name}
            onChange={handleInputChange}
          />
          {errors.name && <div className="error">{errors.name}</div>}

          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={madeOfData.description}
            onChange={handleInputChange}
          />
          {errors.description && <div className="error">{errors.description}</div>}

          <div className="form-actions">
            <button type="submit" className="save-btn">Save</button>
            <button type="reset" className="cancel-btn" onClick={onCancel}>Cancel</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default AddMadeofForm;