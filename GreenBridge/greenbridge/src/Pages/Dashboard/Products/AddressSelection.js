import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './address.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../../components/Header';
import { useNavigate } from 'react-router-dom';

const AddressSelection = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    address_line1: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  });
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [cartSummaryVisible, setCartSummaryVisible] = useState(false); // State for cart summary visibility
  const [errors, setErrors] = useState({});
  const BASE_URL = 'http://127.0.0.1:8000';
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (userId) {
        // Fetch user profile details
        axios.get(`${BASE_URL}/api/v1/auth/user_profiles/${userId}/`)
            .then(response => setUserProfile(response.data))
            .catch(error => console.error('Error fetching user profile:', error));

        // Fetch user addresses
        axios.get(`${BASE_URL}/api/v1/orders/address-list/?user_id=${userId}`)
            .then(response => {
                // Ensure addresses belong to the logged-in user
                const userAddresses = response.data.filter(address => address.user_id === parseInt(userId));
                setAddresses(userAddresses);
            })
            .catch(error => console.error('Error fetching addresses:', error));
    } else {
        console.error('User ID not found in localStorage');
    }
}, []);


  // Function to fetch cart items
  const fetchCartItems = () => {
    const userId = localStorage.getItem('userId');
    axios.get(`${BASE_URL}/api/v1/orders/cart-items/?user_id=${userId}`)
      .then(response => {
        setCartItems(response.data);
        calculateTotal(response.data);
      })
      .catch(error => console.error('Error fetching cart items:', error));
  };

  // Calculate the total price based on cart items
  const calculateTotal = (items) => {
    const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const shipping = 100; // Flat shipping rate for simplicity
    setTotal(subtotal + shipping);
  };

  const updateQuantity = (id, newQuantity, stock) => {
    if (newQuantity < 1) return;  // Prevent quantity from going below 1
    if (newQuantity > stock) {  // Prevent quantity from exceeding stock
      toast.error('Quantity cannot exceed available stock!');  // Display toast message
      return;
    }

    axios.patch(`${BASE_URL}/api/v1/orders/cart-items-detail/${id}/`, { quantity: newQuantity })
      .then(response => {
        const updatedItems = cartItems.map(item => 
          item.cart_item_id === id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
        toast.success('Quantity updated successfully!');  // Display success toast
      })
      .catch(error => console.error('Error updating quantity:', error));
  };

  // Remove an item from the cart
  const removeItem = (id) => {
    axios.delete(`${BASE_URL}/api/v1/orders/cart-items-detail/${id}/`)
      .then(() => {
        const updatedItems = cartItems.filter(item => item.cart_item_id !== id);
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
        toast.info('Item removed from the cart!');  // Display removal toast
      })
      .catch(error => console.error('Error removing item:', error));
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId);
    toast.success('Address selected for delivery!');
    fetchCartItems(); // Fetch cart items when an address is selected
  };

  const countryOptions = {
    India: [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
      'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
      'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
      'Uttarakhand', 'West Bengal'
    ],
    USA: [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
      'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois',
      'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
      'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
      'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
      'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
      'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah',
      'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ],
    Canada: [
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
      'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island',
      'Quebec', 'Saskatchewan'
    ],
    Australia: [
      'New South Wales', 'Victoria', 'Queensland', 'Western Australia',
      'South Australia', 'Tasmania', 'Northern Territory', 'Australian Capital Territory'
    ],
    Germany: [
      'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg',
      'Hesse', 'Lower Saxony', 'Mecklenburg-Vorpommern', 'North Rhine-Westphalia',
      'Rhineland-Palatinate', 'Saarland', 'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein',
      'Thuringia'
    ],
    UnitedKingdom: [
      'England', 'Scotland', 'Wales', 'Northern Ireland'
    ],
    France: [
      'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Brittany', 'Centre-Val de Loire',
      'Corsica', 'Grand Est', 'Hauts-de-France', 'Île-de-France', 'Normandy',
      'Nouvelle-Aquitaine', 'Occitanie', 'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur'
    ]
    // Add more countries and states as needed
  };
  const [states, setStates] = useState([]);

  // const handleNewAddressChange = (e) => {
  //   setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  // };
  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });

    // If country changes, update states list and reset the selected state
    if (name === 'country') {
      setStates(countryOptions[value] || []);
      setNewAddress({ ...newAddress, country: value, state: '' }); // Reset state
    }
  };

  const validateAddress = () => {
    const validationErrors = {};
  
    // Check required fields
    if (!newAddress.address_line1) validationErrors.address_line1 = 'Address Line 1 is required';
    if (!newAddress.city) validationErrors.city = 'City is required';
    if (!newAddress.state) validationErrors.state = 'State is required';
    if (!newAddress.country) validationErrors.country = 'Country is required';
    
    // Validate pincode
    if (!newAddress.pincode) {
      validationErrors.pincode = 'Pincode is required';
    } else if (!validatePincode(newAddress.pincode)) {
      validationErrors.pincode = 'Pincode must be a 6-digit number';
    }
  
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };
  
  // Pincode validation function
  const validatePincode = (pincode) => /^[0-9]{6}$/.test(pincode);
  
  const handleAddOrUpdateAddress = () => {
    if (!validateAddress()) return;

    const userId = localStorage.getItem('userId');
    if (editingAddressId) {
      // Update existing address
      axios.put(`${BASE_URL}/api/v1/orders/addresses/${editingAddressId}/update/`, { ...newAddress, user_id: userId })
        .then(response => {
          const updatedAddresses = addresses.map(address =>
            address.address_id === editingAddressId ? response.data : address
          );
          setAddresses(updatedAddresses);
          toast.success('Address updated successfully!');
          resetForm();
        })
        .catch(error => {
          console.error('Error updating address:', error);
          toast.error('Failed to update address.');
        });
    } else {
      // Add new address
      axios.post(`${BASE_URL}/api/v1/orders/addresses/create/`, { ...newAddress, user_id: userId })
        .then(response => {
          setAddresses([...addresses, response.data]);
          toast.success('Address added successfully!');
          resetForm();
        })
        .catch(error => {
          console.error('Error adding new address:', error);
          toast.error('Failed to add address.');
        });
    }
  };

  const handleEditAddress = (id) => {
    const addressToEdit = addresses.find(address => address.address_id === id);
    if (addressToEdit) {
      setNewAddress({
        address_line1: addressToEdit.address_line1,
        city: addressToEdit.city,
        state: addressToEdit.state,
        country: addressToEdit.country,
        pincode: addressToEdit.pincode,
      });
      setEditingAddressId(id);
      setShowAddressForm(true); // Show address form when editing
    }
  };

  const handleDeleteAddress = (id) => {
    axios.delete(`${BASE_URL}/api/v1/orders/addresses/${id}/delete/`)
      .then(() => {
        const updatedAddresses = addresses.filter(address => address.address_id !== id);
        setAddresses(updatedAddresses);
        toast.info('Address deleted successfully!');
      })
      .catch(error => console.error('Error deleting address:', error));
  };



  const resetForm = () => {
    setNewAddress({
      address_line1: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
    });
    setEditingAddressId(null);
    setShowAddressForm(false); // Reset address form visibility
  };

  const handleContinue = () => {
    if (selectedAddress) {
      toast.info('Proceeding to payment!');
      navigate('/payment', { state: { selectedAddress, total } });
    } else {
      toast.error('Please select a delivery address.');
    }
  };

  return (
    <div>
      <Header></Header>
    <div className="address-selection-page">
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <h2>Select Delivery Address</h2>
      
      {userProfile && (
        <div className="user-profile">
          <h3>User Profile</h3>
          <p>Name: {userProfile.first_name} {userProfile.last_name}</p>
          <p>Phone: {userProfile.phone}</p>
        </div>
      )}

      <div className="saved-addresses">
  {addresses.length > 0 ? (
    addresses.map(address => (
      <div
        key={address.address_id}
        className={`address-item ${selectedAddress === address.address_id ? 'selected' : ''}`}
        onClick={() => handleAddressSelect(address.address_id)}
      >
        <p>{address.address_line1}, {address.city}, {address.state}, {address.country}, {address.pincode}</p>
        <button className="address-edit-btn" onClick={(e) => { e.stopPropagation(); handleEditAddress(address.address_id); }}><FaEdit /></button>
        <button className="address-delete-btn" onClick={(e) => { e.stopPropagation(); handleDeleteAddress(address.address_id); }}><FaTrash /></button>
      </div>
    ))
  ) : (
    <p>No addresses found. Please add one.</p>
  )}
</div>


      {/* Deliver Here Button positioned below the selected address */}
      {selectedAddress && (
        <div className="deliver-here-section">
          <button className="deliver-here-btn" onClick={() => setCartSummaryVisible(true)}>
            Deliver Here
          </button>
        </div>
      )}

      {/* Add New Address Section */}
      <h3>{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
      <button className={`toggle-address-form ${showAddressForm ? 'active' : ''}`} onClick={() => setShowAddressForm(prev => !prev)}>
        {showAddressForm ? 'Hide Address Form' : 'Add New Address'}
      </button>

      {showAddressForm && (
        <div className="new-address-form">
          <input
            type="text"
            name="address_line1"
            placeholder="Address Line 1"
            value={newAddress.address_line1}
            onChange={handleNewAddressChange}
          />
          {errors.address_line1 && <p className="error">{errors.address_line1}</p>}
          
          <input
            type="text"
            name="city"
            placeholder="City"
            value={newAddress.city}
            onChange={handleNewAddressChange}
          />
          {errors.city && <p className="error">{errors.city}</p>}
          
          <select
        name="country"
        value={newAddress.country}
        onChange={handleNewAddressChange}
      >
        <option value="">Select Country</option>
        {Object.keys(countryOptions).map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
      {errors.country && <p className="error">{errors.country}</p>}

      <select
        name="state"
        value={newAddress.state}
        onChange={handleNewAddressChange}
        disabled={!newAddress.country}
      >
        <option value="">Select State</option>
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
          {errors.country && <p className="error">{errors.country}</p>}
          
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={newAddress.pincode}
            onChange={handleNewAddressChange}
          />
          {errors.pincode && <p className="error">{errors.pincode}</p>}
          
          <button className="submit-btn" onClick={handleAddOrUpdateAddress}>
            {editingAddressId ? 'Update Address' : 'Add Address'}
          </button>
        </div>
      )}

      {/* Cart Summary */}
            {cartItems.length > 0 && (
        <div className="cart-items-section">
          {cartSummaryVisible && (
            <>
              <h3>Your Cart Items</h3>
              {cartItems.length > 0 ? (
              cartItems.map(item => (
                <div className="cart-item" key={item.cart_item_id}>
                  <img
                    src={item.product.image ? `${BASE_URL}${item.product.image}` : 'https://via.placeholder.com/150'}
                    alt={item.product.name}
                    className="cart-product-image"
                  />
                  <div className="item-details">
                    <h4 className="item-name">{item.product.name}</h4>
                    <p className="item-price">Price: <span className="price-amount">₹ {item.product.price}</span></p>
                    <p className="item-quantity">Quantity: <span className="quantity-amount">{item.quantity}</span></p>
                    <div className="quantity-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1, item.product.stock_quantity)}
                        disabled={item.quantity <= 1}  // Disable if quantity is 1
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1, item.product.stock_quantity)}
                        disabled={item.quantity >= item.product.stock_quantity}  // Disable if quantity equals stock
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button className="cart-remove-btn" onClick={() => removeItem(item.cart_item_id)}>
                    <FaTrash />
                  </button>
                </div>
              ))
            ) : (
              <p>Your cart is empty</p>
            )
            }
              <div className="cart-summary">
                <h4 className="summary-total">Total: <span className="summary-amount">₹ {total}</span></h4>
                <button className="confirm-delivery-btn" onClick={handleContinue}>Continue</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default AddressSelection;
