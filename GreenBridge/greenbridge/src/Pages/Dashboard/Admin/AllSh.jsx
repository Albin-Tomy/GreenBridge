// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { IconButton } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import Header from '../../../components/Navbar';
// import BasicModal from '../../../components/BasicModal';
// import { DataGrid } from '@mui/x-data-grid';
// // import './AllSHGsPage.css';

// const AllSHGsPage = () => {
//   const [allShgs, setAllShgs] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [selectedId, setSelectedId] = useState();

//   useEffect(() => {
//     // Fetch all SHGs when the component mounts
//     const fetchAllShgs = async () => {
//       try {
//         const response = await axios.get('http://localhost:8000/api/shg/all/');
//         setAllShgs(response.data);
//       } catch (error) {
//         console.error('Error fetching SHGs:', error);
//       }
//     };

//     fetchAllShgs();
//   }, []);

//   const handleDeleteModalClose = () => {
//     setOpen(false);
//   };

//   const handleDeleteShg = (id) => {
//     setSelectedId(id);
//     setOpen(true);
//   };

//   const confirmDeleteShg = () => {
//     axios
//       .delete(`http://localhost:8000/api/shg/delete/${selectedId}/`)
//       .then(() => {
//         setOpen(false);
//         setAllShgs((prevShgs) => prevShgs.filter((shg) => shg.id !== selectedId));
//         alert('SHG deleted successfully!');
//       })
//       .catch((error) => {
//         console.error('Error deleting SHG:', error);
//       });
//   };

//   const columns = [
//     { field: 'name', headerName: 'Name', flex: 1 },
//     { field: 'email', headerName: 'Email', flex: 1 },
//     { field: 'registration_number', headerName: 'Registration Number', flex: 1 },
//     { field: 'status', headerName: 'Status', flex: 1 },
//     {
//       field: 'actions',
//       headerName: 'Actions',
//       flex: 1,
//       renderCell: (params) => (
//         <div>
//           <IconButton onClick={() => handleEditShg(params.row.id)}>
//             <EditIcon />
//           </IconButton>
//           <IconButton onClick={() => handleDeleteShg(params.row.id)}>
//             <DeleteIcon />
//           </IconButton>
//         </div>
//       ),
//     },
//   ];

//   const handleEditShg = (id) => {
//     // Implement the edit functionality here
//     console.log('Edit SHG with ID:', id);
//   };

//   return (
//     <div className="all-shgs-page">
//       <Header />
//       <div className="all-shgs-container">
//         <h1 className="all-shgs-title">All SHGs</h1>
//         <div className="all-shgs-table-wrapper">
//           <DataGrid
//             rows={allShgs}
//             columns={columns}
//             pageSize={5}
//             getRowId={(row) => row.id}
//             autoHeight
//             disableSelectionOnClick
//           />
//         </div>
//         <BasicModal
//           open={open}
//           isConfirmModal={true}
//           setOpen={handleDeleteModalClose}
//           onConfirm={confirmDeleteShg}
//           heading={`Delete SHG`}
//           content={'Are you sure you want to delete this SHG?'}
//         />
//       </div>
//     </div>
//   );
// };

// export default AllSHGsPage;
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import './AllSHGsPage.css'; // Assuming this is your CSS file
import Navbar from '../../../components/Navbar';
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AllSHGsPage = () => {
  const [allShgs, setAllShgs] = useState([]);

  useEffect(() => {
    // Fetch all SHGs when the component mounts
    const fetchAllShgs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/shg/all/');
        // Add a unique id to each SHG if not already present
        const shgsWithId = response.data.map((shg, index) => ({
          ...shg,
          id: shg.registration_number || index, // Use registration_number or fallback to index
        }));
        setAllShgs(shgsWithId);
      } catch (error) {
        console.error('Error fetching SHGs:', error);
      }
    };

    fetchAllShgs();
  }, []);

  // Define the columns for the DataGrid
  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'registration_number', headerName: 'Registration Number', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleEdit = (id) => {
    // Handle edit functionality here
    console.log(`Edit SHG with ID: ${id}`);
  };

  const handleDelete = (id) => {
    // Handle delete functionality here
    console.log(`Delete SHG with ID: ${id}`);
  };

  return (
    <div className="all-shgs-page">
      <Navbar />
      <div className="all-shgs-container">
        <h1 className="all-shgs-title">All SHGs</h1>
        {allShgs.length === 0 ? (
          <p className="all-shgs-no-data">No SHGs found.</p>
        ) : (
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={allShgs}
              columns={columns}
              pageSize={5}
              getRowId={(row) => row.id} // Custom row ID for uniqueness
              autoHeight
              disableSelectionOnClick
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSHGsPage;
