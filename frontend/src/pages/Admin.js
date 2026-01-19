import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CandidateModal from '../components/CandidateModal';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [statistics, setStatistics] = useState(null);
  const [users, setUsers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    if (user && !user.is_staff) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.is_staff) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, usersRes, candidatesRes, votesRes] = await Promise.all([
        axios.get('http://localhost:8000/api/votes/statistics/', { headers }),
        axios.get('http://localhost:8000/api/users/', { headers }),
        axios.get('http://localhost:8000/api/candidates/', { headers }),
        axios.get('http://localhost:8000/api/votes/', { headers })
      ]);

      setStatistics(statsRes.data);
      setUsers(usersRes.data);
      setCandidates(candidatesRes.data);
      setVotes(votesRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load admin data. Please try again.');
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;
    
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:8000/api/candidates/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllData();
      alert('Candidate deleted successfully');
    } catch (err) {
      alert('Failed to delete candidate');
      console.error('Error deleting candidate:', err);
    }
  };

  const handleSaveCandidate = async (formData) => {
    try {
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };

      if (editingCandidate) {
        // Update existing candidate
        await axios.put(
          `http://localhost:8000/api/candidates/${editingCandidate.id}/`,
          formData,
          { headers }
        );
        alert('Candidate updated successfully');
      } else {
        // Create new candidate
        await axios.post(
          'http://localhost:8000/api/candidates/create/',
          formData,
          { headers }
        );
        alert('Candidate created successfully');
      }
      
      fetchAllData();
      setIsModalOpen(false);
      setEditingCandidate(null);
    } catch (err) {
      console.error('Error saving candidate:', err);
      throw err;
    }
  };

  const handleAddCandidate = () => {
    setEditingCandidate(null);
    setIsModalOpen(true);
  };

  const handleEditCandidate = (candidate) => {
    setEditingCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCandidate(null);
  };

  const handleResetVotes = async () => {
    if (!window.confirm('Are you sure you want to reset ALL votes? This cannot be undone!')) return;
    
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:8000/api/votes/reset/', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAllData();
      alert('All votes have been reset');
    } catch (err) {
      alert('Failed to reset votes');
      console.error('Error resetting votes:', err);
    }
  };

  if (!user || !user.is_staff) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="error-message">Access Denied. Admin privileges required.</div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading admin panel...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ maxWidth: '1400px', padding: '20px' }}>
        <div className="card">
          <h1 style={{ marginBottom: '10px' }}>Admin Dashboard</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>Manage your voting platform</p>

          {error && <div className="error-message">{error}</div>}

          {/* Tabs */}
          <div style={{ borderBottom: '2px solid #f0f0f0', marginBottom: '30px' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <button
                onClick={() => setActiveTab('overview')}
                style={{
                  padding: '10px 20px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'overview' ? '3px solid #007bff' : '3px solid transparent',
                  color: activeTab === 'overview' ? '#007bff' : '#666',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                style={{
                  padding: '10px 20px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'users' ? '3px solid #007bff' : '3px solid transparent',
                  color: activeTab === 'users' ? '#007bff' : '#666',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('candidates')}
                style={{
                  padding: '10px 20px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'candidates' ? '3px solid #007bff' : '3px solid transparent',
                  color: activeTab === 'candidates' ? '#007bff' : '#666',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                Candidates ({candidates.length})
              </button>
              <button
                onClick={() => setActiveTab('votes')}
                style={{
                  padding: '10px 20px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === 'votes' ? '3px solid #007bff' : '3px solid transparent',
                  color: activeTab === 'votes' ? '#007bff' : '#666',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                Votes ({votes.length})
              </button>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && statistics && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={{ 
                  padding: '25px', 
                  background: '#fff', 
                  borderRadius: '8px', 
                  border: '1px solid #dee2e6'
                }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px', fontWeight: '600' }}>Total Users</h3>
                  <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: '#1a1a1a' }}>{users.length}</p>
                </div>
                <div style={{ 
                  padding: '25px', 
                  background: '#fff', 
                  borderRadius: '8px', 
                  border: '1px solid #dee2e6'
                }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px', fontWeight: '600' }}>Total Votes</h3>
                  <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: '#1a1a1a' }}>{statistics.total_votes}</p>
                </div>
                <div style={{ 
                  padding: '25px', 
                  background: '#fff', 
                  borderRadius: '8px', 
                  border: '1px solid #dee2e6'
                }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px', fontWeight: '600' }}>Total Candidates</h3>
                  <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: '#1a1a1a' }}>{candidates.length}</p>
                </div>
                <div style={{ 
                  padding: '25px', 
                  background: '#fff', 
                  borderRadius: '8px', 
                  border: '1px solid #dee2e6'
                }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px', fontWeight: '600' }}>Voter Turnout</h3>
                  <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: '#1a1a1a' }}>
                    {users.length > 0 ? Math.round((statistics.total_votes / users.length) * 100) : 0}%
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '30px' }}>
                <h3 style={{ marginBottom: '20px', color: '#1a1a1a' }}>Top Candidates</h3>
                {statistics.candidates_by_votes.slice(0, 5).map((candidate, index) => (
                  <div key={candidate.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '15px',
                    marginBottom: '10px',
                    background: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #dee2e6'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ 
                        fontSize: '18px', 
                        fontWeight: 'bold', 
                        color: '#666',
                        width: '35px',
                        height: '35px',
                        background: '#f8f9fa',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {index + 1}
                      </span>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1a1a1a', fontSize: '16px' }}>{candidate.name}</div>
                        <div style={{ fontSize: '13px', color: '#666' }}>Team {candidate.team_id}</div>
                      </div>
                    </div>
                    <div style={{ 
                      fontWeight: 'bold', 
                      fontSize: '20px', 
                      color: '#1a1a1a',
                      padding: '8px 16px'
                    }}>
                      {candidate.vote_count}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ 
                marginTop: '30px', 
                padding: '20px', 
                background: '#fff', 
                borderRadius: '8px', 
                border: '1px solid #dee2e6'
              }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1a1a1a', fontWeight: '600' }}>Danger Zone</h3>
                <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666' }}>
                  These actions are irreversible. Please be certain before proceeding.
                </p>
                <button
                  onClick={handleResetVotes}
                  className="btn"
                  style={{ background: '#dc3545', color: 'white' }}
                >
                  Reset All Votes
                </button>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Auth Provider</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Has Voted</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Admin</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, index) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: '12px' }}>{u.name}</td>
                        <td style={{ padding: '12px' }}>{u.email}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            background: u.auth_provider === 'local' ? '#e7f5ff' : '#fff3cd',
                            color: u.auth_provider === 'local' ? '#0c63e4' : '#856404',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}>
                            {u.auth_provider}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {u.has_voted ? '✅' : '❌'}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {u.is_staff ? '👑' : ''}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Candidates Tab */}
          {activeTab === 'candidates' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <button
                  onClick={handleAddCandidate}
                  className="btn btn-primary"
                >
                  + Add New Candidate
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {candidates.map((candidate) => (
                  <div key={candidate.id} style={{ 
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    {candidate.photo && (
                      <img 
                        src={candidate.photo} 
                        alt={candidate.name}
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <div style={{ padding: '15px' }}>
                      <h3 style={{ margin: '0 0 5px 0' }}>{candidate.name}</h3>
                      <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
                        Team {candidate.team_id}
                      </p>
                      {candidate.description && (
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                          {candidate.description.substring(0, 100)}...
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleEditCandidate(candidate)}
                          className="btn"
                          style={{ background: '#007bff', color: 'white', flex: 1 }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCandidate(candidate.id)}
                          className="btn"
                          style={{ background: '#dc3545', color: 'white', flex: 1 }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Votes Tab */}
          {activeTab === 'votes' && (
            <div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Voter</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Candidate</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Team</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Voted At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {votes.map((vote) => (
                      <tr key={vote.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                        <td style={{ padding: '12px' }}>{vote.user?.name || vote.user?.email}</td>
                        <td style={{ padding: '12px' }}>{vote.candidate?.name}</td>
                        <td style={{ padding: '12px' }}>Team {vote.candidate?.team_id}</td>
                        <td style={{ padding: '12px' }}>
                          {new Date(vote.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Modal */}
      <CandidateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCandidate}
        candidate={editingCandidate}
      />
    </>
  );
};

export default Admin;
