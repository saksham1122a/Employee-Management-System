import React, { useState, useEffect } from 'react';
import { FiCalendar, FiCheckCircle, FiUser, FiTrendingUp, FiTrendingDown, FiX, FiCheck } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Attendance.css';

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      console.log('🎯 Fetching employees for Attendance from backend...');
      setError(null);
      
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setError('Please login to view attendance. Redirecting to login page...');
        setLoading(false);
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/auth/employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const usersData = await response.json();
        console.log('✅ Employees fetched for Attendance:', usersData);
        
        // Format data for attendance display with points system
        const formattedEmployees = usersData.map(user => ({
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          department: user.department || 'General',
          status: 'Not Marked', // Default status for today
          points: user.attendance?.points || 0, // Start from 0
          attendance: user.attendance?.percentage || 0, // Attendance percentage
          lastUpdated: user.attendance?.lastUpdated || null,
          todayMarked: false, // Track if today's attendance is marked
          joinDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '2024-01-01'
        }));
        
        setEmployees(formattedEmployees);
        setLoading(false);
      } else if (response.status === 401) {
        console.error('Token expired or invalid');
        setError('Your session has expired. Please login again.');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        setLoading(false);
      } else {
        console.error('Failed to fetch employees from backend');
        setError('Failed to load employees from backend');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  const markAttendance = async (employeeId, status) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error('Please login to mark attendance', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      // Check if attendance for today is already marked
      const employee = employees.find(emp => emp.id === employeeId);
      if (employee?.todayMarked) {
        toast.error('Attendance for today has already been marked for this employee.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/attendance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          employeeId: employeeId,
          status: status
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Attendance updated:', data);
        
        // Update local state with new attendance data
        setEmployees(prev => prev.map(emp => 
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
        ));

        // Show success message with points change
        const pointsChange = data.employee.attendance.todayPoints;
        const pointsMessage = pointsChange > 0 
          ? `+${pointsChange} points added!` 
          : `${pointsChange} points deducted.`;
        
        toast.success(`Attendance marked as ${status}. ${pointsMessage}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update attendance', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('Network error. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      alert('Network error. Please try again.');
    }
  };

  const markAllPresent = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error('Please login to mark attendance', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      // Filter employees who haven't been marked today
      const unmarkedEmployees = employees.filter(emp => !emp.todayMarked);
      
      if (unmarkedEmployees.length === 0) {
        toast.info('All employees have already been marked for today.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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
            const data = await response.json();
            setEmployees(prev => prev.map(emp => 
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
            ));
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      toast.success(`Marked ${successCount} employees as Present. ${errorCount > 0 ? `${errorCount} failed.` : ''}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Error marking all present:', error);
      alert('Network error. Please try again.');
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

  return (
    <div className="attendance-container">
      <div className="card">
        <div className="card-header">
          <h3>Attendance Management</h3>
          <button className="btn-primary" onClick={markAllPresent}>
            <FiCheckCircle /> Mark All Present
          </button>
        </div>
        <div className="attendance-grid">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading employees...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="empty-state">
              <FiUser className="empty-icon" />
              <h3>No Employees Found</h3>
              <p>No employee accounts have been created yet.</p>
              <p>Please contact your administrator to add employee accounts.</p>
            </div>
          ) : (
            employees.map(employee => (
              <div key={employee.id} className="attendance-card">
                <div className="attendance-header">
                  <div className="user-avatar">{employee.name.charAt(0)}</div>
                  <div>
                    <h4>{employee.name}</h4>
                    <p>{employee.department}</p>
                  </div>
                </div>
                <div className="attendance-status">
                  <span className={`status-badge ${employee.status.toLowerCase()}`}>
                    {employee.status}
                  </span>
                  <span className="attendance-percentage">{employee.attendance}%</span>
                </div>
                <div className="attendance-points">
                  <div className="points-display">
                    {getPointsIcon(employee.points)}
                    <span className="points-value" style={{ color: getPointsColor(employee.points) }}>
                      {employee.points} pts
                    </span>
                  </div>
                  {employee.lastUpdated && (
                    <span className="last-updated">Updated: {employee.lastUpdated}</span>
                  )}
                </div>
                <div className="attendance-actions">
                  <button 
                    className={`btn-small ${employee.todayMarked ? 'btn-disabled' : 'btn-success'}`} 
                    onClick={() => markAttendance(employee.id, 'Present')}
                    disabled={employee.todayMarked}
                  >
                    Present (+5)
                  </button>
                  <button 
                    className={`btn-small ${employee.todayMarked ? 'btn-disabled' : 'btn-warning'}`} 
                    onClick={() => markAttendance(employee.id, 'Late')}
                    disabled={employee.todayMarked}
                  >
                    Late (+3)
                  </button>
                  <button 
                    className={`btn-small ${employee.todayMarked ? 'btn-disabled' : 'btn-danger'}`} 
                    onClick={() => markAttendance(employee.id, 'Absent')}
                    disabled={employee.todayMarked}
                  >
                    Absent (-2)
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;