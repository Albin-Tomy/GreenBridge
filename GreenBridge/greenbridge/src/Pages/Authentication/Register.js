import React, { useState, useEffect } from 'react';
import google from '../../assets/Google.png'; 
import logo from '../../assets/logo.png';
import './Login.css'; // Ensure this CSS file is created based on your styles
import axios from 'axios';

const Register = ({ setIslogin }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  // Email validation function
  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    // Validate email using a regular expression
    const emailRegex = /\S+@\S+\.\S+/;
    setIsEmailValid(emailRegex.test(inputEmail));
  };

  // Handle password and confirm password matching
  useEffect(() => {
    setIsPasswordMatch(password !== '' && password === confirmPassword);
  }, [password, confirmPassword]);

  const formRegister = async (e) => {
    e.preventDefault();
    if (!isEmailValid) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password === '' || confirmPassword === '') {
      setError('All fields are required!');
      return;
    }

    if (!isPasswordMatch) {
      setError('Passwords do not match!');
      return;
    }

    setError(''); // Clear errors if all fields are valid

    try {
      const response = await axios.post('http://localhost:8000/api/v1/auth/register/', {
        email,
        password,
      });
      console.log('User registered:', response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error); // Display the specific error message
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="login-right">
      <div className="brand">
        <div className="logo-container">
          <img src={logo} alt="Brand Logo" className="brand-logo" />
        </div>
        <h2 className="brand-name">GREENBRIDGE</h2>
      </div>

      <h2>Sign Up</h2>
      <form onSubmit={formRegister}>
        {/* Email input */}
        <div className="input-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
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
            autoComplete="new-password"
            disabled={!isEmailValid} // Disable password input until email is valid
          />
        </div>

        {/* Confirm Password input */}
        <div className="input-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={!isEmailValid} // Disable confirm password input until email is valid
          />
        </div>

        {/* Error message */}
        {error && <p className="form-error">{error}</p>}

        {/* Submit button */}
        <button
          type="submit"
          className="login-btn"
          disabled={!isEmailValid || !isPasswordMatch} // Disable button if email is invalid or passwords don't match
        >
          Sign Up
        </button>

        <div className="or-divider">or</div>

        {/* Google sign-up button */}
        <button type="button" className="google-btn">
          <img src={google} alt="Google Logo" />
        </button>
      </form>

      <div className="sign-up-link">
        <p>
          <a href="#" onClick={() => setIslogin(true)}>Already registered? Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
