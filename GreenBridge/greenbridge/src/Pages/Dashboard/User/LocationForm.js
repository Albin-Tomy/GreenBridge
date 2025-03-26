// Location.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Location = () => {
    const [formData, setFormData] = useState({ name: '' });
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await axios.get('https://greenbridgeserver.onrender.com/api/v1/collection/locations/');
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
            await axios.post('https://greenbridgeserver.onrender.com/api/v1/collection/locations/', formData, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
            });
            setSuccess('Location created successfully!');
            setFormData({ name: '' });
            fetchLocations();  // Refresh the location list
        } catch (err) {
            setError('Failed to create location. Please try again.');
        }
    };

    return (
        <div>
            <h2>Create Location</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter location name"
                    required
                />
                <button type="submit">Submit</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <h3>Existing Locations</h3>
            <ul>
                {locations.map(location => (
                    <li key={location.id}>{location.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Location;
