import React, { useEffect, useState } from "react";
import "./ProductDashboard.css";
import DataTable from "../../../components/DataTable";
import BasicModal from "../../../components/BasicModal";
import axios from "axios";
import { format } from "date-fns";
import {
  categoryItemById,
  getCountryById,
  getMadeofById,
  getItemById,
  findInactiveItems,
} from "../Shg/helper";
import AddCategoryForm from "../../../components/Forms/AddCategoryForm";
import EditCategoryForm from "../../../components/Forms/EditCategory";

function CategoryDashboard() {
  const [categories, setCategories] = useState();
  const [categoryResponse, setCategoryResponse] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const inactiveItems = findInactiveItems(categoryResponse);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  console.log("categories", categories);

  useEffect(() => {
    getAllcategories();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      setFilteredProducts(
        categories.filter(
          (product) =>
            product.name.toLowerCase().includes(lowercasedTerm) ||
            product.description.toLowerCase().includes(lowercasedTerm)
        )
      );
    } else {
      setFilteredProducts(categories);
    }
  }, [searchTerm, categories]);

  const getAllcategories = () => {
    axios
      .get("http://127.0.0.1:8000/api/v1/products/category-list/")
      .then((response) => {
        setCategoryResponse(response.data);
        console.log("response.data", response.data);
        const transformedData = transformData(response.data);
        console.log("transformedData", transformedData);
        setCategories(transformedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const transformData = (categoryDataArray) => {
    return categoryDataArray.map((categoryData) => ({
      id: categoryData.id,
      name: categoryData.name,
      description: categoryData.description,
      created_at: format(new Date(categoryData.created_at), "yyyy-MM-dd HH:mm"),
      updated_at: format(new Date(categoryData.updated_at), "yyyy-MM-dd HH:mm"),
      isActive: categoryData.is_active,
    }));
  };

  const handleCloseForm = () => {
    setIsShowForm(false);
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
  };

  const handleEdit = (row) => {
    const brand = categoryItemById(row?.id, categories);
    setSelectedCategory(brand);
    setShowEditForm(true);
  };
  const handleDelete = (row) => {
    setSelectedCategory(row);
    setDeleteModalOpen(true);
  };
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const deleteBrand = () => {
    axios
      .delete(
        `http://127.0.0.1:8000/api/v1/products/category-delete/${selectedCategory?.id}/`
      )
      .then((response) => {
        alert("Category deleted");
        setDeleteModalOpen(false);
        setCategories((prevcategories) =>
          prevcategories.filter(
            (category) => category.id !== selectedCategory.id
          )
        );
        getAllcategories()
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDisableCategory = (row) => {
    console.log("row--", row);
    axios
      .post(
        `http://127.0.0.1:8000/api/v1/products/disable-enable-category/${row?.id}/`
      )
      .then((response) => {
        getAllcategories();
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });
  };

  console.log("selectedCategory", selectedCategory);

  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      {
        Header: "Category",
        accessor: "name",
        Cell: ({ row }) => (
          <div>
            <strong>{row.original.name}</strong>
            <div className="admin-table-subtext">
              {row.original.description}
            </div>
          </div>
        ),
      },
      { Header: "Created On", accessor: "created_at" },
      { Header: "Updated On", accessor: "updated_at" },
      {
        Header: "Status",
        accessor: "isActive",
        Cell: ({ value }) => (value ? "Active" : "Inactive"),
      },
    ],
    []
  );

  return (
    <div className="product-main-container">
      <div className="short-infos">
        <div className="info">
          <div className="info-title">Total categories</div>
          <div className="info-value success">{categories?.length}</div>
        </div>
        <div className="info">
          <div className="info-title">Inactive categories</div>
          <div className="info-value warning">{inactiveItems?.length}</div>
        </div>
      </div>

      <div className="add-product-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search Categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="add-product-button" onClick={() => setIsShowForm(true)}>
          Add Category
        </div>
      </div>

      <div className="product-table">
        <DataTable
          columns={columns}
          data={filteredProducts ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleDisableCategory}
        />
      </div>
      <BasicModal
        open={deleteModalOpen}
        isConfirmModal={true}
        setOpen={handleDeleteModalClose}
        onConfirm={deleteBrand}
        heading={`Delete Brand`}
        content={"Are you sure you want to delete this item?"}
      />

      <BasicModal
        open={isShowForm}
        setOpen={handleCloseForm}
        content={
          <AddCategoryForm
            onCancel={handleCloseForm}
            onConfirm={getAllcategories}
          />
        }
      />

      <BasicModal
        open={showEditForm}
        setOpen={handleEditFormClose}
        content={
          <EditCategoryForm
            onCancel={handleEditFormClose}
            onConfirm={getAllcategories}
            initialCategoryData={selectedCategory}
          />
        }
      />
    </div>
  );
}

export default CategoryDashboard;