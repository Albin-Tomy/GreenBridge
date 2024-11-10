import React, { useState, useEffect } from "react";
import "./forms.css";
import axios from "axios";

const AddCountryForm = ({ onCancel, initialCountryData, isEdit }) => {
  const [countryData, setCountryData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialCountryData) {
      setCountryData({
        name: initialCountryData.name,
        description: initialCountryData.description,
      });
    }
  }, [initialCountryData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCountryData({ ...countryData, [name]: value });
    setError(""); // Clear the error when user starts typing
  };

  const checkCountryExists = async (name) => {
    try {
      // Make an API call to check if the country name already exists
      const response = await axios.get("https://albintomy.pythonanywhere.com/api/v1/products/country-list/");
      const existingCountries = response.data.map((country) => country.name.toLowerCase());
      return existingCountries.includes(name.toLowerCase());
    } catch (error) {
      console.error("Error checking country existence:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check if the country name is unique
    const countryExists = await checkCountryExists(countryData.name);
    if (countryExists) {
      setError("A country with this name already exists.");
      return;
    }

    const formData = new FormData();
    Object.keys(countryData).forEach((key) => {
      formData.append(key, countryData[key]);
    });

    const request = isEdit
      ? axios.put(
          `https://albintomy.pythonanywhere.com/api/v1/products/country-update/${initialCountryData.country_id}/`,
          formData
        )
      : axios.post("https://albintomy.pythonanywhere.com/api/v1/products/country-create/", formData);

    request
      .then((response) => {
        alert(isEdit ? "Country updated successfully!" : "Country added successfully!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error processing request:", error);
        setError("An error occurred while processing the request.");
      });
  };

  return (
    <div className="form-container">
      <h3>{isEdit ? "Edit Country" : "Add New Country"}</h3>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div className="heads">
            <span>Country Details</span>
          </div>

          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={countryData.name}
            onChange={handleInputChange}
            required
          />
          {error && <p className="error-message">{error}</p>}

          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={countryData.description}
            onChange={handleInputChange}
            required
          />

          <div className="form-actions">
            <button type="submit" className="save-btn">
              {isEdit ? "Update" : "Save"}
            </button>
            <button type="reset" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default AddCountryForm;
