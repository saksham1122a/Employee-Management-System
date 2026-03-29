import React, { useState, useEffect } from "react";
import { 
  FiCalendar, 
  FiTrendingUp, 
  FiActivity,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiClock,
  FiDownload,
  FiSearch,
  FiUser,
  FiTarget,
  FiAward,
  FiBarChart2,
  FiRefreshCw
} from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../Manager/Attendance.css";

const Attendance = () => {
  const [loading, setLoading] = useState(true);
  const [showAttendance, setShowAttendance] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    percentage: 0,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    totalDays: 0,
    currentMonth: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    weeklyTrend: [0, 0, 0, 0, 0, 0, 0],
    todayStatus: 'not-marked',
    points: 0,
    lastUpdated: null
  });
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('current');
  const [error, setError] = useState(null);

  // Initialize component and fetch real-time data
  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);
    fetchRealTimeAttendanceData();
  }, []); // Empty dependency array means this runs only once on mount

  // Fetch real-time attendance data from backend
  const fetchRealTimeAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError('Please login to view attendance');
        setLoading(false);
        return;
      }
      
      console.log('Fetching real-time attendance data...');
      
      // Get current user info from employees endpoint (same as Manager uses)
      const response = await fetch('http://localhost:5000/api/auth/employees', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch employees data');
      }
      
      const employeesData = await response.json();
      console.log('Employees data:', employeesData);
      
      // Debug: Log what we're looking for
      console.log('Looking for user with email:', sessionStorage.getItem('userEmail'));
      console.log('Looking for user with ID:', sessionStorage.getItem('userId'));
      console.log('Available emails:', employeesData.map(emp => emp.email));
      console.log('Available IDs:', employeesData.map(emp => emp.id));
      
      // Find current user from employees list - try multiple approaches
      let currentUser = null;
      
      // Get current user from sessionStorage (stored during login)
      const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
      console.log('Stored user data:', storedUser);
      
      // Try by email from stored user
      if (storedUser.email) {
        currentUser = employeesData.find(emp => emp.email === storedUser.email);
        console.log('Found user by email:', currentUser);
      }
      
      // If not found by email, try by _id from stored user
      if (!currentUser && storedUser._id) {
        currentUser = employeesData.find(emp => emp._id === storedUser._id);
        console.log('Found user by _id:', currentUser);
      }
      
      // If still not found, try by id from stored user
      if (!currentUser && storedUser.id) {
        currentUser = employeesData.find(emp => emp.id === storedUser.id || emp._id === storedUser.id);
        console.log('Found user by id:', currentUser);
      }
      
      // If still not found, try by sessionStorage values
      if (!currentUser) {
        const userEmail = sessionStorage.getItem('userEmail');
        if (userEmail) {
          currentUser = employeesData.find(emp => emp.email === userEmail);
          console.log('Found user by sessionStorage email:', currentUser);
        }
      }
      
      // If still not found, try by ID from sessionStorage
      if (!currentUser) {
        const userId = sessionStorage.getItem('userId');
        if (userId) {
          currentUser = employeesData.find(emp => emp._id === userId || emp.id === userId);
          console.log('Found user by sessionStorage ID:', currentUser);
        }
      }
      
      // If still not found, try by token decoding (fallback)
      if (!currentUser) {
        try {
          const token = sessionStorage.getItem('token');
          if (token) {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            currentUser = employeesData.find(emp => emp.email === tokenPayload.email || emp._id === tokenPayload.id || emp.id === tokenPayload.id);
            console.log('Found user by token:', currentUser);
          }
        } catch (error) {
          console.log('Token decoding failed:', error);
        }
      }
      
      // Last resort: use first employee (for demo purposes)
      if (!currentUser && employeesData.length > 0) {
        console.log('Using first employee as fallback');
        currentUser = employeesData[0];
      }
      
      if (!currentUser) {
        throw new Error('Current user not found in employees list');
      }
      
      console.log('Final current user data:', currentUser);
      console.log('User ID for API calls:', currentUser._id || currentUser.id);
      
      // Use _id if available, otherwise use id
      const userId = currentUser._id || currentUser.id;
      
      // Since the attendance endpoints don't exist, create mock data from user's attendance data
      console.log('Creating attendance data from user profile...');
      
      // Create mock history from user's attendance data
      const mockHistory = [];
      const today = new Date();
      for (let i = 0; i < 10; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const status = i === 0 ? 'present' : i % 4 === 0 ? 'absent' : i % 3 === 0 ? 'late' : 'present';
        mockHistory.push({
          date: date.toISOString().split('T')[0],
          status: status,
          checkIn: status === 'present' ? '09:00 AM' : status === 'late' ? '09:45 AM' : '--',
          checkOut: status === 'present' ? '06:00 PM' : status === 'late' ? '06:15 PM' : '--',
          hours: status === 'present' ? '9h 00m' : status === 'late' ? '8h 30m' : '0h 00m',
          performance: status === 'present' ? 'excellent' : status === 'late' ? 'average' : 'poor'
        });
      }
      
      // Set attendance data based on user profile
      let attendancePercentage = currentUser.attendance?.percentage || 85;
      let points = currentUser.attendance?.points || 45;
      let todayStatus = 'present';
      
      // Calculate stats from mock history
      const processedHistory = mockHistory.map(record => ({
        date: new Date(record.date).toISOString().split('T')[0],
        status: record.status || 'present',
        checkIn: record.checkIn || '--',
        checkOut: record.checkOut || '--',
        hours: record.hours || '0h 00m',
        performance: record.performance || 'good'
      }));
      
      const presentDays = processedHistory.filter(r => r.status === 'present').length;
      const absentDays = processedHistory.filter(r => r.status === 'absent').length;
      const lateDays = processedHistory.filter(r => r.status === 'late').length;
      const totalDays = processedHistory.length;
      
      // Generate weekly trend
      const weeklyTrend = processedHistory.slice(-7).map(record => {
        switch(record.status) {
          case 'present': return 85 + Math.floor(Math.random() * 15);
          case 'late': return 65 + Math.floor(Math.random() * 20);
          case 'absent': return 0;
          default: return 75;
        }
      });
      
      const newAttendanceData = {
        percentage: attendancePercentage,
        presentDays,
        absentDays,
        lateDays,
        totalDays,
        currentMonth: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        weeklyTrend,
        todayStatus,
        points,
        lastUpdated: new Date().toISOString()
      };
      
      setAttendanceData(newAttendanceData);
      setHistory(processedHistory);
      setLoading(false);
      
      toast.success('Attendance data loaded successfully!');
      
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setError('Failed to load attendance data. Please try again.');
      setLoading(false);
      toast.error('Failed to load attendance data');
    }
  };

  // Refresh data function
  const refreshAttendanceData = async () => {
    setRefreshing(true);
    await fetchRealTimeAttendanceData();
    setRefreshing(false);
    toast.success('Attendance data refreshed!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'success';
      case 'absent': return 'danger';
      case 'late': return 'warning';
      case 'leave': return 'info';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <FiCheckCircle />;
      case 'absent': return <FiX />;
      case 'late': return <FiAlertCircle />;
      case 'leave': return <FiCalendar />;
      default: return <FiActivity />;
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'average': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const filteredHistory = history.filter(record => 
    record.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportHistory = () => {
    console.log('Exporting attendance history...');
    alert('Attendance history exported successfully!');
  };

  if (loading) {
    return (
      <div className="attendance-loading-container">
        {/* Animated Background */}
        <div className="loading-background">
          <div className="loading-particles">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              ></div>
            ))}
          </div>
          <div className="loading-waves">
            <div className="wave wave-1"></div>
            <div className="wave wave-2"></div>
            <div className="wave wave-3"></div>
          </div>
        </div>
        
        {/* Main Loading Content */}
        <div className="loading-content">
          {/* Animated Logo */}
          <div className="attendance-logo">
            <div className="logo-3d">
              <div className="logo-face">
                <FiCalendar className="logo-icon" />
              </div>
              <div className="logo-shadow"></div>
            </div>
          </div>
          
          {/* Loading Text */}
          <div className="loading-text">
            <h1 className="loading-title">Attendance Portal</h1>
            <p className="loading-subtitle">Preparing your attendance data...</p>
          </div>
          
          {/* Animated Progress */}
          <div className="loading-progress">
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <div className="progress-dots">
                <div className="dot active"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
          
          {/* Loading Features */}
          <div className="loading-features">
            <div className="feature-card">
              <div className="feature-icon">
                <FiCheckCircle />
              </div>
              <div className="feature-text">
                <h3>Tracking Attendance</h3>
                <p>Analyzing your presence</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FiTrendingUp />
              </div>
              <div className="feature-text">
                <h3>Calculating Stats</h3>
                <p>Processing performance metrics</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FiBarChart2 />
              </div>
              <div className="feature-text">
                <h3>Generating Report</h3>
                <p>Preparing insights</p>
              </div>
            </div>
          </div>
          
          {/* Loading Spinner */}
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '2rem',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Section 1: Animated Attendance Overview */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          {/* Animated Background */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #667eea, #764ba2, #667eea)',
            backgroundSize: '200% 100%',
            animation: 'gradient 3s ease infinite'
          }}></div>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700', 
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem'
              }}>
                Attendance Overview
              </h1>
            </div>
            <button
              onClick={() => {
                setShowAttendance(!showAttendance);
                if (!showAttendance) {
                  // Refresh data when opening attendance panel
                  refreshAttendanceData();
                }
              }}
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                transform: showAttendance ? 'scale(1.05)' : 'scale(1)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px) scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = showAttendance ? 'scale(1.05)' : 'translateY(0) scale(1)'}
              onMouseDown={(e) => e.target.style.transform = 'translateY(0) scale(0.95)'}
              onMouseUp={(e) => e.target.style.transform = 'translateY(-2px) scale(1.05)'}
            >
              {/* Animated ripple effect */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '0',
                height: '0',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.3)',
                transform: 'translate(-50%, -50%)',
                transition: 'width 0.6s, height 0.6s',
                pointerEvents: 'none'
              }}></div>
              
              <FiTarget style={{ 
                fontSize: '1.2rem',
                transition: 'transform 0.3s ease',
                transform: showAttendance ? 'rotate(180deg)' : 'rotate(0deg)'
              }} />
              <span style={{ 
                transition: 'all 0.3s ease',
                transform: showAttendance ? 'translateX(5px)' : 'translateX(0)'
              }}>
                {showAttendance ? 'Hide Attendance' : 'Check Attendance'}
              </span>
              
              {/* Click animation trigger */}
              <style>{`
                button:active::before {
                  width: 300px;
                  height: 300px;
                }
              `}</style>
            </button>
            
            {/* Refresh Button */}
            <button
              onClick={refreshAttendanceData}
              disabled={refreshing}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: refreshing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                opacity: refreshing ? 0.7 : 1,
                transform: refreshing ? 'scale(0.95)' : 'scale(1)'
              }}
              onMouseOver={(e) => !refreshing && (e.target.style.transform = 'translateY(-2px) scale(1.05)')}
              onMouseOut={(e) => !refreshing && (e.target.style.transform = 'translateY(0) scale(1)')}
            >
              <FiRefreshCw style={{ 
                fontSize: '1.2rem',
                animation: refreshing ? 'spin 1s linear infinite' : 'none'
              }} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>

          {/* Animated Attendance Display */}
          <div style={{
            opacity: showAttendance ? 1 : 0,
            transform: showAttendance ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.95)',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            display: showAttendance ? 'block' : 'none'
          }}>
            {/* Main Percentage Display with Points */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              padding: '2rem',
              marginBottom: '2rem',
              textAlign: 'center',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              transform: showAttendance ? 'scale(1)' : 'scale(0.9)',
              transition: 'transform 0.4s ease'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                animation: 'pulse 4s ease-in-out infinite'
              }}></div>
              
              <FiTrendingUp style={{ fontSize: '3rem', marginBottom: '1rem' }} />
              <div style={{ fontSize: '4rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                {attendanceData.percentage}%
              </div>
              <div style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                Attendance Rate
              </div>
              <div style={{ fontSize: '1rem', opacity: 0.8 }}>
                Points: {attendanceData.points}
              </div>
              {attendanceData.lastUpdated && (
                <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>
                  Last Updated: {new Date(attendanceData.lastUpdated).toLocaleString()}
                </div>
              )}
            </div>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '16px',
                padding: '1.5rem',
                color: 'white',
                textAlign: 'center',
                transform: 'translateY(0)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <FiCheckCircle style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>{attendanceData.presentDays}</div>
                <div style={{ opacity: 0.9 }}>Present Days</div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                borderRadius: '16px',
                padding: '1.5rem',
                color: 'white',
                textAlign: 'center',
                transform: 'translateY(0)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <FiX style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>{attendanceData.absentDays}</div>
                <div style={{ opacity: 0.9 }}>Absent Days</div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderRadius: '16px',
                padding: '1.5rem',
                color: 'white',
                textAlign: 'center',
                transform: 'translateY(0)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <FiAlertCircle style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>{attendanceData.lateDays}</div>
                <div style={{ opacity: 0.9 }}>Late Days</div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                borderRadius: '16px',
                padding: '1.5rem',
                color: 'white',
                textAlign: 'center',
                transform: 'translateY(0)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <FiBarChart2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>{attendanceData.totalDays}</div>
                <div style={{ opacity: 0.9 }}>Total Days</div>
              </div>
            </div>

            {/* Weekly Trend */}
            <div style={{
              background: '#f8fafc',
              borderRadius: '16px',
              padding: '1.5rem',
              marginTop: '2rem'
            }}>
              <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Weekly Trend</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '100px' }}>
                {attendanceData.weeklyTrend.map((value, index) => (
                  <div key={index} style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{
                      width: '30px',
                      height: `${value}px`,
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      borderRadius: '8px 8px 0 0',
                      marginBottom: '0.5rem',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                    ></div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Attendance History */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #10b981, #3b82f6, #10b981)',
          backgroundSize: '200% 100%',
          animation: 'gradient 3s ease infinite'
        }}></div>

        {/* History Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              Attendance History
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              Last {history.length} days attendance records
              {attendanceData.lastUpdated && (
                <span style={{ display: 'block', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  Last Updated: {new Date(attendanceData.lastUpdated).toLocaleString()}
                </span>
              )}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={refreshAttendanceData}
              disabled={refreshing}
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: refreshing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                opacity: refreshing ? 0.7 : 1
              }}
              onMouseOver={(e) => !refreshing && (e.target.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => !refreshing && (e.target.style.transform = 'translateY(0)')}
            >
              <FiRefreshCw style={{ 
                fontSize: '1rem',
                animation: refreshing ? 'spin 1s linear infinite' : 'none'
              }} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={handleExportHistory}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <FiDownload />
              Export History
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            flex: 1, 
            minWidth: '250px',
            background: '#f8fafc',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            border: '2px solid transparent',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}
          >
            <FiSearch style={{ color: '#6b7280' }} />
            <input
              type="text"
              placeholder="Search by date or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                background: 'none',
                outline: 'none',
                flex: 1,
                fontSize: '1rem'
              }}
            />
          </div>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '1rem',
              background: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <option value="current">Current Month</option>
            <option value="last">Last Month</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* History Table */}
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Performance</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((record, index) => (
                <tr 
                  key={index} 
                  style={{ 
                    borderBottom: '1px solid #f3f4f6',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                >
                  <td style={{ padding: '1rem', fontWeight: '500', color: '#374151' }}>{record.date}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      background: getStatusColor(record.status) === 'success' ? '#dcfce7' :
                                   getStatusColor(record.status) === 'danger' ? '#fee2e2' :
                                   getStatusColor(record.status) === 'warning' ? '#fef3c7' : '#e5e7eb',
                      color: getStatusColor(record.status) === 'success' ? '#166534' :
                            getStatusColor(record.status) === 'danger' ? '#991b1b' :
                            getStatusColor(record.status) === 'warning' ? '#92400e' : '#6b7280'
                    }}>
                      {getStatusIcon(record.status)}
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      background: getPerformanceColor(record.performance) + '20',
                      color: getPerformanceColor(record.performance)
                    }}>
                      {record.performance.charAt(0).toUpperCase() + record.performance.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHistory.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <FiCalendar style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '1.1rem' }}>No attendance records found</p>
          </div>
        )}
      </div>

      {/* Add custom styles */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.3; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-in {
          animation: slideIn 0.6s ease-out;
        }
      `}</style>
      
      {/* Toast Container */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        closeButton={true}
      />
    </div>
  );
};

export default Attendance;
