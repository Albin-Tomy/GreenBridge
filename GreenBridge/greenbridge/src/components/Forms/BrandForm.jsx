import React, { useState,useEffect } from 'react';
import './forms.css';
import axios from 'axios';

const AddBrandForm = ({onCancel,initialBrandData,isEdit}) => {
  const [brandData, setBrandData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (initialBrandData) {
      setBrandData({
        name: initialBrandData.name,
        description: initialBrandData.description,
      });
    }
  }, [initialBrandData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBrandData({ ...brandData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Brand data:', brandData);
    const formData = new FormData();
    Object.keys(brandData).forEach((key) => {
      formData.append(key, brandData[key]);
    });

    if (isEdit) {
      // Update 
      axios
        .put(
          `http://127.0.0.1:8000/api/v1/products/brand-update/${initialBrandData.brand_id}/`,
          formData,
          {}
        )
        .then((response) => {
          alert("Brand updated successfully!");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error updating Brand:", error.response.data);
        });
    } else {
    axios.post("http://127.0.0.1:8000/api/v1/products/brand-create/",formData)
    .then((res)=>{
      alert("Brand Added !")
      window.location.reload()

    })
    .catch((err)=>{
      console.log(err)
    })
  }
  };


  return (
    <div className="form-container">
      <h3>{isEdit?'Edit Category' :'Add New Category'}</h3>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div className="heads">
            <span>Category Details</span>
          </div>
          
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={brandData.name}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={brandData.description}
            onChange={handleInputChange}
            required
          />

          <div className="form-actions">
            <button type="submit" className="save-btn">{isEdit?'Update':'Save'} </button>
            <button type="reset" className="cancel-btn" onClick={onCancel}>Cancel</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default AddBrandForm;