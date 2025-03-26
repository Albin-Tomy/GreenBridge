import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllSHGsPage.css';
import Header from '../../../components/Navbar';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons

const AllSHGsPage = () => {
  const [allShgs, setAllShgs] = useState([]);

  useEffect(() => {
    // Fetch all SHGs when the component mounts
    const fetchAllShgs = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/shg/all/');
        setAllShgs(response.data);
      } catch (error) {
        console.error('Error fetching SHGs:', error);
      }
    };

    fetchAllShgs();
  }, []);

  return (
    <div className="all-shgs-page">
      <div className="all-shgs-container">

        <h1 className="all-shgs-title">All SHGs</h1>
        {allShgs.length === 0 ? (
          <p className="all-shgs-no-data">No SHGs found.</p>
        ) : (
          <table className="all-shgs-table">
            <thead>
              <tr className="all-shgs-table-header">
                <th className="all-shgs-table-header-cell">Name</th>
                <th className="all-shgs-table-header-cell">Email</th>
                <th className="all-shgs-table-header-cell">Registration Number</th>
                <th className="all-shgs-table-header-cell">Status</th>
                <th className="all-shgs-table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allShgs.map((shg) => (
                <tr className="all-shgs-table-row" key={shg.id}>
                  <td className="all-shgs-table-cell">{shg.name}</td>
                  <td className="all-shgs-table-cell">{shg.email}</td>
                  <td className="all-shgs-table-cell">{shg.registration_number}</td>
                  <td className="all-shgs-table-cell">{shg.status}</td>
                  <td className="all-shgs-table-cell actions-cell">
                    <FaEdit className="action-icon" title="Edit" />
                    <FaTrash className="action-icon" title="Delete" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllSHGsPage;
