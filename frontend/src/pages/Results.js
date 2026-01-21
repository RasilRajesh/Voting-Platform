import '../HomeResponsive.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Results = () => {
  const [results, setResults] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/votes/results/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setResults(data);
      setTotalVotes(data.reduce((sum, candidate) => sum + candidate.vote_count, 0));
    } catch (error) {
      setError('Failed to load results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (voteCount) => {
    if (totalVotes === 0) return 0;
    return ((voteCount / totalVotes) * 100).toFixed(1);
  };

  const winner = results.length > 0 ? results.reduce((prev, current) => 
    (prev.vote_count > current.vote_count) ? prev : current
  ) : null;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="results-container">
          <div className="loading-spinner">
            <svg className="spinner-large" width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" stroke="#000" strokeWidth="4" fill="none" strokeDasharray="100" strokeDashoffset="25"/>
            </svg>
            <p>Loading results...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="results-container">
        <div className="results-content">
          {/* Header */}
          <div className="results-header">
            <div className="results-badge">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="4" width="12" height="10" rx="1" stroke="#000" strokeWidth="1.5"/>
                <path d="M2 7H14" stroke="#000" strokeWidth="1.5"/>
                <rect x="5" y="9" width="2" height="4" fill="#000"/>
                <rect x="9" y="8" width="2" height="5" fill="#000"/>
              </svg>
              <span>Live Results</span>
            </div>
            <h1 className="results-title">Election Results</h1>
            <p className="results-subtitle">
              Real-time vote counts • <span className="total-votes">{totalVotes} total votes</span>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              maxWidth: '700px',
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

          {/* Winner Card */}
          {winner && winner.vote_count > 0 && (
            <div className="winner-card">
              <div className="winner-badge">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15 9H22L17 14L19 21L12 17L5 21L7 14L2 9H9L12 2Z" fill="#FFD700" stroke="#000" strokeWidth="1.5"/>
                </svg>
                <span>Current Leader</span>
              </div>
              <div className="winner-content">
                <div className="winner-avatar">
                  {winner.image ? (
                    <img src={winner.image} alt={winner.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                        <circle cx="40" cy="30" r="15" stroke="#000" strokeWidth="2.5"/>
                        <path d="M15 65C15 52 25 45 40 45C55 45 65 52 65 65" stroke="#000" strokeWidth="2.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="winner-info">
                  <h2>{winner.name}</h2>
                  {winner.party && <p className="winner-party">{winner.party}</p>}
                  <div className="winner-stats">
                    <div className="stat">
                      <div className="stat-value">{winner.vote_count}</div>
                      <div className="stat-label">Votes</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat">
                      <div className="stat-value">{getPercentage(winner.vote_count)}%</div>
                      <div className="stat-label">Of Total</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Chart */}
          <div className="results-chart-section">
            <h2 className="section-title">Vote Distribution</h2>
            <div className="results-chart">
              {results.map((candidate, index) => {
                const percentage = getPercentage(candidate.vote_count);
                const isWinner = winner && candidate.id === winner.id;
                
                return (
                  <div key={candidate.id} className={`result-bar ${isWinner ? 'winner' : ''}`}>
                    <div className="result-info">
                      <div className="result-rank">#{index + 1}</div>
                      <div className="result-candidate">
                        <div className="result-avatar">
                          {candidate.image ? (
                            <img src={candidate.image} alt={candidate.name} />
                          ) : (
                            <div className="avatar-mini">
                              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <circle cx="16" cy="12" r="6" stroke="#666" strokeWidth="1.5"/>
                                <path d="M6 26C6 21 10 18 16 18C22 18 26 21 26 26" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="result-name">
                          <span className="name">{candidate.name}</span>
                          {candidate.party && <span className="party">{candidate.party}</span>}
                        </div>
                      </div>
                      <div className="result-stats">
                        <span className="votes">{candidate.vote_count} votes</span>
                        <span className="percentage">{percentage}%</span>
                      </div>
                    </div>
                    <div className="result-bar-container">
                      <div 
                        className="result-bar-fill"
                        style={{ width: `${percentage}%` }}
                      >
                        <div className="bar-shimmer"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="results-stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="#000" strokeWidth="2"/>
                  <path d="M10 16L14 20L22 11" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">{totalVotes}</div>
                <div className="stat-label">Total Votes Cast</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="12" r="6" stroke="#000" strokeWidth="2"/>
                  <path d="M6 26C6 21 10 18 16 18C22 18 26 21 26 26" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="24" cy="10" r="4" stroke="#000" strokeWidth="2"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">{results.length}</div>
                <div className="stat-label">Candidates</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M12 2L15 9H22L17 14L19 21L12 17L5 21L7 14L2 9H9L12 2Z" stroke="#000" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">{winner ? getPercentage(winner.vote_count) : 0}%</div>
                <div className="stat-label">Leading Margin</div>
              </div>
            </div>
          </div>

          {totalVotes === 0 && (
            <div className="no-results">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect x="12" y="16" width="40" height="36" rx="2" stroke="#ccc" strokeWidth="2.5"/>
                <path d="M12 24H52" stroke="#ccc" strokeWidth="2.5"/>
                <rect x="20" y="30" width="8" height="16" fill="#e0e0e0"/>
                <rect x="32" y="28" width="8" height="18" fill="#e0e0e0"/>
              </svg>
              <h3>No Votes Yet</h3>
              <p>Be the first to cast your vote!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Results;
