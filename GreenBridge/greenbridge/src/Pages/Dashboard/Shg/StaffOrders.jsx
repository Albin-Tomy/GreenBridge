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

import AddOrderForm from "../../../components/Forms/OrderForm";

function Admin() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState("");
  const [parentMenu, setParentMenu] = useState("");
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [addButtonLabel, setAddButtonLabel] = useState("");
  const [form, setForm] = useState();
  const [isShowForm, setIsShowForm] = useState(false);
  const [isFormEdit, setIsFormEdit] = useState(false);
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    axios
      .get(config.getAllUsers)
      .then((response) => {
        if (response.status === 200) {
          setUsers(response.data);
        }
      })
      .catch((error) => {
        console.log("Error fetching users:", error);
      });
  }, []);

  const handleDeleteModalClose = () => {
    setOpen(false);
  };

  const convertedOrders = (orders, users) => {
    const userLookup = users.reduce((acc, user) => {
      acc[user.id] = user.email;
      return acc;
    }, {});

    const orderStatusMap = {
      1: 'Order Placed',
      2: 'Pending',
      3: 'Dispatched',
      4: 'Delivered',
      5: 'Cancelled',
    };

    return orders.map((order) => ({
      id: order.order_id,
      user_id: userLookup[order.user_id],
      order_date: formatDate(order.order_date),
      order_status: orderStatusMap[order.order_status],
      total_products: 1,
      expected_delivery: formatDate(order.updated_at),
      total_amount: order.total_amount,
    }));
  };

  const getOrders = () => {
    axios
      .get(config.getOrdersApi)
      .then((response) => {
        setAllOrders(response.data);
        const orders = convertedOrders(response.data, users);
        setRows(orders);
        setColumns(orderColumns);
      })
      .catch((error) => {
        console.log("Error fetching orders:", error);
      });
  };

  useEffect(() => {
    if (menu === "Orders") {
      setParentMenu("Orders");
      setAddButtonLabel("Add Order");
      setForm(
        <AddOrderForm
          onCancel={handleCloseForm}
          initialOrderData={null}
          isEdit={isFormEdit}
        />
      );
      getOrders();
    }
  }, [menu, isFormEdit, users]);

  const orderColumns = [
    { field: "user_id", headerName: "User", flex: 1 },
    { field: "order_date", headerName: "Ordered On", flex: 1 },
    { field: "order_status", headerName: "Order Status", flex: 1 },
    { field: "total_products", headerName: "Total Products", flex: 1 },
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

  const handleAddButton = () => {
    setIsShowForm(true);
    setIsFormEdit(false);
  };

  const handleCloseForm = () => {
    setIsShowForm(false);
  };

  const handleEditOrder = (id) => {
    setIsFormEdit(true);
    setIsShowForm(true);
    const orderData = allOrders.find((order) => order.order_id === id);
    if (orderData) {
      setForm(
        <AddOrderForm
          onCancel={handleCloseForm}
          initialOrderData={orderData}
          isEdit={isFormEdit}
        />
      );
    }
  };

  const handleDeleteOrder = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const confirmDeleteOrder = () => {
    axios
      .delete(`https://green-bridge.onrender.com/api/v1/orders/delete/${selectedId}/`)
      .then((response) => {
        setOpen(false);
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedId));
        alert("Order deleted successfully!");
      })
      .catch((error) => {
        console.log("Error deleting order:", error);
      });
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="menu-container">
          <div className="menus">
            <Menubox
              text={"Orders"}
              action={setMenu}
              menu={menu}
              parentMenu={parentMenu}
            />
          </div>
        </div>
        <div className="table-wrapper">
          <div className="add-button-container">
            <button className="add-button" onClick={handleAddButton}>
              + {addButtonLabel}
            </button>
          </div>
          <div className="table-container">
            <BasicTable rows={rows} columns={columns} />
          </div>
        </div>
        <BasicModal
          open={open}
          isConfirmModal={true}
          setOpen={handleDeleteModalClose}
          onConfirm={confirmDeleteOrder}
          heading={`Delete Order`}
          content={"Are you sure you want to delete this order?"}
        />
        {isShowForm && (
          <BasicModal
            open={isShowForm}
            setOpen={handleCloseForm}
            content={form}
            customStyle={{ height: '87vh', overflowY: 'scroll', marginTop: '0px' }}
          />
        )}
      </div>
    </div>
  );
}

export default Admin;
