
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./forms.css";
import {findActiveItems} from "../../Pages/Dashboard/Shg/helper"

const AddProductForm = ({ onCancel, onConfirm }) => {
  const [categories,setCategories] = useState();
  const [brands, setBrands] = useState()
  const [countries,setCountries] = useState()
  const [madeOf,setMadeOfs]  = useState()
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: 1,
    category: null,
    brand: null,
    country: null,
    made_of: null,
    stock_quantity: 1,
    image: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(()=>{
    axios.get("http://127.0.0.1:8000/api/v1/products/brand-list/")
    .then((response)=>{
      if(response?.status === 200){
        const activeBrands = findActiveItems(response?.data)
        setBrands(activeBrands)
      }
    })
    .catch((error)=>{
      console.log(error)
    })

    axios.get("http://127.0.0.1:8000/api/v1/products/category-list/")
    .then((response)=>{
      if(response?.status === 200){
        const activeCategories = findActiveItems(response?.data)
        setCategories(activeCategories)
      }
    })
    .catch((error)=>{
      console.log(error)
    })

    axios.get("http://127.0.0.1:8000/api/v1/products/country-list/")
    .then((response)=>{
      if(response?.status === 200){
        const activeCountries = findActiveItems(response?.data)
        setCountries(activeCountries)
      }
    })
    .catch((error)=>{
      console.log(error)
    })

    axios.get("http://127.0.0.1:8000/api/v1/products/madeof-list/")
    .then((response)=>{
      if(response?.status === 200){
        const activeMadeOfs = findActiveItems(response?.data)
        setMadeOfs(activeMadeOfs)
      }
    }).catch((error)=>{
      console.log(error)
    })
  },[])

  const validateForm = () => {
    const newErrors = {};

    if (!productData.name) newErrors.name = "Name is required.";
    if (!productData.description) newErrors.description = "Description is required.";
    if (!productData.price || isNaN(productData.price) || Number(productData.price) <= 0) {
      newErrors.price = "Price must be a positive number.";
    }
    if (!productData.quantity || /^[0-9]+$/.test(productData.quantity)) {
      newErrors.quantity = "Quantity must be a in exact unit.";
    }
    if (!productData.stock_quantity || isNaN(productData.stock_quantity) || Number(productData.stock_quantity) < 0) {
      newErrors.stock_quantity = "Stock quantity must be a non-negative number.";
    }
    if (!productData.category) newErrors.category = "Category is required.";
    if (!productData.brand) newErrors.brand = "Brand is required.";
    if (!productData.country) newErrors.country = "Country is required.";
    if (!productData.made_of) newErrors.made_of = "Material is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOnCancel = () => {
    setProductData({
      name: "",
      description: "",
      price: "",
      quantity: 1,
      category: null,
      brand: null,
      country: null,
      made_of: null,
      stock_quantity: 1,
      image: null,
    });
    setErrors({});
    onCancel();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProductData({ ...productData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      if (key === "image" && productData[key] instanceof File) {
        formData.append(key, productData[key]);
      } else if (key !== "image") {
        formData.append(key, productData[key]);
      }
    });

    axios
      .post(`http://127.0.0.1:8000/api/v1/products/create/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Product created successfully!");
        handleOnCancel();
        onConfirm();
      })
      .catch((error) => {
        console.error("Error creating product:", error.response.data);
      });
  };


  
  return (
    <div className="form-container">
      <h3>Add New Product</h3>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div className="head">
            <span>Product Details</span>
          </div>

          <label>Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
          />
          {errors.name && <span className="error">{errors.name}</span>}

          <label>Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={productData.description}
            onChange={handleInputChange}
          />
          {errors.description && <span className="error">{errors.description}</span>}

          <label>Category</label>
          <select
            id="category"
            name="category"
            value={productData.category}
            onChange={handleInputChange}
          >
            <option value="">Select Category</option>
            {categories?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.category && <span className="error">{errors.category}</span>}

          <label>Brand</label>
          <select
            id="brand"
            name="brand"
            value={productData.brand}
            onChange={handleInputChange}
          >
            <option value="">Select Brand</option>
            {brands?.map((item) => (
              <option key={item.id} value={item.brand_id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.brand && <span className="error">{errors.brand}</span>}

          <label>Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={productData.price}
            onChange={handleInputChange}
          />
          {errors.price && <span className="error">{errors.price}</span>}

          <label>Quantity</label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            value={productData.quantity}
            onChange={handleInputChange}
          />
          {errors.quantity && <span className="error">{errors.quantity}</span>}

          <label>Country</label>
          <select
            id="country"
            name="country"
            value={productData.country}
            onChange={handleInputChange}
          >
            <option value="">Select Country</option>
            {countries?.map((item) => (
              <option key={item.id} value={item.country_id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.country && <span className="error">{errors.country}</span>}

          <label>Made Of</label>
          <select
            id="made_of"
            name="made_of"
            value={productData.made_of}
            onChange={handleInputChange}
          >
            <option value="">Select Material</option>
            {madeOf?.map((item) => (
              <option key={item.id} value={item.madeof_id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.made_of && <span className="error">{errors.made_of}</span>}

          <label>Stock Quantity</label>
          <input
            type="number"
            id="stock_quantity"
            name="stock_quantity"
            value={productData.stock_quantity}
            onChange={handleInputChange}
          />
          {errors.stock_quantity && <span className="error">{errors.stock_quantity}</span>}

          <label>Product Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />

          <div className="form-actions">
            <button type="submit" className="save-btn">
              Save Product
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={handleOnCancel}
            >
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default AddProductForm;
