import React from 'react';
import './shg.css'; 
import { Link } from 'react-router-dom';
import Header from '../../components/Header';

// Image Imports
import collection from '../../assets/organic.jpeg';
import collection1 from '../../assets/community.jpeg';
import collection2 from '../../assets/community1.jpeg';
import recycle from '../../assets/recycle.jpeg';
import organic from '../../assets/organic.jpeg';
import ewaste from '../../assets/ewaste.jpeg';
import plastic from '../../assets/plastic.jpeg';
import community from '../../assets/community1.jpeg';
import promo2 from '../../assets/waste management.jpeg'; // Corrected path and filename
import story1 from '../../assets/waste1.jpeg';
import story2 from '../../assets/honey.jpg';
import story3 from '../../assets/ewsate1.jpeg';

const SHGHome = () => {
    return (
        <div className='head'>

        <Header/>
        <div>
            {/* Hero Section */}
            <section className="hero-banner">
                <div className="main-container">
                    <div className="image-item">
                        <img src={collection} alt="Waste Collection Service" />
                    </div>
                    <div className="image-item">
                        <img src={collection1} alt="Community Effort" />
                    </div>
                    <div className="image-item">
                        <img src={collection2} alt="Sustainable Collection" />
                    </div>
                </div>
                <div className="text-container">
                    <h1>Empowering Communities, Sustaining Tomorrow</h1>
                    <p>Join our Self-Help Groups in making a cleaner, greener environment.</p>
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section">
                <h2>Our Waste Collection Services</h2>
                <div className="service-item">
                    <div className="outer-circle">
                        <div className="inner-circle">
                            <img src={recycle} alt="Recycling Services" />
                        </div>
                    </div>
                    <p>Recycling</p>
                </div>

                <div className="service-item">
                    <div className="outer-circle">
                        <div className="inner-circle">
                            <img src={organic} alt="Organic Waste Collection" />
                        </div>
                    </div>
                    <p>Organic Waste</p>
                </div>

                <div className="service-item">
                    <div className="outer-circle">
                        <div className="inner-circle">
                            <img src={ewaste} alt="E-Waste Collection" />
                        </div>
                    </div>
                    <p>E-Waste</p>
                </div>

                <div className="service-item">
                    <div className="outer-circle">
                        <div className="inner-circle">
                            <img src={plastic} alt="Plastic Waste Collection" />
                        </div>
                    </div>
                    <p>Plastic Waste</p>
                </div>
            </section>

            {/* Promotions Section */}
            <div className="promotion">
                <div className="section">
                    <div className="image">
                        <img src={community} alt="Community Cleanup Drive" />
                    </div>
                    <div className="text-content">
                        <h2>Join Our <span className="highlight">Community Cleanup Drive</span></h2>
                        <p>Be a part of a collective effort to keep our environment clean and sustainable.</p>
                        <Link to="/signup">
                            <button className="order-btn">Get Started</button>
                        </Link>
                    </div>
                </div>

                <div className="section">
                    <div className="text-content">
                        <h2>Exclusive <span className="highlight">Waste Management Training</span></h2>
                        <p>Get trained in effective waste management and help build a greener future.</p>
                        <Link to="/signup">
                            <button className="order-btn">Get Started</button>
                        </Link>
                    </div>
                    <div className="image">
                        <img src={promo2} alt="Waste Management Training" />
                    </div>
                </div>
            </div>

            {/* Success Stories Section */}
            <section className="success-stories">
                <h2>Success Stories</h2>
                <div className="story-container">
                    <div className="story-card">
                        <img src={story1} alt="SHG in Action" />
                        <h3>Village SHG's Recycling Initiative</h3>
                        <p>Our local SHG successfully collected and recycled 1 ton of plastic waste.</p>
                    </div>

                    <div className="story-card">
                        <img src={story2} alt="Waste Collection Event" />
                        <h3>Community Cleanup Success</h3>
                        <p>500 kg of organic waste was composted in our latest cleanup drive.</p>
                    </div>

                    <div className="story-card">
                        <img src={story3} alt="E-Waste Recycling Efforts" />
                        <h3>E-Waste Recycling Achievements</h3>
                        <p>Our efforts have led to safe disposal and recycling of 300 e-waste items.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer>
                <p>© 2024 SHG Waste Collection Services | Designed by [Your Name]</p>
            </footer>
        </div>
        </div>
    );
};

export default SHGHome;
