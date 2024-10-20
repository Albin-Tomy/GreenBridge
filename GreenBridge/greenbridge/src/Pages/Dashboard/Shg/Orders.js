import React, { useEffect, useState } from "react";
import axios from "axios";
import BasicTable from "../../../components/BasicTable";
import BasicModal from "../../../components/BasicModal";
import AddOrderForm from "../../../components/Forms/OrderForm";
import config from "../../../config/config";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { orderItemById } from "../Shg/helper";

function Orders() {
  const [rows, setRows] = useState([]);
  const [isShowForm, setIsShowForm] = useState(false);
  const [isFormEdit, setIsFormEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [form, setForm] = useState(null);
  const [columns, setColumns] = useState([]);
  
  useEffect(() => {
    axios.get(config.getOrdersApi)
      .then((response) => {
        setAllOrders(response.data);
        setRows(convertedOrders(response.data));
      })
      .catch((error) => console.log(error));
  }, []);

  const convertedOrders = (data) => {
    return data.map((order) => ({
      id: order.order_id,
      total_amount: order.total_amount,
      order_date: new Date(order.order_date).toLocaleDateString(),
    }));
  };

  const handleEdit = (id) => {
    setIsFormEdit(true);
    setIsShowForm(true);
    const orderData = orderItemById(id, allOrders);
    setForm(<AddOrderForm onCancel={handleCloseForm} initialOrderData={orderData} isEdit={isFormEdit} />);
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
      <BasicTable rows={rows} columns={columns} />
      {isShowForm && (
        <BasicModal open={isShowForm} setOpen={handleCloseForm} content={form} />
      )}
    </div>
  );
}

export default Orders;
