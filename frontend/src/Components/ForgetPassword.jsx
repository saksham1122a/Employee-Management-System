import React from "react";
import { Link } from "react-router-dom";
import "../StyleSheets/ForgetPassword.css";

const ForgetPassword = () => {
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Forgot Password?</h2>
        <p className="auth-subtitle">
          Enter your email and we’ll send you a reset link
        </p>

        <form className="auth-form">
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your registered email" />
          </div>

          <button type="submit" className="auth-btn">
            Send Reset Link
          </button>

          <p className="switch-text">
            Remember your password? <Link to="/login">Back to Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
