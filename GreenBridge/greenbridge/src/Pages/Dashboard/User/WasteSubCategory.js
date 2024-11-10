// WasteSubcategory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WasteSubcategory = () => {
    const [formData, setFormData] = useState({ name: '', waste_category: '' });
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchSubcategories();
        fetchCategories();
    }, []);

    const fetchSubcategories = async () => {
        try {
            const response = await axios.get('https://albintomy.pythonanywhere.com/api/v1/collection/waste-subcategories/');
            setSubcategories(response.data);
        } catch (err) {
            console.error('Error fetching subcategories:', err);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://albintomy.pythonanywhere.com/api/v1/collection/waste-categories/');
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
            await axios.post('https://albintomy.pythonanywhere.com/api/v1/collection/waste-subcategories/', formData, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
            });
            setSuccess('Subcategory created successfully!');
            setFormData({ name: '', waste_category: '' });
            fetchSubcategories();  // Refresh the subcategory list
        } catch (err) {
            setError('Failed to create subcategory. Please try again.');
        }
    };

    return (
        <div>
            <h2>Create Waste Subcategory</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter waste subcategory name"
                    required
                />
                <select name="waste_category" value={formData.waste_category} onChange={handleChange} required>
                    <option value="">Select Waste Category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
                <button type="submit">Submit</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <h3>Existing Waste Subcategories</h3>
            <ul>
                {subcategories.map(subcategory => (
                    <li key={subcategory.id}>{subcategory.name} ({subcategory.waste_category})</li>
                ))}
            </ul>
        </div>
    );
};

export default WasteSubcategory;
