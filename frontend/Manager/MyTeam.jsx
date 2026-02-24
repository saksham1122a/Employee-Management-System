import React, { useState, useEffect } from 'react';
import { FiUsers, FiEdit, FiBell, FiSearch } from 'react-icons/fi';
import './MyTeam.css';

const MyTeam = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      console.log('🎯 Fetching employees from backend...');
      setError(null);
      
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setError('Please login to view employees. Redirecting to login page...');
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
        console.log('✅ Employees fetched from backend:', usersData);
        
        // Filter to show only employees (not admins/managers)
        const employeeUsers = usersData.filter(user => user.role === 'employee');
        
        // Format data for display
        const formattedEmployees = employeeUsers.map(user => ({
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          department: user.department || 'General',
          status: user.status || 'Active',
          attendance: user.attendance?.percentage || '100%',
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

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="my-team-container">
      <div className="card">
        <div className="card-header">
          <h3>My Team</h3>
          <div className="card-actions">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="table-container">
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
              <FiUsers className="empty-icon" />
              <h3>No Employees Found</h3>
              <p>No employee accounts have been created yet.</p>
              <p>Please contact your administrator to add employee accounts.</p>
            </div>
          ) : (
            <table className="employees-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Attendance</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(employee => (
                  <tr key={employee.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">{employee.name.charAt(0)}</div>
                        <div>
                          <span className="employee-name">{employee.name}</span>
                          <span className="employee-email">{employee.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="department-badge">{employee.department}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${employee.status.toLowerCase()}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td>
                      <span className="attendance-badge">{employee.attendance}</span>
                    </td>
                    <td>{employee.joinDate}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" title="View Details">
                          <FiEdit />
                        </button>
                        <button className="btn-icon" title="Send Message">
                          <FiBell />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTeam;