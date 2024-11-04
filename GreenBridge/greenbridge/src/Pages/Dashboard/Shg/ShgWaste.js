// import React, { useEffect, useState } from "react";
// import '../Shg/Staff.css';
// import Navbar from "../../../components/Navbar";
// import Menubox from "../../../components/Menubox";
// import BasicTable from "../../../components/BasicTable";
// import { IconButton } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import config from "../../../config/config";
// import axios from "axios";
// import BasicModal from "../../../components/BasicModal";
// import { useNavigate } from "react-router-dom";

// function Admin() {
//   const navigate = useNavigate();
//   const [menu, setMenu] = useState("");
//   const [parentMenu, setParentMenu] = useState("");
//   const [rows, setRows] = useState([]);            // Default to empty array
//   const [columns, setColumns] = useState([]);       // Default to empty array
//   const [open, setOpen] = useState(false);
//   const [selectedId, setSelectedId] = useState();
//   const [addButtonLabel, setAddButtonLabel] = useState("");
//   const [form, setForm] = useState();
//   const [isShowForm, setIsShowForm] = useState(false);
//   const [isFormEdit, setIsFormEdit] = useState(false);

//   // Waste Category State with default empty arrays
//   const [categories, setCategories] = useState([]); 
//   const [locations, setLocations] = useState([]);   
//   const [subcategories, setSubcategories] = useState([]);

//   useEffect(() => {
//     if (menu === "Waste Categories") {
//       setParentMenu("Waste Categories");
//       setAddButtonLabel("Add Waste Category");
//       fetchCategories();
//     } else if (menu === "Locations") {
//       setParentMenu("Locations");
//       setAddButtonLabel("Add Location");
//       fetchLocations();
//     } else if (menu === "Waste Subcategories") {
//       setParentMenu("Waste Subcategories");
//       setAddButtonLabel("Add Waste Subcategory");
//       fetchSubcategories();
//     }
//   }, [menu]);

//   // Fetch functions with additional error handling
//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/api/v1/collection/waste-categories/`);
//       setCategories(response.data || []);  // Default to empty array if data is undefined
//     } catch (error) {
//       console.log("Error fetching categories:", error);
//     }
//   };

//   const fetchLocations = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/api/v1/collection/locations/`);
//       setLocations(response.data || []);  // Default to empty array if data is undefined
//     } catch (error) {
//       console.log("Error fetching locations:", error);
//     }
//   };

//   const fetchSubcategories = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/api/v1/collection/waste-subcategories/`);
//       setSubcategories(response.data || []);  // Default to empty array if data is undefined
//     } catch (error) {
//       console.log("Error fetching subcategories:", error);
//     }
//   };

//   // Handle Add Button
//   const handleAddButton = () => {
//     setIsShowForm(true);
//     setIsFormEdit(false);
//   };

//   // Handle Close Form
//   const handleCloseForm = () => {
//     setIsShowForm(false);
//   };

//   // Handle Delete Modal
//   const handleDeleteModalClose = () => {
//     setOpen(false);
//   };

//   const handleDelete = (id) => {
//     setSelectedId(id);
//     setOpen(true);
//   };

//   const confirmDelete = () => {
//     axios
//       .delete(`http://127.0.0.1:8000/api/v1/collection/${parentMenu.toLowerCase()}/delete/${selectedId}/`)
//       .then(() => {
//         setOpen(false);
//         setRows((prevRows) => prevRows.filter((row) => row.id !== selectedId));
//         alert(`${parentMenu} deleted successfully!`);
//       })
//       .catch((error) => {
//         console.log(`Error deleting ${parentMenu.toLowerCase()}:`, error);
//       });
//   };

//   // Columns for Categories, Locations, and Subcategories tables
//   const columnsMap = {
//     "Waste Categories": [
//       { field: "name", headerName: "Category Name", flex: 1 },
//       {
//         field: "actions",
//         headerName: "Actions",
//         renderCell: (params) => (
//           <div>
//             <IconButton onClick={() => handleDelete(params.row.id)}>
//               <DeleteIcon />
//             </IconButton>
//           </div>
//         ),
//         flex: 1,
//       },
//     ],
//     "Locations": [
//       { field: "name", headerName: "Location Name", flex: 1 },
//       {
//         field: "actions",
//         headerName: "Actions",
//         renderCell: (params) => (
//           <div>
//             <IconButton onClick={() => handleDelete(params.row.id)}>
//               <DeleteIcon />
//             </IconButton>
//           </div>
//         ),
//         flex: 1,
//       },
//     ],
//     "Waste Subcategories": [
//       { field: "name", headerName: "Subcategory Name", flex: 1 },
//       { field: "category_name", headerName: "Category", flex: 1 },
//       {
//         field: "actions",
//         headerName: "Actions",
//         renderCell: (params) => (
//           <div>
//             <IconButton onClick={() => handleDelete(params.row.id)}>
//               <DeleteIcon />
//             </IconButton>
//           </div>
//         ),
//         flex: 1,
//       },
//     ],
//   };

