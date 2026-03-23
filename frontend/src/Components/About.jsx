import React from 'react';
import '../StyleSheets/About.css';
import { FiUsers, FiClock, FiShield, FiTrendingUp } from 'react-icons/fi';

const About = () => {
  return (
    <section className="about-section">
      {/* Animated Background */}
      <div className="animated-background">
        {/* Primary Gradient Layer */}
        <div className="gradient-layer gradient-1"></div>
        <div className="gradient-layer gradient-2"></div>
        
        {/* Floating Geometric Shapes */}
        <div className="geometric-shapes">
          <div className="shape shape-circle-1"></div>
          <div className="shape shape-circle-2"></div>
          <div className="shape shape-triangle-1"></div>
          <div className="shape shape-square-1"></div>
          <div className="shape shape-hexagon-1"></div>
          <div className="shape shape-circle-3"></div>
          <div className="shape shape-triangle-2"></div>
          <div className="shape shape-square-2"></div>
        </div>
        
        {/* Light Particles */}
        <div className="particles-container">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Abstract Wave Motions */}
        <div className="wave-container">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>
        
        {/* Subtle Grid Pattern */}
        <div className="grid-pattern"></div>
      </div>

      {/* Main Content */}
      <div className="about-container">
        <div className="about-header">
          <h2>About TeamBuddy</h2>
          <p className="subtitle">Empowering Organizations Through Intelligent Workforce Management</p>
        </div>

        <div className="about-content">
          <div className="about-text">
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <FiUsers size={32} />
                </div>
                <h3>Employee Management</h3>
                <p>Centralized employee database with detailed profiles and performance tracking.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <FiClock size={32} />
                </div>
                <h3>Time & Attendance</h3>
                <p>Automated time tracking and attendance management for accurate payroll processing.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <FiShield size={32} />
                </div>
                <h3>Data Security</h3>
                <p>Enterprise-grade security to protect your sensitive employee information.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <FiTrendingUp size={32} />
                </div>
                <h3>Performance Analytics</h3>
                <p>Comprehensive reports and insights to drive better business decisions.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mission-vision">
          <div className="mission">
            <h3>Our Mission</h3>
            <p>To simplify HR operations and empower organizations to focus on what truly matters - their people and growth.</p>
          </div>
          <div className="vision">
            <h3>Our Vision</h3>
            <p>To become the most trusted partner in workforce management solutions globally.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;