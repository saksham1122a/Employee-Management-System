import React from 'react';
import '../StyleSheets/About.css';
import { FiUsers, FiClock, FiShield, FiTrendingUp } from 'react-icons/fi';

const About = () => {
  return (
    <section className="about-section">
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