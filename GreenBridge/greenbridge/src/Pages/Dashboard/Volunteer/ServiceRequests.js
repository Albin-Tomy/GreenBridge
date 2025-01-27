import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './ServiceRequests.css';

const ServiceRequests = () => {
    const [requests, setRequests] = useState([]);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await axios.get(
                'http://127.0.0.1:8000/api/volunteer/requests/',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    const handleResponse = async (requestId, action) => {
        try {
            await axios.post(
                `http://127.0.0.1:8000/api/volunteer/requests/${requestId}/respond/`,
                { action },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            fetchRequests();
        } catch (error) {
            console.error('Error responding to request:', error);
        }
    };

    return (
        <div className="service-requests">
            <h2>Service Requests</h2>
            <div className="requests-list">
                {requests.map(request => (
                    <div key={request.id} className="request-card">
                        <div className="request-header">
                            <span className={`status ${request.status}`}>
                                {request.status}
                            </span>
                            <span className="date">
                                {new Date(request.date).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="request-body">
                            <p><strong>From:</strong> {request.requested_by_name}</p>
                            <p><strong>Type:</strong> {request.request_type}</p>
                            <p><strong>Service:</strong> {request.service_type}</p>
                            <p><strong>Location:</strong> {request.location}</p>
                            <p><strong>Description:</strong> {request.description}</p>
                        </div>
                        {request.status === 'pending' && (
                            <div className="request-actions">
                                <button 
                                    onClick={() => handleResponse(request.id, 'accept')}
                                    className="accept-btn"
                                >
                                    Accept
                                </button>
                                <button 
                                    onClick={() => handleResponse(request.id, 'reject')}
                                    className="reject-btn"
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceRequests; 