import React, { useState, useEffect } from "react";
import axios from "axios";
import "./forms.css";

const AddCategoryForm = ({ onCancel, initialCategoryData, isEdit }) => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");

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
    setError(""); // Clear the error message when user starts typing
  };

  const checkCategoryExists = async (name) => {
    try {
      // Make an API call to check if the category name already exists
      const response = await axios.get(`https://greenbridgeserver.onrender.com/api/v1/products/category-list/`);
      const existingCategories = response.data.map((category) => category.name.toLowerCase());
      return existingCategories.includes(name.toLowerCase());
    } catch (error) {
      console.error("Error checking category existence:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check for category name uniqueness
    const categoryExists = await checkCategoryExists(categoryData.name);
    if (categoryExists) {
      setError("A category with this name already exists.");
      return;
    }

    const formData = new FormData();
    Object.keys(categoryData).forEach((key) => {
      formData.append(key, categoryData[key]);
    });

    const request = isEdit
      ? axios.put(
          `https://greenbridgeserver.onrender.com/api/v1/products/category-update/${initialCategoryData.id}/`,
          formData
        )
      : axios.post("https://greenbridgeserver.onrender.com/api/v1/products/category-create/", formData);

    request
      .then((response) => {
        alert(isEdit ? "Category updated successfully!" : "Category added successfully!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error processing request:", error);
        setError("An error occurred while processing the request.");
      });
  };

  return (
    <div className="form-container">
      <h3>{isEdit ? "Edit Category" : "Add New Category"}</h3>
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
          {error && <p className="error-message">{error}</p>}

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