//   useEffect(() => {
//     setColumns(columnsMap[menu] || []);  // Fallback to empty array
//     if (menu === "Waste Categories") setRows(categories);
//     else if (menu === "Locations") setRows(locations);
//     else if (menu === "Waste Subcategories") setRows(subcategories);
//     else setRows([]);  // Default to empty array if menu is not set
//   }, [menu, categories, locations, subcategories]);

//   return (
//     <div>
//       <Navbar />
//       <div className="container">
//         <div className="menu-container">
//           <div className="menus">
//             <Menubox text={"Waste Categories"} action={setMenu} menu={menu} />
//             <Menubox text={"Locations"} action={setMenu} menu={menu} />
//             <Menubox text={"Waste Subcategories"} action={setMenu} menu={menu} />
//           </div>
//         </div>
//         <div className="table-wrapper">
//           <div className="add-button-container">
//             <button className="add-button" onClick={handleAddButton}>
//               + {addButtonLabel}
//             </button>
//           </div>
//           <div className="table-container">
//             <BasicTable rows={rows || []} columns={columns || []} /> {/* Safeguard with || [] */}
//           </div>
//         </div>
//         <BasicModal
//           open={open}
//           isConfirmModal={true}
//           setOpen={handleDeleteModalClose}
//           onConfirm={confirmDelete}
//           heading={`Delete ${parentMenu}`}
//           content={`Are you sure you want to delete this ${parentMenu.toLowerCase()}?`}
//         />
//         {isShowForm && (
//           <BasicModal
//             open={isShowForm}
//             setOpen={handleCloseForm}
//             content={<p>Add or Edit Form for {parentMenu} will go here</p>}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// export default Admin;
// import React, { useEffect, useState } from "react";
// import '../Shg/Staff.css';
// import Navbar from "../../../components/Navbar";
// import Menubox from "../../../components/Menubox";
// import BasicTable from "../../../components/BasicTable";
// import { IconButton } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import config from "../../../config/config";
// import axios from "axios";
// import { formatDate } from "../Shg/helper";
// import BasicModal from "../../../components/BasicModal";
// import { useNavigate } from "react-router-dom";

// // Import your category form component
// import CategoryForm from "./WasteCategory"; 
// import SubCategory from './WasteSubCategoryForm';
// import Location from './AddLocation';

// function Admin() {
//   const navigate = useNavigate();
//   const [menu, setMenu] = useState("");
//   const [parentMenu, setParentMenu] = useState("");
//   const [rows, setRows] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [selectedId, setSelectedId] = useState();
//   const [addButtonLabel, setAddButtonLabel] = useState("");
//   const [form, setForm] = useState();
//   const [isShowForm, setIsShowForm] = useState(false);
//   const [isFormEdit, setIsFormEdit] = useState(false);
  
//   // State for categories
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubCategories] = useState([]);
  
//   const [formContent, setFormContent] = useState(null); 

//   const handleCloseForm = () => {
//     setIsShowForm(false);
//     setFormContent(null); // Optionally reset form content
//   };

//   useEffect(() => {
//     if (menu === "Waste Categories") {
//       setParentMenu("Waste Categories");
//       setAddButtonLabel("Add Waste Category");
//       fetchCategories();
//     }
//   }, [menu]);

//   // Fetch Waste Categories
//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get(`http://127.0.0.1:8000/api/v1/collection/waste-categories/`);
//       setCategories(response.data || []);
//     } catch (error) {
//       console.log("Error fetching categories:", error);
//     }
//   };

//   // Define columns for Waste Categories
//   const categoryColumns = [
//     { field: "name", headerName: "Category Name", flex: 1 },
//     {
//       field: "actions",
//       headerName: "Actions",
//       renderCell: (params) => (
//         <div>
//           <IconButton onClick={() => handleEditCategory(params.row.id)}>
//             <EditIcon />
//           </IconButton>
//           <IconButton onClick={() => handleDeleteCategory(params.row.id)}>
//             <DeleteIcon />
//           </IconButton>
//         </div>
//       ),
//       flex: 1,
//     },
//   ];

//   useEffect(() => {
//     setColumns(categoryColumns);
//     setRows(categories);
//   }, [categories]);

