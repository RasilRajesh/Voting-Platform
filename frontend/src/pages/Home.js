import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Premium Navigation Bar */}
      <nav className="home-navbar">
        <div className="nav-content">
          <Link to="/" className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#logoGradient)"/>
              <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="logoGradient" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#3B82F6"/>
                  <stop offset="100%" stopColor="#1D4ED8"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="logo-text">VoteHub</span>
          </Link>
          <div className="nav-links">
            <Link to="/login" className="nav-link-btn">Sign In</Link>
            <Link to="/signup" className="nav-link-btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Completely Redesigned */}
      <section className="hero-section-modern">
        <div className="hero-container">
          <div className="hero-content-modern">
          
            
            <h1 className="hero-title-modern">
              Democracy Made
              <br />
              <span className="gradient-text">Simple & Secure</span>
            </h1>
            
            <p className="hero-subtitle-modern">
              Experience the future of voting with our premium platform. 
              Cast your vote securely, transparently, and with complete confidence.
            </p>
            
            <div className="hero-buttons-modern">
              <Link to="/signup" className="btn-hero-primary-modern">
                <span>Start Voting</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/login" className="btn-hero-secondary-modern">
                <span>Sign In</span>
            </Link>
            </div>

            {/* Stats */}
            <div className="hero-stats-modern">
              <div className="stat-modern">
                <div className="stat-value">100%</div>
                <div className="stat-label">Secure</div>
              </div>
              <div className="stat-divider-modern"></div>
              <div className="stat-modern">
                <div className="stat-value">Real-Time</div>
                <div className="stat-label">Updates</div>
              </div>
              <div className="stat-divider-modern"></div>
              <div className="stat-modern">
                <div className="stat-value">Verified</div>
                <div className="stat-label">Platform</div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hero-visual-modern">
            <div className="floating-card card-1">
              <div className="card-icon-modern">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11L12 14L22 4" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="card-content-modern">
                <div className="card-title-modern">Vote Verified</div>
                <div className="card-desc-modern">Secured & Encrypted</div>
              </div>
            </div>

            <div className="floating-card card-2">
              <div className="card-icon-modern">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="card-content-modern">
                <div className="card-title-modern">Transparent</div>
                <div className="card-desc-modern">Real-time Results</div>
              </div>
            </div>

            <div className="floating-card card-3">
              <div className="card-icon-modern">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 22V12" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 9.5V16.5C7 16.5 9 18 12 18C15 18 17 16.5 17 16.5V9.5" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="card-content-modern">
                <div className="card-title-modern">Privacy First</div>
                <div className="card-desc-modern">Your Data Protected</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section-modern">
        <div className="container-modern">
          <div className="section-header-modern">
            <div className="section-badge-modern">Features</div>
            <h2 className="section-title-modern">Why Choose VoteHub?</h2>
            <p className="section-subtitle-modern">
              Everything you need for secure, transparent, and efficient voting
            </p>
          </div>

          <div className="features-grid-modern">
            <div className="feature-card-modern">
              <div className="feature-icon-modern blue">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 22V12" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 9.5V16.5C7 16.5 9 18 12 18C15 18 17 16.5 17 16.5V9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="feature-title-modern">Bank-Level Security</h3>
              <p className="feature-desc-modern">
                Your vote is protected with military-grade encryption. Every transaction is secure and verifiable.
              </p>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon-modern green">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="feature-title-modern">One-Click Voting</h3>
              <p className="feature-desc-modern">
                Cast your vote in seconds with our intuitive interface. No complicated forms or lengthy processes.
              </p>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon-modern purple">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="feature-title-modern">Real-Time Results</h3>
              <p className="feature-desc-modern">
                Watch results update live as votes are cast. Complete transparency throughout the voting process.
              </p>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon-modern orange">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="feature-title-modern">Verified Candidates</h3>
              <p className="feature-desc-modern">
                All candidates are authenticated and verified. Make informed decisions with complete profiles.
              </p>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon-modern teal">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="feature-title-modern">Fully Responsive</h3>
              <p className="feature-desc-modern">
                Vote from any device - desktop, tablet, or mobile. Seamless experience everywhere.
              </p>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon-modern pink">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M23 21V19C23 17.9391 22.5786 16.9217 21.8284 16.1716C21.0783 15.4214 20.0609 15 19 15H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="feature-title-modern">Community Driven</h3>
              <p className="feature-desc-modern">
                Connect with other voters. View public voter lists and participate in transparent democracy.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="cta-section-modern">
        <div className="cta-container">
          <div className="cta-content-modern">
            <h2 className="cta-title-modern">Ready to Make Your Voice Heard?</h2>
            <p className="cta-subtitle-modern">
              Join our platform today and participate in secure, transparent voting
            </p>
            <div className="cta-buttons-modern">
              <Link to="/signup" className="cta-btn-primary">
                <span>Create Free Account</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/login" className="cta-btn-secondary">
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-modern white-footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill="#F1F5F9"/>
                  <path d="M10 16L14 20L22 12" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{color: '#0F172A'}}>VoteHub</span>
              </div>
              <p className="footer-tagline" style={{color: '#64748B'}}>Secure & transparent online voting platform</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p style={{color: '#94A3B8'}}>&copy; 2026 VoteHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
        