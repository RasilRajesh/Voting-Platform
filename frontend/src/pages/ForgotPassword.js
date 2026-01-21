import React, { useState } from 'react';
import '../HomeResponsive.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/auth/forgot-password/', { email });
      
      // Display message
      let displayMessage = response.data.message || 'Password reset email sent successfully!';
      
      // If dev mode and token is provided, show the reset URL
      if (response.data.reset_url) {
        displayMessage += `\n\nDev Mode - Click here to reset: ${response.data.reset_url}`;
      }
      
      setMessage(displayMessage);
    } catch (err) {
      console.error('Forgot password error:', err.response?.data);
      
      // Show detailed error
      let errorMsg = 'Failed to send reset email. Please try again.';
      if (err.response?.data) {
        errorMsg = err.response.data.error || err.response.data.detail || JSON.stringify(err.response.data);
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="home-responsive-root">
        <div className="home-responsive-nav-inner" style={{ maxWidth: '480px', margin: '60px auto', padding: '0 20px' }}>
          <div className="card" style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', border: '1px solid #e5e7eb' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#f3f4f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h2 style={{ 
                margin: '0',
                color: '#1f2937',
                fontSize: '24px',
                fontWeight: '700'
              }}>
                Forgot Password
              </h2>
              <p style={{ color: '#6b7280', margin: '10px 0 0 0', fontSize: '14px' }}>
                Enter your email to receive a password reset link
              </p>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            {message && (
              <div className="success-message" style={{ whiteSpace: 'pre-line' }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  style={{
                    padding: '12px 14px',
                    fontSize: '15px',
                    borderRadius: '8px',
                    border: '1.5px solid #d1d5db',
                    width: '100%'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ 
                  width: '100%',
                  background: '#1f2937',
                  border: 'none',
                  padding: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#111827';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#1f2937';
                }}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '25px' }}>
              <Link to="/login" style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

