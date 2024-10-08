import React, { useState } from 'react';
import './forms.css';
import axios from "axios";

const AddCountryForm = ({onCancel}) => {
  const [countryData, setCountryData] = useState({
    name: '',
    description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCountryData({ ...countryData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Country data:', countryData);
    const formData = new FormData();
    Object.keys(countryData).forEach((key) => {
      formData.append(key, countryData[key]);
    });
    axios.post("http://127.0.0.1:8000/api/v1/products/country-create/",formData)
    .then((res)=>{
      alert("Country Added !")
      window.location.reload()

    })
    .catch((err)=>{
      console.log(err)
    })
  };

  return (
    <div className="form-container">
      <h3>Add New Country</h3>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div className="formhead">
            <span>Country Details</span>
          </div>
          
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            value={countryData.name}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            className="form-input"
            value={countryData.description}
            onChange={handleInputChange}
            required
          />

          <div className="form-actions">
            <button type="submit" className="save-btn">Save</button>
            <button type="reset" className="cancel-btn" onClick={onCancel}>Cancel</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default AddCountryForm;