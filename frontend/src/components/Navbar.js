import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid #E2E8F0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link to="/vote" style={{
          fontSize: '22px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#navGradient)"/>
            <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="navGradient" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#3B82F6"/>
                <stop offset="100%" stopColor="#1D4ED8"/>
              </linearGradient>
            </defs>
          </svg>
          VoteHub
        </Link>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '40px'
        }}>
          <div style={{ display: 'flex', gap: '32px' }}>

            <Link to="/vote" style={{
              color: '#64748B',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
              padding: '8px 0',
              fontSize: '15px'
            }}
            onMouseEnter={(e) => e.target.style.color = '#0F172A'}
            onMouseLeave={(e) => e.target.style.color = '#64748B'}>
              Vote
            </Link>
            <Link to="/voters" style={{
              color: '#64748B',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
              padding: '8px 0',
              fontSize: '15px'
            }}
            onMouseEnter={(e) => e.target.style.color = '#0F172A'}
            onMouseLeave={(e) => e.target.style.color = '#64748B'}>
              Voters
            </Link>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            paddingLeft: '32px',
            borderLeft: '1px solid #E2E8F0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#F8FAFC',
              padding: '8px 16px',
              borderRadius: '12px',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '15px'
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: '#0F172A', fontWeight: '600', fontSize: '14px' }}>
                {user?.name}
              </span>
            </div>
            <button onClick={handleLogout} style={{
              background: 'white',
              color: '#64748B',
              border: '1px solid #E2E8F0',
              padding: '10px 24px',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#F8FAFC';
              e.target.style.borderColor = '#CBD5E1';
              e.target.style.color = '#0F172A';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
              e.target.style.borderColor = '#E2E8F0';
              e.target.style.color = '#64748B';
            }}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

