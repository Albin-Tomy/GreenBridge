import React, { useState, useEffect } from "react";
import google from '../../assets/Google.png';
import logo from '../../assets/logo.png';
import '../../Login.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Login = ({ setIslogin }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate here

  // Reset email and password fields when the component is loaded
  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  // Email validation function
  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    // Validate email using a regular expression
    const emailRegex = /\S+@\S+\.\S+/;
    setIsEmailValid(emailRegex.test(inputEmail));
  };

  // Function to handle login
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/auth/login/', {
        email,
        password,
      });

      // Store the token in local storage
      localStorage.setItem('token', response.data.access);

      console.log('User logged in:', response.data);

      // Check if the user is active
      if (response.data.is_active) {
        // Check if the user is SHG or not, and navigate accordingly
        if (response.data.is_shg) {
          navigate('/admin');  // Redirect to admin page
        } else {
          navigate('/home');   // Redirect to home page
        }
      } else {
        // Alert user if not activated
        alert('User is not activated/approved. Please try again later.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Login failed. Please check your credentials.');
    }
  };

  // Form submission handling
  const formSubmit = async (e) => {
    e.preventDefault();

    // Validate that both fields are filled
    if (!email || !password) {
      setError('All fields are required!');
      return;
    } else {
      setError('');
    }

    // Call handleLogin after form validation
    await handleLogin();
  };

  return (
    <div className="login-right">
      <div className="brand">
        <div className="logo-container">
          <img src={logo} alt="Brand Logo" className="brand-logo" />
        </div>
        <h2 className="brand-name">GREENBRIDGE</h2>
      </div>

      <h2>Login</h2>
      <form onSubmit={formSubmit}>
        {/* Email input */}
        <div className="input-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="E-mail"
            value={email}
            onChange={handleEmailChange}
            autoComplete="off"
          />
        </div>

        {/* Password input */}
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!isEmailValid} // Disable password input until email is valid
            autoComplete="new-password"
          />
          <a href="#" className="forgot-password">
            Forgot Password? <strong>Click Here</strong>
          </a>
        </div>

        {/* Error message */}
        {error && <p className="form-error">{error}</p>}

        {/* Submit button */}
        <button
          type="submit"
          className="login-btn"
          disabled={!isEmailValid || password === ''} // Disable button if email is invalid or password is empty
        >
          Sign In
        </button>

        <div className="or-divider">or</div>

        {/* Google login button */}
        <button type="button" className="google-btn">
          <img src={google} alt="Google Logo" />
        </button>
      </form>

      <div className="sign-up-link">
        <p>
          <a href="#" onClick={() => setIslogin(false)}>New User? Create Account</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
