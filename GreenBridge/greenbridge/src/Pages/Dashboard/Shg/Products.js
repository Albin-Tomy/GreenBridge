import React, { useEffect, useState } from "react";
import axios from "axios";
import BasicTable from "../../../components/BasicTable";
import BasicModal from "../../../components/BasicModal";
import ProductForm from "../../../components/Forms/ProductForm";
import config from "../../../config/config";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getItemById } from "../Shg/helper";

function Products() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isShowForm, setIsShowForm] = useState(false);
  const [isFormEdit, setIsFormEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState();
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    axios.get(config.getProductApi)
      .then((response) => {
        console.log(response.data); // Log API response
        setAllProducts(response.data);
        setRows(restructureProductData(response.data));
        setColumns(productColumns);
      })
      .catch((error) => console.log(error));
  }, []);

  const restructureProductData = (data) => {
    return data.map((item) => ({
      id: item.product_id, // Ensure this matches your API response structure
      name: item.name,
      price: `Rs: ${item.price}`,
      quantity: item.quantity,
      stock: item.stock_quantity,
    }));
  };

  const productColumns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    { field: "price", headerName: "Price", flex: 1 },
    { field: "stock", headerName: "Stock", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEdit(params.row.id)}><EditIcon /></IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}><DeleteIcon /></IconButton>
        </div>
      ),
      flex: 1,
    },
  ];

  const handleEdit = (id) => {
    setIsFormEdit(true);
    setIsShowForm(true);
    const productData = getItemById(id, allProducts);
    setForm(<ProductForm onCancel={handleCloseForm} initialProductData={productData} isEdit={isFormEdit} />);
  };

  const handleDelete = (id) => {
    setSelectedId(id);
    setIsShowForm(true);
  };

  const handleCloseForm = () => {
    setIsShowForm(false);
  };

  return (
    <div>
      <button onClick={() => setIsShowForm(true)}>+ Add Product</button>
      <BasicTable rows={rows} columns={columns} />
      {isShowForm && (
        <BasicModal open={isShowForm} setOpen={handleCloseForm} content={form} />
      )}
    </div>
  );
}

export default Products;
