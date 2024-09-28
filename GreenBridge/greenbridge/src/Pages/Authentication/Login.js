import React, { useState, useEffect } from "react";
import google from '../../assets/Google.png';
import logo from '../../assets/logo.png';
import './Login.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Login = ({ setIslogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Clear inputs when component mounts
    setEmail('');
    setPassword('');
  }, []);

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    const emailRegex = /\S+@\S+\.\S+/;
    setIsEmailValid(emailRegex.test(inputEmail));
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/auth/login/', {
        email,
        password,
      });

      // Store token in localStorage
      localStorage.setItem('authToken', response.data.access); // Ensure the key matches
      console.log('User logged in:', response.data);

      // Redirect based on role
      if (response.data.user.is_active) {
        if (response.data.user.is_shg) {
          navigate('/admin/home');
        } else if (response.data.user.is_superuser) {
          navigate('/home');
        } else {
          navigate('/home');
        }
      } else {
        alert('User is not activated/approved. Please try again later.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Login failed. Please check your credentials.');
    }
  };

  const formSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('All fields are required!');
      return;
    } else {
      setError('');
    }

    await handleLogin();
  };

  return (
    <div className="login-page">
      <div className="login-right">
        <div className="brand">
          <div className="logo-container">
            <img src={logo} alt="Brand Logo" className="brand-logo" />
          </div>
          <h2 className="brand-name">GREENBRIDGE</h2>
        </div>

        <h2>Login</h2>
        <form onSubmit={formSubmit}>
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

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!isEmailValid}
              autoComplete="new-password"
            />
            <a href="#" className="forgot-password">
              Forgot Password? <strong>Click Here</strong>
            </a>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            className="login-btn"
            disabled={!isEmailValid || password === ''}
          >
            Sign In
          </button>

          <div className="or-divider">or</div>

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
    </div>
  );
};

export default Login;
