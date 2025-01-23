import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './wasteform.css';

const WasteCategory = ({ onCancel, initialCategoryData, isEdit, onSave }) => {
    // If in edit mode, populate the form with existing category data
    const [formData, setFormData] = useState(initialCategoryData || { name: '' });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (isEdit && initialCategoryData) {
            setFormData(initialCategoryData);
        }
    }, [isEdit, initialCategoryData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            if (isEdit) {
                // Update existing category
                await axios.put(`http://127.0.0.1:8000/api/v1/collection/waste-categories/${formData.id}/`, formData, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`,
                    },
                });
                alert('Category updated successfully!');
            } else {
                // Create a new category
                await axios.post('http://127.0.0.1:8000/api/v1/collection/waste-categories/', formData, {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`,
                    },
                });
                alert('Category created successfully!');
            }
            
            setFormData({ name: '' }); // Clear form after submission
            onSave(); // Notify parent to refresh data
            onCancel(); // Close form
        } catch (err) {
            setError(isEdit ? 'Failed to update category.' : 'Failed to create category. Please try again.');
        }
    };

    return (
        <div className="waste-category-form">
    <h3 className="form-title">{isEdit ? 'Edit Waste Category' : 'Create Waste Category'}</h3>
    <form onSubmit={handleSubmit} className="form">
        <label htmlFor="name" className="form-label">Category Name</label>
        <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter waste category name"
            required
            className="form-input"
        />
        <button type="submit" className="form-save-btn">
            {isEdit ? 'Update Category' : 'Submit'}
        </button>
        <button type="button" className="form-cancel-btn" onClick={onCancel}>
            Cancel
        </button>
    </form>

    {error && <p className="form-error">{error}</p>}
    {success && <p className="form-success">{success}</p>}
</div>

    );
};

export default WasteCategory;
