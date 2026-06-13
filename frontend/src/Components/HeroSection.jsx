import React from 'react';
import { FiArrowRight, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import videoSource from '../images/From KlickPin CF vector animation video nel 2025 _ Video.mp4';
import '../StyleSheets/HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src={videoSource} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay">
          <div className="hero-content">
            <div className="hero-text">

              <div className="hero-badge">
                <FiUsers className="badge-icon" />
                <span>Modern Employee Management</span>
              </div>

              <h1>
                Empower Your Team, <span className="hero-highlight">Elevate</span> Your Business.
              </h1>

              <div className="cta-container">
                <Link to="/signup" className="cta-button">
                  Get Started Free
                  <FiArrowRight className="cta-icon" />
                </Link>
                <Link to="/learn-more" className="learn-more">
                  See how it works <span className="learn-arrow">→</span>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;