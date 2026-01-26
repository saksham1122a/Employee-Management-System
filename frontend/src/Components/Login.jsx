import React from "react";
import { Link } from "react-router-dom";
import "../StyleSheets/Auth.css";

const Login = () => {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to continue with TeamBuddy</p>

        <form className="auth-form">
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" />
          </div>

          <div className="form-options">
            <label className="remember">
              <input type="checkbox" /> Remember me
            </label>
           <Link to="/forgetpassword" className="forgot-link">Forgot Password?</Link>
          </div>

          <button type="submit" className="auth-btn">Login</button>

          <p className="switch-text">
            Don’t have an account? <Link to="/signup">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
