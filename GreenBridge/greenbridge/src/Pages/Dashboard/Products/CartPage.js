import React, { useState, useEffect } from 'react';
import './cart.css';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Fetch cart items from the Django backend
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/v1/orders/cart-list/')
      .then(response => {
        setCartItems(response.data);
        calculateTotal(response.data);
      })
      .catch(error => console.error('Error fetching cart items:', error));
  }, []);

  // Calculate the total price
  const calculateTotal = (items) => {
    let subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    let shipping = 100; // Flat shipping rate for simplicity
    setTotal(subtotal + shipping);
  };

  // Update the quantity of an item
  const updateQuantity = (id, newQuantity) => {
    axios.patch(`http://127.0.0.1:8000/api/v1/orders/cart-items-detail/${id}/`, { quantity: newQuantity })
      .then(response => {
        const updatedItems = cartItems.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
      })
      .catch(error => console.error('Error updating quantity:', error));
  };

  // Remove an item from the cart
  const removeItem = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/v1/orders/cart-items-detail/${id}/`)
      .then(() => {
        const updatedItems = cartItems.filter(item => item.id !== id);
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
      })
      .catch(error => console.error('Error removing item:', error));
  };

  return (
    <div className="cart-page">
      <h1>Your Shopping Cart</h1>

      <div className="cart-container">
        <div className="cart-items">
          {cartItems.length > 0 ? (
            cartItems.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="item-details">
                  <h4 className="item-name">{item.name}</h4>
                  <p className="item-price">Price: <span className="price-amount">₹ {item.price}</span></p>
                  <div className="quantity-control">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                    <span className="quantity">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => removeItem(item.id)}>
                  <FaTrash />
                </button>
              </div>
            ))
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>

        <div className="cart-summary">
          <h3 className="summary-title">Order Summary</h3>
          <p className="summary-item">Subtotal: <span className="summary-amount">₹ {total - 100}</span></p>
          <p className="summary-item">Shipping: <span className="summary-amount">₹ 100</span></p>
          <h4 className="summary-total">Total: <span className="summary-amount">₹ {total}</span></h4>
          <button className="checkout-btn">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
