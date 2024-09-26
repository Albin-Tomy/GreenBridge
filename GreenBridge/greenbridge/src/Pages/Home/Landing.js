import React from 'react';
import './Landing.css';
import Header from '../../components/Header'; // Assuming you have a Header component

const Landing = () => {
  return (
    <div>
      {/* Importing header */}
      <Header />

      {/* Hero Section */}
      <div className="landing-container">
        <div className="overlay">
          <header className="landing-header">
            <h1>Welcome to Our Platform</h1>
            <p>Empowering communities through innovation and collaboration</p>
            <div className="cta-buttons">
              <button className="btn-primary">Get Started</button>
              <button className="btn-secondary">Learn More</button>
            </div>
          </header>
        </div>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <img src="https://via.placeholder.com/300" alt="Feature 1" />
            <h3>Innovative Solutions</h3>
            <p>We provide innovative tools and resources to empower SHGs.</p>
          </div>
          <div className="feature-item">
            <img src="https://via.placeholder.com/300" alt="Feature 2" />
            <h3>Community Driven</h3>
            <p>Our platform is designed for community growth and collaboration.</p>
          </div>
          <div className="feature-item">
            <img src="https://via.placeholder.com/300" alt="Feature 3" />
            <h3>Scalable Impact</h3>
            <p>From local to global, we scale projects to deliver maximum impact.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-item">
            <p>"This platform changed our community for the better."</p>
            <p>- SHG Leader</p>
          </div>
          <div className="testimonial-item">
            <p>"An amazing experience! We’ve grown exponentially."</p>
            <p>- SHG Member</p>
          </div>
          <div className="testimonial-item">
            <p>"The support and tools are unmatched. Highly recommended!"</p>
            <p>- SHG Entrepreneur</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 SHG Empowerment Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
