import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './forms.css';
import { formatDateForInput } from '../../Pages/Dashboard/Shg/helper';

const EditOrderForm = ({ onCancel,onConfirm, initialOrderData }) => {
  const [orderData, setOrderData] = useState({
    user_id: '',
    order_date: '',
    order_status: '1',
    tax_amount: '',
    total_amount: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialOrderData) {
      setOrderData({
        user_id: initialOrderData.user_id || '',
        order_date: formatDateForInput(initialOrderData.order_date) || '',
        order_status: initialOrderData.order_status || '1',
        tax_amount: initialOrderData.tax_amount || '',
        total_amount: initialOrderData.total_amount || '',
      });
    }
  }, [initialOrderData]);

  const validateForm = () => {
    const newErrors = {};
    if (!orderData.user_id) newErrors.user_id = 'User ID is required.';
    if (!orderData.order_date) newErrors.order_date = 'Order date is required.';
    if (!orderData.tax_amount || isNaN(orderData.tax_amount)) {
      newErrors.tax_amount = 'Valid tax amount is required.';
    }
    if (!orderData.total_amount || isNaN(orderData.total_amount)) {
      newErrors.total_amount = 'Valid total amount is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData({ ...orderData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();
      Object.keys(orderData).forEach((key) => {
        formData.append(key, orderData[key]);
      });

      // Update existing order
      axios
        .put(`http://127.0.0.1:8000/api/v1/orders/update/${initialOrderData?.order_id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          alert('Order updated successfully!');
          console.log('Order updated successfully:', response.data);
          onCancel()
          onConfirm()
        })
        .catch((error) => {
          console.error('Error updating order:', error.response.data);
        });
    }
  };

  return (
    <div className="form-container">
      <h3>Edit Order</h3>
      <form onSubmit={handleSubmit}>
        <div className="head">
          <span>Order Details</span>
        </div>

        <label htmlFor="user_id">User</label>
        <input
          type="text"
          id="user_id"
          name="user_id"
          value={orderData.user_id}
          onChange={handleInputChange}
          required
        />
        {errors.user_id && <span className="error">{errors.user_id}</span>}

        <label htmlFor="order_date">Order Date</label>
        <input
          type="date"
          id="order_date"
          name="order_date"
          value={orderData.order_date}
          onChange={handleInputChange}
          required
        />
        {errors.order_date && <span className="error">{errors.order_date}</span>}

        <label htmlFor="order_status">Order Status</label>
        <select
          id="order_status"
          name="order_status"
          value={orderData.order_status}
          onChange={handleInputChange}
        >
          <option value="Order Placed">Order Placed</option>
          <option value="Pending">Pending</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Delivered">Delivered</option>
          <option value="Canceled">Canceled</option>
        </select>

        <label htmlFor="tax_amount">Tax Amount</label>
        <input
          type="text"
          id="tax_amount"
          name="tax_amount"
          value={orderData.tax_amount}
          onChange={handleInputChange}
          required
        />
        {errors.tax_amount && <span className="error">{errors.tax_amount}</span>}

        <label htmlFor="total_amount">Total Amount</label>
        <input
          type="text"
          id="total_amount"
          name="total_amount"
          value={orderData.total_amount}
          onChange={handleInputChange}
          required
        />
        {errors.total_amount && <span className="error">{errors.total_amount}</span>}

        <div className="form-actions">
          <button type="submit" className="save-btn">
            Update Order
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOrderForm;