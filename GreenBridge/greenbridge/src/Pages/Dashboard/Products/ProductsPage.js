
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './product.css';
import Header from '../../../components/Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Filter from '../../../components/Filter';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [category, setCategory] = useState('all');
  
  const [madeOf, setMadeOf] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');

  const BASE_URL = 'https://albintomy.pythonanywhere.com';

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const userId = localStorage.getItem('userId');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    setIsUserLoggedIn(!!userId);
  }, [userId]);

    // Fetch products with applied filters
    const fetchProducts = () => {
      setLoading(true);
      axios
        .get(`${BASE_URL}/api/v1/products/filter/`, {
          params: {
            category: category !== 'all' ? category : null,
            made_of: madeOf !== 'all' ? madeOf : null,
            sort: sortOrder !== 'default' ? sortOrder : null,
          },
        })
        .then((response) => {
          setProducts(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    };
  
    // Fetch products on initial load or when filters change
    useEffect(() => {
      fetchProducts();
    }, [category, madeOf, sortOrder]);


  // Fetch the cart items for the logged-in user
  const fetchCartItems = async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/orders/cart-list/?user_id=${userId}`);
      if (response.data.length > 0) {
        const cartId = response.data[0].cart_id;
        const cartItemsResponse = await axios.get(`${BASE_URL}/api/v1/orders/cart-items/?user_id=${userId}`);
        return cartItemsResponse.data;
        
      }
      return [];
    } catch (err) {
      console.error('Error fetching cart items:', err);
      return [];
    }
  };

  useEffect(() => {
    const fetchProductsAndCart = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/products/list/?search=${searchQuery}`);
        setProducts(response.data);

        const userId = localStorage.getItem('userId');
        if (userId) {
          const cartData = await fetchCartItems(userId);
          setCartItems(cartData);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products or cart items');
        setLoading(false);
      }
    };

    fetchProductsAndCart();
  }, [searchQuery]);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const addToCart = (productId, quantity = 1) => {
    const userId = localStorage.getItem('userId');
    if (!isUserLoggedIn) {
      toast.error("Please log in first to add items to the cart.");
      return;
    }

    axios.get(`${BASE_URL}/api/v1/orders/cart-list/?user_id=${userId}`)
      .then(response => {
        let cartId;

        if (response.data.length > 0) {
          cartId = response.data[0].cart_id;
        } else {
          return axios.post(`${BASE_URL}/api/v1/orders/cart-list/`, { user_id: userId })
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

        return axios.post(`${BASE_URL}/api/v1/orders/cart-items-create/`, dataToSend);
      })
      .then(() => {
        toast.success('Product added to cart!');
        setCartItems(prevItems => [...prevItems, { product_id: productId }]);
      })
      .catch(error => {
        toast.error('Error adding the product to the cart!');
      });
  };

  const addToWishlist = (productId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error("Please log in first to add items to the wishlist.");
      return;
    }

    axios.get(`${BASE_URL}/api/v1/orders/wishlist-list/?user_id=${userId}`)
      .then(response => {
        let wishlistId;

        if (response.data.length > 0) {
          wishlistId = response.data[0].wishlist_id;
        } else {
          return axios.post(`${BASE_URL}/api/v1/orders/wishlist-list/`, { user_id: userId })
            .then(response => {
              wishlistId = response.data.wishlist_id;
            });
        }

        return wishlistId;
      })
      .then(wishlistId => {
        return axios.post(`${BASE_URL}/api/v1/orders/wishlist-items-create/`, {
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

  // Check if the product is already in the cart
  const isProductInCart = (productId) => {
    return cartItems.some(item => item.product_id === productId);
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error fetching products: {error}</div>;
  }

  return (
    <div className='header' >
      <Header />
      <div className="product-page">
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
        <h1 className="page-title">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Discover Our Premium Products'}
        </h1>
        <div className="main-contents">
        <Filter
            category={category}
            setCategory={setCategory}
            madeOf={madeOf}
            setMadeOf={setMadeOf}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
          <div className="product-displays">
            <div className="products-grids">
              {products.length > 0 ? (
                products.map((product) => (
                  <div className="product-cards" key={product.product_id}>
                    <img
                      src={product.image ? `${BASE_URL}${product.image}` : 'https://via.placeholder.com/150'}
                      alt={product.name}
                      className="product-image"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleProductClick(product.product_id)}
                    />
                    <div className="product-infos">
                      <h4>{product.name}</h4>
                      <p className="price">₹ {product.price}</p>
                    </div>
                    {(!product.is_active || product.stock_quantity === 0) && (
                      <p className="hard-out-of-stock-label">Out of Stock</p>
                    )}
                    <div className="product-actions">
                      <button className="wishlist-btns" onClick={() => addToWishlist(product.product_id)}>
                        <i className="fas fa-heart"></i> Wishlist
                      </button>
                      {isProductInCart(product.product_id) ? (
                        <button className="cart-btns" onClick={() => navigate('/cart')}>
                          <i className="fas fa-shopping-cart"></i> Go to Cart
                        </button>
                      ) : (
                        <button disabled={!product.is_active || product.stock_quantity === 0}
                         className="cart-btns" onClick={() => addToCart(product.product_id, 1)}>
                          <i className="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>No products found for "{searchQuery}"</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
