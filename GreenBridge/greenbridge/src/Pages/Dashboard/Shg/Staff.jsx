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
import { formatDate } from "../Shg/helper";
import BasicModal from "../../../components/BasicModal";
import { useNavigate } from "react-router-dom";
import AddUserForm from "../../../components/Forms/UserForm";
import ProductForm from "../../../components/Forms/ProductForm";
import AddOrderForm from "../../../components/Forms/OrderForm";
import AddStaffForm from "../../../components/Forms/StaffsForm";
import { getItemById } from "../Shg/helper";
import { orderItemById } from "../Shg/helper";

function Admin() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState("");
  const [parentMenu, setParentMenu] = useState("");
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState();
  // const [countries, setCountries] = useState();
  // const [madeOf, setMadeOf] = useState();
  const [users, setUsers] = useState();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [addButtonLabel, setAddButtonLabel] = useState();
  const [form,setForm] = useState();
  const [isShowForm,setIsShowForm]=useState(false)
  const [isFormEdit,setIsFormEdit] = useState(false)
  const [allProducts, setAllProducts] = useState()
  const [allOrders, setAllOrders] = useState()
 
  useEffect(() => {
    axios
      .get(config.getCategoryApi)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    axios
      .get(config.getAllUsers)
      .then((response) => {
        console.log("response", response.data);
        if (response.status === 200) {
          setUsers(response.data);
        }
      })
      .catch((error) => {
        console.log("err", error);
      });


      axios
      .get(config.getProductApi)
      .then((response) => {
        console.log(response.data);
        setAllProducts(response.data)
        const products = restructureProductData(response.data);
        console.log(products);
        setRows(products);
        setColumns(productColumns);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [menu]);

  

  const handleDeleteModalClose = () => {
    setOpen(false);
  };

  const getCategoryNameById = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  const restructureProductData = (data) => {
    return data.map((item) => ({
      id: item.product_id,
      name: item.name,
      price: ` Rs: ${item.price}`,
      quantity:item.quantity,
      category: getCategoryNameById(item.category),
      stock: item.stock_quantity,
    }));
  };

  const convertedOrders = (orders, users) => {
    const userLookup = users.reduce((acc, user) => {
      acc[user.id] = user.email;
      return acc;
    }, {});

    const order_status_map={
      1:'Order placed',
      2:"Pending",
      3:"Dispatched",
      4:"Delivered",
      5:"Cancelled"
    }

    return orders.map((order) => ({
      id: order.order_id,
      user_id: userLookup[order.user_id],
      order_date: formatDate(order.order_date),
      order_status:order_status_map[order.order_status],
      total_products: 1,
      expected_delivery: formatDate(order.updated_at),
      total_amount: order.total_amount,
    }));
  };


  const getOnConfirmHandler = (menu) => {
    switch (menu) {
      case "Products":
        return confirmDeleteProduct;

      case "Orders":
        return confirmDeleteOrder;

      case "Staffs":
        return confirmDeletStaff

      // case "Users":
      //   return confirmDeleteUser;

      default:
        return () => {};
    }
  };

  useEffect(() => {
    console.log("menu", menu);

    console.log("API URL:", config.getProductsApi);
    if (menu === "Products") {
      setParentMenu("Products");
      setAddButtonLabel("Add Product");
      setForm(<ProductForm onCancel={handleCloseForm} initialProductData={null} isEdit={isFormEdit}/>)
      axios
        .get(config.getProductApi)
        .then((response) => {
          console.log(response.data);
          const products = restructureProductData(response.data);
          console.log(products);
          setRows(products);
          setColumns(productColumns);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (menu === "Orders") {
      setParentMenu("Orders");
      setAddButtonLabel("");
      setForm(<AddOrderForm onCancel={handleCloseForm} initialOrderData={null} isEdit={isFormEdit}/>)

      axios
        .get(config.getOrdersApi)
        .then((response) => {
          console.log(response.data);
          setAllOrders(response.data)
          const orders = convertedOrders(response.data, users);
          console.log("orders", orders);
          setRows(orders);
          setColumns(orderColumns);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (menu === "Staffs") {
      setParentMenu("Staffs");
      setAddButtonLabel("Add Staff");
      setForm(<AddStaffForm onCancel={handleCloseForm}/>)

      axios
        .get('https://green-bridge-backend.onrender.com/api/v1/staffs/list/')
        .then((response) => {
          console.log("staffs",response.data);
          const transformedStaffData = transformStaffData(response.data)
          console.log("transformedStaffData",transformedStaffData)
          setRows(transformedStaffData)
          setColumns(staffColumns)
        })
        .catch((error) => {
          console.log(error);
        });


      setColumns(staffColumns);
    }
    if (menu === "Users") {
      setParentMenu("Users");
      setAddButtonLabel("Add User");
      axios
        .get('https://green-bridge-backend.onrender.com/api/v1/auth/users/')
        .then((response) => {
          console.log("users",response.data);
          const transformedUserData = transformUserData(response.data)
          setRows(transformedUserData)
          setColumns(usersColumns)
        })
        .catch((error) => {
          console.log(error);
        });
     
      setColumns(usersColumns);
      setForm(<AddUserForm onCancel={handleCloseForm}/>)
    }

  }, [menu,open,isFormEdit]);

  

  const productColumns = [
    // { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    { field: "price", headerName: "Price", type: "number", flex: 1 },
    { field: "stock", headerName: " Stock Quantity", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
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
      flex: 1,
    },
  ];

  const orderColumns = [
    // { field: "id", headerName: "ID", flex: 1 ,hide:true},
    { field: "user_id", headerName: "User", flex: 1 },
    { field: "order_date", headerName: "Ordered On", flex: 1 },
    { field: "order_status", headerName: "Order Status", flex: 1 },
    { field: "total_products", headerName: " Total Products", flex: 1 },
    { field: "expected_delivery", headerName: "Expected Delivery On", flex: 1 },
    { field: "total_amount", headerName: "Total Amount", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEditOrder(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteOrder(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
      flex: 1,
    },
  ];

  const staffColumns = [
    // { field: "staff_id", headerName: "Staff ID", flex: 1 },
    { field: "user_id", headerName: "User Id", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <div>
          {/* <IconButton onClick={() => handleEditStaff(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteStaff(params.row.id)}>
            <DeleteIcon />
          </IconButton> */}
        </div>
      ),
      flex: 1,
    },
  ];
  const transformStaffData = (staffData) => {
    return staffData.map((staff) => ({
      staff_id: staff.staff_id,
      user_id: staff.user_id,
      name: `${staff.first_name} ${staff.last_name}`,
      email: staff.email || "N/A", 
      status: staff.is_active ? "Active" : "Inactive",
      id: staff.staff_id, 
    }));
  };

  const usersColumns = [
    { field: "user_id", headerName: "User Id", flex: 1, hide:true},
    { field: "email", headerName: "Email", flex: 1 },
    { field: "joined_on", headerName: "Joined On", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <div>
          {/* <IconButton onClick={() => handleEditUsers(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteUsers(params.row.id)}>
            <DeleteIcon />
          </IconButton> */}
        </div>
      ),
      flex: 1,
    },
  ];
  const transformUserData = (userData) => {
    return userData.map((user) => ({
      user_id: user.id,
      name: user.name || "N/A", 
      email: user.email,
      joined_on: new Date(user.date_joined).toLocaleDateString(), 
      status: user.is_active ? "Active" : "Inactive",
      id: user.id, 
    }));
  };

  const handleAddButton = () => {
    setIsShowForm(true)
    setIsFormEdit(false)
  };

  const handleCloseForm=()=>{
    setIsShowForm(false)
  }

   // Add your edit logic here
  const handleEdit = (id) => {
    console.log("Edit ID:", id);
    setIsFormEdit(true)
    setIsShowForm(true)
    const productData = getItemById(id,allProducts)
    console.log("products",productData)
    console.log("rows",rows)
    console.log("allProducts",allProducts)
    setForm(<ProductForm onCancel={handleCloseForm} initialProductData={productData} isEdit={isFormEdit}/>)
  };

  const handleDelete = (id) => {
    setOpen(true);
    setSelectedId(id);
    console.log("selected id for delete",id)
  };

  const confirmDeleteProduct = () => {
    axios
      .delete(`${config.deleteProductApi}${selectedId}/`)
      .then((response) => {
        if (response.status === 200) {
          setRows((prevRows) => prevRows.filter((row) => row.id !== selectedId));
          setOpen(false);
        }
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };


  const   confirmDeleteOrder = () => {
    axios
      .delete(`https://green-bridge-backend.onrender.com/api/v1/orders/delete/${selectedId}/`)
      .then((response) => {
        console.log("delete res", response);
        setOpen(false);
        setRows(prevRows => prevRows.filter(row => row.id !== selectedId));
        if (response.status === 200) {
          alert("Order  deleted !");
          // window.location.reload()
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const   confirmDeletStaff = () => {
    axios
      .delete(`https://green-bridge-backend.onrender.com/api/v1/staffs/delete/${selectedId}/`)
      .then((response) => {
        console.log("delete res", response);
        setOpen(false);
        setRows(prevRows => prevRows.filter(row => row.id !== selectedId));
        if (response.status === 200) {
          alert("Staff  deleted !");
          // window.location.reload()
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const handleEditOrder = (id) => {
    console.log("Edit ID:", id);
    setIsFormEdit(true)
    setIsShowForm(true)
    const orderData = orderItemById(id,allOrders)
    console.log("orders",orderData)
    console.log("rows",rows)
    console.log("allOrders",allOrders)
    setForm(<AddOrderForm onCancel={handleCloseForm} initialOrderData={orderData} isEdit={isFormEdit}/>)
  };

  const handleDeleteOrder = (id) => {
    setSelectedId(id)
    setOpen(true)
    console.log("order id for delete",id)
    // Add your delete logic here
  };

  

  return (
    <div>
      <Navbar></Navbar>
    <div className="container">
      
      <div className="menu-container">
        <div className="menus">
          <Menubox
            text={"Products"}
            action={setMenu}
            menu={menu}
            parentMenu={parentMenu}
          />
          <Menubox
            text={"Orders"}
            action={setMenu}
            menu={menu}
            parentMenu={parentMenu}
          />
          
        </div>
      </div>
      <div className="table-wrapper" >
  <div className="add-button-container">
    <button className="add-button" onClick={handleAddButton}>
      {" "}
      + {addButtonLabel}
    </button>
  </div>
  <div className="table-container">
    <BasicTable rows={rows} columns={columns}></BasicTable>
  </div>
  </div>

      <BasicModal
        open={open}
        isConfirmModal={true}
        setOpen={handleDeleteModalClose}
        onConfirm={getOnConfirmHandler(menu)}
        heading={`Delete ${menu}`}
        content={"Are you sure you want to delete this item?"}
      />

      {isShowForm && 
        <BasicModal
        open={isShowForm}
        setOpen={handleCloseForm}
        content={form}
        customStyle={{height:'87vh',overflowY:'scroll', marginTop:'0px'}}
        />
      }
    </div>
    </div>

  );
}

export default Admin;