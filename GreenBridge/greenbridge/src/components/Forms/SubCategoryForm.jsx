import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './forms.css';

const SubCategoryForm = ({ onCancel, initialSubCategoryData, isEdit }) => {
  const [categories, setCategories] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState({
    name: '',
    description: '',
    category: null,
  });

  useEffect(() => {
    // Fetch all categories to populate the category dropdown
    axios
      .get('https://albintomy.pythonanywhere.com/api/v1/products/category-list/')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });

    // Populate form fields if editing
    if (initialSubCategoryData) {
      setSubCategoryData({
        name: initialSubCategoryData.name || '',
        description: initialSubCategoryData.description || '',
        category: initialSubCategoryData.category || null,
      });
    }
  }, [initialSubCategoryData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData({ ...subCategoryData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(subCategoryData).forEach((key) => {
      formData.append(key, subCategoryData[key]);
    });

    if (isEdit) {
      // Update existing subcategory
      axios
        .put(
          `https://albintomy.pythonanywhere.com/api/v1/products/subcategory-update/${initialSubCategoryData.subcategory_id}/`,
          formData
        )
        .then((response) => {
          alert('Subcategory updated successfully!');
          console.log('Subcategory updated successfully:', response.data);
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error updating subcategory:', error);
        });
    } else {
      // Create a new subcategory
      axios
        .post('https://albintomy.pythonanywhere.com/api/v1/products/subcategory-create/', formData)
        .then((response) => {
          alert('Subcategory created successfully!');
          console.log('Subcategory created successfully:', response.data);
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error creating subcategory:', error);
        });
    }
  };

  return (
    <div className="form-container">
      <h3>{isEdit ? 'Edit Subcategory' : 'Add New Subcategory'}</h3>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div className="formhead">
            <span>Subcategory Details</span>
          </div>

          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            value={subCategoryData.name}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            className="form-input"
            value={subCategoryData.description}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            className="form-input"
            value={subCategoryData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              {isEdit ? 'Update Subcategory' : 'Save Subcategory'}
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

export default SubCategoryForm;
