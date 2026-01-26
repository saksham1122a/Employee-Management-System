import React from "react";
import { Link } from "react-router-dom";
import "../StyleSheets/Auth.css";

const Signup = () => {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join TeamBuddy and manage smarter</p>

        <form className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your name" />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Create password" />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm password" />
          </div>

          <button type="submit" className="auth-btn">Create Account</button>

          <p className="switch-text">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
