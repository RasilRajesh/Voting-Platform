import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirm: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirm) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/signup/', formData);
      login(response.data.user, response.data.tokens);
      toast.success('Account created successfully!');
      navigate('/vote');
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData) {
        const firstError = Object.values(errorData)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        toast.error('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/google/', {
        credential: credentialResponse.credential,
      });
      login(response.data.user, response.data.tokens);
      toast.success('Google signup successful!');
      navigate('/vote');
    } catch (error) {
      toast.error('Google signup failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google signup was cancelled or failed.');
  };

  const handleLinkedInLogin = () => {
    toast.info('LinkedIn signup coming soon!');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="black"/>
            <path d="M16 8L20 18H12L16 8Z" fill="white"/>
            <rect x="12" y="20" width="8" height="4" fill="white"/>
          </svg>
        </div>

        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join us to start voting securely</p>
        </div>

        {/* Social Login Buttons */}
        <div className="social-login-section">
          <div className="google-login-wrapper">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text="signup_with"
              width="100%"
            />
          </div>
          
          <button className="linkedin-login-btn" type="button" onClick={handleLinkedInLogin}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M18.5 0h-17C0.675 0 0 0.675 0 1.5v17C0 19.325 0.675 20 1.5 20h17c0.825 0 1.5-0.675 1.5-1.5v-17C20 0.675 19.325 0 18.5 0zM6 17H3V8h3V17zM4.5 6.5C3.675 6.5 3 5.825 3 5s0.675-1.5 1.5-1.5S6 4.175 6 5 5.325 6.5 4.5 6.5zM17 17h-3v-4.5c0-1.125-0.375-1.875-1.313-1.875-0.713 0-1.137 0.488-1.325 0.95-0.063 0.175-0.087 0.4-0.087 0.65V17h-3s0.038-7.5 0-8.25h3v1.175c0.4-0.612 1.113-1.487 2.7-1.487 1.975 0 3.45 1.287 3.45 4.05V17h-0.025z" fill="#0A66C2"/>
            </svg>
            <span>Sign up with LinkedIn</span>
          </button>
        </div>

        {/* Divider */}
        <div className="auth-divider">
          <span className="divider-line"></span>
          <span className="divider-text">or sign up with email</span>
          <span className="divider-line"></span>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="6.5" r="3.5" stroke="#666" strokeWidth="1.5"/>
                <path d="M3.75 16.25C3.75 13.3505 6.10051 11 9 11H11C13.8995 11 16.25 13.3505 16.25 16.25" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3.33334 3.33334H16.6667C17.5833 3.33334 18.3333 4.08334 18.3333 5.00001V15C18.3333 15.9167 17.5833 16.6667 16.6667 16.6667H3.33334C2.41668 16.6667 1.66668 15.9167 1.66668 15V5.00001C1.66668 4.08334 2.41668 3.33334 3.33334 3.33334Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.3333 5L10 10.8333L1.66666 5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3.33334" y="8.33334" width="13.3333" height="9.16667" rx="1.66667" stroke="#666" strokeWidth="1.5"/>
                <path d="M6.66666 8.33334V5.83334C6.66666 3.99239 8.15905 2.50001 10 2.50001C11.8409 2.50001 13.3333 3.99239 13.3333 5.83334V8.33334" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password_confirm" className="form-label">Confirm Password</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3.33334" y="8.33334" width="13.3333" height="9.16667" rx="1.66667" stroke="#666" strokeWidth="1.5"/>
                <path d="M6.66666 8.33334V5.83334C6.66666 3.99239 8.15905 2.50001 10 2.50001C11.8409 2.50001 13.3333 3.99239 13.3333 5.83334V8.33334" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="10" cy="13" r="1" fill="#666"/>
              </svg>
              <input
                type="password"
                id="password_confirm"
                name="password_confirm"
                className="form-input"
                placeholder="••••••••"
                value={formData.password_confirm}
                onChange={handleChange}
                required
                minLength="8"
              />
            </div>
          </div>

          <button type="submit" className="btn-auth-primary" disabled={loading}>
            {loading ? (
              <>
                <svg className="spinner" width="20" height="20" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="2" fill="none" strokeDasharray="40" strokeDashoffset="10"/>
                </svg>
                <span>Creating account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="auth-footer">
          <p className="footer-text">
            Already have an account?{' '}
            <Link to="/login" className="footer-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

