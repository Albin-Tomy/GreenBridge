import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SHGRequests = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch all waste collection requests on component mount
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/v1/collection/requests/', {
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`,
                    },
                });
                setRequests(response.data);
            } catch (err) {
                setError('Failed to fetch requests.');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleApprove = async (requestId) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/v1/collection/requests/${requestId}/approve/`, {
                request_status: 'Approved',
            }, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
            });
            setSuccess('Request approved successfully!');
            // Refresh the requests
            setRequests(requests.map(req => req.id === requestId ? { ...req, request_status: 'Approved' } : req));
        } catch (err) {
            setError('Failed to approve request.');
        }
    };

    const handleReject = async (requestId) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/v1/collection/requests/${requestId}/approve/`, {
                request_status: 'Rejected',
            }, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
            });
            setSuccess('Request rejected successfully!');
            // Refresh the requests
            setRequests(requests.map(req => req.id === requestId ? { ...req, request_status: 'Rejected' } : req));
        } catch (err) {
            setError('Failed to reject request.');
        }
    };

    const handleCollectionStatusUpdate = async (requestId, newStatus) => {
        try {
            // Call the correct endpoint to update collection status
            await axios.put(`http://127.0.0.1:8000/api/v1/collection/requests/${requestId}/update-status/`, {
                collection_status: newStatus,
            }, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
            });
            setSuccess(`Collection status updated to ${newStatus} successfully!`);
            // Refresh the requests
            setRequests(requests.map(req => req.id === requestId ? { ...req, collection_status: newStatus } : req));
        } catch (err) {
            setError('Failed to update collection status.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>Waste Collection Requests</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Waste Category</th>
                        <th>Waste Subcategory</th>
                        <th>Location</th>
                        <th>Request Status</th>
                        <th>Collection Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => (
                        <tr key={req.id}>
                            <td>{req.id}</td>
                            <td>{req.waste_category}</td>
                            <td>{req.waste_subcategory}</td>
                            <td>{req.location}</td>
                            <td>{req.request_status}</td>
                            <td>
                                {req.request_status === 'Approved' && (
                                    <select onChange={(e) => handleCollectionStatusUpdate(req.id, e.target.value)} defaultValue={req.collection_status}>
                                        <option value="Not Started">Not Started</option>
                                        <option value="On the Way">On the Way</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                )}
                                {req.request_status === 'Rejected' ? 'N/A' : req.collection_status}
                            </td>
                            <td>
                                <button onClick={() => handleApprove(req.id)} disabled={req.request_status !== 'Pending'}>Approve</button>
                                <button onClick={() => handleReject(req.id)} disabled={req.request_status !== 'Pending'}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SHGRequests;
