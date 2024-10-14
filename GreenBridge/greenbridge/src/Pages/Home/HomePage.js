import React from 'react';
import './homepage.css'; // Import the CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesome icons
import { faRecycle, faBroom } from '@fortawesome/free-solid-svg-icons'; 
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const HomePage = () => {
  return (
    <div>
      {/* Header */}

      {/* Hero Section */}
      <section className="heroin">
        <div className="hero-content">
          <h1>Welcome to Our Store</h1>
          <p>Discover products and services tailored to your needs.</p>
          <button className="shop-now-btn">Shop Now</button>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            {/* Waste Collection Service */}
            <div className="service-card">
              <FontAwesomeIcon icon={faRecycle} />
              <h3>Waste Collection</h3>
              <p>We provide efficient and eco-friendly waste collection services to help keep your community clean.</p>
            </div>
            {/* Cleaning Service */}
            <div className="service-card">
              <FontAwesomeIcon icon={faBroom} />
              <h3>Cleaning Services</h3>
              <p>Professional cleaning services for homes, offices, and public spaces to maintain hygiene and cleanliness.</p>
            </div>
            {/* Recycling Service */}
            <div className="service-card">
              <FontAwesomeIcon icon={faRecycle} />
              <h3>Recycling</h3>
              <p>Comprehensive recycling services to reduce waste and promote sustainability in your environment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {/* Product Card */}
            <div className="product-card">
              <img src="https://via.placeholder.com/200" alt="Product 1" />
              <h3>Product Name 1</h3>
              <p className="price">₹ 999</p>
            </div>
            {/* Product Card */}
            <div className="product-card">
              <img src="https://via.placeholder.com/200" alt="Product 2" />
              <h3>Product Name 2</h3>
              <p className="price">₹ 1999</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-us">
        <div className="container">
          <h2>About Us</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget libero eget lorem lacinia cursus non ut magna.</p>
          <button className="learn-more-btn">Learn More</button>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <p>&copy; 2024 BrandLogo. All rights reserved.</p>
            <ul className="social-icons">
              <li><a href="#"><FontAwesomeIcon icon={faFacebookF} /></a></li>
              <li><a href="#"><FontAwesomeIcon icon={faTwitter} /></a></li>
              <li><a href="#"><FontAwesomeIcon icon={faInstagram} /></a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
