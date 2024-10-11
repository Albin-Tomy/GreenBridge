import React, { useEffect, useState } from "react";
import config from "../../config/config";
import axios from "axios";
import "./forms.css";

const ProductForm = ({ onCancel,initialProductData,isEdit}) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [countries, setCountries] = useState([]);
  const [madeOf, setMadeOf] = useState([]);
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


  const handleOnCancel = ()=>{
    setProductData(null)
    onCancel()
  }

  useEffect(() => {
    if (initialProductData) {
      setProductData({
        name: initialProductData.name ,
        description: initialProductData.description ,
        price: initialProductData.price ,
        quantity: initialProductData.quantity || 1,
        category: initialProductData.category || null,
        brand: initialProductData.brand || null,
        country: initialProductData.country || null,
        made_of: initialProductData.made_of || null,
        stock_quantity: initialProductData.stock_quantity || 1,
        image: initialProductData.image || null, // Handle this for preview if needed
      });
    }
  }, [initialProductData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProductData({ ...productData, image: e.target.files[0] });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    if (isEdit) {
      // Update existing product
      axios
        .put(`http://127.0.0.1:8000/api/v1/products/update/${initialProductData.product_id}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          alert("Product updated successfully!");
          console.log("Product updated successfully:", response.data);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error updating product:", error.response.data);
        });
    } else {
      // Create a new product
      axios
        .post(`http://127.0.0.1:8000/api/v1/products/create/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          alert("Product created successfully!");
          console.log("Product created successfully:", response.data);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error creating product:", error.response.data);
        });
    }
  };

  useEffect(() => {
    axios
      .get(config.getCategoryApi)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    axios
      .get(config.getBrandsApi)
      .then((response) => {
        setBrands(response.data);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });

    axios
      .get(config.getCountriesApi)
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });

    axios
      .get(config.getMadeofApis)
      .then((response) => {
        setMadeOf(response.data);
      })
      .catch((error) => {
        console.error("Error fetching 'made of':", error);
      });
  }, []);

  return (
    <div className="form-container">
      <h3>Add New Product</h3>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div className="formhead">
            <span>Product Details</span>
          </div>

          <label>Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            value={productData.name}
            onChange={handleInputChange}
            required
          />

          <label>Description</label>
          <input
            type="text"
            id="description"
            name="description"
            className="form-input"
            value={productData.description}
            onChange={handleInputChange}
            required
          />

          <label>Category</label>
          <select
            id="category"
            name="category"
            className="form-input"
            value={productData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <label>Brand</label>
          <select
            id="brand"
            name="brand"
            className="form-input"
            value={productData.brand}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Brand</option>
            {brands.map((item) => (
              <option key={item.id} value={Number(item.brand_id)}>
                {item.name}
              </option>
            ))}
          </select>

          <label>Price</label>
          <input
            type="text"
            id="price"
            name="price"
            className="form-input"
            value={productData.price}
            onChange={handleInputChange}
            required
          />

          <label>Stock Quantity </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            className="form-input"
            value={productData.quantity}
            onChange={handleInputChange}
            required
          />

          <label>Country</label>
          <select
            id="country"
            name="country"
            className="form-input"
            value={productData.country}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Country</option>
            {countries.map((item) => (
              <option key={item.id} value={item.country_id}>
                {item.name}
              </option>
            ))}
          </select>

          <label>Made Of</label>
          <select
            id="made_of"
            name="made_of"
            className="form-input"
            value={productData.made_of}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Material</option>
            {madeOf.map((item) => (
              <option key={item.id} value={item.madeof_id}>
                {item.name}
              </option>
            ))}
          </select>

          <label>Stock Quantity</label>
          <input
            type="number"
            id="stock_quantity"
            name="stock_quantity"
            className="form-input"
            value={productData.stock_quantity}
            onChange={handleInputChange}
            required
          />

          <label>Product Image</label>
          <input
            type="file"
            id="image"
            name="image"
            className="form-input"
            accept="image/*"
            onChange={handleFileChange}
            required
          />

          <div className="form-actions">
            <button type="submit" className="save-btn">
            {isEdit ? "Update Product" : "Save Product"}
            </button>
            <button type="reset" className="cancel-btn" onClick={handleOnCancel} >
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default ProductForm;