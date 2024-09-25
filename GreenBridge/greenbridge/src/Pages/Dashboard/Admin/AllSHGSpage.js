import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllSHGsPage = () => {
  const [allShgs, setAllShgs] = useState([]);

  useEffect(() => {
    // Fetch all SHGs when the component mounts
    const fetchAllShgs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/shg/all/');
        setAllShgs(response.data);
      } catch (error) {
        console.error('Error fetching SHGs:', error);
      }
    };

    fetchAllShgs();
  }, []);

  return (
    <div>
      <h1>All SHGs</h1>
      {allShgs.length === 0 ? (
        <p>No SHGs found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Registration Number</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allShgs.map(shg => (
              <tr key={shg.id}>
                <td>{shg.name}</td>
                <td>{shg.email}</td>
                <td>{shg.registration_number}</td>
                <td>{shg.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllSHGsPage;
