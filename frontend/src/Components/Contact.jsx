import React from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiLinkedin, FiTwitter, FiGithub } from 'react-icons/fi';
import '../StyleSheets/Contact.css';

const Contact = () => {
  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p className="contact-intro">
              Have questions or want to discuss how TeamBuddy can transform your workforce management? 
              Our team is here to help you every step of the way.
            </p>
            
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">
                  <FiMail />
                </div>
                <div>
                  <h4>Email Us</h4>
                  <p>support@teambuddy.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <FiPhone />
                </div>
                <div>
                  <h4>Call Us</h4>
                  <p>+1 (555) 123-4567</p>
                  <p>Mon - Fri, 9am - 6pm EST</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <FiMapPin />
                </div>
                <div>
                  <h4>Visit Us</h4>
                  <p>Vishal Nagar </p>
                  <p>Ludhiana, Punjab 141001, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <div className="contact-form-wrapper">
              <h3>Send us a Message</h3>
              <form className="contact-form">
                <div className="form-group">
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Email Address" required />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Subject" />
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" rows="5" required></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  <FiSend className="btn-icon" /> Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;