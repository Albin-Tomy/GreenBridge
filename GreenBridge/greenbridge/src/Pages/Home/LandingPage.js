import React from 'react';
import './LandingPage.css';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';


const LandingPage = () => {
  return (
    <div>
        <Header/>
        <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to GreenBridge</h1>
          <p>Your one-stop solution for sustainable materials exchange.</p>
          <Link to="/learn-more">
            <button className="cta-button">Learn More</button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature">
          <h2>Eco-Friendly Products</h2>
          <p>Discover a wide range of environmentally friendly products.</p>
        </div>
        <div className="feature">
          <h2>Community Driven</h2>
          <p>Join a network of businesses committed to sustainability.</p>
        </div>
        <div className="feature">
          <h2>Innovative Solutions</h2>
          <p>Explore innovative ideas to reduce waste and improve recycling.</p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta">
        <h2>Ready to Make a Difference?</h2>
        <p>Sign up today and start contributing to a greener future.</p>
        <Link to="/signup">
          <button className="cta-button">Get Started</button>
        </Link>
      </section>
    </div>
    </div>
  );
};

export default LandingPage;
