// src/services/menuService.js

import axios from "axios";
import config from "../config/config";

// Fetch all products
export const fetchProducts = () => {
  return axios.get(config.getProductApi);
};

// Fetch all categories
export const fetchCategories = () => {
  return axios.get(config.getCategoryApi);
};

// Fetch all orders
export const fetchOrders = () => {
  return axios.get(config.getOrdersApi);
};

// Fetch all users
export const fetchUsers = () => {
  return axios.get(config.getAllUsers);
};

// Fetch all staffs
export const fetchStaffs = () => {
  return axios.get(config.getStaffApi);
};

// Delete a product by ID
export const deleteProductById = (id) => {
  return axios.delete(`${config.deleteProductApi}${id}/`);
};

// Delete an order by ID
export const deleteOrderById = (id) => {
  return axios.delete(`http://localhost:8000/api/v1/orders/delete/${id}/`);
};

// Delete staff by ID
export const deleteStaffById = (id) => {
  return axios.delete(`http://localhost:8000/api/v1/staffs/delete/${id}/`);
};
