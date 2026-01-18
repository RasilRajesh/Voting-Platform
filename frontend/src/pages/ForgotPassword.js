import React, { useState } from 'react';
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
      <div className="container">
        <div style={{ maxWidth: '400px', margin: '50px auto' }}>
          <div className="card">
            <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>Forgot Password</h2>
            
            {error && <div className="error-message">{error}</div>}
            {message && (
              <div className="success-message" style={{ whiteSpace: 'pre-line' }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link to="/login" className="link">Back to Login</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

