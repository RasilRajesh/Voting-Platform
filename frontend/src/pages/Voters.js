import React, { useEffect, useState } from 'react';
import '../HomeResponsive.css';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Voters = () => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/votes/voters/');
      setVoters(response.data);
    } catch (err) {
      setError('Failed to load voters. Please try again.');
      console.error('Error fetching voters:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFB 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid #E2E8F0',
              borderTopColor: '#3B82F6',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 20px'
            }} />
            <p style={{ color: '#64748B', fontSize: '16px', fontWeight: '500' }}>Loading voters...</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="voters-container-premium">
        {/* Header */}
        <div className="voters-header-premium">
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
            <span style={{ color: '#1E40AF', fontWeight: '600', fontSize: '14px' }}>Community</span>
          </div>
          <h1 className="voters-title-premium">Voters List</h1>
          <p className="voters-subtitle-premium">
            {voters.length} {voters.length === 1 ? 'person has' : 'people have'} participated in voting
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto 32px',
            background: '#FEE2E2',
            color: '#991B1B',
            padding: '16px 24px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #FECACA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 6V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="10" cy="14" r="1" fill="currentColor"/>
            </svg>
            <span style={{ fontWeight: '600' }}>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {voters.length === 0 ? (
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center',
            background: 'white',
            padding: '60px 40px',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M16 20C16 25.5228 20.4772 30 26 30C31.5228 30 36 25.5228 36 20C36 14.4772 31.5228 10 26 10C20.4772 10 16 14.4772 16 20Z" stroke="#3B82F6" strokeWidth="3"/>
                <path d="M8 42C8 34.268 14.268 28 22 28H30C37.732 28 44 34.268 44 42" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#0F172A', 
              marginBottom: '12px' 
            }}>
              No Votes Cast Yet
            </h3>
            <p style={{ 
              fontSize: '16px', 
              color: '#64748B', 
              lineHeight: '1.6' 
            }}>
              Be the first to participate in this voting session!
            </p>
          </div>
        ) : (
          <div className="voters-grid-premium">
            {voters.map((voter, index) => (
              <div key={voter.id} className="voter-card-premium">
                <div className="voter-info-premium">
                  <div className="voter-avatar-premium">
                    {voter.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="voter-details-premium">
                    <h3 className="voter-name-premium">{voter.name}</h3>
                    <span className="voter-id-premium">Voter #{index + 1}</span>
                  </div>
                </div>
                {voter.linkedin_url ? (
                  <a
                    href={voter.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="voter-linkedin-premium"
                  >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path d="M18.5 0h-17C0.675 0 0 0.675 0 1.5v17C0 19.325 0.675 20 1.5 20h17c0.825 0 1.5-0.675 1.5-1.5v-17C20 0.675 19.325 0 18.5 0zM6 17H3V8h3V17zM4.5 6.5C3.675 6.5 3 5.825 3 5s0.675-1.5 1.5-1.5S6 4.175 6 5 5.325 6.5 4.5 6.5zM17 17h-3v-4.5c0-1.125-0.375-1.875-1.313-1.875-0.713 0-1.137 0.488-1.325 0.95-0.063 0.175-0.087 0.4-0.087 0.65V17h-3s0.038-7.5 0-8.25h3v1.175c0.4-0.612 1.113-1.487 2.7-1.487 1.975 0 3.45 1.287 3.45 4.05V17h-0.025z" fill="#0A66C2"/>
                    </svg>
                    <span>View LinkedIn</span>
                  </a>
                ) : (
                  <div style={{
                    padding: '10px 16px',
                    background: '#F8FAFC',
                    borderRadius: '10px',
                    color: '#94A3B8',
                    fontSize: '14px',
                    fontWeight: '500',
                    textAlign: 'center'
                  }}>
                    No LinkedIn profile
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Voters;

