import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllSHGsPage.css';

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
    <div className="shg-container">
      <h1 className="shg-title">All SHGs</h1>
      {allShgs.length === 0 ? (
        <p className="shg-no-data">No SHGs found.</p>
      ) : (
        <table className="shg-table">
          <thead>
            <tr className="shg-table-header">
              <th className="shg-table-header-cell">Name</th>
              <th className="shg-table-header-cell">Email</th>
              <th className="shg-table-header-cell">Registration Number</th>
              <th className="shg-table-header-cell">Status</th>
            </tr>
          </thead>
          <tbody>
            {allShgs.map(shg => (
              <tr className="shg-table-row" key={shg.id}>
                <td className="shg-table-cell">{shg.name}</td>
                <td className="shg-table-cell">{shg.email}</td>
                <td className="shg-table-cell">{shg.registration_number}</td>
                <td className="shg-table-cell">{shg.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllSHGsPage;
