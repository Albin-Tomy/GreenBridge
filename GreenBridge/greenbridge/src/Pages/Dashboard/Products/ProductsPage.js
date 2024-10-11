import React, { useState, useEffect } from 'react';
import './ProductsPage.css';
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link for navigation

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('default'); // State for sorting
  const [filter, setFilter] = useState('all'); // State for filtering

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/products/list/'); // Adjust the port and endpoint if necessary
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('Fetched products:', data); // Debug: Check fetched data
      setProducts(data);
    } catch (error) {
      setError('Error fetching products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Sort and filter products
  const sortedProducts = () => {
    let filteredProducts = products;

    // Filter logic
    if (filter !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === filter);
    }

    // Sort logic
    switch (sortOrder) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filteredProducts;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-page">
      <h1 className="page-title">Discover Our Luxury Collection</h1>

      {/* Sort and Filter Bar */}
      <div className="sort-filter-bar">
        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="default">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>

        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="all">All Categories</option>
          <option value="furniture">Furniture</option>
          <option value="decor">Decor</option>
          <option value="lighting">Lighting</option>
          <option value="bedroom">Bedroom</option>
        </select>
      </div>

      <div className="products-grid">
        {sortedProducts().map((product) => (
          <div key={product.id} className="product-card"> {/* Use product.id instead of product._id */}
            <Link to={`/products/${product.id}`} className="product-link"> {/* Corrected Link */}
              <img
                src={product.imageUrl || 'https://via.placeholder.com/150'}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <h4>{product.name}</h4>
                <p className="price">₹ {product.price}</p>
                <p className="description">{product.description}</p>
                <div className="rating">
                  <span>{product.rating || 0}</span>
                  <FaStar className="star-icon" />
                </div>
              </div>
            </Link>
            <div className="product-actions">
              <button className="wishlist-btn">
                <FaHeart /> Wishlist
              </button>
              <button className="cart-btn">
                <FaShoppingCart /> Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