// //   const handleAddButton = () => {
// //     setIsShowForm(true);
// //     setIsFormEdit(false);
// //     setForm(
// //       <CategoryForm
// //         onCancel={handleCloseForm}
// //         initialCategoryData={null}
// //         isEdit={false}
// //         onSave={handleSaveCategory} // Function to save new category
// //       />
// //     );
// //   };

// //   const handleEditCategory = (id) => {
// //     const categoryData = categories.find((cat) => cat.id === id);
// //     if (categoryData) {
// //       setIsFormEdit(true);
// //       setIsShowForm(true);
// //       setForm(
// //         <CategoryForm
// //           onCancel={handleCloseForm}
// //           initialCategoryData={categoryData}
// //           isEdit={true}
// //           onSave={handleSaveCategory} // Function to save edited category
// //         />
// //       );
// //     }
// //   };
// const handleAddButton = () => {
//     setIsShowForm(true);
//     setIsFormEdit(false);
//     setForm(
//         <CategoryForm
//             onCancel={handleCloseForm}
//             initialCategoryData={null}
//             isEdit={false}
//             onSave={fetchCategories} // Refresh the categories list on save
//         />
//     );
// };

// const handleEditCategory = (id) => {
//     const categoryData = categories.find((cat) => cat.id === id);
//     if (categoryData) {
//         setIsFormEdit(true);
//         setIsShowForm(true);
//         setForm(
//             <CategoryForm
//                 onCancel={handleCloseForm}
//                 initialCategoryData={categoryData}
//                 isEdit={true}
//                 onSave={fetchCategories} // Refresh the categories list on save
//             />
//         );
//     }
// };


//   const handleSaveCategory = async (categoryData) => {
//     try {
//       if (isFormEdit) {
//         // Update the existing category
//         await axios.put(`http://127.0.0.1:8000/api/v1/collection/waste-categories/update/${categoryData.id}/`, categoryData);
//         alert('Category updated successfully!');
//       } else {
//         // Add a new category
//         await axios.post(`http://127.0.0.1:8000/api/v1/collection/waste-categories/create/`, categoryData);
//         alert('Category added successfully!');
//       }
//       fetchCategories(); // Refresh categories after adding or updating
//       handleCloseForm(); // Close the form modal
//     } catch (error) {
//       console.log("Error saving category:", error);
//     }
//   };

//   const handleDeleteCategory = (id) => {
//     setSelectedId(id);
//     setOpen(true);
//   };

//   const confirmDeleteCategory = async () => {
//     try {
//       await axios.delete(`http://127.0.0.1:8000/api/v1/collection/waste-categories/${selectedId}/`);
//       setRows((prevRows) => prevRows.filter((row) => row.id !== selectedId));
//       alert("Category deleted successfully!");
//       setOpen(false);
//     } catch (error) {
//       console.log("Error deleting category:", error);
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="container">
//         <div className="menu-container">
//           <div className="menus">
//             <Menubox text={"Waste Categories"} action={setMenu} menu={menu} />
//           </div>
//         </div>
//         <div className="table-wrapper">
//           <div className="add-button-container">
//             <button className="add-button" onClick={handleAddButton}>
//               + {addButtonLabel}
//             </button>
//           </div>
//           <div className="table-container">
//             <BasicTable rows={rows} columns={columns} />
//           </div>
//         </div>
//         <BasicModal
//           open={open}
//           isConfirmModal={true}
//           setOpen={() => setOpen(false)}
//           onConfirm={confirmDeleteCategory}
//           heading={`Delete Category`}
//           content={"Are you sure you want to delete this category?"}
//         />
//         {isShowForm && (
//           <BasicModal
//             open={isShowForm}
//             setOpen={handleCloseForm}
//             content={form}
//             customStyle={{ height: '87vh', overflowY: 'scroll', marginTop: '0px' }}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// export default Admin;
import React, { useEffect, useState } from "react";
import '../Shg/Staff.css';
import Navbar from "../../../components/Navbar";
import Menubox from "../../../components/Menubox";
import BasicTable from "../../../components/BasicTable";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import config from "../../../config/config";
import axios from "axios";
import BasicModal from "../../../components/BasicModal";
import { useNavigate } from "react-router-dom";

// Import your form components
import CategoryForm from "./WasteCategory";
import SubCategoryForm from './WasteSubCategoryForm';
import LocationForm from './AddLocation';

