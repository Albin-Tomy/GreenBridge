import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header'; // Import Header component

const LandingPage = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Section */}
      <Header /> {/* Header should always stay at the top */}

      {/* Landing Page Content */}
      <div
        style={{
          flex: 1, // Ensure the content takes up remaining space
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: '20px',
          color: '#ffffff',
          textAlign: 'center',
        }}
      >
        {/* Hero Section */}
        <section style={{ maxWidth: windowWidth > 768 ? '800px' : '90%', margin: '0 auto', padding: '40px 0' }}>
          <h1 style={{
            fontSize: windowWidth > 576 ? '48px' : '36px',
            marginBottom: '20px',
          }}>Welcome to GreenBridge</h1>
          <p style={{
            fontSize: windowWidth > 576 ? '18px' : '16px',
            marginBottom: '40px',
          }}>Your one-stop solution for sustainable materials exchange.</p>
          <Link to="/learn-more">
            <button
              style={{
                padding: '12px 20px',
                fontSize: '18px',
                color: '#fff',
                backgroundColor: '#0abd49',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#098a36'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0abd49'}
            >
              Learn More
            </button>
          </Link>
        </section>

        {/* Features Section */}
        <section style={{ padding: '50px 20px', backgroundColor: '#f4f4f4', width: '100%' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Our Features</h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            margin: '0 -10px',
          }}>
            {['Eco-Friendly Products', 'Community Driven', 'Innovative Solutions'].map((feature, index) => (
              <div key={index} style={{
                flexBasis: windowWidth > 768 ? '30%' : '100%',
                margin: '20px 10px',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                textAlign: 'left', // Left align text in features
              }}>
                <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>{feature}</h3>
                <p style={{ fontSize: '16px', color: '#555' }}>
                  {index === 0 && 'Discover a wide range of environmentally friendly products.'}
                  {index === 1 && 'Join a network of businesses committed to sustainability.'}
                  {index === 2 && 'Explore innovative ideas to reduce waste and improve recycling.'}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section style={{ padding: '60px 20px', backgroundColor: '#0abd49', color: 'white', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>Ready to Make a Difference?</h2>
          <p style={{ fontSize: '18px', marginBottom: '30px' }}>Sign up today and start contributing to a greener future.</p>
          <Link to="/signup">
            <button
              style={{
                padding: '12px 20px',
                fontSize: '18px',
                color: '#fff',
                backgroundColor: '#0abd49',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#098a36'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0abd49'}
            >
              Get Started
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
