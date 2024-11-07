import React, { useState, useEffect } from 'react';
import './cart.css';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import Header from '../../../components/Header';
import { toast, ToastContainer } from 'react-toastify';  // Import Toast
import 'react-toastify/dist/ReactToastify.css';  // Import toast styles
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const BASE_URL = 'http://127.0.0.1:8000';

  // Fetch cart items from the Django backend
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    axios.get(`${BASE_URL}/api/v1/orders/cart-items/?user_id=${userId}`)
      .then(response => {
        setCartItems(response.data);  // Response should now include product details including stock
        calculateTotal(response.data);
      })
      .catch(error => console.error('Error fetching cart items:', error));
  }, []);

  // Calculate the total price
  const calculateTotal = (items) => {
    let subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    let shipping = 100;  // Flat shipping rate for simplicity
    setTotal(subtotal + shipping);
  };

  // Update the quantity of an item
  const updateQuantity = (id, newQuantity, stock) => {
    if (newQuantity < 1) return;  // Prevent quantity from going below 1
    if (newQuantity > stock) {  // Prevent quantity from exceeding stock
      toast.error('Quantity cannot exceed available stock!');  // Display toast message
      return;
    }

    axios.patch(`${BASE_URL}/api/v1/orders/cart-items-detail/${id}/`, { quantity: newQuantity })
      .then(response => {
        const updatedItems = cartItems.map(item => 
          item.cart_item_id === id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
        toast.success('Quantity updated successfully!');  // Display success toast
      })
      .catch(error => console.error('Error updating quantity:', error));
  };

  // Remove an item from the cart
  const removeItem = (id) => {
    axios.delete(`${BASE_URL}/api/v1/orders/cart-items-detail/${id}/`)
      .then(() => {
        const updatedItems = cartItems.filter(item => item.cart_item_id !== id);
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
        toast.info('Item removed from the cart!');  // Display removal toast
      })
      .catch(error => console.error('Error removing item:', error));
  };
  const handleCheckout = () => {
    navigate('/address-list');  // Navigate to the address page
  };

  return (
    <div>
      <Header></Header>
      <ToastContainer 
      position="top-center"  // Centered position
      autoClose={3000}  // Auto close after 3 seconds
      hideProgressBar={false}  // Show progress bar
      newestOnTop={false}  // Older toasts appear at the bottom
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover/> {/* Add ToastContainer for the toast messages */}
      <div className="cart-page">
        <h1>Your Shopping Cart</h1>

        <div className="cart-container">
          <div className="cart-items">
            {cartItems.length > 0 ? (
              cartItems.map(item => (
                <div className="cart-item" key={item.cart_item_id}>
                  <img
                    src={item.product.image ? `${BASE_URL}${item.product.image}` : 'https://via.placeholder.com/150'}
                    alt={item.product.name}
                    className="cart-product-image"
                  />
                  <div className="item-details">
                    <h4 className="item-name">{item.product.name}</h4>
                    <p className="item-price">Price: <span className="price-amount">₹ {item.product.price}</span></p>
                   {/* Display stock quantity */}
                    <div className="quantity-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1, item.product.stock_quantity)}
                        disabled={item.quantity <= 1}  // Disable if quantity is 1
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1, item.product.stock_quantity)}
                        disabled={item.quantity >= item.product.stock_quantity}  // Disable if quantity equals stock
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button className="cart-remove-btn" onClick={() => removeItem(item.cart_item_id)}>
                    <FaTrash />
                  </button>
                </div>
              ))
            ) : (
              <p>Your cart is empty</p>
            )}
          </div>

          {/* Render cart summary only if cartItems has items */}
      {cartItems.length > 0 && (
        <div className="cart-summary">
          <h3 className="summary-title">Order Summary</h3>
          <p className="summary-item">Subtotal: <span className="summary-amount">₹ {total - 100}</span></p>
          <p className="summary-item">Shipping: <span className="summary-amount">₹ 100</span></p>
          <h4 className="summary-total">Total: <span className="summary-amount">₹ {total}</span></h4>
          <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
