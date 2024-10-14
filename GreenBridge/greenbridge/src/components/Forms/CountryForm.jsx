import React, { useState,useEffect } from "react";
import "./forms.css";
import axios from "axios";

const AddCountryForm = ({ onCancel, initialCountryData, isEdit }) => {
  const [countryData, setCountryData] = useState({
    name: "",
    description: "",
  });

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Country data:", countryData);
    const formData = new FormData();
    Object.keys(countryData).forEach((key) => {
      formData.append(key, countryData[key]);
    });

    if (isEdit) {
      // Update
      axios
        .put(
          `http://127.0.0.1:8000/api/v1/products/country-update/${initialCountryData.country_id}/`,
          formData,
          {}
        )
        .then((response) => {
          alert("Country updated successfully!");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error updating country:", error.response.data);
        });
    } else {
      axios
        .post("http://127.0.0.1:8000/api/v1/products/country-create/", formData)
        .then((res) => {
          alert("Country Added !");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="form-container">
      <h3> {isEdit ? "Edit Country" : "Add New Country"} </h3>
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