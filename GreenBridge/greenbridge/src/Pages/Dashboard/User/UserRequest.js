// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './userview.css';
// import Header from '../../../components/Header';

// const UserRequestView = () => {
//     const [requests, setRequests] = useState([]);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);
//     const [loading, setLoading] = useState(true);

//     // Fetch user requests on component mount
//     useEffect(() => {
//         const fetchUserRequests = async () => {
//             try {
//                 const response = await axios.get('https://greenbridgeserver.onrender.com/api/v1/collection/requests/', {
//                     headers: {
//                         'Authorization': `Token ${localStorage.getItem('token')}`,
//                     },
//                 });
//                 setRequests(response.data);
//             } catch (err) {
//                 setError('Failed to fetch requests.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUserRequests();
//     }, []);

//     const handleStatusUpdate = async (requestId) => {
//         try {
//             await axios.put(`https://greenbridgeserver.onrender.com/api/v1/collection/requests/${requestId}/update-status/`, {
//                 collection_status: 'Completed',
//             }, {
//                 headers: {
//                     'Authorization': `Token ${localStorage.getItem('token')}`,
//                 },
//             });
//             setSuccess('Collection status updated to Completed!');
//             setRequests(requests.map(req => req.id === requestId ? { ...req, collection_status: 'Completed' } : req));
//         } catch (err) {
//             setError('Failed to update collection status.');
//         }
//     };

//     if (loading) {
//         return <p className="user-loading">Loading...</p>;
//     }

//     return (
//         <div>
//             <Header/>
        
//             <div className="user-container">
//                 <h2 className="user-heading">Your Waste Collection Requests</h2>
//                 {error && <p className="user-error">{error}</p>}
//                 {success && <p className="user-success">{success}</p>}
//                 <table className="user-table">
//                     <thead className="user-table-head">
//                         <tr>
                            
//                             <th>Waste Category</th>
//                             <th>Waste Subcategory</th>
//                             <th>Location</th>
//                             <th>Request Status</th>
//                             <th>Collection Status</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="user-table-body">
//                         {requests.map(req => (
//                             <tr key={req.id}>
                                
//                                 <td>{req.waste_category}</td>
//                                 <td>{req.waste_subcategory}</td>
//                                 <td>{req.location}</td>
//                                 <td>{req.request_status}</td>
//                                 <td>{req.collection_status}</td>
//                                 <td>
//                                     {req.collection_status !== 'Completed' && req.request_status === 'Approved' && (
//                                         <button
//                                             className="user-button user-complete"
//                                             onClick={() => handleStatusUpdate(req.id)}
//                                             disabled={req.collection_status === 'Completed'}
//                                         >
//                                             Mark as Completed
//                                         </button>
//                                     )}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default UserRequestView;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './userview.css';
import Header from '../../../components/Header';

const UserRequestView = () => {
    const [requests, setRequests] = useState([]);
    const [categories, setCategories] = useState({});
    const [subcategories, setSubcategories] = useState({});
    const [locations, setLocations] = useState({});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);

    // Helper function to map data by ID for easy lookup
    const mapDataById = (data) => {
        return data.reduce((acc, item) => {
            acc[item.id] = item.name;
            return acc;
        }, {});
    };

    // Fetch requests and related lookup data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user requests
                const requestsResponse = await axios.get('https://greenbridgeserver.onrender.com/api/v1/collection/requests/', {
                    headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
                });
                
                // Fetch categories, subcategories, and locations in parallel
                const [categoriesRes, subcategoriesRes, locationsRes] = await Promise.all([
                    axios.get('https://greenbridgeserver.onrender.com/api/v1/collection/waste-categories/'),
                    axios.get('https://greenbridgeserver.onrender.com/api/v1/collection/waste-subcategories/'),
                    axios.get('https://greenbridgeserver.onrender.com/api/v1/collection/locations/')
                ]);

                // Set requests and map lookups
                setRequests(requestsResponse.data);
                setCategories(mapDataById(categoriesRes.data));
                setSubcategories(mapDataById(subcategoriesRes.data));
                setLocations(mapDataById(locationsRes.data));
            } catch (err) {
                setError('Failed to fetch requests or related data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleStatusUpdate = async (requestId) => {
        try {
            await axios.put(`https://greenbridgeserver.onrender.com/api/v1/collection/requests/${requestId}/update-status/`, {
                collection_status: 'Completed',
            }, {
                headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
            });
            setSuccess('Collection status updated to Completed!');
            setRequests(requests.map(req => req.id === requestId ? { ...req, collection_status: 'Completed' } : req));
        } catch (err) {
            setError('Failed to update collection status.');
        }
    };

    if (loading) {
        return <p className="user-loading">Loading...</p>;
    }

    return (
        <div>
            <Header/>
            <div className="user-container">
                <h2 className="user-heading">Your Waste Collection Requests</h2>
                {error && <p className="user-error">{error}</p>}
                {success && <p className="user-success">{success}</p>}
                <table className="user-table">
                    <thead className="user-table-head">
                        <tr>
                            <th>Waste Category</th>
                            <th>Waste Subcategory</th>
                            <th>Location</th>
                            <th>Request Status</th>
                            <th>Collection Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="user-table-body">
                        {requests.map(req => (
                            <tr key={req.id}>
                                <td>{categories[req.waste_category] || 'Unknown'}</td>
                                <td>{subcategories[req.waste_subcategory] || 'Unknown'}</td>
                                <td>{locations[req.location] || 'Unknown'}</td>
                                <td>{req.request_status}</td>
                                <td>{req.collection_status}</td>
                                <td>
                                    {req.collection_status !== 'Completed' && req.request_status === 'Approved' && (
                                        <button
                                            className="user-button user-complete"
                                            onClick={() => handleStatusUpdate(req.id)}
                                            disabled={req.collection_status === 'Completed'}
                                        >
                                            Mark as Completed
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserRequestView;
