import React, { useState, useEffect } from 'react';
import { FiCalendar, FiCheckCircle, FiUser, FiTrendingUp, FiTrendingDown, FiX, FiCheck, FiLock, FiUnlock, FiClock, FiAward, FiTarget, FiActivity } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Attendance.css';

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    presentCount: 0,
    lateCount: 0,
    absentCount: 0,
    notMarkedCount: 0,
    totalPoints: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLockedForDay, setIsLockedForDay] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString());

  // Load data from localStorage on component mount
  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);
    
    const today = new Date().toLocaleDateString();
    const storedData = localStorage.getItem('attendanceData');
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        if (data.date === today) {
          console.log('Loading data from localStorage:', data);
          setEmployees(data.employees || []);
          setStats(data.stats || stats);
          setIsLockedForDay(data.isLocked || false);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        localStorage.removeItem('attendanceData');
      }
    }
    
    fetchEmployees();
  }, []);

  // Update stats whenever employees change
  useEffect(() => {
    updateStats();
  }, [employees]);

  // Save data to localStorage whenever employees or stats change
  useEffect(() => {
    saveToLocalStorage();
  }, [employees, stats, isLockedForDay]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError('Please login to view attendance');
        setLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/auth/employees', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const usersData = await response.json();
        const formattedEmployees = usersData.map(user => ({
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          department: user.department || 'General',
          status: 'Not Marked',
          points: user.attendance?.points || 0,
          attendance: user.attendance?.percentage || 0,
          lastUpdated: user.attendance?.lastUpdated || null,
          todayMarked: false,
          joinDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '2024-01-01'
        }));
        
        setEmployees(formattedEmployees);
        setLoading(false);
      } else {
        setError('Failed to load employees');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  const updateStats = () => {
    const presentCount = employees.filter(emp => emp.todayMarked && emp.status === 'Present').length;
    const lateCount = employees.filter(emp => emp.todayMarked && emp.status === 'Late').length;
    const absentCount = employees.filter(emp => emp.todayMarked && emp.status === 'Absent').length;
    const notMarkedCount = employees.filter(emp => !emp.todayMarked).length;
    const totalPoints = employees.reduce((sum, emp) => sum + emp.points, 0);
    
    const newStats = { presentCount, lateCount, absentCount, notMarkedCount, totalPoints };
    console.log('Updated stats:', newStats);
    setStats(newStats);
  };

  const saveToLocalStorage = () => {
    const today = new Date().toLocaleDateString();
    const data = {
      date: today,
      employees,
      stats,
      isLocked: isLockedForDay
    };
    localStorage.setItem('attendanceData', JSON.stringify(data));
    console.log('Saved to localStorage:', data);
  };

  const markAttendance = async (employeeId, status) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error('Please login to mark attendance');
        return;
      }

      const employee = employees.find(emp => emp.id === employeeId);
      if (employee?.todayMarked) {
        toast.error('Attendance for this employee has already been marked today.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/attendance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ employeeId, status })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Attendance marked:', data);
        
        // Update local state
        setEmployees(prev => {
          const updated = prev.map(emp => 
            emp.id === employeeId 
              ? { 
                  ...emp, 
                  status: status,
                  points: data.employee.attendance.points,
                  attendance: data.employee.attendance.percentage,
                  lastUpdated: data.employee.attendance.lastUpdated,
                  todayMarked: true
                } 
              : emp
          );
          return updated;
        });

        // Check if all employees are marked
        const allMarked = employees.filter(emp => emp.id !== employeeId).every(emp => emp.todayMarked);
        if (allMarked) {
          setIsLockedForDay(true);
          toast.success('🎉 All employees have been marked! Attendance is now locked for today.');
        }

        const pointsChange = data.employee.attendance.todayPoints;
        const pointsMessage = pointsChange > 0 ? `+${pointsChange} points added!` : `${pointsChange} points deducted.`;
        
        toast.success(`✅ Attendance marked as ${status}. ${pointsMessage}`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update attendance');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const markAllPresent = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error('Please login to mark attendance');
        return;
      }

      const unmarkedEmployees = employees.filter(emp => !emp.todayMarked);
      if (unmarkedEmployees.length === 0) {
        toast.info('All employees have already been marked for today.');
        return;
      }

      let successCount = 0;
      let errorCount = 0;
      let updatedEmployees = [...employees];

      for (const employee of unmarkedEmployees) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/attendance', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              employeeId: employee.id,
              status: 'Present'
            })
          });

          if (response.ok) {
            const data = await response.json();
            updatedEmployees = updatedEmployees.map(emp => 
              emp.id === employee.id 
                ? { 
                    ...emp, 
                    status: 'Present',
                    points: data.employee.attendance.points,
                    attendance: data.employee.attendance.percentage,
                    lastUpdated: data.employee.attendance.lastUpdated,
                    todayMarked: true
                  } 
                : emp
            );
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      setEmployees(updatedEmployees);
      
      if (successCount === unmarkedEmployees.length && errorCount === 0) {
        setIsLockedForDay(true);
        toast.success('🎉 All employees have been marked! Attendance is now locked for today.');
      } else {
        toast.success(`Marked ${successCount} employees as Present. ${errorCount > 0 ? `${errorCount} failed.` : ''}`);
      }
    } catch (error) {
      console.error('Error marking all present:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const getPointsIcon = (points) => {
    if (points >= 50) return <FiTrendingUp style={{ color: '#48bb78' }} />;
    if (points >= 20) return <FiTrendingUp style={{ color: '#667eea' }} />;
    if (points >= 0) return <FiTrendingUp style={{ color: '#f39c12' }} />;
    return <FiTrendingDown style={{ color: '#e53e3e' }} />;
  };

  const getPointsColor = (points) => {
    if (points >= 50) return '#48bb78';
    if (points >= 20) return '#667eea';
    if (points >= 0) return '#f39c12';
    return '#e53e3e';
  };

  if (loading) {
    return (
      <div className="attendance-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3>Loading employee data...</h3>
          <p>Please wait while we fetch attendance information</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="attendance-container">
        <div className="error-container">
          <div className="error-icon">
            <FiX />
          </div>
          <h3>Error Loading Data</h3>
          <p>{error}</p>
          <button onClick={fetchEmployees} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`attendance-container ${animateIn ? 'animate-in' : ''}`}>
      {/* Background Elements */}
      <div className="attendance-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Header Section */}
      <div className="attendance-header">
        <div className="header-content">
          <div className="header-left">
            <div className="title-section">
              <div className="icon-wrapper">
                <FiCalendar className="main-icon" />
              </div>
              <div>
                <h1>Attendance Management</h1>
                <p>Track and manage daily attendance with points system</p>
              </div>
            </div>
            {isLockedForDay && (
              <div className="lock-status">
                <FiLock className="lock-icon" />
                <span>Attendance Locked for Today</span>
              </div>
            )}
          </div>
          
          <div className="header-actions">
            <div className="date-selector">
              <FiClock className="date-icon" />
              <span>{selectedDate}</span>
            </div>
            <button 
              className={`mark-all-btn ${isLockedForDay ? 'disabled' : ''}`} 
              onClick={markAllPresent}
              disabled={isLockedForDay}
            >
              <FiCheckCircle />
              Mark All Present
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon present">
            <FiUser />
          </div>
          <div className="stat-content">
            <h3>{stats.presentCount}</h3>
            <p>Present Today</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon late">
            <FiClock />
          </div>
          <div className="stat-content">
            <h3>{stats.lateCount}</h3>
            <p>Late Arrival</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon absent">
            <FiX />
          </div>
          <div className="stat-content">
            <h3>{stats.absentCount}</h3>
            <p>Absent Today</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon points">
            <FiAward />
          </div>
          <div className="stat-content">
            <h3>{stats.totalPoints}</h3>
            <p>Total Points</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="attendance-main">
        {employees.length === 0 ? (
          <div className="empty-container">
            <div className="empty-icon">
              <FiUser />
            </div>
            <h3>No Employees Found</h3>
            <p>No employee accounts have been created yet.</p>
          </div>
        ) : (
          <div className="attendance-grid">
            {employees.map((employee, index) => (
              <div 
                key={employee.id} 
                className={`employee-card ${employee.todayMarked ? 'marked' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-header">
                  <div className="employee-avatar">
                    {employee.name.charAt(0)}
                  </div>
                  <div className="employee-info">
                    <h4>{employee.name}</h4>
                    <p>{employee.department}</p>
                  </div>
                  <div className="attendance-badge">
                    <span className={`status-badge ${employee.status === 'Not Marked' ? 'not-marked' : employee.status.toLowerCase()}`}>
                      {employee.status}
                    </span>
                  </div>
                </div>

                <div className="card-stats">
                  <div className="stat-item">
                    <div className="stat-label">Attendance</div>
                    <div className="stat-value">
                      <FiActivity className="stat-icon-small" />
                      {employee.attendance}%
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Points</div>
                    <div className="stat-value points-value" style={{ color: getPointsColor(employee.points) }}>
                      {getPointsIcon(employee.points)}
                      {employee.points}
                    </div>
                  </div>
                </div>

                <div className="card-actions">
                  <button 
                    className={`action-btn present-btn ${employee.todayMarked ? 'disabled' : ''}`}
                    onClick={() => markAttendance(employee.id, 'Present')}
                    disabled={employee.todayMarked}
                  >
                    <FiCheck />
                    <span>Present (+5)</span>
                  </button>
                  <button 
                    className={`action-btn late-btn ${employee.todayMarked ? 'disabled' : ''}`}
                    onClick={() => markAttendance(employee.id, 'Late')}
                    disabled={employee.todayMarked}
                  >
                    <FiClock />
                    <span>Late (+3)</span>
                  </button>
                  <button 
                    className={`action-btn absent-btn ${employee.todayMarked ? 'disabled' : ''}`}
                    onClick={() => markAttendance(employee.id, 'Absent')}
                    disabled={employee.todayMarked}
                  >
                    <FiX />
                    <span>Absent (-2)</span>
                  </button>
                </div>

                {employee.todayMarked && (
                  <div className="marked-indicator">
                    <FiCheck />
                    <span>Marked for today</span>
                  </div>
                )}

                {employee.lastUpdated && (
                  <div className="last-updated">
                    <FiClock />
                    <span>Updated: {employee.lastUpdated}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

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
