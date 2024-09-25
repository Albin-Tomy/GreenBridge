import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import { GoHeart } from 'react-icons/go';
import { IoBagHandleOutline } from 'react-icons/io5';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaBars } from 'react-icons/fa';
import './Header.css'; // Import your CSS file
import logo from '../assets/logo.png'; // Import your logo

// Dropdown component for profile menu
const Dropdown = ({ isOpen, toggleDropdown }) => (
  <div className="dropdown-container">
    <div className="dropbtn" onClick={toggleDropdown}>
      <CgProfile size={24} />
      <span className="icon-label">Profile</span>
    </div>
    {isOpen && (
      <div className="dropdown-content">
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/shgregister">Join the Community</Link>
      </div>
    )}
  </div>
);

// Main Header component
const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="navbar">
      {/* Brand and Logo */}
      <div className="navbar-brand">
        <Link to="/" className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          <h2 className="company-name">GreenBridge</h2>
        </Link>
      </div>

      {/* Navigation Menu */}
      <input type="checkbox" id="nav-toggle" className="nav-toggle" />
      <nav className={`nav ${isMobileMenuOpen ? 'active' : ''}`}>
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
          <Dropdown isOpen={isDropdownOpen} toggleDropdown={toggleDropdown} />
          <Link to="/wishlist" className="icon-link">
            <GoHeart />
            <span className="icon-label">Wishlist</span>
          </Link>
          <Link to="/cart" className="icon-link">
            <IoBagHandleOutline />
            <span className="icon-label">Bag</span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Icon */}
      <label htmlFor="nav-toggle" className="menu-icon" onClick={toggleMobileMenu}>
        <FaBars />
      </label>
    </header>
  );
};

export default Header;
