import React, { useState, useEffect } from 'react';
import { FiMenu, FiX, FiLogOut, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import Attendance from "./Attendance";
import Tasks from "./Tasks";
import Leave from "./Leave";

import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("attendance");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Simulate loading animation on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading animation

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear any other session data
    sessionStorage.clear();
    
    // Show logout confirmation
    console.log('👋 Employee logged out successfully');
    
    // Navigate to login page
    navigate('/login');
  };

  const renderPage = () => {
    if (active === "attendance") return <Attendance />;
    if (active === "tasks") return <Tasks />;
    if (active === "leave") return <Leave />;
    return <div className="not-found">Page not found</div>;
  };

  // Loading Animation Component
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-background">
          <div className="loading-particles">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="loading-content">
          <div className="loading-logo">
            <div className="logo-animation">
              <div className="logo-circle">
                <div className="logo-text">TB</div>
              </div>
              <div className="logo-ring"></div>
              <div className="logo-ring"></div>
              <div className="logo-ring"></div>
            </div>
          </div>
          
          <div className="loading-text">
            <h1 className="loading-title">TeamBuddy</h1>
            <p className="loading-subtitle">Employee Portal</p>
          </div>
          
          <div className="loading-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <p className="loading-message">Preparing your workspace...</p>
          </div>
          
          <div className="loading-features">
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <span>Dashboard Analytics</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📅</div>
              <span>Attendance Tracking</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✅</div>
              <span>Task Management</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="emp-layout">
      {/* Sidebar */}
      <aside className={`emp-sidebar ${open ? "open" : "closed"}`}>
        <div className="sidebar-top">
          <h2>{open ? "Employee Portal" : "EP"}</h2>
        </div>

        <nav className="sidebar-menu">
          <button
            className={active === "attendance" ? "active" : ""}
            onClick={() => setActive("attendance")}
          >
            Attendance
          </button>
          <button
            className={active === "tasks" ? "active" : ""}
            onClick={() => setActive("tasks")}
          >
            Tasks
          </button>
          <button
            className={active === "leave" ? "active" : ""}
            onClick={() => setActive("leave")}
          >
            Leave
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut />
            {open && <span>Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="emp-main">
        <header className="emp-header">
          <FiUser />
          <span>Employee</span>
        </header>

        <section className="emp-content">
          {renderPage()}
        </section>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
