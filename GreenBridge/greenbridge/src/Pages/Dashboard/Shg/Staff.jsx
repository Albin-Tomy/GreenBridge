import React, { useEffect, useState } from "react";
import "./Staff.css";
import Navbar from "../../../components/Header";
import Menubox from "../../../components/Menubox";
import DataTable from "../../../components/BasicTable";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import config from "../../../config/config";
import axios from "axios";
import { formatDate } from "./helper";
import BasicModal from "../../../components/BasicModal";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../../components/Forms/ProductForm";
import AddCategoryForm from "../../../components/Forms/CategoryForm";
import AddOrderForm from "../../../components/Forms/OrderForm";
import AddBrandForm from "../../../components/Forms/BrandForm";
import AddCountryForm from "../../../components/Forms/CountryForm";
import AddMadeofForm from "../../../components/Forms/MadeofForm";

function Staff() {
    const navigate = useNavigate();
    const [menu, setMenu] = useState("");
    const [parentMenu, setParentMenu] = useState("");
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState();
    const [countries, setCountries] = useState();
    const [madeOf, setMadeOf] = useState();
    const [users, setUsers] = useState();
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState();
    const [addButtonLabel, setAddButtonLabel] = useState();
    const [form,setForm] = useState();
    const [isShowForm,setIsShowForm]=useState(false)

    
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
      .get(config.getBrandsApi)
      .then((response) => {
        setBrands(response.data);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });

    axios
      .get(config.getCountriesApi)
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });

    axios
      .get(config.getMadeofApis)
      .then((response) => {
        setMadeOf(response.data);
      })
      .catch((error) => {
        console.error("Error fetching made of:", error);
      });

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
      category: getCategoryNameById(item.category),
      stock: item.stock_quantity,
    }));
  };

  const convertedOrders = (orders, users) => {
    const userLookup = users.reduce((acc, user) => {
      acc[user.id] = user.email;
      return acc;
    }, {});

    return orders.map((order) => ({
      id: order.order_id,
      user_id: userLookup[order.user_id],
      order_date: formatDate(order.order_date),
      order_status: order.order_status,
      total_products: 1,
      expected_delivery: formatDate(order.updated_at),
      total_amount: order.total_amount,
    }));
  };

  const restructureCategoryData = (data) => {
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      added: new Date(item.created_at).toLocaleDateString(),
      updated: new Date(item.updated_at).toLocaleDateString(),
    }));
  };

  const restructureBrandData = (data) => {
    return data.map((item) => ({
      id: item.brand_id,
      name: item.name,
      description: item.description,
      added: new Date(item.created_at).toLocaleDateString(),
      updated: new Date(item.updated_at).toLocaleDateString(),
    }));
  };

  const restructureCountryData = (data) => {
    return data.map((item) => ({
      id: item.country_id,
      name: item.name,
      added: new Date(item.created_at).toLocaleDateString(),
      updated: new Date(item.updated_at).toLocaleDateString(),
    }));
  };

  const restructureMadeofData = (data) => {
    return data.map((item) => ({
      id: item.madeof_id,
      name: item.name,
      description: item.description,
      added: new Date(item.created_at).toLocaleDateString(),
      updated: new Date(item.updated_at).toLocaleDateString(),
    }));
  };

  const getOnConfirmHandler = (menu) => {
    switch (menu) {
      case "Products":
        return confirmDeleteProduct;
      case "Categories":
        return confirmDeleteCategory;
      case "Brands":
        return confirmDeleteBrand;
      case "Country":
        return confirmDeleteCountry;
      case "Made of":
        return confirmDeleteMadeof;
      case "Orders":
        return confirmDeleteOrder;  

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
      setForm(<ProductForm onCancel={handleCloseForm}/>)
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
      setAddButtonLabel("Add new Order");
      setForm(<AddOrderForm onCancel={handleCloseForm}/>)

      axios
        .get(config.getOrdersApi)
        .then((response) => {
          console.log(response.data);
          const orders = convertedOrders(response.data, users);
          console.log("orders", orders);
          setRows(orders);
          setColumns(orderColumns);
        })
        .catch((error) => {
          console.log(error);
        });
      setRows(orderRows);
      setColumns(orderColumns);
    }

    if (menu === "Categories") {
      setAddButtonLabel("Add Category");
      setRows(restructureCategoryData(categories));
      setColumns(categoryColumns);
      setForm(<AddCategoryForm  onCancel={handleCloseForm}/>)

    }

    if (menu === "Brands") {
      setAddButtonLabel("Add Brand");
      setRows(restructureBrandData(brands));
      setForm(<AddBrandForm onCancel={handleCloseForm}/>)

      axios
      .get(config.getBrandsApi)
      .then((response) => {
        setBrands(response.data);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
      setColumns(categoryColumns);
    }
    if (menu === "Country") {
      setAddButtonLabel("Add Country");
      setRows(restructureCountryData(countries));
      setColumns(countryColumns);
      setForm(<AddCountryForm onCancel={handleCloseForm}/>)
    }
    if (menu === "Made of") {
      setAddButtonLabel("Add Made of");
      setRows(restructureMadeofData(madeOf));
      setColumns(categoryColumns);
      setForm(<AddMadeofForm onCancel={handleCloseForm}/>)
    }
  }, [menu,open,countries]);

  const productColumns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
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

  const orderRows = [];
  const orderColumns = [
    { field: "id", headerName: "ID", flex: 1 },
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

  const categoryColumns = [
    { field: "id", headerName: "Id", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "description", headerName: "Descrption", flex: 1 },
    { field: "added", headerName: "Added On", flex: 1 },
    { field: "updated", headerName: "Updated On", flex: 1 },
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

  const countryColumns = [
    { field: "id", headerName: "Id", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "added", headerName: "Added On", flex: 1 },
    { field: "updated", headerName: "Updated On", flex: 1 },
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

  const handleAddButton = () => {
    setIsShowForm(true)
  };

  const handleCloseForm=()=>{
    setIsShowForm(false)
  }

  const handleEdit = (id) => {
    console.log("Edit ID:", id);
    // Add your edit logic here
  };

  const handleDelete = (id) => {
    setOpen(true);
    setSelectedId(id);
  };

  const confirmDeleteProduct = () => {
    axios
      .delete(`${config.deleteProductApi}${selectedId}/`)
      .then((response) => {
        if (response.status === 200) {
          setOpen(false);
          alert("Product deleted !");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const confirmDeleteOrder = () => {
    axios
      .delete(`http://127.0.0.1:8000/api/v1/orders/delete/${selectedId}/`)
      .then((response) => {
        if (response.status === 200) {
          setOpen(false);
          alert("Order deleted !");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const confirmDeleteCategory = () => {
    axios
      .delete(`${config.deleteCategoryApi}${selectedId}/`)
      .then((response) => {
        setOpen(false);
        setRows(prevRows => prevRows.filter(row => row.id !== selectedId));
        if (response.status === 200) {
          
          alert("Category deleted !");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const confirmDeleteBrand = () => {
    axios
      .delete(`${config.deleteBrandApi}${selectedId}/`)
      .then((response) => {
        setOpen(false);
        setRows(prevRows => prevRows.filter(row => row.id !== selectedId));
        console.log("delete res", response);
        if (response.status === 200) {
          alert("Brand deleted !");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const confirmDeleteCountry = () => {
    axios
      .delete(`${config.deleteCountryApi}${selectedId}/`)
      .then((response) => {
        console.log("delete res", response);
        setOpen(false);
        setRows(prevRows => prevRows.filter(row => row.id !== selectedId));
        if (response.status === 200) {
          alert("Brand deleted !");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const confirmDeleteMadeof = () => {
    axios
      .delete(`${config.deleteMadeOfApi}${selectedId}/`)
      .then((response) => {
        console.log("delete res", response);
        setOpen(false);
        setRows(prevRows => prevRows.filter(row => row.id !== selectedId));
        if (response.status === 200) {
          alert("Brand deleted !");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditOrder = (id) => {
    console.log("Edit ID:", id);
    // Add your edit logic here
  };

  const handleDeleteOrder = (id) => {
    console.log("Delete ID:", id);
    setOpen(true);
    setSelectedId(id);
    // Add your delete logic here
  };

  const handleEditStaff = (id) => {
    console.log("Edit ID:", id);
    // Add your edit logic here
  };

  const handleDeleteStaff = (id) => {
    console.log("Delete ID:", id);
    // Add your delete logic here
  };

  const handleEditUsers = (id) => {
    console.log("Edit ID:", id);
    // Add your edit logic here
  };

  const handleDeleteUsers = (id) => {
    console.log("Delete ID:", id);
    // Add your delete logic here
  };

  const handleEditCategory = (id) => {
    console.log("Edit ID:", id);
    // Add your edit logic here
  };

  const handleDeleteCategory = (id) => {
    console.log("Delete ID:", id);
    // Add your delete logic here
  };

    return (
    <div className="container">
    <Navbar></Navbar>
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
      <div className="submenu">
        {parentMenu === "Products" ? (
          <>
            <Menubox text={"Categories"} action={setMenu} menu={menu} />
            <Menubox text={"Brands"} action={setMenu} menu={menu} />
            <Menubox text={"Country"} action={setMenu} menu={menu} />
            <Menubox text={"Made of"} action={setMenu} menu={menu} />
          </>
        ) : (
          ""
        )}
      </div>
    </div>
    <div className="add-button-container">
      <button className="add-button" onClick={handleAddButton}>
        {" "}
        + {addButtonLabel}
      </button>
    </div>
    <div className="table-container">
      <DataTable rows={rows} columns={columns}></DataTable>
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

);

}

export default Staff;