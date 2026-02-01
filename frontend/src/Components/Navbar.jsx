import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../StyleSheets/Navbar.css';
import { FiUser, FiLogOut, FiSettings, FiMail, FiEdit2 } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [newName, setNewName] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAuth = () => {
      try {
        const token = sessionStorage.getItem('token');
        if (token) {
          const userData = JSON.parse(sessionStorage.getItem('user'));
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setUser(null);
      }
    };

    // Check on mount
    checkUserAuth();

    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = () => {
      checkUserAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Check more frequently for immediate updates
    const interval = setInterval(checkUserAuth, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setShowNameEdit(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getProfileLetter = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return <FiUser className="user-icon" />;
  };

  const getDisplayName = () => {
    if (user?.name) {
      return user.name;
    }
    if (user?.email) {
      return user.email.split('@')[0]; // Show part before @ as display name
    }
    return 'User';
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    setDropdownOpen(false);
    navigate('/');
  };

  const handleNameEdit = () => {
    setNewName(user?.name || '');
    setShowNameEdit(true);
  };

  const handleNameSave = async () => {
    if (!newName.trim()) return;

    try {
      // Update backend (you'll need to create this API endpoint)
      const res = await fetch('http://localhost:5000/api/auth/update-name', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: newName.trim() })
      });

      if (res.ok) {
        // Update local storage and state
        const updatedUser = { ...user, name: newName.trim() };
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setShowNameEdit(false);
      }
    } catch (error) {
      console.error('Error updating name:', error);
    }
  };

  const handleNameCancel = () => {
    setShowNameEdit(false);
    setNewName('');
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">TeamBuddy</Link>
          
          <div className={`nav-links ${isOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            
            {user ? (
              <div className="profile-dropdown" ref={dropdownRef}>
                <div 
                  className="profile-icon"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {getProfileLetter()}
                </div>
                
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="profile-avatar">
                        {getProfileLetter()}
                      </div>
                      <div className="user-info">
                        <div className="user-name">{getDisplayName()}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <div className="dropdown-item">
                      <FiMail className="item-icon" />
                      <span>{user.email}</span>
                    </div>
                    
                    <div className="dropdown-item" onClick={handleNameEdit}>
                      <FiEdit2 className="item-icon" />
                      <span>Edit Name</span>
                    </div>
                    
                    <div className="dropdown-item">
                      <FiSettings className="item-icon" />
                      <span>Settings</span>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <div className="dropdown-item logout-item" onClick={handleLogout}>
                      <FiLogOut className="item-icon" />
                      <span>Logout</span>
                    </div>
                  </div>
                )}

                {/* Name Edit Modal */}
                {showNameEdit && (
                  <div className="edit-name-modal">
                    <div className="modal-content">
                      <h3>Edit Name</h3>
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Enter your name"
                        className="name-input"
                        autoFocus
                      />
                      <div className="modal-buttons">
                        <button onClick={handleNameCancel} className="cancel-btn">
                          Cancel
                        </button>
                        <button onClick={handleNameSave} className="save-btn">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn login-btn">Login</Link>
                <Link to="/signup" className="btn signup-btn">Sign Up</Link>
              </div>
            )}
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