import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import './product.css';
import Header from '../../../components/Header';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Initialize the useNavigate hook

  // Base URL for the backend
  const BASE_URL = 'http://127.0.0.1:8000';  // Replace with your actual backend URL

  useEffect(() => {
    axios.get(`${BASE_URL}/api/v1/products/list/`)
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [BASE_URL]);

  const handleProductClick = (productId) => {
    // Navigate to the product details page
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
        <h1 className="page-title">Discover Our Premium Products</h1>

        <div className="main-contents">
          {/* Sidebar Filter Section */}
          <aside className="filter-sidebar">
            <h3>Filter & Sort</h3>

            {/* Sort Bar */}
            <div className="sort-bar">
              <label htmlFor="sortOrder">Sort by:</label>
              <select id="sortOrder">
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {/* Country Filter */}
            <div className="filter-group">
              <h4>Country</h4>
              <select id="filterCountry">
                <option value="all">All</option>
                {/* Add options dynamically if needed */}
              </select>
            </div>

            {/* Made Of Filter */}
            <div className="filter-group">
              <h4>Made Of</h4>
              <select id="filterMadeOf">
                <option value="all">All</option>
                {/* Add options dynamically if needed */}
              </select>
            </div>
          </aside>

          {/* Main Product Display Section */}
          <div className="product-displays">
            <div className="products-grids">
              {products.map(product => (
                <div
                  className="product-cards"
                  key={product.product_id}
                  onClick={() => handleProductClick(product.product_id)}  // Add onClick to navigate
                  style={{ cursor: 'pointer' }}  // Add cursor pointer for better UX
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
