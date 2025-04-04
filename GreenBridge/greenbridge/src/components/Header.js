import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineSearch, AiFillHome, AiOutlineShoppingCart } from 'react-icons/ai';
import { FaBars, FaArrowLeft, FaArrowRight, FaHeart,FaTimes } from 'react-icons/fa';
import './Header.css';
import logo from '../assets/logo.png';
import axios from 'axios';
import { MdAccountCircle } from 'react-icons/md';
import Notifications from './Notifications';
import { Google as GoogleIcon } from '@mui/icons-material';

// Configure Axios interceptor for automatic logout on token expiration
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

// Dropdown component for profile menu
const Dropdown = ({ isOpen, toggleDropdown, handleLogout, displayName, isLoggedIn }) => (
  <div className="dropdown-container">
    <div className="dropbtn" onClick={toggleDropdown}>
      <MdAccountCircle size={30} />
      <span className="icon-label">{displayName}</span>
    </div>
    {isOpen && (
      <div className="dropdown-content">
        {isLoggedIn ? (
          <>
            <p className="dropdown-username">{displayName}</p>
            <Link to="/user">Profile</Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Register</Link>
            <Link to="/shgregister">Join as SHG</Link>
            <Link to="/ngoregister">Join as NGO</Link>
          </>
        )}
      </div>
    )}
  </div>
);

// Main Header component
const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [displayName, setDisplayName] = useState("Login");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/v1/auth/user_profiles/${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const name = response.data.first_name || response.data.email || "User";
        setDisplayName(name);
        setIsLoggedIn(true); // User is logged in
      } catch (error) {
        if (error.response && error.response.status === 404) {
          navigate('/profile'); // Redirect to create profile page if not found
        } else {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    if (userId && token) {
      fetchUserProfile();
    } else {
      setIsLoggedIn(false); // User is not logged in
    }
  }, [userId, token, navigate]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setDisplayName("Login");
    setIsLoggedIn(false); // User is logged out
    navigate('/login');
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prevState => !prevState);
  };

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/products?search=${searchQuery}`);
  };

  const goToWishlist = () => {
    navigate('/wishlist');
  };

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
      <header className="navbars">
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
          <form className="search-bar" onSubmit={handleSearchSubmit} role="search" aria-label="Product Search">
            <label htmlFor="search-input" className="visually-hidden">Search products</label>
            <div className="search-input-wrapper">
              <input
                type="text"
                id="search-input"
                className="header-search-input"
                placeholder="Search products"
                aria-label="Search products"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
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
              displayName={displayName} // Pass display name to Dropdown
              isLoggedIn={isLoggedIn} // Pass login state to Dropdown
            />
            {isLoggedIn && ( // Show Wishlist and Cart only if logged in
              <>
                <button onClick={goToWishlist} className="icon-linkss">
                  <FaHeart />
                  <span className="icon-label">Wishlist</span>
                </button>
                <button onClick={goToCart} className="icon-linkss">
                  <AiOutlineShoppingCart size={24} />
                </button>
              </>
            )}
            {isLoggedIn && <Notifications />}
          </div>
        </div>

        {/* Mobile Menu Icon */}
        {/* <label htmlFor="nav-toggle" className="menu-icon">
          <FaBars />
        </label> */}
        {/* Mobile Menu Icon */}
      <label 
        htmlFor="nav-toggle" 
        className="menu-icon" 
        onClick={toggleMobileMenu}
        aria-expanded={isMobileMenuOpen}
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </label>

      {/* Mobile Navigation Menu */}
      <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : 'closed'}`}>
        <ul>
          <li><a href="/userorder" onClick={toggleMobileMenu}>My Orders</a></li>
          <li><a href="/products" onClick={toggleMobileMenu}>Products</a></li>
          <li><a href="/profile" onClick={toggleMobileMenu}>User Profile</a></li>
          <li><a href="/service-request" onClick={toggleMobileMenu}>Service Request</a></li>
          <li><a href="/volunteer-registration" onClick={toggleMobileMenu}>Volunteer Registration</a></li>
          <li><a href="/volunteer/profile" onClick={toggleMobileMenu}>Volunteer Profile</a></li>
          <li><a href="/volunteer/dashboard" onClick={toggleMobileMenu}>Volunteer Dashboard</a></li>
          <li><a href="/userview" onClick={toggleMobileMenu}>View Request</a></li>
        </ul>
      </nav>
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
