import React, { useState, useEffect } from "react";
import "./Attendance.css";
import { FiClock, FiLogIn, FiLogOut } from "react-icons/fi";

const Attendance = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkInTime, setCheckInTime] = useState(null);
  const [workingHours, setWorkingHours] = useState("0h 0m");
  const [attendanceHistory, setAttendanceHistory] = useState([
    {
      date: "24 Jan 2026",
      checkIn: "09:05 AM",
      checkOut: "06:00 PM",
      hours: "8h 55m",
      status: "present"
    },
    {
      date: "23 Jan 2026", 
      checkIn: "09:45 AM",
      checkOut: "05:30 PM",
      hours: "7h 45m",
      status: "late"
    }
  ]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

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

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now);
    setIsCheckedIn(true);
    
    // Add today's attendance to history if not already present
    const today = getTodayDate();
    const todayExists = attendanceHistory.some(record => record.date === today);
    
    if (!todayExists) {
      const newRecord = {
        date: today,
        checkIn: formatTime(now),
        checkOut: "-",
        hours: "0h 0m",
        status: "present"
      };
      
      setAttendanceHistory([newRecord, ...attendanceHistory]);
    }
  };

  const handleCheckOut = () => {
    const now = new Date();
    setIsCheckedIn(false);
    
    // Update today's attendance record
    const today = getTodayDate();
    
    const updatedHistory = attendanceHistory.map(record => {
      if (record.date === today) {
        const diff = now - checkInTime;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        // Determine status based on check-in time
        let status = "present";
        if (checkInTime.getHours() > 9 || (checkInTime.getHours() === 9 && checkInTime.getMinutes() > 15)) {
          status = "late";
        }
        
        return {
          ...record,
          checkOut: formatTime(now),
          hours: `${hours}h ${minutes}m`,
          status: status
        };
      }
      return record;
    });
    
    setAttendanceHistory(updatedHistory);
    setWorkingHours("0h 0m");
    setCheckInTime(null);
  };

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

  return (
    <div className="attendance">
      {/* Header */}
      <div className="attendance-header">
        <div>
          <h1>Attendance</h1>
          <p>Track your daily work activity</p>
        </div>

        <div className="attendance-actions">
          <button 
            className={`checkin-btn ${isCheckedIn ? 'disabled' : ''}`}
            onClick={handleCheckIn}
            disabled={isCheckedIn}
          >
            <FiLogIn /> {isCheckedIn ? 'Checked In' : 'Check In'}
          </button>
          <button 
            className={`checkout-btn ${!isCheckedIn ? 'disabled' : ''}`}
            onClick={handleCheckOut}
            disabled={!isCheckedIn}
          >
            <FiLogOut /> {isCheckedIn ? 'Check Out' : 'Checked Out'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <FiClock />
          <div>
            <span>Working Hours</span>
            <h3>{workingHours}</h3>
          </div>
        </div>

        <div className="stat-card">
          <span className={`status ${isCheckedIn ? 'present' : 'absent'}`}>
            {isCheckedIn ? 'Present' : 'Absent'}
          </span>
          <div>
            <span>Status</span>
            <h3>Today</h3>
          </div>
        </div>

        <div className="stat-card">
          <span className={`status ${!isCheckedIn && checkInTime ? 'ontime' : 'late'}`}>
            {isCheckedIn ? formatTime(checkInTime) : 'Not Checked In'}
          </span>
          <div>
            <span>Check-in</span>
            <h3>{isCheckedIn ? formatTime(checkInTime) : '--:--'}</h3>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="history-card">
        <h2>Attendance History</h2>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hours</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {attendanceHistory.map((record, index) => (
              <tr key={index}>
                <td>{record.date}</td>
                <td>{record.checkIn}</td>
                <td>{record.checkOut}</td>
                <td>{record.hours}</td>
                <td>
                  <span className={`badge ${record.status}`}>
                    {record.status === 'present' ? 'Present' : record.status === 'late' ? 'Late' : 'Absent'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
