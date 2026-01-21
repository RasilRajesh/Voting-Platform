import React, { useEffect, useState } from 'react';
import '../HomeResponsive.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import '../PremiumTheme.css';

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8000/api/candidates/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load candidates. Please try again.');
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVoteClick = () => {
    navigate('/vote');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading candidates...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="error-message">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div style={{
          ...existing code...
      <div className="dashboard-responsive-container">
        <h1 style={{
          fontSize: '32px',
          fontWeight: '600',
          marginBottom: '30px',
          color: '#1a202c'
        }}>
          Voting Dashboard
        </h1>
        
        {user?.has_voted && (
          <div style={{
            padding: '16px 20px',
            background: '#f7fafc',
            borderRadius: '8px',
            marginBottom: '40px',
            borderLeft: '4px solid #4a5568'
          }}>
            <p style={{ margin: 0, color: '#2d3748' }}>
              ✓ You have already voted
            </p>
          </div>
        )}

        {candidates.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#718096', padding: '40px 0' }}>
            No candidates available.
          </p>
        ) : (
          <div className="dashboard-candidates-grid">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="dashboard-candidate-card">
                {candidate.profile_image_url ? (
                  <img
                    src={candidate.profile_image_url}
                    alt={candidate.name}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginBottom: '20px',
                      border: '3px solid #f7fafc'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: '#f7fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    fontWeight: '600',
                    color: '#4a5568',
                    marginBottom: '20px',
                    border: '3px solid #e2e8f0'
                  }}>
                    {candidate.name.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  marginBottom: '12px',
                  color: '#1a202c'
                }}>{candidate.name}</h3>
                
                <div style={{
                  padding: '8px 20px',
                  background: '#f7fafc',
                  borderRadius: '20px',
                  marginBottom: '24px'
                }}>
                  <span style={{ 
                    fontSize: '16px', 
                    fontWeight: '600',
                    color: '#2d3748'
                  }}>
                    {candidate.vote_count || 0} votes
                  </span>
                </div>
                
                <button
                  onClick={handleVoteClick}
                  disabled={user?.has_voted}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    background: user?.has_voted ? '#cbd5e0' : '#2d3748',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: user?.has_voted ? 'not-allowed' : 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!user?.has_voted) {
                      e.target.style.background = '#1a202c';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!user?.has_voted) {
                      e.target.style.background = '#2d3748';
                    }
                  }}
                >
                  {user?.has_voted ? 'Voted' : 'Vote for ' + candidate.name}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;

