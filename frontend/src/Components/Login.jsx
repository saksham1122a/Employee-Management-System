import React from "react";
import { Link } from 'react-router-dom';
import "../StyleSheets/Login.css";


const Login = () => {
return (
<div className="auth-wrapper">
<div className="auth-card">
<h2 className="auth-title">Login to TeamBuddy</h2>
<p className="auth-subtitle">Manage your team efficiently</p>


<form className="auth-form">
<div className="input-group">
<label>Email</label>
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
<a href="/forgot" className="forgot-link">Forgot password?</a>
</div>


<button type="submit" className="auth-btn">Login</button>


<p className="switch-text">
  Don't have an account? <Link to="/signup">Sign Up</Link>
</p>
</form>
</div>
</div>
);
};


export default Login;