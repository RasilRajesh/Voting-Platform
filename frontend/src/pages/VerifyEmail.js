import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token provided.');
        return;
      }

      try {
        const response = await axios.post('http://localhost:8000/api/users/verify-email/', {
          token: token
        });

        setStatus('success');
        setMessage(response.data.message);
        
        // Auto-login the user
        if (response.data.tokens) {
          localStorage.setItem('access_token', response.data.tokens.access);
          localStorage.setItem('refresh_token', response.data.tokens.refresh);
          login(response.data.user);
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.error || 
          'Email verification failed. The link may be invalid or expired.'
        );
      }
    };

    verifyEmail();
  }, [searchParams, navigate, login]);

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card" style={{ maxWidth: '500px', margin: '50px auto', textAlign: 'center' }}>
          {status === 'verifying' && (
            <>
              <div className="loading" style={{ margin: '20px 0' }}>Verifying your email...</div>
              <p style={{ color: '#666' }}>Please wait while we verify your email address.</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
              <h2 style={{ color: '#28a745', marginBottom: '15px' }}>Email Verified!</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>{message}</p>
              <p style={{ color: '#666' }}>Redirecting to dashboard...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
              <h2 style={{ color: '#dc3545', marginBottom: '15px' }}>Verification Failed</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>{message}</p>
              <button 
                onClick={() => navigate('/login')} 
                className="btn btn-primary"
                style={{ marginTop: '10px' }}
              >
                Go to Login
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
