import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WasteCollectionRequest = () => {
    const [wasteSubcategories, setWasteSubcategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [formData, setFormData] = useState({
        waste_subcategory: '',
        location: '',
        collection_status: false, // Adjust as needed
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        // Fetch waste subcategories and locations from your backend
        const fetchSubcategoriesAndLocations = async () => {
            try {
                const [subcategoriesResponse, locationsResponse] = await Promise.all([
                    axios.get('/api/waste-subcategories/'), // Adjust URL as needed
                    axios.get('/api/locations/'), // Adjust URL as needed
                ]);
                setWasteSubcategories(subcategoriesResponse.data);
                setLocations(locationsResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchSubcategoriesAndLocations();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        
        try {
            const response = await axios.post('/api/request-waste-collection/', formData, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`, // Adjust if you're using a different auth method
                },
            });
            setSuccess('Request submitted successfully!');
            setFormData({
                waste_subcategory: '',
                location: '',
                collection_status: false,
            });
        } catch (err) {
            setError('Failed to submit request. Please try again.');
        }
    };

    return (
        <div>
            <h2>Request Waste Collection</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="waste_subcategory">Waste Subcategory</label>
                    <select name="waste_subcategory" onChange={handleChange} value={formData.waste_subcategory}>
                        <option value="">Select a subcategory</option>
                        {wasteSubcategories.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                                {subcategory.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="location">Location</label>
                    <select name="location" onChange={handleChange} value={formData.location}>
                        <option value="">Select a location</option>
                        {locations.map((location) => (
                            <option key={location.id} value={location.id}>
                                {location.location_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="collection_status">Collection Status</label>
                    <input
                        type="checkbox"
                        name="collection_status"
                        onChange={(e) => setFormData({ ...formData, collection_status: e.target.checked })}
                        checked={formData.collection_status}
                    />
                </div>

                <button type="submit">Submit Request</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default WasteCollectionRequest;
