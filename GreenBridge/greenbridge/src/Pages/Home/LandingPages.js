import React from 'react';
import './Landing.css'; // Import the CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle, faLeaf, faBroom } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const LandingPage = () => {
  return (
    <div>
      {/* Header */}

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Solutions for a Cleaner, Greener World</h1>
          <p>Your trusted partner for waste collection, recycling, and more.</p>
          <button className="cta-btn">Get Started</button>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            {/* Waste Collection */}
            <div className="service-card">
              <FontAwesomeIcon icon={faRecycle} />
              <h3>Waste Collection</h3>
              <p>Eco-friendly waste collection for communities and businesses.</p>
            </div>
            {/* Recycling */}
            <div className="service-card">
              <FontAwesomeIcon icon={faLeaf} />
              <h3>Recycling</h3>
              <p>Environmentally responsible recycling services to reduce waste.</p>
            </div>
            {/* Cleaning */}
            <div className="service-card">
              <FontAwesomeIcon icon={faBroom} />
              <h3>Cleaning Services</h3>
              <p>Comprehensive cleaning solutions for a healthy environment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            <div className="product-card">
              <img src="https://via.placeholder.com/200" alt="Product 1" />
              <h3>Product Name 1</h3>
              <p className="price">₹ 999</p>
            </div>
            <div className="product-card">
              <img src="https://via.placeholder.com/200" alt="Product 2" />
              <h3>Product Name 2</h3>
              <p className="price">₹ 1999</p>
            </div>
            <div className="product-card">
              <img src="https://via.placeholder.com/200" alt="Product 3" />
              <h3>Product Name 3</h3>
              <p className="price">₹ 1499</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2>What Our Clients Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p>"Excellent waste collection services! Always timely and professional."</p>
              <h4>John Doe</h4>
            </div>
            <div className="testimonial-card">
              <p>"Their recycling initiatives helped reduce our waste and save costs."</p>
              <h4>Jane Smith</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact">
        <div className="container">
          <h2>Contact Us</h2>
          <p>If you have any questions, feel free to reach out to us.</p>
          <button className="contact-btn">Contact Now</button>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <p>&copy; 2024 BrandLogo. All rights reserved.</p>
          <ul className="social-icons">
            <li><a href="#"><FontAwesomeIcon icon={faFacebookF} /></a></li>
            <li><a href="#"><FontAwesomeIcon icon={faTwitter} /></a></li>
            <li><a href="#"><FontAwesomeIcon icon={faInstagram} /></a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
