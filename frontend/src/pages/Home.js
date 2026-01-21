import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import '../HomeResponsive.css';

const Home = () => {
  return (
    <div className="home-responsive-root">
      {/* Minimal Navigation */}
      <nav className="home-responsive-nav">
        <div className="home-responsive-nav-inner">
          <Link to="/" className="home-responsive-logo-link">
            <div className="home-responsive-logo">V</div>
            <span>SecureVote</span>
          </Link>
          <div className="home-responsive-nav-actions">
            <Link to="/login" className="home-responsive-signin">Sign In</Link>
            <Link to="/signup" className="home-responsive-getstarted">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: 'clamp(60px, 10vw, 120px) clamp(20px, 4vw, 40px)',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: 'clamp(42px, 5vw, 64px)',
            fontWeight: '800',
            color: '#0F172A',
            lineHeight: '1.1',
            letterSpacing: '-0.03em',
            marginBottom: '24px'
          }}>
            Democracy Made
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Simple & Secure
            </span>
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: '#64748B',
            lineHeight: '1.6',
            marginBottom: 'clamp(32px, 5vw, 40px)',
            fontWeight: '400',
            padding: '0 clamp(10px, 2vw, 0)'
          }}>
            Vote on a platform built for security, transparency, and trust.
          </p>
          <div style={{
            display: 'flex',
            gap: 'clamp(12px, 2vw, 16px)',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link to="/signup" style={{
              background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
              color: 'white',
              textDecoration: 'none',
              padding: 'clamp(14px, 2.5vw, 16px) clamp(24px, 4vw, 32px)',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: 'clamp(15px, 2vw, 16px)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
            }}>
              Start Voting
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/login" style={{
              background: 'white',
              color: '#0F172A',
              textDecoration: 'none',
              padding: 'clamp(14px, 2.5vw, 16px) clamp(24px, 4vw, 32px)',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: 'clamp(15px, 2vw, 16px)',
              border: '1.5px solid #E2E8F0',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#CBD5E1';
              e.target.style.background = '#F8FAFC';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#E2E8F0';
              e.target.style.background = 'white';
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: 'clamp(60px, 10vw, 100px) clamp(20px, 4vw, 40px)',
        background: '#F8FAFC'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: 'clamp(40px, 8vw, 64px)'
          }}>
            <h2 style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: '800',
              color: '#0F172A',
              letterSpacing: '-0.02em',
              marginBottom: '16px'
            }}>
                Why Choose SecureVote?
            </h2>
            <p style={{
              fontSize: 'clamp(16px, 2.5vw, 18px)',
              color: '#64748B',
              maxWidth: '600px',
              margin: '0 auto',
              padding: '0 clamp(10px, 2vw, 0)'
            }}>
              Everything you need for secure, transparent, and efficient voting
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(24px, 4vw, 32px)',
            marginTop: 'clamp(40px, 8vw, 64px)'
          }}>
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: 'One-Click Voting',
                description: 'Cast your vote in seconds with our intuitive interface. No complicated forms or lengthy processes.',
                color: '#10B981'
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: 'Verified Candidates',
                description: 'All candidates are authenticated and verified. Make informed decisions with complete profiles.',
                color: '#F59E0B'
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Fully Responsive',
                description: 'Vote from any device - desktop, tablet, or mobile. Seamless experience everywhere.',
                color: '#06B6D4'
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M23 21V19C23 17.9391 22.5786 16.9217 21.8284 16.1716C21.0783 15.4214 20.0609 15 19 15H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: 'Community Driven',
                description: 'Connect with other voters. View public voter lists and participate in transparent democracy.',
                color: '#EC4899'
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 1C8.13 1 5 4.13 5 8C5 13.25 12 23 12 23C12 23 19 13.25 19 8C19 4.13 15.87 1 12 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                ),
                title: 'Anonymous Voting',
                description: 'Your vote remains completely private and anonymous. Vote with confidence knowing your choice is protected.',
                color: '#667EEA'
              }
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  padding: 'clamp(28px, 5vw, 40px)',
                  borderRadius: '16px',
                  border: '1px solid #F1F5F9',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#F1F5F9';
                }}
              >
                <div style={{
                  width: 'clamp(48px, 7vw, 56px)',
                  height: 'clamp(48px, 7vw, 56px)',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${feature.color}15 0%, ${feature.color}25 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: feature.color,
                  marginBottom: 'clamp(20px, 3vw, 24px)'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: 'clamp(20px, 3vw, 22px)',
                  fontWeight: '700',
                  color: '#0F172A',
                  marginBottom: '12px',
                  letterSpacing: '-0.01em'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  color: '#64748B',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: 'clamp(60px, 10vw, 100px) clamp(20px, 4vw, 40px)',
        background: 'linear-gradient(135deg, #667EEA15 0%, #764BA215 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: '800',
            color: '#0F172A',
            letterSpacing: '-0.02em',
            marginBottom: '20px'
          }}>
            Ready to Make Your Voice Heard?
          </h2>
          <p style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: '#64748B',
            marginBottom: 'clamp(32px, 5vw, 40px)',
            lineHeight: '1.6',
            padding: '0 clamp(10px, 2vw, 0)'
          }}>
            Join our platform today and participate in secure, transparent voting
          </p>
          <div style={{
            display: 'flex',
            gap: 'clamp(12px, 2vw, 16px)',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link to="/signup" style={{
              background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
              color: 'white',
              textDecoration: 'none',
              padding: 'clamp(14px, 2.5vw, 16px) clamp(24px, 4vw, 32px)',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: 'clamp(15px, 2vw, 16px)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
            }}>
              Create Free Account
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/login" style={{
              background: 'white',
              color: '#0F172A',
              textDecoration: 'none',
              padding: 'clamp(14px, 2.5vw, 16px) clamp(24px, 4vw, 32px)',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: 'clamp(15px, 2vw, 16px)',
              border: '1.5px solid #E2E8F0',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#CBD5E1';
              e.target.style.background = '#F8FAFC';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#E2E8F0';
              e.target.style.background = 'white';
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: 'clamp(40px, 8vw, 60px) clamp(20px, 4vw, 40px) clamp(30px, 5vw, 40px)',
        background: 'white',
        borderTop: '1px solid #F1F5F9'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '700',
              fontSize: '16px'
            }}>
              V
            </div>
            <span style={{
              color: '#0F172A',
              fontWeight: '700',
              fontSize: '18px'
            }}>
                SecureVote
            </span>
          </div>
          <p style={{
            color: '#94A3B8',
            fontSize: '14px',
            margin: 0
          }}>
              9 2026 SecureVote. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
