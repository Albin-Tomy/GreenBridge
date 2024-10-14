import React, { useState } from 'react';
import './forms.css';

const AddOrderItemForm = () => {
  const [orderItemData, setOrderItemData] = useState({
    order: '',
    product: '',
    quantity: '',
    price: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderItemData({ ...orderItemData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Order Item data:', orderItemData);
  };

  return (
    <div className="form-container">
      <h3>Add New Order Item</h3>
      <form onSubmit={handleSubmit}>
        <div className="heads">
          <span>Order Item Details</span>
        </div>

        <label htmlFor="order">Order</label>
        <input
          type="text"
          id="order"
          name="order"
          value={orderItemData.order}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="product">Product</label>
        <input
          type="text"
          id="product"
          name="product"
          value={orderItemData.product}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={orderItemData.quantity}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="price">Price</label>
        <input
          type="text"
          id="price"
          name="price"
          value={orderItemData.price}
          onChange={handleInputChange}
          required
        />

        <div className="form-actions">
          <button type="submit" className="save-btn">Save Order Item</button>
          <button type="reset" className="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddOrderItemForm;