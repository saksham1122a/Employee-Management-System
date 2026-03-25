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
  const [refreshing, setRefreshing] = useState(false);

  // Initialize component and fetch real-time data
  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);
    
    // Check localStorage first for today's data
    const today = new Date().toLocaleDateString();
    const storedData = localStorage.getItem('attendanceData');
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        console.log('🔍 Found stored data:', data);
        
        if (data.date === today) {
          console.log('✅ Loading today\'s data from localStorage');
          setEmployees(data.employees || []);
          setStats(data.stats || {
            presentCount: 0,
            lateCount: 0,
            absentCount: 0,
            notMarkedCount: 0,
            totalPoints: 0
          });
          setIsLockedForDay(data.isLocked || false);
          setLoading(false);
          return;
        } else {
          console.log('🗑️ Stored data is from different date, clearing it');
          localStorage.removeItem('attendanceData');
        }
      } catch (error) {
        console.error('❌ Error parsing stored data:', error);
        localStorage.removeItem('attendanceData');
      }
    }
    
    // Fetch fresh data from backend
    fetchEmployeesWithAttendance();
  }, []);

  // Calculate stats whenever employees change
  useEffect(() => {
    console.log('🔄 useEffect triggered - employees changed');
    console.log('🔄 useEffect triggered - employees length:', employees.length);
    calculateStats();
  }, [employees]);

  // Save to localStorage whenever important data changes
  useEffect(() => {
    if (employees.length > 0) {
      saveToLocalStorage();
    }
  }, [employees, stats, isLockedForDay]);

  // Check if all employees are marked and update lock status
  useEffect(() => {
    if (employees.length > 0) {
      const allMarked = employees.every(emp => emp.todayMarked);
      if (allMarked && !isLockedForDay) {
        setIsLockedForDay(true);
        toast.success('🎉 All employees have been marked! Attendance is now locked for today.');
      }
    }
  }, [employees]);

  const fetchEmployeesWithAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError('Please login to view attendance');
        setLoading(false);
        return;
      }
      
      console.log('Fetching employees with attendance data...');
      
      // Fetch employees first
      const employeesResponse = await fetch('http://localhost:5000/api/auth/employees', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!employeesResponse.ok) {
        throw new Error('Failed to fetch employees');
      }
      
      const usersData = await employeesResponse.json();
      console.log('Employees fetched:', usersData);
      
      // Format employees data
      let formattedEmployees = usersData.map(user => ({
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
      
      // Fetch today's attendance for each employee
      const attendancePromises = formattedEmployees.map(async (employee) => {
        try {
          const attendanceResponse = await fetch(`http://localhost:5000/api/auth/attendance/${employee.id}/today`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (attendanceResponse.ok) {
            const attendanceData = await attendanceResponse.json();
            console.log(`Attendance data for ${employee.name}:`, attendanceData);
            
            // Check if attendance exists (backend might return different structure)
            if (attendanceData && (attendanceData.marked || attendanceData.status || attendanceData.currentAttendance)) {
              const currentAttendance = attendanceData.currentAttendance || attendanceData;
              return {
                ...employee,
                todayMarked: true,
                status: currentAttendance.status || attendanceData.status || 'Marked',
                points: currentAttendance.points || attendanceData.points || employee.points,
                attendance: currentAttendance.percentage || attendanceData.percentage || employee.attendance,
                lastUpdated: currentAttendance.timestamp || currentAttendance.lastUpdated || employee.lastUpdated
              };
            }
          } else if (attendanceResponse.status === 404) {
            // 404 means no attendance record exists, which is fine
            console.log(`No attendance record found for ${employee.name} today`);
          }
        } catch (error) {
          console.log(`Could not fetch attendance for ${employee.name}:`, error);
        }
        return employee;
      });
      
      // Wait for all attendance data to be fetched
      const employeesWithAttendance = await Promise.all(attendancePromises);
      console.log('Final employees with attendance:', employeesWithAttendance);
      
      // Save to localStorage after fetching
      const today = new Date().toLocaleDateString();
      const newStats = {
        presentCount: employeesWithAttendance.filter(emp => emp.todayMarked && emp.status === 'Present').length,
        lateCount: employeesWithAttendance.filter(emp => emp.todayMarked && emp.status === 'Late').length,
        absentCount: employeesWithAttendance.filter(emp => emp.todayMarked && emp.status === 'Absent').length,
        notMarkedCount: employeesWithAttendance.filter(emp => !emp.todayMarked).length,
        totalPoints: employeesWithAttendance.reduce((sum, emp) => sum + emp.points, 0)
      };
      
      const dataToSave = {
        date: today,
        employees: employeesWithAttendance,
        stats: newStats,
        isLocked: employeesWithAttendance.every(emp => emp.todayMarked)
      };
      
      localStorage.setItem('attendanceData', JSON.stringify(dataToSave));
      console.log('💾 Fresh data saved to localStorage:', dataToSave);
      
      setEmployees(employeesWithAttendance);
      setStats(newStats);
      setIsLockedForDay(employeesWithAttendance.every(emp => emp.todayMarked));
      setLoading(false);
      
    } catch (error) {
      console.error('Error fetching employees with attendance:', error);
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  const calculateStats = () => {
    console.log('🔢 calculateStats called with employees:', employees);
    console.log('🔢 employees length:', employees.length);
    
    if (employees.length === 0) {
      console.log('⚠️ No employees to calculate stats for');
      return;
    }
    
    const presentCount = employees.filter(emp => emp.todayMarked && emp.status === 'Present').length;
    const lateCount = employees.filter(emp => emp.todayMarked && emp.status === 'Late').length;
    const absentCount = employees.filter(emp => emp.todayMarked && emp.status === 'Absent').length;
    const notMarkedCount = employees.filter(emp => !emp.todayMarked).length;
    const totalPoints = employees.reduce((sum, emp) => sum + emp.points, 0);
    
    const newStats = { presentCount, lateCount, absentCount, notMarkedCount, totalPoints };
    console.log('📊 Stats calculated:', newStats);
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
    console.log('💾 Data saved to localStorage:', data);
  };

  const forceRefreshData = async () => {
    console.log('🔄 Forcing fresh data fetch from backend...');
    setRefreshing(true);
    
    // Clear localStorage temporarily to force fresh fetch
    localStorage.removeItem('attendanceData');
    
    await fetchEmployeesWithAttendance();
    setRefreshing(false);
    toast.success('Data synced with server successfully!');
  };

  const clearStaleData = async () => {
    console.log('🗑️ Clearing stale localStorage data...');
    setRefreshing(true);
    
    // Clear all attendance-related localStorage data
    localStorage.removeItem('attendanceData');
    
    // Fetch fresh data from backend
    await fetchEmployeesWithAttendance();
    setRefreshing(false);
    toast.success('Stale data cleared! Synced with server.');
  };

  const markPresent = async (employeeId) => {
    await markAttendance(employeeId, 'Present');
  };

  const markAbsent = async (employeeId) => {
    await markAttendance(employeeId, 'Absent');
  };

  const markLate = async (employeeId) => {
    await markAttendance(employeeId, 'Late');
  };

  const markAttendance = async (employeeId, status) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error('Please login to mark attendance');
        return;
      }

      // Find employee
      const employee = employees.find(emp => emp.id === employeeId);
      if (!employee) {
        toast.error('Employee not found');
        return;
      }

      if (employee.todayMarked) {
        toast.error(`Attendance for ${employee.name} has already been marked today as ${employee.status}.`);
        return;
      }

      console.log(`Marking ${employee.name} as ${status}`);
      
      // Show loading state
      setLoading(true);
      
      // Call API
      console.log('🔍 Sending API request:', { employeeId, status });
      console.log('🔍 Employee object:', employee);
      
      // Try the API call
      const response = await fetch('http://localhost:5000/api/auth/attendance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ employeeId, status })
      });

      console.log('🔍 API Response status:', response.status);
      console.log('🔍 API Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Attendance marked successfully:', data);
        
        const pointsChange = data.employee.attendance.todayPoints;
        const pointsMessage = pointsChange > 0 ? `+${pointsChange} points added!` : `${pointsChange} points deducted.`;
        
        toast.success(`✅ ${employee.name} marked as ${status}. ${pointsMessage}`);
        
        // Update employee state directly from successful response instead of calling failing GET endpoint
        console.log('🔄 Updating employee state from successful response...');
        setEmployees(prevEmployees => {
          const updatedEmployees = prevEmployees.map(emp => 
            emp.id === employeeId 
              ? { 
                  ...emp, 
                  todayMarked: true,
                  status: status,
                  points: data.employee.attendance.points || emp.points,
                  attendance: data.employee.attendance.percentage || emp.attendance,
                  lastUpdated: data.employee.attendance.lastUpdated || new Date().toISOString()
                } 
              : emp
          );
          
          console.log('📊 Updated employee from successful response:', updatedEmployees);
          return updatedEmployees;
        });
        
        setLoading(false);
        return;
        
      } else {
        // Get detailed error information
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText };
        }
        
        console.error('❌ API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData,
          requestBody: { employeeId, status },
          employeeId: employeeId,
          employeeIdType: typeof employeeId
        });
        
        // Check if the error is because attendance is already marked
        if (errorData.message && errorData.message.includes('already been marked')) {
          console.log('🔄 Backend says attendance already marked, using data from error response...');
          const currentAttendance = errorData.currentAttendance;
          
          if (currentAttendance) {
            // Update the employee state with data from the error response
            setEmployees(prevEmployees => {
              const updatedEmployees = prevEmployees.map(emp => 
                emp.id === employeeId 
                  ? { 
                      ...emp, 
                      todayMarked: true,
                      status: currentAttendance.status || 'Marked',
                      points: currentAttendance.points || emp.points,
                      lastUpdated: currentAttendance.timestamp || emp.lastUpdated
                    } 
                  : emp
              );
              
              console.log('📊 Updated employee from error response:', updatedEmployees);
              return updatedEmployees;
            });
            
            toast.info(`${employee.name} is already marked as ${currentAttendance.status}.`);
            setLoading(false);
            return;
          }
        }
        
        // If it's a 400 error, try with different ID format
        if (response.status === 400) {
          console.log('🔄 Trying with string employee ID...');
          const retryResponse = await fetch('http://localhost:5000/api/auth/attendance', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ employeeId: String(employeeId), status })
          });
          
          if (retryResponse.ok) {
            const data = await retryResponse.json();
            console.log('Attendance marked successfully with string ID:', data);
            
            const pointsChange = data.employee.attendance.todayPoints;
            const pointsMessage = pointsChange > 0 ? `+${pointsChange} points added!` : `${pointsChange} points deducted.`;
            
            toast.success(`✅ ${employee.name} marked as ${status}. ${pointsMessage}`);
            await fetchEmployeesWithAttendance();
            return;
          } else {
            const retryError = await retryResponse.text();
            console.error('❌ Retry also failed:', retryError);
          }
        }
        
        toast.error(errorData.message || `Failed to update attendance (${response.status}: ${response.statusText})`);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Network error. Please try again.');
      setLoading(false);
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
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Marked ${successCount} employees as Present. ${errorCount > 0 ? `${errorCount} failed.` : ''}`);
        // Refresh data to get updated attendance
        setTimeout(() => {
          fetchEmployeesWithAttendance();
        }, 1000);
      } else {
        toast.error('Failed to mark any employees. Please try again.');
      }
    } catch (error) {
      console.error('Error marking all present:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchEmployeesWithAttendance();
    setRefreshing(false);
    toast.success('Data refreshed successfully!');
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
          <button onClick={fetchEmployeesWithAttendance} className="retry-btn">
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
              className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
              onClick={clearStaleData}
              disabled={refreshing}
            >
              <FiActivity className={refreshing ? 'spin' : ''} />
              {refreshing ? 'Syncing...' : 'Sync with Server'}
            </button>
            <button 
              className={`refresh-btn ${refreshing ? 'spinning' : ''}`}
              onClick={forceRefreshData}
              disabled={refreshing}
            >
              <FiActivity className={refreshing ? 'spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Force Refresh'}
            </button>
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
                {/* Lock Overlay */}
                {employee.todayMarked && (
                  <div className="lock-overlay">
                    <FiLock className="lock-icon-overlay" />
                    <span>Attendance Marked</span>
                  </div>
                )}

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
                    onClick={() => markPresent(employee.id)}
                    disabled={employee.todayMarked}
                  >
                    <FiCheck />
                    Present
                  </button>
                  <button 
                    className={`action-btn late-btn ${employee.todayMarked ? 'disabled' : ''}`}
                    onClick={() => markLate(employee.id)}
                    disabled={employee.todayMarked}
                  >
                    <FiClock />
                    Late
                  </button>
                  <button 
                    className={`action-btn absent-btn ${employee.todayMarked ? 'disabled' : ''}`}
                    onClick={() => markAbsent(employee.id)}
                    disabled={employee.todayMarked}
                  >
                    <FiX />
                    Absent
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
