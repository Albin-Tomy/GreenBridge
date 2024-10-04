import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductsPage.css'; // Import the corresponding CSS

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    subcategory_id: '',
    image: null,
  });

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products/');
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  // Fetch all subcategories
  const fetchSubcategories = async () => {
    try {
      const response = await axios.get('/api/subcategories/');
      setSubcategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories", error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle file upload (image)
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  // Create a new product
  const createProduct = async () => {
    const productData = new FormData();
    productData.append('name', formData.name);
    productData.append('description', formData.description);
    productData.append('price', formData.price);
    productData.append('stock_quantity', formData.stock_quantity);
    productData.append('subcategory_id', formData.subcategory_id);
    productData.append('image', formData.image);

    try {
      const response = await axios.post('/api/products/create/', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("Product created successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error creating product", error);
    }
  };

  // Update a product
  const updateProduct = async (productId) => {
    const productData = new FormData();
    productData.append('name', formData.name);
    productData.append('description', formData.description);
    productData.append('price', formData.price);
    productData.append('stock_quantity', formData.stock_quantity);
    productData.append('subcategory_id', formData.subcategory_id);
    productData.append('image', formData.image);

    try {
      const response = await axios.put(`/api/products/update/${productId}/`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("Product updated successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error updating product", error);
    }
  };

  // Delete a product
  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`/api/products/delete/${productId}/`);
      alert("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubcategories();
  }, []);

  return (
    <div className="products-page-container">
      <h1 className="products-page-title">Products Page</h1>

      {/* Form for creating or updating a product */}
      <form className="products-form">
        <input
          className="products-input"
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          className="products-input"
          type="text"
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <input
          className="products-input"
          type="number"
          name="price"
          placeholder="Product Price"
          value={formData.price}
          onChange={handleInputChange}
        />
        <input
          className="products-input"
          type="number"
          name="stock_quantity"
          placeholder="Stock Quantity"
          value={formData.stock_quantity}
          onChange={handleInputChange}
        />

        {/* Dropdown for selecting Category */}
        <select className="products-select" name="category_id" onChange={handleInputChange}>
          <option>Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Dropdown for selecting Subcategory */}
        <select className="products-select" name="subcategory_id" onChange={handleInputChange}>
          <option>Select Subcategory</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>

        {/* File input for product image */}
        <input
          className="products-file-input"
          type="file"
          name="image"
          onChange={handleFileChange}
        />

        <button className="products-submit-button" type="button" onClick={createProduct}>
          Create Product
        </button>
      </form>

      {/* List of products */}
      <h2 className="products-list-title">Product List</h2>
      <ul className="products-list">
        {products.map((product) => (
          <li key={product.id} className="products-list-item">
            <p className="product-name">{product.name}</p>
            <p className="product-description">{product.description}</p>
            <p className="product-price">Price: ${product.price}</p>
            <p className="product-stock">Stock: {product.stock_quantity}</p>
            <button
              className="products-action-button"
              onClick={() => updateProduct(product.id)}
            >
              Update
            </button>
            <button
              className="products-action-button"
              onClick={() => deleteProduct(product.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsPage;
