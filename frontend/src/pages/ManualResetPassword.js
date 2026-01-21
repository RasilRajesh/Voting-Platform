import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ManualResetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/auth/reset-password/', {
        token: formData.token,
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword
      });
      setMessage(response.data.message || 'Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || 'Failed to reset password. The token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* No Navbar for reset page to keep it separate from authenticated navigation */}
      <div className="container" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f3f4f6 0%, #e0e7ff 100%)', padding: '40px 0' }}>
        <div style={{ maxWidth: '480px', margin: '60px auto', padding: '0 20px' }}>
          <div className="card" style={{ background: 'white', padding: '48px 40px 36px 40px', borderRadius: '18px', boxShadow: '0 6px 32px rgba(80, 112, 255, 0.10)', border: '1.5px solid #e5e7eb' }}>
            <h2 style={{ marginBottom: '18px', textAlign: 'center', fontWeight: 700, fontSize: '2rem', color: '#1e293b' }}>Reset Your Password</h2>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '28px', fontSize: '1rem' }}>Enter the 6-digit reset code sent to your email and set a new password.</p>
            {error && <div className="error-message" style={{ marginBottom: '18px' }}>{error}</div>}
            {message && <div className="success-message" style={{ marginBottom: '18px' }}>{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label htmlFor="email" style={{ fontWeight: 500, color: '#334155', marginBottom: 6, display: 'block' }}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  style={{
                    padding: '13px 15px',
                    fontSize: '1rem',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    width: '100%',
                    marginTop: 2
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label htmlFor="token" style={{ fontWeight: 500, color: '#334155', marginBottom: 6, display: 'block' }}>Reset Code</label>
                <input
                  type="text"
                  id="token"
                  name="token"
                  value={formData.token}
                  onChange={handleChange}
                  required
                  placeholder="Enter the 6-digit code"
                  maxLength="6"
                  pattern="[0-9]{6}"
                  style={{
                    padding: '13px 15px',
                    fontSize: '1rem',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    width: '100%',
                    marginTop: 2
                  }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label htmlFor="newPassword" style={{ fontWeight: 500, color: '#334155', marginBottom: 6, display: 'block' }}>New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  placeholder="Enter new password"
                  minLength="8"
                  style={{
                    padding: '13px 15px',
                    fontSize: '1rem',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    width: '100%',
                    marginTop: 2
                  }}
                />
                <small style={{ color: '#64748b', fontSize: '12px', marginTop: 2, display: 'block' }}>
                  Must be at least 8 characters
                </small>
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label htmlFor="confirmPassword" style={{ fontWeight: 500, color: '#334155', marginBottom: 6, display: 'block' }}>Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm new password"
                  minLength="8"
                  style={{
                    padding: '13px 15px',
                    fontSize: '1rem',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    width: '100%',
                    marginTop: 2
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  background: '#111827',
                  border: 'none',
                  padding: '13px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: '28px' }}>
              <Link to="/login" className="link" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 500, fontSize: '15px' }}>Back to Login</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManualResetPassword;
