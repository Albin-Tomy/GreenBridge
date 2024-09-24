import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const [pendingSHGs, setPendingSHGs] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchPendingSHGs();
    }, []);

    const fetchPendingSHGs = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/admin/approve-shgs/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                setPendingSHGs(data);
            } else {
                setMessage('Failed to load pending SHGs.');
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    const handleApproval = async (shgId, action) => {
        try {
            const response = await fetch(`http://localhost:8000/api/admin/approve-shg/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shg_id: shgId, action }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(`SHG ${action} successfully!`);
                fetchPendingSHGs(); // Refresh list
            } else {
                setMessage('Error: ' + data.detail);
            }
        } catch (error) {
            setMessage('An error occurred: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            {message && <p>{message}</p>}
            <h3>Pending SHG Registrations</h3>
            {pendingSHGs.length === 0 ? (
                <p>No pending registrations</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>SHG Name</th>
                            <th>Registration Number</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingSHGs.map((shg) => (
                            <tr key={shg.id}>
                                <td>{shg.shg_name}</td>
                                <td>{shg.registration_number}</td>
                                <td>
                                    <button onClick={() => handleApproval(shg.id, 'approve')}>Approve</button>
                                    <button onClick={() => handleApproval(shg.id, 'reject')}>Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminDashboard;
