import React, { useEffect, useState } from "react";
import axios from "axios";
import "./forms.css";
import {findActiveItems} from "../../Pages/Dashboard/Shg/helper";

const EditProductForm = ({ onCancel, onConfirm, initialProductData }) => {
  const [categories,setCategories] = useState();
  const [brands, setBrands] = useState()
  const [countries,setCountries] = useState()
  const [madeOf,setMadeOfs]  = useState()
  const [errors, setErrors] = useState({});
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

  const handleOnCancel = () => {
    onCancel();
  };

  useEffect(() => {
    if (initialProductData) {
      setProductData({
        name: initialProductData.name,
        description: initialProductData.description,
        price: initialProductData.price,
        quantity: initialProductData.quantity || 1,
        category: initialProductData.category || null,
        brand: initialProductData.brand || null,
        country: initialProductData.country || null,
        made_of: initialProductData.made_of || null,
        stock_quantity: initialProductData.stock_quantity || 1,
        image: null,
      });
    }
  }, [initialProductData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  const handleFileChange = (e) => {
    setProductData({ ...productData, image: e.target.files[0] });
  };

  const validateForm = () => {
    const validationErrors = {};

    // Name and Description validation
    if (!productData.name.trim()) {
      validationErrors.name = "Name is required.";
    }
    if (!productData.description.trim()) {
      validationErrors.description = "Description is required.";
    }

    // Category, Brand, Country, Made Of validation
    if (!productData.category) {
      validationErrors.category = "Category is required.";
    }
    if (!productData.brand) {
      validationErrors.brand = "Brand is required.";
    }
    if (!productData.country) {
      validationErrors.country = "Country is required.";
    }
    if (!productData.made_of) {
      validationErrors.made_of = "Material is required.";
    }

    // Price validation
    if (!productData.price || isNaN(productData.price) || Number(productData.price) <= 0) {
      validationErrors.price = "Price must be a positive number.";
    }

    // Quantity validation
    if (!productData.quantity || isNaN(productData.quantity) || Number(productData.quantity) <= 0) {
      validationErrors.quantity = "Quantity must be a positive number.";
    }

    // Stock Quantity validation
    if (!productData.stock_quantity || isNaN(productData.stock_quantity) || Number(productData.stock_quantity) < 0) {
      validationErrors.stock_quantity = "Stock Quantity must be a non-negative number.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      if (key === "image" && productData[key] instanceof File) {
        formData.append(key, productData[key]);
      } else if (key !== "image") {
        formData.append(key, productData[key]);
      }
    });

    axios
      .put(
        `http://127.0.0.1:8000/api/v1/products/update/${initialProductData.product_id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        alert("Product updated successfully!");
        onCancel();
        onConfirm();
      })
      .catch((error) => {
        console.error("Error updating product:", error.response.data);
      });
  };

  return (
    <div className="form-container">
      <h3>Edit Product</h3>
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
            required
          />
          {errors.name && <span className="error">{errors.name}</span>}

          <label>Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            required
          />
          {errors.description && <span className="error">{errors.description}</span>}

          <label>Category</label>
          <select
            id="category"
            name="category"
            value={productData.category ? String(productData.category) : ""}
            onChange={handleInputChange}
            required
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
            required
          >
            <option value="">Select Brand</option>
            {brands?.map((item) => (
              <option key={item.id} value={Number(item.brand_id)}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.brand && <span className="error">{errors.brand}</span>}

          <label>Price</label>
          <input
            type="text"
            id="price"
            name="price"
            value={productData.price}
            onChange={handleInputChange}
            required
          />
          {errors.price && <span className="error">{errors.price}</span>}

          <label>Quantity</label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            value={productData.quantity}
            onChange={handleInputChange}
            required
          />
          {errors.quantity && <span className="error">{errors.quantity}</span>}

          <label>Country</label>
          <select
            id="country"
            name="country"
            value={productData.country}
            onChange={handleInputChange}
            required
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
            required
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
            required
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
              Update Product
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

export default EditProductForm;