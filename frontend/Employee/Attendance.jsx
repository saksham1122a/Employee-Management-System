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
  FiBarChart2
} from "react-icons/fi";
import "../Manager/Attendance.css";

const Attendance = () => {
  const [loading, setLoading] = useState(true);
  const [showAttendance, setShowAttendance] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    percentage: 0,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    totalDays: 0,
    currentMonth: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    weeklyTrend: [85, 90, 78, 92, 88, 95, 87],
    todayStatus: 'present'
  });
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('current');

  // Calculate attendance percentage and fetch data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockAttendanceData = {
          percentage: 87.5,
          presentDays: 21,
          absentDays: 3,
          lateDays: 2,
          totalDays: 26,
          currentMonth: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          weeklyTrend: [85, 90, 78, 92, 88, 95, 87],
          todayStatus: 'present'
        };
        
        setAttendanceData(mockAttendanceData);
        
        const mockHistory = [
          { date: '2024-03-21', status: 'present', checkIn: '09:15 AM', checkOut: '06:30 PM', hours: '9h 15m', performance: 'excellent' },
          { date: '2024-03-20', status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', performance: 'good' },
          { date: '2024-03-19', status: 'late', checkIn: '09:45 AM', checkOut: '06:15 PM', hours: '8h 30m', performance: 'average' },
          { date: '2024-03-18', status: 'present', checkIn: '08:45 AM', checkOut: '05:45 PM', hours: '9h 00m', performance: 'excellent' },
          { date: '2024-03-17', status: 'absent', checkIn: '--', checkOut: '--', hours: '0h 00m', performance: 'poor' },
          { date: '2024-03-16', status: 'present', checkIn: '09:30 AM', checkOut: '06:30 PM', hours: '9h 00m', performance: 'good' },
          { date: '2024-03-15', status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m', performance: 'excellent' },
          { date: '2024-03-14', status: 'present', checkIn: '08:50 AM', checkOut: '05:50 PM', hours: '9h 00m', performance: 'good' },
          { date: '2024-03-13', status: 'present', checkIn: '09:10 AM', checkOut: '06:10 PM', hours: '9h 00m', performance: 'good' },
          { date: '2024-03-12', status: 'present', checkIn: '09:05 AM', checkOut: '06:05 PM', hours: '9h 00m', performance: 'excellent' },
        ];
        
        setHistory(mockHistory);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

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
              onClick={() => setShowAttendance(!showAttendance)}
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
                overflow: 'hidden'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px) scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0) scale(1)'}
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
              <style jsx>{`
                button:active::before {
                  width: 300px;
                  height: 300px;
                }
              `}</style>
            </button>
          </div>

          {/* Animated Attendance Display */}
          <div style={{
            opacity: showAttendance ? 1 : 0,
            transform: showAttendance ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'all 0.5s ease',
            display: showAttendance ? 'block' : 'none'
          }}>
            {/* Main Percentage Display */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              padding: '2rem',
              marginBottom: '2rem',
              textAlign: 'center',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
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
              <div style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                Attendance Rate
              </div>
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
              Last 10 days attendance records
            </p>
          </div>
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
      <style jsx>{`
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
      `}</style>
    </div>
  );
};

export default Attendance;
