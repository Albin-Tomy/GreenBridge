import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header'; // Import Header component
import './LandingPage.css';
import shg from '../../assets/shg.png';
import shgproduct from '../../assets/aaranmula.jpeg';
import shgtraining from '../../assets/shgtraining.jpeg';
import wastecollection from '../../assets/waste1.jpeg';
import waste from '../../assets/wastwcollection.jpeg';
import sweet from '../../assets/honey.jpg';
import hanticraft from '../../assets/hanticraft.jpeg';
import furniture from '../../assets/furniture.jpg';
import utensils from '../../assets/utensils.jpeg'
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();


  const goToProducts = () => {
    navigate('/products');
  };
  return (
    <div className="landing-page-body">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
      <div className="hero-image">
          <img src={shg} alt="Empowering Communities" />
        </div>
        <div className="hero-content">
          <h2>Empowering Self Help Groups for a Better Future</h2>
          <p>Together, we enable communities to thrive by providing tools, resources, and opportunities to SHGs. Explore our services and join the movement.</p>
          <button onClick={goToProducts} >
                <span className="contact-btns">Explore Now</span>
              </button>
        </div>
        
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <h2>Our Key Services</h2>
        <div className="service-cards-container">
          <div className="service-card">
            <img src={shgproduct} alt="SHG Products" />
            <h3>Product Manufacturing</h3>
            <p>We offer SHGs the platform to manufacture and sell their products, supporting economic growth in communities.</p>
          </div>
          <div className="service-card">
            <img src={shgtraining} alt="Training Programs" />
            <h3>Training & Development</h3>
            <p>Extensive training programs for SHGs to enhance skills, from product development to marketing and sales strategies.</p>
          </div>
          <div className="service-card">
            <img src={wastecollection} alt="Waste Collection Services" />
            <h3>Waste Collection Services</h3>
            <p>We contribute to environmental sustainability through our community-driven waste collection services.</p>
            <Link to="/waste-collection" className="waste-btn">Request Waste Collection</Link>
          </div>
        </div>
      </section>

      {/* Waste Collection Section */}
      <section id="waste-collection" className="waste-collection-section">
        <h2>Request Waste Collection Services</h2>
        <p>Our waste collection services are designed to help communities manage waste responsibly. Partner with us for a cleaner environment.</p>
        <Link to="/waste-collection-form" className="waste-service-btn">Proceed to Waste Collection Form</Link>
        <div className="waste-image-container">
          <img src={waste} alt="Waste Collection Truck" />
        </div>
      </section>

      {/* Product Categories Section */}
      <section id="products" className="products-section">
        <h2>Product Categories</h2>
        <div className="product-grid">
          <div className="product-card">
            <img src={sweet} alt="Sweets" />
            <h3>Sweets</h3>
            <p>Explore a range of traditional and modern sweets crafted by SHGs.</p>
            <Link to="/products/sweets" className="view-category-btn">View Sweets</Link>
          </div>
          <div className="product-card">
            <img src={hanticraft} alt="Handicrafts" />
            <h3>Handicrafts</h3>
            <p>Beautiful handmade items from local artisans, perfect for gifting and decor.</p>
            <Link to="/products/handicrafts" className="view-category-btn">View Handicrafts</Link>
          </div>
          <div className="product-card">
            <img src={furniture} alt="Furniture" />
            <h3>Furniture</h3>
            <p>Explore our range of sustainable and handcrafted furniture pieces.</p>
            <Link to="/products/furniture" className="view-category-btn">View Furniture</Link>
          </div>
          <div className="product-card">
            <img src={utensils} alt="Utensils" />
            <h3>Utensils</h3>
            <p>Browse a collection of eco-friendly and durable kitchen utensils.</p>
            <Link to="/products/utensils" className="view-category-btn">View Utensils</Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <h2>Get in Touch</h2>
        <p>We’d love to hear from you! Whether you're interested in partnering with us or have any questions, feel free to reach out.</p>
        <Link to="/contact" className="contact-btn">Contact Us</Link>
      </section>

      {/* Footer */}
      <footer className="footer-container">
        <div className="footer-content">
          <p>&copy; 2024 SHG Platform. All Rights Reserved.</p>
          <ul className="footer-nav">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Our Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
