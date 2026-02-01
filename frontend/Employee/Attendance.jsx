import React, { useState, useEffect } from 'react';
import { 
  FiSun, FiMoon, FiCheck, FiXCircle, FiClock, FiCalendar,
  FiTrendingUp, FiTrendingDown, FiAlertCircle, FiCheckCircle
} from 'react-icons/fi';
import './Attendance.css';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState({
    todayStatus: 'not-checked-in',
    checkIn: '--:--',
    checkOut: '--:--',
    totalHours: '0h 0m',
    date: new Date().toLocaleDateString()
  });

  const [weeklyStats, setWeeklyStats] = useState({
    present: 4,
    absent: 0,
    late: 1,
    halfDay: 0,
    totalHours: '32h 30m'
  });

  const [monthlyStats, setMonthlyStats] = useState({
    present: 18,
    absent: 2,
    late: 3,
    halfDay: 1,
    totalHours: '146h 15m'
  });

  const [attendanceHistory, setAttendanceHistory] = useState([
    { id: 1, date: '2024-01-25', checkIn: '09:00 AM', checkOut: '06:30 PM', totalHours: '9h 30m', status: 'present', notes: 'Regular day' },
    { id: 2, date: '2024-01-24', checkIn: '09:15 AM', checkOut: '06:45 PM', totalHours: '9h 30m', status: 'late', notes: 'Traffic delay' },
    { id: 3, date: '2024-01-23', checkIn: '09:00 AM', checkOut: '02:00 PM', totalHours: '5h 0m', status: 'half-day', notes: 'Medical appointment' },
    { id: 4, date: '2024-01-22', checkIn: '09:00 AM', checkOut: '06:00 PM', totalHours: '9h 0m', status: 'present', notes: 'Regular day' },
    { id: 5, date: '2024-01-19', checkIn: '--:--', checkOut: '--:--', totalHours: '0h 0m', status: 'absent', notes: 'Sick leave' }
  ]);

  const [showCheckInConfirmation, setShowCheckInConfirmation] = useState(false);
  const [showCheckOutConfirmation, setShowCheckOutConfirmation] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Check if already checked in today
    const today = new Date().toLocaleDateString();
    const todayRecord = attendanceHistory.find(record => 
      record.date === new Date().toISOString().split('T')[0]
    );
    
    if (todayRecord && todayRecord.checkIn !== '--:--') {
      setAttendanceData(prev => ({
        ...prev,
        checkIn: todayRecord.checkIn,
        checkOut: todayRecord.checkOut,
        totalHours: todayRecord.totalHours,
        todayStatus: todayRecord.checkOut === '--:--' ? 'checked-in' : 'completed'
      }));
    }
  }, [attendanceHistory]);

  const handleCheckIn = () => {
    const now = new Date();
    const checkInTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const currentTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const hour = now.getHours();
    
    let status = 'present';
    if (hour > 9 && hour <= 12) {
      status = 'late';
    } else if (hour > 12) {
      status = 'half-day';
    }

    setAttendanceData(prev => ({
      ...prev,
      checkIn: checkInTime,
      todayStatus: status
    }));

    // Add to history
    const newRecord = {
      id: attendanceHistory.length + 1,
      date: new Date().toISOString().split('T')[0],
      checkIn: checkInTime,
      checkOut: '--:--',
      totalHours: '0h 0m',
      status: status,
      notes: notes || 'Regular check-in'
    };

    setAttendanceHistory(prev => [newRecord, ...prev.slice(0, 9)]);
    setShowCheckInConfirmation(false);
    setNotes('');
  };

  const handleCheckOut = () => {
    const now = new Date();
    const checkOutTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    // Calculate total hours
    const checkInTime = new Date();
    checkInTime.setHours(9, 0, 0); // Assuming 9:00 AM check-in for calculation
    const diff = now - checkInTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const totalHours = `${hours}h ${minutes}m`;

    setAttendanceData(prev => ({
      ...prev,
      checkOut: checkOutTime,
      totalHours: totalHours,
      todayStatus: 'completed'
    }));

    // Update history
    setAttendanceHistory(prev => prev.map(record => {
      if (record.date === new Date().toISOString().split('T')[0]) {
        return {
          ...record,
          checkOut: checkOutTime,
          totalHours: totalHours,
          notes: notes || record.notes
        };
      }
      return record;
    }));

    setShowCheckOutConfirmation(false);
    setNotes('');
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'present':
        return <FiCheckCircle className="status-icon present" />;
      case 'late':
        return <FiAlertCircle className="status-icon late" />;
      case 'half-day':
        return <FiClock className="status-icon half-day" />;
      case 'absent':
        return <FiXCircle className="status-icon absent" />;
      default:
        return <FiClock className="status-icon" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'present': { class: 'present', label: 'Present' },
      'late': { class: 'late', label: 'Late' },
      'half-day': { class: 'half-day', label: 'Half Day' },
      'absent': { class: 'absent', label: 'Absent' },
      'not-checked-in': { class: 'not-checked-in', label: 'Not Checked In' },
      'checked-in': { class: 'checked-in', label: 'Checked In' },
      'completed': { class: 'completed', label: 'Completed' }
    };
    
    const config = statusConfig[status] || statusConfig['not-checked-in'];
    return (
      <span className={`status-badge ${config.class}`}>
        {getStatusIcon(status)}
        {config.label}
      </span>
    );
  };

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h1>Attendance Management</h1>
        <p>Mark your daily attendance and track your work hours</p>
      </div>

      {/* Today's Attendance Card */}
      <div className="today-attendance-card">
        <div className="card-header">
          <h2>Today's Attendance</h2>
          <div className="date-display">
            <FiCalendar />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <div className="attendance-status-section">
          {getStatusBadge(attendanceData.todayStatus)}
        </div>

        <div className="attendance-details">
          <div className="detail-item">
            <div className="detail-icon">
              <FiSun />
            </div>
            <div className="detail-content">
              <span className="label">Check In</span>
              <span className="time">{attendanceData.checkIn}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <FiMoon />
            </div>
            <div className="detail-content">
              <span className="label">Check Out</span>
              <span className="time">{attendanceData.checkOut}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <FiClock />
            </div>
            <div className="detail-content">
              <span className="label">Total Hours</span>
              <span className="time">{attendanceData.totalHours}</span>
            </div>
          </div>
        </div>

        <div className="attendance-actions">
          {attendanceData.checkIn === '--:--' ? (
            <button 
              className="btn-check-in"
              onClick={() => setShowCheckInConfirmation(true)}
            >
              <FiSun /> Check In
            </button>
          ) : attendanceData.checkOut === '--:--' ? (
            <button 
              className="btn-check-out"
              onClick={() => setShowCheckOutConfirmation(true)}
            >
              <FiMoon /> Check Out
            </button>
          ) : (
            <button className="btn-completed" disabled>
              <FiCheck /> Completed
            </button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-container">
        <div className="stats-card">
          <div className="stats-header">
            <h3>This Week</h3>
            <FiTrendingUp className="trend-icon up" />
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number present">{weeklyStats.present}</span>
              <span className="stat-label">Present</span>
            </div>
            <div className="stat-item">
              <span className="stat-number absent">{weeklyStats.absent}</span>
              <span className="stat-label">Absent</span>
            </div>
            <div className="stat-item">
              <span className="stat-number late">{weeklyStats.late}</span>
              <span className="stat-label">Late</span>
            </div>
            <div className="stat-item">
              <span className="stat-number half-day">{weeklyStats.halfDay}</span>
              <span className="stat-label">Half Day</span>
            </div>
          </div>
          <div className="total-hours">
            <span className="hours-label">Total Hours:</span>
            <span className="hours-value">{weeklyStats.totalHours}</span>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-header">
            <h3>This Month</h3>
            <FiTrendingDown className="trend-icon down" />
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number present">{monthlyStats.present}</span>
              <span className="stat-label">Present</span>
            </div>
            <div className="stat-item">
              <span className="stat-number absent">{monthlyStats.absent}</span>
              <span className="stat-label">Absent</span>
            </div>
            <div className="stat-item">
              <span className="stat-number late">{monthlyStats.late}</span>
              <span className="stat-label">Late</span>
            </div>
            <div className="stat-item">
              <span className="stat-number half-day">{monthlyStats.halfDay}</span>
              <span className="stat-label">Half Day</span>
            </div>
          </div>
          <div className="total-hours">
            <span className="hours-label">Total Hours:</span>
            <span className="hours-value">{monthlyStats.totalHours}</span>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="history-card">
        <div className="card-header">
          <h3>Attendance History</h3>
          <button className="btn-export">Export Report</button>
        </div>
        
        <div className="history-table">
          <div className="table-header">
            <div className="table-cell">Date</div>
            <div className="table-cell">Check In</div>
            <div className="table-cell">Check Out</div>
            <div className="table-cell">Total Hours</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">Notes</div>
          </div>
          
          {attendanceHistory.map(record => (
            <div key={record.id} className="table-row">
              <div className="table-cell date">{record.date}</div>
              <div className="table-cell time">{record.checkIn}</div>
              <div className="table-cell time">{record.checkOut}</div>
              <div className="table-cell hours">{record.totalHours}</div>
              <div className="table-cell">{getStatusBadge(record.status)}</div>
              <div className="table-cell notes">{record.notes}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Check In Confirmation Modal */}
      {showCheckInConfirmation && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirm Check In</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCheckInConfirmation(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>You are about to check in at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
              <div className="form-group">
                <label htmlFor="notes">Notes (Optional)</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about your check-in..."
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => setShowCheckInConfirmation(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm"
                onClick={handleCheckIn}
              >
                <FiSun /> Check In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Check Out Confirmation Modal */}
      {showCheckOutConfirmation && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirm Check Out</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCheckOutConfirmation(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>You are about to check out at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
              <div className="form-group">
                <label htmlFor="notes">Notes (Optional)</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about your check-out..."
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => setShowCheckOutConfirmation(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm"
                onClick={handleCheckOut}
              >
                <FiMoon /> Check Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;