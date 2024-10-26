import React, { useEffect, useState } from "react";
import "./ProductDashboard.css";
import DataTable from "../../../components/DataTable";
import BasicModal from "../../../components/BasicModal";
import axios from "axios";
import { orderItemById, findInactiveItems,getIUserById } from "../Shg/helper";

import AddStaffForm from "../../../components/Forms/AddAgent";
import EditOrderForm from "../../../components/Forms/EditOrder";
import OrderItemsTable from "../../../components/OrderItemsTable";

function AllOrdersDashboard() {
  const [orders, setOrders] = useState();
  const [ordersResponse, setOrdersResponse] = useState();
  const [selectedOrders, setSelectedOrders] = useState();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isShowForm, setIsShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const inactiveItems = findInactiveItems(ordersResponse);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [allUsers,setAllUsers] = useState()
  const [isShowMoreDetails,setIsShowMoreDetails] = useState(false)

  useEffect(() => {
    getAllOrders();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      setFilteredOrders(
        orders.filter(
          (order) =>
            order.user_id.toLowerCase().includes(lowercasedTerm) || 
            order.order_id.toString().includes(lowercasedTerm) || 
            order.order_status.toString().includes(lowercasedTerm)
        )
      );
    } else {
      setFilteredOrders(orders);
    }
  }, [searchTerm, orders]);



  const getAllOrders = async () => {
    try {
      // Fetch users first
      const usersResponse = await axios.get("http://127.0.0.1:8000/api/v1/auth/users/");
      setAllUsers(usersResponse.data);

      // Fetch orders
      const ordersResponse = await axios.get("http://127.0.0.1:8000/api/v1/orders/list/");
      setOrdersResponse(ordersResponse.data);
      console.log("Orders response:", ordersResponse.data);

      // Transform data only if allUsers is available
      if (usersResponse.data.length) {
        const transformedData = await transformStaffData(ordersResponse.data, usersResponse.data);
        console.log("Transformed data:", transformedData);
        setOrders(transformedData);
      }
    } catch (error) {
      console.error("Error fetching orders or users:", error);
    }
  };
  
  const transformStaffData = async (dataArray, allUsers) => {
    if (!Array.isArray(dataArray)) {
      console.error("Expected an array for dataArray, but got:", dataArray);
      return [];
    }
  
    if (!Array.isArray(allUsers)) {
      console.error("Expected an array for allUsers, but got:", allUsers);
      return [];
    }
  
    return dataArray.map((data) => {
      // Find the user with the matching ID
      const user = allUsers.find((item) => item.id === data.user_id);
  
      if (!user) {
        console.warn(`No user found for user_id: ${data.user_id}`);
      }
  
      return {
        order_id: data?.order_id,
        user_id: user?.email || "N/A", // Use "N/A" if user is not found
        order_status: data?.order_status,
        order_date: new Date(data?.order_date).toLocaleDateString("en-US"),
        total_amount: data?.total_amount,
        tax_amount: data?.tax_amount,
        updatedAt: new Date(data?.updated_at).toLocaleDateString("en-US"),
      };
    });
  };
  
  
  


  const handleCloseForm = () => {
    setIsShowForm(false);
  };

  const handleEditFormClose = () => {
    setShowEditForm(false);
  };

  const handleEdit = (row) => {
    const order = orderItemById(row?.order_id, ordersResponse);
    console.log("order",order)
    setSelectedOrders(order);
    setShowEditForm(true);
  };
  const handleDelete = (row) => {
    setSelectedOrders(row);
    setDeleteModalOpen(true);
  };
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const deleteUser = () => {
    axios
      .delete(
        `http://127.0.0.1:8000/api/v1/orders/delete/${selectedOrders?.order_id}/`
      )
      .then((response) => {
        alert("order deleted");
        setDeleteModalOpen(false);
        setOrders((prevmadeOfs) =>
          prevmadeOfs.filter(
            (madeof) => madeof.madeof_id !== selectedOrders.madeof_id
          )
        );
        getAllOrders();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDisableStaff = (row) => {
    axios
      .post(
        `http://127.0.0.1:8000/api/v1/orders/disable-enable-order/${row?.order_id}/`
      )
      .then((response) => {
        getAllOrders();
      })
      .catch((error) => {
        console.log("ERROR: ", error);
      });
  };

  const showMoreDetails = (row)=>{
    console.log("show more details");
    setIsShowMoreDetails(true)
    setSelectedOrders(row)
  }
  
  const handleCloseMoredetails=()=>{
    setIsShowMoreDetails(false)
  }

  console.log("selectedOrders", selectedOrders);

  const columns = React.useMemo(
    () => [
      { Header: "Order ID", accessor: "order_id" },
      { Header: "User id", accessor: "user_id" },
      { Header: "Order status", accessor: "order_status" },
      { Header: "Ordered On", accessor: "order_date" },
      { Header: "Total Amount", accessor: "total_amount" },
      { Header: "Tax", accessor: "tax_amount" },
      { Header: "Updated On", accessor: "updatedAt" },
    ],
    []
  );

  return (
    <div className="product-main-container">
      <div className="short-infos">
        <div className="info">
          <div className="info-title">Total orders</div>
          <div className="info-value success">{orders?.length}</div>
        </div>
        
      </div>

      <div className="add-product-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search Orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      
      </div>

      <div className="product-table">
        <DataTable
          columns={columns}
          data={filteredOrders ?? []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleDisableStaff}
          hideActiveButton={true}
          showViewMoreIcon={true}
          onShowMoreDetails={showMoreDetails}
        />
      </div>
      <BasicModal
        open={deleteModalOpen}
        isConfirmModal={true}
        setOpen={handleDeleteModalClose}
        onConfirm={deleteUser}
        heading={`Delete madeof`}
        content={"Are you sure you want to delete this item?"}
      />

        <BasicModal
        open={isShowMoreDetails}
        setOpen={handleCloseForm}
        content={<OrderItemsTable data={selectedOrders} handleCloseForm={handleCloseMoredetails}/>}
      />

      <BasicModal
        open={isShowForm}
        setOpen={handleCloseForm}
        content={
          <AddStaffForm onCancel={handleCloseForm} onConfirm={getAllOrders} />
        }
      />

      <BasicModal
        open={showEditForm}
        setOpen={handleEditFormClose}
        content={
          <EditOrderForm
            onCancel={handleEditFormClose}
            onConfirm={getAllOrders}
            initialOrderData={selectedOrders}
          />
        }
      />
    </div>
  );
}

export default AllOrdersDashboard;