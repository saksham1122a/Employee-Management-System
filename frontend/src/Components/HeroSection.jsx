// HeroSection.jsx
import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
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
              <h1>Empower Your Workforce, Elevate Your Business</h1>
              <div className="cta-container">
                <button className="cta-button">
                  Get Started
                  <FiArrowRight className="cta-icon" />
                </button>
                <a href="#learn-more" className="learn-more">
                  Learn more about us <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;