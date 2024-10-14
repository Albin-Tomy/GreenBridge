import React, { useState, useEffect } from "react";
import axios from "axios";
import "./forms.css";

const AddCategoryForm = ({ onCancel, initialCategoryData, isEdit }) => {
  const [categoryData, setCategoryData] = useState({
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Category data:", categoryData);
    const formData = new FormData();
    Object.keys(categoryData).forEach((key) => {
      formData.append(key, categoryData[key]);
    });
    if (isEdit) {
      // Update existing product
      axios
        .put(
          `http://127.0.0.1:8000/api/v1/products/category-update/${initialCategoryData.id}/`,
          formData,
          {}
        )
        .then((response) => {
          alert("Category updated successfully!");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error updating product:", error.response.data);
        });
    } else {
      axios
        .post(
          "http://127.0.0.1:8000/api/v1/products/category-create/",
          formData
        )
        .then((res) => {
          alert("Category Added !");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="form-container">
      <h3> {isEdit ? "Edit Category" : "Add New Category"}</h3>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div className="heads">
            <span>Category Details</span>
          </div>

          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={categoryData.name}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={categoryData.description}
            onChange={handleInputChange}
            required
          />

          <div className="form-actions">
            <button type="submit" className="save-btn">
              {isEdit ? "Update Category" : "Save Category"}
            </button>
            <button type="reset" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default AddCategoryForm;