import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../StyleSheets/Auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      sessionStorage.setItem("token", data.token);   // Use sessionStorage instead of localStorage
      sessionStorage.setItem("user", JSON.stringify(data.user));  // Use sessionStorage instead of localStorage

      // Role-based redirect
      const role = data.user.role;

      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "manager") navigate("/manager/dashboard");
      else navigate("/employee/dashboard");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to continue with TeamBuddy</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-options">
            <label className="remember">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgetpassword" className="forgot-link">
              Forgot Password?
            </Link>
          </div>

          {error && <p style={{ color: "red", fontSize: "0.85rem" }}>{error}</p>}

          <button type="submit" className="auth-btn">
            Login
          </button>

          <p className="switch-text">
            Don’t have an account? <Link to="/signup">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
