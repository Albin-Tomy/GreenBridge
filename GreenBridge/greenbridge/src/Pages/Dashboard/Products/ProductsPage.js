import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './product.css';
import Header from '../../../components/Header';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Base URL for the backend
  const BASE_URL = 'http://127.0.0.1:8000';

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/products/list/?search=${searchQuery}`
        );
        console.log('Fetched Products:', response.data); // Debug log
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err); // Debug log
        setError('Failed to fetch products');
        setLoading(false);
      }
    };
  
    console.log('Search Query:', searchQuery); // Debug log
    fetchProducts();
  }, [BASE_URL, searchQuery]);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error fetching products: {error}</div>;
  }

  return (
    <div>
      <Header />
      <div className="product-page">
        <h1 className="page-title">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Discover Our Premium Products'}
        </h1>
        <div className="main-contents">
          <aside className="filter-sidebar">
            <h3>Filter & Sort</h3>
            <div className="sort-bar">
              <label htmlFor="sortOrder">Sort by:</label>
              <select id="sortOrder">
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
            <div className="filter-group">
              <h4>Country</h4>
              <select id="filterCountry">
                <option value="all">All</option>
              </select>
            </div>
            <div className="filter-group">
              <h4>Made Of</h4>
              <select id="filterMadeOf">
                <option value="all">All</option>
              </select>
            </div>
          </aside>
          <div className="product-displays">
            <div className="products-grids">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    className="product-cards"
                    key={product.product_id}
                    onClick={() => handleProductClick(product.product_id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={product.image ? `${BASE_URL}${product.image}` : 'https://via.placeholder.com/150'}
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-infos">
                      <h4>{product.name}</h4>
                      <p className="price">₹ {product.price}</p>
                    </div>
                    <div className="product-actions">
                      <button className="wishlist-btns">
                        <i className="fas fa-heart"></i> Wishlist
                      </button>
                      <button className="cart-btns">
                        <i className="fas fa-shopping-cart"></i> Add to Cart
                      </button>
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
