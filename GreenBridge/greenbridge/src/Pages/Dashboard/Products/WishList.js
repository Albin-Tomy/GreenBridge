import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './wishlist.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import Header from '../../../components/Header';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const userId = localStorage.getItem('userId');
  const BASE_URL = 'https://albintomy.pythonanywhere.com';

  useEffect(() => {
    if (userId) {
      // Step 1: Fetch the wishlist for the logged-in user
      axios.get(`https://albintomy.pythonanywhere.com/api/v1/orders/wishlist-list/?user_id=${userId}`)
        .then(response => {
          const wishlist = response.data[0]; // Assuming only one wishlist per user
          if (wishlist) {
            // Step 2: Fetch wishlist items by wishlist_id
            axios.get(`https://albintomy.pythonanywhere.com/api/v1/orders/wishlist-items-create/?wishlist_id=${wishlist.wishlist_id}`)
              .then(itemsResponse => {
                setWishlistItems(itemsResponse.data);
              })
              .catch(error => {
                toast.error('Error fetching wishlist items!');
              });
          }
        })
        .catch(error => {
          toast.error('Error fetching wishlist!');
        });
    }
  }, [userId]);

  const addToCart = (productId) => {
    const quantity = 1; // Default quantity for adding to cart
    axios.get(`https://albintomy.pythonanywhere.com/api/v1/orders/cart-list/?user_id=${userId}`)
      .then(response => {
        let cartId;

        if (response.data.length > 0) {
          cartId = response.data[0].cart_id; // Assuming first cart for the user
        } else {
          return axios.post('https://albintomy.pythonanywhere.com/api/v1/orders/cart-list/', { user_id: userId })
            .then(response => {
              cartId = response.data.cart_id;
              return cartId;
            });
        }

        return cartId;
      })
      .then(cartId => {
        const dataToSend = {
          user_id: userId,
          product_id: productId,
          quantity: quantity
        };

        return axios.post('https://albintomy.pythonanywhere.com/api/v1/orders/cart-items-create/', dataToSend);
      })
      .then(() => {
        toast.success('Product added to cart!');
      })
      .catch(error => {
        toast.error('Error adding the product to the cart!');
      });
  };

  const removeFromWishlist = (wishlistItemId) => {
    axios.delete(`https://albintomy.pythonanywhere.com/api/v1/orders/wishlist-items/${wishlistItemId}/`)
      .then(() => {
        setWishlistItems(wishlistItems.filter(item => item.wishlist_item_id !== wishlistItemId));
        toast.info('Item removed from wishlist');
      })
      .catch(error => {
        toast.error('Error removing item from wishlist!');
      });
  };
  

  return (
    <div>
      <Header />
      <div className="wishlist-page">
        <h1>Your Wishlist</h1>

        <div className="wishlist-container">
          {wishlistItems.length > 0 ? (
            wishlistItems.map((item) => (
              // Ensure item.product exists before trying to access its properties
              <div key={item.wishlist_item_id} className="wishlist-item">
                <img
                  src={item.product.image ? `${BASE_URL}${item.product.image}` : 'https://via.placeholder.com/150'}
                  alt={item.product.name}
                  className="wishlist-product-image"
                />
                <div className="item-details">
                  <h4>{item.product?.name || 'Product Name'}</h4>
                  <p>₹ {item.product?.price || 'N/A'}</p>
                </div>
                <div className="wishlist-actions">
                  <button className="remove-btn" onClick={() => removeFromWishlist(item.wishlist_item_id)}>
                    <FontAwesomeIcon icon={faTrash} /> Remove
                  </button>
                  <button className="cart-btn" onClick={() => addToCart(item.product?.product_id)}>
                    <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Your wishlist is empty.</p>
          )}
        </div>
      </div>
      <ToastContainer // Add ToastContainer here
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Wishlist;
