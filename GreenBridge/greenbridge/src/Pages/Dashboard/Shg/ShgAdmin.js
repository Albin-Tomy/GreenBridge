// import React, { useState } from "react";
// import Navbar from "../../../components/Navbar";
// import Menubox from "../../../components/Menubox";
// import { Outlet ,useNavigate} from "react-router-dom"; // This will render the child components

// function Admin() {
//   const [menu, setMenu] = useState("");
//   const [parentMenu, setParentMenu] = useState("");
//   const navigate = useNavigate(); 

//   const handleMenuChange = (newMenu) => {
//     setMenu(newMenu);
//     setParentMenu(newMenu);
    
//     if (newMenu === "Products") {
//         navigate("products"); // Navigate to the products route
//       } else if (newMenu === "Orders") {
//         navigate("orders"); // Navigate to the orders route
//       }

//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="container">
//         <div className="menu-container">
//           <div className="menus">
//             <Menubox text={"Products"} action={handleMenuChange} menu={menu} parentMenu={parentMenu} />
//             <Menubox text={"Orders"} action={handleMenuChange} menu={menu} parentMenu={parentMenu} />
//           </div>
//         </div>
//         <div className="content-wrapper">
//           <Outlet /> {/* Renders the corresponding page based on the route */}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Admin;
import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import BasicModal from "../../../components/BasicModal";
import {
  fetchProducts,
  fetchCategories,
  fetchOrders,
  fetchUsers,
  fetchStaffs,
  deleteProductById,
  deleteOrderById,
  deleteStaffById,
} from "../../../services/menuservices";
import { formatDate, getItemById } from "../Shg/helper";
import MenuSection from "../../../components/MenuSection";
import TableSection from "../../../components/TableSection";
import ActionButtons from "../../../components/ActionButton";
import ProductForm from "../../../components/Forms/ProductForm";
import AddOrderForm from "../../../components/Forms/OrderForm";
import AddUserForm from "../../../components/Forms/UserForm";
import AddStaffForm from "../../../components/Forms/StaffsForm";

function Admin() {
  const [menu, setMenu] = useState("");
  const [parentMenu, setParentMenu] = useState("");
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [addButtonLabel, setAddButtonLabel] = useState();
  const [form, setForm] = useState();
  const [isShowForm, setIsShowForm] = useState(false);
  const [isFormEdit, setIsFormEdit] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetchCategories().then((response) => setCategories(response.data));

    fetchUsers().then((response) => setAllUsers(response.data));

    fetchProducts().then((response) => {
      const products = restructureProductData(response.data);
      setRows(products);
      setColumns(productColumns);
      setAllProducts(response.data);
    });
  }, []);

  // Handle opening form modal for adding a new item
  const handleAddButton = () => {
    setIsShowForm(true);
    setIsFormEdit(false);

    if (menu === "products") {
      setForm(<ProductForm onCancel={handleCloseForm} isEdit={isFormEdit} />);
    } else if (menu === "orders") {
      setForm(<AddOrderForm onCancel={handleCloseForm} />);
    } else if (menu === "users") {
      setForm(<AddUserForm onCancel={handleCloseForm} />);
    } else if (menu === "staffs") {
      setForm(<AddStaffForm onCancel={handleCloseForm} />);
    }
  };

  // Handle edit operation
  const handleEdit = (id) => {
    let data;
    if (menu === "products") {
      data = getItemById(id, allProducts);
      setForm(<ProductForm onCancel={handleCloseForm} initialProductData={data} isEdit={true} />);
    } else if (menu === "orders") {
      data = getItemById(id, allOrders);
      setForm(<AddOrderForm onCancel={handleCloseForm} initialOrderData={data} />);
    }
    setIsShowForm(true);
    setIsFormEdit(true);
  };

  // Handle delete action and modal confirmation
  const handleDelete = (id) => {
    setOpen(true);
    setSelectedId(id);
  };

  const confirmDeleteItem = () => {
    if (menu === "products") {
      deleteProductById(selectedId).then(() => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedId));
        setOpen(false);
      });
    } else if (menu === "orders") {
      deleteOrderById(selectedId).then(() => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedId));
        setOpen(false);
      });
    }
  };

  // Handle closing the form modal
  const handleCloseForm = () => {
    setIsShowForm(false);
  };

  // Restructure product data for the table
  const restructureProductData = (data) => {
    return data.map((item) => ({
      id: item.product_id,
      name: item.name,
      price: `Rs: ${item.price}`,
      quantity: item.quantity,
      category: categories.find((cat) => cat.id === item.category_id)?.name || "Unknown",
      stock: item.stock_quantity,
    }));
  };

  // Define columns for product table
  const productColumns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    { field: "price", headerName: "Price", type: "number", flex: 1 },
    { field: "stock", headerName: "Stock Quantity", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <div>
          <button onClick={() => handleEdit(params.row.id)}>Edit</button>
          <button onClick={() => handleDelete(params.row.id)}>Delete</button>
        </div>
      ),
      flex: 1,
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="container">
        <MenuSection menu={menu} setMenu={setMenu} parentMenu={parentMenu} />
        <ActionButtons
          handleAdd={handleAddButton}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          addButtonLabel={`Add ${menu}`}
        />
        <TableSection rows={rows} columns={columns} />
        <BasicModal
          open={open}
          isConfirmModal={true}
          setOpen={() => setOpen(false)}
          onConfirm={confirmDeleteItem}
          heading={`Delete ${menu}`}
          content="Are you sure you want to delete this item?"
        />
        {isShowForm && form}
      </div>
    </div>
  );
}

export default Admin;
