
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './product-detail.css';
import Navbar from '../../../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState({});
  const [brands, setBrands] = useState({});
  const [countries, setCountries] = useState({});
  const [materials, setMaterials] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const BASE_URL = 'http://127.0.0.1:8000';
  const [quantity, setQuantity] = useState(1);
  const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

  useEffect(() => {
    // Fetch product details
    axios.get(`http://127.0.0.1:8000/api/v1/products/details/${id}/`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('There was a problem fetching product details. Please try again later.');
        setLoading(false);
      });

    // Fetch cart items of the user
    if (userId) {
      axios.get(`http://127.0.0.1:8000/api/v1/orders/cart-items/?user_id=${userId}`)
        .then(response => {
          setCartItems(response.data); // Store the cart items in state
        })
        .catch(error => {
          console.error('Error fetching cart items:', error);
        });
    }

    // Fetch additional data (categories, brands, countries, materials)...
    axios.get('http://127.0.0.1:8000/api/v1/products/category-list/')
      .then(response => {
        const categoryMap = response.data.reduce((acc, category) => {
          acc[category.id] = category.name;
          return acc;
        }, {});
        setCategories(categoryMap);
      });

    axios.get('http://127.0.0.1:8000/api/v1/products/madeof-list/')
      .then(response => {
        const materialMap = response.data.reduce((acc, material) => {
          acc[material.madeof_id] = material.name;
          return acc;
        }, {});
        setMaterials(materialMap);
      });

  }, [id, userId]);

  const addToCart = (productId, quantity = 1) => {
    if (!userId) {
      toast.error("Please log in first to add items to the cart.");
      return;
    }

    axios.get(`http://127.0.0.1:8000/api/v1/orders/cart-list/?user_id=${userId}`)
      .then(response => {
        let cartId;

        if (response.data.length > 0) {
          cartId = response.data[0].cart_id; // Assuming first cart for the user
        } else {
          return axios.post('http://127.0.0.1:8000/api/v1/orders/cart-list/', { user_id: userId })
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

        return axios.post('http://127.0.0.1:8000/api/v1/orders/cart-items-create/', dataToSend);
      })
      .then(() => {
        toast.success('Product added to cart!');
      })
      .catch(error => {
        toast.error('Error adding the product to the cart!');
      });
  };

  const addToWishlist = (productId) => {
    if (!userId) {
      toast.error("Please log in first to add items to the wishlist.");
      return;
    }

    axios.get(`http://127.0.0.1:8000/api/v1/orders/wishlist-list/?user_id=${userId}`)
      .then(response => {
        let wishlistId;

        if (response.data.length > 0) {
          wishlistId = response.data[0].wishlist_id;
        } else {
          return axios.post('http://127.0.0.1:8000/api/v1/orders/wishlist-list/', { user_id: userId })
            .then(response => {
              wishlistId = response.data.wishlist_id;
            });
        }

        return wishlistId;
      })
      .then(wishlistId => {
        return axios.post('http://127.0.0.1:8000/api/v1/orders/wishlist-items-create/', {
          wishlist_id: wishlistId,
          product_id: productId
        });
      })
      .then(() => {
        toast.success('Product added to wishlist!');
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.error === "Product is already in the wishlist") {
          toast.info('Product is already in the wishlist.');
        } else {
          toast.error('Error adding product to wishlist!');
        }
      });
  };

  const isProductInCart = () => {
    return cartItems.some(item => item.product_id === product.product_id);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="product-detail-page">
        <ToastContainer 
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
        {product && (
          <>
            <nav className="breadcrumb">
              <a href="/products">Home</a> / {categories[product.category]} / {product.name}
            </nav>

            <div className="product-container">
              <div className="product-image-container">
                <img
                  src={product.image ? `${BASE_URL}${product.image}` : 'https://via.placeholder.com/150'}
                  alt={product.name}
                  className="product-detail-images"
                />
              </div>

              <div className="product-info">
                <h1>{product.name}</h1>
                <p className="price">₹ {product.price}</p>
                <p className="rating">Rating: {product.rating}</p>
                <p className="description">{product.description}</p>

                <div className="product-details">
                  <h4>Product Details</h4>
                  <ul>
                    <li>Category: {categories[product.category]}</li>
                    <li>Material: {materials[product.made_of]}</li>
                    
                  </ul>
                </div>
                {(!product.is_active || product.stock_quantity === 0) && (
                      <p className="hard-out-of-stock-label">Out of Stock</p>
                    )}

                <div className="product-actions">
                <button onClick={() => addToWishlist(product.product_id)} className="wishlist-btn">
                    <i className="fas fa-heart"></i> Add to Wishlist
                  </button>
                  {isProductInCart() ? (
                    <button onClick={() => navigate('/cart')} className="cart-btn">
                      <i className="fas fa-shopping-cart"></i> Go to Cart
                    </button>
                  ) : (
                    <button disabled={!product.is_active || product.stock_quantity === 0}
                    onClick={() => addToCart(product.product_id, 1)} className="cart-btn">
                      <i className="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
