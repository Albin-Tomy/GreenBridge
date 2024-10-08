import React, { useState } from 'react';
import axios from 'axios';
import './forms.css';

const AddCategoryForm = ({onCancel}) => {
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Category data:', categoryData);
    const formData = new FormData();
    Object.keys(categoryData).forEach((key) => {
      formData.append(key, categoryData[key]);
    });
    axios.post("http://127.0.0.1:8000/api/v1/products/category-create/",formData)
    .then((res)=>{
      alert("Category Added !")
      window.location.reload()

    })
    .catch((err)=>{
      console.log(err)
    })
  };

  return (
    <div className="form-container">
      <h3>Add New Category</h3>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div className="formhead">
            <span>Category Details</span>
          </div>
          
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            value={categoryData.name}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            className="form-input"
            value={categoryData.description}
            onChange={handleInputChange}
            required
          />

          <div className="form-actions">
            <button type="submit" className="save-btn">Save Category</button>
            <button type="reset" className="cancel-btn" onClick={onCancel}>Cancel</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default AddCategoryForm;