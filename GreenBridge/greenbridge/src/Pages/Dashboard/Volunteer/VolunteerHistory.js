import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VolunteerHistory.css';

const VolunteerHistory = () => {
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await axios.get(
                'http://127.0.0.1:8000/api/volunteer/history/',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setHistory(response.data.history);
        } catch (error) {
            setError('Error fetching history');
        }
    };

    return (
        <div className="history-container">
            <h3>Activity History</h3>
            {error && <div className="error-message">{error}</div>}
            <div className="history-list">
                {history.map((record, index) => (
                    <div key={index} className="history-item">
                        <div className="history-header">
                            <span className="history-action">{record.action}</span>
                            <span className="history-date">
                                {new Date(record.timestamp * 1000).toLocaleString()}
                            </span>
                        </div>
                        <div className="history-details">
                            <pre>{JSON.stringify(record.details, null, 2)}</pre>
                        </div>
                        <div className="history-hash">
                            <small>Block Hash: {record.hash}</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VolunteerHistory; 