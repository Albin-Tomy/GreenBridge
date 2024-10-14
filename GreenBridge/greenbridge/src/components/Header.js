import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineSearch, AiFillHome, AiOutlineShoppingCart } from 'react-icons/ai';
import { FaBars, FaArrowLeft, FaArrowRight, FaHeart } from 'react-icons/fa';
import './Header.css';
import logo from '../assets/logo.png';
import axios from 'axios';
import { MdAccountCircle } from 'react-icons/md';

// Configure Axios interceptor for automatic logout on token expiration
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token is expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

// Dropdown component for profile menu
const Dropdown = ({ isOpen, toggleDropdown, handleLogout, username }) => (
  <div className="dropdown-container">
    <div className="dropbtn" onClick={toggleDropdown}>
      <MdAccountCircle size={30} />
      {username ? <span className="icon-label">{username}</span> : <span className="icon-label">Login</span>}
    </div>
    {isOpen && (
      <div className="dropdown-content">
        {username ? (
          <>
            <p className="dropdown-username">{username}</p>
            <Link to="/profile">Edit Profile</Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
            <Link to="/shgregister">Join the Community</Link>
          </>
        )}
      </div>
    )}
  </div>
);

// Main Header component
const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/auth/user_profiles/${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsername(response.data.first_name);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (userId && token) {
      fetchUserProfile();
    }
  }, [userId, token]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setUsername(null);
    navigate('/login');
  };

  const goToWishlist = () => {
    navigate('/wishlist');
  };

  // Navigate to the cart page
  const goToCart = () => {
    navigate('/cart');
  };

  const goBack = () => {
    navigate(-1);
  };

  const goForward = () => {
    navigate(1);
  };

  return (
    <>
      <header className="navbar">
        {/* Brand and Logo */}
        <div className="navbar-brands">
          <Link to="/" className="logo-containers">
            <img src={logo} alt="Logo" className="logos" />
          </Link>
          <h2 className="company-names">GreenBridge</h2>
        </div>

        {/* Right Section: Search, Profile, Wishlist, Cart */}
        <div className="right-section">
          {/* Search bar */}
          {/* <form className="search-bar">
            <button type="submit" className="search-icon">
              <AiOutlineSearch />
            </button>
            <input
              type="text"
              className="search-inputs"
              placeholder="Search products, brands"
              aria-label="Search products, brands"
            />
          </form> */}
          <form className="custom-search-bar">
  <button type="submit" className="custom-search-icon">
    <AiOutlineSearch />
  </button>
  <input
    type="text"
    className="custom-search-input"
    placeholder="Search products, brands"
    aria-label="Search products, brands"
  />
</form>

          {/* Home Icon */}
          <Link to="/" className="home-icon">
            <AiFillHome size={24} />
          </Link>

          {/* Icons: Profile, Wishlist, Cart */}
          <div className="icon-links">
            <Dropdown
              isOpen={isDropdownOpen}
              toggleDropdown={toggleDropdown}
              handleLogout={handleLogout}
              username={username}
            />
            {username && (
              <button onClick={goToWishlist} className="icon-linkss">
                <FaHeart />
                <span className="icon-label">Wishlist</span>
              </button>
            )}
            <button onClick={goToCart} className="icon-linkss">
              <AiOutlineShoppingCart size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <label htmlFor="nav-toggle" className="menu-icon">
          <FaBars />
        </label>
      </header>

      {/* Navigation buttons below the header in the right corner */}
      <div className="navigation-buttons">
        <button onClick={goBack} className="nav-button">
          <FaArrowLeft size={12} />
        </button>
        <button onClick={goForward} className="nav-button">
          <FaArrowRight size={12} />
        </button>
      </div>
    </>
  );
};

export default Header;
