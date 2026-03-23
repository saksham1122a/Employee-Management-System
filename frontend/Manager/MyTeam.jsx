import React, { useState, useEffect } from 'react';
import { FiUsers, FiEdit, FiBell, FiSearch, FiEye, FiMessageSquare, FiUser, FiMail, FiCalendar, FiBriefcase, FiSettings } from 'react-icons/fi';
import './MyTeam.css';
import Footer from '../src/Components/Footer';

const MyTeam = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    department: '',
    status: 'Active'
  });
  const [updatingEmployee, setUpdatingEmployee] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      console.log('🎯 Fetching employees data...');
      setError(null);
      
      // First, try to load from localStorage
      const storedEmployees = localStorage.getItem('employeesData');
      if (storedEmployees) {
        try {
          const parsedEmployees = JSON.parse(storedEmployees);
          console.log('✅ Employees loaded from localStorage:', parsedEmployees);
          setEmployees(parsedEmployees);
          setLoading(false);
          return;
        } catch (error) {
          console.error('Error parsing stored employees:', error);
          // Continue with backend fetch if localStorage is corrupted
        }
      }
      
      // If no data in localStorage or corrupted, fetch from backend
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
        // Save to localStorage for persistence
        localStorage.setItem('employeesData', JSON.stringify(formattedEmployees));
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

  // Handler functions for action buttons
  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
  };

  const handleSendMessage = (employee) => {
    setSelectedEmployee(employee);
    setShowMessageModal(true);
    setMessageSubject('');
    setMessageText('');
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedEmployee(null);
  };

  const handleCloseMessageModal = () => {
    setShowMessageModal(false);
    setSelectedEmployee(null);
    setMessageSubject('');
    setMessageText('');
  };

  const handleSendEmployeeMessage = async (e) => {
    e.preventDefault();
    
    if (!messageSubject.trim() || !messageText.trim()) {
      alert('Please fill in both subject and message fields.');
      return;
    }

    setSendingMessage(true);

    try {
      // Get existing messages from localStorage
      const existingMessages = localStorage.getItem('adminMessages');
      let messages = [];
      
      if (existingMessages) {
        try {
          messages = JSON.parse(existingMessages);
        } catch (error) {
          console.error('Error loading existing messages:', error);
        }
      }

      // Create new message object
      const newMessage = {
        id: Date.now(),
        sender: sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).name : 'Manager',
        senderEmail: sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).email : 'manager@teambuddy.com',
        recipient: selectedEmployee.name,
        recipientEmail: selectedEmployee.email,
        subject: messageSubject,
        content: messageText,
        timestamp: new Date().toISOString(),
        isRead: false,
        isStarred: false,
        category: 'team',
        priority: 'normal',
        attachments: []
      };

      // Add new message at the beginning
      messages.unshift(newMessage);

      // Save back to localStorage
      localStorage.setItem('adminMessages', JSON.stringify(messages));

      // Show success message
      alert(`Message sent successfully to ${selectedEmployee.name}!`);

      // Close modal and reset form
      handleCloseMessageModal();

    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  // Edit functionality
  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setEditForm({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      status: employee.status
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedEmployee(null);
    setEditForm({
      name: '',
      email: '',
      department: '',
      status: 'Active'
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    
    if (!editForm.name.trim() || !editForm.email.trim()) {
      alert('Please fill in all required fields.');
      return;
    }

    setUpdatingEmployee(true);

    try {
      // Simulate API call to update employee
      // In a real app, this would be an actual API call
      const updatedEmployees = employees.map(emp => 
        emp.id === selectedEmployee.id 
          ? { ...emp, ...editForm }
          : emp
      );
      
      setEmployees(updatedEmployees);
      
      // Persist changes to localStorage
      localStorage.setItem('employeesData', JSON.stringify(updatedEmployees));
      
      // Show aesthetic success popup
      setSuccessMessage(`Employee ${editForm.name} has been updated successfully!`);
      setShowSuccessPopup(true);
      
      // Close modal and reset form
      handleCloseEditModal();

      // Auto-hide popup after 3 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);

    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Failed to update employee. Please try again.');
    } finally {
      setUpdatingEmployee(false);
    }
  };

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
                        <button 
                          className="btn-icon" 
                          title="View Details"
                          onClick={() => handleViewDetails(employee)}
                        >
                          <FiEye />
                        </button>
                        <button 
                          className="btn-icon" 
                          title="Edit Employee"
                          onClick={() => handleEditEmployee(employee)}
                        >
                          <FiEdit />
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

      {/* Employee Details Modal */}
      {showDetailsModal && selectedEmployee && (
        <div className="modal-overlay" onClick={handleCloseDetailsModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Employee Details</h3>
              <button className="modal-close" onClick={handleCloseDetailsModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="employee-details">
                <div className="detail-avatar">
                  {selectedEmployee.name.charAt(0)}
                </div>
                <div className="detail-info">
                  <h4>{selectedEmployee.name}</h4>
                  <p className="detail-email">{selectedEmployee.email}</p>
                </div>
              </div>
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-icon">
                    <FiBriefcase />
                  </div>
                  <div>
                    <label>Department</label>
                    <p>{selectedEmployee.department}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">
                    <FiUser />
                  </div>
                  <div>
                    <label>Status</label>
                    <p>{selectedEmployee.status}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">
                    <FiCalendar />
                  </div>
                  <div>
                    <label>Join Date</label>
                    <p>{selectedEmployee.joinDate}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-icon">
                    <FiEye />
                  </div>
                  <div>
                    <label>Attendance</label>
                    <p>{selectedEmployee.attendance}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseDetailsModal}>
                Close
              </button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  handleCloseDetailsModal();
                  handleSendMessage(selectedEmployee);
                }}
              >
                <FiMessageSquare /> Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedEmployee && (
        <div className="modal-overlay" onClick={handleCloseMessageModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Send Message to {selectedEmployee.name}</h3>
              <button className="modal-close" onClick={handleCloseMessageModal}>×</button>
            </div>
            <form onSubmit={handleSendEmployeeMessage}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                    placeholder="Enter message subject"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message here..."
                    rows="5"
                    required
                  ></textarea>
                </div>
                <div className="message-info">
                  <p><strong>To:</strong> {selectedEmployee.name} ({selectedEmployee.email})</p>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={handleCloseMessageModal}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={sendingMessage}
                >
                  {sendingMessage ? (
                    <>
                      <div className="btn-spinner"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiMessageSquare /> Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && selectedEmployee && (
        <div className="modal-overlay" onClick={handleCloseEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Employee: {selectedEmployee.name}</h3>
              <button className="modal-close" onClick={handleCloseEditModal}>×</button>
            </div>
            <form onSubmit={handleUpdateEmployee}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditFormChange}
                    placeholder="Enter employee name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditFormChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <select
                    id="department"
                    name="department"
                    value={editForm.department}
                    onChange={handleEditFormChange}
                    className="form-select"
                  >
                    <option value="General">General</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="IT">Information Technology</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={editForm.status}
                    onChange={handleEditFormChange}
                    className="form-select"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="edit-info">
                  <p><strong>Employee ID:</strong> {selectedEmployee.id}</p>
                  <p><strong>Join Date:</strong> {selectedEmployee.joinDate}</p>
                  <p><strong>Current Attendance:</strong> {selectedEmployee.attendance}</p>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={handleCloseEditModal}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={updatingEmployee}
                >
                  {updatingEmployee ? (
                    <>
                      <div className="btn-spinner"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiEdit /> Update Employee
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="success-icon">
              <div className="success-checkmark">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
            <div className="success-content">
              <h4>Success!</h4>
              <p>{successMessage}</p>
            </div>
            <button 
              className="success-close" 
              onClick={() => setShowSuccessPopup(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default MyTeam;