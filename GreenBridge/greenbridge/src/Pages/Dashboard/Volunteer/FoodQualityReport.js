import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import './FoodQualityReport.css';

const FoodQualityReport = ({ distributionId }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        issue_type: 'expired',
        description: '',
        temperature: '',
        images: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const issueTypes = [
        { value: 'expired', label: 'Food Expired' },
        { value: 'contaminated', label: 'Food Contaminated' },
        { value: 'spoiled', label: 'Food Spoiled' },
        { value: 'packaging_damaged', label: 'Packaging Damaged' },
        { value: 'temperature_issue', label: 'Temperature Control Issue' },
        { value: 'other', label: 'Other Issue' }
    ];

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'images') {
            setFormData({ ...formData, images: Array.from(files) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const submitData = new FormData();
        submitData.append('distribution_id', distributionId);
        submitData.append('issue_type', formData.issue_type);
        submitData.append('description', formData.description);
        if (formData.temperature) {
            submitData.append('temperature', formData.temperature);
        }
        formData.images.forEach(image => {
            submitData.append('images', image);
        });

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/v1/volunteer/quality-report/',
                submitData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setMessage('Quality report submitted successfully');
            setTimeout(() => {
                navigate('/volunteer/distributions');
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to submit report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <div className="quality-report-container">
                <h2>Report Food Quality Issue</h2>
                
                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="quality-report-form">
                    <div className="form-group">
                        <label>Type of Issue:</label>
                        <select
                            name="issue_type"
                            value={formData.issue_type}
                            onChange={handleChange}
                            required
                        >
                            {issueTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Please describe the quality issue in detail..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Temperature (if applicable):</label>
                        <input
                            type="number"
                            name="temperature"
                            value={formData.temperature}
                            onChange={handleChange}
                            placeholder="Enter temperature in Celsius"
                        />
                    </div>

                    <div className="form-group">
                        <label>Upload Images:</label>
                        <input
                            type="file"
                            name="images"
                            onChange={handleChange}
                            multiple
                            accept="image/*"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Report'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/volunteer/distributions')}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FoodQualityReport; 