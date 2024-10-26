import React, { useState, useEffect } from "react";
import axios from "axios";
import "./forms.css";

const EditCategoryForm = ({ onCancel, onConfirm, initialCategoryData }) => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
  });

  console.log("initialCategoryData...",initialCategoryData)

  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (initialCategoryData) {
      setCategoryData({
        name: initialCategoryData.name,
        description: initialCategoryData.description,
      });
    }
  }, [initialCategoryData]);

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
      .put(`http://127.0.0.1:8000/api/v1/products/category-update/${initialCategoryData.id}/`, formData)
      .then((response) => {
        alert("Category updated successfully!");
        onCancel()
        onConfirm()
      })
      .catch((error) => {
        console.error("Error updating category:", error.response.data);
      });
  };

  return (
    <div className="form-container">
      <h3>Edit Category</h3>
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
            <button type="submit" className="save-btn">Update Category</button>
            <button type="reset" className="cancel-btn" onClick={onCancel}>Cancel</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default EditCategoryForm;