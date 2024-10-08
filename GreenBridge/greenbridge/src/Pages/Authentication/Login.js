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
  const [isForgetPassword, setIsForgetPassword] = useState(false); // State for reset password flow

  const navigate = useNavigate();  // Initialize the useNavigate hook

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
      localStorage.setItem('authToken', response.data.access); // Access token
      localStorage.setItem('user', JSON.stringify(response.data.user)); // User details
  
      console.log('User logged in:', response.data);
  
      // Redirect based on role
      if (response.data.user.is_active) {
        if (response.data.user.is_superuser) {
          navigate('/admin/home'); // Redirect to admin dashboard
        } else if (response.data.user.is_shg) {
          navigate('/shg'); // Redirect to SHG dashboard
        } else {
          navigate('/home'); // Redirect to general user dashboard
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

  // Function to handle Forgot Password click
  const handleForgotPassword = () => {
    setIsForgetPassword(true);  // Show the reset password form
  };

  // Function to handle reset password request
  const requestResetPassword = () => {
    const formData = new FormData();
    formData.append("email", email);

    axios.post('http://localhost:8000/api/v1/auth/password-reset/', formData)
      .then((response) => {
        if (response.status === 200) {
          alert('Reset password link sent to your email');
        }
      })
      .catch((error) => {
        console.error('Error sending reset password link:', error);
        setError(error.response?.data?.error || 'Failed to send reset password link.');
      });
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

        <h2>{isForgetPassword ? "Reset Your Password" : "Login"}</h2>

        {!isForgetPassword ? (
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
              <span onClick={handleForgotPassword} className="forgot-password" style={{cursor: "pointer"}}>
                Forgot Password? <strong>Click Here</strong>
              </span>
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
        ) : (
          <form>
            <div className="input-group">
              <label htmlFor="email">Enter Your Registered Email</label>
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

            {error && <p className="form-error">{error}</p>}

            <button
              onClick={requestResetPassword}
              className="login-btn"
              disabled={!isEmailValid}
            >
              Reset Password
            </button>
          </form>
        )}

        {!isForgetPassword && (
          <div className="sign-up-link">
            <p>
              <a href="#" onClick={() => setIslogin(false)}>New User? Create Account</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
