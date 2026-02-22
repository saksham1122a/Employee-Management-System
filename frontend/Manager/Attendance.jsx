import React, { useState, useEffect } from 'react';
import { FiCalendar, FiCheckCircle, FiUser } from 'react-icons/fi';
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
        
        // Format the data for attendance display
        const formattedEmployees = usersData.map(user => ({
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          department: user.department || 'General',
          status: 'Present', // Default status for today
          attendance: user.attendance || '95%', // Default attendance percentage
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

  const markAttendance = (employeeId, status) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId ? { ...emp, status } : emp
    ));
  };

  const markAllPresent = () => {
    setEmployees(prev => prev.map(emp => ({ ...emp, status: 'Present' })));
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
                  <span className="attendance-percentage">{employee.attendance}</span>
                </div>
                <div className="attendance-actions">
                  <button 
                    className="btn-small btn-success" 
                    onClick={() => markAttendance(employee.id, 'Present')}
                  >
                    Present
                  </button>
                  <button 
                    className="btn-small btn-warning" 
                    onClick={() => markAttendance(employee.id, 'Late')}
                  >
                    Late
                  </button>
                  <button 
                    className="btn-small btn-danger" 
                    onClick={() => markAttendance(employee.id, 'Absent')}
                  >
                    Absent
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