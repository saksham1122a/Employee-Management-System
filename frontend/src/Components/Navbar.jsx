import React, { useState } from 'react';
import '../StyleSheets/Navbar.css';
import { FiUser } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">TeamBuddy</div>
          
          <div className={`nav-links ${isOpen ? 'active' : ''}`}>
            <a href="#home" className="nav-link">Home</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
            <div className="auth-buttons">
              <button className="btn login-btn">Login</button>
              <button className="btn signup-btn">Sign Up</button>
            </div>
             <div className="profile-icon">
              <FiUser className="user-icon" />
            </div>
          </div>

          <div 
            className={`hamburger ${isOpen ? 'active' : ''}`} 
            onClick={() => setIsOpen(!isOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
