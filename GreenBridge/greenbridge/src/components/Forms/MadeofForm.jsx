// import React, { useState,useEffect } from 'react';
// import './forms.css';
// import axios from "axios";

// const AddMadeofForm = ({onCancel,initialMadeOfData,isEdit}) => {
//   const [madeOfData, setMadeOfData] = useState({
//     name: '',
//     description: '',
//   });

//   useEffect(() => {
//     if (initialMadeOfData) {
//       setMadeOfData({
//         name: initialMadeOfData.name,
//         description: initialMadeOfData.description,
//       });
//     }
//   }, [initialMadeOfData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setMadeOfData({ ...madeOfData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Materials data:', madeOfData);
//     const formData = new FormData();
//     Object.keys(madeOfData).forEach((key) => {
//       formData.append(key, madeOfData[key]);
//     });
//     if (isEdit) {
//       // Update
//       axios
//         .put(
//           `http://127.0.0.1:8000/api/v1/products/madeof-update/${initialMadeOfData.madeof_id}/`,
//           formData,
//           {}
//         )
//         .then((response) => {
//           alert("Materials updated successfully!");
//           window.location.reload();
//         })
//         .catch((error) => {
//           console.error("Error updating modeof:", error.response.data);
//         });
//     } else {
//     axios.post("http://127.0.0.1:8000/api/v1/products/madeof-create/",formData)
//     .then((res)=>{
//       alert("Material Added !")
//       window.location.reload()

//     })
//     .catch((err)=>{
//       console.log(err)
//     })
//   }
//   };

//   return (
//     <div className="form-container">
//       <h3>{isEdit?'Edit Materials':'Add New Materials'}</h3>
//       <form onSubmit={handleSubmit}>
//         <fieldset>
//           <div className="heads">
//             <span>Category Details</span>
//           </div>
          
//           <label htmlFor="name">Name</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={madeOfData.name}
//             onChange={handleInputChange}
//             required
//           />

//           <label htmlFor="description">Description</label>
//           <input
//             type="text"
//             id="description"
//             name="description"
//             value={madeOfData.description}
//             onChange={handleInputChange}
//             required
//           />

//           <div className="form-actions">
//             <button type="submit" className="save-btn">{isEdit?'Update':'Save'} </button>
//             <button type="reset" className="cancel-btn" onClick={onCancel}>Cancel</button>
//           </div>
//         </fieldset>
//       </form>
//     </div>
//   );
// };

// export default AddMadeofForm;
import React, { useState, useEffect } from 'react';
import './forms.css';
import axios from 'axios';

const AddMadeofForm = ({ onCancel, initialMadeOfData, isEdit }) => {
  const [madeOfData, setMadeOfData] = useState({
    name: '',
    description: '',
  });

  const [existingNames, setExistingNames] = useState([]); // To store existing material names
  const [error, setError] = useState(''); // To store validation error

  useEffect(() => {
    if (initialMadeOfData) {
      setMadeOfData({
        name: initialMadeOfData.name,
        description: initialMadeOfData.description,
      });
    }
  }, [initialMadeOfData]);

  // Fetch existing materials on component mount
  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/v1/products/madeof-list/')
      .then((response) => {
        const names = response.data.map((item) => item.name.toLowerCase());
        setExistingNames(names); // Store the names in state
      })
      .catch((error) => {
        console.error('Error fetching materials:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMadeOfData({ ...madeOfData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Check if the name already exists (case insensitive)
    if (!isEdit && existingNames.includes(madeOfData.name.toLowerCase())) {
      setError('A material with the same name already exists.');
      return;
    }

    console.log('Materials data:', madeOfData);
    const formData = new FormData();
    Object.keys(madeOfData).forEach((key) => {
      formData.append(key, madeOfData[key]);
    });

    if (isEdit) {
      // Update existing material
      axios
        .put(
          `http://127.0.0.1:8000/api/v1/products/madeof-update/${initialMadeOfData.madeof_id}/`,
          formData,
          {}
        )
        .then((response) => {
          alert('Materials updated successfully!');
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error updating material:', error.response.data);
        });
    } else {
      // Create new material
      axios
        .post('http://127.0.0.1:8000/api/v1/products/madeof-create/', formData)
        .then((res) => {
          alert('Material Added!');
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="form-container">
      <h3>{isEdit ? 'Edit Materials' : 'Add New Materials'}</h3>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <div className="heads">
            <span>Material Details</span>
          </div>

          {error && <div className="error-message">{error}</div>} {/* Display error if exists */}

          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={madeOfData.name}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={madeOfData.description}
            onChange={handleInputChange}
            required
          />

          <div className="form-actions">
            <button type="submit" className="save-btn">
              {isEdit ? 'Update' : 'Save'}
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

export default AddMadeofForm;
