import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './product-detail.css';

const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/v1/products/details/${id}/`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

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
    <div className="product-detail-page">
      {product && (
        <>
          {/* Breadcrumb Navigation */}
          <nav className="breadcrumb">
            <a href="/products">Home</a> / {product.category} / {product.name}
          </nav>

          <div className="product-container">
            {/* Product Image */}
            <div className="product-image-container">
              <img
                src={product.image || 'https://via.placeholder.com/600'}
                alt={product.name}
                className="main-product-image"
              />
            </div>

            {/* Product Info */}
            <div className="product-info">
              <h1>{product.name}</h1>
              <p className="price">₹ {product.price}</p>
              <p className="rating">Rating: {product.rating}</p>
              <p className="description">{product.description}</p>

              <div className="product-details">
                <h4>Product Details</h4>
                <ul>
                  <li>Brand: {product.brand}</li>
                  <li>Category: {product.category}</li>
                  <li>Material: {product.made_of}</li>
                  <li>Country: {product.country}</li>
                  <li>Stock Quantity: {product.stock_quantity}</li>
                </ul>
              </div>

              {/* Add to Cart Section */}
              <div className="product-actions">
                <button className="wishlist-btn">
                  <i className="fas fa-heart"></i> Add to Wishlist
                </button>
                <button className="cart-btn">
                  <i className="fas fa-shopping-cart"></i> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetail;
