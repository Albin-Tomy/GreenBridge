import React, { useState, useEffect } from "react";
import google from '../../assets/Google.png';
import logo from '../../assets/logo.png';
import { useGoogleLogin } from '@react-oauth/google';
import config from "../../config/config";
import './Login.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Login = ({ setIslogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const [user, setUser] = useState(null); // Add user state
  const [profile, setProfile] = useState(null); // Add profile state
  

  const navigate = useNavigate();


  useEffect(() => {
    // Clear inputs when component mounts
    setEmail('');
    setPassword('');

    // Check if the user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user.is_superuser) {
        navigate('/admin/home');
      } else if (user.is_shg) {
        navigate('/shg');
      } else {
        navigate('/');
      }
    }
  }, [navigate]);

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    const emailRegex = /\S+@\S+\.\S+/;
    setIsEmailValid(emailRegex.test(inputEmail));
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/login/', {
        email,
        password,
      });

      const { access, user_id } = response.data;
  
      // Store token and user data in localStorage
      localStorage.setItem('authToken', access);  
      localStorage.setItem('user', JSON.stringify(response.data.user));  
      localStorage.setItem('userId', user_id);  

      // Redirect based on user role
      if (response.data.user.is_active) {
        if (response.data.user.is_superuser) {
          navigate('/admin'); 
        } else if (response.data.user.is_shg) {
          navigate('/shg'); 
        } else if (response.data.user.is_ngo) { // Add check for NGO role
          navigate('/ngo/dashboard'); // Redirect to NGO dashboard
        } else {
          navigate('/'); // Redirect to user dashboard profile page
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

  const handleForgotPassword = () => {
    setIsForgetPassword(true);
  };

  const requestResetPassword = () => {
    const formData = new FormData();
    formData.append("email", email);

    axios.post('http://127.0.0.1:8000/api/v1/auth/password-reset/', formData)
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

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Add detailed logging of the token response
        console.log('Full Google token response:', {
          access_token: tokenResponse.access_token,
          token_type: tokenResponse.token_type,
          expires_in: tokenResponse.expires_in,
          scope: tokenResponse.scope,
          full: tokenResponse
        });
        
        // Log the request being sent
        console.log('Sending request to backend with data:', {
          token: tokenResponse.access_token
        });

        const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/google-signin/', {
          token: tokenResponse.access_token
        });

        console.log('Backend response:', response.data);

        const { access, user } = response.data;

        // Store token and user data
        localStorage.setItem('authToken', access);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userId', user.id);

        // Redirect based on user role
        if (user.is_active) {
          if (user.is_superuser) {
            navigate('/admin/admin');
          } else if (user.is_shg) {
            navigate('/shg');
          } else if (user.is_ngo) {
            navigate('/ngo/dashboard');
          } else {
            navigate('/');
          }
        } else {
          setError('Account is not activated. Please check your email.');
        }
      } catch (error) {
        // Enhanced error logging
        console.error('Google login error details:', {
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
          fullError: error
        });
        setError(error.response?.data?.error || 'Google login failed. Please try again.');
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      setError('Failed to connect to Google. Please try again.');
    },
    scope: 'email profile', // Add specific scopes
  });

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
              id= "login"
              type="submit"
              className="login-btn"
              disabled={!isEmailValid || password === ''}
            >
              Sign In
            </button>

            <div className="or-divider">or</div>

            <button 
              type="button" 
              className="google-btn"
              onClick={() => googleLogin()}
            >
              <img src={google} alt="Google Logo" />
              <span>Sign in with Google</span>
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
