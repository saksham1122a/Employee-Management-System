import React from 'react';
import '../StyleSheets/About.css';
import { FiUsers, FiClock, FiShield, FiTrendingUp, FiAward, FiGlobe, FiActivity } from 'react-icons/fi';

const About = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        
        <div className="about-header">
          <div className="badge">
            <FiAward className="badge-icon" />
            <span>Industry Leader in HR Tech</span>
          </div>
          <h2>Transforming Workforce Management</h2>
          <p className="subtitle">
            We build intelligent, intuitive tools that empower organizations to focus less on administrative overhead and more on their people.
          </p>
        </div>

        {/* Modern Stats Section */}
        <div className="about-stats">
          <div className="stat-card">
            <div className="stat-icon-wrapper"><FiGlobe /></div>
            <h3 className="stat-number">500+</h3>
            <p className="stat-label">Global Companies</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper"><FiUsers /></div>
            <h3 className="stat-number">1M+</h3>
            <p className="stat-label">Employees Managed</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper"><FiActivity /></div>
            <h3 className="stat-number">99.9%</h3>
            <p className="stat-label">System Uptime</p>
          </div>
        </div>

        <div className="about-content">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FiUsers size={28} />
              </div>
              <h3>Employee Management</h3>
              <p>Centralized employee database with detailed profiles, performance tracking, and seamless onboarding flows.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiClock size={28} />
              </div>
              <h3>Time & Attendance</h3>
              <p>Automated time tracking and attendance management integrated directly with your payroll processing.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiShield size={28} />
              </div>
              <h3>Enterprise Security</h3>
              <p>Bank-grade encryption, role-based access control, and comprehensive audit logs to protect sensitive data.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FiTrendingUp size={28} />
              </div>
              <h3>Performance Analytics</h3>
              <p>Actionable insights, custom reports, and predictive analytics to drive better business decisions.</p>
            </div>
          </div>
        </div>

        <div className="mission-vision">
          <div className="mission-card">
            <div className="card-glow"></div>
            <h3>Our Mission</h3>
            <p>To radically simplify HR operations and build software that teams actually love using, empowering organizations to focus on what truly matters — their people and their growth.</p>
          </div>
          <div className="vision-card">
            <div className="card-glow"></div>
            <h3>Our Vision</h3>
            <p>To become the global standard for workforce management, setting a new benchmark for how businesses interact with and support their teams every single day.</p>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default About;