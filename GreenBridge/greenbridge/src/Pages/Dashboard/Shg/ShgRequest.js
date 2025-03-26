// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';

// // const SHGRequests = () => {
// //     const [requests, setRequests] = useState([]);
// //     const [error, setError] = useState(null);
// //     const [success, setSuccess] = useState(null);
// //     const [loading, setLoading] = useState(true);

// //     // Fetch all waste collection requests on component mount
// //     useEffect(() => {
// //         const fetchRequests = async () => {
// //             try {
// //                 const response = await axios.get('https://greenbridgeserver.onrender.com/api/v1/collection/requests/', {
// //                     headers: {
// //                         'Authorization': `Token ${localStorage.getItem('token')}`,
// //                     },
// //                 });
// //                 setRequests(response.data);
// //             } catch (err) {
// //                 setError('Failed to fetch requests.');
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         fetchRequests();
// //     }, []);

// //     const handleApprove = async (requestId) => {
// //         try {
// //             await axios.put(`https://greenbridgeserver.onrender.com/api/v1/collection/requests/${requestId}/approve/`, {
// //                 request_status: 'Approved',
// //             }, {
// //                 headers: {
// //                     'Authorization': `Token ${localStorage.getItem('token')}`,
// //                 },
// //             });
// //             setSuccess('Request approved successfully!');
// //             // Refresh the requests
// //             setRequests(requests.map(req => req.id === requestId ? { ...req, request_status: 'Approved' } : req));
// //         } catch (err) {
// //             setError('Failed to approve request.');
// //         }
// //     };

// //     const handleReject = async (requestId) => {
// //         try {
// //             await axios.put(`https://greenbridgeserver.onrender.com/api/v1/collection/requests/${requestId}/approve/`, {
// //                 request_status: 'Rejected',
// //             }, {
// //                 headers: {
// //                     'Authorization': `Token ${localStorage.getItem('token')}`,
// //                 },
// //             });
// //             setSuccess('Request rejected successfully!');
// //             // Refresh the requests
// //             setRequests(requests.map(req => req.id === requestId ? { ...req, request_status: 'Rejected' } : req));
// //         } catch (err) {
// //             setError('Failed to reject request.');
// //         }
// //     };

// //     const handleCollectionStatusUpdate = async (requestId, newStatus) => {
// //         try {
// //             // Call the correct endpoint to update collection status
// //             await axios.put(`https://greenbridgeserver.onrender.com/api/v1/collection/requests/${requestId}/update-status/`, {
// //                 collection_status: newStatus,
// //             }, {
// //                 headers: {
// //                     'Authorization': `Token ${localStorage.getItem('token')}`,
// //                 },
// //             });
// //             setSuccess(`Collection status updated to ${newStatus} successfully!`);
// //             // Refresh the requests
// //             setRequests(requests.map(req => req.id === requestId ? { ...req, collection_status: newStatus } : req));
// //         } catch (err) {
// //             setError('Failed to update collection status.');
// //         }
// //     };

// //     if (loading) {
// //         return <p>Loading...</p>;
// //     }

// //     return (
// //         <div>
// //             <h2>Waste Collection Requests</h2>
// //             {error && <p style={{ color: 'red' }}>{error}</p>}
// //             {success && <p style={{ color: 'green' }}>{success}</p>}
// //             <table>
// //                 <thead>
// //                     <tr>
// //                         <th>ID</th>
// //                         <th>Waste Category</th>
// //                         <th>Waste Subcategory</th>
// //                         <th>Location</th>
// //                         <th>Request Status</th>
// //                         <th>Collection Status</th>
// //                         <th>Actions</th>
// //                     </tr>
// //                 </thead>
// //                 <tbody>
// //                     {requests.map(req => (
// //                         <tr key={req.id}>
// //                             <td>{req.id}</td>
// //                             <td>{req.waste_category}</td>
// //                             <td>{req.waste_subcategory}</td>
// //                             <td>{req.location}</td>
// //                             <td>{req.request_status}</td>
// //                             <td>
// //                                 {req.request_status === 'Approved' && (
// //                                     <select onChange={(e) => handleCollectionStatusUpdate(req.id, e.target.value)} defaultValue={req.collection_status}>
// //                                         <option value="Not Started">Not Started</option>
// //                                         <option value="On the Way">On the Way</option>
// //                                         <option value="Completed">Completed</option>
// //                                     </select>
// //                                 )}
// //                                 {req.request_status === 'Rejected' ? 'N/A' : req.collection_status}
// //                             </td>
// //                             <td>
// //                                 <button onClick={() => handleApprove(req.id)} disabled={req.request_status !== 'Pending'}>Approve</button>
// //                                 <button onClick={() => handleReject(req.id)} disabled={req.request_status !== 'Pending'}>Reject</button>
// //                             </td>
// //                         </tr>
// //                     ))}
// //                 </tbody>
// //             </table>
// //         </div>
// //     );
// // };

