import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedin_url: '',
    password: '',
    password_confirm: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const codeProcessedRef = React.useRef(false);

  // Handle LinkedIn OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code && !codeProcessedRef.current) {
      codeProcessedRef.current = true; // Mark as processed
      // Clear code from URL IMMEDIATELY to prevent reuse on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
      handleLinkedInCallback(code);
    }
  }, []);

  const handleLinkedInCallback = async (code) => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/auth/linkedin/', {
        code: code,
        // Send the exact origin we’re on to avoid localhost/127.0.0.1 mismatches
        redirect_uri: `${window.location.origin}/signup`
      });
      login(response.data.user, response.data.tokens);
      toast.success('LinkedIn signup successful!');
      navigate('/vote');
    } catch (error) {
      // Extract and display the actual error message from the backend
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'LinkedIn signup failed. Please try again.';
      console.error('LinkedIn signup error:', error.response?.data || error.message);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
      
      // Auto-login the user
      login(response.data.user, response.data.tokens);
      toast.success('Account created successfully!');
      
      // Redirect to vote page
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

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Exchange access token for user credential
        const response = await axios.post('http://127.0.0.1:8000/auth/google/', {
          access_token: tokenResponse.access_token,
        });
        login(response.data.user, response.data.tokens);
        toast.success('Google signup successful!');
        navigate('/vote');
      } catch (error) {
        toast.error('Google signup failed. Please try again.');
      }
    },
    onError: () => {
      toast.error('Google signup was cancelled or failed.');
    },
    prompt: 'select_account',
    flow: 'implicit',
  });

  const handleLinkedInLogin = () => {
    // Fail fast if client ID is missing to avoid mismatched OAuth apps
    const LINKEDIN_CLIENT_ID = process.env.REACT_APP_LINKEDIN_CLIENT_ID;
    if (!LINKEDIN_CLIENT_ID || LINKEDIN_CLIENT_ID === 'YOUR_LINKEDIN_CLIENT_ID') {
      toast.error('LinkedIn is not configured. Please set REACT_APP_LINKEDIN_CLIENT_ID.');
      return;
    }

    // Always reuse the exact origin the app is being served from
    const REDIRECT_URI = encodeURIComponent(`${window.location.origin}/signup`);
    const STATE = Math.random().toString(36).substring(7);
    const SCOPE = encodeURIComponent('openid profile email');
    
    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}&scope=${SCOPE}`;
    
    window.location.href = linkedInAuthUrl;
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
            <label htmlFor="linkedin_url" className="form-label">
              LinkedIn Profile <span style={{ color: '#94a3b8', fontWeight: '400' }}>(Optional)</span>
            </label>
            <div className="input-wrapper">
              <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.6667 2.5H3.33333C2.8731 2.5 2.5 2.8731 2.5 3.33333V16.6667C2.5 17.1269 2.8731 17.5 3.33333 17.5H16.6667C17.1269 17.5 17.5 17.1269 17.5 16.6667V3.33333C17.5 2.8731 17.1269 2.5 16.6667 2.5Z" stroke="#0A66C2" strokeWidth="1.5"/>
                <path d="M5.83333 8.33333V14.1667M5.83333 5.83333V5.84167M9.16667 8.33333V14.1667M9.16667 8.33333C9.16667 7.41286 9.91286 6.66667 10.8333 6.66667C11.7538 6.66667 12.5 7.41286 12.5 8.33333V14.1667M12.5 11.6667V14.1667" stroke="#0A66C2" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="url"
                id="linkedin_url"
                name="linkedin_url"
                className="form-input"
                placeholder="https://linkedin.com/in/yourprofile"
                value={formData.linkedin_url}
                onChange={handleChange}
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

        {/* Social Login Buttons */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '12px', 
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <button onClick={googleLogin} style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '2px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            background: 'white',
            fontSize: '15px',
            fontWeight: '600',
            color: '#333',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#4285F4';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          
          <button onClick={handleLinkedInLogin} style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '10px',
            border: '2px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            background: 'white',
            fontSize: '15px',
            fontWeight: '600',
            color: '#333',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#0A66C2';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(10, 102, 194, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Continue with LinkedIn
          </button>
        </div>

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

