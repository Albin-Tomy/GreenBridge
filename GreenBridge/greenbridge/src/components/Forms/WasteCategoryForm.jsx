import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './forms.css';

const WasteCategoryForm = ({ onCancel, initialData, isEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    collection_areas: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        collection_areas: initialData.collection_areas || []
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(
          `http://127.0.0.1:8000/api/v1/waste/categories/${initialData.id}/`,
          formData
        );
      } else {
        await axios.post('http://127.0.0.1:8000/api/v1/waste/categories/', formData);
      }
      onCancel();
      window.location.reload();
    } catch (error) {
      console.error('Error saving waste category:', error);
    }
  };

  return (
    <div className="form-container">
      <h3>{isEdit ? 'Edit Waste Category' : 'Add New Waste Category'}</h3>
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
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />

          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />

          <div className="form-actions">
            <button type="submit" className="save-btn">
              {isEdit ? 'Update' : 'Save'}
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

export default WasteCategoryForm; 