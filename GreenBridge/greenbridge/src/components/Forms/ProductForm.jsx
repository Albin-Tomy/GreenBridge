import React, { useEffect, useState } from "react";
import config from "../../config/config";
import axios from "axios";
import "./forms.css";

const ProductForm = ({ onCancel, initialProductData, isEdit }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [countries, setCountries] = useState([]);
  const [madeOf, setMadeOf] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleOnCancel = () => {
    setProductData(null);
    onCancel();
  };

  useEffect(() => {
    if (initialProductData) {
      setProductData({
        name: initialProductData.name || "",
        description: initialProductData.description || "",
        price: initialProductData.price || "",
        quantity: initialProductData.quantity || 1,
        category: initialProductData.category || null,
        brand: initialProductData.brand || null,
        country: initialProductData.country || null,
        made_of: initialProductData.made_of || null,
        stock_quantity: initialProductData.stock_quantity || 1,
        image: initialProductData.image || null, // Image path
      });
    } else {
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
    }
  }, [initialProductData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity" && value < 0) {
      setError("Quantity cannot be negative");
    } else {
      setError("");
      setProductData({ ...productData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setProductData({ ...productData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (productData.quantity < 0) {
      setError("Quantity cannot be negative");
      return;
    }

    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    if (isEdit && (!initialProductData || !initialProductData.product_id)) {
      setError("Cannot edit product, product ID is missing.");
      return;
    }

    const request = isEdit
      ? axios.put(
          `https://albintomy.pythonanywhere.com/api/v1/products/update/${initialProductData.product_id}/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        )
      : axios.post(`https://albintomy.pythonanywhere.com/api/v1/products/create/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

    setLoading(true);
    request
      .then((response) => {
        alert(isEdit ? "Product updated successfully!" : "Product created successfully!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error processing request:", error);
        setError("An error occurred while processing the request.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(config.getCategoryApi)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    // axios
    //   .get(config.getBrandsApi)
    //   .then((response) => {
    //     setBrands(response.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching brands:", error);
    //   });

    // axios
    //   .get(config.getCountriesApi)
    //   .then((response) => {
    //     setCountries(response.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching countries:", error);
    //   });

    axios
      .get(config.getMadeofApis)
      .then((response) => {
        setMadeOf(response.data);
      })
      .catch((error) => {
        console.error("Error fetching 'made of':", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="form-container">
      <h3>{isEdit ? "Edit Product" : "Add New Product"}</h3>
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

          <label>Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            required
          />

          <label>Category</label>
          <select
            id="category"
            name="category"
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

          {/* <label>Brand</label>
          <select
            id="brand"
            name="brand"
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
          </select> */}

          <label>Price</label>
          <input
            type="text"
            id="price"
            name="price"
            value={productData.price}
            onChange={handleInputChange}
            required
          />

          <label> Quantity </label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            value={productData.quantity}
            onChange={handleInputChange}
            required
          />

          {/* <label>Country</label>
          <select
            id="country"
            name="country"
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
          </select> */}

          <label>Material</label>
          <select
            id="made_of"
            name="made_of"
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
            value={productData.stock_quantity}
            onChange={handleInputChange}
            required
          />

          {/* Display existing image if in edit mode */}
          {/* {isEdit && initialProductData && initialProductData.image && (
            <div className="current-image">
              <label>Current Image:</label>
              <img
                src={`https://albintomy.pythonanywhere.com${initialProductData.image}`} // Adjust URL if necessary
                alt="Product"
                style={{ width: "100px", height: "100px", objectFit: "cover" }} // You can adjust styles as needed
              />
            </div>
          )} */}
          {isEdit && initialProductData && initialProductData.image && (
            <div className="current-image">
              <label>Current Image:</label>
              <img
                src={`https://albintomy.pythonanywhere.com${initialProductData.image}`} // Adjust URL if necessary
                alt="Product"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            </div>
          )}

          {productData.image && typeof productData.image === "object" && (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(productData.image)}
                alt="Preview"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            </div>
          )}

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
              {isEdit ? "Update Product" : "Save Product"}
            </button>
            <button type="reset" className="cancel-btn" onClick={handleOnCancel}>
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default ProductForm;
