import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUser, FiCheckCircle, FiX, FiRefreshCw, FiPaperclip, FiDownload, FiEye, FiTrash2 } from 'react-icons/fi';
import './LeaveRequest.css';

const LeaveRequest = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all leave requests from backend
  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError('Please login to view leave requests');
        setLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/auth/leave/requests/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Raw leave requests data:', data);
        
        // Enhanced data processing to ensure employee names and images are available
        const enhancedData = await Promise.all(data.map(async (request) => {
          try {
            // First, try to get employee details if we have employeeId or employee field
            if (request.employeeId || request.employee) {
              const employeeData = await fetchEmployeeDetails(request.employeeId || request.employee);
              return {
                ...request,
                employeeName: employeeData.name || employeeData.email || 'Unknown Employee',
                employeeImage: employeeData.profileImage || employeeData.image || null,
                employeeEmail: employeeData.email,
                attachmentUrl: request.attachment ? `http://localhost:5000/uploads/${request.attachment}` : null
              };
            } else {
              // Fallback: try to extract name from request data
              const name = request.employeeName || request.name || request.employee?.name || 'Unknown Employee';
              return {
                ...request,
                employeeName: name,
                employeeEmail: request.employeeEmail || request.employee?.email || '',
                attachmentUrl: request.attachment ? `http://localhost:5000/uploads/${request.attachment}` : null
              };
            }
          } catch (error) {
            console.error('Error processing request:', error);
            return {
              ...request,
              employeeName: request.employeeName || request.name || 'Unknown Employee',
              attachmentUrl: request.attachment ? `http://localhost:5000/uploads/${request.attachment}` : null
            };
          }
        }));
        
        console.log('Enhanced leave requests data:', enhancedData);
        setLeaveRequests(enhancedData);
        setLoading(false);
      } else {
        setError('Failed to fetch leave requests');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  // Fetch employee details to get name and image
  const fetchEmployeeDetails = async (employeeIdOrEmail) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return { name: 'Unknown Employee', email: '', profileImage: null };
      
      // Try to find employee by ID first
      let response = await fetch(`http://localhost:5000/api/auth/employees/${employeeIdOrEmail}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // If not found by ID, try to find by email in all employees
        const allEmployeesResponse = await fetch('http://localhost:5000/api/auth/employees', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (allEmployeesResponse.ok) {
          const allEmployees = await allEmployeesResponse.json();
          const employee = allEmployees.find(emp => 
            emp.id === employeeIdOrEmail || 
            emp.email === employeeIdOrEmail ||
            emp._id === employeeIdOrEmail
          );
          
          if (employee) {
            return {
              name: employee.name || employee.email || 'Unknown Employee',
              email: employee.email || '',
              profileImage: employee.profileImage || employee.image || null
            };
          }
        }
      } else {
        const employee = await response.json();
        return {
          name: employee.name || employee.email || 'Unknown Employee',
          email: employee.email || '',
          profileImage: employee.profileImage || employee.image || null
        };
      }
      
      return { name: 'Unknown Employee', email: '', profileImage: null };
    } catch (error) {
      console.error('Error fetching employee details:', error);
      return { name: 'Unknown Employee', email: '', profileImage: null };
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleLeaveAction = async (requestId, action) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        alert('Please login to perform this action');
        return;
      }
      
      const response = await fetch(`http://localhost:5000/api/auth/leave/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: action,
          approvedBy: sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).name : 'Manager'
        })
      });
      
      if (response.ok) {
        // Update local state
        setLeaveRequests(prev => prev.map(req => 
          req.id === requestId ? { ...req, status: action } : req
        ));
      } else {
        alert('Failed to update leave request');
      }
    } catch (error) {
      console.error('Error updating leave request:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        alert('Please login to perform this action');
        return;
      }

      // Confirm deletion with better UI
      const confirmed = window.confirm(
        'Are you sure you want to delete this leave request?\n\n' +
        'This action cannot be undone and will permanently remove the request from the system.'
      );
      
      if (!confirmed) {
        return;
      }

      console.log('Attempting to delete request:', requestId);
      console.log('Using token:', token ? 'Token exists' : 'No token found');

      const response = await fetch(`http://localhost:5000/api/auth/leave/requests/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response ok:', response.ok);

      if (response.ok) {
        // Remove from local state immediately
        setLeaveRequests(prev => prev.filter(req => req.id !== requestId));
        
        // Show success message
        alert('✅ Leave request deleted successfully!');
      } else {
        // Try to get error details
        let errorMessage = 'Failed to delete leave request';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error('Backend error:', errorData);
        } catch (e) {
          console.error('Could not parse error response:', e);
          errorMessage += ' (Server error)';
        }
        
        alert('❌ ' + errorMessage);
      }
    } catch (error) {
      console.error('Error deleting leave request:', error);
      alert('❌ Network error. Please check your connection and try again.');
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const pendingRequests = leaveRequests.filter(req => req.status === 'pending');
  const approvedRequests = leaveRequests.filter(req => req.status === 'approved');
  const rejectedRequests = leaveRequests.filter(req => req.status === 'rejected');

  return (
    <div className="leave-request-container">
      <div className="leave-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <div className="stat-info">
            <h3>{pendingRequests.length}</h3>
            <p>Pending Requests</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{approvedRequests.length}</h3>
            <p>Approved</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiX />
          </div>
          <div className="stat-info">
            <h3>{rejectedRequests.length}</h3>
            <p>Rejected</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Leave Requests</h3>
          <div className="card-actions">
            <button className="btn-primary" onClick={fetchLeaveRequests}>
              <FiRefreshCw /> Refresh
            </button>
            <button className="btn-primary">
              <FiCalendar /> View Calendar
            </button>
          </div>
        </div>
        <div className="leaves-list">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading leave requests...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button className="btn-primary" onClick={fetchLeaveRequests}>
                <FiRefreshCw /> Retry
              </button>
            </div>
          ) : leaveRequests.length === 0 ? (
            <div className="no-requests-state">
              <p>No leave requests found.</p>
            </div>
          ) : (
            leaveRequests.map(request => (
              <div key={request.id} className="leave-request">
                <div className="leave-request-header">
                  <div className="employee-image" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: request.employeeImage ? '0' : '20px',
                    fontWeight: 'bold',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    border: '3px solid #fff',
                    flexShrink: 0,
                    position: 'relative'
                  }}>
                    {!request.employeeImage && (request.employeeName?.charAt(0).toUpperCase() || 'E')}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: '600' }}>
                      {request.employeeName || request.employeeEmail || 'Unknown Employee'}
                    </h4>
                    {request.employeeEmail && request.employeeName && (
                      <p style={{ margin: '0 0 0.5rem 0', color: '#718096', fontSize: '0.85rem' }}>
                        {request.employeeEmail}
                      </p>
                    )}
                    <p className="leave-type" style={{ margin: '0.2rem 0', color: '#667eea', fontWeight: '500' }}>
                      {request.type}
                    </p>
                    <p className="leave-dates" style={{ margin: '0.2rem 0', color: '#2d3748', fontWeight: '600' }}>
                      {request.startDate} - {request.endDate}
                    </p>
                    <p className="leave-reason" style={{ margin: '0.2rem 0', color: '#718096', fontStyle: 'italic' }}>
                      {request.reason}
                    </p>
                    {request.attachment && (
                      <div className="attachment-section">
                        <div className="attachment-item">
                          <div className="attachment-filename">
                            <FiPaperclip className="attachment-icon" />
                            <span>{request.attachment}</span>
                          </div>
                          <div className="attachment-actions">
                            {request.attachment.toLowerCase().match(/\.(jpg|jpeg|png|gif|html|pdf|doc|docx)$/i) && (
                              <button
                                className="btn-view-attachment"
                                onClick={() => window.open(request.attachmentUrl || `http://localhost:5000/uploads/${request.attachment}`, '_blank')}
                                title="View attachment"
                              >
                                <FiEye />
                                View
                              </button>
                            )}
                            <button
                              className="btn-download-attachment"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = request.attachmentUrl || `http://localhost:5000/uploads/${request.attachment}`;
                                link.download = request.attachment;
                                link.click();
                              }}
                              title="Download attachment"
                            >
                              <FiDownload />
                              Download
                            </button>
                            <button
                              className="btn-delete-attachment"
                              onClick={() => handleDeleteRequest(request.id)}
                              title="Delete request"
                            >
                              <FiTrash2 />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <p className="leave-applied" style={{ margin: '0.2rem 0', color: '#667eea', fontSize: '0.85rem', fontWeight: '500' }}>
                      Applied on: {request.appliedOn}
                    </p>
                    {request.status !== 'pending' && (
                      <p className="leave-approved-by" style={{ 
                        margin: '0.2rem 0', 
                        color: request.status === 'approved' ? '#48bb78' : '#f56565', 
                        fontSize: '0.85rem', 
                        fontWeight: '500' 
                      }}>
                        {request.status === 'approved' ? 'Approved by' : 'Rejected by'}: {request.approvedBy}
                      </p>
                    )}
                  </div>
                </div>
                <div className="leave-status">
                  <span className={`status-badge ${request.status}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                  <div className="leave-actions">
                    {request.status === 'pending' && (
                      <button 
                        className="btn-small btn-success" 
                        onClick={() => handleLeaveAction(request.id, 'approved')}
                      >
                        Approve
                      </button>
                    )}
                    {request.status === 'pending' && (
                      <button 
                        className="btn-small btn-danger" 
                        onClick={() => handleLeaveAction(request.id, 'rejected')}
                      >
                        Reject
                      </button>
                    )}
                    <button 
                      className="btn-small btn-delete"
                      onClick={() => handleDeleteRequest(request.id)}
                      title="Delete request"
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;