import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUser, FiCheckCircle, FiX, FiRefreshCw, FiPaperclip, FiDownload, FiEye } from 'react-icons/fi';
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
        setLeaveRequests(data);
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
            <div className="empty-state">
              <FiUser className="empty-icon" />
              <h3>No Leave Requests Found</h3>
              <p>No employees have submitted leave requests yet.</p>
            </div>
          ) : (
            leaveRequests.map(request => (
              <div key={request.id} className="leave-card">
                <div className="leave-info">
                  <div className="user-avatar" style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    border: '3px solid #fff',
                    flexShrink: 0
                  }}>
                    {request.employeeName?.charAt(0).toUpperCase() || 'E'}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: '600' }}>
                      {request.employeeName || 'Unknown Employee'}
                    </h4>
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
                            {request.attachment.toLowerCase().match(/\.(jpg|jpeg|png|gif|html)$/i) && (
                              <button
                                className="btn-view-attachment"
                                onClick={() => window.open(`http://localhost:5000/uploads/${request.attachment}`, '_blank')}
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
                                link.href = `http://localhost:5000/uploads/${request.attachment}`;
                                link.download = request.attachment;
                                link.click();
                              }}
                              title="Download attachment"
                            >
                              <FiDownload />
                              Download
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
                  {request.status === 'pending' && (
                    <div className="leave-actions">
                      <button 
                        className="btn-small btn-success" 
                        onClick={() => handleLeaveAction(request.id, 'approved')}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn-small btn-danger" 
                        onClick={() => handleLeaveAction(request.id, 'rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  )}
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