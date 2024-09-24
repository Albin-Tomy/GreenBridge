import React from 'react';
import './homepage-styles.css';

const Home = () => {
    return (
        <div>

            <main>
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-text">
                        <h2>Discover the Power of Nature</h2>
                        <p>Handcrafted, organic products for a healthier, more balanced lifestyle.</p>
                        <a href="#" className="cta-btn">Shop Now</a>
                    </div>
                </section>

                {/* Featured Products Section */}
                <section className="featured-products">
                    <h2>Our Best Sellers</h2>
                    <div className="product-grid">
                        <div className="product-item">
                            <img src="product1.jpg" alt="Product 1" />
                            <h3>Organic Body Lotion</h3>
                            <p>Moisturize naturally with this all-organic lotion.</p>
                            <a href="#" className="product-btn">Buy Now</a>
                        </div>
                        <div className="product-item">
                            <img src="product2.jpg" alt="Product 2" />
                            <h3>Herbal Shampoo</h3>
                            <p>Strengthen your hair with our herbal blend.</p>
                            <a href="#" className="product-btn">Buy Now</a>
                        </div>
                        <div className="product-item">
                            <img src="product3.jpg" alt="Product 3" />
                            <h3>Essential Oils Set</h3>
                            <p>Relax and rejuvenate with our essential oils.</p>
                            <a href="#" className="product-btn">Buy Now</a>
                        </div>
                    </div>
                </section>

                {/* Customer Testimonials Section */}
                <section className="testimonials">
                    <h2>What Our Customers Are Saying</h2>
                    <div className="testimonial-grid">
                        <div className="testimonial-item">
                            <p>"GreenBridge's products have completely changed my skincare routine!"</p>
                            <h4>- Sarah W.</h4>
                        </div>
                        <div className="testimonial-item">
                            <p>"The herbal shampoo is amazing! My hair feels so much healthier."</p>
                            <h4>- John D.</h4>
                        </div>
                        <div className="testimonial-item">
                            <p>"Their essential oils have become a daily part of my self-care."</p>
                            <h4>- Emily R.</h4>
                        </div>
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="newsletter">
                    <h2>Subscribe to Our Newsletter</h2>
                    <p>Get the latest updates on new products and upcoming sales.</p>
                    <form className="newsletter-form">
                        <input type="email" placeholder="Enter your email" required />
                        <button type="submit" className="newsletter-btn">Subscribe</button>
                    </form>
                </section>
            </main>

            <footer>
                <p>&copy; 2024 GreenBridge | All Rights Reserved</p>
                <ul className="footer-links">
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Terms of Service</a></li>
                    <li><a href="#">FAQ</a></li>
                </ul>
            </footer>
        </div>
    );
}

export default Home;
