import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './wasteCollection.css';
import Header from '../../../components/Header';

const WasteCollectionRequest = () => {
    const [formData, setFormData] = useState({
        waste_category: '',
        waste_subcategory: '',
        location: '',
        collection_status: 'Not Started',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [wasteCategories, setWasteCategories] = useState([]);
    const [wasteSubcategories, setWasteSubcategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const userId = localStorage.getItem('userId'); // Store the logged-in user's ID

    // Fetch waste categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/v1/collection/waste-categories/', {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`,
                    },
                });
                setWasteCategories(response.data);
            } catch (err) {
                console.error('Failed to fetch waste categories:', err);
            }
        };

        const fetchLocations = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/v1/collection/locations/', {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`,
                    },
                });
                setLocations(response.data);
            } catch (err) {
                console.error('Failed to fetch locations:', err);
            }
        };

        fetchCategories();
        fetchLocations();
    }, []);

    // Fetch subcategories when a category is selected
    useEffect(() => {
        const fetchSubcategories = async () => {
            if (formData.waste_category) {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/v1/collection/waste-subcategories/?category=${formData.waste_category}`, {
                        headers: {
                            'Authorization': `Token ${localStorage.getItem('token')}`,
                        },
                    });
                    setWasteSubcategories(response.data);
                } catch (err) {
                    console.error('Failed to fetch waste subcategories:', err);
                }
            } else {
                setWasteSubcategories([]);
            }
        };

        fetchSubcategories();
    }, [formData.waste_category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission for a new waste collection request
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            await axios.post('http://127.0.0.1:8000/api/v1/collection/requests/', {
                ...formData,
                user: userId, // Include the logged-in user's ID in the request
            }, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
            });
            setSuccess('Request submitted successfully!');
            setFormData({
                waste_category: '',
                waste_subcategory: '',
                location: '',
                collection_status: 'Not Started',
            });
        } catch (err) {
            setError('Failed to submit request. Please try again.');
        }
    };

    return (
        // <div>
        //     <h2>Request Waste Collection</h2>
        //     <form onSubmit={handleSubmit}>
        //         <div>
        //             <label htmlFor="waste_category">Waste Category</label>
        //             <select
        //                 name="waste_category"
        //                 value={formData.waste_category}
        //                 onChange={handleChange}
        //             >
        //                 <option value="">Select a category</option>
        //                 {wasteCategories.map(category => (
        //                     <option key={category.id} value={category.id}>
        //                         {category.name}
        //                     </option>
        //                 ))}
        //             </select>
        //         </div>

        //         <div>
        //             <label htmlFor="waste_subcategory">Waste Subcategory</label>
        //             <select
        //                 name="waste_subcategory"
        //                 value={formData.waste_subcategory}
        //                 onChange={handleChange}
        //                 disabled={!formData.waste_category} // Disable if no category is selected
        //             >
        //                 <option value="">Select a subcategory</option>
        //                 {wasteSubcategories.map(subcategory => (
        //                     <option key={subcategory.id} value={subcategory.id}>
        //                         {subcategory.name}
        //                     </option>
        //                 ))}
        //             </select>
        //         </div>

        //         <div>
        //             <label htmlFor="location">Location</label>
        //             <select
        //                 name="location"
        //                 value={formData.location}
        //                 onChange={handleChange}
        //             >
        //                 <option value="">Select a location</option>
        //                 {locations.map(location => (
        //                     <option key={location.id} value={location.id}>
        //                         {location.name}
        //                     </option>
        //                 ))}
        //             </select>
        //         </div>

        //         <button type="submit">Submit Request</button>
        //     </form>

        //     {error && <p style={{ color: 'red' }}>{error}</p>}
        //     {success && <p style={{ color: 'green' }}>{success}</p>}
        // </div>
        <div>
            <Header/>
        <div className="waste-collection-container">
            <h2>Request Waste Collection</h2>
            <form className="waste-collection-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="waste_category">Waste Category</label>
                    <select
                        name="waste_category"
                        value={formData.waste_category}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">Select a category</option>
                        {wasteCategories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="waste_subcategory">Waste Subcategory</label>
                    <select
                        name="waste_subcategory"
                        value={formData.waste_subcategory}
                        onChange={handleChange}
                        className="form-control"
                        disabled={!formData.waste_category}
                    >
                        <option value="">Select a subcategory</option>
                        {wasteSubcategories.map(subcategory => (
                            <option key={subcategory.id} value={subcategory.id}>
                                {subcategory.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">Select a location</option>
                        {locations.map(location => (
                            <option key={location.id} value={location.id}>
                                {location.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="submit-btn">Submit Request</button>
            </form>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </div>
        </div>
    );
};

export default WasteCollectionRequest;

