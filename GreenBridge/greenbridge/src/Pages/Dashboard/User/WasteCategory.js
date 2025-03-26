// WasteCategory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WasteCategory = () => {
    const [formData, setFormData] = useState({ name: '' });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

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
            await axios.post('https://greenbridgeserver.onrender.com/api/v1/collection/waste-categories/', formData, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
            });
            setSuccess('Category created successfully!');
            setFormData({ name: '' });
            fetchCategories();  // Refresh the category list
        } catch (err) {
            setError('Failed to create category. Please try again.');
        }
    };

    return (
        <div>
            <h2>Create Waste Category</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter waste category name"
                    required
                />
                <button type="submit">Submit</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <h3>Existing Waste Categories</h3>
            <ul>
                {categories.map(category => (
                    <li key={category.id}>{category.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default WasteCategory;
