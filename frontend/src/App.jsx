import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OpenAnimation from './Components/OpenAnimation';
import Navbar from './Components/Navbar';
import HeroSection from './Components/HeroSection';
import About from './Components/About';
import Contact from './Components/Contact';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Footer from './Components/Footer';
import ForgetPassword from './Components/ForgetPassword';
import LearnMore from './Components/LearnMore';
import Profile from './Components/Profile';
import AdminDashboard from '../admin/AdminDashboard';
import UserManagement from '../admin/User';
import ManagerDashboard from '../Manager/ManagerDashboard';
import EmployeeDashboard from '../Employee/EmployeeDashboard';
import Attendance from '../Employee/Attendance';
import Leave from '../Employee/Leave';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <OpenAnimation onFinish={() => setLoading(false)} />;
  }

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
  <Route path="/" element={
    <>
      <HeroSection />
      <About />
      <Contact />
      <Footer />
    </>
  } />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/learn-more" element={<LearnMore />} />
  <Route path="/forgetpassword" element={<ForgetPassword />} />
  
  {/* Admin routes */}
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/admin/users" element={<UserManagement />} />
  
  {/* Manager routes */}
  <Route path="/manager" element={<ManagerDashboard />} />
  
  {/* Employee routes */}
  <Route path="/employee" element={<EmployeeDashboard />} />
  <Route path="/employee/attendance" element={<Attendance />} />
  <Route path="/employee/leave" element={<Leave />} />
  <Route path="/profile" element={<Profile />} />
  
  <Route path="*" element={<Navigate to="/" />} />

</Routes>
      </div>
    </Router>
  );
}

export default App;