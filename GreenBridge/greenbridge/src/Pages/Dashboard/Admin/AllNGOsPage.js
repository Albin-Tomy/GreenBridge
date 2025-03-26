import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllSHGsPage.css'; // We can reuse the same CSS
import Header from '../../../components/Navbar';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AllNGOsPage = () => {
  const [allNgos, setAllNgos] = useState([]);

  useEffect(() => {
    const fetchAllNgos = async () => {
      try {
        const response = await axios.get('https://greenbridgeserver.onrender.com/api/ngo/all/');
        setAllNgos(response.data);
      } catch (error) {
        console.error('Error fetching NGOs:', error);
      }
    };

    fetchAllNgos();
  }, []);

  return (
    <div className="all-shgs-page">
      <Header />
      <div className="all-shgs-container">
        <h1 className="all-shgs-title">All NGOs</h1>
        {allNgos.length === 0 ? (
          <p className="all-shgs-no-data">No NGOs found.</p>
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
              {allNgos.map((ngo) => (
                <tr className="all-shgs-table-row" key={ngo.id}>
                  <td className="all-shgs-table-cell">{ngo.name}</td>
                  <td className="all-shgs-table-cell">{ngo.email}</td>
                  <td className="all-shgs-table-cell">{ngo.registration_number}</td>
                  <td className="all-shgs-table-cell">{ngo.status}</td>
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

export default AllNGOsPage; 