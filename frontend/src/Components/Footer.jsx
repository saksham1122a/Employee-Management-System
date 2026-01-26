import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiLinkedin, FiGithub, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import '../StyleSheets/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    { icon: <FiFacebook />, url: 'https://facebook.com', label: 'Facebook' },
    { icon: <FiTwitter />, url: 'https://twitter.com', label: 'Twitter' },
    { icon: <FiLinkedin />, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <FiGithub />, url: 'https://github.com', label: 'GitHub' },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
         
          <div className="footer-section company-section">
            <h3 className="footer-logo">TeamBuddy</h3>
            <p className="footer-description">
              Empowering organizations through intelligent workforce management solutions.
            </p>
          </div>

        
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks.map((link, index) => (
                <li key={index} className="footer-link-item">
                  <Link to={link.path} className="footer-link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

         
          <div className="footer-section">
            <h4 className="footer-title">Follow Us</h4>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <div className="newsletter">
              <p className="newsletter-text">Stay updated with our newsletter</p>
              <div className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-btn">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </div>

     
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
             {currentYear} TeamBuddy. All rights reserved.
          </p>
          <div className="legal-links">
            <Link to="/privacy" className="legal-link">Privacy Policy</Link>
            <span className="separator">|</span>
            <Link to="/terms" className="legal-link">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;