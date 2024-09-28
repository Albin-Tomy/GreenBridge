import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import Login from './Login';
import Register from './Register';
import trees from '../../assets/trees.jpg';

function RegLogin() {
  const location = useLocation();
  const [isLogin, setIslogin] = useState(true);

  // Update the form based on the URL path
  useEffect(() => {
    if (location.pathname === '/signup') {
      setIslogin(false); // Show signup form
    } else {
      setIslogin(true); // Show login form
    }
  }, [location.pathname]); // Re-run the effect when the URL path changes

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <img src={trees} alt="trees" />
        </div>
        {/* Conditionally render Login or Register based on the isLogin state */}
        {isLogin ? <Login setIslogin={setIslogin} /> : <Register setIslogin={setIslogin} />}
      </div>
    </div>
  );
}

export default RegLogin;
