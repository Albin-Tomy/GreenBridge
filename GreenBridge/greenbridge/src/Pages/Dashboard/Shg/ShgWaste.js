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
import Sidebar from "./ShgSidebar";

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
      <Sidebar/>
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
