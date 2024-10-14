import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './wishlist.css'; // Link to your CSS file

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/orders/wishlist-list/?user_id=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWishlist(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userId, token]);

  const removeFromWishlist = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/orders/wishlist-items-detail/${itemId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWishlist(wishlist.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      let cartResponse = await axios.get(`http://localhost:8000/api/v1/orders/cart-list/?user_id=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let cartId;
      if (cartResponse.data.length > 0) {
        cartId = cartResponse.data[0].cart_id;
      } else {
        const newCartResponse = await axios.post('http://localhost:8000/api/v1/orders/cart-list/', {
          user_id: userId
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        cartId = newCartResponse.data.cart_id;
      }

      await axios.post('http://localhost:8000/api/v1/orders/cart-items-create/', {
        cart_id: cartId,
        product_id: productId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Product added to cart');
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  if (loading) {
    return <p>Loading Wishlist...</p>;
  }

  return (
    <div className="wishlist-page">
      <h1 className="wishlist-heading">Your Wishlist</h1>

      <div className="wishlist-container">
        {wishlist.length > 0 ? (
          wishlist.map((wishlistItem) => (
            <div key={wishlistItem.id} className="wishlist-item">
              <img
                src={wishlistItem.product?.image || "https://via.placeholder.com/100"}
                alt={wishlistItem.product?.name || "Product"}
                className="wishlist-item-image"
              />
              <div className="wishlist-item-details">
                <h4 className="wishlist-item-name">{wishlistItem.product?.name || "Unnamed Product"}</h4>
                <p className="wishlist-item-price">₹ {wishlistItem.product?.price || "N/A"}</p>
              </div>
              <div className="wishlist-item-actions">
                <button
                  className="wishlist-remove-btn"
                  onClick={() => removeFromWishlist(wishlistItem.id)}
                >
                  <i className="fas fa-trash"></i> Remove
                </button>
                <button
                  className="wishlist-add-to-cart-btn"
                  onClick={() => wishlistItem.product ? addToCart(wishlistItem.product.id) : alert("Product not available")}
                  disabled={!wishlistItem.product}
                >
                  <i className="fas fa-shopping-cart"></i> Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Your wishlist is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
