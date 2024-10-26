
import React, { useEffect, useState } from "react";
import "./ProductDashboard.css";
import DataTable from "../../../components/DataTable";
import BasicModal from "../../../components/BasicModal";
import axios from "axios";
import {
  getBrandById,
  categoryItemById,
  getCountryById,
  getMadeofById,
  getItemById,
  findOutOfStockItems,
  findInactiveItems,
} from "../Shg/helper";
import AddProductForm from "../../../components/Forms/AddProduct";
import EditProductForm from "../../../components/Forms/EditProduct";

function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productResponse, setProductResponse] = useState([]);
  const brands = JSON.parse(localStorage.getItem("brands"));
  const categories = JSON.parse(localStorage.getItem("categories"));
  const countries = JSON.parse(localStorage.getItem("countries"));
  const madeOf = JSON.parse(localStorage.getItem("madeOf"));
  const [selectedProduct, setSelectedProduct] = useState();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const outOfStockItems = findOutOfStockItems(productResponse);
  const inactiveItems = findInactiveItems(productResponse);
  const [searchTerm, setSearchTerm] = useState('');
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      setFilteredProducts(products.filter(product =>
        product.name.toLowerCase().includes(lowercasedTerm) ||
        product.description.toLowerCase().includes(lowercasedTerm) ||
        product.brand.toLowerCase().includes(lowercasedTerm) ||
        product.country.toLowerCase().includes(lowercasedTerm) ||
        product.category.toLowerCase().includes(lowercasedTerm) ||
        product.madeof.toLowerCase().includes(lowercasedTerm)
      ));
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const getAllProducts = () => {
    axios
      .get("http://127.0.0.1:8000/api/v1/products/list/")
      .then((response) => {
        setProductResponse(response.data);
        const transformedData = transformProductData(response.data);
        setProducts(transformedData);
        setFilteredProducts(transformedData); // Set initial filtered products
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const transformProductData = (data) => {
    return data.map((product) => ({
      id: product.product_id,
      name: product.name,
      description: product.description,
      price: product.price,
      brand: getBrandById(product.brand, brands)?.name,
      quantity: product.quantity,
      country: getCountryById(product.country, countries)?.name,
      category: categoryItemById(product.category, categories)?.name,
      madeof: getMadeofById(product.made_of, madeOf)?.name,
      stock: product.stock_quantity,
      isActive: product.is_active,
    }));
  };

  const handleCloseForm = () => {
    setIsShowForm(false);
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
  };

  const handleEdit = (row) => {
    const selectedProduct = getItemById(row?.id, productResponse);
    setSelectedProduct(selectedProduct);
    setShowEditForm(true);
  };

  const handleDelete = (row) => {
    setSelectedProduct(row);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const deleteProduct = () => {
    axios
      .delete(
        `http://127.0.0.1:8000/api/v1/products/delete/${selectedProduct?.id}/`
      )
      .then((response) => {
        alert("Product deleted");
        setDeleteModalOpen(false);
        setFilteredProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== selectedProduct.id)
        );
        getAllProducts()
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDisableProduct = (row) => {
    axios
      .post(
        `http://localhost:8000/api/v1/products/disable-or-enable/${row?.id}/`
      )
      .then((response) => {
        getAllProducts();
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });
  };

  // HELPER FUNCTIONS

  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      {
        Header: "Product",
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
      { Header: "Price", accessor: "price" },
      { Header: "Brand", accessor: "brand" },
      { Header: "Qty", accessor: "quantity" },
      { Header: "Country", accessor: "country" },
      { Header: "Category", accessor: "category" },
      { Header: "Madeof", accessor: "madeof" },
      { Header: "Stock", accessor: "stock" },
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
          <div className="info-title">Total Products</div>
          <div className="info-value success">{products?.length}</div>
        </div>
        <div className="info">
          <div className="info-title">Out of stock</div>
          <div className="info-value warning">{outOfStockItems?.length}</div>
        </div>
        <div className="info">
          <div className="info-title">Inactive Items</div>
          <div className="info-value warning">{inactiveItems?.length}</div>
        </div>
      </div>

      <div className="add-product-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search Products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="add-product-button" onClick={() => setIsShowForm(true)}>
          Add Product
        </div>
      </div>

      <div className="product-table">
        <DataTable
          columns={columns}
          data={filteredProducts ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleDisableProduct}
        />
      </div>
      <BasicModal
        open={deleteModalOpen}
        isConfirmModal={true}
        setOpen={handleDeleteModalClose}
        onConfirm={deleteProduct}
        heading={`Delete Product`}
        content={"Are you sure you want to delete this item?"}
      />

      <BasicModal
        open={isShowForm}
        setOpen={handleCloseForm}
        content={
          <AddProductForm
            onCancel={handleCloseForm}
            onConfirm={getAllProducts}
          />
        }
        customStyle={{ height: "87vh", overflowY: "scroll", marginTop: "0px" }}
      />

      <BasicModal
        open={showEditForm}
        setOpen={handleEditFormClose}
        content={
          <EditProductForm
            onCancel={handleEditFormClose}
            onConfirm={getAllProducts}
            initialProductData={selectedProduct}
          />
        }
        customStyle={{ height: "87vh", overflowY: "scroll", marginTop: "0px" }}
      />
    </div>
  );
}

export default ProductDashboard;