import React, { useState, useEffect } from "react";
import { 
  FiClock, 
  FiLogIn, 
  FiLogOut, 
  FiCalendar, 
  FiTrendingUp, 
  FiActivity,
  FiUser,
  FiCheckCircle,
  FiAlertCircle,
  FiX
} from "react-icons/fi";
import "./Attendance.css";

const Attendance = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkInTime, setCheckInTime] = useState(null);
  const [workingHours, setWorkingHours] = useState("0h 0m");
  const [loading, setLoading] = useState(true);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate working hours
  useEffect(() => {
    if (isCheckedIn && checkInTime) {
      const now = new Date();
      const diff = now - checkInTime;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setWorkingHours(`${hours}h ${minutes}m`);
    }
  }, [currentTime, isCheckedIn, checkInTime]);

  // Initialize with mock data
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const formatTime = (date) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).replace(',', '');
  };

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now);
    setIsCheckedIn(true);
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setWorkingHours("0h 0m");
    setCheckInTime(null);
  };

  if (loading) {
    return (
      <div className="attendance-container">
        <div className="loading-spinner">
          <FiActivity className="spinner-icon" />
          <p>Loading attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <div className="header-content">
          <div className="greeting-section">
            <h1 className="greeting">Attendance Dashboard</h1>
            <p className="subtitle">Real-time attendance tracking and analytics</p>
          </div>
          
          <div className="time-display">
            <div className="current-time">
              <FiClock className="time-icon" />
              <span>{formatTime(currentTime)}</span>
            </div>
            <div className="date-display">
              <FiCalendar />
              <span>{getTodayDate()}</span>
            </div>
            <div className="sync-indicator">
              <div className="sync-dot active"></div>
              <span>Live Sync</span>
            </div>
          </div>
        </div>
      </div>

      <div className="today-status-card">
        <div className="status-header">
          <h2>Today's Status</h2>
          <div className="status-badge present">
            <FiCheckCircle />
            <span>Not Marked</span>
          </div>
        </div>
        
        <div className="status-content">
          <div className="working-hours-display">
            <div className="hours-value">
              <span className="hours-number">{workingHours}</span>
              <span className="hours-label">Working Hours</span>
            </div>
          </div>
          
          <div className="check-times">
            <div className="time-info">
              <FiLogIn className="time-icon-in" />
              <div>
                <span className="time-label">Check In</span>
                <span className="time-value">
                  {checkInTime ? formatTime(checkInTime) : '--:--'}
                </span>
              </div>
            </div>
            <div className="time-info">
              <FiLogOut className="time-icon-out" />
              <div>
                <span className="time-label">Check Out</span>
                <span className="time-value">
                  {isCheckedIn ? 'Working...' : '--:--'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="action-section">
        <button 
          className={`check-btn checkin-btn ${isCheckedIn ? 'disabled' : ''}`}
          onClick={handleCheckIn}
          disabled={isCheckedIn}
        >
          <div className="btn-content">
            <FiLogIn />
            <span>{isCheckedIn ? 'Already Checked In' : 'Check In'}</span>
          </div>
          <div className="btn-bg"></div>
        </button>
        
        <button 
          className={`check-btn checkout-btn ${!isCheckedIn ? 'disabled' : ''}`}
          onClick={handleCheckOut}
          disabled={!isCheckedIn}
        >
          <div className="btn-content">
            <FiLogOut />
            <span>{!isCheckedIn ? 'Not Checked In' : 'Check Out'}</span>
          </div>
          <div className="btn-bg"></div>
        </button>
      </div>

      <div className="stats-section">
        <h2 className="section-title">Monthly Overview</h2>
        <div className="stats-grid">
          <div className="stat-card present">
            <div className="stat-icon">
              <FiCheckCircle />
            </div>
            <div className="stat-content">
              <h3>5</h3>
              <span>Present Days</span>
            </div>
          </div>
          
          <div className="stat-card late">
            <div className="stat-icon">
              <FiAlertCircle />
            </div>
            <div className="stat-content">
              <h3>3</h3>
              <span>Late Arrivals</span>
            </div>
          </div>
          
          <div className="stat-card absent">
            <div className="stat-icon">
              <FiX />
            </div>
            <div className="stat-content">
              <h3>2</h3>
              <span>Absent Days</span>
            </div>
          </div>
          
          <div className="stat-card percentage">
            <div className="stat-icon">
              <FiTrendingUp />
            </div>
            <div className="stat-content">
              <h3>80%</h3>
              <span>Attendance Rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