// // export default SHGRequests;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './shgrequest.css';
import Header from '../../../components/Navbar';
import Sidebar from './ShgSidebar';
const SHGRequests = () => {
    const [requests, setRequests] = useState([]);
    const [categories, setCategories] = useState({});
    const [subcategories, setSubcategories] = useState({});
    const [locations, setLocations] = useState({});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch all necessary data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch collection requests
                const requestsResponse = await axios.get('https://greenbridgeserver.onrender.com/api/v1/collection/requests/', {
                    headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
                });
                setRequests(requestsResponse.data);

                // Fetch categories, subcategories, and locations
                const [categoriesRes, subcategoriesRes, locationsRes] = await Promise.all([
                    axios.get('https://greenbridgeserver.onrender.com/api/v1/collection/waste-categories/'),
                    axios.get('https://greenbridgeserver.onrender.com/api/v1/collection/waste-subcategories/'),
                    axios.get('https://greenbridgeserver.onrender.com/api/v1/collection/locations/')
                ]);

                // Map the fetched data for easy lookup by ID
                setCategories(mapDataById(categoriesRes.data));
                setSubcategories(mapDataById(subcategoriesRes.data));
                setLocations(mapDataById(locationsRes.data));
            } catch (err) {
                setError('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper function to create a lookup map from an array of objects
    const mapDataById = (data) => {
        return data.reduce((acc, item) => {
            acc[item.id] = item.name;
            return acc;
        }, {});
    };

    const handleApprove = async (requestId) => {
        try {
            await axios.put(`https://greenbridgeserver.onrender.com/api/v1/collection/requests/${requestId}/approve/`, {
                request_status: 'Approved'
            }, {
                headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
            });
            setSuccess('Request approved successfully!');
            setRequests(requests.map(req => req.id === requestId ? { ...req, request_status: 'Approved' } : req));
        } catch (err) {
            setError('Failed to approve request.');
        }
    };

    const handleReject = async (requestId) => {
        try {
            await axios.put(`https://greenbridgeserver.onrender.com/api/v1/collection/requests/${requestId}/approve/`, {
                request_status: 'Rejected'
            }, {
                headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
            });
            setSuccess('Request rejected successfully!');
            setRequests(requests.map(req => req.id === requestId ? { ...req, request_status: 'Rejected' } : req));
        } catch (err) {
            setError('Failed to reject request.');
        }
    };

    const handleCollectionStatusUpdate = async (requestId, newStatus) => {
        try {
            await axios.put(`https://greenbridgeserver.onrender.com/api/v1/collection/requests/${requestId}/update-status/`, {
                collection_status: newStatus
            }, {
                headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
            });
            setSuccess(`Collection status updated to ${newStatus} successfully!`);
            setRequests(requests.map(req => req.id === requestId ? { ...req, collection_status: newStatus } : req));
        } catch (err) {
            setError('Failed to update collection status.');
        }
    };

    if (loading) {
        return <p className="shg-loading">Loading...</p>;
    }

    return (
        <div>
            <Header/>
            <Sidebar/>
        <div className="shg-container">
            <h2 className="shg-heading">Waste Collection Requests</h2>
            {error && <p className="shg-error">{error}</p>}
            {success && <p className="shg-success">{success}</p>}
            <table className="shg-table">
                <thead className="shg-table-head">
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
                <tbody className="shg-table-body">
                    {requests.map(req => (
                        <tr key={req.id}>
                            <td>{req.id}</td>
                            <td>{categories[req.waste_category] || 'Unknown'}</td>
                            <td>{subcategories[req.waste_subcategory] || 'Unknown'}</td>
                            <td>{locations[req.location] || 'Unknown'}</td>
                            <td>{req.request_status}</td>
                            <td>
                                {req.request_status === 'Approved' ? (
                                    <select className="shg-select" onChange={(e) => handleCollectionStatusUpdate(req.id, e.target.value)} defaultValue={req.collection_status}>
                                        <option value="Not Started">Not Started</option>
                                        <option value="On the Way">On the Way</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                ) : (
                                    req.collection_status
                                )}
                            </td>
                            <td>
                                <button className="shg-button shg-approve" onClick={() => handleApprove(req.id)} disabled={req.request_status !== 'Pending'}>Approve</button>
                                <button className="shg-button shg-reject" onClick={() => handleReject(req.id)} disabled={req.request_status !== 'Pending'}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default SHGRequests;
