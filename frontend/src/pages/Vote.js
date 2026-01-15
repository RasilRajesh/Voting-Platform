import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Vote = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidates();
    checkIfVoted();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/candidates/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCandidates(response.data);
    } catch (error) {
      setError('Failed to load candidates. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const checkIfVoted = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/votes/has_voted/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHasVoted(response.data.has_voted);
    } catch (error) {
      console.error('Error checking vote status:', error);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      return;
    }

    if (hasVoted) {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/votes/${selectedCandidate}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVoteSuccess(true);
      setHasVoted(true);
      setTimeout(() => navigate('/results'), 2500);
    } catch (error) {
      if (error.response?.status === 400) {
        setHasVoted(true);
      } else {
        setError('Failed to submit vote. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="vote-container">
          <div className="loading-spinner">
            <svg className="spinner-large" width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" stroke="#000" strokeWidth="4" fill="none" strokeDasharray="100" strokeDashoffset="25"/>
            </svg>
            <p>Loading candidates...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFB 100%)',
        padding: '40px 24px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '48px'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: '#EFF6FF',
              borderRadius: '100px',
              marginBottom: '16px',
              border: '1px solid #DBEAFE'
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="3" fill="#3B82F6"/>
                <circle cx="8" cy="8" r="7" stroke="#3B82F6" strokeWidth="1" opacity="0.3"/>
              </svg>
              <span style={{ color: '#1E40AF', fontWeight: '600', fontSize: '14px' }}>Cast Your Vote</span>
            </div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#0F172A',
              marginBottom: '12px',
              letterSpacing: '-0.02em'
            }}>
              Choose Your Candidate
            </h1>
            {hasVoted ? (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: '#D1FAE5',
                color: '#065F46',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '16px'
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
                  <path d="M6 10L9 13L14 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>You have already voted</span>
              </div>
            ) : (
              <p style={{ color: '#64748B', fontSize: '18px' }}>
                Select one candidate to cast your secure vote
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              maxWidth: '600px',
              margin: '0 auto 32px',
              padding: '16px 20px',
              background: '#FEE2E2',
              border: '1px solid #FECACA',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#991B1B" strokeWidth="2"/>
                <path d="M10 6V10" stroke="#991B1B" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="10" cy="14" r="1" fill="#991B1B"/>
              </svg>
              <span style={{ color: '#991B1B', fontSize: '14px', fontWeight: '600' }}>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {voteSuccess && (
            <div style={{
              maxWidth: '600px',
              margin: '0 auto 32px',
              padding: '16px 20px',
              background: '#D1FAE5',
              border: '1px solid #A7F3D0',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#065F46" strokeWidth="2"/>
                <path d="M6 10L9 13L14 7" stroke="#065F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ color: '#065F46', fontSize: '14px', fontWeight: '600' }}>
                ✓ Vote submitted successfully! Redirecting to results...
              </span>
            </div>
          )}

          {/* Candidates Grid */}
          <div className="candidates-grid-premium">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="candidate-card-premium"
                style={{
                  cursor: hasVoted ? 'not-allowed' : 'pointer',
                  opacity: hasVoted ? 0.6 : 1,
                  border: selectedCandidate === candidate.id ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                  background: selectedCandidate === candidate.id ? '#EFF6FF' : 'white'
                }}
                onClick={() => !hasVoted && setSelectedCandidate(candidate.id)}
              >
                {selectedCandidate === candidate.id && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: '#3B82F6',
                    borderRadius: '50%',
                    padding: '4px',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 10L8.5 13.5L15 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}

                <div className="candidate-header-premium">
                  {candidate.profile_image_url ? (
                    <img 
                      src={candidate.profile_image_url} 
                      alt={candidate.name}
                      className="candidate-image-premium"
                    />
                  ) : (
                    <div style={{
                      width: '140px',
                      height: '140px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                      margin: '0 auto 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '48px',
                      fontWeight: '700',
                      border: '5px solid #F0F9FF'
                    }}>
                      {candidate.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <h3 className="candidate-name-premium">{candidate.name}</h3>
                  <p className="candidate-description-premium">
                    {candidate.description || 'A dedicated candidate committed to excellence and progress.'}
                  </p>
                </div>

                {candidate.linkedin_url && (
                  <a
                    href={candidate.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="candidate-linkedin-premium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path d="M18.5 0h-17C0.675 0 0 0.675 0 1.5v17C0 19.325 0.675 20 1.5 20h17c0.825 0 1.5-0.675 1.5-1.5v-17C20 0.675 19.325 0 18.5 0zM6 17H3V8h3V17zM4.5 6.5C3.675 6.5 3 5.825 3 5s0.675-1.5 1.5-1.5S6 4.175 6 5 5.325 6.5 4.5 6.5zM17 17h-3v-4.5c0-1.125-0.375-1.875-1.313-1.875-0.713 0-1.137 0.488-1.325 0.95-0.063 0.175-0.087 0.4-0.087 0.65V17h-3s0.038-7.5 0-8.25h3v1.175c0.4-0.612 1.113-1.487 2.7-1.487 1.975 0 3.45 1.287 3.45 4.05V17h-0.025z" fill="#0A66C2"/>
                    </svg>
                    <span>View Profile</span>
                  </a>
                )}

                {!hasVoted && (
                  <button
                    style={{
                      width: '100%',
                      padding: '14px',
                      marginTop: '16px',
                      background: selectedCandidate === candidate.id 
                        ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
                        : 'white',
                      color: selectedCandidate === candidate.id ? 'white' : '#64748B',
                      border: selectedCandidate === candidate.id ? 'none' : '2px solid #E2E8F0',
                      borderRadius: '10px',
                      fontWeight: '600',
                      fontSize: '15px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCandidate(candidate.id);
                    }}
                    onMouseEnter={(e) => {
                      if (selectedCandidate !== candidate.id) {
                        e.target.style.background = '#F8FAFC';
                        e.target.style.borderColor = '#CBD5E1';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCandidate !== candidate.id) {
                        e.target.style.background = 'white';
                        e.target.style.borderColor = '#E2E8F0';
                      }
                    }}
                  >
                    {selectedCandidate === candidate.id && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    <span>{selectedCandidate === candidate.id ? 'Selected' : 'Select Candidate'}</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          {!hasVoted && (
            <div style={{
              textAlign: 'center',
              marginTop: '48px'
            }}>
              <button
                onClick={handleVote}
                disabled={!selectedCandidate || submitting}
                style={{
                  padding: '18px 48px',
                  background: !selectedCandidate || submitting 
                    ? '#E2E8F0'
                    : 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                  color: !selectedCandidate || submitting ? '#94A3B8' : 'white',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '17px',
                  fontWeight: '700',
                  cursor: !selectedCandidate || submitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: !selectedCandidate || submitting 
                    ? 'none'
                    : '0 8px 20px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (selectedCandidate && !submitting) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 28px rgba(59, 130, 246, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = selectedCandidate && !submitting
                    ? '0 8px 20px rgba(59, 130, 246, 0.3)'
                    : 'none';
                }}
              >
                {submitting ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '3px solid rgba(255, 255, 255, 0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    <span>Submitting Vote...</span>
                  </>
                ) : (
                  <>
                    <span>Submit My Vote</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
              <p style={{
                marginTop: '20px',
                color: '#64748B',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 4V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="8" cy="11" r="0.75" fill="currentColor"/>
                </svg>
                <span>Your vote is secure and anonymous. Once submitted, it cannot be changed.</span>
              </p>
            </div>
          )}

          {/* Success Message */}
          {hasVoted && (
            <div style={{
              maxWidth: '600px',
              margin: '60px auto',
              textAlign: 'center',
              background: 'white',
              padding: '48px',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M14 24L21 31L34 17" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#0F172A',
                marginBottom: '12px'
              }}>Thank You for Voting!</h2>
              <p style={{
                fontSize: '16px',
                color: '#64748B',
                lineHeight: '1.6',
                marginBottom: '32px'
              }}>
                Your vote has been recorded securely. You can view the results on the results page.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '14px 32px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.3)';
                }}
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
};

export default Vote;
