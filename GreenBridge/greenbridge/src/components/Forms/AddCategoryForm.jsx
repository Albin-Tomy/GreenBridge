import React, { useState } from "react";
import axios from "axios";
import "./forms.css";

const AddCategoryForm = ({ onCancel, onConfirm }) => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = { name: "", description: "" };
    let isValid = true;

    if (!categoryData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!categoryData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (!validateForm()) {
  //     return;
  //   }

  //   const formData = new FormData();
  //   Object.keys(categoryData).forEach((key) => {
  //     formData.append(key, categoryData[key]);
  //   });

  //   axios
  //     .post("http://127.0.0.1:8000/api/v1/products/category-create/", formData)
  //     .then((res) => {
  //       alert("Category Added!");
  //       onConfirm();  
  //       onCancel();  
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    const formData = new FormData();
    Object.keys(categoryData).forEach((key) => {
      formData.append(key, categoryData[key]);
    });
  
    axios
      .post("http://127.0.0.1:8000/api/v1/products/category-create/", formData)
      .then((res) => {
        alert("Category Added!");
        onConfirm();
        onCancel();
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error) {
          setErrors({ ...errors, name: err.response.data.error });
        } else {
          console.log(err);
        }
      });
  };
  

  return (
    <div className="form-container">
      <h3>Add New Category</h3>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div className="head">
            <span>Category Details</span>
          </div>

          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={categoryData.name}
            onChange={handleInputChange}
          />
          {errors.name && <div className="error">{errors.name}</div>}

          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={categoryData.description}
            onChange={handleInputChange}
          />
          {errors.description && <div className="error">{errors.description}</div>}

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