function Admin() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState("");
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [formContent, setFormContent] = useState(null);
  const [isShowForm, setIsShowForm] = useState(false);
  const [isFormEdit, setIsFormEdit] = useState(false);

  // Data state for each section
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const handleCloseForm = () => {
    setIsShowForm(false);
    setFormContent(null);
  };

  // Fetch data for each section
  useEffect(() => {
    if (menu === "Waste Categories") fetchCategories();
    else if (menu === "Waste Subcategories") fetchSubCategories();
    else if (menu === "Locations") fetchLocations();
  }, [menu]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/collection/waste-categories/`);
      setCategories(response.data || []);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/collection/waste-subcategories/`);
      setSubCategories(response.data || []);
    } catch (error) {
      console.log("Error fetching subcategories:", error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/collection/locations/`);
      setLocations(response.data || []);
    } catch (error) {
      console.log("Error fetching locations:", error);
    }
  };

  // Define columns for each section
  const categoryColumns = [
    { field: "name", headerName: "Category Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEditCategory(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
      flex: 1,
    },
  ];

  const subcategoryColumns = [
    { field: "name", headerName: "Subcategory Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEditSubCategory(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
      flex: 1,
    },
  ];

  const locationColumns = [
    { field: "name", headerName: "Location Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEditLocation(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
      flex: 1,
    },
  ];

  // Set rows and columns based on menu selection
  useEffect(() => {
    if (menu === "Waste Categories") {
      setColumns(categoryColumns);
      setRows(categories);
    } else if (menu === "Waste Subcategories") {
      setColumns(subcategoryColumns);
      setRows(subcategories);
    } else if (menu === "Locations") {
      setColumns(locationColumns);
      setRows(locations);
    }
  }, [menu, categories, subcategories, locations]);

  // Handle adding new item
  const handleAddButton = () => {
    setIsShowForm(true);
    setIsFormEdit(false);
    if (menu === "Waste Categories") {
      setFormContent(
        <CategoryForm onCancel={handleCloseForm} isEdit={false} onSave={fetchCategories} />
      );
    } else if (menu === "Waste Subcategories") {
      setFormContent(
        <SubCategoryForm onCancel={handleCloseForm} isEdit={false} onSave={fetchSubCategories} />
      );
    } else if (menu === "Locations") {
      setFormContent(
        <LocationForm onCancel={handleCloseForm} isEdit={false} onSave={fetchLocations} />
      );
    }
  };

  // Handle edit
  const handleEditCategory = (id) => {
    const categoryData = categories.find((cat) => cat.id === id);
    setIsShowForm(true);
    setIsFormEdit(true);
    setFormContent(
      <CategoryForm
        onCancel={handleCloseForm}
        initialCategoryData={categoryData}
        isEdit={true}
        onSave={fetchCategories}
      />
    );
  };

// Handle edit for subcategory
const handleEditSubCategory = (id) => {
  const subCategoryData = subcategories.find((sub) => sub.id === id);
  setIsShowForm(true);
  setIsFormEdit(true);
  setFormContent(
    <SubCategoryForm
      onCancel={handleCloseForm}
      initialSubcategoryData={subCategoryData} // Updated to pass initialSubcategoryData
      isEdit={true}
      onSave={fetchSubCategories}
    />
  );
};


  const handleEditLocation = (id) => {
    const locationData = locations.find((loc) => loc.id === id);
    setIsShowForm(true);
    setIsFormEdit(true);
    setFormContent(
      <LocationForm
        onCancel={handleCloseForm}
        initialLocationData={locationData}
        isEdit={true}
        onSave={fetchLocations}
      />
    );
  };

  // Delete handler
  const handleDelete = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/collection/${menu.toLowerCase().replace(" ", "-")}/${selectedId}/`);
      alert("Item deleted successfully!");
      setOpen(false);
      if (menu === "Waste Categories") fetchCategories();
      else if (menu === "Waste Subcategories") fetchSubCategories();
      else if (menu === "Locations") fetchLocations();
    } catch (error) {
      console.log("Error deleting item:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="menu-container">
          <div className="menus">
            <Menubox text={"Waste Categories"} action={setMenu} menu={menu} />
            <Menubox text={"Waste Subcategories"} action={setMenu} menu={menu} />
            <Menubox text={"Locations"} action={setMenu} menu={menu} />
          </div>
        </div>
        <div className="table-wrapper">
          <div className="add-button-container">
            <button className="add-button" onClick={handleAddButton}>
              + Add {menu.slice(0, -1)}
            </button>
          </div>
          <div className="table-container">
            <BasicTable rows={rows} columns={columns} />
          </div>
        </div>
        <BasicModal
          open={open}
          isConfirmModal={true}
          setOpen={() => setOpen(false)}
          onConfirm={confirmDelete}
          heading={`Delete ${menu.slice(0, -1)}`}
          content={`Are you sure you want to delete this ${menu.slice(0, -1)}?`}
        />
        {isShowForm && (
          <BasicModal
            open={isShowForm}
            setOpen={handleCloseForm}
            content={formContent}
            customClass="wide-modal"
          />
        )}
      </div>
    </div>
  );
}

export default Admin;
