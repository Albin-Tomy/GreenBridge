import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import { GoHeart } from 'react-icons/go';
import { IoBagHandleOutline } from 'react-icons/io5';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaBars } from 'react-icons/fa';
import './Navbar.css'; // Ensure you have this file in your project
import logo from '../assets/logo.png'; // Ensure you have the logo image in this path


// Dropdown component for profile menu
const Dropdown = ({ isOpen, toggleDropdown, handleLogout, username }) => (
  <div className="dropdown-container">
    <div className="dropbtn" onClick={toggleDropdown}>
      <CgProfile size={24} />
      {/* Always show 'Profile' beside the icon, username will be inside the dropdown */}
      <span className="icon-label"></span>
    </div>
    {isOpen && (
      <div className="dropdown-content">
        {username ? (
          <>
            <p className="dropdown-username">{username}</p> {/* Username inside dropdown */}
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
  const [username, setUsername] = useState(null); // State to store the user's name
  const navigate = useNavigate();

  // Fetch the logged-in user's name from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Assuming user info is stored as JSON
    if (user && user.email) {
      setUsername(user.email); // Set username
    }
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove JWT token
    localStorage.removeItem('user'); // Clear user data
    setUsername(null); // Clear the username state
    navigate('/');
  };

  return (
    <header className="headers">
      {/* Brand and Logo */}
      <div className="navbar-brand">
        <Link to="/" className="logo-containers">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <h2 className="company-name">GreenBridge</h2>
      </div>

      {/* Navigation Menu */}
      <nav className={`nav`}>
        <ol>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ol>
      </nav>

      {/* Right Section: Search, Profile, Wishlist, Cart */}
      <div className="right-section">
        {/* Search bar */}
        <form className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search products, brands"
          />
          <button type="submit" className="search-icon">
            <AiOutlineSearch />
          </button>
        </form>

        {/* Icons: Profile, Wishlist, Bag */}
        <div className="icon-links">
          <Dropdown
            isOpen={isDropdownOpen}
            toggleDropdown={toggleDropdown}
            handleLogout={handleLogout}
            username={username} // Pass the username to the dropdown
          />
          <Link to="/cart" className="icon-link">
            <IoBagHandleOutline />
            <span className="icon-label">Bag</span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Icon */}
      <label htmlFor="nav-toggle" className="menu-icon">
        <FaBars />
      </label>
    </header>
  );
};

export default Header;
