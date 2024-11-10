import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './wasteform.css';

const Location = ({ onCancel, isEdit, initialLocationData, onSave }) => {
    const [formData, setFormData] = useState(initialLocationData || { name: '' });
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (isEdit && initialLocationData) {
            setFormData(initialLocationData);
        }
        fetchLocations();
    }, [isEdit, initialLocationData]);

    const fetchLocations = async () => {
        try {
            const response = await axios.get('https://albintomy.pythonanywhere.com/api/v1/collection/locations/');
            setLocations(response.data);
        } catch (err) {
            console.error('Error fetching locations:', err);
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
                await axios.put(`https://albintomy.pythonanywhere.com/api/v1/collection/locations/${formData.id}/`, formData, {
                    headers: { 'Authorization': `Token ${localStorage.getItem('token')}` },
                });
                alert('Location updated successfully!');
            } else {
                await axios.post('https://albintomy.pythonanywhere.com/api/v1/collection/locations/', formData, {
                    headers: { 'Authorization': `Token ${localStorage.getItem('token')}` },
                });
                alert('Location created successfully!');
            }
            setFormData({ name: '' });
            onSave();
            onCancel();
            fetchLocations();
        } catch (err) {
            setError(isEdit ? 'Failed to update location.' : 'Failed to create location. Please try again.');
        }
    };

    return (
        <div className="waste-category-form">
            <h3 className="form-title">{isEdit ? 'Edit Location' : 'Create Location'}</h3>
            <form onSubmit={handleSubmit} className="form">
                <label htmlFor="name" className="form-label">Location Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter location name"
                    required
                    className="form-input"
                />
                <button type="submit" className="form-save-btn">
                    {isEdit ? 'Update Location' : 'Submit'}
                </button>
                <button type="button" className="form-cancel-btn" onClick={onCancel}>
                    Cancel
                </button>
            </form>

            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}

            <h3 className="existing-title">Existing Locations</h3>
            <ul className="location-list">
                {locations.map(location => (
                    <li key={location.id} className="location-item">{location.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Location;
