import React from 'react';
import { FiArrowRight, FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiTwitter, FiInstagram } from 'react-icons/fi';
import '../StyleSheets/LearnMore.css';
import Footer from './Footer';

const LearnMore = () => {
  const profileImage = '/src/assets/profile.jpeg';
  
  return (
    <div className="learn-more-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="gradient-text">Meet the Developer</span>
              </h1>
              <p className="hero-subtitle">
                Crafting innovative solutions with passion and precision
              </p>
              <div className="hero-features">
                <div className="feature-item">
                  <div className="feature-icon">🚀</div>
                  <span>Full Stack Development</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">💡</div>
                  <span>Creative Problem Solving</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">⚡</div>
                  <span>Modern Technologies</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hero-right">
            <div className="profile-card">
              <div className="profile-image-wrapper">
                <img 
                  src={profileImage} 
                  alt="Saksham" 
                  className="profile-image"
                  onError={(e) => {
                    console.log('Image failed to load, trying fallback');
                    e.target.src = '/assets/profile.jpeg';
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully');
                  }}
                />
                <div className="profile-overlay"></div>
              </div>
              <div className="profile-info">
                <h3>Saksham</h3>
                <p>Full Stack Developer</p>
                <div className="profile-badges">
                  <span className="badge">React</span>
                  <span className="badge">Node.js</span>
                  <span className="badge">UI/UX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="developer-section">
        <div className="container">
          <div className="developer-card">
            <div className="developer-image-container">
              <div className="image-wrapper">
                <img 
                  src={profileImage} 
                  alt="Saksham" 
                  className="developer-image"
                  onError={(e) => {
                    console.log('Image failed to load, trying fallback');
                    e.target.src = '/assets/profile.jpeg';
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully');
                  }}
                />
                <div className="image-overlay"></div>
                <div className="image-border"></div>
              </div>
              <div className="social-links">
                <a href="#" className="social-link github">
                  <FiGithub />
                </a>
                <a href="#" className="social-link linkedin">
                  <FiLinkedin />
                </a>
                <a href="#" className="social-link twitter">
                  <FiTwitter />
                </a>
                <a href="#" className="social-link instagram">
                  <FiInstagram />
                </a>
              </div>
            </div>
            
            <div className="developer-info">
              <div className="developer-header">
                <h2 className="developer-name">Saksham</h2>
                <p className="developer-title">Full Stack Developer</p>
                <div className="developer-badges">
                  <span className="badge">React </span>
                  <span className="badge">Node.js</span>
                  <span className="badge">MongoDB</span>
                </div>
              </div>
              
              <div className="developer-bio">
                <p className="bio-text">
                  Passionate developer with a keen eye for creating elegant, efficient, and scalable web applications. 
                  Specializing in modern JavaScript frameworks and creating seamless user experiences that bridge 
                  the gap between functionality and aesthetics.
                </p>
              </div>
              
              <div className="skills-section">
                <h3 className="skills-title">Technical Expertise</h3>
                <div className="skills-grid">
                  <div className="skill-item">
                    <div className="skill-icon">⚛️</div>
                    <div className="skill-info">
                      <h4>Frontend Development</h4>
                      <p>React, HTML, CSS, JavaScript, Tailwind CSS</p>
                    </div>
                  </div>
                  <div className="skill-item">
                    <div className="skill-icon">🔧</div>
                    <div className="skill-info">
                      <h4>Backend Development</h4>
                      <p>Node.js, Express, MongoDB</p>
                    </div>
                  </div>
                 
                  <div className="skill-item">
                    <div className="skill-icon">☁️</div>
                    <div className="skill-info">
                      <h4> DevOps</h4>
                      <p>Docker, Git</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="achievements-section">
                <h3 className="achievements-title">Achievements & Projects</h3>
                <div className="achievements-grid">
                  <div className="achievement-card">
                    <div className="achievement-icon">🏆</div>
                    <h4>Employee Management System</h4>
                    <p>Comprehensive HR management solution with real-time analytics</p>
                  </div>
                  <div className="achievement-card">
                    <div className="achievement-icon">⭐</div>
                    <h4>E-commerce Platform</h4>
                    <p>Scalable online marketplace with advanced features</p>
                  </div>
                  <div className="achievement-card">
                    <div className="achievement-icon">🚀</div>
                    <h4>ResolveX</h4>
                    <p>Complaint Resolution System</p>
                  </div>
                </div>
              </div>
              
              
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LearnMore;