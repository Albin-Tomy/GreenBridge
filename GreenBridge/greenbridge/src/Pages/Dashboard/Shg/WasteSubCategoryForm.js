import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './wasteform.css';

const WasteSubcategory = ({ onCancel, initialSubcategoryData, isEdit, onSave }) => {
    const [formData, setFormData] = useState(initialSubcategoryData || { name: '', waste_category: '' });
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (isEdit && initialSubcategoryData) {
            setFormData(initialSubcategoryData);
        }
        fetchSubcategories();
        fetchCategories();
    }, [isEdit, initialSubcategoryData]);

    const fetchSubcategories = async () => {
        try {
            const response = await axios.get('https://greenbridgeserver.onrender.com/api/v1/collection/waste-subcategories/');
            setSubcategories(response.data);
        } catch (err) {
            console.error('Error fetching subcategories:', err);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://greenbridgeserver.onrender.com/api/v1/collection/waste-categories/');
            setCategories(response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

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
                await axios.put(`https://greenbridgeserver.onrender.com/api/v1/collection/waste-subcategories/${formData.id}/`, formData, {
                    headers: { 'Authorization': `Token ${localStorage.getItem('token')}` },
                });
                alert('Subcategory updated successfully!');
            } else {
                await axios.post('https://greenbridgeserver.onrender.com/api/v1/collection/waste-subcategories/', formData, {
                    headers: { 'Authorization': `Token ${localStorage.getItem('token')}` },
                });
                alert('Subcategory created successfully!');
            }

            setFormData({ name: '', waste_category: '' });
            onSave();
            onCancel();
            fetchSubcategories();
        } catch (err) {
            setError(isEdit ? 'Failed to update subcategory.' : 'Failed to create subcategory. Please try again.');
        }
    };

    return (
        <div className="waste-category-form">
            <h3 className="form-title">{isEdit ? 'Edit Waste Subcategory' : 'Create Waste Subcategory'}</h3>
            <form onSubmit={handleSubmit} className="form">
                <label htmlFor="name" className="form-label">Subcategory Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter waste subcategory name"
                    required
                    className="form-input"
                />
                <label htmlFor="waste_category" className="form-label">Waste Category</label>
                <select
                    id="waste_category"
                    name="waste_category"
                    value={formData.waste_category}
                    onChange={handleChange}
                    required
                    className="form-select"
                >
                    <option value="">Select Waste Category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                <button type="submit" className="form-save-btn">
                    {isEdit ? 'Update Subcategory' : 'Submit'}
                </button>
                <button type="button" className="form-cancel-btn" onClick={onCancel}>
                    Cancel
                </button>
            </form>

            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}

            <h3 className="existing-title">Existing Waste Subcategories</h3>
            <ul className="subcategory-list">
                {subcategories.map(subcategory => (
                    <li key={subcategory.id} className="subcategory-item">
                        {subcategory.name} ({subcategory.waste_category})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WasteSubcategory;
